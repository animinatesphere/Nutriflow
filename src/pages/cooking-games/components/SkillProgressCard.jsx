import React from "react";
import { motion } from "framer-motion";
import Icon from "../../../components/AppIcon";

const SkillProgressCard = ({ skillData, userProgress, gamesData }) => {
  const getSkillIcon = (skill) => {
    const iconMap = {
      "Knife Skills": "ChefHat",
      Timing: "Clock",
      Temperature: "Thermometer",
      Memory: "Brain",
      Technique: "Target",
      Plating: "Palette",
    };
    return iconMap?.[skill] || "Utensils";
  };

  const getSkillLevel = (xp) => {
    if (xp >= 1000)
      return { level: "Master", color: "text-purple-600", bg: "bg-purple-100" };
    if (xp >= 750)
      return { level: "Expert", color: "text-blue-600", bg: "bg-blue-100" };
    if (xp >= 500)
      return { level: "Advanced", color: "text-green-600", bg: "bg-green-100" };
    if (xp >= 250)
      return {
        level: "Intermediate",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return { level: "Beginner", color: "text-gray-600", bg: "bg-gray-100" };
  };

  const getProgressToNextLevel = (xp) => {
    const levels = [0, 250, 500, 750, 1000];
    const currentLevelIndex = levels?.findIndex((level) => xp < level);

    if (currentLevelIndex === -1)
      return { progress: 100, nextLevel: 1000, current: xp };

    const currentLevel = levels?.[currentLevelIndex - 1] || 0;
    const nextLevel = levels?.[currentLevelIndex];
    const progress = ((xp - currentLevel) / (nextLevel - currentLevel)) * 100;

    return {
      progress,
      nextLevel,
      current: xp - currentLevel,
      needed: nextLevel - currentLevel,
    };
  };

  // Defensive: If no userProgress or games, show nothing
  if (!userProgress || !userProgress.games) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No skill progress data available.
      </div>
    );
  }

  // Map game_id to skill using gamesData
  const gameSkillMap = {};
  if (Array.isArray(gamesData)) {
    gamesData.forEach(game => {
      gameSkillMap[game.id] = game.skill || game.category || "Unknown";
    });
  }

  // Aggregate XP by skill
  const skillXPMap = {};
  Object.values(userProgress.games).forEach((row) => {
    // Defensive: parse best_score if string
    let scoreObj = row.best_score;
    if (typeof scoreObj === "string") {
      try {
        scoreObj = JSON.parse(scoreObj);
      } catch (e) {
        scoreObj = {};
      }
    }
    // Find skill from gameSkillMap if not present in row
    const skill =
      row.skill ||
      gameSkillMap[row.game_id] ||
      row.game_skill ||
      row.game_category ||
      row.category ||
      "Unknown";
    if (scoreObj && typeof scoreObj.score === "number") {
      if (!skillXPMap[skill]) skillXPMap[skill] = 0;
      skillXPMap[skill] += scoreObj.score;
    }
  });

  // If skillData is provided, use it for display order and names
  const skillsToShow =
    skillData && Array.isArray(skillData)
      ? skillData.map((s) => s.name)
      : Object.keys(skillXPMap);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {skillsToShow.map((skill) => {
        const xp = skillXPMap[skill] || 0;
        const { level, color, bg } = getSkillLevel(xp);
        const progressInfo = getProgressToNextLevel(xp);
        return (
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl p-6 shadow-sm border border-border ${bg}`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Icon
                name={getSkillIcon(skill)}
                size={32}
                color="var(--color-primary)"
              />
              <span className="text-lg font-semibold text-foreground">
                {skill}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-2xl font-bold text-primary">
                {xp}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${color} bg-white border border-border`}
              >
                {level}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full"
                style={{ width: `${Math.min(progressInfo.progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>
                {progressInfo.current} / {progressInfo.needed} to next level
              </span>
              <span>Next: {progressInfo.nextLevel} XP</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SkillProgressCard;
