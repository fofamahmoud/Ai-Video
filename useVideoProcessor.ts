import { useRef, useState, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export function useVideoProcessor() {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    if (!ffmpeg.loaded) {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setIsReady(true);
    }
  };

  const changeSpeed = useCallback(async (videoFile: File, speed: number): Promise<string> => {
    const ffmpeg = ffmpegRef.current;
    setIsProcessing(true);

    try {
      // Write the input file to memory
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

      // Apply speed change using setpts filter
      const speedFactor = 1 / speed;
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-filter:v', `setpts=${speedFactor}*PTS`,
        '-filter:a', `atempo=${speed}`,
        'output.mp4'
      ]);

      // Read the output file
      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      return URL.createObjectURL(blob);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reverseVideo = useCallback(async (videoFile: File): Promise<string> => {
    const ffmpeg = ffmpegRef.current;
    setIsProcessing(true);

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vf', 'reverse',
        '-af', 'areverse',
        'output.mp4'
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      return URL.createObjectURL(blob);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const cutVideo = useCallback(async (
    videoFile: File,
    startTime: number,
    endTime: number
  ): Promise<string> => {
    const ffmpeg = ffmpegRef.current;
    setIsProcessing(true);

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', startTime.toString(),
        '-t', (endTime - startTime).toString(),
        '-c', 'copy',
        'output.mp4'
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      return URL.createObjectURL(blob);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const applyFilter = useCallback(async (
    videoFile: File,
    filterName: string
  ): Promise<string> => {
    const ffmpeg = ffmpegRef.current;
    setIsProcessing(true);

    const filterMap = {
      'Cinematic': 'curves=preset=increased_contrast,eq=brightness=-0.1:saturation=1.2',
      'Vintage': 'curves=preset=vintage,hue=s=0.5',
      'Noir': 'colorbalance=rs=-0.3:gs=-0.3:bs=-0.3:rm=-0.3:gm=-0.3:bm=-0.3:rh=-0.3:gh=-0.3:bh=-0.3',
      'Vibrant': 'eq=contrast=1.2:brightness=0.05:saturation=1.4',
    };

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vf', filterMap[filterName as keyof typeof filterMap] || 'null',
        '-c:a', 'copy',
        'output.mp4'
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      return URL.createObjectURL(blob);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isReady,
    isProcessing,
    load,
    changeSpeed,
    reverseVideo,
    cutVideo,
    applyFilter,
  };
}