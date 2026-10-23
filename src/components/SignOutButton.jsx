import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../lib/authContext.js'

export default function SignOutButton() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleClick() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <button type="button" className="icon-btn" aria-label="Sign out" onClick={handleClick}>
      <LogOut size={20} />
    </button>
  )
}
