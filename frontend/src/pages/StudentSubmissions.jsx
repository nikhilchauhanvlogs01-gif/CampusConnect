
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Send,
  Clock,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./StudentSubmissions.css";

const API = "http://localhost:5000/api";

function StudentSubmissions() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState("");

  const token = localStorage.getItem("campusconnect_token");

  const fetchData = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [assignmentResponse, submissionResponse] =
        await Promise.all([
          fetch(`${API}/assignments/all`, { headers }),
          fetch(`${API}/submissions/my`, { headers }),
        ]);

      const assignmentData = await assignmentResponse.json();
      const submissionData = await submissionResponse.json();

      if (!assignmentResponse.ok) {
        throw new Error(
          assignmentData.message || "Unable to load assignments"
        );
      }

      if (!submissionResponse.ok) {
        throw new Error(
          submissionData.message || "Unable to load submissions"
        );
      }

      setAssignments(
        Array.isArray(assignmentData)
          ? assignmentData
          : assignmentData.assignments || []
      );

      setSubmissions(
        Array.isArray(submissionData)
          ? submissionData
          : submissionData.submissions || []
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();
  }, []);

  const getSubmission = (assignmentId) => {
    return submissions.find(
      (item) =>
        String(item.assignment?._id || item.assignment) ===
        String(assignmentId)
    );
  };

  const handleSubmit = async (assignmentId) => {
    const answer = (answers[assignmentId] || "").trim();

    if (!answer) {
      toast.error("Please write your answer first");
      return;
    }

    try {
      setSubmitting(assignmentId);

      const response = await fetch(`${API}/submissions/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignmentId,
          answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      toast.success("Assignment submitted successfully!");
      setAnswers((prev) => ({
        ...prev,
        [assignmentId]: "",
      }));

      await fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting("");
    }
  };

  if (loading) {
    return (
      <div className="student-submissions-page">
        <h2>Loading Assignments...</h2>
      </div>
    );
  }

  return (
    <div className="student-submissions-page">
      <header className="submission-header">
        <button
          className="submission-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={19} />
          Dashboard
        </button>

        <h1>
          <ClipboardList size={30} />
          Assignment Submissions
        </h1>

        <p>View assignments and submit your answers.</p>
      </header>

      <main className="submission-container">
        <div className="submission-summary">
          <div>
            <BookOpen />
            <h3>{assignments.length}</h3>
            <p>Total Assignments</p>
          </div>

          <div>
            <CheckCircle />
            <h3>{submissions.length}</h3>
            <p>Submitted</p>
          </div>

          <div>
            <Clock />
            <h3>
              {Math.max(0, assignments.length - submissions.length)}
            </h3>
            <p>Remaining</p>
          </div>
        </div>

        <h2 className="submission-section-title">
          Available Assignments
        </h2>

        {assignments.length === 0 ? (
          <div className="submission-empty">
            <ClipboardList size={45} />
            <h3>No Assignments Available</h3>
            <p>New assignments will appear here when published.</p>
          </div>
        ) : (
          <div className="submission-grid">
            {assignments.map((assignment) => {
              const submission = getSubmission(assignment._id);
              const isSubmitted = Boolean(submission);

              return (
                <div
                  className="submission-card"
                  key={assignment._id}
                >
                  <div className="submission-card-top">
                    <span className="submission-subject">
                      {assignment.subject}
                    </span>

                    <span
                      className={
                        isSubmitted
                          ? "submission-status submitted"
                          : "submission-status pending"
                      }
                    >
                      {submission?.status || "Pending"}
                    </span>
                  </div>

                  <h3>{assignment.title}</h3>

                  <p className="submission-description">
                    {assignment.description}
                  </p>

                  <div className="submission-due">
                    <Clock size={16} />
                    Due:{" "}
                    {new Date(assignment.dueDate).toLocaleDateString(
                      "en-IN"
                    )}
                  </div>

                  {isSubmitted ? (
                    <div className="submitted-answer">
                      <h4>
                        <CheckCircle size={17} />
                        Your Answer Submitted
                      </h4>

                      <p>{submission.answer}</p>

                      <span>
                        Status: {submission.status}
                      </span>

                      {submission.feedback && (
                        <div className="submission-feedback">
                          <strong>Admin Feedback:</strong>
                          <p>{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="submission-answer-form">
                      <label htmlFor={`answer-${assignment._id}`}>
                        Write Your Answer
                      </label>

                      <textarea
                        id={`answer-${assignment._id}`}
                        placeholder="Write your assignment answer here..."
                        value={answers[assignment._id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [assignment._id]: e.target.value,
                          }))
                        }
                        rows={5}
                      />

                      <button
                        onClick={() => handleSubmit(assignment._id)}
                        disabled={submitting === assignment._id}
                      >
                        <Send size={17} />
                        {submitting === assignment._id
                          ? "Submitting..."
                          : "Submit Assignment"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentSubmissions;
