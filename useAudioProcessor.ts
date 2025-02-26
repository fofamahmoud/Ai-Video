import WaveSurfer from 'wavesurfer.js';
import { useRef, useState, useCallback } from 'react';

export function useAudioProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const initializeWaveform = useCallback((container: HTMLElement) => {
    if (!wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container,
        waveColor: '#4f46e5',
        progressColor: '#312e81',
        cursorColor: '#312e81',
        height: 50,
        normalize: true,
      });
    }
    return wavesurferRef.current;
  }, []);

  const loadAudio = useCallback(async (audioFile: File) => {
    if (!wavesurferRef.current) return;
    setIsProcessing(true);
    try {
      const audioUrl = URL.createObjectURL(audioFile);
      await wavesurferRef.current.load(audioUrl);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const adjustVolume = useCallback((volume: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume);
    }
  }, []);

  const play = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.pause();
    }
  }, []);

  const destroy = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
  }, []);

  return {
    isProcessing,
    initializeWaveform,
    loadAudio,
    adjustVolume,
    play,
    pause,
    destroy,
  };
}