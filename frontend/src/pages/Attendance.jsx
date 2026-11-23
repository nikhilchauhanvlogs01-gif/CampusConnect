
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  GraduationCap,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
} from "lucide-react";

import "./Attendance.css";

function Attendance() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("campusconnect_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/attendance/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch attendance");
        }

        setRecords(data.records || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [navigate]);

  const totalClasses = records.length;

  const totalPresent = records.filter(
    (record) => record.status === "Present"
  ).length;

  const totalAbsent = totalClasses - totalPresent;

  const percentage =
    totalClasses === 0
      ? 0
      : Math.round((totalPresent / totalClasses) * 100);

  const subjectAttendance = Object.values(
    records.reduce((groups, record) => {
      const subject = record.subject;

      if (!groups[subject]) {
        groups[subject] = {
          name: subject,
          present: 0,
          total: 0,
        };
      }

      groups[subject].total += 1;

      if (record.status === "Present") {
        groups[subject].present += 1;
      }

      return groups;
    }, {})
  );

  return (
    <div className="attendance-page">

      <header className="attendance-header">
        <h2>
          <GraduationCap size={30} />
          CampusConnect
        </h2>

        <button onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={18} />
          Dashboard
        </button>
      </header>

      <main className="attendance-content">

        <div className="attendance-welcome">
          <h1>My Attendance</h1>
          <p>Track your academic attendance and progress.</p>
        </div>

        {loading ? (
          <p>Loading attendance records...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className="attendance-summary">

              <div className="attendance-summary-card">
                <CalendarDays />
                <h3>{percentage}%</h3>
                <p>Overall Attendance</p>
              </div>

              <div className="attendance-summary-card">
                <CheckCircle />
                <h3>{totalPresent}</h3>
                <p>Present Classes</p>
              </div>

              <div className="attendance-summary-card">
                <XCircle />
                <h3>{totalAbsent}</h3>
                <p>Absent Classes</p>
              </div>

              <div className="attendance-summary-card">
                <Clock />
                <h3>{totalClasses}</h3>
                <p>Total Classes</p>
              </div>

            </div>

            <section className="attendance-section">
              <h2>
                <BookOpen />
                Subject-wise Attendance
              </h2>

              {subjectAttendance.length === 0 ? (
                <p>No attendance records available yet.</p>
              ) : (
                subjectAttendance.map((subject) => {
                  const percent = Math.round(
                    (subject.present / subject.total) * 100
                  );

                  return (
                    <div className="subject-card" key={subject.name}>

                      <div className="subject-info">
                        <h3>{subject.name}</h3>
                        <span>{percent}%</span>
                      </div>

                      <div className="attendance-progress">
                        <div
                          className="attendance-progress-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <p>
                        {subject.present} Present / {subject.total} Classes
                      </p>

                    </div>
                  );
                })
              )}
            </section>

            <section className="attendance-section">
              <h2>Attendance History</h2>

              {records.map((record) => (
                <div
                  className="subject-card"
                  key={record._id}
                >
                  <div className="subject-info">
                    <h3>{record.subject}</h3>
                    <span>{record.status}</span>
                  </div>

                  <p>
                    {new Date(record.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </section>
          </>
        )}

      </main>
    </div>
  );
}

export default Attendance;
