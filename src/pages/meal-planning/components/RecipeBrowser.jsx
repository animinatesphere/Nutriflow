import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const RecipeBrowser = ({ onRecipeSelect, onAddToMeal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // MOCK DATA COMMENTED OUT. Now fetched from Supabase below.
  /*
  const recipes = [ ... ];
  */

  // Supabase Table: recipes
  // Columns: id, name, image, cuisine, diet, calories, prep_time, cook_time, difficulty, rating, ingredients, description, tags (text[]), created_at

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      let query = supabase.from("recipes").select("*");

      if (selectedCuisine) query = query.eq("cuisine", selectedCuisine);
      if (selectedDiet) query = query.eq("diet", selectedDiet);
      if (maxPrepTime) query = query.lte("prep_time", parseInt(maxPrepTime));
      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase fetch error:", error);
        setRecipes([]);
      } else {
        setRecipes(
          data.map((r) => ({
            ...r,
            prepTime: r.prep_time,
            cookTime: r.cook_time,
            tags: r.tags || [],
          }))
        );
      }
    };

    fetchRecipes();
  }, [searchQuery, selectedCuisine, selectedDiet, maxPrepTime]);

  const cuisineOptions = [
    { value: "", label: "All Cuisines" },
    { value: "Mediterranean", label: "Mediterranean" },
    { value: "American", label: "American" },
    { value: "Thai", label: "Thai" },
    { value: "Indian", label: "Indian" },
    { value: "Greek", label: "Greek" },
  ];

  const dietOptions = [
    { value: "", label: "All Diets" },
    { value: "Vegetarian", label: "Vegetarian" },
    { value: "Keto", label: "Keto" },
    { value: "Dairy-Free", label: "Dairy-Free" },
    { value: "Gluten-Free", label: "Gluten-Free" },
  ];

  const prepTimeOptions = [
    { value: "", label: "Any Time" },
    { value: "15", label: "Under 15 min" },
    { value: "30", label: "Under 30 min" },
    { value: "60", label: "Under 1 hour" },
  ];

  const filteredRecipes = useMemo(() => {
    return recipes?.filter((recipe) => {
      const matchesSearch =
        recipe?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        recipe?.description
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase());
      const matchesCuisine =
        !selectedCuisine || recipe?.cuisine === selectedCuisine;
      const matchesDiet = !selectedDiet || recipe?.diet === selectedDiet;
      const matchesPrepTime =
        !maxPrepTime || recipe?.prepTime <= parseInt(maxPrepTime);

      return matchesSearch && matchesCuisine && matchesDiet && matchesPrepTime;
    });
  }, [searchQuery, selectedCuisine, selectedDiet, maxPrepTime]);

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

  // Helper: Get start of current week (Monday)
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // Add meal to weekly_meals table
  const [notification, setNotification] = useState("");

  // Modal state for meal planning
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planDay, setPlanDay] = useState("monday");
  const [planType, setPlanType] = useState("lunch");
  const [planRecipe, setPlanRecipe] = useState(null);

  const openPlanModal = (recipe) => {
    setPlanRecipe(recipe);
    setShowPlanModal(true);
  };

  const closePlanModal = () => {
    setShowPlanModal(false);
    setPlanRecipe(null);
    setPlanDay("monday");
    setPlanType("lunch");
  };

  const handlePlanMeal = async () => {
    if (!planRecipe) return;
    const week_start = getWeekStart();
    let user_id;
    if (supabase.auth.getUser) {
      const { data } = await supabase.auth.getUser();
      user_id = data?.user?.id;
    } else if (supabase.auth.user) {
      user_id = supabase.auth.user()?.id;
    }
    if (!user_id) {
      setNotification("User not authenticated.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    const { data, error } = await supabase.from("weekly_meals").insert([
      {
        user_id,
        week_start,
        day: planDay,
        type: planType,
        recipe_id: planRecipe.id,
      },
    ]);
    if (error) {
      setNotification("Error adding meal: " + error.message);
      setTimeout(() => setNotification(""), 3000);
    } else {
      setNotification("Meal added to weekly plan!");
      setTimeout(() => setNotification(""), 3000);
      closePlanModal();
    }
  };

  const RecipeCard = ({ recipe }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-soft transition-all duration-200 group"
    >
      <div className="relative aspect-video">
        <Image
          src={recipe?.image}
          alt={recipe?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-black/70 rounded-full px-2 py-1">
          <Icon name="Star" size={12} color="var(--color-warning)" />
          <span className="text-xs text-white font-mono">{recipe?.rating}</span>
        </div>

        {/* Quick Add Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            iconName="Plus"
            onClick={() => onAddToMeal(recipe)}
            className="bg-white/90 hover:bg-white"
          >
            Add
          </Button>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`text-xs font-caption px-2 py-1 bg-black/70 rounded-full text-white`}
          >
            {recipe?.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => onRecipeSelect(recipe)}
          >
            {recipe?.name}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>{recipe?.prepTime}m</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {recipe?.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="Flame" size={14} color="var(--color-error)" />
              <span className="font-mono text-foreground">
                {recipe?.calories}
              </span>
            </div>
            {/* <div className="flex items-center space-x-1">
              <Icon
                name="Users"
                size={14}
                color="var(--color-muted-foreground)"
              />
              <span className="text-muted-foreground">
                {recipe?.ingredients}
              </span>
            </div> */}
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>{recipe?.cuisine}</span>
            <span>•</span>
            <span>{recipe?.diet}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {recipe?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onRecipeSelect(recipe)}
          >
            View Recipe
          </Button>
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="CalendarPlus"
            onClick={() => openPlanModal(recipe)}
          >
            Plan Meal
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft">
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* Plan Meal Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-border animate-fade-in">
            <h3 className="text-lg font-heading font-bold mb-4 text-center text-foreground">
              Plan Meal for{" "}
              <span className="text-primary">{planRecipe?.name}</span>
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Day
              </label>
              <select
                className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
                value={planDay}
                onChange={(e) => setPlanDay(e.target.value)}
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Meal Type
              </label>
              <select
                className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                fullWidth
                iconName="CalendarPlus"
                onClick={handlePlanMeal}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="X"
                onClick={closePlanModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Search" size={20} color="var(--color-primary)" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Recipe Browser
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            iconName="Grid3X3"
            onClick={() => setViewMode("grid")}
          />
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            iconName="List"
            onClick={() => setViewMode("list")}
          />
        </div>
      </div>
      {/* Filters */}
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full"
          />

          <Select
            placeholder="Cuisine"
            options={cuisineOptions}
            value={selectedCuisine}
            onChange={setSelectedCuisine}
          />

          <Select
            placeholder="Diet"
            options={dietOptions}
            value={selectedDiet}
            onChange={setSelectedDiet}
          />

          <Select
            placeholder="Prep Time"
            options={prepTimeOptions}
            value={maxPrepTime}
            onChange={setMaxPrepTime}
          />
        </div>

        {(searchQuery || selectedCuisine || selectedDiet || maxPrepTime) && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {filteredRecipes?.length} recipes found
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => {
                setSearchQuery("");
                setSelectedCuisine("");
                setSelectedDiet("");
                setMaxPrepTime("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      {/* Recipe Grid */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {filteredRecipes?.length > 0 ? (
            <motion.div
              key="recipes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredRecipes?.map((recipe) => (
                <RecipeCard key={recipe?.id} recipe={recipe} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Icon
                name="Search"
                size={48}
                color="var(--color-muted-foreground)"
              />
              <h3 className="text-lg font-heading font-semibold text-foreground mt-4">
                No recipes found
              </h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search criteria or browse all recipes
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCuisine("");
                  setSelectedDiet("");
                  setMaxPrepTime("");
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecipeBrowser;
