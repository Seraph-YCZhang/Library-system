import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FormInput from '../form-input/form-input';
import './books.scss';

const Books = ({ currentUser }) => {
    const [books, setBooks] = useState([])
    const [isFetching, setFetching] = useState(false)
    const [refetch, setRefetch] = useState(false);
    const [isbn, setIsbn] = useState('');
    const  [err, setErr] = useState('');
    useEffect(() => {
        setFetching(true);
        fetch(`http://localhost:3001/api/getAllBooks`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(data => data.json())
            .then((data) => {
                setBooks([...data.data]);
                setFetching(false)
            })
            .catch(e => console.log(e))
        return (() => setFetching(false));
    }, [refetch])
    const handleCheck = (e) => {
        const bookId = e.currentTarget.parentNode.parentNode.getAttribute('data-key');
        fetch(`http://localhost:3001/api/checkABook`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                book_id: bookId,
                user_id: currentUser.data.id
            })
        }).then((response) => {
            if(response.status===400) {
                setErr(response)
            }
            if (response.ok) {
                setRefetch(!refetch);
            }
        })
            .catch(e => console.log(e));
    }
    const handleSubmit = () => {
        fetch(`http://localhost:3001/api/addBook`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                ISBN: isbn
            })
        }).then((response) => {
            if (response.ok) {
                setRefetch(!refetch);
                setIsbn('');
            }
        })
            .catch(e => console.log(e));
    }

    const handleDelete = (e) => {
        const bookId = e.currentTarget.parentNode.parentNode.getAttribute('data-key');
        fetch(`http://localhost:3001/api/deleteBook`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                book_id: bookId,
            })
        }).then((response) => {
            if (response.ok) {
                setRefetch(!refetch);
            }
        })
            .catch(e => console.log(e));
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setIsbn(value);
    }
    return (
        <div>
            {err?<div>{err.statusText}</div>:''}
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
                                <th>{book.available === true ? 'True' : 'False'}</th>
                                <th>
                                {
                                    currentUser ? <button onClick={handleCheck}>Check</button> : ''
                                }
                                </th>
                                <th>
                                {
                                    currentUser && currentUser.data.role === 'Librarian' ? (<button onClick={handleDelete}>Delete</button>) : ''
                                }
                                </th>
                            </tr>
                            

                        )
                    })
            }
            </tbody>
            </table>
            
            {
                currentUser && currentUser.data.role === 'Librarian' ?
                    <form className='add-book-form' onSubmit={handleSubmit}>
                        <FormInput
                            type='text'
                            name='isbn'
                            value={isbn}
                            onChange={handleChange}
                            label='Add A Book By its ISBN'
                            required
                        />
                        <button type='submit'>Add</button>
                    </form>
                    :
                    ''
            }

            
        </div>
    )
}

const mapStateToProps = (state) => {
    const { user } = state;
    return {
        currentUser: user.currentUser
    }
}
export default connect(mapStateToProps)(Books);