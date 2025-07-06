import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditBook = () => {
  const navigate=useNavigate();
  
  const {id}= useParams();
  const bookId=id;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => 1950 + i);

  const [formData, setFormData] = useState({
    name: '',
    author: '',
    publication: '',
    year: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (bookId) {
      fetchBook(bookId);
    }
  }, [bookId]);

  const fetchBook = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/b/books/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching book:", err);
      toast.error(" Book not found")
      setError("Book not found.");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, author, publication, year } = formData;

    if (!name || !author || !publication || !year) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/b/books/${bookId}`, {
        name,
        author,
        publication,
        year: parseInt(year)
      });

      setTimeout(() => {
        navigate('/books')
        const toastId = toast.loading('🕒 Loading...');
      toast.update(toastId, {
        render: "✅ update successfull!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }, 1000);
      
      
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update book. ")
      setError("Failed to update book.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Book</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Publication</label>
          <input
            type="text"
            className="form-control"
            name="publication"
            value={formData.publication}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Year</label>
          <select
            className="form-select"
            name="year"
            value={formData.year}
            onChange={handleChange}
          >
            <option value="">-- Select Year --</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">Update Book</button>
      </form>
    </div>
  );
};

export default EditBook;
