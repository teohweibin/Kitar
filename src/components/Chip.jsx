import './Chip.css'

// Status chip: always an icon or dot plus a word, never colour alone.
export default function Chip({ tone = 'muted', icon, children }) {
  return (
    <span className={`chip chip--${tone}`}>
      {icon}
      {children}
    </span>
  )
}

const BIN_DOT = { blue: '#4B8FE8', orange: '#E8853A', brown: '#9C6B43', 'qr-bag': '#F2B544', 'drop-off': '#A99D92' }

export function BinDot({ binColour }) {
  return <span className="bin-dot" style={{ background: BIN_DOT[binColour] ?? BIN_DOT['drop-off'] }} aria-hidden="true" />
}
