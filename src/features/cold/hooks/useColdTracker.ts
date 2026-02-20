import { useState, useEffect, useRef, useCallback } from 'react'
import type { ColdSession } from '../types/cold'

const STORAGE_KEY = 'hl_cold_sessions'

function loadSessions(): ColdSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function persistSession(session: ColdSession): void {
  try {
    const existing = loadSessions()
    localStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...existing]))
  } catch {
    // ignore storage errors
  }
}

export function calculateStreak(sessions: ColdSession[]): number {
  if (sessions.length === 0) return 0

  const days = new Set(sessions.map(s => s.date.slice(0, 10)))

  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // If today has no session, start checking from yesterday
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function useColdTracker() {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [sessions, setSessions] = useState<ColdSession[]>(loadSessions)

  // Ref so stop() can read elapsed without stale closure
  const elapsedRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        elapsedRef.current += 1
        setElapsed(elapsedRef.current)
      }, 1000)
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning])

  const start = useCallback(() => {
    elapsedRef.current = 0
    setElapsed(0)
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    const duration = elapsedRef.current
    elapsedRef.current = 0
    setElapsed(0)

    if (duration >= 5) {
      const session: ColdSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration,
      }
      persistSession(session)
      setSessions(prev => [session, ...prev])
    }
  }, [])

  const streak = calculateStreak(sessions)

  return { isRunning, elapsed, sessions, streak, start, stop }
}
