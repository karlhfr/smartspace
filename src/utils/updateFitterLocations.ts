import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBlIY91c5PcoBQkq3axiBXGhd8LAhx3-tM';

interface Fitter {
  id: string;
  company_name: string;
  fitter_address: string;
  lat: number;
  lng: number;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();

  if (data.status === 'OK' && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }

  return null;
}

export async function updateFitterLocations() {
  const fittersCollection = collection(db, 'Fitters');
  const fittersSnapshot = await getDocs(fittersCollection);
  const fitters = fittersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Fitter));

  for (const fitter of fitters) {
    console.log(`Updating location for ${fitter.company_name}...`);
    const location = await geocodeAddress(fitter.fitter_address);

    if (location) {
      await updateDoc(doc(db, 'Fitters', fitter.id), {
        lat: location.lat,
        lng: location.lng,
      });
      console.log(`Updated location for ${fitter.company_name}: ${location.lat}, ${location.lng}`);
    } else {
      console.error(`Failed to geocode address for ${fitter.company_name}`);
    }
  }

  console.log('Finished updating fitter locations');
}