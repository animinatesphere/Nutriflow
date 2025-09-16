import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

// MOCK DATA COMMENTED OUT. Now fetched from Supabase below.
/*
const achievement = { ... };
const isUnlocked = ...;
const progress = ...;
*/

// Supabase Tables:
// achievements: id, title, description, category, tier, points, icon, created_at
// user_achievements: id, user_id, achievement_id, unlocked_date, progress, is_new

const AchievementBadge = ({ achievementId, userId }) => {
  const [achievement, setAchievement] = useState(null);
  const [userAchievement, setUserAchievement] = useState(null);

  useEffect(() => {
    const fetchAchievement = async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();
      if (!error && data) {
        setAchievement(data);
      }
    };
    const fetchUserAchievement = async () => {
      if (!userId || !achievementId) return;
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)
        .single();
      if (!error && data) {
        setUserAchievement(data);
      }
    };
    fetchAchievement();
    fetchUserAchievement();
  }, [achievementId, userId]);
  const getBadgeColor = (tier) => {
    switch (tier) {
      case 'bronze':
        return 'from-amber-600 to-amber-800 border-amber-500';
      case 'silver':
        return 'from-gray-400 to-gray-600 border-gray-400';
      case 'gold':
        return 'from-yellow-400 to-yellow-600 border-yellow-400';
      case 'platinum':
        return 'from-purple-400 to-purple-600 border-purple-400';
      default:
        return 'from-gray-300 to-gray-500 border-gray-400';
    }
  };

  const getIconName = (category) => {
    const iconMap = {
      'knife-skills': 'ChefHat',
      'timing': 'Clock',
      'temperature': 'Thermometer',
      'memory': 'Brain',
      'technique': 'Target',
      'streak': 'Zap',
      'completion': 'Trophy',
      'perfect': 'Star'
    };
    return iconMap?.[category] || 'Award';
  };

  const isUnlocked = !!userAchievement?.unlocked_date;
  const progress = userAchievement?.progress || 0;
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative bg-card border border-border rounded-xl p-4 text-center transition-all duration-300 ${
        isUnlocked ? 'shadow-soft hover:shadow-elevated' : 'opacity-60'
      }`}
    >
      {/* Badge Icon */}
      <div className={`relative mx-auto mb-3 w-16 h-16 rounded-full bg-gradient-to-br ${
        isUnlocked ? getBadgeColor(achievement?.tier) : 'from-gray-300 to-gray-500 border-gray-400'
      } border-2 flex items-center justify-center`}>
        <Icon
          name={getIconName(achievement?.category)}
          size={24}
          color="white"
        />
        {/* Lock overlay for locked achievements */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Icon name="Lock" size={16} color="white" />
          </div>
        )}
        {/* New achievement glow */}
        {isUnlocked && userAchievement?.is_new && (
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full animate-pulse" />
        )}
      </div>
      {/* Achievement Info */}
      <h4 className="font-heading font-semibold text-card-foreground mb-1">
        {achievement?.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {achievement?.description}
      </p>
      {/* Progress Bar for Incomplete Achievements */}
      {!isUnlocked && progress > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-mono font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {/* Achievement Details */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <Icon name="Award" size={12} color="var(--color-muted-foreground)" />
          <span className="text-muted-foreground capitalize">{achievement?.tier}</span>
        </div>
        {isUnlocked && (
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={12} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">{userAchievement?.unlocked_date}</span>
          </div>
        )}
      </div>
      {/* Points Value */}
      <div className="mt-2 pt-2 border-t border-border">
        <div className="flex items-center justify-center space-x-1">
          <Icon name="Coins" size={14} color="var(--color-accent)" />
          <span className="text-sm font-mono font-medium text-accent">
            {achievement?.points} pts
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementBadge;