import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { CameraOff, CircleAlert, Keyboard } from 'lucide-react'
import CollectorHeader from '../../components/CollectorHeader.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import { findUnitByCode, findUnitByToken } from '../../lib/api.js'
import './Collector.css'

export default function ScanBag() {
  const navigate = useNavigate()
  const readerId = useId().replace(/:/g, '')
  const busyRef = useRef(false)
  const [cameraError, setCameraError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [manualOpen, setManualOpen] = useState(false)
  const [code, setCode] = useState('')
  const [looking, setLooking] = useState(false)

  useEffect(() => {
    const scanner = new Html5Qrcode(readerId, { verbose: false })
    let stopped = false
    let started = null

    async function handleDecoded(text) {
      if (busyRef.current) return
      busyRef.current = true
      try {
        const unit = await findUnitByToken(text)
        if (unit) {
          navigate('/collector/weigh', { state: { unit } })
          return
        }
        setNotice('This QR is not a Kitar bag. Keep scanning, or type the unit code.')
      } catch (error) {
        setNotice(`Could not check this code: ${error.message}`)
      }
      // Pause briefly so the same wrong code is not checked many times a second.
      setTimeout(() => {
        busyRef.current = false
      }, 1500)
    }

    started = scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: (w, h) => ({ width: Math.min(w, h) * 0.7, height: Math.min(w, h) * 0.7 }) },
        handleDecoded,
        () => {},
      )
      .then(() => {
        if (stopped) return scanner.stop()
      })
      .catch((error) => {
        if (stopped) return
        const message = String(error?.message ?? error)
        setCameraError(
          /permission|NotAllowed/i.test(message)
            ? 'Camera permission is off. Allow it in the browser settings, or type the unit code.'
            : 'The camera is not available here (phones need an https link). Type the unit code instead.',
        )
        setManualOpen(true)
      })

    return () => {
      stopped = true
      started?.finally(() => {
        if (scanner.isScanning) scanner.stop().catch(() => {})
      })
    }
  }, [readerId, navigate])

  async function handleManual(event) {
    event.preventDefault()
    if (!code.trim()) return
    setLooking(true)
    setNotice(null)
    try {
      const unit = await findUnitByCode(code)
      if (unit) navigate('/collector/weigh', { state: { unit } })
      else setNotice(`No unit called ${code.trim().toUpperCase()}. Check the code on the bag label.`)
    } catch (error) {
      setNotice(`Could not look up the code: ${error.message}`)
    } finally {
      setLooking(false)
    }
  }

  return (
    <>
      <CollectorHeader step={0} />
      <main className="screen collector-screen">
        <div className="collector-scan">
          <div id={readerId} className="collector-scan__reader" />
          {cameraError ? (
            <div className="collector-scan__notice">
              <CameraOff size={36} aria-hidden="true" />
              <p>{cameraError}</p>
            </div>
          ) : (
            <p className="collector-scan__hint">Point at the QR code on the bag</p>
          )}
        </div>

        {notice && (
          <div className="alert" role="alert">
            <CircleAlert size={18} aria-hidden="true" />
            <p>{notice}</p>
          </div>
        )}

        {manualOpen ? (
          <GlassCard>
            <form className="collector-manual" onSubmit={handleManual}>
              <label className="field">
                <span className="field__label">Unit code on the bag label</span>
                <span className="field__control">
                  <Keyboard size={18} className="field__icon" aria-hidden="true" />
                  <input
                    className="input mono collector-manual__input"
                    placeholder="SAMPLE-A-0101"
                    autoCapitalize="characters"
                    autoComplete="off"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </span>
              </label>
              <button type="submit" className="btn btn--primary btn--block" disabled={!code.trim() || looking}>
                {looking ? 'Checking…' : 'Continue'}
              </button>
            </form>
          </GlassCard>
        ) : (
          <button type="button" className="btn btn--secondary btn--block" onClick={() => setManualOpen(true)}>
            <Keyboard size={20} aria-hidden="true" /> Type unit code instead
          </button>
        )}
      </main>
    </>
  )
}
