import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TypeScript types for our database schema
export interface Match {
  id: string
  match_type: string
  player_a_name: string
  player_a_team: string
  player_a_skill: string
  player_a_score: number
  player_b_name: string
  player_b_team: string
  player_b_skill: string
  player_b_score: number
  match_score_a: number
  match_score_b: number
  created_at: string
  updated_at: string
}

// Database helper functions
export const matchService = {
  // Create a new match
  async createMatch(matchData: Partial<Match>): Promise<Match | null> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([matchData])
        .select()
        .single()

      if (error) {
        console.error('Error creating match:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating match:', error)
      return null
    }
  },

  // Get a match by ID
  async getMatch(matchId: string): Promise<Match | null> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()

      if (error) {
        console.error('Error fetching match:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching match:', error)
      return null
    }
  },

  // Update match scores
  async updatePlayerScore(matchId: string, player: 'a' | 'b', score: number): Promise<boolean> {
    try {
      const updateField = player === 'a' ? 'player_a_score' : 'player_b_score'
      
      const { error } = await supabase
        .from('matches')
        .update({ [updateField]: score })
        .eq('id', matchId)

      if (error) {
        console.error('Error updating player score:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating player score:', error)
      return false
    }
  },

  // Update match score
  async updateMatchScore(matchId: string, scoreA: number, scoreB: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ 
          match_score_a: scoreA,
          match_score_b: scoreB 
        })
        .eq('id', matchId)

      if (error) {
        console.error('Error updating match score:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating match score:', error)
      return false
    }
  },

  // Update player information
  async updatePlayerInfo(
    matchId: string, 
    player: 'a' | 'b', 
    info: { name?: string; team?: string; skill?: string }
  ): Promise<boolean> {
    try {
      const updateFields: Record<string, string> = {}
      
      if (info.name) updateFields[`player_${player}_name`] = info.name
      if (info.team) updateFields[`player_${player}_team`] = info.team
      if (info.skill) updateFields[`player_${player}_skill`] = info.skill

      const { error } = await supabase
        .from('matches')
        .update(updateFields)
        .eq('id', matchId)

      if (error) {
        console.error('Error updating player info:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating player info:', error)
      return false
    }
  },

  // Subscribe to real-time updates for a specific match
  subscribeToMatch(matchId: string, callback: (match: Match) => void) {
    const subscription = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`
        },
        (payload) => {
          callback(payload.new as Match)
        }
      )
      .subscribe()

    return subscription
  },

  // Subscribe to all match updates (for admin/monitoring)
  subscribeToAllMatches(callback: (match: Match) => void) {
    const subscription = supabase
      .channel('all-matches')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            callback(payload.new as Match)
          }
        }
      )
      .subscribe()

    return subscription
  }
}