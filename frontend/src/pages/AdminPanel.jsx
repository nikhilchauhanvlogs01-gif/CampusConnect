
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/auth/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Students Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to load students. Check admin access."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-panel">

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <GraduationCap size={30} />
          <span>CampusConnect</span>
        </div>

        <div className="admin-menu">
          <p className="admin-menu-heading">MAIN MENU</p>

          <button className="admin-menu-item active">
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="admin-menu-item"
            onClick={() => navigate("/attendance")}
          >
            <ClipboardCheck size={19} />
            Attendance
          </button>

          <button
            className="admin-menu-item"
            onClick={() => navigate("/assignments")}
          >
            <BookOpen size={19} />
            Assignments
          </button>

          <button
            className="admin-menu-item"
            onClick={() => navigate("/student-submissions")}
          >
            <FileText size={19} />
            Submissions
          </button>
        </div>

        <button className="admin-logout" onClick={logout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="admin-main">

        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your college activities</p>
          </div>

          <button
            className="admin-refresh"
            onClick={fetchStudents}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        <section className="admin-welcome">
          <div>
            <h2>Welcome, Admin!</h2>
            <p>
              Manage students, attendance, assignments and submissions
              from one place.
            </p>
          </div>
          <GraduationCap size={65} />
        </section>

        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon purple">
              <Users size={24} />
            </div>
            <p>Total Students</p>
            <h2>{loading ? "..." : students.length}</h2>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon blue">
              <ClipboardCheck size={24} />
            </div>
            <p>Attendance</p>
            <h2>Manage</h2>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon orange">
              <BookOpen size={24} />
            </div>
            <p>Assignments</p>
            <h2>Manage</h2>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon green">
              <FileText size={24} />
            </div>
            <p>Submissions</p>
            <h2>Review</h2>
          </div>

        </section>

        <section className="admin-students-section">

          <div className="admin-section-heading">
            <div>
              <h2>Student Management</h2>
              <p>Registered students in CampusConnect</p>
            </div>

            <span>{students.length} Students</span>
          </div>

          {loading ? (
            <p className="admin-message">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="admin-message">No students found.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Course</th>
                    <th>Department</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.studentId || "Not Added"}</td>
                      <td>{student.course || "Not Added"}</td>
                      <td>{student.department || "Not Added"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default AdminPanel;
