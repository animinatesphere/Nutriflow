import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GamificationPanel = ({ currentChallenges, recentScores, availableGames }) => {
  const scoreRefs = useRef([]);
  const challengeRefs = useRef([]);

  useEffect(() => {
    // GSAP animation for score cards
    if (scoreRefs?.current?.length > 0) {
      gsap?.fromTo(
        scoreRefs?.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3
        }
      );
    }

    // GSAP animation for challenge cards
    if (challengeRefs?.current?.length > 0) {
      gsap?.fromTo(
        challengeRefs?.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.5
        }
      );
    }
  }, [currentChallenges, recentScores]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-success',
      medium: 'bg-warning',
      hard: 'bg-error'
    };
    return colors?.[difficulty] || 'bg-muted';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-xl border border-border p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Cooking Challenges</h2>
        <Link
          to="/cooking-games"
          className="flex items-center space-x-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Icon name="Gamepad2" size={16} />
          <span className="text-sm font-medium">Play Games</span>
        </Link>
      </div>
      {/* Current Challenges */}
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Active Challenges</h3>
        <div className="space-y-3">
          {currentChallenges?.map((challenge, index) => (
            <motion.div
              key={challenge?.id}
              ref={el => challengeRefs.current[index] = el}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={challenge?.image}
                  alt={challenge?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {challenge?.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getDifficultyColor(challenge?.difficulty)}`}>
                    {challenge?.difficulty}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{challenge?.description}</p>
                
                {/* Progress Bar */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge?.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                      className="bg-primary h-2 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {challenge?.progress}%
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-heading font-bold text-accent">
                  {challenge?.reward}
                </div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Recent Scores */}
      <div className="mb-6 border-t border-border pt-4">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Scores</h3>
        <div className="grid grid-cols-2 gap-3">
          {recentScores?.map((score, index) => (
            <div
              key={score?.id}
              ref={el => scoreRefs.current[index] = el}
              className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 mx-auto mb-2 rounded-full overflow-hidden">
                <Image
                  src={score?.gameImage}
                  alt={score?.gameName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-medium text-foreground truncate mb-1">
                {score?.gameName}
              </h4>
              <div className={`text-xl font-heading font-bold ${getScoreColor(score?.score)}`}>
                {score?.score}%
              </div>
              <div className="text-xs text-muted-foreground">{score?.date}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Available Games Preview */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading font-semibold text-foreground">New Games</h3>
          <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded-full animate-pulse">
            {availableGames?.length} New
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {availableGames?.slice(0, 2)?.map((game, index) => (
            <motion.div
              key={game?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="relative p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20 hover:border-accent/40 transition-colors cursor-pointer group"
            >
              <div className="w-full h-20 rounded-lg overflow-hidden mb-2">
                <Image
                  src={game?.image}
                  alt={game?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-sm font-medium text-foreground truncate mb-1">
                {game?.title}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{game?.category}</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} color="var(--color-accent)" />
                  <span className="text-xs font-medium text-accent">{game?.rating}</span>
                </div>
              </div>
              
              {/* New Badge */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-error rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-error-foreground">!</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-primary">
            {currentChallenges?.length}
          </div>
          <div className="text-xs text-muted-foreground">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-success">
            {recentScores?.reduce((acc, score) => acc + score?.score, 0) / recentScores?.length || 0}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-accent">
            {currentChallenges?.reduce((acc, challenge) => acc + challenge?.reward, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total XP</div>
        </div>
      </div>
    </motion.div>
  );
};

export default GamificationPanel;