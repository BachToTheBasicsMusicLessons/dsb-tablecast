import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

interface EditableMatchTypeProps {
  matchType: string;
  onMatchTypeUpdate: (newType: string) => void;
}

export const EditableMatchType: React.FC<EditableMatchTypeProps> = ({
  matchType,
  onMatchTypeUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(matchType);

  const handleSave = () => {
    onMatchTypeUpdate(editValue.trim() || 'APA 8-Ball');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(matchType);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="text-center py-2 md:py-4 border-b border-white/20 bg-black/95 px-2 md:px-4">
        <div className="flex items-center justify-center gap-2 md:gap-4 max-w-xs md:max-w-md mx-auto">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-white/20 border border-white/30 rounded px-2 md:px-4 py-1.5 md:py-3 text-white placeholder-white/70 font-bold text-sm md:text-lg text-center flex-1 min-w-0"
            placeholder="Match Type"
            autoFocus
            maxLength={50}
          />
          
          <div className="flex gap-2 md:gap-3">
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
    <div className="text-center py-2 md:py-4 border-b border-white/20 bg-black/95 relative group">
      <h2 className="text-white font-bold text-base md:text-xl">{matchType}</h2>
      
      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 hover:bg-white/30 text-white p-1.5 md:p-3 rounded-full touch-manipulation"
      >
        <Edit3 className="w-3 h-3 md:w-5 md:h-5" />
      </button>
    </div>
  );
};