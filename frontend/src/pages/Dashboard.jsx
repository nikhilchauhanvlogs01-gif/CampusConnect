
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  GraduationCap,
  UserRound,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Clock,
  Bell,
  LogOut,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [profilePhoto, setProfilePhoto] = useState("");
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("campusconnect_token");

        const savedUser = JSON.parse(
          localStorage.getItem("campusconnect_user") || "{}"
        );

        setStudentName(savedUser.name || "Student");

        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.user) {
          setStudentName(data.user.name || savedUser.name || "Student");
          setProfilePhoto(data.user.photo || "");
        }
      } catch (error) {
        console.error("Profile loading error:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("campusconnect_token");
    localStorage.removeItem("campusconnect_user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">
        <h2>
          <GraduationCap size={30} />
          CampusConnect
        </h2>

        <div
          className="dashboard-user"
          onClick={() => navigate("/profile")}
          title="View Profile"
        >
          <div className="dashboard-profile-photo">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Student Profile"
                onError={() => setProfilePhoto("")}
              />
            ) : (
              <UserRound size={23} />
            )}
          </div>

          <span>{studentName}</span>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="dashboard-content">

        {/* WELCOME */}
        <section className="dashboard-welcome">
          <h1>Welcome Back, {studentName}! 👋</h1>
          <p>
            Here's what's happening in your college today.
          </p>
        </section>

        {/* STATISTICS */}
        <section className="dashboard-stats">

          <div className="dashboard-card">
            <BookOpen />
            <h3>06</h3>
            <p>Total Subjects</p>
          </div>

          <div className="dashboard-card">
            <CalendarDays />
            <h3>85%</h3>
            <p>Attendance</p>
          </div>

          <div className="dashboard-card">
            <ClipboardList />
            <h3>04</h3>
            <p>Pending Assignments</p>
          </div>

          <div className="dashboard-card">
            <Clock />
            <h3>03</h3>
            <p>Today's Classes</p>
          </div>

        </section>

        {/* LATEST NOTICES */}
        <section className="dashboard-section">
          <h2>
            <Bell size={23} />
            Latest Notices
          </h2>

          <div className="notice-card">
            <h3>Welcome to CampusConnect</h3>
            <p>
              Stay updated with your college activities and announcements.
            </p>
          </div>

          <div className="notice-card">
            <h3>Academic Updates</h3>
            <p>
              Check your attendance, assignments and daily timetable.
            </p>
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className="dashboard-section">
          <h2>Quick Access</h2>

          <div className="quick-access">

            <button onClick={() => navigate("/profile")}>
              <UserRound size={19} />
              My Profile
            </button>

            <button onClick={() => navigate("/attendance")}>
              <CalendarDays size={19} />
              Attendance
            </button>

            <button onClick={() => navigate("/assignments")}>
              <ClipboardList size={19} />
              Assignments
            </button>

            <button onClick={() => navigate("/timetable")}>
              <Clock size={19} />
              Time Table
            </button>

          </div>
        </section>

        {/* LOGOUT */}
        <section className="dashboard-section logout-section">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
