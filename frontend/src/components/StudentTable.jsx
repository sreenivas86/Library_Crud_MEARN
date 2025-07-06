import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StudentTable = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ name: "", className: "" });
  const [classOptions, setClassOptions] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    fetchStudents();
  }, [page, sortBy, order, filters]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/s/classes")
      .then((res) => setClassOptions(res.data))
      .catch((err) => console.error("Class list error", err));
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/s/students", {
        params: {
          page,
          limit: 5,
          sortBy,
          order,
          name: filters.name,
          className: filters.className,
        },
      });
      setStudents(res.data.students);
      setMeta(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/s/students/${id}`);
      toast.success("Deleted Successfully")
      setStudents(students.filter((s) => {
        s._id !== id
        
      }));
     
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };
  const handleUpdate = (id) => {
    navigate(`/student/edit/${id}`);
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-primary mb-3 mt-3"
        onClick={() => navigate("/student/add")}
      >
        ➕ Add Student
      </button>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search Name"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <select
          className="form-select"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, className: e.target.value }))
          }
        >
          <option value="">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th
                  onClick={() => toggleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name ⬍
                </th>
                <th
                  onClick={() => toggleSort("className")}
                  style={{ cursor: "pointer" }}
                >
                  Class ⬍
                </th>
                <th>Image</th>
                <th>Video</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1 + (meta.currentPage - 1) * 5}</td>
                  <td>{s.name}</td>
                  <td>{s.className}</td>
                  <td>
                    {s.imagePath ? (
                      <img
                        src={`http://localhost:5000/${s.imagePath}`}
                        alt="student"
                        width="80"
                        height="80"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {s.videoPath ? (
                      <video width="160" controls>
                        <source
                          src={`http://localhost:5000/${s.videoPath}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleUpdate(s._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!meta.hasPrevPage}
              className="btn btn-primary"
            >
              ◀ Prev
              
            </button>
            <span>
              Page {meta.currentPage} of {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.hasNextPage}
              className="btn btn-primary"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentTable;
