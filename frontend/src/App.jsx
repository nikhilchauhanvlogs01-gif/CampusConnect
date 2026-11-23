
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import TimeTable from "./pages/TimeTable";
import StudentSubmissions from "./pages/StudentSubmissions";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminPanel from "./pages/AdminPanel";

import "./App.css";

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">CampusConnect</Link>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/signup" className="signup-btn">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>
            Smart Campus
            <br />
            <span>Management System</span>
          </h1>

          <p>
            Manage your academic life smarter with CampusConnect.
            Access attendance, assignments, timetable and student
            information from one platform.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="primary-btn">
              Get Started
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="dashboard-preview">
            <h3>Campus Dashboard</h3>
            <p>Welcome to CampusConnect</p>

            <div className="preview-cards">
              <div>
                <h2>85%</h2>
                <p>Attendance</p>
              </div>

              <div>
                <h2>12</h2>
                <p>Assignments</p>
              </div>

              <div>
                <h2>6</h2>
                <p>Subjects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Our Features</h2>

        <p className="section-description">
          Everything you need to manage your college activities.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Attendance Management</h3>
            <p>
              Track attendance records and monitor your attendance
              percentage.
            </p>
          </div>

          <div className="feature-card">
            <h3>Assignments</h3>
            <p>
              View assignments, deadlines and submit your academic work.
            </p>
          </div>

          <div className="feature-card">
            <h3>Smart Timetable</h3>
            <p>
              Access your daily class schedule in one place.
            </p>
          </div>

          <div className="feature-card">
            <h3>Student Profile</h3>
            <p>
              Manage your personal and academic information.
            </p>
          </div>

          <div className="feature-card">
            <h3>Secure Login</h3>
            <p>
              Secure authentication with role-based access.
            </p>
          </div>

          <div className="feature-card">
            <h3>Assignment Submissions</h3>
            <p>
              Submit your answers and check submission status.
            </p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2>About CampusConnect</h2>

        <p>
          CampusConnect is a smart college management platform
          designed to simplify academic activities for students
          and administrators. It brings important college
          services together in one convenient place.
        </p>
      </section>

      <footer className="footer">
        <h3>CampusConnect</h3>
        <p>Smart College Management System</p>
        <p>© 2026 CampusConnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Student Pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/timetable" element={<TimeTable />} />

        <Route
          path="/student-submissions"
          element={<StudentSubmissions />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
