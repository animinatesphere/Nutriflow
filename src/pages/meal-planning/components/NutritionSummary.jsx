import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NutritionSummary = ({ weeklyData, goals, onGoalUpdate }) => {
  const macroData = [
    {
      name: 'Calories',
      current: weeklyData?.calories,
      target: goals?.calories,
      unit: 'kcal',
      color: 'var(--color-primary)',
      icon: 'Flame'
    },
    {
      name: 'Protein',
      current: weeklyData?.protein,
      target: goals?.protein,
      unit: 'g',
      color: 'var(--color-success)',
      icon: 'Beef'
    },
    {
      name: 'Carbs',
      current: weeklyData?.carbs,
      target: goals?.carbs,
      unit: 'g',
      color: 'var(--color-warning)',
      icon: 'Wheat'
    },
    {
      name: 'Fat',
      current: weeklyData?.fat,
      target: goals?.fat,
      unit: 'g',
      color: 'var(--color-accent)',
      icon: 'Droplets'
    }
  ];

  const dailyAverages = {
    calories: Math.round(weeklyData?.calories / 7),
    protein: Math.round(weeklyData?.protein / 7),
    carbs: Math.round(weeklyData?.carbs / 7),
    fat: Math.round(weeklyData?.fat / 7)
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'var(--color-success)';
    if (percentage >= 70) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const MacroCard = ({ macro }) => {
    const percentage = getProgressPercentage(macro?.current, macro?.target);
    const progressColor = getProgressColor(percentage);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/30 rounded-lg p-4 border border-border"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${macro?.color}20` }}
            >
              <Icon name={macro?.icon} size={16} color={macro?.color} />
            </div>
            <span className="font-heading font-semibold text-sm text-foreground">
              {macro?.name}
            </span>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-sm text-foreground">
              {macro?.current?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              of {macro?.target?.toLocaleString()} {macro?.unit}
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="relative w-full bg-border rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-2 rounded-full"
            style={{ backgroundColor: progressColor }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {percentage?.toFixed(0)}% complete
          </span>
          <span className="font-mono text-muted-foreground">
            {Math.round(macro?.current / 7)} {macro?.unit}/day avg
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Target" size={20} color="var(--color-primary)" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Weekly Nutrition Summary
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          onClick={onGoalUpdate}
        >
          Update Goals
        </Button>
      </div>
      {/* Macro Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {macroData?.map((macro, index) => (
            <MacroCard key={macro?.name} macro={macro} />
          ))}
        </div>

        {/* Daily Breakdown */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Calendar" size={16} />
            <span>Daily Averages</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-primary">
                {dailyAverages?.calories}
              </div>
              <div className="text-xs text-muted-foreground">Calories/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-success">
                {dailyAverages?.protein}g
              </div>
              <div className="text-xs text-muted-foreground">Protein/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-warning">
                {dailyAverages?.carbs}g
              </div>
              <div className="text-xs text-muted-foreground">Carbs/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-accent">
                {dailyAverages?.fat}g
              </div>
              <div className="text-xs text-muted-foreground">Fat/day</div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mt-6 bg-muted/30 rounded-lg p-4 border border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} />
            <span>Weekly Progress</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              </div>
              <div>
                <div className="font-heading font-semibold text-foreground">
                  18 meals planned
                </div>
                <div className="text-xs text-muted-foreground">
                  86% of weekly goal
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Icon name="Utensils" size={16} color="var(--color-primary)" />
              </div>
              <div>
                <div className="font-heading font-semibold text-foreground">
                  12 recipes tried
                </div>
                <div className="text-xs text-muted-foreground">
                  3 new this week
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Icon name="Clock" size={16} color="var(--color-warning)" />
              </div>
              <div>
                <div className="font-heading font-semibold text-foreground">
                  4.2h prep time
                </div>
                <div className="text-xs text-muted-foreground">
                  36min/day average
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
            <span>Nutrition Insights</span>
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Icon name="ArrowUp" size={14} color="var(--color-success)" className="mt-0.5" />
              <span className="text-sm text-foreground">
                You're exceeding your protein goals by 15% - great for muscle maintenance!
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={14} color="var(--color-warning)" className="mt-0.5" />
              <span className="text-sm text-foreground">
                Consider adding more fiber-rich vegetables to reach your daily fiber target.
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} color="var(--color-primary)" className="mt-0.5" />
              <span className="text-sm text-foreground">
                Your meal timing is consistent - this helps with metabolism regulation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;