import { takeLatest, put, all, call } from 'redux-saga/effects';
import UserActionTypes from './user.types';
import { signInSuccess, signInFailure, signOutSuccess, signOutFailure, signUpSuccess, signUpFailure, emailSignInStart } from './user.actions';

export function* signInWithEmail({ payload: { email, password } }) {
    try {
        const response = yield fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            }),
            credentials: 'include'
        });

        const data = yield response.json();
        yield put(signInSuccess(data));


    } catch (err) {
        yield put(signInFailure(err))
    }
}

export function* isUserAuthenticated() {
    try {
        const response = yield fetch('http://localhost:3001/api/loginVerify'
            , {
                method: 'GET',
                credentials: 'include'
            }
        );
        const data = yield response.json();
        if (data.success === 't') {
            yield put(signInSuccess({ data: data.data }));
        } else {
            throw new Error('not authenticated')
        }

    } catch (err) {
        yield put(signInFailure(err))
    }
}

export function* signOut() {
    try {
        const response = yield fetch(`http://localhost:3001/api/logout`,
            {
                method: 'GET',
                credentials: 'include'
            });
        const msg = yield response.json();
        if (msg.success === 't') {
            yield put(signOutSuccess());
        } else {
            throw new Error('not authenticated');
        }

    } catch (err) {
        yield put(signOutFailure());
    }
}

export function* signUp({ payload: { email, name, password, confirmPassword, role } }) {
    try {
        const response = yield fetch(`http://localhost:3001/api/register`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email, name, password, confirmPassword, role
            }),
            credentials: 'include'
        });
        const data = yield response.json();
        if (data.success === 't')
            yield put(signUpSuccess({ email, password }));
        else{
            throw new Error(data.msg);
        }
    } catch (err) {
        yield put(signUpFailure(err))
    }
}

export function* signInAfterSignUp({ payload: { email, password } }) {
    yield put(emailSignInStart({ email, password }));
}

export function* onEmailSignInStart() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession() {
    yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
    yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
    yield takeLatest(UserActionTypes.SIGN_UP_START, signUp)
}

export function* onSignUpSuccess() {
    yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp)
}


export function* userSagas() {
    yield all([
        call(onEmailSignInStart),
        call(onCheckUserSession),
        call(onSignOutStart),
        call(onSignUpStart),
        call(onSignUpSuccess)])
};