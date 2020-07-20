const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 3001;
const userApi = require('./users');
const libApi = require('./librarians');
const db = require('./queries.js');
const { isLibrarian, isAuth } = require('./middlewares/isAuth');
const cors = require('cors');

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser('buffaloCookie'));
app.use(session({
    secret: 'buffaloCookie',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60 * 1000 * 120 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.send('Welcome to Alexander Library!!!');
})

// api for login and sign up
app.post('/api/login', db.login);
app.get('/api/logout', db.logout);
app.post('/api/register', db.register);
app.get('/api/loginVerify', db.loginVerify);
// librarian apis 
app.post('/api/addBook', isLibrarian, libApi.addBook);
app.delete('/api/deleteBook', isLibrarian, libApi.deleteBook);
app.get('/api/getAllOverdues', isLibrarian, libApi.getAllOverdues);
app.get('/api/getAllBooks', libApi.getAllAvailableBooks)
// user apis
app.post('/api/checkABook', isAuth, userApi.checkABook);
app.delete('/api/returnBook', isAuth, userApi.returnBook);
app.get('/api/getAllCheckedBooks', isAuth, userApi.getAllCheckedBooks)

app.listen(port, () => {
    console.log(`App is running on ${port}`);
})