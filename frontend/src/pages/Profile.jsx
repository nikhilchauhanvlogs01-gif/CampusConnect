
import React, { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
} from "lucide-react";

import "./Profile.css";

const API_URL = "http://localhost:5000/api/profile";

const defaultProfile = {
  name: "",
  email: "",
  phone: "",
  course: "",
  department: "",
  location: "",
  studentId: "",
  semester: "",
  session: "",
  college: "",
  photo: "",
};

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("campusconnect_token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load profile");
      }

      const loadedProfile = {
        ...defaultProfile,
        ...data.user,
      };

      setProfile(loadedProfile);
      setFormData(loadedProfile);

      const savedUser = JSON.parse(
        localStorage.getItem("campusconnect_user") || "{}"
      );

      localStorage.setItem(
        "campusconnect_user",
        JSON.stringify({
          ...savedUser,
          name: loadedProfile.name,
          photo: loadedProfile.photo,
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // PHOTO UPLOAD
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    setPhotoLoading(true);

    try {
      const image = await createImageBitmap(file);

      const maxWidth = 1000;
      const maxHeight = 1000;

      const scale = Math.min(
        1,
        maxWidth / image.width,
        maxHeight / image.height
      );

      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        image.close();
        throw new Error("Canvas unavailable");
      }

      context.drawImage(image, 0, 0, width, height);
      image.close();

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error("Image compression failed"));
          },
          "image/jpeg",
          0.75
        );
      });

      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result,
        }));

        setPhotoLoading(false);
      };

      reader.onerror = () => {
        setPhotoLoading(false);
        alert("Unable to read photo.");
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      setPhotoLoading(false);
      alert("Photo processing failed.");
    }

    e.target.value = "";
  };

  const handleEdit = () => {
    setFormData({ ...profile });
    setIsEditing(true);
    setError("");
  };

  // SAVE PROFILE INCLUDING PHOTO
  const handleSave = async (e) => {
    e.preventDefault();

    if (photoLoading || saving) return;

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("campusconnect_token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          course: formData.course,
          department: formData.department,
          studentId: formData.studentId,
          semester: formData.semester,
          session: formData.session,
          college: formData.college,
          photo: formData.photo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      const updatedProfile = {
        ...defaultProfile,
        ...data.user,
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);

      const savedUser = JSON.parse(
        localStorage.getItem("campusconnect_user") || "{}"
      );

      localStorage.setItem(
        "campusconnect_user",
        JSON.stringify({
          ...savedUser,
          name: updatedProfile.name,
          photo: updatedProfile.photo,
        })
      );

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
    setError("");
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "location", label: "Location", type: "text" },
    { name: "course", label: "Course", type: "text" },
    { name: "department", label: "Department", type: "text" },
    { name: "studentId", label: "Student ID", type: "text" },
    { name: "semester", label: "Semester", type: "text" },
    { name: "session", label: "Session", type: "text" },
    { name: "college", label: "College", type: "text" },
  ];

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal and academic information</p>
        </div>

        {!isEditing && (
          <button
            className="edit-profile-btn"
            type="button"
            onClick={handleEdit}
          >
            <Edit size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <p role="alert" style={{ color: "#ff7777", marginBottom: "15px" }}>
          {error}
        </p>
      )}

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Student Profile"
                className="profile-photo"
              />
            ) : (
              <UserRound size={55} />
            )}
          </div>

          <h2>{profile.name}</h2>
          <p className="profile-role">Student</p>
          <span className="profile-status">Active Student</span>

          <div className="profile-divider" />

          <p>
            <GraduationCap size={17} />
            {profile.course || "Course not added"}
          </p>

          <p>
            <MapPin size={17} />
            {profile.location || "Location not added"}
          </p>
        </div>

        <div className="profile-details">
          {isEditing ? (
            <>
              <h2>Edit Profile Information</h2>

              <form onSubmit={handleSave}>
                <div className="profile-photo-upload">
                  <div className="profile-avatar">
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt="Profile Preview"
                        className="profile-photo"
                      />
                    ) : (
                      <UserRound size={55} />
                    )}
                  </div>

                  <label
                    htmlFor="profilePhoto"
                    className="photo-upload-btn"
                  >
                    <Camera size={18} />
                    Change Photo
                  </label>

                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />

                  <small>Image will be compressed automatically.</small>

                  {photoLoading && <p>Processing photo...</p>}
                </div>

                <div className="profile-info-grid">
                  {fields.map((field) => (
                    <div className="profile-info" key={field.name}>
                      <div style={{ width: "100%" }}>
                        <label
                          htmlFor={field.name}
                          style={{
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          {field.label}
                        </label>

                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          required
                          readOnly={field.name === "email"}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #777",
                            background: "#172554",
                            color: "white",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="profile-actions">
                  <button
                    type="submit"
                    className="edit-profile-btn"
                    disabled={photoLoading || saving}
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>Personal Information</h2>

              <div className="profile-info-grid">
                <div className="profile-info">
                  <Mail />
                  <div>
                    <span>Email Address</span>
                    <h3>{profile.email}</h3>
                  </div>
                </div>

                <div className="profile-info">
                  <Phone />
                  <div>
                    <span>Phone Number</span>
                    <h3>{profile.phone || "Not added"}</h3>
                  </div>
                </div>

                <div className="profile-info">
                  <GraduationCap />
                  <div>
                    <span>Course</span>
                    <h3>{profile.course || "Not added"}</h3>
                  </div>
                </div>

                <div className="profile-info">
                  <BookOpen />
                  <div>
                    <span>Department</span>
                    <h3>{profile.department || "Not added"}</h3>
                  </div>
                </div>
              </div>

              <h2 className="academic-heading">
                Academic Information
              </h2>

              <div className="academic-grid">
                <div>
                  <span>Student ID</span>
                  <h3>{profile.studentId || "Not added"}</h3>
                </div>

                <div>
                  <span>Semester</span>
                  <h3>{profile.semester || "Not added"}</h3>
                </div>

                <div>
                  <span>Session</span>
                  <h3>{profile.session || "Not added"}</h3>
                </div>

                <div>
                  <span>College</span>
                  <h3>{profile.college || "Not added"}</h3>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
