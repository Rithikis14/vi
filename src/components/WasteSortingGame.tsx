import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WasteItem, WasteItemType } from './WasteItem';
import { DustBin } from './DustBin';
import { GameStats } from './GameStats';
import { EducationalTip } from './EducationalTip';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { usePoints } from '../context/PointsContext';

const WASTE_ITEMS = [
  { name: 'Banana Peel', category: 'wet', emoji: '🍌' },
  { name: 'Apple Core', category: 'wet', emoji: '🍎' },
  { name: 'Bread', category: 'wet', emoji: '🍞' },
  { name: 'Fish Bones', category: 'wet', emoji: '🐟' },
  { name: 'Newspaper', category: 'dry', emoji: '📰' },
  { name: 'Cardboard', category: 'dry', emoji: '📦' },
  { name: 'Plastic Bottle', category: 'dry', emoji: '🥤' },
  { name: 'Aluminum Can', category: 'dry', emoji: '🥫' },
  { name: 'Glass Bottle', category: 'glass', emoji: '🍾' },
  { name: 'Glass Jar', category: 'glass', emoji: '🫙' },
  { name: 'Wine Glass', category: 'glass', emoji: '🍷' },
  { name: 'Light Bulb', category: 'general', emoji: '💡' },
  { name: 'Battery', category: 'general', emoji: '🔋' },
  { name: 'Cigarette', category: 'general', emoji: '🚬' }
];

const INITIAL_TIME = 180; // 3 minutes
const ITEMS_PER_LEVEL = 8;

