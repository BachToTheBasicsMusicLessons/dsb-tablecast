import { useState, useEffect, useCallback } from 'react'
import { matchService, Match } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export const useMatch = (matchId: string | null) => {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial match data
  useEffect(() => {
    if (!matchId) {
      setLoading(false)
      return
    }

    const loadMatch = async () => {
      setLoading(true)
      setError(null)
      
      const matchData = await matchService.getMatch(matchId)
      
      if (matchData) {
        setMatch(matchData)
      } else {
        setError('Failed to load match data')
      }
      
      setLoading(false)
    }

    loadMatch()
  }, [matchId])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!matchId) return

    let subscription: RealtimeChannel

    const setupSubscription = () => {
      subscription = matchService.subscribeToMatch(matchId, (updatedMatch) => {
        setMatch(updatedMatch)
      })
    }

    setupSubscription()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [matchId])

  // Helper functions for updating match data
  const updatePlayerScore = useCallback(async (player: 'a' | 'b', score: number) => {
    if (!matchId) return false
    return await matchService.updatePlayerScore(matchId, player, score)
  }, [matchId])

  const updateMatchScore = useCallback(async (scoreA: number, scoreB: number) => {
    if (!matchId) return false
    return await matchService.updateMatchScore(matchId, scoreA, scoreB)
  }, [matchId])

  const updatePlayerInfo = useCallback(async (
    player: 'a' | 'b', 
    info: { name?: string; team?: string; skill?: string }
  ) => {
    if (!matchId) return false
    return await matchService.updatePlayerInfo(matchId, player, info)
  }, [matchId])

  return {
    match,
    loading,
    error,
    updatePlayerScore,
    updateMatchScore,
    updatePlayerInfo
  }
}