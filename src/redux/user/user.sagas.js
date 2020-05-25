import { takeLatest, put, all, call } from 'redux-saga/effects';
import UserActionTypes from './user.types';

import { signInSuccess, signInFailure, signOutSucess, signOutFailure, signUpFailure, signUpSucess } from './user.actions';

import { auth, googleProvider, createUserProfileDocument, getCurrentUser } from '../../firebase/firebase.utils';

export function* getSnaptshotFromUserAuth(userAuth, additionalData){
    try {
        const userRef = yield call(createUserProfileDocument, userAuth, additionalData);
        const userSnapshot = yield userRef.get();
        yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }))
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signInWithGoogle(){
    try {
        const {user} = yield auth.signInWithPopup(googleProvider);
        yield getSnaptshotFromUserAuth(user);
    } catch (error) {
        put(signInFailure(error));
    }
}

export function* signInWithEmail({payload: { email, password}}){
    try {
        const { user } = yield auth.signInWithEmailAndPassword(email, password);
        yield getSnaptshotFromUserAuth(user);
    } catch (error) {
        put(signInFailure(error));
    }
}

export function* isUserAuthenticated(){
    try {
        const userAuth = yield getCurrentUser();
        if (!userAuth) return;
        yield getSnaptshotFromUserAuth(userAuth);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signOut() {
    try {
        yield auth.signOut();
        yield (put(signOutSucess()))
    } catch (error) {
        yield (put(signOutFailure(error)))
    }
}

export function* SignUp({payload: { email, password, displayName }}) {
    try {
        const { user } = yield auth.createUserWithEmailAndPassword(email, password);
        yield (put(signUpSucess({ user, additionalData: { displayName }})))
    } catch (error) {
        yield (put(signUpFailure(error)))
    }
}

export function* SignInAfterSignUp( { payload: { user, additionalData }}){
    yield getSnaptshotFromUserAuth(user, additionalData);
}

export function* onGoogleSignInStart() {
    yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle)
}

export function* onEmailSignInStart() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail)
}

export function* onCheckUserSession() {
    yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated)
}

export function* onSignOutStart() {
    yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut)
}

export function* onSignUpStart() {
    yield takeLatest(UserActionTypes.SIGN_UP_START, SignUp)
}

export function* onSignUpSuccess() {
    yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, SignInAfterSignUp)
}

export function* userSagas() {
    yield all([call(onGoogleSignInStart), call(onEmailSignInStart), call(onCheckUserSession), call(onSignOutStart), call(onSignUpStart), call(onSignUpSuccess)]);
}
