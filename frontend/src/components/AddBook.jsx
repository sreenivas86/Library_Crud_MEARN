import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBook = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(currentYear - 1950 + 1),
    (v, i) => 1950 + i
  );

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    publication: "",
    year: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, author, publication, year } = formData;

    if (!name || !author || !publication || !year) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/b/books", {
        ...formData,
        year: parseInt(year),
      });
      navigate("/books");
      setTimeout(() => {
              
              const toastId = toast.loading('🕒 Loading...');
            toast.update(toastId, {
              render: "✅ add  successfull!",
              type: "success",
              isLoading: false,
              autoClose: 2000,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }, 1000);
      setMessage("Book added successfully!");

      setFormData({ name: "", author: "", publication: "", year: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Book</h2>
      {message && <div className="alert alert-success">{message}</div>}
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
            placeholder="Enter book name"
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
            placeholder="Enter author's name"
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
            placeholder="Enter publication"
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
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
