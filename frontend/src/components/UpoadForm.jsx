import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UploadForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    className: '',
    image: null,
    video: null
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('className', formData.className);
    payload.append('image', formData.image);
    payload.append('video', formData.video);

    try {
      const res = await axios.post('http://localhost:5000/s/add', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResponse(res.data);
      
      setTimeout(() => {
        navigate(`/students`)
        const toastId = toast.loading('🕒 Loading...');
      toast.update(toastId, {
        render: "✅  Student added successfull!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }, 1000);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Upload failed');
      setResponse(null);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Upload Student Data</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Student Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Class</label>
          <input
            type="text"
            name="className"
            className="form-control"
            value={formData.className}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Video</label>
          <input
            type="file"
            name="video"
            className="form-control"
            accept="video/*"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Upload</button>
      </form>

      {response && (
        <div className="alert alert-success mt-3">
          <strong>Success:</strong> {JSON.stringify(response.message)}
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-3">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
