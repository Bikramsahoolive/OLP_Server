require('dotenv').config();
const {initializeApp} = require('firebase/app');

const firebaseConfig = {
    apiKey: process.env.firebase_apiKey,
    authDomain:process.env.firebase_authDomain,
    // databaseURL: process.env.firebase_projectId,
    projectId: process.env.firebase_projectId,
    storageBucket: process.env.firebase_storageBucket,
    messagingSenderId: process.env.firebase_messagingSenderId,
    appId: process.env.firebase_appId
  };
   
     
  const firebase = initializeApp(firebaseConfig);


  module.exports = firebase;