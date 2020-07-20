const query = require('./queries');
const db = query.db;

// user apis
// input: bookId(Number), userId(Number)
const checkABook = (req, res) => {
    // console.log("I got called")
    const bookId = req.body.book_id;
    const userId = req.body.user_id;
    // console.log(userId,bookId);
    db.task('check-can-book', async t => {
        const user = await t.one('select * from users where id = $1;', userId);
        const book = await t.one('select * from books where id = $1;', bookId);
        const ownBookCount = await t.one('select count(*) from bookChecked where user_id = $1;', userId);
        const overdueCount = await t.one('select count(*) from bookChecked where user_id = $1 and current_date > due_date;', userId);
        return { user, book, ownBookCount, overdueCount };
    })
        .then(({ user, book, ownBookCount, overdueCount }) => {
            if (user !== null && book.available && ownBookCount.count < 3 && overdueCount.count < 1) {
                db.task('borrow-a-book', async t => {
                    const _ = await t.none('insert into bookChecked (user_id, book_id, due_date) values ($1, $2, current_date + 14)', [userId, bookId]);
                    const b = await t.none(`update books set available = 'f' where id = ${bookId}`);
                }).then(() => {
                    res.status(200).send(`${user.name} wants to borrow ${book.isbn}, 
                which is ${book.available ? 'available' : 'not available'} 
                and has own ${ownBookCount.count} books! Update ${book.isbn} as not available`);
                }).catch(e => console.log('Err in check book:' + e));
            } else {
                let errorMsg;
                if (user === null) {
                    errorMsg = 'Not authenticated user';
                }
                else if (!book.available) {
                    errorMsg = 'Book not available';
                }
                else if (ownBookCount.count >= 3) {
                    errorMsg = 'You have checked too many books';
                }
                else if (overdueCount >= 1) {
                    errorMsg = 'You have unreturned book!!!!!';
                }
                res.status(400).send(errorMsg);
            }
        })
        .catch(e => 'Err in check book:' + e);
};
// input: bookId(Number), userId(Number)
const returnBook = (req, res) => {
    const bookId = req.body.book_id;
    const userId = req.body.user_id;
    db.task('return-a-book', async t => {
        const result = await t.result(`delete from bookChecked where user_id = $1 and book_id = $2`, [userId, bookId]);
        const _ = await t.none(`update books set available = 't' where id = ${bookId}`);
        return result;
    }).then((result) => new Promise((resolve, reject) => {
        const cnt = result.rowCount;
        if (cnt === 0) {
            reject(new Error('no records'));
        } else {
            resolve(`success returned book ${bookId}`);
        }
    })
    )
        .then((data) => res.status(200).send(data))
        .catch(e => {
            res.status(400).send(e)
            console.log('Err in returnBook: ' + e)
        });
};

const getAllCheckedBooks = async (req, res) => {
    const userId = req.body.user_id || req.session.userInfo.id;
    const books = await db.any(`select id, isbn from books where id in (select book_id from bookChecked where user_id = ${userId}) order by id asc`)
        .then(books => res.status(200).json(books))
        .catch(e => console.log('Err in getAllCheckedBooks: ' + e))
};

module.exports = {
    checkABook,
    returnBook,
    getAllCheckedBooks
};
