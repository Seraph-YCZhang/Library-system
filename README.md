# Library System
## How to start the app
Before start the app, you need to set up the database setting in dbConfig.js file. Then you can run ```node seed.js``` for setting up tables and test data, all the test password is ```test```.

And run ```npm install``` or ```yarn install``` in root folder and client folder for installing depencies.

Actually here are two apps, you need to run ```yarn start ```in client folder and run ```node index.js``` or ```nodemon index.js``` in root folder. Ideally, the client app will run on port 3000, the server will run on port 3001.
## Front-end
react, redux, redux-saga
### Front pages
Homepage: just welcome info here
Books: all availabel books are here
  1. For regular users, they can check book
  2. For librarians, they can check, delete and add book

OverdueBooks: only librarian can view this page for all information about overduebooks(bookId, bookISBN, userId, userName)
CheckedBooks: all checked books
Login: users can login or signup

## Back-end
express.js, postgreSQL, pg-promise
Used session for user authentication 
Used cors() for cross-origin requests
Used crypto for password hash
### Database configuration
In the dbConfig.js file

## Other
Used postman to test apis

### Todos
I think the three books pages can merge into one. Using props to control its view. Haven't got a good idea to choose the props to make it done.