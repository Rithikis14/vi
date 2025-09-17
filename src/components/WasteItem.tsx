import React from 'react';
import { Trash2 } from 'lucide-react';

export interface WasteItemType {
  id: string;
  name: string;
  category: 'wet' | 'dry' | 'glass' | 'general';
  emoji: string;
  position: { x: number; y: number };
}

interface WasteItemProps {
  item: WasteItemType;
  onDragStart: (item: WasteItemType) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export const WasteItem: React.FC<WasteItemProps> = ({ 
  item, 
  onDragStart, 
  onDragEnd, 
  isDragging 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragStart(item);
  };

  return (
    <div
      className={`absolute cursor-grab active:cursor-grabbing transform transition-all duration-200 ${
        isDragging ? 'scale-110 z-50 shadow-2xl' : 'hover:scale-105 shadow-lg'
      }`}
      style={{
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onMouseDown={handleMouseDown}
    >
      <div className={`bg-white rounded-xl p-3 border-2 border-gray-200 ${
        isDragging ? 'border-blue-400 bg-blue-50' : ''
      }`}>
        <div className="text-2xl mb-1">{item.emoji}</div>
        <div className="text-xs text-gray-600 text-center font-medium">
          {item.name}
        </div>
      </div>
    </div>
  );
};