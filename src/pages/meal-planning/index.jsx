import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WeeklyCalendar from './components/WeeklyCalendar';
import RecipeBrowser from './components/RecipeBrowser';
import MealPlanningContainer from './components/MealPlanningContainer';
import NutritionSummary from './components/NutritionSummary';
import ShoppingList from './components/ShoppingList';
import MealSuggestions from './components/MealSuggestions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MealPlanningPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showMealModal, setShowMealModal] = useState(false);

  // Fetch planned meals from Supabase
  const [plannedMeals, setPlannedMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const userData = JSON.parse(localStorage.getItem('nutriflow_user'));
      const userId = userData?.id || userData?.user?.id;
      if (!userId) return;
      const { data, error } = await supabase
        .from('planned_meals')
        .select('*')
        .eq('user_id', userId);
      if (!error && data) {
        // Map macros for compatibility with old code
        setPlannedMeals(
          data.map(meal => ({
            ...meal,
            macros: {
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat
            }
          }))
        );
      }
    };
    fetchMeals();
  }, []);

  // Supabase Table Mapping for Admin Management:
  // Table: planned_meals
  // Columns:
  //   id (uuid or serial, PK)
  //   user_id (uuid, FK to profiles)
  //   day (text)
  //   type (text: breakfast/lunch/dinner)
  //   name (text)
  //   image (text)
  //   calories (integer)
  //   prep_time (integer)
  //   protein (integer)
  //   carbs (integer)
  //   fat (integer)
  //   created_at (timestamp)
  // Admin can add/edit/delete meals in this table via an admin UI.

  // Mock nutrition data
  const weeklyNutritionData = {
    calories: 12450,
    protein: 520,
    carbs: 1240,
    fat: 380
  };

  const nutritionGoals = {
    calories: 14000,
    protein: 600,
    carbs: 1400,
    fat: 400
  };

  const userPreferences = {
    cuisines: ['Mediterranean', 'Asian', 'American'],
    dietaryRestrictions: ['Vegetarian'],
    allergies: [],
    preferredMealTimes: {
      breakfast: '08:00',
      lunch: '13:00',
      dinner: '19:00'
    }
  };

  const tabs = [
    { id: 'calendar', name: 'Weekly Calendar', icon: 'Calendar' },
    { id: 'recipes', name: 'Recipe Browser', icon: 'Search' },
    { id: 'nutrition', name: 'Nutrition Summary', icon: 'Target' },
    { id: 'shopping', name: 'Shopping List', icon: 'ShoppingCart' },
    { id: 'suggestions', name: 'Meal Suggestions', icon: 'Sparkles' }
  ];

  useEffect(() => {
    // Set page title
    document.title = 'Meal Planning - NutriFlow';
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleWeekChange = (direction) => {
    const newWeek = new Date(currentWeek);
    if (direction === 'next') {
      newWeek?.setDate(newWeek?.getDate() + 7);
    } else {
      newWeek?.setDate(newWeek?.getDate() - 7);
    }
    setCurrentWeek(newWeek);
  };

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
    setShowMealModal(true);
  };

  const handleMealRemove = (mealId) => {
    setPlannedMeals(prev => prev?.filter(meal => meal?.id !== mealId));
  };

  const handleAddMeal = (day, mealType) => {
    // Navigate to recipe browser or show meal selection modal
    setActiveTab('recipes');
  };

  const handleRecipeSelect = (recipe) => {
    // Handle recipe selection logic
    console.log('Selected recipe:', recipe);
  };

  const handleAddToMeal = (recipe) => {
    // Add recipe to meal plan
    const newMeal = {
      id: Date.now(),
      day: 'monday', // This would be dynamic based on user selection
      type: 'breakfast', // This would be dynamic based on user selection
      name: recipe?.name,
      image: recipe?.image,
      calories: recipe?.calories,
      prepTime: recipe?.prepTime,
      macros: recipe?.macros || { protein: 20, carbs: 30, fat: 15 }
    };
    
    setPlannedMeals(prev => [...prev, newMeal]);
    setActiveTab('calendar');
  };

  const handleGoalUpdate = () => {
    // Handle nutrition goal updates
    console.log('Update nutrition goals');
  };

  const handleGenerateShoppingList = () => {
    // Generate shopping list from planned meals
    console.log('Generate shopping list');
  };

  const handleExportShoppingList = () => {
    // Export shopping list
    console.log('Export shopping list');
  };

  const handleAddSuggestion = (suggestion) => {
    handleAddToMeal(suggestion);
  };

  const handleDismissSuggestion = (suggestionId) => {
    // Handle dismissing suggestion
    console.log('Dismiss suggestion:', suggestionId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <WeeklyCalendar
            currentWeek={currentWeek}
            plannedMeals={plannedMeals}
            onMealSelect={handleMealSelect}
            onMealRemove={handleMealRemove}
            onWeekChange={handleWeekChange}
            onAddMeal={handleAddMeal}
          />
        );
      case 'recipes':
        return (
          <MealPlanningContainer onAddToMeal={handleAddToMeal} />
        );
      case 'nutrition':
        return (
          <NutritionSummary
            weeklyData={weeklyNutritionData}
            goals={nutritionGoals}
            onGoalUpdate={handleGoalUpdate}
          />
        );
      case 'shopping':
        return (
          <ShoppingList
            plannedMeals={plannedMeals}
            onGenerateList={handleGenerateShoppingList}
            onExportList={handleExportShoppingList}
          />
        );
      case 'suggestions':
        return (
          <MealSuggestions
            userPreferences={userPreferences}
            nutritionGoals={nutritionGoals}
            onAddSuggestion={handleAddSuggestion}
            onDismissSuggestion={handleDismissSuggestion}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Meal Planning
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Organize your weekly meals, discover new recipes, and maintain consistent nutrition goals 
                  through our comprehensive meal planning tools.
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-primary">
                    {plannedMeals?.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Meals Planned</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-success">
                    85%
                  </div>
                  <div className="text-xs text-muted-foreground">Week Complete</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <Button
                  variant="default"
                  iconName="Plus"
                  onClick={() => setActiveTab('recipes')}
                >
                  Add Recipe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center space-x-1 overflow-x-auto py-4">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={tab?.icon} 
                    size={16} 
                    color={activeTab === tab?.id ? 'white' : 'currentColor'} 
                  />
                  <span className="font-body font-medium">{tab?.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>

        {/* Quick Actions - Mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <div className="flex flex-col space-y-3">
            <Button
              variant="default"
              size="icon"
              iconName="Plus"
              onClick={() => setActiveTab('recipes')}
              className="rounded-full shadow-elevated"
            />
            <Button
              variant="secondary"
              size="icon"
              iconName="ShoppingCart"
              onClick={() => setActiveTab('shopping')}
              className="rounded-full shadow-elevated"
            />
          </div>
        </div>

        {/* Meal Detail Modal */}
        {showMealModal && selectedMeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-xl border border-border shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative aspect-video">
                <img
                  src={selectedMeal?.image}
                  alt={selectedMeal?.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                <button
                  onClick={() => setShowMealModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/70 rounded-full text-white hover:bg-black/80 transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                  {selectedMeal?.name}
                </h3>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-heading font-bold text-primary">
                      {selectedMeal?.calories}
                    </div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div>
                    <div className="text-lg font-heading font-bold text-foreground">
                      {selectedMeal?.prepTime}m
                    </div>
                    <div className="text-xs text-muted-foreground">Prep Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-heading font-bold text-success">
                      {selectedMeal?.macros?.protein}g
                    </div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/cooking-games')}
                  >
                    Cook Now
                  </Button>
                  <Button
                    variant="default"
                    fullWidth
                    onClick={() => {
                      setShowMealModal(false);
                      setActiveTab('recipes');
                    }}
                  >
                    View Recipe
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MealPlanningPage;