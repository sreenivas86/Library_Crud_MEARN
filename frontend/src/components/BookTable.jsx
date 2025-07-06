import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';


const BookTable = () => {
  const navigate=useNavigate();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [meta, setMeta] = useState({
    totalBooks: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  

  const limit = 8;

  useEffect(() => {
    fetchBooks();
  }, [page, sortBy, order, search]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/b/bookp', {
        params: { page, limit, name: search, sortBy, order }
      });
      setBooks(res.data.books);
      setMeta(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5000/b/books/${id}`);
      fetchBooks(); // refresh after delete
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  

  

  const handleEdit = (id) => {
    navigate(`/book/edit/${id}`)
  };

  const getSortArrow = (field) => {
    return sortBy === field ? (order === 'asc' ? '↑' : '↓') : '';
  };

  return (
    <div className="container mt-4">
      
      <button
        className="btn btn-primary mb-3 mt-3"
        onClick={() => navigate('/book/add') }
      >
        ➕ Add Book
      </button>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search book name..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
              Name {getSortArrow('name')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('author')}>
              Author {getSortArrow('author')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('publication')}>
              Publication {getSortArrow('publication')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('year')}>
              Year {getSortArrow('year')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books !=null ? (
            books.map((book, index) => (
              <tr key={book._id}>
                <td>{index + 1 + (meta.currentPage - 1) * limit}</td>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{book.publication}</td>
                <td>{book.year}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(book._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center">No books found.</td></tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="  btn btn-light "
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={!meta.hasPrevPage}
        >
          ◀ Prev
        </button>
        <span>Page {meta.currentPage} of {meta.totalPages}</span>
        <button
          className="  btn btn-light "
          onClick={() => setPage(p => p + 1)}
          disabled={!meta.hasNextPage}
        >
          ◀ Prev
        </button>
      </div>
    </div>
  );
};

export default BookTable;
