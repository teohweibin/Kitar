import { Outlet } from 'react-router-dom'
import './layouts.css'
import './CollectorLayout.css'

// No bottom nav: collectors move through Scan → Weigh → Done.
export default function CollectorLayout() {
  return (
    <div className="app-shell collector">
      <Outlet />
    </div>
  )
}
