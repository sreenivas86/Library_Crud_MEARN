import React, { useEffect, useState } from "react";
import axios from "axios";


import { useNavigate } from "react-router-dom";

const LibraryTable = () => {

  const navigate=useNavigate();
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    studentName: "",
    bookName: "",
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    order: "asc",
  });
  

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/l/librari", {
        params: filters,
      });
      setRecords(data.records);
      setMeta(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching records:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`http://localhost:5000/l/library/${id}`);
      fetchRecords(); // Refresh after deletion
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleUpdate = (id) => {
    navigate(`/library/edit/${id}`)
  };
  

  const getSortArrow = (field) => {
    return filters.sortBy === field
      ? filters.order === "asc"
        ? " ↑"
        : " ↓"
      : "";
  };

  return (
    <div>
      <button
        className="btn btn-primary mb-3 mt-3"
        onClick={() => navigate('/library/add') }
      >
        ➕ Add Library Record
      </button>

      <div className="container mt-4">
        
        

        <div className="row mb-3">
          <div className="col">
            <input
              className="form-control"
              placeholder="Search by student"
              onChange={(e) =>
                setFilters({ ...filters, studentName: e.target.value, page: 1 })
              }
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Search by book"
              onChange={(e) =>
                setFilters({ ...filters, bookName: e.target.value, page: 1 })
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th
                  onClick={() => handleSort("studentName")}
                  style={{ cursor: "pointer" }}
                >
                  Student Name {getSortArrow("studentName")}
                </th>
                <th
                  onClick={() => handleSort("bookName")}
                  style={{ cursor: "pointer" }}
                >
                  Book Name {getSortArrow("bookName")}
                </th>
                <th
                  onClick={() => handleSort("startDate")}
                  style={{ cursor: "pointer" }}
                >
                  Start Date {getSortArrow("startDate")}
                </th>
                <th
                  onClick={() => handleSort("endDate")}
                  style={{ cursor: "pointer" }}
                >
                  End Date {getSortArrow("endDate")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records != null ? (
                records.map((r, i) => (
                  <tr key={r._id}>
                    <td>{(filters.page - 1) * filters.limit + i + 1}</td>
                    <td>{r.studentName}</td>
                    <td>{r.bookName}</td>
                    <td>{new Date(r.startDate).toLocaleDateString()}</td>
                    <td>{new Date(r.endDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleUpdate(r._id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-primary"
            disabled={!meta.hasPrevPage}
            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
          >
            ◀ Prev
          </button>
          <span>
            Page {meta.currentPage} of {meta.totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            disabled={!meta.hasNextPage}
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryTable;
