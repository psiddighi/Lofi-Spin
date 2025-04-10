
export interface Station {
  id: string;
  name: string;
  mood: string;
  description: string;
  streamUrl: string;
  backgroundImage: string;
  color: string;
  tags: string[];
}

export interface Quote {
  text: string;
  author: string;
}

export type Skin = 'vaporwave' | '8bit' | 'noir' | 'synthwave';

export interface PlayerState {
  isPlaying: boolean;
  volume: number;
  currentStationId: string | null;
  isMuted: boolean;
  showQuote: boolean;
  currentQuote: Quote | null;
  currentSkin: Skin;
  isMenuOpen: boolean;
}
