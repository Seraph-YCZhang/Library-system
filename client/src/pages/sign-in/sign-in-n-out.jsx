import React from 'react';
import './sign-in-n-out.scss';
import SignIn from '../../components/sign-in/sign-in';
import SignUp from '../../components/sign-up/sign-up';
const SignInNOut = () => {
    return (
        <div className="sign-in-n-out">
          <SignIn />
          <SignUp />
        </div>
      );
}

export default SignInNOut;