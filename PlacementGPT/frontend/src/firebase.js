import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAw30GWT4A3VvHr7jrHTpmRF3clUIySCRM",
  authDomain: "placement-3558b.firebaseapp.com",
  projectId: "placement-3558b",
  storageBucket: "placement-3558b.firebasestorage.app",
  messagingSenderId: "245800904861",
  appId: "1:245800904861:web:cf9bf8b79aa57454b20c74",
  measurementId: "G-CYDQ841Y8N",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export { app, auth, googleProvider, analytics };

