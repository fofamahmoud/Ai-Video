export interface Project {
  id: string;
  title: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  input: {
    type: 'text' | 'audio';
    content: string;
  };
  output?: {
    videoUrl: string;
    thumbnailUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  editingData?: EditingData;
}

export interface VideoPreview {
  url: string;
  thumbnail: string;
}

export interface EditingData {
  timeline: TimelineTrack[];
  effects: Effect[];
  transitions: Transition[];
  audioTracks: AudioTrack[];
  textOverlays: TextOverlay[];
  aiEnhancements: AIEnhancement[];
}

export interface TimelineTrack {
  id: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  startTime: number;
  endTime: number;
  content: any;
}

export interface Effect {
  id: string;
  type: 'filter' | 'visual' | 'transition' | 'animation';
  name: string;
  parameters: Record<string, any>;
}

export interface Transition {
  id: string;
  type: string;
  duration: number;
  parameters: Record<string, any>;
}

export interface AudioTrack {
  id: string;
  type: 'voice' | 'music' | 'effect';
  url: string;
  volume: number;
  startTime: number;
  endTime: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  font: string;
  size: number;
  color: string;
  position: { x: number; y: number };
  animation?: TextAnimation;
}

export interface TextAnimation {
  type: string;
  duration: number;
  parameters: Record<string, any>;
}

export interface AIEnhancement {
  type: 'background-removal' | 'quality-enhancement' | 'translation' | 'subtitle-generation';
  parameters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}