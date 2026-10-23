import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import './OfflineBanner.css'

// Thin banner from design.md → States → Offline.
export default function OfflineBanner() {
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && navigator.onLine === false)

  useEffect(() => {
    const goOffline = () => setOffline(true)
    const goOnline = () => setOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  if (!offline) return null
  return (
    <div className="offline-banner" role="status">
      <WifiOff size={16} aria-hidden="true" />
      You&apos;re offline. The guide still works; collections need a connection.
    </div>
  )
}
