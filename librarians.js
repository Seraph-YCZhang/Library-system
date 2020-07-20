const query = require('./queries');
const db = query.db;

// manager apis
// input: ISBN(String)
const addBook = (req, res) => {
    db.none(`insert into books (ISBN,available) values ($1, $2)`, [req.body.ISBN, true])
        .then(() => res.status(200).send('success inserting a book:' + req.body.ISBN))
        .catch(e => console.log('Err in addBook:' + e));
};

const getAllAvailableBooks = (req, res) => {
    db.any(`select * from books where available = 't' order by id ASC`)
        .then((data) => res.status(200).json({
            data
        }))
        .catch(e => console.log('Err in addBook:' + e));
};
// input: bookId(Number)
const deleteBook = (req, res) => {
    db.result(`delete from books where id = $1`, [req.body.book_id])
        .then(result => new Promise((resolve, reject) => {
            if (result.rowCount > 0) {
                res.status(200).send('success deleted a book:' + req.ISBN);
                resolve('')
            } else {
                res.status(400).send('delete nothing');
                reject(new Error('delete nothing'));
            }
        }))
        .catch(e => console.log('Err in deleteBook: ' + e));
};

const getAllOverdues = (req, res) => {
    db.task('get-all-overdue-books', async t => {
        const books = await t.any(`select books.id bid, books.isbn, users.id uid, 
        users.name uname from books,users where books.id in 
        (select book_id from bookChecked where current_date > due_date) and 
        users.id = (select user_id from bookChecked where book_id = books.id) order by books.id ASC`);
        return books;
    }).then((books) => res.status(200).json({
        books
    }))
        .catch(e => console.log('Err in getAllOverdues:' + e))
};

module.exports = {
    getAllOverdues,
    deleteBook,
    addBook,
    getAllAvailableBooks
}