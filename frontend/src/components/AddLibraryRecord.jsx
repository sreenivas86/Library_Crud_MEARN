import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddLibraryRecord = () => {
  const navigate=useNavigate();
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    bookName: '',
    startDate: '',
    endDate: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch students and books on load
  useEffect(() => {
    fetchStudents();
    fetchBooks();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/s/all');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/b/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { studentName, bookName, startDate, endDate } = formData;

    if (!studentName || !bookName || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/l/library', {
        studentName,
        bookName,
        startDate,
        endDate
      });
      setTimeout(() => {
        navigate('/')
        const toastId = toast.loading('🕒 Loading...');
      toast.update(toastId, {
        render: "✅ Added successfull!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }, 1000);
      setMessage("Library record added successfully!");
      
      setFormData({ studentName: '', bookName: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error("Error adding library record:", err);
      setError("Failed to add record.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Library Record</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Student Select */}
        <div className="mb-3">
          <label className="form-label">Student</label>
          <select
            className="form-select"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
          >
            <option value="">-- Select Student --</option>
            {students.map(student => (
              <option key={student._id} value={student.name}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Book Select */}
        <div className="mb-3">
          <label className="form-label">Book</label>
          <select
            className="form-select"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
          >
            <option value="">-- Select Book --</option>
            {books.map(book => (
              <option key={book._id} value={book.name}>
                {book.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        {/* End Date */}
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Record</button>
      </form>
    </div>
  );
};

export default AddLibraryRecord;
