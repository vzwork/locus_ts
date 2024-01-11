import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD29hxSTwTWZhpKG315tda47fy2HOny2v8",
  authDomain: "locus-68ed2.firebaseapp.com",
  databaseURL: "https://locus-68ed2-default-rtdb.firebaseio.com",
  projectId: "locus-68ed2",
  storageBucket: "locus-68ed2.appspot.com",
  messagingSenderId: "345502863205",
  appId: "1:345502863205:web:4ef77dd654c77c24c39b8c",
  measurementId: "G-N5HJXWCHME",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
