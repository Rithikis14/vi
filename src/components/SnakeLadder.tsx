import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Wind, Zap, Droplets, TreePine, Recycle, Flame, Car, Factory, Zap as Battery, Mountain, Fuel, X } from 'lucide-react';
import { usePoints } from '../context/PointsContext';

interface Resource {
  id: number;
  name: string;
  type: 'renewable' | 'nonrenewable';
  icon: React.ReactNode;
  color: string;
}

interface GameState {
  currentPosition: number;
  score: number;
  questionsAnswered: number;
  currentQuestion: Resource | null;
  gameStatus: 'playing' | 'won';
  showFeedback: boolean;
  feedbackMessage: string;
  isMoving: boolean;
}

const resources: Resource[] = [
  { id: 1, name: 'Solar Energy', type: 'renewable', icon: <Sun className="w-8 h-8" />, color: 'bg-yellow-400' },
  { id: 2, name: 'Wind Energy', type: 'renewable', icon: <Wind className="w-8 h-8" />, color: 'bg-blue-400' },
  { id: 3, name: 'Coal', type: 'nonrenewable', icon: <Mountain className="w-8 h-8" />, color: 'bg-gray-600' },
  { id: 4, name: 'Hydroelectric', type: 'renewable', icon: <Droplets className="w-8 h-8" />, color: 'bg-blue-500' },
  { id: 5, name: 'Natural Gas', type: 'nonrenewable', icon: <Flame className="w-8 h-8" />, color: 'bg-orange-500' },
  { id: 6, name: 'Biomass', type: 'renewable', icon: <TreePine className="w-8 h-8" />, color: 'bg-green-500' },
  { id: 7, name: 'Oil', type: 'nonrenewable', icon: <Fuel className="w-8 h-8" />, color: 'bg-black' },
  { id: 8, name: 'Geothermal', type: 'renewable', icon: <Zap className="w-8 h-8" />, color: 'bg-red-400' },
  { id: 9, name: 'Nuclear', type: 'nonrenewable', icon: <Battery className="w-8 h-8" />, color: 'bg-purple-500' },
  { id: 10, name: 'Recycled Materials', type: 'renewable', icon: <Recycle className="w-8 h-8" />, color: 'bg-green-400' },
];

const specialTiles = [
  { position: 7, type: 'ladder', from: 7, to: 14 }, // Renewable ladder
  { position: 12, type: 'snake', from: 12, to: 5 }, // Non-renewable snake
  { position: 18, type: 'ladder', from: 18, to: 22 }, // Renewable ladder
  { position: 20, type: 'snake', from: 20, to: 13 }, // Non-renewable snake
];

