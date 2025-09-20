import React, { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
// import NutritionSummary from "./NutritionSummary"; // Your enhanced component
import NutritionSummary from "./NutritionSummary";
const YourMealPlanningComponent = () => {
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // User profile with custom nutrition goals (optional)
  const [userProfile, setUserProfile] = useState({
    calorieGoal: 2000, // Customize based on user's health goals
    waterGoal: 2.5, // Liters per day
    // You can add more user-specific goals here
  });

  // Manual nutrition tracking (for quick logs)
  const [manualNutrition, setManualNutrition] = useState({
    calories: { current: 0, goal: 0 },
    protein: { current: 0, goal: 0 },
    carbs: { current: 0, goal: 0 },
    fats: { current: 0, goal: 0 },
    water: { current: 0, goal: 0 },
  });

  // Your existing useEffect for fetching planned meals
  useEffect(() => {
    // Get start of week (Monday)
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
      setUserId(userId); // Store userId for other operations

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

  // Calculate daily nutrition summary for display
  const getDailyNutritionSummary = () => {
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "lowercase",
    });
    const todaysMeals = plannedMeals.filter((meal) => meal.day === dayName);

    // Group by meal type for detailed breakdown
    const mealsByType = {
      breakfast: todaysMeals.filter((meal) => meal.type === "breakfast"),
      lunch: todaysMeals.filter((meal) => meal.type === "lunch"),
      dinner: todaysMeals.filter((meal) => meal.type === "dinner"),
    };

    // Calculate nutrition for each meal type
    const nutritionByMealType = {};
    Object.entries(mealsByType).forEach(([mealType, meals]) => {
      nutritionByMealType[mealType] = meals.reduce(
        (acc, meal) => {
          const calories = meal.calories || 0;
          return {
            calories: acc.calories + calories,
            protein: acc.protein + Math.round((calories * 0.25) / 4),
            carbs: acc.carbs + Math.round((calories * 0.45) / 4),
            fats: acc.fats + Math.round((calories * 0.3) / 9),
            count: acc.count + 1,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 }
      );
    });

    return {
      byMealType: nutritionByMealType,
      totalMeals: todaysMeals.length,
      totalCalories: Object.values(nutritionByMealType).reduce(
        (sum, meal) => sum + meal.calories,
        0
      ),
    };
  };

  // Handle quick log functionality
  const handleQuickLog = () => {
    // Example: Add a simple food item
    // In a real app, this would open a modal/form
    const calories = 150; // Example values
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

  // Add water tracking
  const addWater = (amount = 0.25) => {
    setManualNutrition((prev) => ({
      ...prev,
      water: { ...prev.water, current: prev.water.current + amount },
    }));
  };

  const dailySummary = getDailyNutritionSummary();

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nutrition Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.setDate(selectedDate.getDate() - 1))
              )
            }
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ←
          </button>
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.setDate(selectedDate.getDate() + 1))
              )
            }
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            →
          </button>
        </div>
      </div>

      {/* Enhanced Nutrition Summary */}
      <NutritionSummary
        nutritionData={nutritionData}
        onQuickLog={handleQuickLog}
        plannedMeals={plannedMeals} // Add this
        selectedDate={new Date()} // Add this
        userProfile={{ calorieGoal: 2000 }} // Add this (optional)
      />

      {/* Daily Meal Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(dailySummary.byMealType).map(
          ([mealType, nutrition]) => {
            const mealDisplayNames = {
              breakfast: "Morning",
              lunch: "Afternoon",
              dinner: "Night",
            };

            return (
              <div key={mealType} className="bg-card rounded-lg border p-4">
                <h3 className="font-semibold mb-3 capitalize">
                  {mealDisplayNames[mealType]} ({nutrition.count} meals)
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Calories:
                    </span>
                    <span className="text-sm font-mono">
                      {nutrition.calories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Protein:
                    </span>
                    <span className="text-sm font-mono">
                      {nutrition.protein}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Carbs:
                    </span>
                    <span className="text-sm font-mono">
                      {nutrition.carbs}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fats:</span>
                    <span className="text-sm font-mono">{nutrition.fats}g</span>
                  </div>
                </div>

                {/* Show planned meals for this type */}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    Planned meals:
                  </p>
                  {plannedMeals
                    .filter(
                      (meal) =>
                        meal.day ===
                          selectedDate.toLocaleDateString("en-US", {
                            weekday: "lowercase",
                          }) && meal.type === mealType
                    )
                    .map((meal, index) => (
                      <div key={index} className="text-xs text-foreground mb-1">
                        {meal.name} ({meal.calories} cal)
                      </div>
                    ))}
                  {nutrition.count === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      No meals planned
                    </p>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleQuickLog}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Log Food
          </button>
          <button
            onClick={() => addWater(0.25)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            +250ml Water
          </button>
          <button
            onClick={() => addWater(0.5)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            +500ml Water
          </button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="font-semibold mb-3">This Week Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {plannedMeals.length}
            </p>
            <p className="text-sm text-muted-foreground">Total Meals Planned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {Math.round(
                plannedMeals.reduce(
                  (sum, meal) => sum + (meal.calories || 0),
                  0
                ) / 7
              )}
            </p>
            <p className="text-sm text-muted-foreground">Avg Daily Calories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {new Set(plannedMeals.map((meal) => meal.day)).size}
            </p>
            <p className="text-sm text-muted-foreground">Days with Meals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {Math.round(
                (plannedMeals.reduce(
                  (sum, meal) => sum + (meal.calories || 0),
                  0
                ) /
                  (userProfile.calorieGoal * 7)) *
                  100
              )}
              %
            </p>
            <p className="text-sm text-muted-foreground">Weekly Goal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourMealPlanningComponent;
