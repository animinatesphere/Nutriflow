import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const NutritionSummary = ({ nutritionData, onQuickLog }) => {
  const { calories, protein, carbs, fats, water, dailyGoal } = nutritionData;
  
  const macronutrients = [
    { name: 'Protein', value: protein?.current, goal: protein?.goal, color: 'bg-blue-500', unit: 'g' },
    { name: 'Carbs', value: carbs?.current, goal: carbs?.goal, color: 'bg-green-500', unit: 'g' },
    { name: 'Fats', value: fats?.current, goal: fats?.goal, color: 'bg-yellow-500', unit: 'g' }
  ];

  const calorieProgress = (calories?.current / calories?.goal) * 100;
  const waterProgress = (water?.current / water?.goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl border border-border p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Today's Nutrition</h2>
        <button
          onClick={onQuickLog}
          className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Icon name="Plus" size={16} />
          <span className="text-sm font-medium">Quick Log</span>
        </button>
      </div>
      {/* Calorie Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Calories</span>
          <span className="text-sm font-mono text-foreground">
            {calories?.current?.toLocaleString()} / {calories?.goal?.toLocaleString()}
          </span>
        </div>
        <div className="relative w-full bg-muted rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-3 rounded-full ${calorieProgress > 100 ? 'bg-warning' : 'bg-primary'}`}
          />
          {calorieProgress > 100 && (
            <div className="absolute right-2 top-0 h-3 flex items-center">
              <Icon name="AlertTriangle" size={12} color="white" />
            </div>
          )}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs text-muted-foreground">{calories?.goal?.toLocaleString()}</span>
        </div>
      </div>
      {/* Macronutrients */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {macronutrients?.map((macro, index) => {
          const progress = (macro?.value / macro?.goal) * 100;
          return (
            <motion.div
              key={macro?.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--color-muted)"
                    strokeWidth="2"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={macro?.color?.replace('bg-', '')?.replace('-500', '')}
                    strokeWidth="2"
                    strokeDasharray={`${progress}, 100`}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${progress}, 100` }}
                    transition={{ duration: 1, delay: 0.3 + 0.1 * index }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-foreground">{macro?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {macro?.value}{macro?.unit} / {macro?.goal}{macro?.unit}
              </p>
            </motion.div>
          );
        })}
      </div>
      {/* Water Intake */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Droplets" size={16} color="var(--color-blue-500)" />
            <span className="text-sm font-medium text-muted-foreground">Water Intake</span>
          </div>
          <span className="text-sm font-mono text-foreground">
            {water?.current}L / {water?.goal}L
          </span>
        </div>
        <div className="relative w-full bg-muted rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(waterProgress, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-blue-500 h-2 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NutritionSummary;