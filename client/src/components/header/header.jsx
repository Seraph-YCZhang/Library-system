import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './header.scss';
import { connect } from 'react-redux';
import { signOutStart } from '../../redux/user/user.actions';

const Header = ({ currentUser, signOut }) => {
    const history = useHistory();
    const logoutClick = () => {
        signOut();
        history.push("/");
    }
    return (
        <div className='header-container'>
            <div className='links-container'>
                <div className='link-container'>
                    <Link to='/'>
                        Home
                </Link>
                </div>
                <div className='link-container'>
                    <Link to='/books'>
                        Books
                </Link>
                </div>



                {
                    currentUser && currentUser.data && currentUser.data.role === 'Librarian' ?
                        <div className='link-container'>
                            <Link to='/overdueBooks'>
                                Overdue Books
                            </Link>
                        </div>
                        : ''
                }

                {
                    currentUser ?
                        <div className='link-container'>
                            <Link to='/checkedBooks'>
                                Checked Books
                            </Link>
                        </div>
                        : ''
                }
                <div className='link-container'>
                    {
                        currentUser ? <div onClick={logoutClick}>
                            Logout
                        </div> :
                            <Link to='/login'>
                                Login
                            </Link>
                    }

                </div>



            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    const { user } = state;
    return {
        currentUser: user.currentUser
    }
}

const mapDispatchToProps = dispatch => ({
    signOut: () => dispatch(signOutStart())
})
export default connect(mapStateToProps, mapDispatchToProps)(Header);