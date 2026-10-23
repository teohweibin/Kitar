import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ban, Camera, CameraOff, ImageUp, MoonStar, RotateCcw } from 'lucide-react'
import TopBar from '../../components/TopBar.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import Chip, { BinDot } from '../../components/Chip.jsx'
import CategoryIcon from '../../components/CategoryIcon.jsx'
import { ErrorState } from '../../components/StateViews.jsx'
import PileResult from '../../components/PileResult.jsx'
import { useGuide } from '../../lib/useGuide.js'
import { binLabel } from '../../lib/guide.js'
import { classifyImage, classifyPile, loadModel, stopListening } from '../../lib/classify.js'
import { averageBrightness, DARK_PHOTO_THRESHOLD, MIN_CONFIDENCE } from '../../lib/scanScoring.js'
import './Scan.css'

// Pile mode keeps more pixels because each of its crops is a quarter of the photo.
const MAX_SIDE = { single: 512, pile: 768 }

// Draws any image source onto the canvas (scaled down) and returns its pixels' brightness.
function drawToCanvas(canvas, source, width, height, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(width, height))
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return averageBrightness(ctx.getImageData(0, 0, canvas.width, canvas.height).data)
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
}

// phase: starting → live → classifying → result; or denied / unsupported when there is no camera.
export default function Scan() {
  const { guide, categoriesById, status: guideStatus, error: guideError, retry } = useGuide()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const fileRef = useRef(null)
  const [phase, setPhase] = useState(() => (navigator.mediaDevices?.getUserMedia ? 'starting' : 'unsupported'))
  const [snapshot, setSnapshot] = useState(null)
  const [result, setResult] = useState(null)
  const [scanError, setScanError] = useState(null)
  const [download, setDownload] = useState(null)
  const [mode, setMode] = useState('single')
  const [pileIds, setPileIds] = useState([])
  const [pileStep, setPileStep] = useState(null)

  const itemsByName = useMemo(
    () => Object.fromEntries((guide?.items ?? []).map((item) => [item.name_en, item])),
    [guide],
  )
  const itemsById = useMemo(
    () => Object.fromEntries((guide?.items ?? []).map((item) => [item.id, item])),
    [guide],
  )

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  // Only sets state after the camera answers, so it can run straight from the mount effect.
  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setPhase('live')
    } catch (error) {
      setPhase(error.name === 'NotAllowedError' ? 'denied' : 'unsupported')
    }
  }, [])

  function scanAgain() {
    setSnapshot(null)
    setResult(null)
    setScanError(null)
    setPileIds([])
    setPileStep(null)
    setPhase(navigator.mediaDevices?.getUserMedia ? 'starting' : 'unsupported')
    openCamera()
  }

  useEffect(() => {
    // Start the camera and download the recognition model in the background.
    const onProgress = (fraction) => setDownload(fraction < 1 ? fraction : null)
    openCamera()
    loadModel(onProgress).then(() => setDownload(null)).catch(() => setDownload(null))
    return () => {
      stopListening(onProgress)
      stopCamera()
    }
  }, [openCamera, stopCamera])

  function switchMode(nextMode) {
    if (nextMode === mode || phase === 'classifying') return
    setMode(nextMode)
    if (phase === 'result') scanAgain()
  }

  async function analyse(source, width, height) {
    const canvas = canvasRef.current
    const brightness = drawToCanvas(canvas, source, width, height, MAX_SIDE[mode])
    setSnapshot(canvas.toDataURL('image/jpeg', 0.85))
    setScanError(null)
    if (brightness < DARK_PHOTO_THRESHOLD) {
      setResult({ dark: true })
      setPhase('result')
      return
    }
    setPhase('classifying')
    try {
      if (mode === 'pile') {
        const found = await classifyPile(canvas, (done, total) => setPileStep({ done, total }))
        setPileIds(found.map((f) => itemsByName[f.item]?.id).filter(Boolean))
        setResult({ pile: true })
      } else {
        const scores = await classifyImage(await canvasToBlob(canvas))
        setResult({ scores })
      }
    } catch (error) {
      setScanError(`Could not recognise the photo: ${error.message}`)
    }
    setPhase('result')
  }

  function capture() {
    const video = videoRef.current
    if (!video?.videoWidth) return
    analyse(video, video.videoWidth, video.videoHeight)
    stopCamera()
  }

  function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    stopCamera()
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      analyse(img, img.naturalWidth, img.naturalHeight)
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      setScanError('That file could not be opened as a photo.')
      setPhase('result')
    }
    img.src = url
  }

  // Best guide item if the model is confident enough and it is a waste item at all.
  const top = result?.scores?.[0]
  const best = top?.item && top.probability >= MIN_CONFIDENCE ? itemsByName[top.item] : null
  const bestCategory = best && categoriesById[best.category_id]
  const others = (result?.scores ?? [])
    .slice(1)
    .filter((s) => s.item && s.probability >= 0.1 && itemsByName[s.item])
    .slice(0, 2)
  const showViewfinder = phase === 'starting' || phase === 'live'

  return (
    <>
      <TopBar title="Scan" backTo="/resident/home" />
      <main className="screen scan">
        <div className="scan__modes" role="group" aria-label="What are you scanning?">
          {[
            ['single', 'One item'],
            ['pile', 'A pile'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`scan__mode${mode === value ? ' is-active' : ''}`}
              aria-pressed={mode === value}
              onClick={() => switchMode(value)}
              disabled={phase === 'classifying'}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === 'pile' && phase !== 'result' && (
          <p className="muted scan__tip">Spread the items out on a table so each one is visible.</p>
        )}

        <div className="scan__viewport">
          <video
            ref={videoRef}
            className="scan__video"
            playsInline
            muted
            hidden={!showViewfinder}
            aria-label="Camera preview"
          />
          {snapshot && !showViewfinder && <img src={snapshot} alt="Your photo" className="scan__video" />}
          <canvas ref={canvasRef} hidden />

          {(phase === 'denied' || phase === 'unsupported') && (
            <div className="scan__notice">
              <CameraOff size={32} aria-hidden="true" />
              <p className="scan__notice-title">
                {phase === 'denied' ? 'Camera permission is off' : 'Camera not available here'}
              </p>
              <p className="muted">
                {phase === 'denied'
                  ? 'Allow the camera in your browser settings (the icon next to the address bar), then try again. Or upload a photo.'
                  : 'Phones need a secure (https) link for the camera. You can still upload a photo.'}
              </p>
            </div>
          )}

          <span className="scan__corner scan__corner--tl" aria-hidden="true" />
          <span className="scan__corner scan__corner--tr" aria-hidden="true" />
          <span className="scan__corner scan__corner--bl" aria-hidden="true" />
          <span className="scan__corner scan__corner--br" aria-hidden="true" />

          {phase === 'starting' && <p className="scan__status">Starting camera…</p>}
          {phase === 'classifying' && (
            <div className="scan__status scan__status--busy">
              <span className="scan__ring" aria-hidden="true" />
              {download !== null
                ? `Downloading model… ${Math.round(download * 100)}%`
                : mode === 'pile' && pileStep
                  ? `Checking part ${pileStep.done} of ${pileStep.total}…`
                  : 'Recognising…'}
            </div>
          )}
        </div>

        {download !== null && phase !== 'classifying' && (
          <p className="muted scan__download">
            Preparing photo recognition (first time only)… {Math.round(download * 100)}%
          </p>
        )}

        <div aria-live="polite">
          {phase === 'result' && scanError && <ErrorState message={scanError} />}

          {phase === 'result' && result?.dark && (
            <GlassCard className="scan__result">
              <div className="scan__result-head">
                <MoonStar size={28} className="scan__dark-icon" aria-hidden="true" />
                <p className="scan__result-name">This photo is too dark</p>
              </div>
              <p className="muted">
                Turn on a light, or check that the camera is not covered or being used by another app (such as Zoom
                or Teams), then scan again.
              </p>
            </GlassCard>
          )}

          {phase === 'result' && result?.pile && (
            <PileResult
              found={pileIds.map((id) => itemsById[id]).filter(Boolean)}
              allItems={guide?.items ?? []}
              categoriesById={categoriesById}
              onRemove={(id) => setPileIds((ids) => ids.filter((x) => x !== id))}
              onAdd={(id) => setPileIds((ids) => (ids.includes(id) ? ids : [...ids, id]))}
            />
          )}

          {phase === 'result' && best && (
            <GlassCard hero className="scan__result">
              <div className="scan__result-head">
                <CategoryIcon categoryId={best.category_id} />
                <div>
                  <p className="scan__result-name">{best.name_en}</p>
                  <p className="muted">{best.name_ms}</p>
                </div>
              </div>
              {bestCategory ? (
                <Chip tone="bin" icon={<BinDot binColour={bestCategory.bin_colour} />}>
                  {binLabel(bestCategory.bin_colour)}
                </Chip>
              ) : (
                <Chip tone="danger" icon={<Ban />}>Not recyclable here</Chip>
              )}
              {best.prep_steps[0] && <p className="scan__step">First: {best.prep_steps[0]}</p>}
              <Link to={`/resident/guide?item=${best.id}`} className="scan__link">See full guide</Link>
              {others.length > 0 && (
                <p className="muted scan__others">
                  Could also be:{' '}
                  {others.map((s, i) => (
                    <span key={s.item}>
                      {i > 0 && ', '}
                      <Link to={`/resident/guide?item=${itemsByName[s.item].id}`}>{s.item}</Link>
                    </span>
                  ))}
                </p>
              )}
            </GlassCard>
          )}

          {phase === 'result' && result?.scores && !best && (
            <GlassCard className="scan__result">
              <p className="scan__result-name">We couldn&apos;t recognise this</p>
              <p className="muted">
                {top?.item
                  ? `It might be "${top.item}", but we're not sure. Try a closer photo with only the item in view.`
                  : "This doesn't look like a waste item. Try a closer photo with only the item in view."}
              </p>
            </GlassCard>
          )}
        </div>

        {guideStatus === 'error' && <ErrorState message={guideError.message} onRetry={retry} />}

        <div className="scan__actions">
          {phase === 'live' && (
            <button type="button" className="btn btn--primary btn--block" onClick={capture}>
              <Camera size={20} aria-hidden="true" /> Take photo
            </button>
          )}
          {(phase === 'result' || phase === 'denied' || phase === 'unsupported') && (
            <button type="button" className="btn btn--primary btn--block" onClick={scanAgain}>
              <RotateCcw size={20} aria-hidden="true" /> {phase === 'result' ? 'Scan again' : 'Try the camera again'}
            </button>
          )}
          <button
            type="button"
            className="btn btn--secondary btn--block"
            onClick={() => fileRef.current?.click()}
            disabled={phase === 'classifying'}
          >
            <ImageUp size={20} aria-hidden="true" /> Upload a photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          <Link to="/resident/guide" className="scan__manual">Not right? Choose manually</Link>
        </div>
      </main>
    </>
  )
}
