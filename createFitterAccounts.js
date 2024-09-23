const admin = require('firebase-admin');
const serviceAccount = require('./your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function createFitterAccounts() {
  try {
    const fittersSnapshot = await db.collection('Fitters').get();

    for (const doc of fittersSnapshot.docs) {
      const fitterData = doc.data();
      const email = fitterData.email;
      const password = 'tempPassword123!'; // You should generate a random password here

      try {
        // Create user account
        const userRecord = await auth.createUser({
          email: email,
          password: password,
        });

        // Update Firestore document with UID
        await db.collection('Fitters').doc(doc.id).update({
          uid: userRecord.uid
        });

        console.log(`Created account for ${email} with UID: ${userRecord.uid}`);
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          console.log(`Account for ${email} already exists. Skipping.`);
        } else {
          console.error(`Error creating account for ${email}:`, error);
        }
      }
    }

    console.log('Finished creating fitter accounts');
  } catch (error) {
    console.error('Error:', error);
  }
}

createFitterAccounts();