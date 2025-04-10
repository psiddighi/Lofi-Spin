
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music, ChevronDown } from "lucide-react";
import { Station } from "@/types";

interface MenuBarProps {
  isPlaying: boolean;
  currentStation?: Station;
  onPlayPause: () => void;
  onToggleMenu: () => void;
  className?: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  isPlaying,
  currentStation,
  onPlayPause,
  onToggleMenu,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 py-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
          className="h-8 w-8 text-white hover:bg-white/10"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-white font-pixel">
            {isPlaying ? "Now Playing" : "Paused"}
          </span>
        </div>
      </div>

      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={onToggleMenu}
      >
        <Music size={16} className="text-white" />
        <span className="text-xs text-white font-pixel truncate max-w-[120px]">
          {currentStation?.name || "LoFi Spin™"}
        </span>
        <ChevronDown size={14} className="text-white" />
      </div>

      <div className="text-xs text-white/50 hidden md:block font-pixel">
        LoFi Spin™
      </div>
    </div>
  );
};
