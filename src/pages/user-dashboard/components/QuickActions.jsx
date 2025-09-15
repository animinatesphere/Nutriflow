import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onQuickLog, onBrowseRecipes, onStartGame, subscriptionTier }) => {
  const quickActions = [
    {
      id: 'log-meal',
      title: 'Log Meal',
      description: 'Quick meal entry',
      icon: 'Plus',
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      onClick: onQuickLog,
      premium: false
    },
    {
      id: 'browse-recipes',
      title: 'Browse Recipes',
      description: 'Find new recipes',
      icon: 'Book',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      onClick: onBrowseRecipes,
      premium: false
    },
    {
      id: 'start-game',
      title: 'Start Game',
      description: 'Cooking challenge',
      icon: 'Gamepad2',
      color: 'bg-accent',
      textColor: 'text-accent-foreground',
      onClick: onStartGame,
      premium: false
    },
    {
      id: 'ai-suggestions',
      title: 'AI Suggestions',
      description: 'Personalized recommendations',
      icon: 'Sparkles',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-white',
      onClick: () => console.log('AI Suggestions'),
      premium: true
    },
    {
      id: 'nutrition-analysis',
      title: 'Deep Analysis',
      description: 'Advanced nutrition insights',
      icon: 'BarChart3',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      textColor: 'text-white',
      onClick: () => console.log('Nutrition Analysis'),
      premium: true
    },
    {
      id: 'meal-prep',
      title: 'Meal Prep Guide',
      description: 'Weekly prep planning',
      icon: 'Calendar',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      textColor: 'text-white',
      onClick: () => console.log('Meal Prep'),
      premium: true
    }
  ];

  const isPremium = subscriptionTier === 'Premium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card rounded-xl border border-border p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Quick Actions</h2>
        {!isPremium && (
          <Link
            to="/subscription"
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-soft"
          >
            <Icon name="Crown" size={16} />
            <span className="text-sm font-medium">Upgrade</span>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions?.map((action, index) => {
          const isLocked = action?.premium && !isPremium;
          
          return (
            <motion.button
              key={action?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
              onClick={isLocked ? undefined : action?.onClick}
              disabled={isLocked}
              className={`relative p-4 rounded-xl transition-all duration-300 text-left group ${
                isLocked 
                  ? 'bg-muted/50 cursor-not-allowed opacity-60' 
                  : `${action?.color} hover:shadow-elevated cursor-pointer`
              }`}
            >
              {/* Premium Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-2">
                    <Icon name="Lock" size={16} color="var(--color-muted-foreground)" />
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isLocked ? 'bg-muted' : 'bg-white/20'
                }`}>
                  <Icon 
                    name={action?.icon} 
                    size={20} 
                    color={isLocked ? 'var(--color-muted-foreground)' : 'white'} 
                  />
                </div>
                
                {action?.premium && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Crown" size={12} color={isLocked ? 'var(--color-muted-foreground)' : 'white'} />
                    <span className={`text-xs font-medium ${
                      isLocked ? 'text-muted-foreground' : 'text-white/80'
                    }`}>
                      PRO
                    </span>
                  </div>
                )}
              </div>
              <h3 className={`text-sm font-medium mb-1 ${
                isLocked ? 'text-muted-foreground' : action?.textColor
              }`}>
                {action?.title}
              </h3>
              <p className={`text-xs ${
                isLocked ? 'text-muted-foreground' : `${action?.textColor} opacity-80`
              }`}>
                {action?.description}
              </p>
              {/* Hover Effect */}
              {!isLocked && (
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </motion.button>
          );
        })}
      </div>
      {/* Premium Upgrade Banner */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Icon name="Sparkles" size={20} color="white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-purple-900">Unlock Premium Features</h4>
              <p className="text-xs text-purple-700">
                Get AI-powered suggestions, advanced analytics, and personalized meal prep guides
              </p>
            </div>
            <Link
              to="/subscription"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Upgrade
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuickActions;