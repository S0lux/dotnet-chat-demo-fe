"use client";

import { useEffect, useRef, useState } from "react";
import { TeamSribeLogo } from "./_components/teamscribe-logo";
import { JoinRoomForm } from "./_components/join-room-form";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Message, MessageProps } from "./_components/message";
import { UserAvatar } from "./_components/user-avatar";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

interface ServerMessage {
  senderName: string;
  content: string;
  timestamp: string;
}

export default function Home() {
  const [room, setRoom] = useState("");
  const [connection, setConnection] = useState<HubConnection>();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  // Setup connection and event handlers
  const setupConnection = async (roomCode: string, displayName: string) => {
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chatHub`)
        .withAutomaticReconnect()
        .build();

      // Set up all event handlers before starting the connection
      newConnection.on(
        "ReceiveMessage",
        (data: { sender: string; message: string; timestamp: string }) => {
          setMessages((prev) => [
            ...prev,
            {
              type: "user",
              name: data.sender,
              content: data.message,
              timestamp: new Date(data.timestamp),
            },
          ]);
        }
      );

      newConnection.on("UserJoined", (displayName: string) => {
        setUsers((prev) => [...prev, displayName]);
        setMessages((prev) => [
          ...prev,
          { type: "system", name: displayName, action: "joined" },
        ]);
      });

      newConnection.on("UserLeft", (displayName: string) => {
        setUsers((prev) => prev.filter((user) => user !== displayName));
        setMessages((prev) => [
          ...prev,
          { type: "system", name: displayName, action: "left" },
        ]);
      });

      newConnection.on("UserList", (userList: string[]) => {
        setUsers(userList);
      });

      newConnection.on("MessageHistory", (history: ServerMessage[]) => {
        const historyMessages: MessageProps[] = history.map((msg) => ({
          type: "user",
          name: msg.senderName,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(historyMessages);
      });

      // Start the connection
      await newConnection.start();

      // Join the room
      await newConnection.invoke("JoinRoom", roomCode, displayName);

      // Set connection in state
      setConnection(newConnection);
      setRoom(roomCode);
    } catch (error) {
      console.error("Failed to connect:", error);
      throw error;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop === clientHeight;
      setShouldAutoScroll(isScrolledToBottom);
    }
  };

  const handleJoinRoom = async (roomCode: string, displayName: string) => {
    try {
      await setupConnection(roomCode, displayName);
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  if (!connection) {
    return (
      <div className="flex gap-8 flex-col w-full h-full items-center justify-center">
        <TeamSribeLogo />
        <JoinRoomForm onJoin={handleJoinRoom} className="max-w-64" />
      </div>
    );
  }

  async function handleSubmit() {
    if (input && connection) {
      try {
        await connection.invoke("SendMessage", input);
        setInput("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  }

  return (
    <div className="flex gap-5 pb-10 flex-col w-full h-full items-center justify-center">
      <TeamSribeLogo className="mt-5" />
      <div className="flex flex-col w-[85%] lg:w-[50%] gap-2 font-bold border border-black/40 rounded-md px-4 py-2 items-center justify-center">
        Users in this room ({users.length}) (Room ID: {room})
        <div className="flex flex-wrap gap-1 w-full">
          {users.map((user, i) => (
            <UserAvatar key={i} name={user} className="h-8" />
          ))}
        </div>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex flex-col p-4 gap-4 border border-black/40 rounded-md flex-1 w-[85%] lg:w-[50%] overflow-scroll"
      >
        {messages.map((message, i) => (
          <Message className="break-all mb-5" key={i} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-[85%] lg:w-[50%] flex gap-2">
        <Input
          placeholder="Type your message..."
          className="border-black/40"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />

        <button
          disabled={!input}
          className="flex items-center justify-center bg-blue-500 min-w-8 min-h-8 aspect-square rounded-md disabled:opacity-50"
          onClick={handleSubmit}
        >
          <Send size={20} color={"white"} />
        </button>
      </div>
    </div>
  );
}
