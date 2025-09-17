import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

import { supabase } from "../../../utils/supabaseClient";

const WeeklyCalendar = ({
  currentWeek,
  onMealSelect,
  onMealRemove,
  onWeekChange,
  onAddMeal,
  userId, // Replace with actual user id from auth
}) => {
  const [draggedMeal, setDraggedMeal] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [plannedMeals, setPlannedMeals] = useState([]);

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

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const mealTypes = ["breakfast", "lunch", "dinner"];

  const getMealForSlot = (day, mealType) => {
    return plannedMeals?.find(
      (meal) => meal?.day === day && meal?.type === mealType
    );
  };

  const handleDragStart = (e, meal) => {
    setDraggedMeal(meal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (day, mealType) => {
    setDragOverSlot(`${day}-${mealType}`);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e, day, mealType) => {
    e?.preventDefault();
    if (draggedMeal) {
      // Handle meal rearrangement logic here
      console.log(`Moving meal to ${day} ${mealType}`);
    }
    setDraggedMeal(null);
    setDragOverSlot(null);
  };

  const formatDate = (dayIndex) => {
    const date = new Date();
    date?.setDate(date?.getDate() - date?.getDay() + 1 + dayIndex);
    return date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getMealTypeIcon = (type) => {
    switch (type) {
      case "breakfast":
        return "Coffee";
      case "lunch":
        return "Sandwich";
      case "dinner":
        return "UtensilsCrossed";
      default:
        return "Utensils";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft w-full">
      <div>
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-border gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
              Weekly Meal Plan
            </h2>
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground">
              <Icon name="Calendar" size={16} />
              <span>Week of {formatDate(0)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              onClick={() => onWeekChange("prev")}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconPosition="right"
              onClick={() => onWeekChange("next")}
            >
              Next
            </Button>
          </div>
        </div>
        {/* Calendar Grid */}
        <div className="p-4 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-8 gap-2 sm:gap-4 min-w-[700px] max-w-full">
              {/* Header Row */}
              <div className="font-heading font-semibold text-xs sm:text-sm text-muted-foreground">
                Meal Type
              </div>
              {weekDays?.map((day, index) => (
                <div key={day} className="text-center">
                  <div className="font-heading font-semibold text-xs sm:text-sm text-foreground">
                    {day}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    {formatDate(index)}
                  </div>
                </div>
              ))}
              {/* Meal Rows */}
              {mealTypes?.map((mealType) => (
                <React.Fragment key={mealType}>
                  {/* Meal Type Label */}
                  <div className="flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4">
                    <Icon
                      name={getMealTypeIcon(mealType)}
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                    <span className="font-body font-medium text-xs sm:text-sm text-foreground capitalize">
                      {mealType}
                    </span>
                  </div>
                  {/* Meal Slots */}
                  {weekDays?.map((day, dayIndex) => {
                    const meal = getMealForSlot(day?.toLowerCase(), mealType);
                    const slotId = `${day?.toLowerCase()}-${mealType}`;
                    const isDragOver = dragOverSlot === slotId;
                    return (
                      <div
                        key={slotId}
                        className={`relative min-h-[80px] sm:min-h-[120px] border-2 border-dashed rounded-lg transition-all duration-200 ${
                          isDragOver
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onDragOver={handleDragOver}
                        onDragEnter={() =>
                          handleDragEnter(day?.toLowerCase(), mealType)
                        }
                        onDragLeave={handleDragLeave}
                        onDrop={(e) =>
                          handleDrop(e, day?.toLowerCase(), mealType)
                        }
                      >
                        {meal ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-2 sm:p-3 h-full cursor-move"
                            draggable
                            onDragStart={(e) => handleDragStart(e, meal)}
                          >
                            <div className="relative group h-full bg-muted rounded-lg overflow-hidden hover:shadow-soft transition-shadow">
                              <div className="aspect-video relative">
                                <Image
                                  src={meal?.image}
                                  alt={meal?.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {/* Action Buttons */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => onMealSelect(meal)}
                                      className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                                    >
                                      <Icon
                                        name="Eye"
                                        size={12}
                                        color="var(--color-foreground)"
                                      />
                                    </button>
                                    <button
                                      onClick={() => onMealRemove(meal?.id)}
                                      className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                                    >
                                      <Icon
                                        name="X"
                                        size={12}
                                        color="var(--color-error)"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="p-1 sm:p-2">
                                <h4 className="font-body font-medium text-[11px] sm:text-xs text-foreground truncate">
                                  {meal?.name}
                                </h4>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[11px] sm:text-xs text-success font-mono">
                                    {meal?.calories} cal
                                  </span>
                                  <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-muted-foreground">
                                    <Icon name="Clock" size={10} />
                                    <span>{meal?.prepTime}m</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="Plus"
                              onClick={() =>
                                onAddMeal(day?.toLowerCase(), mealType)
                              }
                              className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 py-1"
                            >
                              Add Meal
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
            <div>
              <div className="text-base sm:text-lg font-heading font-bold text-foreground">
                {plannedMeals?.length}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Meals Planned
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-heading font-bold text-success">
                {plannedMeals?.reduce((sum, meal) => sum + meal?.calories, 0)}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Total Calories
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-heading font-bold text-primary">
                {Math.round(
                  plannedMeals?.reduce((sum, meal) => sum + meal?.prepTime, 0) /
                    60
                )}
                h
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Prep Time
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-heading font-bold text-accent">
                85%
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Week Complete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
