import React from "react";
import { motion } from "framer-motion";
import Icon from "../../../components/AppIcon";

// Nutrition calculation constants
const NUTRITION_CONSTANTS = {
  DEFAULT_CALORIES: 2000,
  DEFAULT_PROTEIN_RATIO: 0.25, // 25% of calories from protein
  DEFAULT_CARBS_RATIO: 0.45, // 45% of calories from carbs
  DEFAULT_FATS_RATIO: 0.3, // 30% of calories from fats

  // Meal distribution ratios
  MEAL_DISTRIBUTION: {
    breakfast: 0.3, // 30% of daily calories
    lunch: 0.4, // 40% of daily calories
    dinner: 0.3, // 30% of daily calories
  },

  // Calories per gram
  PROTEIN_CALORIES_PER_GRAM: 4,
  CARBS_CALORIES_PER_GRAM: 4,
  FATS_CALORIES_PER_GRAM: 9,

  DEFAULT_WATER_GOAL: 2.5,
};

const NutritionSummary = ({
  nutritionData = {},
  onQuickLog,
  plannedMeals = [],
  selectedDate = new Date(),
  userProfile = {},
}) => {
  // Calculate nutrition targets based on user profile
  const calculateNutritionTargets = () => {
    const dailyCalories =
      userProfile?.calorieGoal || NUTRITION_CONSTANTS.DEFAULT_CALORIES; // Calculate macronutrient calories
    const proteinCalories =
      dailyCalories * NUTRITION_CONSTANTS.DEFAULT_PROTEIN_RATIO;
    const carbsCalories =
      dailyCalories * NUTRITION_CONSTANTS.DEFAULT_CARBS_RATIO;
    const fatsCalories = dailyCalories * NUTRITION_CONSTANTS.DEFAULT_FATS_RATIO;

    // Convert to grams
    const proteinGrams =
      proteinCalories / NUTRITION_CONSTANTS.PROTEIN_CALORIES_PER_GRAM;
    const carbsGrams =
      carbsCalories / NUTRITION_CONSTANTS.CARBS_CALORIES_PER_GRAM;
    const fatsGrams = fatsCalories / NUTRITION_CONSTANTS.FATS_CALORIES_PER_GRAM;

    return {
      daily: {
        calories: dailyCalories,
        protein: Math.round(proteinGrams),
        carbs: Math.round(carbsGrams),
        fats: Math.round(fatsGrams),
        water: userProfile?.waterGoal || NUTRITION_CONSTANTS.DEFAULT_WATER_GOAL,
      },
      byMeal: {
        breakfast: {
          calories: Math.round(
            dailyCalories * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.breakfast
          ),
          protein: Math.round(
            proteinGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.breakfast
          ),
          carbs: Math.round(
            carbsGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.breakfast
          ),
          fats: Math.round(
            fatsGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.breakfast
          ),
        },
        lunch: {
          calories: Math.round(
            dailyCalories * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.lunch
          ),
          protein: Math.round(
            proteinGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.lunch
          ),
          carbs: Math.round(
            carbsGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.lunch
          ),
          fats: Math.round(
            fatsGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.lunch
          ),
        },
        dinner: {
          calories: Math.round(
            dailyCalories * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.dinner
          ),
          protein: Math.round(
            proteinGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.dinner
          ),
          carbs: Math.round(
            carbsGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.dinner
          ),
          fats: Math.round(
            fatsGrams * NUTRITION_CONSTANTS.MEAL_DISTRIBUTION.dinner
          ),
        },
      },
    };
  };

  // Calculate actual nutrition from planned meals for the selected date
  const getActualNutrition = () => {
    const dayName = selectedDate
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();
    const todaysMeals = plannedMeals.filter((meal) => meal.day === dayName);

    const totals = todaysMeals.reduce(
      (acc, meal) => {
        const calories = meal.calories || 0;
        // Estimate macronutrients from calories using standard ratios
        const estimatedProtein = Math.round((calories * 0.25) / 4);
        const estimatedCarbs = Math.round((calories * 0.45) / 4);
        const estimatedFats = Math.round((calories * 0.3) / 9);

        return {
          calories: acc.calories + calories,
          protein: acc.protein + estimatedProtein,
          carbs: acc.carbs + estimatedCarbs,
          fats: acc.fats + estimatedFats,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return totals;
  };

  // Get nutrition targets and actual values
  const targets = calculateNutritionTargets();
  const actualFromMeals = getActualNutrition();

  // Combine with manually logged nutrition data (if any)
  const calories = {
    current: actualFromMeals.calories + (nutritionData.calories?.current || 0),
    goal: targets.daily.calories,
  };

  const protein = {
    current: actualFromMeals.protein + (nutritionData.protein?.current || 0),
    goal: targets.daily.protein,
  };

  const carbs = {
    current: actualFromMeals.carbs + (nutritionData.carbs?.current || 0),
    goal: targets.daily.carbs,
  };

  const fats = {
    current: actualFromMeals.fats + (nutritionData.fats?.current || 0),
    goal: targets.daily.fats,
  };

  const water = {
    current: nutritionData.water?.current || 0,
    goal: targets.daily.water,
  };

  const macronutrients = [
    {
      name: "Protein",
      value: protein.current,
      goal: protein.goal,
      color: "bg-blue-500",
      unit: "g",
    },
    {
      name: "Carbs",
      value: carbs.current,
      goal: carbs.goal,
      color: "bg-green-500",
      unit: "g",
    },
    {
      name: "Fats",
      value: fats.current,
      goal: fats.goal,
      color: "bg-yellow-500",
      unit: "g",
    },
  ];

  const calorieProgress = (calories.current / calories.goal) * 100;
  const waterProgress = (water.current / water.goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg sm:rounded-xl border border-border p-3 sm:p-4 md:p-6 shadow-soft"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
          Today's Nutrition
        </h2>
        <button
          onClick={onQuickLog}
          className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-md sm:rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <Icon name="Plus" size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium">Quick Log</span>
        </button>
      </div>

      {/* Calorie Progress */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            Calories
          </span>
          <span className="text-xs sm:text-sm font-mono text-foreground">
            {calories.current?.toLocaleString()} /{" "}
            {calories.goal?.toLocaleString()}
          </span>
        </div>
        <div className="relative w-full bg-muted rounded-full h-2 sm:h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-2 sm:h-3 rounded-full ${
              calorieProgress > 100 ? "bg-warning" : "bg-primary"
            }`}
          />
          {calorieProgress > 100 && (
            <div className="absolute right-1 sm:right-2 top-0 h-2 sm:h-3 flex items-center">
              <Icon
                name="AlertTriangle"
                size={10}
                className="sm:w-3 sm:h-3"
                color="white"
              />
            </div>
          )}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            0
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {calories.goal?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Macronutrients */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
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
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--color-muted)"
                    strokeWidth="2"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={
                      macro?.color?.replace("bg-", "")?.replace("-500", "") ||
                      (macro?.color?.includes("blue")
                        ? "#3b82f6"
                        : macro?.color?.includes("green")
                        ? "#10b981"
                        : "#f59e0b")
                    }
                    strokeWidth="2"
                    strokeDasharray={`${progress}, 100`}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${progress}, 100` }}
                    transition={{ duration: 1, delay: 0.3 + 0.1 * index }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-foreground">
                    {Math.round(progress) || 0}%
                  </span>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-foreground mb-1">
                {macro?.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {macro?.value || 0}
                {macro?.unit} / {macro?.goal || 0}
                {macro?.unit}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Water Intake */}
      <div className="border-t border-border pt-3 sm:pt-4 mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Icon
              name="Droplets"
              size={14}
              className="sm:w-4 sm:h-4"
              color="var(--color-blue-500)"
            />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Water Intake
            </span>
          </div>
          <span className="text-xs sm:text-sm font-mono text-foreground">
            {water?.current || 0}L / {water?.goal || 0}L
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

      {/* Meal Targets Breakdown */}
      <div className="border-t border-border pt-4 sm:pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            Daily Meal Targets
          </h3>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Target" size={12} className="sm:w-3 sm:h-3" />
            <span>Recommended</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(targets.byMeal).map(
            ([mealType, nutrition], index) => {
              // Map meal types to display names and icons
              const mealConfig = {
                breakfast: {
                  name: "Breakfast",
                  icon: "Coffee",
                  color: "from-orange-400 to-orange-600",
                  bgColor: "bg-orange-50",
                  borderColor: "border-orange-200",
                  textColor: "text-orange-800",
                  time: "7:00 - 10:00 AM",
                },
                lunch: {
                  name: "Lunch",
                  icon: "Sun",
                  color: "from-yellow-400 to-yellow-600",
                  bgColor: "bg-yellow-50",
                  borderColor: "border-yellow-200",
                  textColor: "text-yellow-800",
                  time: "12:00 - 2:00 PM",
                },
                dinner: {
                  name: "Dinner",
                  icon: "Moon",
                  color: "from-purple-400 to-purple-600",
                  bgColor: "bg-purple-50",
                  borderColor: "border-purple-200",
                  textColor: "text-purple-800",
                  time: "6:00 - 8:00 PM",
                },
              };

              const config = mealConfig[mealType];

              // Calculate if this meal has been consumed (placeholder logic)
              const mealConsumed = false; // You can implement actual logic here
              const consumedPercentage = mealConsumed ? 100 : 0;

              return (
                <motion.div
                  key={mealType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`relative overflow-hidden rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-4 transition-all duration-300 hover:shadow-md group`}
                >
                  {/* Header with Icon and Name */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center shadow-sm`}
                      >
                        <Icon
                          name={config.icon}
                          size={16}
                          className="sm:w-5 sm:h-5"
                          color="white"
                        />
                      </div>
                      <div>
                        <h4
                          className={`text-sm sm:text-base font-semibold ${config.textColor}`}
                        >
                          {config.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {config.time}
                        </p>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        mealConsumed ? "bg-green-500" : "bg-gray-300"
                      } transition-colors`}
                    />
                  </div>

                  {/* Calories - Main Focus */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center space-x-1 mb-2">
                      <span
                        className={`text-2xl sm:text-3xl font-bold ${config.textColor}`}
                      >
                        {nutrition.calories}
                      </span>
                      <span className="text-sm text-muted-foreground">cal</span>
                    </div>

                    {/* Progress bar for calories */}
                    <div className="relative w-full bg-white/60 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${consumedPercentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                        className={`h-2 rounded-full bg-gradient-to-r ${config.color}`}
                      />
                    </div>
                  </div>

                  {/* Macronutrients Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="text-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {nutrition.protein}g
                      </p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>

                    <div className="text-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {nutrition.carbs}g
                      </p>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                    </div>

                    <div className="text-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {nutrition.fats}g
                      </p>
                      <p className="text-xs text-muted-foreground">Fats</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-white/40">
                    <button className="w-full py-2 px-3 bg-white/60 hover:bg-white/80 rounded-lg transition-colors text-xs sm:text-sm font-medium text-gray-700 group-hover:bg-white/90">
                      {mealConsumed ? "View Details" : "Plan Meal"}
                    </button>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full opacity-0 group-hover:translate-x-[-100%] group-hover:opacity-100 transition-all duration-700 ease-out" />
                </motion.div>
              );
            }
          )}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} color="var(--color-blue-600)" />
              <span className="text-sm font-medium text-blue-900">
                Daily Distribution
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-blue-700">
              <span>30% • 40% • 30%</span>
            </div>
          </div>
        </motion.div>

        {/* Optional: Show planned meals count */}
        {plannedMeals.length > 0 && (
          <div className="mt-2 sm:mt-3 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {
                plannedMeals.filter(
                  (meal) =>
                    meal.day ===
                    selectedDate
                      .toLocaleDateString("en-US", {
                        weekday: "long",
                      })
                      .toLowerCase()
                ).length
              }{" "}
              meals planned for today
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NutritionSummary;
