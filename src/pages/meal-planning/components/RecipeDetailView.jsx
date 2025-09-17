import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../utils/supabaseClient";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import RecipeBrowser from "./RecipeBrowser"; // Import your RecipeBrowser component

const RecipeDetailView = ({ recipe, onClose, onAddToMeal }) => {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [servings, setServings] = useState(4);
  const [isFavorited, setIsFavorited] = useState(false);
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch complete recipe data from Supabase
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipe?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", recipe.id)
          .single();

        if (!error && data) {
          setRecipeData({
            ...data,
            prepTime: data.prep_time,
            cookTime: data.cook_time,
            tags: data.tags || [],
            instructions: data.instructions || [],
          });
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipe?.id]);

  // Parse ingredients from the string to array
  const parseIngredients = (ingredientsString) => {
    if (!ingredientsString) return [];
    return ingredientsString.split(",").map((ingredient) => ingredient.trim());
  };

  const ingredients = recipeData
    ? parseIngredients(recipeData.ingredients)
    : [];
  const instructions = recipeData?.instructions || [];

  // Calculate nutrition per serving (simplified calculation)
  const nutritionPerServing = recipeData
    ? {
        calories: Math.round((recipeData.calories || 0) / servings),
        protein: Math.round(((recipeData.calories || 0) * 0.15) / 4 / servings), // Estimate 15% calories from protein
        carbs: Math.round(((recipeData.calories || 0) * 0.45) / 4 / servings), // Estimate 45% calories from carbs
        fat: Math.round(((recipeData.calories || 0) * 0.4) / 9 / servings), // Estimate 40% calories from fat
      }
    : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-success";
      case "Medium":
        return "text-warning";
      case "Hard":
        return "text-error";
      default:
        return "text-muted-foreground";
    }
  };

  const tabs = [
    { id: "ingredients", label: "Ingredients", icon: "List" },
    { id: "instructions", label: "Instructions", icon: "BookOpen" },
    { id: "nutrition", label: "Nutrition", icon: "Activity" },
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div className="bg-card rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-foreground">Loading recipe...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!recipeData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div className="bg-card rounded-lg p-8 text-center">
          <Icon name="AlertCircle" size={48} color="var(--color-error)" />
          <h3 className="text-lg font-heading font-semibold text-foreground mt-4">
            Recipe not found
          </h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Unable to load recipe details.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header with Image */}
          <div className="relative">
            <div className="aspect-video md:aspect-[21/9]">
              <Image
                src={recipeData.image}
                alt={recipeData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Close Button */}
            <Button
              variant="secondary"
              size="sm"
              iconName="X"
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            />

            {/* Recipe Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {recipeData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                {recipeData.name}
              </h1>

              <p className="text-white/90 text-lg mb-4 max-w-2xl">
                {recipeData.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Star" size={16} color="var(--color-warning)" />
                  <span className="font-mono">{recipeData.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>
                    {recipeData.prepTime + recipeData.cookTime} min total
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="ChefHat" size={16} />
                  <span className={getDifficultyColor(recipeData.difficulty)}>
                    {recipeData.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} />
                  <span>{servings} servings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Action Bar */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-foreground">
                    Servings:
                  </label>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Minus"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      disabled={servings <= 1}
                    />
                    <span className="w-8 text-center font-mono text-foreground">
                      {servings}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Plus"
                      onClick={() => setServings(servings + 1)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName={isFavorited ? "Heart" : "Heart"}
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={isFavorited ? "text-error border-error" : ""}
                >
                  {isFavorited ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="CalendarPlus"
                  onClick={() => onAddToMeal(recipeData)}
                >
                  Add to Meal Plan
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border bg-muted/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary bg-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === "ingredients" && (
                  <motion.div
                    key="ingredients"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid gap-3">
                      {ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-foreground">{ingredient}</span>
                        </div>
                      ))}
                    </div>

                    {ingredients.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Icon
                          name="List"
                          size={48}
                          color="var(--color-muted-foreground)"
                        />
                        <p className="mt-4">
                          No ingredients available for this recipe.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "instructions" && (
                  <motion.div
                    key="instructions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-6">
                      {instructions.map((step, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <p className="text-foreground leading-relaxed pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    {instructions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Icon
                          name="BookOpen"
                          size={48}
                          color="var(--color-muted-foreground)"
                        />
                        <p className="mt-4">
                          No instructions available for this recipe.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "nutrition" && (
                  <motion.div
                    key="nutrition"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {nutritionPerServing.calories}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Calories
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {nutritionPerServing.protein}g
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Protein
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {nutritionPerServing.carbs}g
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Carbs
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {nutritionPerServing.fat}g
                        </div>
                        <div className="text-sm text-muted-foreground">Fat</div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="font-heading font-semibold text-foreground mb-4">
                        Recipe Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Cuisine:
                          </span>
                          <span className="ml-2 text-foreground">
                            {recipeData.cuisine}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Diet:</span>
                          <span className="ml-2 text-foreground">
                            {recipeData.diet || "Regular"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Prep Time:
                          </span>
                          <span className="ml-2 text-foreground">
                            {recipeData.prepTime} min
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Cook Time:
                          </span>
                          <span className="ml-2 text-foreground">
                            {recipeData.cookTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecipeDetailView;
