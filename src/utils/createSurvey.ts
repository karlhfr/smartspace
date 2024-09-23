import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();

interface SurveyData {
  // ... existing survey fields
  fitterId: string;
  fitterCompanyName: string;
}

export const createSurveyRequest = async (surveyData: SurveyData) => {
  try {
    const docRef = await addDoc(collection(db, 'Surveys'), {
      ...surveyData,
      status: 'pending', // Add a status field to track the survey's progress
      createdAt: new Date(), // Add a timestamp for when the survey was created
    });
    console.log('Survey request created with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating survey request:', error);
    throw error;
  }
};