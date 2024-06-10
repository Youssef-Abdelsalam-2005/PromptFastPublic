const firebaseConfig = {
  apiKey: "no",
  authDomain: "no",
  projectId: "no",
  storageBucket: "no",
  messagingSenderId: "no",
  appId: "no",
  measurementId: "no",
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
} catch (e) {
  console.log(e);
}
