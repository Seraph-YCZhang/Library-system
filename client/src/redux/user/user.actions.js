import UserActionTypes from "./user.types";
export const signInSuccess = (user) => ({
    type: UserActionTypes.SIGN_IN_SUCCESS,
    payload: user
});

export const signInFailure = err => ({
    type: UserActionTypes.SIGN_IN_FAILURE,
    payload: err
});

export const emailSignInStart = (emailAndPassword) => {
    return ({
    type: UserActionTypes.EMAIL_SIGN_IN_START,
    payload: emailAndPassword
})};

export const checkUserSession = () => ({
    type: UserActionTypes.CHECK_USER_SESSION
});

export const signOutStart = () => ({
    type: UserActionTypes.SIGN_OUT_START
});

export const signOutSuccess = () => ({
    type: UserActionTypes.SIGN_OUT_SUCCUESS
});

export const signOutFailure = error => ({
    type: UserActionTypes.SIGN_OUT_FAILURE,
    payload: error
});

export const signUpStart = userCredentials => ({
    type: UserActionTypes.SIGN_UP_START,
    payload: userCredentials
});

export const signUpSuccess = (emailAndPassword) => ({
    type : UserActionTypes.SIGN_UP_SUCCESS,
    payload: emailAndPassword
});

export const signUpFailure = error => ({
    type: UserActionTypes.SIGN_UP_FAILURE,
    payload: error
});