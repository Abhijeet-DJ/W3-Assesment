import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface User {
  id: string;
  name: string;
  avatar: string;
  points?: number;
}

interface UserSelectProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

export const UserSelect = ({ users, selectedUser, onUserSelect }: UserSelectProps) => {
  return (
    <div className="w-full">
      <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
        Select User
      </label>
      <Select
        value={selectedUser?.id || ""}
        onValueChange={(value) => {
          const user = users.find(u => u.id === value);
          if (user) onUserSelect(user);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a user to claim points for..." />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate flex-1">{user.name}</span>
                <span className="text-muted-foreground text-sm flex-shrink-0">({user.points.toLocaleString()} pts)</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};