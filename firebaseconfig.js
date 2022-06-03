// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: "may-2022-fc04b.firebaseapp.com",
	databaseURL: "https://may-2022-fc04b-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "may-2022-fc04b",
	storageBucket: "may-2022-fc04b.appspot.com",
	messagingSenderId: "778566554601",
	appId: "1:778566554601:web:b7e1bf47104e71ee8cb178",
	measurementId: "G-2QZYPGSDFS",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;
