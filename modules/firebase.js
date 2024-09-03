const { initializeApp } =require("firebase/app");
const { getStorage, ref, uploadBytes } =require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDghvHV7wJfe9BB9-ocK6IDulZIGRlYBh4",
  authDomain: "tribe-main-proj.firebaseapp.com",
  projectId: "tribe-main-proj",
  storageBucket: "tribe-main-proj.appspot.com",
  messagingSenderId: "533647502304",
  appId: "1:533647502304:web:9ca45b8b4fc5fca83e9985",
  measurementId: "G-Z2LLK5DLL1"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
module.exports = storage