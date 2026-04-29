import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Trophy, Star, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  task_id: string;
  task: string;
  code_snippet?: string;
  scenario?: string;
  choices: string[];
  correct_answer: number;
  explanation: string;
  xp_reward: number;
}

interface MiniGame {
  id: string;
  career: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  xp_reward: number;
  category: string;
  icon: string;
  tasks: Task[];
}

interface GameInterfaceProps {
  game: MiniGame;
  onComplete: (results: GameResults) => void;
  onExit: () => void;
}

interface GameResults {
  gameId: string;
  score: number;
  tasksCompleted: number;
  totalTasks: number;
  timeSpent: number;
  xpEarned: number;
  results: TaskResult[];
}

interface TaskResult {
  task_id: string;
  selected_answer: number;
  is_correct: boolean;
  time_spent: number;
}

export default function GameInterface({ game, onComplete, onExit }: GameInterfaceProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [startTime] = useState(Date.now());
  const [taskStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(game.duration);

  const currentTask = game.tasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === game.tasks.length - 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = () => {
    // Submit current answer if selected, then complete game
    if (selectedAnswer !== null) {
      submitAnswer();
    }
    completeGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentTask.correct_answer;
    const timeSpent = Math.floor((Date.now() - taskStartTime) / 1000);

    const result: TaskResult = {
      task_id: currentTask.task_id,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      time_spent: timeSpent,
    };

    setTaskResults(prev => [...prev, result]);
    setShowResult(true);
  };

  const nextTask = () => {
    if (isLastTask) {
      completeGame();
    } else {
      setCurrentTaskIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const completeGame = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = taskResults.filter(r => r.is_correct).length;
    const score = Math.round((correctAnswers / game.tasks.length) * 100);
    const xpEarned = Math.round((score / 100) * game.xp_reward);

    const results: GameResults = {
      gameId: game.id,
      score,
      tasksCompleted: taskResults.length,
      totalTasks: game.tasks.length,
      timeSpent: totalTime,
      xpEarned,
      results: taskResults,
    };

    onComplete(results);
  };

  const getDifficultyColor = () => {
    switch (game.difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <span>{game.icon}</span>
                <span>{game.title}</span>
              </h2>
              <p className="text-blue-100 mt-1">{game.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Clock size={20} />
                  <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm opacity-90">Task</div>
                <div className="font-bold">{currentTaskIndex + 1}/{game.tasks.length}</div>
              </div>
              
              <button
                onClick={onExit}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2"
            initial={{ width: `${(currentTaskIndex / game.tasks.length) * 100}%` }}
            animate={{ width: `${((currentTaskIndex + 1) / game.tasks.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Game Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`task-${currentTaskIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Task Header */}
                <div className="flex items-center justify-between">
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getDifficultyColor())}>
                    {game.difficulty}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Star size={16} />
                    <span>{currentTask.xp_reward} XP</span>
                  </div>
                </div>

                {/* Task Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentTask.task}
                  </h3>

                  {/* Code Snippet */}
                  {currentTask.code_snippet && (
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{currentTask.code_snippet}</pre>
                    </div>
                  )}

                  {/* Scenario */}
                  {currentTask.scenario && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-blue-800">{currentTask.scenario}</p>
                    </div>
                  )}

                  {/* Choices */}
                  <div className="space-y-3">
                    {currentTask.choices.map((choice, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAnswer(index)}
                        className={cn(
                          'w-full p-4 text-left rounded-lg border-2 transition-all',
                          selectedAnswer === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300'
                          )}>
                            {selectedAnswer === index && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-800">{choice}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className={cn(
                      'px-6 py-3 rounded-lg font-medium transition-colors',
                      selectedAnswer !== null
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    )}
                  >
                    Submit Answer
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`result-${currentTaskIndex}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                {/* Result Icon */}
                <div className="flex justify-center">
                  {taskResults[taskResults.length - 1]?.is_correct ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle size={40} className="text-green-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center"
                    >
                      <XCircle size={40} className="text-red-600" />
                    </motion.div>
                  )}
                </div>

                {/* Result Text */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {taskResults[taskResults.length - 1]?.is_correct ? 'Correct!' : 'Not Quite!'}
                  </h3>
                  <p className="text-gray-600">{currentTask.explanation}</p>
                </div>

                {/* XP Earned */}
                {taskResults[taskResults.length - 1]?.is_correct && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full"
                  >
                    <Star size={20} />
                    <span className="font-semibold">+{currentTask.xp_reward} XP</span>
                  </motion.div>
                )}

                {/* Next Button */}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextTask}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>{isLastTask ? 'Complete Game' : 'Next Task'}</span>
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

interface GameCardProps {
  game: MiniGame;
  onPlay: () => void;
  userResults?: any[];
}

export function GameCard({ game, onPlay, userResults = [] }: GameCardProps) {
  const bestScore = userResults.length > 0 
    ? Math.max(...userResults.map(r => r.score))
    : 0;

  const timesPlayed = userResults.length;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{game.icon}</span>
            <div>
              <h3 className="font-bold">{game.title}</h3>
              <p className="text-sm opacity-90">{game.career}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Reward</div>
            <div className="font-bold flex items-center space-x-1">
              <Star size={16} />
              <span>{game.xp_reward}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-gray-600 text-sm">{game.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className={cn(
              'px-2 py-1 rounded-full font-medium',
              game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            )}>
              {game.difficulty}
            </span>
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock size={14} />
              <span>{Math.floor(game.duration / 60)}m</span>
            </div>
          </div>
        </div>

        {timesPlayed > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Best Score</span>
              <span className="font-semibold text-green-600">{bestScore}%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-500">Times Played</span>
              <span className="font-semibold">{timesPlayed}</span>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlay}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Play size={16} />
          <span>Play Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
