import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Trash2 } from 'lucide-react';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import type { AudioTrack as AudioTrackType } from '../types';

interface AudioTrackProps {
  track: AudioTrackType;
  onVolumeChange: (volume: number) => void;
  onDelete: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function AudioTrack({ track, onVolumeChange, onDelete, isPlaying, onPlayPause }: AudioTrackProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const {
    initializeWaveform,
    loadAudio,
    adjustVolume,
    play,
    pause,
    destroy,
  } = useAudioProcessor();

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = initializeWaveform(waveformRef.current);
      
      fetch(track.url)
        .then(response => response.blob())
        .then(blob => new File([blob], 'audio.mp3', { type: 'audio/mpeg' }))
        .then(file => loadAudio(file));

      return () => {
        destroy();
      };
    }
  }, [track.url, initializeWaveform, loadAudio, destroy]);

  useEffect(() => {
    adjustVolume(track.volume);
  }, [track.volume, adjustVolume]);

  useEffect(() => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
  }, [isPlaying, play, pause]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <span className="ml-2 text-sm font-medium">{track.type}</span>
        </div>
        <div className="flex items-center">
          {track.volume === 0 ? (
            <VolumeX className="w-4 h-4 text-gray-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-gray-500" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={track.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="ml-2 w-24"
          />
          <button
            onClick={onDelete}
            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={waveformRef} className="w-full" />
    </div>
  );
}