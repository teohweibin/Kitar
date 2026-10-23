import { Delete } from 'lucide-react'
import './Keypad.css'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back']

// Large number keys for one-handed weight entry outdoors.
export default function Keypad({ onKey, disabled }) {
  return (
    <div className="keypad" role="group" aria-label="Weight keypad">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className="keypad__key num"
          onClick={() => onKey(key)}
          disabled={disabled}
          aria-label={key === 'back' ? 'Delete last digit' : key === '.' ? 'Decimal point' : key}
        >
          {key === 'back' ? <Delete size={26} /> : key}
        </button>
      ))}
    </div>
  )
}
