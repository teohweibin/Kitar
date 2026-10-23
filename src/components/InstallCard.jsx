import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import './InstallCard.css'

const VISITS_KEY = 'kitar.visits'
const DISMISSED_KEY = 'kitar.install.dismissed'

function readNumber(key) {
  try {
    return Number(localStorage.getItem(key)) || 0
  } catch {
    return 0
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // Storage blocked: the card simply shows again next time.
  }
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent)

// "Add Kitar to your home screen" card, from the second visit on (design.md → States).
export default function InstallCard() {
  const [prompt, setPrompt] = useState(null)
  const [hidden, setHidden] = useState(() => isStandalone() || readNumber(DISMISSED_KEY) > 0)
  const [visits] = useState(() => {
    const next = readNumber(VISITS_KEY) + 1
    write(VISITS_KEY, next)
    return next
  })

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault()
      setPrompt(event)
    }
    const onInstalled = () => setHidden(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const ios = isIos()
  if (hidden || visits < 2 || (!prompt && !ios)) return null

  function dismiss() {
    write(DISMISSED_KEY, 1)
    setHidden(true)
  }

  async function install() {
    prompt.prompt()
    await prompt.userChoice.catch(() => null)
    setPrompt(null)
    setHidden(true)
  }

  return (
    <aside className="install-card" aria-label="Install Kitar">
      <div className="install-card__text">
        <p className="install-card__title">Add Kitar to your home screen</p>
        <p className="muted install-card__body">
          {ios ? (
            <>
              Tap <Share size={14} aria-label="Share" /> then &ldquo;Add to Home Screen&rdquo;.
            </>
          ) : (
            'Open it like an app, even when the signal is weak.'
          )}
        </p>
      </div>
      <div className="install-card__actions">
        {!ios && (
          <button type="button" className="btn btn--primary install-card__install" onClick={install}>
            <Download size={18} aria-hidden="true" /> Install
          </button>
        )}
        <button type="button" className="icon-btn" aria-label="Not now" onClick={dismiss}>
          <X size={18} />
        </button>
      </div>
    </aside>
  )
}
