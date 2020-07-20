// authentication middlewares
const isLibrarian = (req, res, next) => {
    console.log(req.session);
    if(req.session.userInfo && req.session.userInfo.role === 'Librarian') {
        next();
    } else {
        res.status(400).send('not authenticated');
    }
}

const isAuth = (req, res, next) => {
    if(req.session.userInfo) {
        next();
    } else {
        res.status(400).send('not authenticated');
    }
}

module.exports = {
    isLibrarian, isAuth
};