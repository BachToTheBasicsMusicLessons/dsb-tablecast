// Example usage of the Supabase integration for billiards streaming

import { matchService } from '../lib/supabase'

// Example 1: Create a new match
export const createNewMatch = async () => {
  const newMatch = await matchService.createMatch({
    match_type: 'APA 8-Ball',
    player_a_name: 'Peter',
    player_a_team: 'Darkside',
    player_a_skill: 'SL6 (50)',
    player_b_name: 'Sarah',
    player_b_team: 'Lightning',
    player_b_skill: 'SL5 (40)'
  })

  if (newMatch) {
    console.log('Match created:', newMatch.id)
    return newMatch.id
  }
  
  return null
}

// Example 2: Subscribe to real-time updates for a match
export const subscribeToMatchUpdates = (matchId: string) => {
  const subscription = matchService.subscribeToMatch(matchId, (updatedMatch) => {
    console.log('Match updated:', updatedMatch)
    
    // Update your UI here
    // For example, update React state:
    // setMatch(updatedMatch)
  })

  // Remember to unsubscribe when component unmounts
  // subscription.unsubscribe()
  
  return subscription
}

// Example 3: Update player scores
export const incrementPlayerScore = async (matchId: string, player: 'a' | 'b') => {
  // First get current match data
  const currentMatch = await matchService.getMatch(matchId)
  
  if (currentMatch) {
    const currentScore = player === 'a' ? currentMatch.player_a_score : currentMatch.player_b_score
    const newScore = currentScore + 1
    
    const success = await matchService.updatePlayerScore(matchId, player, newScore)
    
    if (success) {
      console.log(`Player ${player.toUpperCase()} score updated to ${newScore}`)
    }
  }
}

// Example 4: Update match score (team scores)
export const updateTeamScores = async (matchId: string, teamAScore: number, teamBScore: number) => {
  const success = await matchService.updateMatchScore(matchId, teamAScore, teamBScore)
  
  if (success) {
    console.log(`Match score updated: ${teamAScore} - ${teamBScore}`)
  }
}

// Example 5: Update player information
export const updatePlayerDetails = async (matchId: string) => {
  const success = await matchService.updatePlayerInfo(matchId, 'a', {
    name: 'Peter Johnson',
    team: 'Darkside Pro',
    skill: 'SL7 (55)'
  })
  
  if (success) {
    console.log('Player A information updated')
  }
}

// Example 6: Complete React component integration
/*
import React, { useState, useEffect } from 'react'
import { useMatch } from '../hooks/useMatch'

export const MatchComponent = ({ matchId }: { matchId: string }) => {
  const { match, loading, error, updatePlayerScore } = useMatch(matchId)

  if (loading) return <div>Loading match...</div>
  if (error) return <div>Error: {error}</div>
  if (!match) return <div>Match not found</div>

  const handleScoreUpdate = async (player: 'a' | 'b', delta: number) => {
    const currentScore = player === 'a' ? match.player_a_score : match.player_b_score
    const newScore = Math.max(0, currentScore + delta)
    
    await updatePlayerScore(player, newScore)
  }

  return (
    <div>
      <h2>{match.match_type}</h2>
      
      <div>
        <h3>{match.player_a_name} ({match.player_a_team})</h3>
        <p>Score: {match.player_a_score}</p>
        <button onClick={() => handleScoreUpdate('a', 1)}>+1</button>
        <button onClick={() => handleScoreUpdate('a', -1)}>-1</button>
      </div>
      
      <div>
        <h3>{match.player_b_name} ({match.player_b_team})</h3>
        <p>Score: {match.player_b_score}</p>
        <button onClick={() => handleScoreUpdate('b', 1)}>+1</button>
        <button onClick={() => handleScoreUpdate('b', -1)}>-1</button>
      </div>
      
      <div>
        <p>Match Score: {match.match_score_a} - {match.match_score_b}</p>
      </div>
    </div>
  )
}
*/