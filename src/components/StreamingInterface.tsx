import React, { useState, useCallback } from 'react';
import { CameraFeed } from './CameraFeed';
import { ScoreboardOverlay } from './ScoreboardOverlay';

interface Player {
  id: string;
  name: string;
  team: string;
  skill: string;
  score: number;
}

export const StreamingInterface: React.FC = () => {
  // TODO: Replace with Supabase real-time data
  const [matchType, setMatchType] = useState('APA 8-Ball');
  
  const [player1, setPlayer1] = useState<Player>({
    id: 'player1',
    name: 'Peter',
    team: 'Team A',
    skill: 'SL6 (50)',
    score: 0
  });

  const [player2, setPlayer2] = useState<Player>({
    id: 'player2',
    name: 'Player B',
    team: 'Team B',
    skill: 'SL6 (50)',
    score: 0
  });

  const [matchScoreA, setMatchScoreA] = useState(0);
  const [matchScoreB, setMatchScoreB] = useState(0);

  // Handle match type changes
  const handleMatchTypeUpdate = useCallback(async (newType: string) => {
    setMatchType(newType);
    
    // TODO: Supabase real-time update
    // await matchService.updateMatchType(currentMatchId, newType);
  }, []);

  // Handle score changes
  const handleScoreChange = useCallback(async (playerId: string, delta: number) => {
    if (playerId === 'player1') {
      const newScore = Math.max(0, player1.score + delta);
      setPlayer1(prev => ({ ...prev, score: newScore }));
      
      // TODO: Supabase real-time update
      // await matchService.updatePlayerScore(currentMatchId, 'a', newScore);
    } else if (playerId === 'player2') {
      const newScore = Math.max(0, player2.score + delta);
      setPlayer2(prev => ({ ...prev, score: newScore }));
      
      // TODO: Supabase real-time update
      // await matchService.updatePlayerScore(currentMatchId, 'b', newScore);
    }
  }, [player1.score, player2.score]);

  // Handle player information updates
  const handlePlayerUpdate = useCallback(async (playerId: string, updates: Partial<Player>) => {
    if (playerId === 'player1') {
      setPlayer1(prev => ({ ...prev, ...updates }));
      
      // TODO: Supabase real-time update
      // await matchService.updatePlayerInfo(currentMatchId, 'a', {
      //   name: updates.name,
      //   team: updates.team,
      //   skill: updates.skill
      // });
    } else if (playerId === 'player2') {
      setPlayer2(prev => ({ ...prev, ...updates }));
      
      // TODO: Supabase real-time update
      // await matchService.updatePlayerInfo(currentMatchId, 'b', {
      //   name: updates.name,
      //   team: updates.team,
      //   skill: updates.skill
      // });
    }
  }, []);

  // Handle match score updates
  const handleMatchScoreUpdate = useCallback(async (scoreA: number, scoreB: number) => {
    setMatchScoreA(scoreA);
    setMatchScoreB(scoreB);
    
    // TODO: Supabase real-time update
    // await matchService.updateMatchScore(currentMatchId, scoreA, scoreB);
  }, []);

  // TODO: Load initial game data from Supabase
  // useEffect(() => {
  //   const loadGameData = async () => {
  //     const { data } = await supabase
  //       .from('matches')
  //       .select('*')
  //       .eq('id', currentMatchId)
  //       .single();
  //     
  //     if (data) {
  //       setMatchType(data.match_type);
  //       setPlayer1(prev => ({ 
  //         ...prev, 
  //         name: data.player_a_name, 
  //         team: data.player_a_team,
  //         skill: data.player_a_skill,
  //         score: data.player_a_score 
  //       }));
  //       setPlayer2(prev => ({ 
  //         ...prev, 
  //         name: data.player_b_name, 
  //         team: data.player_b_team,
  //         skill: data.player_b_skill,
  //         score: data.player_b_score 
  //       }));
  //       setMatchScoreA(data.match_score_a);
  //       setMatchScoreB(data.match_score_b);
  //     }
  //   };
  //   
  //   loadGameData();
  // }, []);

  // TODO: Subscribe to real-time score changes
  // useEffect(() => {
  //   const subscription = supabase
  //     .channel('match-updates')
  //     .on('postgres_changes', 
  //       { event: 'UPDATE', schema: 'public', table: 'matches' },
  //       (payload) => {
  //         const data = payload.new;
  //         setMatchType(data.match_type);
  //         setPlayer1(prev => ({ 
  //           ...prev, 
  //           name: data.player_a_name,
  //           team: data.player_a_team,
  //           skill: data.player_a_skill,
  //           score: data.player_a_score 
  //         }));
  //         setPlayer2(prev => ({ 
  //           ...prev, 
  //           name: data.player_b_name,
  //           team: data.player_b_team,
  //           skill: data.player_b_skill,
  //           score: data.player_b_score 
  //         }));
  //         setMatchScoreA(data.match_score_a);
  //         setMatchScoreB(data.match_score_b);
  //       }
  //     )
  //     .subscribe();
  //   
  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <CameraFeed />
      <ScoreboardOverlay
        matchType={matchType}
        player1={player1}
        player2={player2}
        matchScoreA={matchScoreA}
        matchScoreB={matchScoreB}
        onScoreChange={handleScoreChange}
        onPlayerUpdate={handlePlayerUpdate}
        onMatchScoreUpdate={handleMatchScoreUpdate}
        onMatchTypeUpdate={handleMatchTypeUpdate}
      />
    </div>
  );
};