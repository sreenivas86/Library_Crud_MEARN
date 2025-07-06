import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditLibraryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    bookName: '',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecord();
  }, []);

  const fetchRecord = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/l/library/${id}`);
      setFormData({
        studentName: data.studentName,
        bookName: data.bookName,
        startDate: data.startDate?.substring(0, 10),
        endDate: data.endDate?.substring(0, 10),
      });
    } catch (err) {
      console.error("Error fetching record:", err);
      setError("Failed to load record.");
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
    const { studentName, bookName, startDate, endDate } = formData;

    if (!studentName || !bookName || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/l/library/${id}`, {
        studentName,
        bookName,
        startDate,
        endDate
      });
       
      setTimeout(() => {
        navigate('/')
        const toastId = toast.loading('🕒 Loading...');
      toast.update(toastId, {
        render: "✅ Update successfull!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }, 1000);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update record.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card card-body border-warning">
        <h4>Edit Library Record</h4>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label>Student Name</label>
            <input
              type="text"
              className="form-control"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Book Name</label>
            <input
              type="text"
              className="form-control"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn btn-success">Update</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLibraryForm;
