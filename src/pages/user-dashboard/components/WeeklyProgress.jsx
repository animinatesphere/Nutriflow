import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';
import Icon from '../../../components/AppIcon';

const WeeklyProgress = ({ weeklyData, achievements }) => {
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
          delay: 0.5
        }
      );
    }
  }, [achievements]);

  const chartData = weeklyData?.map((day, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']?.[index],
    calories: day?.calories,
    goal: day?.goal,
    completion: (day?.calories / day?.goal) * 100
  }));

  const averageCompletion = weeklyData?.reduce((acc, day) => acc + (day?.calories / day?.goal), 0) / 7 * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-xl border border-border p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Weekly Progress</h2>
        <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
          <Icon name="TrendingUp" size={16} color="var(--color-success)" />
          <span className="text-sm font-mono font-medium text-success">
            {averageCompletion?.toFixed(1)}% avg
          </span>
        </div>
      </div>
      {/* Chart */}
      <div className="h-64 mb-6" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: 'var(--color-popover-foreground)' }}
            />
            <Bar 
              dataKey="calories" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              name="Calories"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Achievements */}
      <div className="border-t border-border pt-4">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements?.map((achievement, index) => (
            <div
              key={achievement?.id}
              ref={el => achievementRefs.current[index] = el}
              className="flex flex-col items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${achievement?.bgColor}`}>
                <Icon name={achievement?.icon} size={20} color="white" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {achievement?.title}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {achievement?.date}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Weekly Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-success">
            {weeklyData?.filter(day => (day?.calories / day?.goal) >= 1)?.length}
          </div>
          <div className="text-xs text-muted-foreground">Goals Met</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-primary">
            {weeklyData?.reduce((acc, day) => acc + day?.calories, 0)?.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Calories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-accent">
            {achievements?.length}
          </div>
          <div className="text-xs text-muted-foreground">Achievements</div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyProgress;