import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  team: string;
  skill: string;
  score: number;
}

interface EditablePlayerCardProps {
  player: Player;
  side: 'left' | 'right';
  color: 'blue' | 'red';
  onPlayerUpdate: (playerId: string, updates: Partial<Player>) => void;
}

export const EditablePlayerCard: React.FC<EditablePlayerCardProps> = ({
  player,
  side,
  color,
  onPlayerUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: player.name,
    team: player.team,
    skill: player.skill
  });

  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    red: 'bg-red-600 text-white'
  };

  const handleSave = () => {
    onPlayerUpdate(player.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: player.name,
      team: player.team,
      skill: player.skill
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    return (
      <div className={`flex-1 ${colorClasses[color]} p-3 md:p-6 ${side === 'right' ? 'text-right' : ''}`}>
        <div className="space-y-2 md:space-y-4">
          {/* Name Input */}
          <div>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded px-2 md:px-4 py-1.5 md:py-3 text-white placeholder-white/70 font-bold text-sm md:text-xl"
              placeholder="Player Name"
              autoFocus
            />
          </div>
          
          {/* Team Input */}
          <div>
            <input
              type="text"
              value={editData.team}
              onChange={(e) => handleInputChange('team', e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded px-2 md:px-4 py-1 md:py-2 text-white placeholder-white/70 text-xs md:text-base"
              placeholder="Team Name"
            />
          </div>
          
          {/* Skill Input */}
          <div>
            <input
              type="text"
              value={editData.skill}
              onChange={(e) => handleInputChange('skill', e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded px-2 md:px-4 py-1 md:py-2 text-white placeholder-white/70 text-xs md:text-sm"
              placeholder="Skill Level (e.g., SL6 (50))"
            />
          </div>
          
          {/* Action Buttons */}
          <div className={`flex gap-2 md:gap-3 mt-3 md:mt-6 ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white p-1.5 md:p-3 rounded-full transition-colors duration-200 touch-manipulation"
            >
              <Check className="w-3 h-3 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white p-1.5 md:p-3 rounded-full transition-colors duration-200 touch-manipulation"
            >
              <X className="w-3 h-3 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 ${colorClasses[color]} p-3 md:p-6 ${side === 'right' ? 'text-right' : ''} relative group min-h-[80px] md:min-h-[120px] flex flex-col justify-center`}>
      <div className="text-white">
        <h3 className="font-bold text-sm md:text-xl mb-1 md:mb-2 leading-tight">{player.name}</h3>
        <p className={`${color === 'blue' ? 'text-blue-200' : 'text-red-200'} text-xs md:text-base mb-0.5 md:mb-1`}>
          {player.team}
        </p>
        <p className={`${color === 'blue' ? 'text-blue-200' : 'text-red-200'} text-xs md:text-sm`}>
          {player.skill}
        </p>
      </div>
      
      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className={`absolute ${side === 'right' ? 'left-2 md:left-4' : 'right-2 md:right-4'} top-2 md:top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 hover:bg-white/30 text-white p-1.5 md:p-3 rounded-full touch-manipulation`}
      >
        <Edit3 className="w-3 h-3 md:w-5 md:h-5" />
      </button>
    </div>
  );
};