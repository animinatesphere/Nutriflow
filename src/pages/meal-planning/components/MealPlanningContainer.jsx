import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import RecipeBrowser from "./RecipeBrowser";

import RecipeDetailView from "./RecipeDetailView";
const MealPlanningContainer = () => {
  // State to manage selected recipe for detail view
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  // State for notification
  const [notification, setNotification] = useState("");

  // Handler for when a recipe is selected to view details
  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Handler for closing the recipe detail view
  const handleCloseRecipeDetail = () => {
    setSelectedRecipe(null);
  };

  // Handler for adding recipe to meal plan (you can customize this)
  const handleAddToMeal = (recipe) => {
    console.log("Adding recipe to meal plan:", recipe);
    // Add your meal planning logic here
    // For example: dispatch to a meal planning state, call an API, etc.

    // Show notification instead of alert
    setNotification(`${recipe.name} added to meal plan!`);
    setTimeout(() => setNotification(""), 3000);

    // Optional: Close the detail view after adding
    if (selectedRecipe) {
      setSelectedRecipe(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notification Banner */}
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-success text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-all">
          {notification}
        </div>
      )}

      {/* Main Recipe Browser */}
      <div className="container mx-auto px-4 py-8">
        <RecipeBrowser
          onRecipeSelect={handleRecipeSelect}
          onAddToMeal={handleAddToMeal}
        />
      </div>

      {/* Recipe Detail Modal - Only shows when a recipe is selected */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetailView
            recipe={selectedRecipe}
            onClose={handleCloseRecipeDetail}
            onAddToMeal={handleAddToMeal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealPlanningContainer;
