
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, SkipForward, Volume2, VolumeX, Settings } from "lucide-react";
import { Station } from "@/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface VinylPlayerProps {
  currentStation?: Station;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  onSettingsClick: () => void;
  className?: string;
}

export const VinylPlayer: React.FC<VinylPlayerProps> = ({
  currentStation,
  isPlaying,
  volume,
  isMuted,
  onPlayPause,
  onNextTrack,
  onVolumeChange,
  onMuteToggle,
  onSettingsClick,
  className,
}) => {
  const vinylRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const stationName = currentStation?.name || "Select a station";
  const stationMood = currentStation?.mood || "";

  useEffect(() => {
    if (vinylRef.current) {
      if (isPlaying) {
        vinylRef.current.classList.add("animate-vinyl-spin");
      } else {
        vinylRef.current.classList.remove("animate-vinyl-spin");
      }
    }
  }, [isPlaying]);

  const handleStationInfo = () => {
    if (currentStation) {
      toast({
        title: currentStation.name,
        description: currentStation.description,
        duration: 3000,
      });
    }
  };

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden backdrop-blur-md bg-black/70 border border-lofi-purple/30 p-5",
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Vinyl Record */}
        <div 
          className="relative vinyl-record group cursor-pointer"
          onClick={onPlayPause}
        >
          <div 
            ref={vinylRef}
            className="vinyl-record w-48 h-48 bg-black flex items-center justify-center"
          >
            {currentStation?.backgroundImage && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <img 
                  src={currentStation.backgroundImage} 
                  alt={currentStation.name}
                  className="w-full h-full object-cover opacity-60 pixelated"
                />
              </div>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center">
              {!isPlaying && (
                <Play className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <h2 
              className="text-xl font-pixel text-white mb-1 cursor-pointer" 
              onClick={handleStationInfo}
            >
              {stationName}
            </h2>
            <p className="text-sm text-gray-300 font-pixel">{stationMood}</p>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onPlayPause}
              className="text-white hover:text-primary hover:bg-white/10"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNextTrack}
              className="text-white hover:text-primary hover:bg-white/10"
            >
              <SkipForward size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMuteToggle}
              className="text-white hover:text-primary hover:bg-white/10"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
            
            <div className="flex-1 mx-2">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={(values) => onVolumeChange(values[0] / 100)}
                className="w-full"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSettingsClick}
              className="text-white hover:text-primary hover:bg-white/10"
            >
              <Settings size={20} />
            </Button>
          </div>

          <div className="mt-2">
            <div className="h-1.5 bg-black/40 w-full rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-lofi-purple to-lofi-blue w-1/3 animate-pulse-slow"></div>
            </div>
          </div>

          {currentStation?.tags && (
            <div className="flex gap-2 mt-1 flex-wrap">
              {currentStation.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded font-pixel"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
