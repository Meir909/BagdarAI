import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Star, Zap, ChevronRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  xp_required: number;
  level: number;
  icon: string;
  parent_id?: string;
  unlocks: string[];
  category: string;
  unlocked?: boolean;
  progress?: number;
  xpEarned?: number;
  completedAt?: Date;
  children?: Skill[];
}

interface SkillNodeProps {
  skill: Skill;
  onUnlock: (skillId: string) => void;
  userXP: number;
  isParent?: boolean;
  position?: { x: number; y: number };
}

export default function SkillNode({ skill, onUnlock, userXP, isParent = false }: SkillNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const canUnlock = !skill.unlocked && userXP >= skill.xp_required;
  const isCompleted = skill.unlocked && skill.completedAt;
  const progress = skill.progress || 0;

  const handleUnlock = async () => {
    if (!canUnlock || isUnlocking) return;
    
    setIsUnlocking(true);
    try {
      await onUnlock(skill.id);
    } finally {
      setIsUnlocking(false);
    }
  };

  const getNodeColor = () => {
    if (isCompleted) return 'bg-gradient-to-br from-yellow-400 to-orange-500';
    if (skill.unlocked) return 'bg-gradient-to-br from-blue-500 to-purple-600';
    if (canUnlock) return 'bg-gradient-to-br from-green-500 to-emerald-600';
    return 'bg-gray-300';
  };

  const getNodeBorderColor = () => {
    if (isCompleted) return 'border-yellow-500';
    if (skill.unlocked) return 'border-blue-500';
    if (canUnlock) return 'border-green-500';
    return 'border-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* Skill Node */}
      <motion.div
        className={cn(
          'w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-lg',
          getNodeColor(),
          getNodeBorderColor(),
          isParent && 'w-24 h-24'
        )}
        onClick={canUnlock ? handleUnlock : undefined}
        whileTap={canUnlock ? { scale: 0.95 } : {}}
      >
        {/* Icon */}
        <div className="text-2xl mb-1">{skill.icon}</div>
        
        {/* Status Icon */}
        <div className="absolute top-1 right-1">
          {isCompleted && <Trophy size={16} className="text-yellow-300" />}
          {skill.unlocked && !isCompleted && <Star size={16} className="text-white" />}
          {!skill.unlocked && canUnlock && <Unlock size={16} className="text-white" />}
          {!skill.unlocked && !canUnlock && <Lock size={16} className="text-gray-500" />}
        </div>

        {/* Progress Ring */}
        {skill.unlocked && !isCompleted && (
          <div className="absolute inset-0 rounded-full border-2 border-white/30">
            <div
              className="absolute inset-0 rounded-full border-2 border-white border-t-transparent border-r-transparent transform rotate-45"
              style={{
                clipPath: `polygon(50% 50%, ${50 + progress/2}% 0, 100% 0, 100% 100%, 0 100%, 0 0, ${50 - progress/2}% 0)`
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Skill Name */}
      <div className="text-center mt-2">
        <p className="text-xs font-semibold text-gray-800 max-w-[100px] truncate">
          {skill.name}
        </p>
        <p className="text-xs text-gray-500">Lvl {skill.level}</p>
      </div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-64 p-3 bg-white rounded-lg shadow-xl border border-gray-200 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">{skill.name}</h4>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  Level {skill.level}
                </span>
              </div>
              
              <p className="text-xs text-gray-600">{skill.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Zap size={12} className="text-yellow-500" />
                  <span>{skill.xp_required} XP</span>
                </div>
                
                {skill.unlocked && (
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-blue-500" />
                    <span>{progress}% Complete</span>
                  </div>
                )}
              </div>

              {!skill.unlocked && (
                <div className="pt-2 border-t border-gray-200">
                  {canUnlock ? (
                    <button
                      onClick={handleUnlock}
                      disabled={isUnlocking}
                      className="w-full px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                      {isUnlocking ? 'Unlocking...' : 'Unlock Skill'}
                    </button>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Need {skill.xp_required - userXP} more XP
                    </div>
                  )}
                </div>
              )}

              {isCompleted && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-green-600 font-semibold flex items-center space-x-1">
                    <Trophy size={12} />
                    <span>Completed!</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SkillTreeProps {
  skills: Skill[];
  userXP: number;
  onSkillUnlock: (skillId: string) => void;
}

export function SkillTree({ skills, userXP, onSkillUnlock }: SkillTreeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = Array.from(new Set(skills.map(skill => skill.category)));
  
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const renderSkillConnections = () => {
    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '600px' }}>
        {skills.map(skill => {
          if (!skill.parent_id) return null;
          
          const parentSkill = skills.find(s => s.id === skill.parent_id);
          if (!parentSkill) return null;

          // This would need actual positioning logic
          return (
            <line
              key={`${skill.parent_id}-${skill.id}`}
              x1="50%" // Parent position
              y1="50%"
              x2="50%" // Child position
              y2="50%"
              stroke={skill.unlocked ? '#3B82F6' : '#D1D5DB'}
              strokeWidth="2"
              strokeDasharray={skill.unlocked ? '0' : '5,5'}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            )}
          >
            All Skills
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap capitalize',
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="relative">
        {renderSkillConnections()}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.map(skill => (
            <div key={skill.id} className="flex justify-center">
              <SkillNode
                skill={skill}
                onUnlock={onSkillUnlock}
                userXP={userXP}
                isParent={!skill.parent_id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap size={20} className="text-yellow-500" />
              <span className="font-semibold">{userXP} Total XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star size={20} className="text-blue-500" />
              <span className="font-semibold">
                {skills.filter(s => s.unlocked).length} / {skills.length} Skills
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy size={20} className="text-green-500" />
            <span className="font-semibold">
              {skills.filter(s => s.completedAt).length} Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
