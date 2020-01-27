import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAM8QI4FiUOGJTyZtxMQaCQ26z2WwH8OvQ",
    authDomain: "crwn-db-12037.firebaseapp.com",
    databaseURL: "https://crwn-db-12037.firebaseio.com",
    projectId: "crwn-db-12037",
    storageBucket: "crwn-db-12037.appspot.com",
    messagingSenderId: "267683877909",
    appId: "1:267683877909:web:c2a277206cee62c0006a1c",
    measurementId: "G-N8DMGDC50N"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async(userAuth) => {
    
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;