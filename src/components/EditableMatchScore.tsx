import React, { useState } from 'react';
import { Edit3, Check, X, Minus, Plus } from 'lucide-react';

interface EditableMatchScoreProps {
  matchScoreA: number;
  matchScoreB: number;
  onMatchScoreUpdate: (scoreA: number, scoreB: number) => void;
}

export const EditableMatchScore: React.FC<EditableMatchScoreProps> = ({
  matchScoreA,
  matchScoreB,
  onMatchScoreUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editScores, setEditScores] = useState({
    scoreA: matchScoreA,
    scoreB: matchScoreB
  });

  const handleSave = () => {
    onMatchScoreUpdate(editScores.scoreA, editScores.scoreB);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditScores({
      scoreA: matchScoreA,
      scoreB: matchScoreB
    });
    setIsEditing(false);
  };

  const adjustScore = (team: 'A' | 'B', delta: number) => {
    const field = team === 'A' ? 'scoreA' : 'scoreB';
    setEditScores(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

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
        w-6 h-6 md:w-8 md:h-8 rounded-full font-bold text-xs md:text-sm transition-all duration-200 
        active:scale-95 shadow-lg touch-manipulation flex items-center justify-center
        ${variant === 'primary' 
          ? 'bg-white/30 hover:bg-white/40 text-white border border-white/40' 
          : 'bg-white/20 hover:bg-white/30 text-white/80 border border-white/30'
        }
      `}
    >
      {children}
    </button>
  );

  if (isEditing) {
    return (
      <div className="text-center">
        <p className="text-white/80 text-xs md:text-sm mb-2 md:mb-4">Match Score</p>
        
        {/* Editable Score Controls */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-3 md:mb-6">
          {/* Team A Score */}
          <div className="flex flex-col items-center gap-1 md:gap-3">
            <div className="flex items-center gap-1 md:gap-2">
              <ScoreButton
                onClick={() => adjustScore('A', -1)}
                variant="secondary"
              >
                <Minus className="w-2 h-2 md:w-4 md:h-4" />
              </ScoreButton>
              
              <div className="text-white text-lg md:text-2xl font-bold min-w-[2rem] md:min-w-[3rem] text-center">
                {editScores.scoreA}
              </div>
              
              <ScoreButton
                onClick={() => adjustScore('A', 1)}
              >
                <Plus className="w-2 h-2 md:w-4 md:h-4" />
              </ScoreButton>
            </div>
          </div>
          
          <span className="text-white text-lg md:text-2xl font-bold">-</span>
          
          {/* Team B Score */}
          <div className="flex flex-col items-center gap-1 md:gap-3">
            <div className="flex items-center gap-1 md:gap-2">
              <ScoreButton
                onClick={() => adjustScore('B', -1)}
                variant="secondary"
              >
                <Minus className="w-2 h-2 md:w-4 md:h-4" />
              </ScoreButton>
              
              <div className="text-white text-lg md:text-2xl font-bold min-w-[2rem] md:min-w-[3rem] text-center">
                {editScores.scoreB}
              </div>
              
              <ScoreButton
                onClick={() => adjustScore('B', 1)}
              >
                <Plus className="w-2 h-2 md:w-4 md:h-4" />
              </ScoreButton>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-3 justify-center">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white p-1.5 md:p-2 rounded-full transition-colors duration-200 touch-manipulation"
          >
            <Check className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white p-1.5 md:p-2 rounded-full transition-colors duration-200 touch-manipulation"
          >
            <X className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center relative group">
      <p className="text-white/80 text-xs md:text-sm mb-1 md:mb-2">Match Score</p>
      <p className="text-white text-lg md:text-3xl font-bold">
        {matchScoreA} - {matchScoreB}
      </p>
      
      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-1 md:-top-2 -right-1 md:-right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 hover:bg-white/30 text-white p-1.5 md:p-2 rounded-full touch-manipulation"
      >
        <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
      </button>
    </div>
  );
};