import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, supabaseConfigError } from './supabase.js'
import { getMyProfile } from './api.js'
import { AuthContext, homeFor, useAuth } from './authContext.js'
import LoadingScreen from '../components/LoadingScreen.jsx'
import NoProfileScreen from '../components/NoProfileScreen.jsx'

export function AuthProvider({ children }) {
  // undefined = still checking for a saved session; null = signed out
  const [session, setSession] = useState(supabase ? undefined : null)
  const [profileState, setProfileState] = useState({ userId: null, profile: null, error: null })
  // Only the newest profile request may write state (a demo session reloads the profile
  // while the sign-in's own load may still be in flight).
  const requestRef = useRef(0)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user?.id ?? null

  useEffect(() => {
    if (!userId) return
    const request = ++requestRef.current
    getMyProfile(userId)
      .then((profile) => request === requestRef.current && setProfileState({ userId, profile, error: null }))
      .catch((error) => request === requestRef.current && setProfileState({ userId, profile: null, error }))
  }, [userId])

  const profileLoaded = userId !== null && profileState.userId === userId
  const profile = profileLoaded ? profileState.profile : null
  const loading = session === undefined || (userId !== null && !profileLoaded)

  const signIn = useCallback(async (email, password) => {
    if (supabaseConfigError) throw new Error(supabaseConfigError)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  // Password-free demo: sign in anonymously (or reuse an anonymous session) and take a demo
  // role through the start_demo_session RPC (supabase/updates/0006_demo_sessions.sql).
  const startDemo = useCallback(async (role) => {
    if (supabaseConfigError) throw new Error(supabaseConfigError)
    const { data: current } = await supabase.auth.getSession()
    if (!current.session?.user?.is_anonymous) {
      if (current.session) await supabase.auth.signOut()
      const { error } = await supabase.auth.signInAnonymously()
      if (error) {
        throw new Error(
          /anonymous/i.test(error.message)
            ? 'Demo sign-in is switched off. Turn on anonymous sign-ins in Supabase (see README).'
            : error.message,
        )
      }
    }
    const { error: rpcError } = await supabase.rpc('start_demo_session', { p_role: role })
    if (rpcError) throw rpcError
    const { data } = await supabase.auth.getUser()
    const request = ++requestRef.current
    const profile = await getMyProfile(data.user.id)
    if (request === requestRef.current) setProfileState({ userId: data.user.id, profile, error: null })
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
  }, [])

  const value = useMemo(
    () => ({
      session: session ?? null,
      profile,
      profileError: profileLoaded ? profileState.error : null,
      loading,
      signIn,
      startDemo,
      signOut,
    }),
    [session, profile, profileLoaded, profileState.error, loading, signIn, startDemo, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Guards a route group: signed-out users go to login, other roles go to their own home.
export function RequireRole({ role, children }) {
  const { session, profile, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace />
  if (!profile) return <NoProfileScreen />
  if (profile.role !== role) return <Navigate to={homeFor(profile.role)} replace />
  return children
}
