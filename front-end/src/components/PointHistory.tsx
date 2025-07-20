import { Clock, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface HistoryEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  points: number;
  timestamp: Date;
}

interface PointHistoryProps {
  history: HistoryEntry[];
}

export const PointHistory = ({ history }: PointHistoryProps) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Point History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No point claims yet</p>
            <p className="text-sm">Start claiming points to see history here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-scale-in"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                    <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{entry.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-bold">
                  <Plus className="h-4 w-4" />
                  <span>{entry.points.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};