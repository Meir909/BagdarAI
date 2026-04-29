import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Star, TrendingUp, Target, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPProgress {
  totalXP: number;
  currentLevel: number;
  levelXP: number;
  nextLevelXP: number;
  achievements: string[];
  dailyXP: number;
  weeklyXP: number;
  lastActiveAt: Date;
}

interface XPSystemProps {
  userId: string;
  className?: string;
}

export default function XPSystem({ userId, className = '' }: XPSystemProps) {
  const [xpData, setXPData] = useState<XPProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  useEffect(() => {
    loadXPData();
  }, [userId]);

  const loadXPData = async () => {
    try {
      const response = await fetch('/api/gamification/xp');
      const data = await response.json();
      setXPData(data);
    } catch (error) {
      console.error('Failed to load XP data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!xpData) return 0;
    const totalForCurrentLevel = xpData.nextLevelXP - (xpData.nextLevelXP - 100);
    const progress = xpData.levelXP - (xpData.nextLevelXP - 100);
    return (progress / totalForCurrentLevel) * 100;
  };

  const getLevelColor = () => {
    if (!xpData) return 'from-gray-600 to-gray-800';
    
    const level = xpData.currentLevel;
    if (level >= 50) return 'from-purple-600 to-pink-600';
    if (level >= 40) return 'from-red-600 to-orange-600';
    if (level >= 30) return 'from-orange-600 to-yellow-600';
    if (level >= 20) return 'from-yellow-600 to-green-600';
    if (level >= 10) return 'from-green-600 to-blue-600';
    return 'from-blue-600 to-purple-600';
  };

  const getLevelTitle = () => {
    if (!xpData) return 'Beginner';
    
    const level = xpData.currentLevel;
    if (level >= 50) return 'Legend';
    if (level >= 40) return 'Master';
    if (level >= 30) return 'Expert';
    if (level >= 20) return 'Advanced';
    if (level >= 10) return 'Intermediate';
    return 'Beginner';
  };

  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-lg shadow-lg p-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!xpData) {
    return (
      <div className={cn('bg-white rounded-lg shadow-lg p-6', className)}>
        <p className="text-gray-500 text-center">Unable to load XP data</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && newLevel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowLevelUp(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-xl p-8 text-center max-w-md"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Level Up!</h2>
              <p className="text-xl text-gray-600 mb-4">You reached level {newLevel}</p>
              <div className="text-lg font-semibold text-blue-600">
                {getLevelTitle()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main XP Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Level {xpData.currentLevel}</h3>
            <p className="text-gray-600">{getLevelTitle()}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{xpData.totalXP}</div>
            <div className="text-sm text-gray-500">Total XP</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Level {xpData.currentLevel}</span>
            <span>{xpData.levelXP} / {xpData.nextLevelXP} XP</span>
            <span>Level {xpData.currentLevel + 1}</span>
          </div>
          
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getLevelColor()}`}
              initial={{ width: '0%' }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white mix-blend-difference">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
          </div>
        </div>

        {/* XP Needed */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{xpData.nextLevelXP - xpData.levelXP}</span> XP to next level
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Flame}
          label="Daily XP"
          value={xpData.dailyXP}
          color="from-orange-500 to-red-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Weekly XP"
          value={xpData.weeklyXP}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Target}
          label="Achievements"
          value={xpData.achievements.length}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Star}
          label="Avg. XP/Day"
          value={Math.round(xpData.weeklyXP / 7)}
          color="from-blue-500 to-cyan-500"
        />
      </div>

      {/* Recent Achievements */}
      {xpData.achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Trophy size={20} className="text-yellow-500" />
            <span>Recent Achievements</span>
          </h3>
          <div className="space-y-2">
            {xpData.achievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
              >
                <Star size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-700">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* XP Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">XP Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            icon={Zap}
            label="Mini Game Complete"
            xp={30}
            time="2 hours ago"
          />
          <ActivityItem
            icon={Star}
            label="Skill Unlocked"
            xp={20}
            time="5 hours ago"
          />
          <ActivityItem
            icon={Trophy}
            label="Daily Quest Complete"
            xp={15}
            time="1 day ago"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-3`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  xp: number;
  time: string;
}

function ActivityItem({ icon: Icon, label, xp, time }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon size={16} className="text-blue-600" />
        </div>
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-green-600">+{xp} XP</div>
        <div className="text-xs text-gray-500">{time}</div>
      </div>
    </div>
  );
}

// XP Bar Component for use in other components
export function XPBar({ xp, maxXP, showLabel = true }: { xp: number; maxXP: number; showLabel?: boolean }) {
  const percentage = Math.min((xp / maxXP) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{xp} / {maxXP} XP</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Level Badge Component
export function LevelBadge({ level, size = 'md' }: { level: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div className={cn(
      'bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg',
      sizeClasses[size]
    )}>
      {level}
    </div>
  );
}
