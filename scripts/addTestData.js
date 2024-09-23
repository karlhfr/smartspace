const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const serviceAccount = require('../config/your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karlhfr@gmail.com',
    pass: 'ydvn mnfk hcoe ziql'
  }
});

async function sendConfirmationEmail(email, password, fitterId) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'SmartSpace Fitter Registration Confirmation',
    html: `
      <h1>Welcome to SmartSpace!</h1>
      <p>Your fitter account has been created successfully.</p>
      <p>Here are your login details:</p>
      <ul>
        <li>Username (Email): ${email}</li>
        <li>Password: ${password}</li>
        <li>Fitter ID: ${fitterId}</li>
      </ul>
      <p>You can log in at: <a href="http://localhost:3001/auth">http://localhost:3001/auth</a></p>
      <p>Please change your password after your first login.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

async function addOrUpdateFitter(fitterData) {
  const { email } = fitterData;
  const fitterRef = db.collection('Fitters').where('email', '==', email);
  const fitterSnapshot = await fitterRef.get();

  if (fitterSnapshot.empty) {
    // Add new fitter
    const docRef = await db.collection('Fitters').add(fitterData);
    console.log(`Added new fitter: ${fitterData.company_name} with ID: ${docRef.id}`);
    await sendConfirmationEmail(email, fitterData.password, docRef.id);
    return docRef.id;
  } else {
    // Update existing fitter
    const fitterId = fitterSnapshot.docs[0].id;
    await db.collection('Fitters').doc(fitterId).update(fitterData);
    console.log(`Updated fitter: ${fitterData.company_name} with ID: ${fitterId}`);
    await sendConfirmationEmail(email, fitterData.password, fitterId);
    return fitterId;
  }
}

async function addTestData() {
  try {
    console.log('Starting to add/update test data...');

    // Fitters data
    const fittersData = [
      {
        company_name: "Best Stairs Ltd",
        service_radius: 50,
        email: "contact@beststairs.com",
        phone: "01234567890",
        website: "https://beststairs.com",
        description: "We specialize in custom stair solutions",
        fitter_address: "123 Main St, London, UK",
        fitter_first_name: "John",
        fitter_last_name: "Doe",
        fitter_company_number: "12345678",
        fitter_rating: 4.5,
        latitude: 51.5074,
        longitude: -0.1278,
        password: "password123"
      },
      {
        company_name: "Stair Masters",
        service_radius: 30,
        email: "info@stairmasters.com",
        phone: "09876543210",
        website: "https://stairmasters.com",
        description: "Quality stair fitting services",
        fitter_address: "456 High St, Manchester, UK",
        fitter_first_name: "Jane",
        fitter_last_name: "Smith",
        fitter_company_number: "87654321",
        fitter_rating: 4.8,
        latitude: 53.4808,
        longitude: -2.2426,
        password: "password456"
      },
      {
        company_name: "Karl's Stairs",
        service_radius: 40,
        email: "karlfr@me.com",
        phone: "07123456789",
        website: "https://karlstairs.com",
        description: "Innovative stair solutions",
        fitter_address: "789 Park Rd, Birmingham, UK",
        fitter_first_name: "Karl",
        fitter_last_name: "Fitter",
        fitter_company_number: "98765432",
        fitter_rating: 5.0,
        latitude: 52.4862,
        longitude: -1.8904,
        password: "pass1234"
      }
    ];

    const fitterIds = [];
    for (const fitter of fittersData) {
      const hashedPassword = await bcrypt.hash(fitter.password, 10);
      const fitterDataWithHash = { ...fitter, hashed_password: hashedPassword };
      delete fitterDataWithHash.password;
      const fitterId = await addOrUpdateFitter(fitterDataWithHash);
      fitterIds.push(fitterId);
    }

    // Rest of the code for surveys and quotes remains the same
    // ...

    console.log("Test data added/updated successfully!");
  } catch (error) {
    console.error("Error adding/updating test data: ", error);
  }
}

addTestData().then(() => process.exit());