import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export type MessageProps = {
  type: "user" | "system";
  className?: string;
  // user
  name?: string;
  content?: string;
  // system
  action?: "left" | "joined";
  instanceId?: string;
};

export const Message = ({
  type,
  className,
  name,
  content,
  action,
  instanceId,
}: MessageProps) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = `${now.getDate()}/${
      now.getMonth() + 1
    }/${now.getFullYear()} ${now.getHours()}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setCurrentTime(formattedDate);
  }, []);

  if (type === "user") {
    return (
      <div className={cn("flex gap-2 w-full", className)}>
        <img
          src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${name}`}
          className="h-12 aspect-square rounded-md select-none"
          alt={`${name}'s avatar`}
        />
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <p className="font-bold">{name}</p>
            <p className="text-xs opacity-50">{currentTime}</p>
          </div>
          <p className="text-sm text-wrap">{content}</p>
        </div>
      </div>
    );
  }

  if (type === "system") {
    return (
      <div className="flex items-center justify-center w-full opacity-50 text-center font-mono text-sm">
        {action === "joined" ? (
          <p>{name} joined the room</p>
        ) : (
          <p>{name} left the room</p>
        )}
      </div>
    );
  }

  return null;
};