function App() {
  const navigate = useNavigate();
  const { addPoints } = usePoints();
  const [gameState, setGameState] = useState<GameState>({
    currentPosition: 0,
    score: 0,
    questionsAnswered: 0,
    currentQuestion: null,
    gameStatus: 'playing',
    showFeedback: false,
    feedbackMessage: '',
    isMoving: false,
  });
  const [gameCompleted, setGameCompleted] = useState(false);

  const generateQuestion = () => {
    const randomResource = resources[Math.floor(Math.random() * resources.length)];
    setGameState(prev => ({
      ...prev,
      currentQuestion: randomResource,
    }));
  };

  const handleAnswer = (selectedType: 'renewable' | 'nonrenewable') => {
    if (!gameState.currentQuestion) return;

    const isCorrect = selectedType === gameState.currentQuestion.type;
    const newPosition = Math.min(gameState.currentPosition + (isCorrect ? 2 : 1), 24);

    setGameState(prev => ({
      ...prev,
      isMoving: true,
      score: prev.score + (isCorrect ? 10 : 0),
      questionsAnswered: prev.questionsAnswered + 1,
      showFeedback: true,
      feedbackMessage: isCorrect 
        ? `Correct! ${gameState.currentQuestion!.name} is ${selectedType}! 🎉`
        : `Oops! ${gameState.currentQuestion!.name} is actually ${gameState.currentQuestion!.type}. Keep learning! 💪`,
    }));

    // Animate movement
    setTimeout(() => {
      setGameState(prev => {
        let finalPosition = newPosition;
        
        // Check for special tiles (snakes and ladders)
        const specialTile = specialTiles.find(tile => tile.position === newPosition);
        if (specialTile) {
          finalPosition = specialTile.to;
        }

        const hasWon = finalPosition >= 24;

        // Add points when game is won
        if (hasWon && !gameCompleted) {
          addPoints(prev.score);
          setGameCompleted(true);
        }

        return {
          ...prev,
          currentPosition: finalPosition,
          isMoving: false,
          gameStatus: hasWon ? 'won' : 'playing',
        };
      });
    }, 1000);

    // Hide feedback and generate next question
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showFeedback: false,
        currentQuestion: null,
      }));
      
      if (newPosition < 24) {
        setTimeout(generateQuestion, 500);
      }
    }, 3000);
  };

  const resetGame = () => {
    setGameState({
      currentPosition: 0,
      score: 0,
      questionsAnswered: 0,
      currentQuestion: null,
      gameStatus: 'playing',
      showFeedback: false,
      feedbackMessage: '',
      isMoving: false,
    });
    setGameCompleted(false);
    setTimeout(generateQuestion, 1000);
  };

  const exitGame = () => {
    if (gameState.gameStatus === 'playing' && !gameCompleted) {
      // Add points if exiting during play
      addPoints(gameState.score);
    }
    navigate('/games');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const renderBoard = () => {
    const tiles = [];
    for (let i = 0; i < 25; i++) {
      const isPlayerHere = gameState.currentPosition === i;
      const specialTile = specialTiles.find(tile => tile.position === i);
      
      tiles.push(
        <div
          key={i}
          className={`
            relative w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center text-white font-bold
            ${i === 0 ? 'bg-green-600' : i === 24 ? 'bg-gold bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-blue-400'}
            ${isPlayerHere ? 'ring-4 ring-purple-500 scale-110' : ''}
            transition-all duration-500 ease-in-out
          `}
        >
          {/* Tile number */}
          <span className="text-sm font-bold">{i === 0 ? 'START' : i === 24 ? 'WIN!' : i}</span>
          
          {/* Player piece */}
          {isPlayerHere && (
            <div className={`
              absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full border-2 border-white 
              flex items-center justify-center text-white text-xs font-bold
              ${gameState.isMoving ? 'animate-bounce' : 'animate-pulse'}
            `}>
              🎓
            </div>
          )}
          
          {/* Special tile indicators */}
          {specialTile && (
            <div className="absolute -bottom-1 -right-1 text-xs">
              {specialTile.type === 'ladder' ? '🪜' : '🐍'}
            </div>
          )}
        </div>
      );
    }
    return tiles;
  };

  if (gameState.gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-bounce relative">
          <button
            onClick={exitGame}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            title="Exit Game"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-purple-600 mb-4">You Won!</h1>
          <p className="text-xl text-gray-700 mb-2">Amazing job learning about resources!</p>
          <p className="text-lg text-gray-600 mb-2">
            Score: <span className="font-bold text-green-600">{gameState.score}</span> points
          </p>
          <p className="text-lg text-gray-600 mb-2">
            Points Earned: <span className="font-bold text-yellow-600">+{gameState.score} pts</span>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Questions answered: {gameState.questionsAnswered}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-full text-xl font-bold hover:scale-105 transform transition-all duration-200 shadow-lg"
            >
              Play Again! 🚀
            </button>
            <button
              onClick={exitGame}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-full text-xl font-bold hover:scale-105 transform transition-all duration-200 shadow-lg"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <button
            onClick={exitGame}
            className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            title="Exit Game"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            🌍 Resource Explorer Game 🎮
          </h1>
          <p className="text-xl text-white drop-shadow">Learn about renewable and non-renewable resources!</p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-white rounded-2xl px-6 py-3 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600">{gameState.score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="bg-white rounded-2xl px-6 py-3 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600">{gameState.currentPosition}</div>
            <div className="text-sm text-gray-600">Position</div>
          </div>
          <div className="bg-white rounded-2xl px-6 py-3 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600">{gameState.questionsAnswered}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Board */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Game Board</h2>
              <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
                {renderBoard()}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <span>🪜</span>
                  <span className="text-green-600 font-semibold">Renewable Ladder</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🐍</span>
                  <span className="text-red-600 font-semibold">Non-renewable Snake</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              {gameState.showFeedback ? (
                <div className="text-center">
                  <div className="text-4xl mb-4">
                    {gameState.feedbackMessage.includes('Correct') ? '🎉' : '🤔'}
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    {gameState.feedbackMessage}
                  </p>
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : gameState.currentQuestion ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Classify this resource!</h3>
                  
                  <div className={`${gameState.currentQuestion.color} rounded-2xl p-6 mb-6 text-white shadow-lg`}>
                    <div className="flex justify-center mb-4">
                      {gameState.currentQuestion.icon}
                    </div>
                    <h4 className="text-2xl font-bold">{gameState.currentQuestion.name}</h4>
                  </div>

                  <p className="text-lg mb-6 text-gray-700">Is this resource renewable or non-renewable?</p>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleAnswer('renewable')}
                      disabled={gameState.isMoving}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transform transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🌱 Renewable
                    </button>
                    <button
                      onClick={() => handleAnswer('nonrenewable')}
                      disabled={gameState.isMoving}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transform transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ⛽ Non-renewable
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-xl text-gray-600">Loading next question...</p>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl mt-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">🎯 How to Play</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Classify each resource as renewable or non-renewable</li>
                <li>• Correct answers move you 2 spaces forward (+10 points)</li>
                <li>• Wrong answers move you 1 space forward (keep learning!)</li>
                <li>• Land on renewable ladders to climb up! 🪜</li>
                <li>• Avoid non-renewable snakes that slide you down! 🐍</li>
                <li>• Reach the finish line to win! 🏆</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center mt-6">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transform transition-all duration-200 shadow-lg"
          >
            🔄 Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;