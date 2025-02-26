import { useState, useCallback } from 'react';
import type { TextOverlay } from '../types';

export function useTextOverlay() {
  const [overlays, setOverlays] = useState<TextOverlay[]>([]);

  const addOverlay = useCallback((overlay: Omit<TextOverlay, 'id'>) => {
    const newOverlay: TextOverlay = {
      ...overlay,
      id: Math.random().toString(36).substr(2, 9),
    };
    setOverlays(prev => [...prev, newOverlay]);
    return newOverlay;
  }, []);

  const updateOverlay = useCallback((id: string, updates: Partial<TextOverlay>) => {
    setOverlays(prev => 
      prev.map(overlay => 
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  }, []);

  const removeOverlay = useCallback((id: string) => {
    setOverlays(prev => prev.filter(overlay => overlay.id !== id));
  }, []);

  const moveOverlay = useCallback((id: string, position: { x: number; y: number }) => {
    setOverlays(prev =>
      prev.map(overlay =>
        overlay.id === id ? { ...overlay, position } : overlay
      )
    );
  }, []);

  return {
    overlays,
    addOverlay,
    updateOverlay,
    removeOverlay,
    moveOverlay,
  };
}