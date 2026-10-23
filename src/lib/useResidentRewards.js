import { useCallback, useEffect, useState } from 'react'
import { getLeaderboard, getMyPoints, getMyUnit } from './api.js'

// Points, unit and this month's leaderboard for the signed-in resident.
export function useResidentRewards() {
  const [state, setState] = useState({ status: 'loading', points: null, unit: null, leaderboard: [], error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([getMyPoints(), getMyUnit(), getLeaderboard()])
      .then(([points, unit, leaderboard]) => !cancelled && setState({ status: 'ready', points, unit, leaderboard, error: null }))
      .catch((error) => !cancelled && setState({ status: 'error', points: null, unit: null, leaderboard: [], error }))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    setAttempt((n) => n + 1)
  }, [])

  const rankIndex = state.unit ? state.leaderboard.findIndex((row) => row.township_id === state.unit.township_id) : -1
  return { ...state, rank: rankIndex >= 0 ? rankIndex + 1 : null, retry }
}
