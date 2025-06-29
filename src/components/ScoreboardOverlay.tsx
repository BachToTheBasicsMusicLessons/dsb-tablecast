import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { EditablePlayerCard } from './EditablePlayerCard';
import { EditableMatchScore } from './EditableMatchScore';
import { EditableMatchType } from './EditableMatchType';

interface Player {
  id: string;
  name: string;
  team: string;
  skill: string;
  score: number;
}

interface ScoreboardOverlayProps {
  matchType: string;
  player1: Player;
  player2: Player;
  matchScoreA: number;
  matchScoreB: number;
  onScoreChange: (playerId: string, delta: number) => void;
  onPlayerUpdate: (playerId: string, updates: Partial<Player>) => void;
  onMatchScoreUpdate: (scoreA: number, scoreB: number) => void;
  onMatchTypeUpdate: (newType: string) => void;
}

export const ScoreboardOverlay: React.FC<ScoreboardOverlayProps> = ({
  matchType,
  player1,
  player2,
  matchScoreA,
  matchScoreB,
  onScoreChange,
  onPlayerUpdate,
  onMatchScoreUpdate,
  onMatchTypeUpdate
}) => {
  const ScoreButton = ({ 
    onClick, 
    children, 
    variant = 'primary' 
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
  }) => (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 md:w-12 md:h-12 rounded-full font-bold text-sm md:text-lg transition-all duration-200 
        active:scale-95 shadow-lg touch-manipulation flex items-center justify-center
        ${variant === 'primary' 
          ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30' 
          : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/20'
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      <div className="bg-black/90 backdrop-blur-sm">
        {/* Editable Game Type Header - Compact for mobile */}
        <EditableMatchType
          matchType={matchType}
          onMatchTypeUpdate={onMatchTypeUpdate}
        />
        
        {/* Mobile-First Compact Layout */}
        <div className="flex flex-col">
          {/* Player Cards Row - Compact */}
          <div className="flex">
            {/* Player 1 Section */}
            <EditablePlayerCard
              player={player1}
              side="left"
              color="blue"
              onPlayerUpdate={onPlayerUpdate}
            />
            
            {/* Center Match Score - Compact */}
            <div className="flex-shrink-0 bg-black/95 px-2 md:px-4 py-3 md:py-6 flex items-center justify-center min-w-[100px] md:min-w-[140px]">
              <EditableMatchScore
                matchScoreA={matchScoreA}
                matchScoreB={matchScoreB}
                onMatchScoreUpdate={onMatchScoreUpdate}
              />
            </div>
            
            {/* Player 2 Section */}
            <EditablePlayerCard
              player={player2}
              side="right"
              color="red"
              onPlayerUpdate={onPlayerUpdate}
            />
          </div>
          
          {/* Score Controls Row - Compact Mobile Layout */}
          <div className="bg-black/95 px-2 md:px-4 py-3 md:py-6">
            <div className="flex justify-between items-center max-w-sm md:max-w-lg mx-auto">
              {/* Player 1 Score Controls */}
              <div className="flex items-center gap-2 md:gap-4">
                <ScoreButton
                  onClick={() => onScoreChange(player1.id, -1)}
                  variant="secondary"
                >
                  <Minus className="w-3 h-3 md:w-6 md:h-6" />
                </ScoreButton>
                
                <div className="text-white text-2xl md:text-5xl font-bold min-w-[2.5rem] md:min-w-[4rem] text-center">
                  {player1.score}
                </div>
                
                <ScoreButton
                  onClick={() => onScoreChange(player1.id, 1)}
                >
                  <Plus className="w-3 h-3 md:w-6 md:h-6" />
                </ScoreButton>
              </div>
              
              {/* VS Separator - Smaller on mobile */}
              <div className="text-white/60 text-lg md:text-2xl font-bold px-2 md:px-4">
                VS
              </div>
              
              {/* Player 2 Score Controls */}
              <div className="flex items-center gap-2 md:gap-4">
                <ScoreButton
                  onClick={() => onScoreChange(player2.id, -1)}
                  variant="secondary"
                >
                  <Minus className="w-3 h-3 md:w-6 md:h-6" />
                </ScoreButton>
                
                <div className="text-white text-2xl md:text-5xl font-bold min-w-[2.5rem] md:min-w-[4rem] text-center">
                  {player2.score}
                </div>
                
                <ScoreButton
                  onClick={() => onScoreChange(player2.id, 1)}
                >
                  <Plus className="w-3 h-3 md:w-6 md:h-6" />
                </ScoreButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};