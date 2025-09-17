import React from 'react';
import { X, Lightbulb } from 'lucide-react';

interface EducationalTipProps {
  category: 'wet' | 'dry' | 'glass' | 'general';
  isVisible: boolean;
  onClose: () => void;
}

export const EducationalTip: React.FC<EducationalTipProps> = ({ 
  category, 
  isVisible, 
  onClose 
}) => {
  const tips = {
    wet: {
      title: "Wet Waste - Great Choice! 🌱",
      content: "Wet waste includes all organic materials like food scraps, vegetable peels, and leftover food. These items can be composted to create nutrient-rich soil for plants!",
      color: "bg-green-500"
    },
    dry: {
      title: "Dry Recyclable - Excellent! ♻️",
      content: "Paper, cardboard, plastic bottles, and metal cans can be recycled into new products. This helps save natural resources and reduces pollution!",
      color: "bg-blue-500"
    },
    glass: {
      title: "Glass Waste - Perfect! 🥃",
      content: "Glass bottles and jars can be recycled indefinitely without losing quality. Glass recycling saves energy and reduces the need for raw materials!",
      color: "bg-yellow-500"
    },
    general: {
      title: "General Waste - Good Work! 🗑️",
      content: "Items that can't be recycled or composted go here. Try to minimize general waste by choosing reusable items and recycling when possible!",
      color: "bg-gray-500"
    }
  };

  const tip = tips[category];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform animate-bounce-in">
        <div className="flex justify-between items-start mb-4">
          <div className={`${tip.color} rounded-full p-2 mr-3`}>
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">{tip.title}</h3>
        <p className="text-gray-600 leading-relaxed mb-4">{tip.content}</p>
        
        <button 
          onClick={onClose}
          className={`w-full ${tip.color} text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity`}
        >
          Got it! Let's continue! 🎮
        </button>
      </div>
    </div>
  );
};