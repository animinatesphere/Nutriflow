import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/ui/Header";
import NutritionSummary from "./components/NutritionSummary";
import WeeklyProgress from "./components/WeeklyProgress";
import MealPlanningPanel from "./components/MealPlanningPanel";
import GamificationPanel from "./components/GamificationPanel";
import QuickActions from "./components/QuickActions";
import SubscriptionStatus from "./components/SubscriptionStatus";

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  // Manual nutrition tracking state
  const [manualNutrition, setManualNutrition] = useState({
    calories: { current: 0, goal: 0 },
    protein: { current: 0, goal: 0 },
    carbs: { current: 0, goal: 0 },
    fats: { current: 0, goal: 0 },
    water: { current: 0, goal: 0 },
  });

  // ADD this useEffect after your existing ones:
  useEffect(() => {
    const getWeekStart = () => {
      const now = currentWeek ? new Date(currentWeek) : new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      return monday.toISOString().slice(0, 10);
    };

    const fetchPlannedMeals = async () => {
      const week_start = getWeekStart();
      let userId;

      if (supabase.auth.getUser) {
        const { data } = await supabase.auth.getUser();
        userId = data?.user?.id;
      } else if (supabase.auth.user) {
        userId = supabase.auth.user()?.id;
      }

      if (!userId) return;
      setUserId(userId);

      const { data, error } = await supabase
        .from("weekly_meals")
        .select("*, recipe:recipes(*)")
        .eq("user_id", userId)
        .eq("week_start", week_start);

      if (!error && data) {
        setPlannedMeals(
          data.map((meal) => ({
            ...meal.recipe,
            ...meal,
            prepTime: meal.recipe?.prep_time,
            cookTime: meal.recipe?.cook_time,
            tags: meal.recipe?.tags || [],
            name: meal.recipe?.name,
            image: meal.recipe?.image,
            calories: meal.recipe?.calories,
            description: meal.recipe?.description,
            cuisine: meal.recipe?.cuisine,
            diet: meal.recipe?.diet,
            day: meal.day,
            type: meal.type,
          }))
        );
      }
    };

    fetchPlannedMeals();
  }, [currentWeek, userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // First, try to get the current user from Supabase Auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      let userId = null;
      let userEmail = null;

      if (user) {
        // User is authenticated with Supabase
        userId = user.id;
        userEmail = user.email;
      } else {
        // Fallback to localStorage
        let userData = JSON.parse(
          localStorage.getItem("nutriflow_user") || "null"
        );

        if (userData) {
          if (Array.isArray(userData)) userData = userData[0];

          // Try different possible paths for user ID
          userId = userData?.user?.id || userData?.id || userData?.user_id;
          userEmail =
            userData?.email ||
            userData?.user_metadata?.email ||
            userData?.user?.email;
        }
      }

      if (!userId) {
        console.warn("Header.jsx: No user ID found, redirecting to login");
        navigate("/user-login");
        return;
      }

      // Fetch profile from Supabase

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      let profile = null;

      if (data && !error) {
        let name = `${data.first_name || ""}`;
        if (!name) name = data.email || userEmail || "User";

        profile = {
          name,
          email: data.email || userEmail,
          avatar: data.avatar_url || "/assets/images/avatar-placeholder.jpg",
          subscriptionTier: data.subscription_tier || "Free",
          dailyProgress: data.daily_progress || 0,
          ageRange: data.age_range || "",
          activityLevel: data.activity_level || "",
          primaryGoal: data.primary_goal || "",
          dietaryRestrictions: data.dietary_restrictions || "",
          cookingExperience: data.cooking_experience || "",
          subscriptionInterest: data.subscription_interest || "",
        };
      } else {
        // Profile not found or error occurred

        profile = {
          name: userEmail || "User",
          email: userEmail || "No email",
          avatar: "/assets/images/avatar-placeholder.jpg",
          subscriptionTier: "Free",
          dailyProgress: 0,
        };

        // If error is not just "no rows returned", log it
        if (error && error.code !== "PGRST116") {
        }
      }

      setUserProfile(profile);
    } catch (err) {
      // Set a minimal fallback profile
      setUserProfile({
        name: "User",
        email: "No email",
        avatar: "/assets/images/avatar-placeholder.jpg",
        subscriptionTier: "Free",
        dailyProgress: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Header.jsx Auth state changed:", event, session?.user?.id);
      if (event === "SIGNED_OUT") {
        setUserProfile(null);
        localStorage.removeItem("nutriflow_user");
        navigate("/user-login");
      } else if (event === "SIGNED_IN" && session?.user && !userProfile) {
        // Only refetch if we don't have user profile yet (avoid reload loop)
        fetchUserProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, userProfile]);

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
    // Get actual user id from localStorage
    const userData = JSON.parse(localStorage.getItem("nutriflow_user"));
    const userId = userData?.id || userData?.user?.id;

    if (!userId) return;

    // Nutrition summary
    supabase
      .from("nutrition_summary")
      .select("*")
      .eq("user_id", userId)
      .order("week_start", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setNutritionData(data[0]);
      });

    // Weekly progress (can be derived from nutrition_summary or a separate table)
    supabase
      .from("nutrition_summary")
      .select("*")
      .eq("user_id", userId)
      .order("week_start", { ascending: false })
      .limit(7)
      .then(({ data }) => {
        if (data) setWeeklyData(data);
      });

    // Achievements (fix column name to unlocked_at if needed)
    supabase
      .from("user_achievements")
      .select("*, achievement:achievements(*)")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setAchievements(data);
      });

    // Today's meals (fix column name to meal_date if needed)
    supabase
      .from("planned_meals")
      .select("*")
      .eq("user_id", userId)
      .eq("meal_date", new Date().toISOString().slice(0, 10))
      .then(({ data }) => {
        if (data) setTodaysMeals(data);
      });

    // Reminders
    supabase
      .from("reminders")
      .select("*")
      .eq("user_id", userId)
      .order("time", { ascending: true })
      .limit(5)
      .then(({ data }) => {
        if (data) setUpcomingReminders(data);
      });

    // Challenges
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setCurrentChallenges(data);
      });

    // Recent scores
    supabase
      .from("game_scores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentScores(data);
      });

    // Available games
    supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setAvailableGames(data);
      });

    // Subscription status
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setSubscriptionData(data[0]);
      });
  }, []);

  // Event handlers
  const handleQuickLog = () => {
    console.log("Opening quick meal log...");
    // Example: Add some nutrition manually
    const calories = 150;
    const protein = 5;
    const carbs = 20;
    const fats = 3;

    setManualNutrition((prev) => ({
      calories: { ...prev.calories, current: prev.calories.current + calories },
      protein: { ...prev.protein, current: prev.protein.current + protein },
      carbs: { ...prev.carbs, current: prev.carbs.current + carbs },
      fats: { ...prev.fats, current: prev.fats.current + fats },
      water: prev.water,
    }));
  };

  const handleEditMeal = (meal) => {
    console.log("Editing meal:", meal);
    // Implementation for meal editing
  };

  const handleBrowseRecipes = () => {
    console.log("Opening recipe browser...");
    // Implementation for recipe browsing
  };

  const handleStartGame = () => {
    console.log("Starting cooking game...");
    // Implementation for starting games
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start md:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-heading font-bold text-foreground mb-2 leading-tight">
                  Good{" "}
                  {currentTime?.getHours() < 12
                    ? "Morning"
                    : currentTime?.getHours() < 17
                    ? "Afternoon"
                    : "Evening"}
                  , {userProfile?.name}{" "}
                  <span className="hidden xs:inline">👋</span>
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground truncate sm:whitespace-normal">
                  <span className="hidden sm:inline">
                    {formatDate(currentTime)} •{" "}
                  </span>
                  <span className="sm:hidden">
                    {currentTime?.toLocaleDateString()} •{" "}
                  </span>
                  {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 sm:gap-4 flex-shrink-0">
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-success/10 text-success rounded-full border border-success/20">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      On Track
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      Daily Progress
                    </div>
                    <div className="text-lg sm:text-xl font-heading font-bold text-primary">
                      75%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Nutrition Summary */}
              <div className="w-full">
                <NutritionSummary
                  nutritionData={manualNutrition}
                  onQuickLog={handleQuickLog}
                  plannedMeals={plannedMeals}
                  selectedDate={selectedDate}
                  userProfile={userProfile}
                />
              </div>

              {/* Weekly Progress */}
              <div className="w-full">
                <WeeklyProgress
                  weeklyData={weeklyData}
                  achievements={achievements}
                />
              </div>

              {/* Meal Planning Panel */}
              <div className="w-full">
                <MealPlanningPanel
                  todaysMeals={todaysMeals}
                  upcomingReminders={upcomingReminders}
                  onEditMeal={handleEditMeal}
                />
              </div>
            </div>

            {/* Right Column - Secondary Content */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Gamification Panel */}
              <div className="w-full">
                <GamificationPanel
                  currentChallenges={currentChallenges}
                  recentScores={recentScores}
                  availableGames={availableGames}
                />
              </div>

              {/* Quick Actions */}
              <div className="w-full">
                <QuickActions
                  onQuickLog={handleQuickLog}
                  onBrowseRecipes={handleBrowseRecipes}
                  onStartGame={handleStartGame}
                  subscriptionTier={subscriptionData?.tier}
                />
              </div>

              {/* Subscription Status */}
              <div className="w-full">
                <SubscriptionStatus subscriptionData={subscriptionData} />
              </div>
            </div>
          </div>

          {/* Bottom Section - Additional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            <div className="text-center p-3 sm:p-4 md:p-6 bg-card rounded-lg sm:rounded-xl border border-border shadow-soft">
              <div className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2">
                {Math.round(
                  (nutritionData?.calories?.current /
                    nutritionData?.calories?.goal) *
                    100
                ) || 0}
                %
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Daily Goal
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 md:p-6 bg-card rounded-lg sm:rounded-xl border border-border shadow-soft">
              <div className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-success mb-1 sm:mb-2">
                {weeklyData?.filter((day) => day?.calories / day?.goal >= 1)
                  ?.length || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Goals This Week
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 md:p-6 bg-card rounded-lg sm:rounded-xl border border-border shadow-soft">
              <div className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-accent mb-1 sm:mb-2">
                {currentChallenges?.reduce(
                  (acc, challenge) => acc + (challenge?.reward || 0),
                  0
                ) || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total XP
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 md:p-6 bg-card rounded-lg sm:rounded-xl border border-border shadow-soft">
              <div className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-secondary mb-1 sm:mb-2">
                {todaysMeals?.length || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Meals Planned
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
