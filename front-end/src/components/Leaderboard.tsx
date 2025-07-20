import { Trophy, Crown, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "./UserSelect";

interface LeaderboardProps {
  users: User[];
}

export const Leaderboard = ({ users }: LeaderboardProps) => {
  // Sort users by points (descending)
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topThree = sortedUsers.slice(0, 3);
  const others = sortedUsers.slice(3,10);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-trophy-gold" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-b from-gold/20 to-trophy-gold/10 border-2 border-gold/30";
      case 2:
        return "bg-gradient-to-b from-gray-200/50 to-gray-100/30 border border-gray-300/30";
      case 3:
        return "bg-gradient-to-b from-amber-200/50 to-amber-100/30 border border-amber-300/30";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-primary to-accent p-4 sm:p-6 rounded-xl text-white">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">🏆 Leaderboard</h2>
        <p className="text-xs sm:text-sm text-primary-foreground/80">Settlement time 2 days</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        {topThree.map((user, index) => {
          const rank = index + 1;
          return (
            <Card key={user.id} className={`${getPositionStyle(rank)} hover-scale transition-all duration-200`}>
              <CardContent className="p-2 sm:p-4 text-center">
                <div className="relative mb-2 sm:mb-3">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto border-2 border-white shadow-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-white rounded-full p-0.5 sm:p-1">
                    {getRankIcon(rank)}
                  </div>
                  <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold text-primary border-2 border-primary">
                    {rank}
                  </div>
                </div>
                <h3 className="font-semibold text-xs sm:text-sm truncate">{user.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Trophy className="h-3 w-3 text-trophy-gold" />
                  <span className="text-xs sm:text-sm font-bold text-primary">{user.points.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Other Rankings */}
      <div className="space-y-2">
        {others.map((user, index) => {
          const rank = index + 4;
          return (
            <Card key={user.id} className="bg-ranking-bg hover:bg-secondary/50 transition-all duration-200 hover-scale">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                      {rank}
                    </div>
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm truncate">{user.name}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="font-bold text-primary text-xs sm:text-sm">{user.points.toLocaleString()}</span>
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-trophy-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
