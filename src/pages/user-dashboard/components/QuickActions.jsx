import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const QuickActions = ({
  onQuickLog,
  onBrowseRecipes,
  onStartGame,
  subscriptionTier,
}) => {
  const quickActions = [
    {
      id: "log-meal",
      title: "Log Meal",
      description: "Quick meal entry",
      icon: "Plus",
      color: "bg-primary",
      textColor: "text-primary-foreground",
      onClick: onQuickLog,
      premium: false,
    },
    {
      id: "browse-recipes",
      title: "Browse Recipes",
      description: "Find new recipes",
      icon: "Book",
      color: "bg-secondary",
      textColor: "text-secondary-foreground",
      onClick: onBrowseRecipes,
      premium: false,
    },
    {
      id: "start-game",
      title: "Start Game",
      description: "Cooking challenge",
      icon: "Gamepad2",
      color: "bg-accent",
      textColor: "text-accent-foreground",
      onClick: onStartGame,
      premium: false,
    },
    {
      id: "ai-suggestions",
      title: "AI Suggestions",
      description: "Personalized recommendations",
      icon: "Sparkles",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      textColor: "text-white",
      onClick: () => console.log("AI Suggestions"),
      premium: true,
    },
    {
      id: "nutrition-analysis",
      title: "Deep Analysis",
      description: "Advanced nutrition insights",
      icon: "BarChart3",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      textColor: "text-white",
      onClick: () => console.log("Nutrition Analysis"),
      premium: true,
    },
    {
      id: "meal-prep",
      title: "Meal Prep Guide",
      description: "Weekly prep planning",
      icon: "Calendar",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      textColor: "text-white",
      onClick: () => console.log("Meal Prep"),
      premium: true,
    },
  ];

  const isPremium = subscriptionTier === "Premium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card rounded-lg sm:rounded-xl border border-border p-3 sm:p-4 md:p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
          Quick Actions
        </h2>
        {!isPremium && (
          <Link
            to="/subscription"
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md sm:rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-soft"
          >
            <Icon name="Crown" size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Upgrade</span>
          </Link>
        )}
      </div>

      {/* Responsive Grid - 1 col on mobile, 2 cols on small screens, 3 cols on medium+ */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {quickActions?.map((action, index) => {
          const isLocked = action?.premium && !isPremium;

          return (
            <motion.button
              key={action?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
              onClick={isLocked ? undefined : action?.onClick}
              disabled={isLocked}
              className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 text-left group min-h-[80px] sm:min-h-[100px] ${
                isLocked
                  ? "bg-muted/50 cursor-not-allowed opacity-60"
                  : `${action?.color} hover:shadow-elevated cursor-pointer`
              }`}
            >
              {/* Premium Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-black/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-1.5 sm:p-2">
                    <Icon
                      name="Lock"
                      size={14}
                      className="sm:w-4 sm:h-4"
                      color="var(--color-muted-foreground)"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isLocked ? "bg-muted" : "bg-white/20"
                  }`}
                >
                  <Icon
                    name={action?.icon}
                    size={16}
                    className="sm:w-5 sm:h-5"
                    color={isLocked ? "var(--color-muted-foreground)" : "white"}
                  />
                </div>

                {action?.premium && (
                  <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
                    <Icon
                      name="Crown"
                      size={10}
                      className="sm:w-3 sm:h-3"
                      color={
                        isLocked ? "var(--color-muted-foreground)" : "white"
                      }
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-medium ${
                        isLocked ? "text-muted-foreground" : "text-white/80"
                      }`}
                    >
                      PRO
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3
                  className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 leading-tight truncate ${
                    isLocked ? "text-muted-foreground" : action?.textColor
                  }`}
                >
                  {action?.title}
                </h3>
                <p
                  className={`text-[10px] sm:text-xs leading-tight line-clamp-2 ${
                    isLocked
                      ? "text-muted-foreground"
                      : `${action?.textColor} opacity-80`
                  }`}
                >
                  {action?.description}
                </p>
              </div>

              {/* Hover Effect */}
              {!isLocked && (
                <div className="absolute inset-0 bg-white/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Premium Upgrade Banner */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon
                name="Sparkles"
                size={16}
                className="sm:w-5 sm:h-5"
                color="white"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-medium text-purple-900 mb-0.5">
                Unlock Premium Features
              </h4>
              <p className="text-[10px] sm:text-xs text-purple-700 leading-tight">
                Get AI-powered suggestions, advanced analytics, and personalized
                meal prep guides
              </p>
            </div>
            <Link
              to="/subscription"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex-shrink-0"
            >
              Upgrade
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuickActions;
