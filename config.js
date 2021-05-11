import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyCkYKbz5o3DyOOTXahjkBi1oAjT6aKV2l4",
  authDomain: "barter-syste-293207.firebaseapp.com",
  databaseURL: "https://barter-syste-293207.firebaseio.com",
  projectId: "barter-syste-293207",
  storageBucket: "barter-syste-293207.appspot.com",
  messagingSenderId: "1093632593342",
  appId: "1:1093632593342:web:acb3b8125c4c2f141abdef"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();