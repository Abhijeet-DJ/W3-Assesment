import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "./UserSelect";
import { Plus } from "lucide-react";

interface AddUserProps {
  onAddUser: (user: Omit<User, "id">) => void;
}

export const AddUser = ({ onAddUser }: AddUserProps) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddUser({
        name: name.trim(),
        avatar: avatar || "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png",
        points: 0,
      });
      setName("");
      setAvatar("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Add New User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name"
              required
            />
          </div>
          <div>
            <Label htmlFor="avatar">Avatar URL (optional)</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Enter avatar URL"
            />
          </div>
          <Button type="submit" className="w-full">
            Add User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};