import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import './BottomSheet.css'

// Modal sheet from the bottom, max 85% of the screen. Closes on backdrop tap, the X, or Escape.
export default function BottomSheet({ title, onClose, children }) {
  const titleId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    panelRef.current?.focus()
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previousFocus?.focus?.()
    }
  }, [onClose])

  return (
    <div className="sheet" onClick={onClose}>
      <div
        ref={panelRef}
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet__handle" aria-hidden="true" />
        <div className="sheet__header">
          <h2 id={titleId} className="sheet__title">{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}
