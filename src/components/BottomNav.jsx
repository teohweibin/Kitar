import { NavLink } from 'react-router-dom'
import { House, BookOpen, ScanLine, QrCode, Trophy } from 'lucide-react'
import './BottomNav.css'

const LEFT = [
  { to: '/resident/home', label: 'Home', Icon: House },
  { to: '/resident/guide', label: 'Guide', Icon: BookOpen },
]
const RIGHT = [
  { to: '/resident/bag', label: 'My Bag', Icon: QrCode },
  { to: '/resident/rewards', label: 'Rewards', Icon: Trophy },
]

function NavItem({ to, label, Icon }) {
  return (
    <NavLink to={to} className="bottom-nav__item">
      <Icon size={22} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {LEFT.map((item) => <NavItem key={item.to} {...item} />)}
      <NavLink to="/resident/scan" className="bottom-nav__scan" aria-label="Scan an item">
        <ScanLine size={28} aria-hidden="true" />
      </NavLink>
      {RIGHT.map((item) => <NavItem key={item.to} {...item} />)}
    </nav>
  )
}
