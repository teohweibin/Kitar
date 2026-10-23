import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}

const HOME_BY_ROLE = {
  resident: '/resident/home',
  collector: '/collector/scan',
  admin: '/admin',
}

export function homeFor(role) {
  return HOME_BY_ROLE[role] ?? '/'
}
