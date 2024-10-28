import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JoinRoomFormProps {
  onJoin: (roomCode: string, displayName: string) => Promise<void>;
  className?: string;
}

export function JoinRoomForm({ onJoin, className }: JoinRoomFormProps) {
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode || !displayName || isJoining) return;

    setIsJoining(true);
    try {
      await onJoin(roomCode, displayName);
    } catch (error) {
      console.error("Failed to join room:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${className}`}
    >
      <Input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        required
      />
      <Input
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
      <Button type="submit" disabled={!roomCode || !displayName || isJoining}>
        {isJoining ? "Joining..." : "Join Room"}
      </Button>
    </form>
  );
}
