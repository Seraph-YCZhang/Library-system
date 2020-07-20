import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';
import './App.scss';
import Header from './components/header/header'
import SignInNOut from './pages/sign-in/sign-in-n-out'
import { connect } from 'react-redux';
import { checkUserSession } from './redux/user/user.actions';
import Books from './components/books/books';
import OverdueBooks from './components/overdueBooks/overdueBooks';
import CheckedBooks from './components/checkedBooks/checkedBooks';

const App = ({ currentUser, checkUserSession }) => {
  
  useEffect(() => {
    checkUserSession()
  }, [checkUserSession])
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path='/' render={()=><div className='welcome'>{currentUser?`${currentUser.data.name}, `:''}Welcome to our library!</div>} />
        <Route exact path='/login' render={()=> currentUser ? (<Redirect to='/' />): (<SignInNOut />)} /> :
        <Route exact path='/books' render={()=><Books/>} />
        <Route exact path='/overdueBooks' render={()=><OverdueBooks/>} />
        <Route exact path='/checkedBooks' render={()=><CheckedBooks/>} />

      </Switch>

    </div>
  );
}
const mapStateToProps = state => {
  const { user } = state;
  const { currentUser } = user;
  return { currentUser };
}
const mapDispatchToProps = dispatch => ({
  checkUserSession: user => dispatch(checkUserSession())
})
export default connect(mapStateToProps, mapDispatchToProps)(App);
