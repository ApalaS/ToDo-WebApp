import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCivUtkduA4XhlvQ-lnYIgJ5keiI5G0rbk",
  authDomain: "to-do-cf009.firebaseapp.com",
  projectId: "to-do-cf009",
  storageBucket: "to-do-cf009.appspot.com",
  messagingSenderId: "870772287929",
  appId: "1:870772287929:web:8685ef20f953e027ceee68",
};

initializeApp(firebaseConfig);
const db = getFirestore();

export default {
  db,
};
