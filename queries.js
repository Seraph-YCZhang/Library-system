const { MD5_SUFFIX, md5 } = require('./utils/cryption');
// config database
const dbConfig = require('./dbConfig');
const options = {};
// use pg-promise to connect postgresql database
const pgp = require('pg-promise')(options);
const db = pgp(dbConfig);

// for test 
// const getAllUsers = (req, res) => {
//     console.log(req.session);
//     db.any(`select * from users;`)
//         .then((data) => res.status(200).send(data))
//         .catch(e => console.log('Err in getAllUsers: ' + e));
// };

// manager apis
// in librarians.js

// regular user apis
// in users.js

// below are some common apis

// input: email(String), password(String)
const login = async (req, res) => {
    // console.log(req);
    let { email, password } = req.body;
    password = md5(password + MD5_SUFFIX);
    if (email === null || password === null) {
        res.status(400).send('invalid login');
    }
    try {
        const user = await db.one(`select * from users where email = $1 and password = $2`, [email, password]);
        let data = {}
        const { id, name, identity: role } = user;
        data = { id, name, role };
        req.session.userInfo = data;
        req.session.save();
        res.status(200).json({
            data
        });
    } catch (e) {
        console.log('Err in login:' + e)
    }
}

const logout = (req, res) => {
    try{
        req.session.destroy();
        res.status(200).json({
            success:'t'
        });
    }catch(e) {
        e => {
            console.log('Err in logout: ' + e)
            res.status(400).json({
                success:'f',
                msg:e
            });
        }
    }    
}
// for authentication check if refresh page
const loginVerify = async (req, res) => {
    if (req.session && req.session.userInfo) {
        res.status(200).json({
            success:'t',
            data: req.session.userInfo
        }
        );
    } else {
        res.status(200).json({ msg: 'not authenticated!' });
    }
}
// input: email(String), name(String), password(String), confirmPassword(String), role(String)
const register = async (req, res) => {
    try {
        const { email, name, password, confirmPassword, role } = req.body;
        // console.log({ email, name, password, confirmPassword, role });
        if (email === null || password === null || confirmPassword === null || name === null ||
            role === null || password !== confirmPassword || (role !== 'User' && role !== 'Librarian')) {
            res.status(200).json({success:'f',msg:'invalid registration'});
            throw new Error('invalid registration info');
        }
        const user = await db.oneOrNone('select * from users where email = $1', email);
        if (user) {
            res.status(200).json({success:'f',msg:'duplicated registration'});
            throw new Error('duplicated registration');
        }
        const result = await db.result('insert into users \
        (email, name, identity, password) values ($1, $2, $3, $4)',
            [`${email}`, `${name}`, `${role}`, `${md5(password + MD5_SUFFIX)}`]);
        if (result.rowCount == 1) {
            const new_user = await db.one('select * from users where email = $1', email);
            const { id, name, identity } = new_user;
            res.status(200).json({
                success:'t',
                user: {
                    id,
                    name,
                    identity
                },
                msg: 'welcome to our library'
            });
        }
    } catch (e) {
        console.log('Err in register: ' + e);
    }
}


module.exports = {
    db,
    login,
    logout,
    register,
    loginVerify
};