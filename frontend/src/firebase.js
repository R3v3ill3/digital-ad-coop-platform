import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCj9bjaoQUopBGdATQ-U1PnGIKxke6qUY4",
  authDomain: "digital-coop-a3083.firebaseapp.com",
  projectId: "digital-coop-a3083",
  storageBucket: "digital-coop-a3083.appspot.com",
  messagingSenderId: "925403828694",
  appId: "1:925403828694:web:26224650e09df2a2531477",
  measurementId: "G-CCWK2CWY7L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
