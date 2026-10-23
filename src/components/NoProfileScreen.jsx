import { CircleAlert } from 'lucide-react'
import { useAuth } from '../lib/authContext.js'
import TopBar from './TopBar.jsx'
import SignOutButton from './SignOutButton.jsx'

// Signed in, but the account has no row in `profiles` (or it could not be loaded).
export default function NoProfileScreen() {
  const { profileError } = useAuth()
  return (
    <div className="app-shell">
      <TopBar title="Account not set up" right={<SignOutButton />} />
      <main className="screen">
        <div className="alert" role="alert">
          <CircleAlert size={18} aria-hidden="true" />
          <p>
            {profileError
              ? `Could not load your profile: ${profileError.message}`
              : 'This account has no Kitar profile yet. Run supabase/seed.sql, or ask the admin to add it.'}
          </p>
        </div>
      </main>
    </div>
  )
}
