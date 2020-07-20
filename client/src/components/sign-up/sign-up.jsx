import React, { useState } from 'react';

import FormInput from '../form-input/form-input';
import './sign-up.scss';
import { connect } from 'react-redux';
import { signUpStart } from '../../redux/user/user.actions';

const SignUp = ({signUpStart}) => {
    const [userCredentials, setUserCredentials] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'User'
    });
    const { email, name, password, confirmPassword, role } = userCredentials;
    const handleSubmit = async event => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("password dones't match");
            return;
        }
        signUpStart( email, name, password, confirmPassword, role );
    }

    const handleChange = event => {
        const { name, value } = event.target;
        setUserCredentials({ ...userCredentials, [name]: value });
    }

    return (
        <div className='sign-up'>
            <span>Sign up with your email and password</span>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <FormInput
                    type='name'
                    name='name'
                    value={name}
                    onChange={handleChange}
                    label='Username'
                    required
                />
                <FormInput
                    type='email'
                    name='email'
                    value={email}
                    onChange={handleChange}
                    label='Email'
                    required
                />
                <FormInput
                    type='password'
                    name='password'
                    value={password}
                    onChange={handleChange}
                    label='Password'
                    required
                />
                <FormInput
                    type='password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={handleChange}
                    label='Confirm Password'
                    required
                />
                <FormInput
                    type='radio'
                    name='role'
                    value='Librarian'
                    onChange={handleChange}
                    label='Librarian'
                    isRatio={true}
                    role={role}
                />
                <FormInput
                    type='radio'
                    name='role'
                    value='User'
                    onChange={handleChange}
                    label='Regular User'
                    isRatio={true}
                    role={role}
                />
                <button type='submit'>SIGN UP</button>
            </form>
        </div>
    )
}
const mapDispatchToProps = dispatch => ({
    signUpStart: (email, name, password, confirmPassword, role ) => dispatch(signUpStart({email, name, password, confirmPassword, role}))
})
export default connect(null, mapDispatchToProps)(SignUp);