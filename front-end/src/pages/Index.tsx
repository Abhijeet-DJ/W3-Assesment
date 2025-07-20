import { useState } from "react";
import { UserSelect, User } from "@/components/UserSelect";
import { ClaimButton } from "@/components/ClaimButton";
import { Leaderboard } from "@/components/Leaderboard";
import { PointHistory, HistoryEntry } from "@/components/PointHistory";
import { AddUser } from "@/components/AddUser";
import { PaginatedUserList } from "@/components/PaginatedUserList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); // backend URL


// Mock data for demonstration
const initialUsers: User[] = [
  { id: "1", name: "RimJHiri♥Rg", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 1134590 },
  { id: "2", name: "PRITESH", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 1614546 },
  { id: "3", name: "KRISHU RAJP", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 942034 },
  { id: "4", name: "THAKUR RAN VIJAY SINGH", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 558378 },
  { id: "5", name: "MUKKU", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 503042 },
  { id: "6", name: "OVHD", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 352250 },
  { id: "7", name: "ashiii", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 346392 },
  { id: "8", name: "MR RAJPUT", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 343892 },
  { id: "9", name: "IshL", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 321932 },
  { id: "10", name: "Devil", avatar: "/lovable-uploads/645b0190-1507-49da-81c8-7fb1b6460a46.png", points: 0 },
];

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  // const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { toast } = useToast();

  const handleAddUser = (userData: Omit<User, "id">) => {
  const newUser: User = {
    id: (Date.now() + Math.floor(Math.random()*100)).toString(), // Generate unique id
    ...userData,
    points: userData.points ?? 0, // Ensure points is always set
  };

  console.log(typeof newUser.id, " : " , newUser.id);
  
  socket.emit("addUser", newUser); // Send full user object including id

  setUsers(prevUsers => [...prevUsers, newUser]);

  toast({
    title: "User Added! ✅",
    description: `${newUser.name} has been added to the system.`,
  });
};


  const handleClaimPoints = (userId: string, points: number) => {
    // Update user points
    socket.emit("claimPoints", { userId, points });
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, points: user.points + points }
          : user
      )
    );

    // Add to history
    const user = users.find(u => u.id === userId);
    if (user) {
      const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        points,
        timestamp: new Date(),
      };
      setHistory(prev => [historyEntry, ...prev]);

      // Show success toast
      toast({
        title: "Points Claimed! 🎉",
        description: `${user.name} gained ${points.toLocaleString()} points!`,
      });
    }

    // Clear selection after claim
    setSelectedUser(null);
  };

useEffect(() => {
  socket.emit("getUser");

  //  socket.on("userList", (fetchedUsers: User[]) => {
  //     // const allU = [...fetchedUsers]
  //     // setAllUsers(allU)
  //     const topUsers = [...fetchedUsers]
  //       .sort((a, b) => b.points - a.points)
  //       .slice(0, 10);
  //     setUsers(topUsers);
  //   });

  socket.on("userList", (fetchedUsers: User[]) => {
  const sorted = [...fetchedUsers].sort((a, b) => b.points - a.points); // Optional: keep sorting
  setUsers(sorted); // ✅ Set all users
});


    console.log(users);

  const handlePointsUpdate = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    toast({
      title: `${updatedUser.name}'s points updated! 🔄`,
      description: `${updatedUser.points.toLocaleString()} points`,
    });
  };

  socket.on("pointsUpdated", handlePointsUpdate);

  return () => {
    socket.off("pointsUpdated", handlePointsUpdate);
  };
}, []);

useEffect(() => {
  console.log("Updated top 10 users:", users); // Will run after setUsers
}, [users]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            🏆 Point Leaderboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Claim points and climb the rankings!</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Claim Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <UserSelect 
                users={users}
                selectedUser={selectedUser}
                onUserSelect={setSelectedUser}
              />
              <ClaimButton 
                selectedUser={selectedUser}
                onClaim={handleClaimPoints}
              />
            </CardContent>
          </Card>

          <div className="animate-fade-in">
            <AddUser onAddUser={handleAddUser} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Leaderboard */}
          <div className="xl:col-span-1">
            <Leaderboard users={users} />
          </div>
          
          {/* Users List with Pagination */}
          <div className="xl:col-span-1">
            <PaginatedUserList users={users} />
          </div>
          
          {/* History */}
          <div className="xl:col-span-1">
            <PointHistory history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
