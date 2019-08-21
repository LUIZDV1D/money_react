import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBNJIv0RvavQfJXq_7HOdlSwXXknYlSd88",
    authDomain: "money-4c564.firebaseapp.com",
    databaseURL: "https://money-4c564.firebaseio.com",
    projectId: "money-4c564",
    storageBucket: "money-4c564.appspot.com",
    messagingSenderId: "384243998200",
    appId: "1:384243998200:web:6003a88019b20c48"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fbdatabase = firebase.database()

export { auth, fbdatabase };