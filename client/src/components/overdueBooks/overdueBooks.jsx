import React, { useEffect, useState } from 'react';
import './overdueBooks.scss';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const OverdueBooks = ({ currentUser }) => {
    const [books, setBooks] = useState([])
    const [isFetching, setFetching] = useState(false)
    useEffect(() => {
        setFetching(true);
        fetch(`http://localhost:3001/api/getAllOverdues`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(data => data.json())
            .then((data) => {
                if (data.length > 0) {
                    setBooks([...data]);
                }
                setFetching(false)
            })
            .catch(e => console.log(e))
        return (() => setFetching(false));
    }, [])
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
                                        <th>{book.uid}</th>
                                        <th>{book.uname}</th>
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
export default connect(mapStateToProps)(OverdueBooks);