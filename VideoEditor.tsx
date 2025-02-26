import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, 
  Play, 
  FastForward, 
  RotateCcw, 
  Type, 
  Music, 
  Wand2,
  Layers,
  Sparkles,
  Share2,
  Pause,
  SkipBack,
  SkipForward,
  Loader
} from 'lucide-react';
import { useVideoProcessor } from '../hooks/useVideoProcessor';
import type { Project, Effect, TextOverlay, TimelineTrack } from '../types';

interface VideoEditorProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function VideoEditor({ project, onUpdateProject }: VideoEditorProps) {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<TimelineTrack | null>(null);
  const [cutStartTime, setCutStartTime] = useState<number | null>(null);
  const [cutEndTime, setCutEndTime] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const {
    isReady,
    isProcessing,
    load,
    changeSpeed,
    reverseVideo,
    cutVideo,
    applyFilter
  } = useVideoProcessor();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (project.output?.videoUrl && !videoFile) {
      fetch(project.output.videoUrl)
        .then(res => res.blob())
        .then(blob => {
          setVideoFile(new File([blob], 'video.mp4', { type: 'video/mp4' }));
        });
    }
  }, [project.output?.videoUrl]);

  const tools = [
    { id: 'cut', icon: Scissors, label: 'Cut & Split' },
    { id: 'speed', icon: FastForward, label: 'Speed Control' },
    { id: 'reverse', icon: RotateCcw, label: 'Reverse' },
    { id: 'effects', icon: Sparkles, label: 'Effects' },
    { id: 'text', icon: Type, label: 'Text & Titles' },
    { id: 'audio', icon: Music, label: 'Audio' },
    { id: 'ai', icon: Wand2, label: 'AI Tools' },
    { id: 'layers', icon: Layers, label: 'Layers' },
  ];

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = async (speed: number) => {
    if (!videoFile || !isReady) return;
    
    try {
      const outputUrl = await changeSpeed(videoFile, speed);
      if (videoRef.current) {
        videoRef.current.src = outputUrl;
      }
      setPlaybackRate(speed);
    } catch (error) {
      console.error('Error changing video speed:', error);
    }
  };

  const handleReverse = async () => {
    if (!videoFile || !isReady) return;
    
    try {
      const outputUrl = await reverseVideo(videoFile);
      if (videoRef.current) {
        videoRef.current.src = outputUrl;
      }
    } catch (error) {
      console.error('Error reversing video:', error);
    }
  };

  const handleCut = async () => {
    if (!videoFile || !isReady || cutStartTime === null || cutEndTime === null) return;
    
    try {
      const outputUrl = await cutVideo(videoFile, cutStartTime, cutEndTime);
      if (videoRef.current) {
        videoRef.current.src = outputUrl;
      }
      setCutStartTime(null);
      setCutEndTime(null);
    } catch (error) {
      console.error('Error cutting video:', error);
    }
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId === selectedTool ? '' : toolId);
  };

  const formatTime = (seconds: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const renderToolPanel = () => {
    switch (selectedTool) {
      case 'cut':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Cut Video</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1">Start Time</label>
                <input
                  type="number"
                  value={cutStartTime || 0}
                  onChange={(e) => setCutStartTime(parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                  step="0.1"
                  min="0"
                  max={duration}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">End Time</label>
                <input
                  type="number"
                  value={cutEndTime || duration}
                  onChange={(e) => setCutEndTime(parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                  step="0.1"
                  min="0"
                  max={duration}
                />
              </div>
            </div>
            <button
              onClick={handleCut}
              disabled={isProcessing || !cutStartTime || !cutEndTime}
              className="mt-4 w-full p-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                'Cut Video'
              )}
            </button>
          </div>
        );
      case 'speed':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Speed Control</h3>
            <div className="grid grid-cols-5 gap-2">
              {[0.5, 0.75, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  disabled={isProcessing}
                  className={`p-2 text-sm rounded border ${
                    playbackRate === speed
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        );
      case 'reverse':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Reverse Video</h3>
            <button
              onClick={handleReverse}
              disabled={isProcessing}
              className="w-full p-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                'Reverse Video'
              )}
            </button>
          </div>
        );
      case 'effects':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Visual Effects</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Cinematic', 'Vintage', 'Noir', 'Vibrant'].map((effect) => (
                <button
                  key={effect}
                  onClick={() => handleApplyFilter(effect)}
                  disabled={isProcessing}
                  className="p-2 text-sm bg-white rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleApplyFilter = async (filterName: string) => {
    if (!videoFile || !isReady) return;
    
    try {
      const outputUrl = await applyFilter(videoFile, filterName);
      if (videoRef.current) {
        videoRef.current.src = outputUrl;
      }
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading video editor...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Preview */}
      <div className="relative aspect-video bg-black">
        {project.output && (
          <video
            ref={videoRef}
            src={project.output.videoUrl}
            poster={project.output.thumbnailUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
        )}
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="hover:text-white/80"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{playbackRate}x</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div 
            className="mt-2 h-1 bg-white/30 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              handleSeek(percent * duration);
            }}
          >
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="h-32 bg-gray-100 border-t border-gray-200 p-2">
        <div 
          ref={timelineRef}
          className="h-full bg-white rounded-lg border border-gray-300 relative"
        >
          {/* Time Markers */}
          <div className="absolute top-0 left-0 right-0 h-6 border-b border-gray-200">
            {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-300 text-xs text-gray-500 flex items-center"
                style={{ left: `${(i / duration) * 100}%` }}
              >
                <span className="ml-1">{formatTime(i)}</span>
              </div>
            ))}
          </div>
          
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-px bg-red-500"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full -translate-x-1/2" />
          </div>

          {/* Cut Markers */}
          {cutStartTime !== null && (
            <div
              className="absolute top-0 bottom-0 w-px bg-blue-500"
              style={{ left: `${(cutStartTime / duration) * 100}%` }}
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2" />
            </div>
          )}
          {cutEndTime !== null && (
            <div
              className="absolute top-0 bottom-0 w-px bg-blue-500"
              style={{ left: `${(cutEndTime / duration) * 100}%` }}
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2" />
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-t border-gray-200">
        <div className="p-4">
          <div className="grid grid-cols-8 gap-4">
            {tools.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleToolSelect(id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  selectedTool === id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tool Panel */}
        {selectedTool && (
          <div className="border-t border-gray-200 p-4">
            {renderToolPanel()}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <select className="form-select text-sm border rounded-md p-1.5">
              <option>1080p</option>
              <option>4K</option>
            </select>
            <select className="form-select text-sm border rounded-md p-1.5">
              <option>30 FPS</option>
              <option>60 FPS</option>
            </select>
          </div>
          <button 
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            Export
          </button>
        </div>
      </div>
    </div>
  );
}