import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import './layouts.css'

export default function ResidentLayout() {
  return (
    <div className="app-shell app-shell--resident">
      <Outlet />
      <BottomNav />
    </div>
  )
}
