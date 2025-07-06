import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand me-5" to="/">
          📚 SV Library
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#libraryNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="libraryNavbar">
          <ul className="navbar-nav ms-auto d-flex flex-row gap-4">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" end>
                Library
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/students" className="nav-link">
                👨‍🎓Students
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/books" className="nav-link">
                📚 Books
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
