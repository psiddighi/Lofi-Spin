
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlayerState, Quote, Station } from '../types';
import { stations } from '../data/stations';
import { quotes } from '../data/quotes';

const QUOTE_INTERVAL = 120000; // 2 minutes

export const initialPlayerState: PlayerState = {
  isPlaying: false,
  volume: 0.7,
  currentStationId: null,
  isMuted: false,
  showQuote: false,
  currentQuote: null,
  currentSkin: 'vaporwave',
  isMenuOpen: false,
};

export const useAudioPlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const quoteIntervalRef = useRef<number | null>(null);
  
  const getCurrentStation = useCallback((): Station | undefined => {
    return playerState.currentStationId 
      ? stations.find(station => station.id === playerState.currentStationId) 
      : undefined;
  }, [playerState.currentStationId]);
  
  const playStation = useCallback((stationId: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const station = stations.find(s => s.id === stationId);
    if (station) {
      audioRef.current.src = station.streamUrl;
      audioRef.current.volume = playerState.volume;
      
      // Try to play and handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayerState(prev => ({
              ...prev, 
              isPlaying: true,
              currentStationId: stationId
            }));
          })
          .catch(error => {
            console.error("Playback was prevented:", error);
            setPlayerState(prev => ({
              ...prev,
              isPlaying: false
            }));
          });
      }
    }
  }, [playerState.volume]);
  
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    } else {
      if (playerState.currentStationId) {
        const station = stations.find(s => s.id === playerState.currentStationId);
        if (station) {
          if (audioRef.current.src !== station.streamUrl) {
            audioRef.current.src = station.streamUrl;
          }
          audioRef.current.play()
            .then(() => {
              setPlayerState(prev => ({ ...prev, isPlaying: true }));
            })
            .catch(error => {
              console.error("Playback was prevented:", error);
            });
        }
      } else if (stations.length > 0) {
        // If no station is selected, play the first one
        playStation(stations[0].id);
      }
    }
  }, [playerState.isPlaying, playerState.currentStationId, playStation]);
  
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setPlayerState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
  }, []);
  
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (!playerState.isMuted) {
        audioRef.current.volume = 0;
        setPlayerState(prev => ({ ...prev, isMuted: true }));
      } else {
        audioRef.current.volume = playerState.volume;
        setPlayerState(prev => ({ ...prev, isMuted: false }));
      }
    }
  }, [playerState.isMuted, playerState.volume]);
  
  const changeSkin = useCallback((skin: PlayerState['currentSkin']) => {
    setPlayerState(prev => ({ ...prev, currentSkin: skin }));
  }, []);

  const toggleMenu = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  }, []);
  
  // Setup quote rotation
  useEffect(() => {
    const showRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setPlayerState(prev => ({
        ...prev,
        showQuote: true,
        currentQuote: quotes[randomIndex]
      }));
      
      // Hide quote after 10 seconds
      setTimeout(() => {
        setPlayerState(prev => ({ ...prev, showQuote: false }));
      }, 10000);
    };
    
    if (playerState.isPlaying && !quoteIntervalRef.current) {
      // Show first quote after 30 seconds
      const initialTimeout = setTimeout(showRandomQuote, 30000);
      
      // Then show quotes periodically
      quoteIntervalRef.current = window.setInterval(showRandomQuote, QUOTE_INTERVAL);
      
      return () => {
        clearTimeout(initialTimeout);
        if (quoteIntervalRef.current) {
          clearInterval(quoteIntervalRef.current);
          quoteIntervalRef.current = null;
        }
      };
    } else if (!playerState.isPlaying && quoteIntervalRef.current) {
      clearInterval(quoteIntervalRef.current);
      quoteIntervalRef.current = null;
    }
  }, [playerState.isPlaying]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
      }
    };
  }, []);
  
  return {
    playerState,
    getCurrentStation,
    playStation,
    togglePlayPause,
    setVolume,
    toggleMute,
    changeSkin,
    toggleMenu,
  };
};
