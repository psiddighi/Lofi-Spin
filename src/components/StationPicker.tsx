
import React from "react";
import { cn } from "@/lib/utils";
import { Station } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StationPickerProps {
  stations: Station[];
  currentStationId: string | null;
  onStationSelect: (stationId: string) => void;
  className?: string;
}

export const StationPicker: React.FC<StationPickerProps> = ({
  stations,
  currentStationId,
  onStationSelect,
  className,
}) => {
  return (
    <div className={cn("bg-black/70 rounded-lg p-4 backdrop-blur-md", className)}>
      <h3 className="text-white font-pixel text-xl mb-4">Choose Your Vibe</h3>
      <ScrollArea className="h-[220px] pr-4">
        <div className="flex flex-col gap-3">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isActive={station.id === currentStationId}
              onClick={() => onStationSelect(station.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface StationCardProps {
  station: Station;
  isActive: boolean;
  onClick: () => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, isActive, onClick }) => {
  const cardStyle = {
    borderColor: isActive ? station.color : "transparent",
    backgroundColor: isActive ? `${station.color}20` : "rgba(30, 30, 30, 0.6)",
  };

  return (
    <Card
      className={cn(
        "border hover:border-primary/70 transition-all cursor-pointer",
        isActive ? "ring-1 ring-offset-0" : ""
      )}
      style={cardStyle}
      onClick={onClick}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <img
            src={station.backgroundImage}
            alt={station.name}
            className="w-full h-full object-cover pixelated"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-pixel text-white text-sm">{station.name}</h4>
          <p className="text-xs text-gray-400 font-pixel">{station.mood}</p>
        </div>
      </CardContent>
    </Card>
  );
};
