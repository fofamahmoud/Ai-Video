import React, { useState } from 'react';
import { Play, Pause, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { VideoEditor } from './VideoEditor';
import type { Project } from '../types';

interface ProjectPreviewProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function ProjectPreview({ project, onUpdateProject }: ProjectPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const statusConfig = {
    draft: {
      icon: Play,
      text: 'Start Processing',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      message: 'Ready to process',
    },
    processing: {
      icon: Pause,
      text: 'Processing...',
      color: 'bg-blue-600 hover:bg-blue-700',
      message: 'Your video is being created',
    },
    completed: {
      icon: Play,
      text: isPlaying ? 'Pause Video' : 'Play Video',
      color: 'bg-green-600 hover:bg-green-700',
      message: 'Video ready to edit',
    },
    failed: {
      icon: AlertTriangle,
      text: 'Retry',
      color: 'bg-red-600 hover:bg-red-700',
      message: 'Processing failed',
    },
  };

  const { icon: StatusIcon, text, color, message } = statusConfig[project.status];

  const handleAction = async () => {
    if (project.status === 'draft' || project.status === 'failed') {
      // Simulate video processing
      onUpdateProject({
        ...project,
        status: 'processing',
        updatedAt: new Date().toISOString(),
      });

      // Simulate API call and processing time
      setTimeout(() => {
        onUpdateProject({
          ...project,
          status: 'completed',
          output: {
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          },
          updatedAt: new Date().toISOString(),
        });
      }, 3000);
    } else if (project.status === 'completed') {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          {project.status === 'completed' && (
            <button
              onClick={handleAction}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${color}`}
            >
              <StatusIcon className="w-4 h-4 mr-2" />
              {text}
            </button>
          )}
        </div>
      </div>

      {project.status === 'completed' ? (
        <VideoEditor project={project} onUpdateProject={onUpdateProject} />
      ) : (
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Input Type</h4>
              <p className="mt-1 text-sm text-gray-900 capitalize">{project.input.type}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Content</h4>
              <div className="mt-1 text-sm text-gray-900">
                {project.input.type === 'text' ? (
                  <p className="whitespace-pre-wrap">{project.input.content}</p>
                ) : (
                  <p className="text-gray-500">Audio file: {project.input.content}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {project.status === 'processing' && (
                    <RefreshCw className="w-4 h-4 mr-2 text-blue-500 animate-spin" />
                  )}
                  <span className="text-sm text-gray-700">{message}</span>
                </div>
                {project.status !== 'completed' && (
                  <button
                    onClick={handleAction}
                    disabled={project.status === 'processing'}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${color} ${
                      project.status === 'processing' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {text}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}