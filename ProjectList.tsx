import React from 'react';
import { Clock, CheckCircle, AlertCircle, FileEdit } from 'lucide-react';
import type { Project } from '../types';

const statusIcons = {
  draft: FileEdit,
  processing: Clock,
  completed: CheckCircle,
  failed: AlertCircle,
};

const statusColors = {
  draft: 'text-gray-500',
  processing: 'text-blue-500',
  completed: 'text-green-500',
  failed: 'text-red-500',
};

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function ProjectList({ projects, onSelectProject }: ProjectListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <ul className="divide-y divide-gray-200">
        {projects.map((project) => {
          const StatusIcon = statusIcons[project.status];
          return (
            <li
              key={project.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectProject(project)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StatusIcon className={`h-5 w-5 ${statusColors[project.status]}`} />
                  <span className="ml-3 text-sm font-medium text-gray-900">{project.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}