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

export const createUserProfileDocument = async(userAuth, additionalData) => {
    if (!userAuth) return;
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();
    
    if (!snapShot.exists){
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch(error) {
            console.log('error creating user', error.message);        
        }
    }
    return userRef;
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;