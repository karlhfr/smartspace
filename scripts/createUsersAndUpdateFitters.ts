import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccount = require('./path-to-your-service-account-key.json');
initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();
const db = getFirestore();

async function createUserAndUpdateFitter(fitter: any) {
  try {
    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: fitter.email,
      password: 'tempPassword123!', // You should use a secure method to generate passwords
      displayName: `${fitter.fitter_first_name} ${fitter.fitter_last_name}`
    });

    // Update Firestore document with the new UID
    await db.collection('Fitters').doc(fitter.id).update({
      uid: userRecord.uid
    });

    console.log(`Created user and updated Firestore for ${fitter.company_name}`);
  } catch (error) {
    console.error(`Error processing ${fitter.company_name}:`, error);
  }
}

async function processAllFitters() {
  const fittersSnapshot = await db.collection('Fitters').get();
  
  for (const doc of fittersSnapshot.docs) {
    const fitter = { id: doc.id, ...doc.data() };
    await createUserAndUpdateFitter(fitter);
  }

  console.log('Finished processing all fitters');
}

processAllFitters().then(() => process.exit(0));