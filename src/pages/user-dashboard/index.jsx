import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import NutritionSummary from './components/NutritionSummary';
import WeeklyProgress from './components/WeeklyProgress';
import MealPlanningPanel from './components/MealPlanningPanel';
import GamificationPanel from './components/GamificationPanel';
import QuickActions from './components/QuickActions';
import SubscriptionStatus from './components/SubscriptionStatus';

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mock data for nutrition tracking
  const nutritionData = {
    calories: { current: 1850, goal: 2200 },
    protein: { current: 125, goal: 150 },
    carbs: { current: 180, goal: 220 },
    fats: { current: 65, goal: 80 },
    water: { current: 2.1, goal: 3.0 },
    dailyGoal: 2200
  };

  // Mock data for weekly progress
  const weeklyData = [
    { calories: 2100, goal: 2200 },
    { calories: 1950, goal: 2200 },
    { calories: 2250, goal: 2200 },
    { calories: 2050, goal: 2200 },
    { calories: 1850, goal: 2200 },
    { calories: 2300, goal: 2200 },
    { calories: 2150, goal: 2200 }
  ];

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: "7-Day Streak",
      icon: "Flame",
      bgColor: "bg-orange-500",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Perfect Macros",
      icon: "Target",
      bgColor: "bg-green-500",
      date: "1 week ago"
    },
    {
      id: 3,
      title: "Cooking Master",
      icon: "Chef",
      bgColor: "bg-purple-500",
      date: "3 days ago"
    },
    {
      id: 4,
      title: "Hydration Hero",
      icon: "Droplets",
      bgColor: "bg-blue-500",
      date: "Yesterday"
    }
  ];

  // Mock today's meals data
  const todaysMeals = [
    {
      id: 1,
      type: "breakfast",
      name: "Avocado Toast with Eggs",
      calories: 420,
      prepTime: 10,
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      type: "lunch",
      name: "Grilled Chicken Salad",
      calories: 380,
      prepTime: 15,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      type: "dinner",
      name: "Salmon with Quinoa",
      calories: 520,
      prepTime: 25,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
    }
  ];

  // Mock upcoming reminders
  const upcomingReminders = [
    {
      id: 1,
      title: "Lunch reminder",
      time: "12:30 PM"
    },
    {
      id: 2,
      title: "Water break",
      time: "2:00 PM"
    },
    {
      id: 3,
      title: "Dinner prep",
      time: "6:00 PM"
    }
  ];

  // Mock current challenges
  const currentChallenges = [
    {
      id: 1,
      title: "Perfect Pasta Challenge",
      description: "Master the art of cooking perfect pasta",
      difficulty: "medium",
      progress: 75,
      reward: 150,
      image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Knife Skills Mastery",
      description: "Learn professional knife techniques",
      difficulty: "hard",
      progress: 45,
      reward: 200,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
    }
  ];

  // Mock recent scores
  const recentScores = [
    {
      id: 1,
      gameName: "Chopping Challenge",
      score: 92,
      date: "Today",
      gameImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      gameName: "Recipe Memory",
      score: 78,
      date: "Yesterday",
      gameImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      gameName: "Timing Master",
      score: 85,
      date: "2 days ago",
      gameImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      gameName: "Spice Identifier",
      score: 96,
      date: "3 days ago",
      gameImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop"
    }
  ];

  // Mock available games
  const availableGames = [
    {
      id: 1,
      title: "Baking Basics",
      category: "Desserts",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Sushi Rolling",
      category: "Japanese",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Grill Master",
      category: "BBQ",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop"
    }
  ];

  // Mock subscription data
  const subscriptionData = {
    tier: "Premium", // or "Free"
    status: "active",
    expiryDate: "2025-12-15",
    features: [
      "AI meal suggestions",
      "Advanced analytics",
      "Unlimited recipes",
      "Priority support",
      "Custom meal prep"
    ],
    usage: [
      { feature: "AI Suggestions", used: 45, limit: 100 },
      { feature: "Recipe Access", used: 23, limit: -1 },
      { feature: "Analytics", used: 12, limit: 50 },
      { feature: "Meal Plans", used: 8, limit: 20 }
    ]
  };

  // Event handlers
  const handleQuickLog = () => {
    console.log('Opening quick meal log...');
    // Implementation for quick meal logging
  };

  const handleEditMeal = (meal) => {
    console.log('Editing meal:', meal);
    // Implementation for meal editing
  };

  const handleBrowseRecipes = () => {
    console.log('Opening recipe browser...');
    // Implementation for recipe browsing
  };

  const handleStartGame = () => {
    console.log('Starting cooking game...');
    // Implementation for starting games
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Good {currentTime?.getHours() < 12 ? 'Morning' : currentTime?.getHours() < 17 ? 'Afternoon' : 'Evening'}, Sarah! 👋
                </h1>
                <p className="text-muted-foreground">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium">On Track</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Daily Progress</div>
                  <div className="text-xl font-heading font-bold text-primary">75%</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Nutrition Summary */}
              <NutritionSummary 
                nutritionData={nutritionData}
                onQuickLog={handleQuickLog}
              />

              {/* Weekly Progress */}
              <WeeklyProgress 
                weeklyData={weeklyData}
                achievements={achievements}
              />

              {/* Meal Planning Panel */}
              <MealPlanningPanel 
                todaysMeals={todaysMeals}
                upcomingReminders={upcomingReminders}
                onEditMeal={handleEditMeal}
              />
            </div>

            {/* Right Column - Secondary Content */}
            <div className="space-y-8">
              {/* Gamification Panel */}
              <GamificationPanel 
                currentChallenges={currentChallenges}
                recentScores={recentScores}
                availableGames={availableGames}
              />

              {/* Quick Actions */}
              <QuickActions 
                onQuickLog={handleQuickLog}
                onBrowseRecipes={handleBrowseRecipes}
                onStartGame={handleStartGame}
                subscriptionTier={subscriptionData?.tier}
              />

              {/* Subscription Status */}
              <SubscriptionStatus 
                subscriptionData={subscriptionData}
              />
            </div>
          </div>

          {/* Bottom Section - Additional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center p-6 bg-card rounded-xl border border-border shadow-soft">
              <div className="text-3xl font-heading font-bold text-primary mb-2">
                {Math.round((nutritionData?.calories?.current / nutritionData?.calories?.goal) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Daily Goal</div>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border shadow-soft">
              <div className="text-3xl font-heading font-bold text-success mb-2">
                {weeklyData?.filter(day => (day?.calories / day?.goal) >= 1)?.length}
              </div>
              <div className="text-sm text-muted-foreground">Goals This Week</div>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border shadow-soft">
              <div className="text-3xl font-heading font-bold text-accent mb-2">
                {currentChallenges?.reduce((acc, challenge) => acc + challenge?.reward, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border shadow-soft">
              <div className="text-3xl font-heading font-bold text-secondary mb-2">
                {todaysMeals?.length}
              </div>
              <div className="text-sm text-muted-foreground">Meals Planned</div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;