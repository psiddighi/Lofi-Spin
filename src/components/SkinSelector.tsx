
import React from "react";
import { cn } from "@/lib/utils";
import { Skin } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SkinSelectorProps {
  currentSkin: Skin;
  onSkinChange: (skin: Skin) => void;
  className?: string;
}

export const SkinSelector: React.FC<SkinSelectorProps> = ({
  currentSkin,
  onSkinChange,
  className,
}) => {
  const skins: { id: Skin; name: string; description: string; color: string }[] = [
    {
      id: "vaporwave",
      name: "Vaporwave",
      description: "Retro aesthetics with pink and blue tones",
      color: "#ff71ce",
    },
    {
      id: "8bit",
      name: "8-Bit",
      description: "Classic pixel art style with primary colors",
      color: "#ff004d",
    },
    {
      id: "noir",
      name: "Noir",
      description: "Monochromatic style with high contrast",
      color: "#ffffff",
    },
    {
      id: "synthwave",
      name: "Synthwave",
      description: "80's inspired with neon colors and grids",
      color: "#ff1493",
    },
  ];

  return (
    <div className={cn("bg-black/70 rounded-lg p-4 backdrop-blur-md", className)}>
      <h3 className="text-white font-pixel text-xl mb-4">Choose Your Skin</h3>
      <ScrollArea className="h-[220px]">
        <div className="flex flex-col gap-3 pr-4">
          {skins.map((skin) => (
            <SkinCard
              key={skin.id}
              skin={skin}
              isActive={skin.id === currentSkin}
              onClick={() => onSkinChange(skin.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface SkinCardProps {
  skin: { id: Skin; name: string; description: string; color: string };
  isActive: boolean;
  onClick: () => void;
}

const SkinCard: React.FC<SkinCardProps> = ({ skin, isActive, onClick }) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "relative border hover:border-primary/70 transition-all cursor-pointer h-auto justify-start flex-col items-start rounded-lg p-3 gap-2 bg-black/30",
        isActive ? "ring-1 ring-offset-0 ring-primary" : ""
      )}
      onClick={onClick}
    >
      <div className="flex justify-between w-full items-center">
        <h4 className="font-pixel text-white text-sm">{skin.name}</h4>
        {isActive && <Badge className="bg-primary">Active</Badge>}
      </div>
      
      <p className="text-xs text-left text-gray-400 font-pixel">
        {skin.description}
      </p>
      <div 
        className="w-full h-2 rounded mt-1"
        style={{ 
          background: `linear-gradient(to right, ${skin.color}, transparent)`
        }}
      />
    </Button>
  );
};
