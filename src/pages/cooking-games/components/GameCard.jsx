import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GameCard = ({ game, onPlayGame, userProgress }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-success bg-success/10 border-success/20';
      case 'Intermediate':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Advanced':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

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

  // Use real user progress data
  const progress = userProgress?.games?.[game?.id];
  const isLocked = game?.isPremium && !userProgress; // You can enhance this with a real premium check
  const bestScore = progress?.best_score || 0;
  const isCompleted = bestScore > 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group">
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <Image
            src={game?.image}
            alt={game?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Overlay Elements */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-caption font-medium border ${getDifficultyColor(game?.difficulty)}`}>
            {game?.difficulty}
          </span>
          {game?.isNew && (
            <span className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs font-caption font-medium">
              New
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center space-x-1">
          {isLocked && (
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
              <Icon name="Lock" size={16} color="white" />
            </div>
          )}
          {isCompleted && (
            <div className="bg-success/90 backdrop-blur-sm rounded-full p-1">
              <Icon name="CheckCircle" size={16} color="white" />
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Icon name="Clock" size={12} color="white" />
            <span className="text-xs text-white font-caption">{game?.duration}</span>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Icon name={getSkillIcon(game?.skill)} size={12} color="white" />
            <span className="text-xs text-white font-caption">{game?.skill}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {game?.title}
          </h3>
          {bestScore > 0 && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="Star" size={14} color="currentColor" />
              <span className="text-sm font-mono font-medium">{bestScore}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {game?.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} color="var(--color-muted-foreground)" />
              <span className="text-xs text-muted-foreground font-caption">
                {game?.playCount?.toLocaleString()} plays
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Trophy" size={14} color="var(--color-muted-foreground)" />
              <span className="text-xs text-muted-foreground font-caption">
                {game?.averageScore}% avg
              </span>
            </div>
          </div>

          <Button
            variant={isLocked ? "outline" : "default"}
            size="sm"
            onClick={() => onPlayGame(game)}
            disabled={isLocked}
            iconName={isLocked ? "Lock" : "Play"}
            iconPosition="left"
            iconSize={14}
          >
            {isLocked ? "Premium" : "Play"}
          </Button>
        </div>

        {/* Progress Bar for Completed Games */}
        {isCompleted && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground font-caption">Best Score</span>
              <span className="text-xs font-mono font-medium text-success">{bestScore}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-success h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${bestScore}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;