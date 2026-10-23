import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import './TopBar.css'

// Every screen's header: optional back button, centred title, optional right action.
export default function TopBar({ title, backTo, right }) {
  return (
    <header className="topbar">
      <div className="topbar__row">
        <div className="topbar__slot">
          {backTo && (
            <Link to={backTo} className="icon-btn" aria-label="Back">
              <ChevronLeft size={22} />
            </Link>
          )}
        </div>
        <h1 className="topbar__title">{title}</h1>
        <div className="topbar__slot topbar__slot--right">{right}</div>
      </div>
    </header>
  )
}
