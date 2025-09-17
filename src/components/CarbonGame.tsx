// src/components/CarbonGame.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { usePoints } from "../context/PointsContext";

const CarbonGame: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints } = usePoints();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [playerIcon, setPlayerIcon] = useState<"🌳" | "☀" | "🌬">("🌳");
  const [highScore, setHighScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [lives, setLives] = useState(3); // Add lives state
  const [gameCompleted, setGameCompleted] = useState(false);

  const player = useRef({ x: 200, y: 450, width: 60, height: 60, speed: 9 });
  const objects = useRef<{ x: number; y: number; type: "good" | "bad"; icon: string; id: number }[]>([]);
  const lastRenderTime = useRef(0);
  const objectSpawnRate = useRef(400); // ms between object spawns
  const objectIdCounter = useRef(0);
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; color: string; life: number; size: number }[]>([]);
  const gameSpeed = useRef(1); // Add game speed multiplier

  // Preload icons
  useEffect(() => {
    const preloadIcons = () => {
      const icons = ["☁", "♻", "🚴", "☀", "🏭", "🛍", "🚗"];
      icons.forEach(icon => {
        const span = document.createElement('span');
        span.textContent = icon;
        span.style.visibility = 'hidden';
        document.body.appendChild(span);
        setTimeout(() => document.body.removeChild(span), 100);
      });
    };
    preloadIcons();
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('carbonGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('carbonGameHighScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (!isRunning) return;

    const gameStartTime = Date.now();
    const gameTimer = setInterval(() => {
      setGameTime(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(gameTimer);
    };
  }, [isRunning]);

  const createParticles = (x: number, y: number, color: string, count: number = 10) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color,
        life: 30,
        size: Math.random() * 4 + 2
      });
    }
  };

  const loseLife = () => {
    setLives(prevLives => {
      const newLives = prevLives - 1;
      
      // Slow down the game when losing lives
      if (newLives === 2) {
        gameSpeed.current = 0.8;
      } else if (newLives === 1) {
        gameSpeed.current = 0.6;
      }
      
      // Game over when no lives left
      if (newLives <= 0) {
        setIsRunning(false);
        // Add points when game ends
        if (!gameCompleted) {
          addPoints(score);
          setGameCompleted(true);
        }
      }
      
      return newLives;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    let animationFrameId: number;
    let objectIntervalId: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        player.current.x = Math.max(0, player.current.x - player.current.speed);
      }
      if (e.key === "ArrowRight") {
        player.current.x = Math.min(canvas.width - player.current.width, player.current.x + player.current.speed);
      }
      // Switch player icon with number keys
      if (e.key === "1") setPlayerIcon("🌳");
      if (e.key === "2") setPlayerIcon("☀");
      if (e.key === "3") setPlayerIcon("🌬");
    };

    const spawnObject = () => {
      const x = Math.random() * (canvas.width - 40);
      const type = Math.random() > 0.5 ? "good" : "bad";
      
      let icon = "";
      if (type === "good") {
        const goodIcons = ["♻", "🚴", "☀", "🌳"];
        icon = goodIcons[Math.floor(Math.random() * goodIcons.length)];
      } else {
        const badIcons = ["🏭", "🛍", "🚗", "✈️"];
        icon = badIcons[Math.floor(Math.random() * badIcons.length)];
      }
      
      objects.current.push({ 
        x, 
        y: -40, 
        type, 
        icon,
        id: objectIdCounter.current++
      });
    };

    const update = (timestamp: number) => {
      // Calculate delta time for smoother animation
      const deltaTime = timestamp - (lastRenderTime.current || timestamp);
      lastRenderTime.current = timestamp;

      // Clear canvas with a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F7FA");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw player with shadow effect
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      
      // Draw player (green basket with icon)
      ctx.fillStyle = playerIcon === "🌳" ? "rgba(50, 205, 50, 0.8)" : 
                      playerIcon === "☀" ? "rgba(255, 215, 0, 0.8)" : 
                      "rgba(100, 149, 237, 0.8)";
      ctx.beginPath();
      ctx.roundRect(player.current.x, player.current.y, player.current.width, player.current.height, 10);
      ctx.fill();
      
      ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw player icon
      ctx.shadowBlur = 0;
      ctx.font = "36px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        playerIcon, 
        player.current.x + player.current.width/2, 
        player.current.y + player.current.height/2
      );

      // Update and draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }
        
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Update and draw objects
      objects.current.forEach((obj, index) => {
        // Move object with consistent speed regardless of frame rate
        const speedMultiplier = 1 + (gameTime * 0.01); // Gradually increase speed over time
        obj.y += 2.5 * speedMultiplier * gameSpeed.current * (deltaTime / 16.67); // Normalize to 60fps
        
        // Draw object with shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        // Draw object background
        ctx.fillStyle = obj.type === "good" ? "rgba(173, 216, 230, 0.9)" : "rgba(255, 99, 71, 0.9)";
        ctx.beginPath();
        ctx.roundRect(obj.x, obj.y, 40, 40, 8);
        ctx.fill();
        
        ctx.strokeStyle = obj.type === "good" ? "darkblue" : "darkred";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw object icon
        ctx.shadowBlur = 0;
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(obj.icon, obj.x + 20, obj.y + 20);

        // Collision detection
        if (
          obj.x < player.current.x + player.current.width &&
          obj.x + 40 > player.current.x &&
          obj.y < player.current.y + player.current.height &&
          obj.y + 40 > player.current.y
        ) {
          if (obj.type === "good") {
            setScore(prev => prev + 1);
            createParticles(
              player.current.x + player.current.width/2, 
              player.current.y + player.current.height/2, 
              "#00FF00", 
              15
            );
          } else {
            loseLife();
            createParticles(
              player.current.x + player.current.width/2, 
              player.current.y + player.current.height/2, 
              "#FF0000", 
              15
            );
            
            // Screen shake effect on bad collision
            canvas.style.transform = "translate(5px, 5px)";
            setTimeout(() => {
              if (canvas) canvas.style.transform = "translate(0, 0)";
            }, 100);
          }
          objects.current.splice(index, 1);
        }

        // Remove off-screen objects and check for missed good items
        if (obj.y > canvas.height) {
          if (obj.type === "good") {
            loseLife();
          }
          objects.current.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    if (isRunning) {
      window.addEventListener("keydown", handleKeyDown);
      objectIntervalId = setInterval(spawnObject, objectSpawnRate.current);
      lastRenderTime.current = performance.now();
      animationFrameId = requestAnimationFrame(update);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        clearInterval(objectIntervalId);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isRunning, playerIcon, gameTime, lives]);

  const resetGame = () => {
    setIsRunning(false);
    setScore(0);
    setGameTime(0);
    setLives(3); // Reset lives
    gameSpeed.current = 1; // Reset game speed
    objects.current = [];
    particles.current = [];
    player.current.x = 200;
    setGameCompleted(false);
    
    // Reset canvas position if it was shaken
    if (canvasRef.current) {
      canvasRef.current.style.transform = "translate(0, 0)";
    }
  };

  const exitGame = () => {
    if (isRunning && !gameCompleted) {
      // Add points if exiting during play
      addPoints(score);
    }
    navigate('/games');
  };

  const startGame = () => {
    resetGame();
    setIsRunning(true);
    setShowTutorial(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 font-sans">
      <div className="relative w-full max-w-4xl">
        <button
          onClick={exitGame}
          className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
          title="Exit Game"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-green-700 drop-shadow-md">🌱 Carbon Catcher Game</h1>
          <p className="text-gray-600 mb-6">Catch eco-friendly items, avoid pollutants!</p>
        </div>
      </div>
      
      <div className="flex gap-8 mb-4 bg-white rounded-xl p-4 shadow-md">
        <div className="text-lg font-semibold text-gray-700">Score: <span className="text-green-600">{score}</span></div>
        <div className="text-lg font-semibold text-gray-700">Time: <span className="text-blue-600">{gameTime}s</span></div>
        <div className="text-lg font-semibold text-gray-700">High Score: <span className="text-purple-600">{highScore}</span></div>
        <div className="text-lg font-semibold text-gray-700">Lives: <span className="text-red-600">{'❤️'.repeat(lives)}</span></div>
      </div>
      
      <div className="mb-4 bg-white rounded-xl p-3 shadow-md">
        <span className="font-medium text-gray-700">Player: </span>
        <button 
          onClick={() => setPlayerIcon("🌳")} 
          className={`px-3 py-2 rounded-lg transition-all ${playerIcon === "🌳" ? "bg-green-200 shadow-inner" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          🌳 Tree
        </button>
        <button 
          onClick={() => setPlayerIcon("☀")} 
          className={`px-3 py-2 rounded-lg mx-2 transition-all ${playerIcon === "☀" ? "bg-yellow-200 shadow-inner" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          ☀ Solar
        </button>
        <button 
          onClick={() => setPlayerIcon("🌬")} 
          className={`px-3 py-2 rounded-lg transition-all ${playerIcon === "🌬" ? "bg-blue-200 shadow-inner" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          🌬 Turbine
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border-2 border-gray-300 rounded-xl shadow-lg transition-transform"
      />
      
      <div className="mt-6 flex gap-4">
        {!isRunning && lives > 0 && (
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium shadow-md transition-transform hover:scale-105"
          >
            Start Game
          </button>
        )}
        {!isRunning && lives <= 0 && (
          <div className="text-center">
            <div className="bg-white rounded-xl p-6 shadow-md mb-4">
              <div className="text-4xl mb-2">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Over!</h2>
              <div className="text-lg text-gray-600 mb-2">Final Score: <span className="font-bold text-green-600">{score}</span></div>
              <div className="text-lg text-gray-600 mb-4">Points Earned: <span className="font-bold text-yellow-600">+{score} pts</span></div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium shadow-md transition-transform hover:scale-105"
                >
                  Play Again
                </button>
                <button
                  onClick={exitGame}
                  className="px-6 py-3 rounded-xl bg-gray-600 text-white hover:bg-gray-700 font-medium shadow-md transition-transform hover:scale-105"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
        {isRunning && (
          <button
            onClick={() => setIsRunning(false)}
            className="px-8 py-3 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 font-medium shadow-md transition-transform hover:scale-105"
          >
            Pause Game
          </button>
        )}
        <button
          onClick={resetGame}
          className="px-8 py-3 rounded-xl bg-gray-600 text-white hover:bg-gray-700 font-medium shadow-md transition-transform hover:scale-105"
        >
          Reset
        </button>
      </div>
      
      {showTutorial && (
        <div className="mt-6 p-6 bg-white rounded-xl shadow-md max-w-md border border-green-200">
          <h2 className="text-xl font-semibold mb-3 text-green-700">How to Play:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Use <kbd className="px-2 py-1 bg-gray-100 rounded border">←</kbd> <kbd className="px-2 py-1 bg-gray-100 rounded border">→</kbd> arrow keys to move your basket</li>
            <li>Catch eco-friendly items (<span className="text-blue-500">♻ 🚴 ☀ 🌳</span>) for +1 point</li>
            <li>Avoid harmful items (<span className="text-red-500">🏭 🛍 🚗 ✈️</span>) or lose a life</li>
            <li>Missing eco-friendly items also costs a life</li>
            <li>You have 3 lives - game slows down as you lose lives</li>
            <li>Press <kbd className="px-2 py-1 bg-gray-100 rounded border">1</kbd>, <kbd className="px-2 py-1 bg-gray-100 rounded border">2</kbd>, <kbd className="px-2 py-1 bg-gray-100 rounded border">3</kbd> to change basket type</li>
            <li>The game gets faster over time!</li>
          </ul>
          <button 
            onClick={() => setShowTutorial(false)}
            className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
};

export default CarbonGame;