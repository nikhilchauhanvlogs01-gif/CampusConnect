import "./Assignments.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Users,
  ClipboardCheck,
  ArrowLeft,
} from "lucide-react";

import "./AdminAttendance.css";

function AdminAttendance() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem("campusconnect_token");

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          setMessage("Session expired. Please login again.");
          return;
        }

        if (!response.ok) {
          setMessage(
            data.message || "Unable to load students"
          );
          return;
        }

        setStudents(data.students || []);
      } catch (error) {
        setMessage("Backend connection failed");
      } finally {
        setFetching(false);
      }
    };

    fetchStudents();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!studentId || !subject.trim() || !date) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/attendance/mark",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            subject: subject.trim(),
            date,
            status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Attendance saved successfully!");
        setSubject("");
      } else {
        setMessage(data.message || "Unable to save attendance");
      }
    } catch (error) {
      setMessage("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-attendance-page">
      <header className="admin-header">
        <div className="admin-brand">
          <ClipboardCheck size={28} />
          <h2>CampusConnect Admin</h2>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <span className="admin-tag">ADMIN PANEL</span>
          <h1>Mark Student Attendance</h1>
          <p>Manage student attendance records</p>
        </div>

        <div className="attendance-form-card">
          <div className="form-title">
            <ClipboardCheck size={24} />
            <h2>Attendance Details</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <Users size={18} />
                Select Student
              </label>

              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                disabled={fetching || students.length === 0}
              >
                <option value="">
                  {fetching
                    ? "Loading students..."
                    : "Choose Student"}
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <ClipboardCheck size={18} />
                Subject
              </label>

              <input
                type="text"
                placeholder="Enter subject name"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <CalendarDays size={18} />
                Attendance Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <ClipboardCheck size={18} />
                Attendance Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <button
              type="submit"
              className="save-attendance-button"
              disabled={loading || fetching || students.length === 0}
            >
              {loading ? "Saving Attendance..." : "Save Attendance"}
            </button>

            {message && (
              <div className="attendance-message">
                {message}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminAttendance;
