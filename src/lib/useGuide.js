import { useCallback, useEffect, useMemo, useState } from 'react'
import { listGuide } from './api.js'

// Loads categories + guide items once per screen, with retry.
export function useGuide() {
  const [state, setState] = useState({ status: 'loading', guide: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    listGuide()
      .then((guide) => !cancelled && setState({ status: 'ready', guide, error: null }))
      .catch((error) => !cancelled && setState({ status: 'error', guide: null, error }))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading', guide: null, error: null })
    setAttempt((n) => n + 1)
  }, [])

  const categoriesById = useMemo(
    () => Object.fromEntries((state.guide?.categories ?? []).map((c) => [c.id, c])),
    [state.guide],
  )

  return { ...state, categoriesById, retry }
}
