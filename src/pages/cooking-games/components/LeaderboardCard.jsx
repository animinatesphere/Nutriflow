import React from 'react';
import Icon from '../../../components/AppIcon';


const LeaderboardCard = ({ leaderboard, currentUser }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return { icon: 'Crown', color: 'var(--color-warning)' };
      case 2:
        return { icon: 'Medal', color: 'var(--color-muted-foreground)' };
      case 3:
        return { icon: 'Award', color: 'var(--color-accent)' };
      default:
        return { icon: 'User', color: 'var(--color-muted-foreground)' };
    }
  };

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
        2: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
        3: 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
      };
      return colors?.[rank];
    }
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-card-foreground">
          Weekly Leaderboard
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Trophy" size={16} color="currentColor" />
          <span>Top Chefs</span>
        </div>
      </div>
      <div className="space-y-3">
        {leaderboard?.map((player, index) => {
          const rank = index + 1;
          const rankInfo = getRankIcon(rank);
          const isCurrentUser = player?.id === currentUser?.id;

          return (
            <div
              key={player?.id}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                isCurrentUser
                  ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
              }`}
            >
              {/* Rank Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadge(rank)}`}>
                {rank <= 3 ? (
                  <Icon name={rankInfo?.icon} size={16} color="currentColor" />
                ) : (
                  rank
                )}
              </div>
              {/* Player Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-heading font-semibold text-primary-foreground">
                    {player?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                {player?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success border-2 border-card rounded-full" />
                )}
              </div>
              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className={`font-body font-medium truncate ${
                    isCurrentUser ? 'text-primary' : 'text-card-foreground'
                  }`}>
                    {player?.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-primary">(You)</span>
                    )}
                  </p>
                  {player?.isPremium && (
                    <Icon name="Crown" size={14} color="var(--color-accent)" />
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Level {player?.level}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {player?.gamesPlayed} games
                  </span>
                </div>
              </div>
              {/* Score */}
              <div className="text-right">
                <p className="font-mono font-bold text-card-foreground">
                  {player?.weeklyScore?.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="TrendingUp" size={12} color="var(--color-success)" />
                  <span className="text-xs text-success">+{player?.weeklyGain}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Current User Position (if not in top 10) */}
      {!leaderboard?.some(player => player?.id === currentUser?.id) && (
        <>
          <div className="border-t border-border my-4" />
          <div className="flex items-center space-x-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
              {currentUser?.rank}
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-heading font-semibold text-primary-foreground">
                {currentUser?.name?.split(' ')?.map(n => n?.[0])?.join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-body font-medium text-primary">
                {currentUser?.name} (You)
              </p>
              <span className="text-xs text-muted-foreground">
                Level {currentUser?.level}
              </span>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-card-foreground">
                {currentUser?.weeklyScore?.toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}
      {/* Leaderboard Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Resets every Monday</span>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} color="currentColor" />
            <span>3 days left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;