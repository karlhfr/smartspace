// src/components/ProjectGallery.tsx
import React, { useState, useEffect } from 'react';
import { getFitterProjects } from '@/lib/projects';
import Image from 'next/image';

interface Project {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

export function ProjectGallery({ fitterId }: { fitterId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await getFitterProjects(fitterId);
      setProjects(fetchedProjects as Project[]);
    };
    fetchProjects();
  }, [fitterId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <div key={project.id} className="border rounded-lg overflow-hidden">
          <Image src={project.imageUrl} alt={project.title} width={300} height={200} />
          <div className="p-4">
            <h3 className="font-bold">{project.title}</h3>
            <p>{project.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}