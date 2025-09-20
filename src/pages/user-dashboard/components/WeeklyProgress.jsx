import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { gsap } from "gsap";
import Icon from "../../../components/AppIcon";

const WeeklyProgress = ({
  weeklyData = [],
  achievements = [],
  gameProgress = [],
}) => {
  const chartRef = useRef(null);
  const achievementRefs = useRef([]);

  useEffect(() => {
    // GSAP animation for achievement badges
    if (achievementRefs?.current?.length > 0) {
      gsap?.fromTo(
        achievementRefs?.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );
    }
  }, [achievements]);

  // Calculate XP from game progress
  const calculateWeeklyXP = () => {
    const weeklyXP = Array(7).fill(0);

    gameProgress.forEach((game) => {
      try {
        const bestScore =
          typeof game.best_score === "string"
            ? JSON.parse(game.best_score)
            : game.best_score;

        // Calculate XP: score + (maxStreak * 10) + (stepsCompleted * 5)
        const xp =
          (bestScore.score || 0) +
          (bestScore.maxStreak || 0) * 10 +
          (bestScore.stepsCompleted || 0) * 5;

        // Distribute XP across the week (you might want to use actual dates)
        const dayIndex = Math.floor(Math.random() * 7); // Placeholder - use actual game date
        weeklyXP[dayIndex] += xp;
      } catch (error) {
        console.error("Error parsing game score:", error);
      }
    });

    return weeklyXP;
  };

  // Calculate weekly achievements count
  const calculateWeeklyAchievements = () => {
    const weeklyAchievements = Array(7).fill(0);

    achievements.forEach((achievement, index) => {
      // Distribute achievements across the week (use actual dates in real implementation)
      const dayIndex = index % 7;
      weeklyAchievements[dayIndex] += 1;
    });

    return weeklyAchievements;
  };

  const weeklyXP = calculateWeeklyXP();
  const weeklyAchievements = calculateWeeklyAchievements();

  // Prepare chart data
  const chartData = Array.from({ length: 7 }, (_, index) => {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayData = weeklyData[index] || { calories: 0, goal: 2000 };

    return {
      day: dayNames[index],
      calories: dayData.calories || 0,
      calorieGoal: dayData.goal || 2000,
      xp: weeklyXP[index],
      achievements: weeklyAchievements[index],
      completion: ((dayData.calories || 0) / (dayData.goal || 2000)) * 100,
    };
  });

  // Calculate totals
  const totalCalories = chartData.reduce((acc, day) => acc + day.calories, 0);
  const totalXP = chartData.reduce((acc, day) => acc + day.xp, 0);
  const totalAchievements = chartData.reduce(
    (acc, day) => acc + day.achievements,
    0
  );
  const averageCompletion =
    chartData.reduce((acc, day) => acc + day.completion, 0) / 7;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-popover-foreground mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-popover-foreground">
                {entry.name}:{" "}
                {typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value}
                {entry.dataKey === "calories" && " cal"}
                {entry.dataKey === "xp" && " XP"}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-lg sm:rounded-xl border border-border p-3 sm:p-4 md:p-6 shadow-soft"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
          Weekly Progress
        </h2>
        <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-full self-start sm:self-auto">
          <Icon
            name="TrendingUp"
            size={14}
            className="sm:w-4 sm:h-4"
            color="var(--color-success)"
          />
          <span className="text-xs sm:text-sm font-mono font-medium text-success">
            {averageCompletion?.toFixed(1)}% avg
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20"
        >
          <div className="text-lg sm:text-2xl font-heading font-bold text-primary">
            {totalCalories.toLocaleString()}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            Total Calories
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center p-2 sm:p-3 bg-accent/10 rounded-lg border border-accent/20"
        >
          <div className="text-lg sm:text-2xl font-heading font-bold text-accent">
            {totalXP.toLocaleString()}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            Total XP
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center p-2 sm:p-3 bg-success/10 rounded-lg border border-success/20"
        >
          <div className="text-lg sm:text-2xl font-heading font-bold text-success">
            {totalAchievements}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            Achievements
          </div>
        </motion.div>
      </div>

      {/* Combined Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="h-48 sm:h-64 mb-4 sm:mb-6"
        ref={chartRef}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              opacity={0.3}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
              className="text-xs sm:text-sm"
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
              className="text-xs sm:text-sm"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
              className="text-xs sm:text-sm"
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Calories Bar */}
            <Bar
              yAxisId="left"
              dataKey="calories"
              fill="var(--color-primary)"
              radius={[2, 2, 0, 0]}
              name="Calories"
              opacity={0.8}
            />

            {/* XP Bar */}
            <Bar
              yAxisId="right"
              dataKey="xp"
              fill="var(--color-accent)"
              radius={[2, 2, 0, 0]}
              name="XP"
              opacity={0.7}
            />

            {/* Achievements Bar */}
            <Bar
              yAxisId="right"
              dataKey="achievements"
              fill="var(--color-success)"
              radius={[2, 2, 0, 0]}
              name="Achievements"
              opacity={0.6}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Achievements */}
      <div className="border-t border-border pt-3 sm:pt-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-lg font-heading font-semibold text-foreground">
            Recent Achievements
          </h3>
          {achievements.length > 4 && (
            <button className="text-xs sm:text-sm text-primary hover:underline">
              View All
            </button>
          )}
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {achievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement?.id}
                ref={(el) => (achievementRefs.current[index] = el)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex flex-col items-center p-2 sm:p-3 bg-muted rounded-md sm:rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 ${
                    achievement?.bgColor || "bg-primary"
                  } group-hover:scale-110 transition-transform`}
                >
                  <Icon
                    name={achievement?.icon || "Trophy"}
                    size={16}
                    className="sm:w-5 sm:h-5"
                    color="white"
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-foreground text-center leading-tight">
                  {achievement?.title || achievement?.name || "Achievement"}
                </span>
                <span className="text-[9px] sm:text-xs text-muted-foreground mt-1">
                  {achievement?.date || "Recently"}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Icon
              name="Trophy"
              size={32}
              className="sm:w-10 sm:h-10 mx-auto mb-3 opacity-30"
            />
            <p className="text-sm text-muted-foreground">No achievements yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Keep working towards your goals!
            </p>
          </div>
        )}
      </div>

      {/* Game Progress Summary */}
      {gameProgress.length > 0 && (
        <div className="border-t border-border pt-3 sm:pt-4 mt-3 sm:mt-4">
          <h3 className="text-sm sm:text-lg font-heading font-semibold text-foreground mb-3">
            Game Performance
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                {gameProgress.reduce((acc, game) => {
                  try {
                    const score =
                      typeof game.best_score === "string"
                        ? JSON.parse(game.best_score)
                        : game.best_score;
                    return acc + (score.score || 0);
                  } catch {
                    return acc;
                  }
                }, 0)}
              </div>
              <div className="text-[10px] sm:text-xs text-blue-600">
                Total Score
              </div>
            </div>

            <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {gameProgress.reduce((acc, game) => {
                  try {
                    const score =
                      typeof game.best_score === "string"
                        ? JSON.parse(game.best_score)
                        : game.best_score;
                    return Math.max(acc, score.maxStreak || 0);
                  } catch {
                    return acc;
                  }
                }, 0)}
              </div>
              <div className="text-[10px] sm:text-xs text-green-600">
                Best Streak
              </div>
            </div>

            <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-600">
                {gameProgress.reduce((acc, game) => {
                  try {
                    const score =
                      typeof game.best_score === "string"
                        ? JSON.parse(game.best_score)
                        : game.best_score;
                    return acc + (score.stepsCompleted || 0);
                  } catch {
                    return acc;
                  }
                }, 0)}
              </div>
              <div className="text-[10px] sm:text-xs text-purple-600">
                Steps Done
              </div>
            </div>

            <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-orange-600">
                {gameProgress.reduce(
                  (acc, game) => acc + (game.times_played || 0),
                  0
                )}
              </div>
              <div className="text-[10px] sm:text-xs text-orange-600">
                Games Played
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeeklyProgress;
