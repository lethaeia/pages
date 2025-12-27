import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FluentCard } from './FluentCard';
import { TileData } from '../types';
import { Trophy, RotateCcw } from 'lucide-react';

const DinoSprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} shapeRendering="crispEdges">
    <path d="M22 12h-2v-3h-2v-2h-2v-2h-5v2h-2v2h-2v5h2v-2h2v2h2v1h-4v2h-2v2h-2v-4h-3v4h2v2h4v-2h1v2h2v-2h1v-2h1v-2h1v-4h2v4h2v-7z" />
    <circle cx="15" cy="6" r="1" fill="white" />
  </svg>
);

const CactusSprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} shapeRendering="crispEdges">
    <path d="M12 22v-16h-2v16h2z" />
    <path d="M6 14v-4h2v4h2v2h-4z" />
    <path d="M16 14v-6h2v6h-2z" />
    <path d="M10 16h4v2h-4z" />
  </svg>
);

const BirdSprite = ({ className, frame }: { className?: string; frame: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} shapeRendering="crispEdges">
    {frame % 2 === 0 ? (
      <path d="M22 13h-4v-2h-6v2h-2v2h-4v-4h-4v2h4v2h4v-2h2v2h8v-2z" />
    ) : (
      <path d="M22 12h-4v2h-6v-2h-2v-2h-4v2h-4v-2h4v-1h4v1h2v2h8v-2z" />
    )}
  </svg>
);

const GRAVITY = -0.45;
const JUMP_FORCE = 8.8;
const GROUND_Y = 0;

const START_SPEED = 3.5;
const MAX_SPEED = 11;
const ACCELERATION = 0.0005;

interface Obstacle {
  id: number;
  type: 'CACTUS' | 'BIRD';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DinoGameProps {
  data: TileData;
}

export const DinoGame: React.FC<DinoGameProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const scoreIntervalRef = useRef<number>(0);
  const birdFrameRef = useRef<number>(0);

  const dinoY = useRef(0);
  const dinoVelocity = useRef(0);
  const obstacles = useRef<Obstacle[]>([]);
  const currentSpeed = useRef(START_SPEED);
  const frameCount = useRef(0);
  const nextSpawnGap = useRef(100);

  const resetGame = () => {
    dinoY.current = 0;
    dinoVelocity.current = 0;
    obstacles.current = [];
    currentSpeed.current = START_SPEED;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    frameCount.current = 0;
    nextSpawnGap.current = 100;
  };

  const calculateNextGap = () => {
    const timeInAir = (Math.abs(JUMP_FORCE) / Math.abs(GRAVITY)) * 2;
    const jumpDistance = timeInAir * currentSpeed.current;

    const reactionBuffer = 80 + currentSpeed.current * 8;
    const minSafeGap = jumpDistance + reactionBuffer;

    let variance = Math.random() * 400;

    if (Math.random() < 0.15) {
      variance += 300 + Math.random() * 200;
    }

    const difficultyFactor = Math.min(score / 3000, 0.5);
    variance = variance * (1 - difficultyFactor);

    variance = Math.max(0, variance);

    return minSafeGap + variance;
  };

  const spawnObstacle = (containerWidth: number) => {
    const birdStartScore = 20;
    const scoreFactor = Math.min((score - birdStartScore) / 1000, 1);
    const birdProbability = 0.4 + 0.3 * scoreFactor;

    const canSpawnBird = score > birdStartScore;

    const lastObs = obstacles.current[obstacles.current.length - 1];
    const lastWasBird = lastObs && lastObs.type === 'BIRD';

    const isBird = canSpawnBird && !lastWasBird && Math.random() < birdProbability;

    let obstacle: Obstacle;

    if (isBird) {
      obstacle = {
        id: Date.now(),
        type: 'BIRD',
        x: containerWidth,
        y: 56,
        width: 48,
        height: 34,
      };
    } else {
      obstacle = {
        id: Date.now(),
        type: 'CACTUS',
        x: containerWidth,
        y: 0,
        width: 26,
        height: 36,
      };
    }

    obstacles.current.push(obstacle);

    nextSpawnGap.current = calculateNextGap();
  };

  const updateGame = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;

    if (currentSpeed.current < MAX_SPEED) {
      currentSpeed.current += ACCELERATION;
    }

    dinoVelocity.current += GRAVITY;
    dinoY.current += dinoVelocity.current;

    if (dinoY.current < GROUND_Y) {
      dinoY.current = GROUND_Y;
      dinoVelocity.current = 0;
    }

    obstacles.current.forEach(obs => {
      obs.x -= currentSpeed.current;
    });

    obstacles.current = obstacles.current.filter(obs => obs.x + obs.width > -50);

