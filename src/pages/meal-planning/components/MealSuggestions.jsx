import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MealSuggestions = ({ userPreferences, nutritionGoals, onAddSuggestion, onDismissSuggestion }) => {
  const [activeCategory, setActiveCategory] = useState('personalized');

  const suggestions = {
    personalized: [
      {
        id: 1,
        name: "Protein-Packed Breakfast Bowl",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
        reason: "Based on your high protein goals",
        calories: 420,
        prepTime: 15,
        difficulty: "Easy",
        macros: { protein: 32, carbs: 28, fat: 18 },
        tags: ["High Protein", "Quick", "Breakfast"],
        matchScore: 95
      },
      {
        id: 2,
        name: "Mediterranean Lunch Wrap",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        reason: "Matches your Mediterranean cuisine preference",
        calories: 380,
        prepTime: 10,
        difficulty: "Easy",
        macros: { protein: 24, carbs: 35, fat: 16 },
        tags: ["Mediterranean", "Portable", "Lunch"],
        matchScore: 88
      },
      {
        id: 3,
        name: "Keto Salmon Dinner",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
        reason: "Perfect for your low-carb evening meals",
        calories: 450,
        prepTime: 25,
        difficulty: "Medium",
        macros: { protein: 35, carbs: 8, fat: 28 },
        tags: ["Keto", "Low-Carb", "Dinner"],
        matchScore: 92
      }
    ],
    trending: [
      {
        id: 4,
        name: "Viral TikTok Pasta",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
        reason: "Trending this week",
        calories: 520,
        prepTime: 20,
        difficulty: "Easy",
        macros: { protein: 18, carbs: 65, fat: 22 },
        tags: ["Trending", "Pasta", "Social Media"],
        matchScore: 75
      },
      {
        id: 5,
        name: "Buddha Bowl Craze",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        reason: "Popular among health enthusiasts",
        calories: 380,
        prepTime: 30,
        difficulty: "Medium",
        macros: { protein: 22, carbs: 45, fat: 14 },
        tags: ["Healthy", "Colorful", "Instagram"],
        matchScore: 82
      }
    ],
    seasonal: [
      {
        id: 6,
        name: "Autumn Harvest Soup",
        image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400",
        reason: "Perfect for fall season",
        calories: 280,
        prepTime: 45,
        difficulty: "Medium",
        macros: { protein: 12, carbs: 38, fat: 8 },
        tags: ["Seasonal", "Comfort", "Soup"],
        matchScore: 78
      },
      {
        id: 7,
        name: "Pumpkin Spice Smoothie",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",
        reason: "Seasonal favorite ingredient",
        calories: 320,
        prepTime: 5,
        difficulty: "Easy",
        macros: { protein: 18, carbs: 42, fat: 12 },
        tags: ["Seasonal", "Smoothie", "Pumpkin"],
        matchScore: 70
      }
    ],
    quick: [
      {
        id: 8,
        name: "5-Minute Avocado Toast",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
        reason: "Ready in under 10 minutes",
        calories: 340,
        prepTime: 5,
        difficulty: "Easy",
        macros: { protein: 12, carbs: 28, fat: 22 },
        tags: ["Quick", "Breakfast", "Healthy Fats"],
        matchScore: 85
      },
      {
        id: 9,
        name: "Microwave Mug Omelet",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
        reason: "Perfect for busy mornings",
        calories: 280,
        prepTime: 3,
        difficulty: "Easy",
        macros: { protein: 24, carbs: 4, fat: 18 },
        tags: ["Quick", "Microwave", "Protein"],
        matchScore: 80
      }
    ]
  };

  const categories = [
    { id: 'personalized', name: 'For You', icon: 'User', count: suggestions?.personalized?.length },
    { id: 'trending', name: 'Trending', icon: 'TrendingUp', count: suggestions?.trending?.length },
    { id: 'seasonal', name: 'Seasonal', icon: 'Leaf', count: suggestions?.seasonal?.length },
    { id: 'quick', name: 'Quick Meals', icon: 'Zap', count: suggestions?.quick?.length }
  ];

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-muted-foreground';
  };

  const SuggestionCard = ({ suggestion }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-soft transition-all duration-200 group"
    >
      <div className="relative aspect-video">
        <Image
          src={suggestion?.image}
          alt={suggestion?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Match Score */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-black/70 rounded-full px-2 py-1">
          <Icon name="Target" size={12} color="white" />
          <span className={`text-xs font-mono font-semibold ${getMatchScoreColor(suggestion?.matchScore)}`}>
            {suggestion?.matchScore}%
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <Button
              variant="secondary"
              size="sm"
              iconName="Plus"
              onClick={() => onAddSuggestion(suggestion)}
              className="bg-white/90 hover:bg-white"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => onDismissSuggestion(suggestion?.id)}
              className="bg-white/90 hover:bg-white text-muted-foreground hover:text-error"
            />
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-caption px-2 py-1 bg-black/70 rounded-full text-white">
            {suggestion?.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
            {suggestion?.name}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>{suggestion?.prepTime}m</span>
          </div>
        </div>

        <p className="text-sm text-primary mb-3 flex items-center space-x-1">
          <Icon name="Lightbulb" size={12} />
          <span>{suggestion?.reason}</span>
        </p>

        {/* Macros */}
        <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
          <div className="text-center">
            <div className="font-mono font-semibold text-foreground">{suggestion?.calories}</div>
            <div className="text-muted-foreground">cal</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-success">{suggestion?.macros?.protein}g</div>
            <div className="text-muted-foreground">protein</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-warning">{suggestion?.macros?.carbs}g</div>
            <div className="text-muted-foreground">carbs</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-accent">{suggestion?.macros?.fat}g</div>
            <div className="text-muted-foreground">fat</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {suggestion?.tags?.slice(0, 3)?.map((tag, index) => (
            <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Eye"
          >
            View Recipe
          </Button>
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="CalendarPlus"
            onClick={() => onAddSuggestion(suggestion)}
          >
            Add to Plan
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Sparkles" size={20} color="var(--color-primary)" />
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Meal Suggestions
            </h2>
            <p className="text-sm text-muted-foreground">
              Personalized recommendations based on your preferences
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
        >
          Refresh
        </Button>
      </div>
      {/* Category Tabs */}
      <div className="flex items-center space-x-1 p-6 border-b border-border bg-muted/30 overflow-x-auto">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setActiveCategory(category?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeCategory === category?.id
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon 
              name={category?.icon} 
              size={16} 
              color={activeCategory === category?.id ? 'white' : 'currentColor'} 
            />
            <span className="font-body font-medium">{category?.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === category?.id 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {category?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Suggestions Grid */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {suggestions?.[activeCategory]?.map((suggestion) => (
              <SuggestionCard key={suggestion?.id} suggestion={suggestion} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {(!suggestions?.[activeCategory] || suggestions?.[activeCategory]?.length === 0) && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} color="var(--color-muted-foreground)" />
            <h3 className="text-lg font-heading font-semibold text-foreground mt-4">
              No suggestions available
            </h3>
            <p className="text-muted-foreground mt-2">
              Check back later for new meal recommendations
            </p>
          </div>
        )}
      </div>
      {/* Preference Insights */}
      <div className="px-6 py-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Suggestions based on your nutrition goals and meal history</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
          >
            Update Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealSuggestions;