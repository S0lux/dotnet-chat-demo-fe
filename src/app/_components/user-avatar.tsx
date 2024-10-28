import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const UserAvatar = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <img
            src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${name}`}
            className={cn(
              "h-full aspect-square rounded-md select-none",
              className
            )}
            alt={`${name}'s avatar`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
