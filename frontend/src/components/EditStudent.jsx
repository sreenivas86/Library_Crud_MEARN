import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditStudent = ( ) => {

  const navigate=useNavigate();

  const {id}=useParams();
  let studentId=id;
  const [formData, setFormData] = useState({
    name: '',
    className: '',
  });
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/s/students/${studentId}`);
      setFormData({
        name: res.data.name,
        className: res.data.className,
      });
    } catch (err) {
      console.error("Error fetching student:", err);
      setError("Student not found.");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('className', formData.className);
    if (image) data.append('image', image);
    if (video) data.append('video', video);

    try {
      await axios.put(`http://localhost:5000/s/students/${studentId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setTimeout(() => {
       navigate('/students')
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
      setError("Failed to update student.");
    }
  };

  return (
    <div className="card card-body mb-4">
      <h4>Edit Student</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Class</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label>Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            className="form-control"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-success">Update</button>
      </form>
    </div>
  );
};

export default EditStudent;
