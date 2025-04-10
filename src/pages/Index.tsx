
import React, { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { stations } from "@/data/stations";
import { VinylPlayer } from "@/components/VinylPlayer";
import { StationPicker } from "@/components/StationPicker";
import { SkinSelector } from "@/components/SkinSelector";
import { QuoteOverlay } from "@/components/QuoteOverlay";
import { MenuBar } from "@/components/MenuBar";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const {
    playerState,
    getCurrentStation,
    playStation,
    togglePlayPause,
    setVolume,
    toggleMute,
    changeSkin,
    toggleMenu,
  } = useAudioPlayer();
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const currentStation = getCurrentStation();

  useEffect(() => {
    // After initial render, set isInitialLoad to false
    setIsInitialLoad(false);
  }, []);

  const handleNextStation = () => {
    const currentIndex = playerState.currentStationId 
      ? stations.findIndex(s => s.id === playerState.currentStationId)
      : -1;
    
    const nextIndex = currentIndex >= stations.length - 1 ? 0 : currentIndex + 1;
    playStation(stations[nextIndex].id);
  };

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col",
        `skin-${playerState.currentSkin}`
      )}
    >
      <div 
        className="fixed inset-0 crt"
        style={currentStation ? {
          backgroundImage: `url(${currentStation.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4) contrast(1.1)',
        } : {
          background: '#0F0F0F',
        }}
      />
      
      <div className="absolute inset-0 scanline pointer-events-none" />
      
      <MenuBar 
        isPlaying={playerState.isPlaying}
        currentStation={currentStation}
        onPlayPause={togglePlayPause}
        onToggleMenu={toggleMenu}
      />
      
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center relative z-10">
        {playerState.isMenuOpen ? (
          <div
            className={cn(
              "w-full max-w-xl bg-black/60 rounded-lg backdrop-blur-md border border-lofi-purple/20 p-5 animate-fade-in overflow-hidden"
            )}
          >
            <h2 className="text-2xl font-retro text-white mb-6">LoFi Spin™</h2>
            
            <Tabs defaultValue="stations" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="stations" className="font-pixel">Stations</TabsTrigger>
                <TabsTrigger value="skins" className="font-pixel">Skins</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stations" className="space-y-4">
                <StationPicker
                  stations={stations}
                  currentStationId={playerState.currentStationId}
                  onStationSelect={playStation}
                />
                
                <div className="mt-4">
                  <AudioVisualizer isPlaying={playerState.isPlaying} />
                </div>
              </TabsContent>
              
              <TabsContent value="skins" className="space-y-4">
                <SkinSelector
                  currentSkin={playerState.currentSkin}
                  onSkinChange={changeSkin}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center mt-8">
              <VinylPlayer
                currentStation={currentStation}
                isPlaying={playerState.isPlaying}
                volume={playerState.volume}
                isMuted={playerState.isMuted}
                onPlayPause={togglePlayPause}
                onNextTrack={handleNextStation}
                onVolumeChange={setVolume}
                onMuteToggle={toggleMute}
                onSettingsClick={toggleMenu}
              />
            </div>
          </div>
        ) : (
          <div className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2",
            isInitialLoad ? "opacity-0" : "animate-fade-in"
          )}>
            <VinylPlayer
              currentStation={currentStation}
              isPlaying={playerState.isPlaying}
              volume={playerState.volume}
              isMuted={playerState.isMuted}
              onPlayPause={togglePlayPause}
              onNextTrack={handleNextStation}
              onVolumeChange={setVolume}
              onMuteToggle={toggleMute}
              onSettingsClick={toggleMenu}
              className="w-[90vw] max-w-xl"
            />
          </div>
        )}
      </main>
      
      {/* Quote overlay */}
      <QuoteOverlay
        quote={playerState.currentQuote}
        show={playerState.showQuote}
      />
      
      {/* Footer credits */}
      <footer className="text-center text-white/30 py-2 text-xs font-pixel relative z-10">
        LoFi Spin™ | Pixel-perfect Vibes
      </footer>
    </div>
  );
};

export default Index;
