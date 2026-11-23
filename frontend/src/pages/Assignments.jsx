
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Plus,
  CalendarDays,
  FileText,
  Clock,
  Search,
  X,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "./Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
  });

  const token = localStorage.getItem("campusconnect_token");

  let user = {};
  try {
    user = JSON.parse(
      localStorage.getItem("campusconnect_user") || "{}"
    );
  } catch {
    user = {};
  }

  const isAdmin = user.role === "admin";

  const fetchAssignments = async () => {
    try {
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/assignments/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments(response.data.assignments || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/assignments/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Assignment published successfully!");

      setFormData({
        title: "",
        description: "",
        subject: "",
        dueDate: "",
      });

      setShowForm(false);
      setLoading(true);
      await fetchAssignments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to create assignment."
      );
    }
  };

  const filteredAssignments = assignments.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(value) ||
      item.subject?.toLowerCase().includes(value) ||
      item.description?.toLowerCase().includes(value)
    );
  });

  const getDateStatus = (date) => {
    const due = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due < today) return "Overdue";
    if (due.getTime() === today.getTime()) return "Due Today";
    return "Upcoming";
  };

  return (
    <div className="assignment-dashboard">

      {/* Top Header */}
      <header className="assignment-topbar">
        <div className="assignment-brand">
          <div className="assignment-brand-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <h2>CampusConnect</h2>
            <span>Smart College Management</span>
          </div>
        </div>

        <div className="assignment-user">
          <div className="assignment-avatar">
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{user.name || "User"}</strong>
            <span>{isAdmin ? "Administrator" : "Student"}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="assignment-main">

        <div className="assignment-welcome">
          <div>
            <span className="assignment-eyebrow">
              ACADEMIC MANAGEMENT
            </span>

            <h1>Assignments</h1>

            <p>
              Manage your academic tasks and stay ahead
              of your deadlines.
            </p>
          </div>

          {isAdmin && (
            <button
              className="assignment-create-btn"
              onClick={() => setShowForm(true)}
            >
              <Plus size={19} />
              Create Assignment
            </button>
          )}
        </div>

        {/* Statistics */}
        <section className="assignment-stats">

          <div className="assignment-stat-card">
            <div className="assignment-stat-icon purple">
              <BookOpen size={23} />
            </div>
            <div>
              <span>Total Assignments</span>
              <h2>{assignments.length}</h2>
            </div>
          </div>

          <div className="assignment-stat-card">
            <div className="assignment-stat-icon blue">
              <Clock size={23} />
            </div>
            <div>
              <span>Upcoming</span>
              <h2>
                {assignments.filter(
                  (a) => getDateStatus(a.dueDate) === "Upcoming"
                ).length}
              </h2>
            </div>
          </div>

          <div className="assignment-stat-card">
            <div className="assignment-stat-icon orange">
              <AlertCircle size={23} />
            </div>
            <div>
              <span>Due Today</span>
              <h2>
                {assignments.filter(
                  (a) => getDateStatus(a.dueDate) === "Due Today"
                ).length}
              </h2>
            </div>
          </div>

          <div className="assignment-stat-card">
            <div className="assignment-stat-icon green">
              <CheckCircle2 size={23} />
            </div>
            <div>
              <span>Published</span>
              <h2>{assignments.length}</h2>
            </div>
          </div>

        </section>

        {/* Assignment List Header */}
        <section className="assignment-content">

          <div className="assignment-section-header">
            <div>
              <h2>All Assignments</h2>
              <p>Explore and manage your coursework</p>
            </div>

            <div className="assignment-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search assignments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="assignment-error">
              <AlertCircle size={19} />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="assignment-empty">
              <div className="assignment-loader"></div>
              <p>Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="assignment-empty">
              <div className="empty-icon">
                <ClipboardList size={35} />
              </div>
              <h3>No Assignments Found</h3>
              <p>
                {search
                  ? "Try another search keyword."
                  : "Assignments will appear here once published."}
              </p>
            </div>
          ) : (
            <div className="assignment-grid">
              {filteredAssignments.map((assignment) => {
                const status = getDateStatus(assignment.dueDate);

                return (
                  <article
                    className="assignment-item"
                    key={assignment._id}
                  >
                    <div className="assignment-item-top">
                      <div className="assignment-subject-icon">
                        <FileText size={23} />
                      </div>

                      <span className={`assignment-status ${status.toLowerCase().replace(" ", "-")}`}>
                        {status}
                      </span>
                    </div>

                    <span className="assignment-subject">
                      {assignment.subject}
                    </span>

                    <h3>{assignment.title}</h3>

                    <p className="assignment-description">
                      {assignment.description}
                    </p>

                    <div className="assignment-item-footer">
                      <div>
                        <CalendarDays size={17} />
                        <span>
                          {new Date(
                            assignment.dueDate
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <span className="assignment-author">
                        {assignment.createdBy?.name || "Admin"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Create Assignment Modal */}
      {showForm && isAdmin && (
        <div
          className="assignment-modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="assignment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="assignment-modal-header">
              <div>
                <h2>Create Assignment</h2>
                <p>Fill in the details to publish a new task.</p>
              </div>

              <button
                className="assignment-close-btn"
                onClick={() => setShowForm(false)}
                type="button"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Assignment Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter assignment title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject name"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Write assignment instructions..."
                value={formData.description}
                onChange={handleChange}
                required
              />

              <label>Submission Deadline</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />

              <div className="assignment-modal-actions">
                <button
                  type="button"
                  className="assignment-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="assignment-publish-btn"
                >
                  <Plus size={18} />
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Assignments;