    const lastObs = obstacles.current[obstacles.current.length - 1];

    let shouldSpawn = false;
    if (!lastObs) {
      shouldSpawn = true;
    } else {
      const distFromRightEdge = containerWidth - (lastObs.x + lastObs.width);
      if (distFromRightEdge > nextSpawnGap.current) {
        shouldSpawn = true;
      }
    }

    if (shouldSpawn) {
      spawnObstacle(containerWidth);
    }

    const dinoHitbox = {
      x: 24,
      y: dinoY.current + 4,
      width: 16,
      height: 20,
    };

    for (const obs of obstacles.current) {
      const obsPadding = obs.type === 'BIRD' ? 8 : 6;

      const xOverlap = dinoHitbox.x < obs.x + obs.width - obsPadding && dinoHitbox.x + dinoHitbox.width > obs.x + obsPadding;
      const yOverlap = dinoHitbox.y < obs.y + obs.height - obsPadding && dinoHitbox.y + dinoHitbox.height > obs.y + obsPadding;

      if (xOverlap && yOverlap) {
        handleGameOver();
        return;
      }
    }

    renderFrame();
    frameCount.current++;
    requestRef.current = requestAnimationFrame(updateGame);
  }, [score]);

  const handleGameOver = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    setHighScore(prev => Math.max(prev, score));
    cancelAnimationFrame(requestRef.current);
    clearInterval(scoreIntervalRef.current);
  };

  const [, setTick] = useState(0);
  const renderFrame = () => setTick(t => t + 1);

  const jump = useCallback(() => {
    if (dinoY.current <= GROUND_Y + 1) {
      dinoVelocity.current = JUMP_FORCE;
    }
  }, []);

  const handleInteraction = (e: React.MouseEvent | KeyboardEvent) => {
    if (e.type === 'click') (e as React.MouseEvent).stopPropagation();

    if (isGameOver) resetGame();
    else if (isPlaying) jump();
    else resetGame();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleInteraction(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, jump]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      requestRef.current = requestAnimationFrame(updateGame);

      const birdInterval = setInterval(() => {
        birdFrameRef.current = (birdFrameRef.current + 1) % 2;
      }, 150);

      scoreIntervalRef.current = window.setInterval(() => {
        setScore(s => s + 1);
      }, 100);

      return () => {
        cancelAnimationFrame(requestRef.current);
        clearInterval(scoreIntervalRef.current);
        clearInterval(birdInterval);
      };
    }
  }, [isPlaying, isGameOver, updateGame]);

  const Icon = data.icon;

  return (
    <FluentCard
      className="h-full relative overflow-hidden select-none touch-manipulation cursor-pointer group"
      onClick={handleInteraction as any}
      interactive={true}
    >
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">

        <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-opacity duration-300 z-20 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
              <Icon size={24} strokeWidth={1.5} />
            </div>
            {highScore > 0 && (
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                <Trophy size={10} /> {highScore}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-black dark:text-white leading-tight">
              {isGameOver ? 'Game Over' : data.title}
            </h3>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 leading-snug line-clamp-2 font-medium">
              {isGameOver ? `Score: ${score}. Click to retry.` : 'Press Space to play.'}
            </p>
          </div>

          {!isPlaying && isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-[1px] z-30">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg text-blue-500 animate-bounce">
                <RotateCcw size={24} />
              </div>
            </div>
          )}
        </div>

        <div className={`absolute inset-0 transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>

          <div className="absolute top-4 right-5 font-mono text-xl font-bold text-gray-400 dark:text-gray-500 select-none z-10">
            {score.toString().padStart(5, '0')}
          </div>

          <div className="absolute bottom-[20px] left-0 right-0 h-[1px] bg-gray-300 dark:bg-gray-700 mx-5" />

          <div className="absolute inset-x-5 bottom-[20px] h-[100px]">

            <div
              className="absolute left-[20px] w-[30px] h-[30px] transition-transform will-change-transform text-gray-800 dark:text-gray-100"
              style={{ bottom: dinoY.current }}
            >
              <DinoSprite className="w-full h-full drop-shadow-sm" />
            </div>

            {obstacles.current.map(obs => (
              <div
                key={obs.id}
                className="absolute text-gray-800 dark:text-gray-100 transition-none will-change-transform"
                style={{
                  left: obs.x,
                  bottom: obs.y,
                  width: obs.width,
                  height: obs.height,
                }}
              >
                {obs.type === 'CACTUS' ? (
                  <CactusSprite className="w-full h-full" />
                ) : (
                  <BirdSprite className="w-full h-full" frame={birdFrameRef.current} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FluentCard>
  );
};