export const WasteSortingGame: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints } = usePoints();
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'paused' | 'ended'>('waiting');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [wasteItems, setWasteItems] = useState<WasteItemType[]>([]);
  const [draggedItem, setDraggedItem] = useState<WasteItemType | null>(null);
  const [highlightedBin, setHighlightedBin] = useState<string | null>(null);
  const [feedbackBin, setFeedbackBin] = useState<{category: string, type: 'correct' | 'wrong'} | null>(null);
  const [showTip, setShowTip] = useState<{category: 'wet' | 'dry' | 'glass' | 'general', show: boolean}>({category: 'wet', show: false});
  const [dragPosition, setDragPosition] = useState<{x: number, y: number} | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const generateWasteItems = useCallback(() => {
    const items: WasteItemType[] = [];
    const gameArea = { width: 800, height: 400 };
    
    for (let i = 0; i < ITEMS_PER_LEVEL; i++) {
      const wasteTemplate = WASTE_ITEMS[Math.floor(Math.random() * WASTE_ITEMS.length)];
      items.push({
        id: `waste-${i}-${Date.now()}`,
        ...wasteTemplate,
        position: {
          x: Math.random() * (gameArea.width - 80) + 40,
          y: Math.random() * (gameArea.height - 80) + 40
        }
      });
    }
    
    setWasteItems(items);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setTimeLeft(INITIAL_TIME);
    generateWasteItems();
  };

  const resetGame = () => {
    setGameState('waiting');
    setScore(0);
    setLevel(1);
    setTimeLeft(INITIAL_TIME);
    setWasteItems([]);
    setDraggedItem(null);
    setHighlightedBin(null);
    setFeedbackBin(null);
    setGameCompleted(false);
  };

  const exitGame = () => {
    if (gameState === 'playing' && !gameCompleted) {
      // Add points if exiting during play
      addPoints(score);
    }
    navigate('/games');
  };

  const handleDragStart = (item: WasteItemType) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setHighlightedBin(null);
    setDragPosition(null);
  };

  const handleBinDrop = (binCategory: string) => {
    if (!draggedItem) return;

    const isCorrect = draggedItem.category === binCategory;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setWasteItems(prev => prev.filter(item => item.id !== draggedItem.id));
      setFeedbackBin({category: binCategory, type: 'correct'});
      setShowTip({category: draggedItem.category, show: true});
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setFeedbackBin({category: binCategory, type: 'wrong'});
    }

    setTimeout(() => setFeedbackBin(null), 1000);
    setDraggedItem(null);
    setHighlightedBin(null);
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      setGameState('ended');
      // Add points when game ends
      addPoints(score);
      setGameCompleted(true);
    }
  }, [gameState, timeLeft, score, addPoints, gameCompleted]);

  // Level progression
  useEffect(() => {
    if (gameState === 'playing' && wasteItems.length === 0) {
      setLevel(prev => prev + 1);
      setTimeLeft(prev => prev + 30); // Bonus time
      setTimeout(() => {
        generateWasteItems();
      }, 1500);
    }
  }, [wasteItems.length, gameState, generateWasteItems]);

  // Mouse move handler for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedItem) {
        setDragPosition({x: e.clientX, y: e.clientY});
        
        // Check if hovering over bins
        const binElements = document.querySelectorAll('[data-bin-category]');
        let hoveredBin = null;
        
        binElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (e.clientX >= rect.left && e.clientX <= rect.right &&
              e.clientY >= rect.top && e.clientY <= rect.bottom) {
            hoveredBin = el.getAttribute('data-bin-category');
          }
        });
        
        setHighlightedBin(hoveredBin);
      }
    };

    const handleMouseUp = () => {
      if (draggedItem && highlightedBin) {
        handleBinDrop(highlightedBin);
      } else {
        handleDragEnd();
      }
    };

    if (draggedItem) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedItem, highlightedBin]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-green-100 to-green-200 p-4">
      {/* Header */}
      <div className="text-center mb-6 relative">
        <button
          onClick={exitGame}
          className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
          title="Exit Game"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-4xl font-bold text-green-800 mb-2">🌍 EcoSort Challenge 🌍</h1>
        <p className="text-lg text-green-700">Help keep our planet clean by sorting waste correctly!</p>
      </div>

      {gameState === 'waiting' && (
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Play?</h2>
            <p className="text-gray-600 mb-6">Drag waste items to the correct bins. Sort as many as you can before time runs out!</p>
            <button 
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <GameStats 
            score={score}
            timeLeft={timeLeft}
            itemsRemaining={wasteItems.length}
            level={level}
          />

          {/* Game Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => setGameState('paused')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
            <button 
              onClick={resetGame}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Game Area */}
          <div className="max-w-6xl mx-auto">
            {/* Playground Scene */}
            <div className="relative bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 min-h-96 overflow-hidden border-4 border-orange-300">
              {/* Ground decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-400 rounded-b-xl"></div>
              <div className="absolute bottom-4 left-10 w-8 h-8 bg-green-500 rounded-full opacity-60"></div>
              <div className="absolute bottom-4 right-20 w-6 h-6 bg-green-600 rounded-full opacity-40"></div>
              
              {/* Waste Items */}
              {wasteItems.map(item => (
                <WasteItem
                  key={item.id}
                  item={item}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItem?.id === item.id}
                />
              ))}
              
              {/* Instructions */}
              {wasteItems.length > 0 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-xl px-4 py-2">
                  <p className="text-sm font-medium text-gray-700">Drag waste items to the correct bins below! 👇</p>
                </div>
              )}
            </div>

            {/* Dustbins */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {(['wet', 'dry', 'glass', 'general'] as const).map(category => (
                <div key={category} data-bin-category={category}>
                  <DustBin
                    category={category}
                    onDrop={handleBinDrop}
                    isHighlighted={highlightedBin === category}
                    isCorrect={feedbackBin?.category === category && feedbackBin?.type === 'correct'}
                    isWrong={feedbackBin?.category === category && feedbackBin?.type === 'wrong'}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {gameState === 'paused' && (
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <div className="text-6xl mb-4">⏸️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Paused</h2>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setGameState('playing')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Continue
              </button>
              <button 
                onClick={resetGame}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <div className="text-6xl mb-4">{score >= 100 ? '🏆' : '🎯'}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
            <div className="text-lg text-gray-600 mb-2">Final Score: <span className="font-bold text-green-600">{score}</span></div>
            <div className="text-lg text-gray-600 mb-2">Points Earned: <span className="font-bold text-yellow-600">+{score} pts</span></div>
            <div className="text-lg text-gray-600 mb-6">Level Reached: <span className="font-bold text-purple-600">{level}</span></div>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors flex items-center gap-2"
              >
                <Play className="w-6 h-6" />
                Play Again
              </button>
              <button 
                onClick={exitGame}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors flex items-center gap-2"
              >
                <X className="w-6 h-6" />
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Tip Modal */}
      <EducationalTip
        category={showTip.category}
        isVisible={showTip.show}
        onClose={() => setShowTip({...showTip, show: false})}
      />

      {/* Dragging Item */}
      {draggedItem && dragPosition && (
        <div 
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: dragPosition.x,
            top: dragPosition.y
          }}
        >
          <div className="bg-white rounded-xl p-3 border-2 border-blue-400 bg-blue-50 scale-110 shadow-2xl">
            <div className="text-2xl mb-1">{draggedItem.emoji}</div>
            <div className="text-xs text-gray-600 text-center font-medium">
              {draggedItem.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};