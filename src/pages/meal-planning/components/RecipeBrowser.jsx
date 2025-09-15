import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RecipeBrowser = ({ onRecipeSelect, onAddToMeal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [maxPrepTime, setMaxPrepTime] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const recipes = [
    {
      id: 1,
      name: "Mediterranean Quinoa Bowl",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      cuisine: "Mediterranean",
      diet: "Vegetarian",
      calories: 420,
      prepTime: 25,
      cookTime: 15,
      difficulty: "Easy",
      rating: 4.8,
      ingredients: 12,
      description: "A nutritious bowl packed with quinoa, fresh vegetables, and Mediterranean flavors.",
      tags: ["Healthy", "Quick", "Protein-Rich"]
    },
    {
      id: 2,
      name: "Grilled Salmon with Asparagus",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
      cuisine: "American",
      diet: "Keto",
      calories: 380,
      prepTime: 15,
      cookTime: 20,
      difficulty: "Medium",
      rating: 4.9,
      ingredients: 8,
      description: "Perfectly grilled salmon with roasted asparagus and lemon herb butter.",
      tags: ["Low-Carb", "High-Protein", "Omega-3"]
    },
    {
      id: 3,
      name: "Thai Green Curry",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
      cuisine: "Thai",
      diet: "Dairy-Free",
      calories: 350,
      prepTime: 30,
      cookTime: 25,
      difficulty: "Medium",
      rating: 4.7,
      ingredients: 15,
      description: "Aromatic Thai curry with coconut milk, vegetables, and fragrant spices.",
      tags: ["Spicy", "Coconut", "Authentic"]
    },
    {
      id: 4,
      name: "Avocado Toast with Poached Egg",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
      cuisine: "American",
      diet: "Vegetarian",
      calories: 320,
      prepTime: 10,
      cookTime: 5,
      difficulty: "Easy",
      rating: 4.6,
      ingredients: 6,
      description: "Classic avocado toast topped with perfectly poached egg and seasonings.",
      tags: ["Breakfast", "Quick", "Healthy Fats"]
    },
    {
      id: 5,
      name: "Chicken Tikka Masala",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
      cuisine: "Indian",
      diet: "Gluten-Free",
      calories: 450,
      prepTime: 45,
      cookTime: 30,
      difficulty: "Hard",
      rating: 4.8,
      ingredients: 18,
      description: "Rich and creamy Indian curry with tender chicken in tomato-based sauce.",
      tags: ["Comfort Food", "Spicy", "Traditional"]
    },
    {
      id: 6,
      name: "Greek Salad with Grilled Chicken",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
      cuisine: "Greek",
      diet: "Keto",
      calories: 380,
      prepTime: 20,
      cookTime: 15,
      difficulty: "Easy",
      rating: 4.5,
      ingredients: 10,
      description: "Fresh Greek salad with grilled chicken, feta cheese, and olive oil dressing.",
      tags: ["Fresh", "Mediterranean", "Low-Carb"]
    }
  ];

  const cuisineOptions = [
    { value: '', label: 'All Cuisines' },
    { value: 'Mediterranean', label: 'Mediterranean' },
    { value: 'American', label: 'American' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Greek', label: 'Greek' }
  ];

  const dietOptions = [
    { value: '', label: 'All Diets' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Keto', label: 'Keto' },
    { value: 'Dairy-Free', label: 'Dairy-Free' },
    { value: 'Gluten-Free', label: 'Gluten-Free' }
  ];

  const prepTimeOptions = [
    { value: '', label: 'Any Time' },
    { value: '15', label: 'Under 15 min' },
    { value: '30', label: 'Under 30 min' },
    { value: '60', label: 'Under 1 hour' }
  ];

  const filteredRecipes = useMemo(() => {
    return recipes?.filter(recipe => {
      const matchesSearch = recipe?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           recipe?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesCuisine = !selectedCuisine || recipe?.cuisine === selectedCuisine;
      const matchesDiet = !selectedDiet || recipe?.diet === selectedDiet;
      const matchesPrepTime = !maxPrepTime || recipe?.prepTime <= parseInt(maxPrepTime);
      
      return matchesSearch && matchesCuisine && matchesDiet && matchesPrepTime;
    });
  }, [searchQuery, selectedCuisine, selectedDiet, maxPrepTime]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Hard': return 'text-error';
      default: return 'text-muted-foreground';
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
          <span className={`text-xs font-caption px-2 py-1 bg-black/70 rounded-full text-white`}>
            {recipe?.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer"
              onClick={() => onRecipeSelect(recipe)}>
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
              <span className="font-mono text-foreground">{recipe?.calories}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} color="var(--color-muted-foreground)" />
              <span className="text-muted-foreground">{recipe?.ingredients}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>{recipe?.cuisine}</span>
            <span>•</span>
            <span>{recipe?.diet}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {recipe?.tags?.slice(0, 3)?.map((tag, index) => (
            <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
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
            onClick={() => onAddToMeal(recipe)}
          >
            Plan Meal
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft">
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
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            iconName="Grid3X3"
            onClick={() => setViewMode('grid')}
          />
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            iconName="List"
            onClick={() => setViewMode('list')}
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
                setSearchQuery('');
                setSelectedCuisine('');
                setSelectedDiet('');
                setMaxPrepTime('');
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
                viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :'grid-cols-1'
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
              <Icon name="Search" size={48} color="var(--color-muted-foreground)" />
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
                  setSearchQuery('');
                  setSelectedCuisine('');
                  setSelectedDiet('');
                  setMaxPrepTime('');
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