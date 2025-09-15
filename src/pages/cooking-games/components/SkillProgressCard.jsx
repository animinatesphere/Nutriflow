import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SkillProgressCard = ({ skillData, userProgress }) => {
  const getSkillIcon = (skill) => {
    const iconMap = {
      'Knife Skills': 'ChefHat',
      'Timing': 'Clock',
      'Temperature': 'Thermometer',
      'Memory': 'Brain',
      'Technique': 'Target',
      'Plating': 'Palette'
    };
    return iconMap?.[skill] || 'Utensils';
  };

  const getSkillLevel = (xp) => {
    if (xp >= 1000) return { level: 'Master', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (xp >= 750) return { level: 'Expert', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (xp >= 500) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-100' };
    if (xp >= 250) return { level: 'Intermediate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Beginner', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const getProgressToNextLevel = (xp) => {
    const levels = [0, 250, 500, 750, 1000];
    const currentLevelIndex = levels?.findIndex(level => xp < level);
    
    if (currentLevelIndex === -1) return { progress: 100, nextLevel: 1000, current: xp };
    
    const currentLevel = levels?.[currentLevelIndex - 1] || 0;
    const nextLevel = levels?.[currentLevelIndex];
    const progress = ((xp - currentLevel) / (nextLevel - currentLevel)) * 100;
    
    return { progress, nextLevel, current: xp - currentLevel, needed: nextLevel - currentLevel };
  };

  // This component should be refactored to use only real userProgress data from Supabase.
  // Remove or rewrite any logic that references mock skillData or mock stats.
  return null;
};

export default SkillProgressCard;