import React, {useState} from 'react';
import './sign-in.scss';
import FormInput from '../form-input/form-input';
import { emailSignInStart } from '../../redux/user/user.actions';
import { connect } from 'react-redux';
const SignIn = ({emailSignInStart}) => {
    const [userCredentials, setCredentials] = useState({ email: '', password: '' })
    const handleSubmit = async event => {
        event.preventDefault();
        const { email, password } = userCredentials;
        emailSignInStart(email, password);
    }

    const handleChange = event => {
        const { value, name } = event.target;
        setCredentials({ ...userCredentials, [name]: value })
    }

    return (
        <div className='sign-in'>
            <span>Sign in with your email and password</span>

            <form onSubmit={handleSubmit}>
                <FormInput
                    name='email'
                    type='email'
                    onChange={handleChange}
                    value={userCredentials['email']}
                    label='Email'
                    required />

                <FormInput
                    name='password'
                    type='password'
                    onChange={handleChange}
                    value={userCredentials['password']}
                    label='Password'
                    required />


                <button type='submit'>SIGN IN</button>


            </form>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    emailSignInStart: (email, password) => dispatch(emailSignInStart({ email, password }))
});

export default connect(null, mapDispatchToProps)(SignIn);