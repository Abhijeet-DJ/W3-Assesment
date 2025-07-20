import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";
import { User } from "./UserSelect";

interface ClaimButtonProps {
  selectedUser: User | null;
  onClaim: (userId: string, points: number) => void;
  disabled?: boolean;
}

export const ClaimButton = ({ selectedUser, onClaim, disabled }: ClaimButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random points between 100-1000
    const randomPoints = Math.floor(Math.random() * 900) + 100;
    
    onClaim(selectedUser.id, randomPoints);
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleClaim}
      disabled={!selectedUser || disabled || isLoading}
      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 animate-fade-in"
      size="lg"
    >
      {isLoading ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Claiming...
        </>
      ) : (
        <>
          <Trophy className="mr-2 h-4 w-4" />
          Claim Points
        </>
      )}
    </Button>
  );
};