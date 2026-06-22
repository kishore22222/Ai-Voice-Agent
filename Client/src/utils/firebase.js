import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "shifraai-d55e4.firebaseapp.com",
  projectId: "shifraai-d55e4",
  storageBucket: "shifraai-d55e4.firebasestorage.app",
  messagingSenderId: "848200336999",
  appId: "1:848200336999:web:08cbb39e6421c646af36c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider()
export {auth,provider}