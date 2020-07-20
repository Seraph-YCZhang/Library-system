const db  = require('./queries');
const { md5, MD5_SUFFIX } = require('./utils/cryption')
const pwd = md5('test' + MD5_SUFFIX);
db.db.multi(`
    DROP TABLE if exists users CASCADE;
    CREATE TABLE users (ID SERIAL PRIMARY KEY, 
    name VARCHAR(30), 
    identity VARCHAR(30),                  
    email VARCHAR,
    password VARCHAR
    );
    drop table if exists books CASCADE;
    create table books (
        ID SERIAL PRIMARY KEY,
        isbn VARCHAR,
        available BOOLEAN
    );
    drop table if exists bookChecked CASCADE;
    CREATE TABLE bookChecked ( ID SERIAL PRIMARY KEY,
        user_id integer REFERENCES users(id),
        book_id integer REFERENCES books(id),
        due_date DATE 
    );
    insert into users (name, email, password, identity)
    values ('Tom','test1@test.com',$1,'Librarian'), ('Jerry','test2@test.com',$1,'User'),
    ('Kiki','test3@test.com',$1,'User'), ('Momo','test4@test.com',$1,'User');
    insert into books (isbn, available) 
    values ('978-3-16-148410-0','t'), ('978-3-16-148410-1','t'), ('978-3-16-148410-2','t');
`, pwd).then(data => console.log('success seed the database'))
.catch(e => console.log('Err in seed database' + e));