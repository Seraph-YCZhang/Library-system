import React, { useEffect, useState } from 'react';
import './checkedBooks.scss';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const CheckedBooks = ({ currentUser }) => {
    const [books, setBooks] = useState([])
    const [isFetching, setFetching] = useState(false)
    const [refetch, setRefetch] = useState(false);
    useEffect(() => {
        setFetching(true);
        fetch(`http://localhost:3001/api/getAllCheckedBooks`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(data => data.json())
            .then((data) => {
                if (data.length > 0) {
                    setBooks([...data]);
                } else {
                    setBooks([]);
                }
                setFetching(false)
            })
            .catch(e => console.log(e))
        return (() => setFetching(false));
    }, [refetch])

    const handleReturn = (e) => {
        const bookId = e.currentTarget.parentNode.parentNode.getAttribute('data-key');
        fetch(`http://localhost:3001/api/returnBook`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                user_id: currentUser.data.id,
                book_id: bookId,
            })
        }).then((response) => {
            if (response.ok || response.status === 200) {
                setRefetch(!refetch);
            }
        })
            .catch(e => console.log(e));
    }
    if(!currentUser) {
        return (
            <Redirect to='/' />
        )
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ISBN</th>
                        <th>Availabel</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ? <tr><th>Loading...</th></tr> :
                            books.map((book, idx) => {

                                return (
                                    <tr key={book.id} data-key={book.id}>
                                        <th>{book.id}</th>
                                        <th>{book.isbn}</th>
                                        <th>
                                            <button onClick={handleReturn}>Return</button>
                                        </th>
                                    </tr>


                                )
                            })
                    }
                </tbody>
            </table>
        </div>
    )
};

const mapStateToProps = (state) => {
    const { user } = state;
    return {
        currentUser: user.currentUser
    }
};
export default connect(mapStateToProps)(CheckedBooks);