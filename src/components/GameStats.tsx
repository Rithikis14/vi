import React from 'react';
import { Trophy, Timer, Target, Star } from 'lucide-react';

interface GameStatsProps {
  score: number;
  timeLeft: number;
  itemsRemaining: number;
  level: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ 
  score, 
  timeLeft, 
  itemsRemaining, 
  level 
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-center">
      {/* Score */}
      <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl px-4 py-2 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <div>
          <div className="text-sm text-yellow-600 font-medium">Score</div>
          <div className="text-xl font-bold text-yellow-700">{score}</div>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-red-100 border-2 border-red-300 rounded-xl px-4 py-2 flex items-center gap-2">
        <Timer className="w-5 h-5 text-red-600" />
        <div>
          <div className="text-sm text-red-600 font-medium">Time</div>
          <div className="text-xl font-bold text-red-700">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Items Remaining */}
      <div className="bg-blue-100 border-2 border-blue-300 rounded-xl px-4 py-2 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        <div>
          <div className="text-sm text-blue-600 font-medium">Items</div>
          <div className="text-xl font-bold text-blue-700">{itemsRemaining}</div>
        </div>
      </div>

      {/* Level */}
      <div className="bg-purple-100 border-2 border-purple-300 rounded-xl px-4 py-2 flex items-center gap-2">
        <Star className="w-5 h-5 text-purple-600" />
        <div>
          <div className="text-sm text-purple-600 font-medium">Level</div>
          <div className="text-xl font-bold text-purple-700">{level}</div>
        </div>
      </div>
    </div>
  );
};