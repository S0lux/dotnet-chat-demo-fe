import { cn } from "@/lib/utils";

export const TeamSribeLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex gap-2 p-2 rounded-md w-fit", className)}>
      <span className="font-mono text-3xl font-bold">Teamscribe</span>
      <span className="bg-blue-500 text-white font-mono text-3xl font-bold p-1 rounded-md leading-none -top-1 -right-8">
        CHAT
      </span>
    </div>
  );
};
