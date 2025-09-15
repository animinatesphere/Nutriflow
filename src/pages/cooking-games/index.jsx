import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import GameCard from './components/GameCard';
import GameInterface from './components/GameInterface';
import AchievementBadge from './components/AchievementBadge';
import LeaderboardCard from './components/LeaderboardCard';
import SkillProgressCard from './components/SkillProgressCard';
import { supabase } from '../../utils/supabaseClient';

const CookingGames = () => {
  const [activeView, setActiveView] = useState('games'); // games, playing, achievements, leaderboard, progress
  const [selectedGame, setSelectedGame] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');


  // State for games and loading
  const [gamesData, setGamesData] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState(null);

  // User progress state
  const [userProgress, setUserProgress] = useState(null);
  const [userProgressLoading, setUserProgressLoading] = useState(true);
  const [userProgressError, setUserProgressError] = useState(null);

  // Fetch user progress from Supabase
  useEffect(() => {
    const fetchUserProgress = async () => {
      setUserProgressLoading(true);
      setUserProgressError(null);
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setUserProgressError('User not logged in');
        setUserProgress(null);
        setUserProgressLoading(false);
        return;
      }
      // Fetch all progress for this user
      const { data, error } = await supabase
        .from('user_game_progress')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        setUserProgressError(error.message);
        setUserProgress(null);
      } else {
        // Transform to a map: { [game_id]: { ...progress } }
        const progressMap = {};
        (data || []).forEach(row => {
          progressMap[row.game_id] = row;
        });
        setUserProgress({ userId: user.id, games: progressMap });
      }
      setUserProgressLoading(false);
    };
    fetchUserProgress();
  }, []);


  // Fetch games from Supabase
  useEffect(() => {
    const fetchGames = async () => {
      setGamesLoading(true);
      setGamesError(null);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setGamesError(error.message);
        setGamesData([]);
      } else {
        setGamesData(data || []);
      }
      setGamesLoading(false);
    };
    fetchGames();
  }, []);

  // Mock achievements data
  const achievementsData = [
    {
      id: 'first-game',
      title: 'First Steps',
      description: 'Complete your first cooking game',
      category: 'completion',
      tier: 'bronze',
      points: 50,
      isNew: false,
      unlockedDate: '2024-08-15'
    },
    {
      id: 'knife-novice',
      title: 'Knife Novice',
      description: 'Score 80% or higher in 3 knife skill games',
      category: 'knife-skills',
      tier: 'silver',
      points: 100,
      isNew: true,
      unlockedDate: '2024-09-10'
    },
    {
      id: 'timing-expert',
      title: 'Timing Expert',
      description: 'Complete 5 timing challenges with perfect scores',
      category: 'timing',
      tier: 'gold',
      points: 200,
      isNew: false,
      unlockedDate: '2024-09-05'
    },
    {
      id: 'memory-master',
      title: 'Memory Master',
      description: 'Remember 20 complex recipes without mistakes',
      category: 'memory',
      tier: 'platinum',
      points: 500,
      isNew: false,
      unlockedDate: '2024-08-28'
    },
    {
      id: 'perfect-streak',
      title: 'Perfect Streak',
      description: 'Achieve 10 consecutive perfect scores',
      category: 'streak',
      tier: 'gold',
      points: 300,
      isNew: false
    },
    {
      id: 'temperature-pro',
      title: 'Temperature Pro',
      description: 'Master all temperature control challenges',
      category: 'temperature',
      tier: 'silver',
      points: 150,
      isNew: false
    }
  ];

  // Mock leaderboard data
  const leaderboardData = [
    {
      id: 'user1',
      name: 'Chef Marcus',
      weeklyScore: 2850,
      weeklyGain: 320,
      level: 18,
      gamesPlayed: 45,
      isPremium: true,
      isOnline: true
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      weeklyScore: 2450,
      weeklyGain: 180,
      level: 12,
      gamesPlayed: 32,
      isPremium: true,
      isOnline: true
    },
    {
      id: 'user3',
      name: 'Alex Chen',
      weeklyScore: 2280,
      weeklyGain: 250,
      level: 15,
      gamesPlayed: 38,
      isPremium: false,
      isOnline: false
    },
    {
      id: 'user4',
      name: 'Maria Rodriguez',
      weeklyScore: 2150,
      weeklyGain: 190,
      level: 14,
      gamesPlayed: 29,
      isPremium: true,
      isOnline: true
    },
    {
      id: 'user5',
      name: 'David Kim',
      weeklyScore: 1980,
      weeklyGain: 140,
      level: 11,
      gamesPlayed: 26,
      isPremium: false,
      isOnline: false
    }
  ];

  const currentUser = {
    id: 'user2',
    name: 'Sarah Johnson',
    weeklyScore: 2450,
    level: 12,
    rank: 2
  };

  // Mock skill categories
  const skillCategories = [
    { name: 'Knife Skills', description: 'Precision cutting and knife safety' },
    { name: 'Timing', description: 'Multitasking and coordination' },
    { name: 'Temperature', description: 'Heat control and cooking methods' },
    { name: 'Memory', description: 'Recipe recall and ingredient knowledge' },
    { name: 'Technique', description: 'Advanced cooking methods' },
    { name: 'Plating', description: 'Presentation and garnishing' }
  ];

  // Filter options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'knife-skills', label: 'Knife Skills' },
    { value: 'timing', label: 'Timing' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'memory', label: 'Memory' },
    { value: 'technique', label: 'Technique' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];


  // Filter games based on selected criteria
  const filteredGames = gamesData?.filter(game => {
    const matchesCategory = filterCategory === 'all' || game?.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || game?.difficulty === filterDifficulty;
    const matchesSearch = searchQuery === '' || 
      game?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      game?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // Loading state
  if (gamesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-muted-foreground text-lg">Loading games...</span>
      </div>
    );
  }

  // Error state
  if (gamesError) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-error text-lg">Error: {gamesError}</span>
      </div>
    );
  }

  const handlePlayGame = (game) => {
    setSelectedGame(game);
    setActiveView('playing');
  };

  const handleGameComplete = async (score) => {
    // Save game result to Supabase
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedGame) {
        setActiveView('games');
        setSelectedGame(null);
        return;
      }
      // Upsert user_game_progress
      await supabase.from('user_game_progress').upsert({
        user_id: user.id,
        game_id: selectedGame.id,
        best_score: score, // You may want to only update if score > previous best
        times_played: (userProgress?.games?.[selectedGame.id]?.times_played || 0) + 1,
        last_played_at: new Date().toISOString(),
      }, { onConflict: ['user_id', 'game_id'] });

      // Optionally, insert into game_plays for history
      await supabase.from('game_plays').insert({
        user_id: user.id,
        game_id: selectedGame.id,
        score,
        played_at: new Date().toISOString(),
      });

      // Refetch user progress
      if (typeof fetchUserProgress === 'function') {
        await fetchUserProgress();
      }
    } catch (err) {
      // Optionally handle error
      console.error('Error saving game result:', err);
    }
    setActiveView('games');
    setSelectedGame(null);
  };

  const handleExitGame = () => {
    setActiveView('games');
    setSelectedGame(null);
  };

  const getUnlockedAchievements = () => {
    return achievementsData?.filter(achievement => achievement?.unlockedDate);
  };

  const getAchievementProgress = (achievement) => {
    // Mock progress calculation
    const progressMap = {
      'perfect-streak': 70,
      'temperature-pro': 85
    };
    return progressMap?.[achievement?.id] || 0;
  };

  const renderGameView = () => (
    <div className="space-y-8">
      {/* Games Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Cooking Games
          </h1>
          <p className="text-muted-foreground">
            Master culinary skills through interactive challenges and earn achievements
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} color="var(--color-primary)" />
              <span className="text-sm font-caption text-muted-foreground">Total XP:</span>
              <span className="font-mono font-bold text-primary">
                {userProgress?.totalXP?.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Icon name="Trophy" size={16} color="var(--color-success)" />
              <span className="text-sm font-caption text-muted-foreground">Level:</span>
              <span className="font-mono font-bold text-success">
                {userProgress?.overallLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={filterCategory}
            onChange={setFilterCategory}
          />
          <Select
            label="Difficulty"
            options={difficultyOptions}
            value={filterDifficulty}
            onChange={setFilterDifficulty}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Games
            </label>
            <div className="relative">
              <Icon
                name="Search"
                size={16}
                color="var(--color-muted-foreground)"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredGames?.map((game, index) => (
              <motion.div
                key={game?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GameCard
                  game={game}
                  onPlayGame={handlePlayGame}
                  userProgress={userProgress}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
            No games found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );

  const renderPlayingView = () => (
    <div className="max-w-4xl mx-auto">
      <GameInterface
        game={selectedGame}
        onGameComplete={handleGameComplete}
        onExitGame={handleExitGame}
      />
    </div>
  );

  const renderAchievementsView = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Achievements
        </h1>
        <p className="text-muted-foreground">
          Track your culinary accomplishments and unlock new challenges
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {achievementsData?.map((achievement) => (
          <AchievementBadge
            key={achievement?.id}
            achievement={achievement}
            isUnlocked={!!achievement?.unlockedDate}
            progress={getAchievementProgress(achievement)}
          />
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Achievement Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-primary">
              {getUnlockedAchievements()?.length}
            </p>
            <p className="text-sm text-muted-foreground">Unlocked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-muted-foreground">
              {achievementsData?.length - getUnlockedAchievements()?.length}
            </p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-success">
              {getUnlockedAchievements()?.reduce((sum, a) => sum + a?.points, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Points Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-warning">
              {Math.round((getUnlockedAchievements()?.length / achievementsData?.length) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">Completion</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaderboardView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Compete with other chefs and climb the rankings
        </p>
      </div>

      <LeaderboardCard
        leaderboard={leaderboardData}
        currentUser={currentUser}
      />
    </div>
  );

  const renderProgressView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Skill Progress
        </h1>
        <p className="text-muted-foreground">
          Track your development across different cooking skills
        </p>
      </div>

      <SkillProgressCard
        skillData={skillCategories}
        userProgress={userProgress}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'games', label: 'Games', icon: 'Gamepad2' },
                { id: 'achievements', label: 'Achievements', icon: 'Award' },
                { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy' },
                { id: 'progress', label: 'Progress', icon: 'TrendingUp' }
              ]?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeView === tab?.id ? 'default' : 'ghost'}
                  onClick={() => setActiveView(tab?.id)}
                  iconName={tab?.icon}
                  iconPosition="left"
                  iconSize={16}
                >
                  {tab?.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeView === 'games' && renderGameView()}
              {activeView === 'playing' && renderPlayingView()}
              {activeView === 'achievements' && renderAchievementsView()}
              {activeView === 'leaderboard' && renderLeaderboardView()}
              {activeView === 'progress' && renderProgressView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CookingGames;