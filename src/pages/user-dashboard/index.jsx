import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
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

  // MOCK DATA COMMENTED OUT. Now fetched from Supabase below.
  /*
  const nutritionData = { ... };
  const weeklyData = [ ... ];
  const achievements = [ ... ];
  const todaysMeals = [ ... ];
  const upcomingReminders = [ ... ];
  const currentChallenges = [ ... ];
  const recentScores = [ ... ];
  const availableGames = [ ... ];
  const subscriptionData = { ... };
  */

  // Fetch dashboard data from Supabase
  const [nutritionData, setNutritionData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [recentScores, setRecentScores] = useState([]);
  const [availableGames, setAvailableGames] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    // Replace with actual user id
    const userId = 'USER_ID';

    // Nutrition summary
    supabase
      .from('nutrition_summary')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setNutritionData(data[0]);
      });

    // Weekly progress (can be derived from nutrition_summary or a separate table)
    supabase
      .from('nutrition_summary')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })
      .limit(7)
      .then(({ data }) => {
        if (data) setWeeklyData(data);
      });

    // Achievements
    supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId)
      .order('unlocked_date', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setAchievements(data);
      });

    // Today's meals
    supabase
      .from('planned_meals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', new Date().toISOString().slice(0, 10))
      .then(({ data }) => {
        if (data) setTodaysMeals(data);
      });

    // Reminders (create reminders table if not present)
    supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('time', { ascending: true })
      .limit(5)
      .then(({ data }) => {
        if (data) setUpcomingReminders(data);
      });

    // Challenges (create challenges table if not present)
    supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setCurrentChallenges(data);
      });

    // Recent scores
    supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentScores(data);
      });

    // Available games
    supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setAvailableGames(data);
      });

    // Subscription status (create subscriptions table if not present)
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setSubscriptionData(data[0]);
      });
  }, []);

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