import React from 'react';
import { Trash2, Recycle, Droplets, Package } from 'lucide-react';

interface DustBinProps {
  category: 'wet' | 'dry' | 'glass' | 'general';
  onDrop: (category: string) => void;
  isHighlighted: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}

export const DustBin: React.FC<DustBinProps> = ({ 
  category, 
  onDrop, 
  isHighlighted, 
  isCorrect, 
  isWrong 
}) => {
  const binConfig = {
    wet: {
      color: 'bg-green-500',
      borderColor: 'border-green-600',
      label: 'Wet Waste',
      description: 'Food scraps, peels',
      icon: Droplets,
      lightColor: 'bg-green-100'
    },
    dry: {
      color: 'bg-blue-500',
      borderColor: 'border-blue-600',
      label: 'Dry Recyclable',
      description: 'Paper, plastic, metal',
      icon: Recycle,
      lightColor: 'bg-blue-100'
    },
    glass: {
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-600',
      label: 'Glass Waste',
      description: 'Bottles, jars',
      icon: Package,
      lightColor: 'bg-yellow-100'
    },
    general: {
      color: 'bg-gray-500',
      borderColor: 'border-gray-600',
      label: 'General Waste',
      description: 'Non-recyclable items',
      icon: Trash2,
      lightColor: 'bg-gray-100'
    }
  };

  const config = binConfig[category];
  const Icon = config.icon;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(category);
  };

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-300 ${
        isHighlighted ? 'scale-105' : ''
      } ${isCorrect ? 'animate-bounce' : ''} ${isWrong ? 'animate-shake' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Bin */}
      <div className={`w-24 h-32 ${config.color} ${config.borderColor} border-4 rounded-t-lg rounded-b-3xl relative overflow-hidden ${
        isHighlighted ? `ring-4 ring-white ring-opacity-50` : ''
      } ${isCorrect ? 'ring-4 ring-green-300' : ''} ${isWrong ? 'ring-4 ring-red-300' : ''}`}>
        {/* Bin lid */}
        <div className={`absolute top-0 left-0 right-0 h-6 ${config.color} border-b-2 ${config.borderColor} rounded-t-lg`}>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black bg-opacity-20 rounded-full"></div>
        </div>
        
        {/* Bin icon */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Shine effect */}
        <div className="absolute top-0 left-2 w-2 h-full bg-white bg-opacity-20 rounded-full"></div>
      </div>
      
      {/* Label */}
      <div className={`mt-2 px-3 py-1 ${config.lightColor} rounded-full border-2 ${config.borderColor}`}>
        <div className="text-sm font-bold text-gray-800">{config.label}</div>
        <div className="text-xs text-gray-600">{config.description}</div>
      </div>
      
      {/* Feedback sparkles */}
      {isCorrect && (
        <div className="absolute -top-2 -right-2 text-2xl animate-ping">✨</div>
      )}
      {isWrong && (
        <div className="absolute -top-2 -right-2 text-2xl animate-pulse">❌</div>
      )}
    </div>
  );
};