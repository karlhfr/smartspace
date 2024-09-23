// src/lib/projects.ts

import { db, storage } from './firebase';
import { collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  fitterEmail: string;
  createdAt: Date;
}

export async function getFitterProjects(fitterEmail: string): Promise<Project[]> {
  console.log('Fetching projects for fitter:', fitterEmail);
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where("fitterEmail", "==", fitterEmail), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    console.log('Query snapshot size:', querySnapshot.size);
    
    const projects = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        fitterEmail: data.fitterEmail,
        createdAt: data.createdAt.toDate(),
      } as Project;
    });
    
    console.log('Fetched projects:', projects);
    return projects;
  } catch (error) {
    console.error("Error fetching fitter projects:", error);
    throw error; // Propagate the error to be handled in the component
  }
}

export async function createProject(fitterEmail: string, title: string, description: string, imageFile: File): Promise<Project> {
  console.log('Creating project for fitter:', fitterEmail);
  try {
    // Upload image
    const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    // Add project to Firestore
    const projectsRef = collection(db, 'projects');
    const newProject = {
      fitterEmail,
      title,
      description,
      imageUrl,
      createdAt: new Date()
    };

    const docRef = await addDoc(projectsRef, newProject);
    console.log('New project created with ID:', docRef.id);

    return {
      id: docRef.id,
      ...newProject,
      createdAt: newProject.createdAt
    };
  } catch (error) {
    console.error('Error in createProject:', error);
    throw error;
  }
}