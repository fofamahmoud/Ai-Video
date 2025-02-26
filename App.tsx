import React, { useState } from 'react';
import { Header } from './components/Header';
import { CreateProject } from './components/CreateProject';
import { ProjectList } from './components/ProjectList';
import { ProjectPreview } from './components/ProjectPreview';
import type { Project } from './types';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreateProject = (data: { type: 'text' | 'audio'; content: string; title: string }) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      status: 'draft',
      input: {
        type: data.type,
        content: data.content,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);
    setSelectedProject(newProject);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setSelectedProject(updatedProject);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">New Project</h2>
              <CreateProject onSubmit={handleCreateProject} />
              
              {selectedProject && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Project</h2>
                  <ProjectPreview 
                    project={selectedProject}
                    onUpdateProject={handleUpdateProject}
                  />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Projects</h2>
              <ProjectList
                projects={projects}
                onSelectProject={setSelectedProject}
              />
              
              {projects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No projects yet. Create your first project to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;