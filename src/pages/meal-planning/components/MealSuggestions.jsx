import React, { useState, useEffect } from "react";
import { supabase } from '../../../utils/supabaseClient';
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const MealSuggestions = ({
  userPreferences,
  nutritionGoals,
  onAddSuggestion,
  onDismissSuggestion,
}) => {
  const [activeCategory, setActiveCategory] = useState("personalized");

  // MOCK DATA COMMENTED OUT. Now fetched from Supabase below.
  /*
  const suggestions = {
    personalized: [...],
    trending: [...],
    seasonal: [...],
    quick: [...],
  };
  */

  // Supabase Table: meal_suggestions
  // Columns: id, category, name, image, reason, calories, prep_time, difficulty, protein, carbs, fat, tags, match_score, created_at

  const [suggestions, setSuggestions] = useState({
    personalized: [],
    trending: [],
    seasonal: [],
    quick: []
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from('meal_suggestions')
        .select('*');
      if (!error && data) {
        // Group by category
        const grouped = {
          personalized: [],
          trending: [],
          seasonal: [],
          quick: []
        };
        data.forEach(s => {
          if (grouped[s.category]) {
            grouped[s.category].push({
              ...s,
              macros: {
                protein: s.protein,
                carbs: s.carbs,
                fat: s.fat
              },
              prepTime: s.prep_time,
              matchScore: s.match_score,
              tags: s.tags || []
            });
          }
        });
        setSuggestions(grouped);
      }
    };
    fetchSuggestions();
  }, []);

  const categories = [
    {
      id: "personalized",
      name: "For You",
      icon: "User",
      count: suggestions?.personalized?.length,
    },
    {
      id: "trending",
      name: "Trending",
      icon: "TrendingUp",
      count: suggestions?.trending?.length,
    },
    {
      id: "seasonal",
      name: "Seasonal",
      icon: "Leaf",
      count: suggestions?.seasonal?.length,
    },
    {
      id: "quick",
      name: "Quick Meals",
      icon: "Zap",
      count: suggestions?.quick?.length,
    },
  ];

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-warning";
    return "text-muted-foreground";
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
          <span
            className={`text-xs font-mono font-semibold ${getMatchScoreColor(
              suggestion?.matchScore
            )}`}
          >
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
            <div className="font-mono font-semibold text-foreground">
              {suggestion?.calories}
            </div>
            <div className="text-muted-foreground">cal</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-success">
              {suggestion?.macros?.protein}g
            </div>
            <div className="text-muted-foreground">protein</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-warning">
              {suggestion?.macros?.carbs}g
            </div>
            <div className="text-muted-foreground">carbs</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-accent">
              {suggestion?.macros?.fat}g
            </div>
            <div className="text-muted-foreground">fat</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {suggestion?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" fullWidth iconName="Eye">
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

        <Button variant="outline" size="sm" iconName="RefreshCw">
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
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon
              name={category?.icon}
              size={16}
              color={activeCategory === category?.id ? "white" : "currentColor"}
            />
            <span className="font-body font-medium">{category?.name}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === category?.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
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
        {(!suggestions?.[activeCategory] ||
          suggestions?.[activeCategory]?.length === 0) && (
          <div className="text-center py-12">
            <Icon
              name="Search"
              size={48}
              color="var(--color-muted-foreground)"
            />
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
            <span>
              Suggestions based on your nutrition goals and meal history
            </span>
          </div>
          <Button variant="ghost" size="sm" iconName="Settings">
            Update Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealSuggestions;
