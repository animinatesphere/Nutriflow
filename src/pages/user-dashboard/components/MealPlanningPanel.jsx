import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MealPlanningPanel = ({ todaysMeals, upcomingReminders, onEditMeal }) => {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  const getMealIcon = (type) => {
    const icons = {
      breakfast: 'Coffee',
      lunch: 'Sandwich',
      dinner: 'UtensilsCrossed',
      snack: 'Apple'
    };
    return icons?.[type] || 'Utensils';
  };

  const getMealTime = (type) => {
    const times = {
      breakfast: '8:00 AM',
      lunch: '12:30 PM',
      dinner: '7:00 PM',
      snack: '3:00 PM'
    };
    return times?.[type] || '12:00 PM';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Today's Meal Plan</h2>
        <Link
          to="/meal-planning"
          className="flex items-center space-x-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <Icon name="Calendar" size={16} />
          <span className="text-sm font-medium">View All</span>
        </Link>
      </div>
      {/* Today's Meals */}
      <div className="space-y-4 mb-6">
        {mealTypes?.map((mealType, index) => {
          const meal = todaysMeals?.find(m => m?.type === mealType);
          return (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={getMealIcon(mealType)} size={20} color="var(--color-primary)" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground capitalize">
                    {mealType}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {getMealTime(mealType)}
                  </span>
                </div>
                
                {meal ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-8 h-8 rounded overflow-hidden">
                      <Image
                        src={meal?.image}
                        alt={meal?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{meal?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {meal?.calories} cal • {meal?.prepTime} min
                      </p>
                    </div>
                    <button
                      onClick={() => onEditMeal(meal)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <Icon name="Edit2" size={14} color="var(--color-muted-foreground)" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-sm text-muted-foreground">No meal planned</p>
                    <button
                      onClick={() => onEditMeal({ type: mealType })}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Add meal
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Upcoming Reminders */}
      {upcomingReminders?.length > 0 && (
        <div className="border-t border-border pt-4">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
            Upcoming Reminders
          </h3>
          <div className="space-y-2">
            {upcomingReminders?.slice(0, 3)?.map((reminder, index) => (
              <motion.div
                key={reminder?.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg border border-accent/20"
              >
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{reminder?.title}</p>
                  <p className="text-xs text-muted-foreground">{reminder?.time}</p>
                </div>
                <Icon name="Bell" size={14} color="var(--color-accent)" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-border">
        <Link
          to="/meal-planning"
          className="flex items-center justify-center space-x-2 p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Icon name="CalendarPlus" size={16} />
          <span className="text-sm font-medium">Plan Week</span>
        </Link>
        <button
          onClick={() => onEditMeal({ type: 'quick' })}
          className="flex items-center justify-center space-x-2 p-3 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
        >
          <Icon name="Zap" size={16} />
          <span className="text-sm font-medium">Quick Add</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MealPlanningPanel;