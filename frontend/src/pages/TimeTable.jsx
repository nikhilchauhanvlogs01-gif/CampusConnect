
import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import "./TimeTable.css";

function TimeTable() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timetable = {
    Monday: [
      { time: "09:00 - 10:00", subject: "Java Programming", teacher: "Prof. Sharma", room: "Room 101" },
      { time: "10:00 - 11:00", subject: "Data Structures", teacher: "Prof. Verma", room: "Room 102" },
      { time: "11:00 - 12:00", subject: "Mathematics", teacher: "Prof. Singh", room: "Room 103" },
      { time: "12:00 - 01:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "01:00 - 02:00", subject: "DBMS", teacher: "Prof. Gupta", room: "Room 104" },
      { time: "02:00 - 03:00", subject: "Web Development", teacher: "Prof. Kumar", room: "Lab 1" },
    ],

    Tuesday: [
      { time: "09:00 - 10:00", subject: "Data Structures", teacher: "Prof. Verma", room: "Room 102" },
      { time: "10:00 - 11:00", subject: "Java Programming", teacher: "Prof. Sharma", room: "Room 101" },
      { time: "11:00 - 12:00", subject: "Operating Systems", teacher: "Prof. Mishra", room: "Room 105" },
      { time: "12:00 - 01:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "01:00 - 02:00", subject: "DBMS", teacher: "Prof. Gupta", room: "Room 104" },
      { time: "02:00 - 03:00", subject: "DSA Lab", teacher: "Prof. Verma", room: "Lab 2" },
    ],

    Wednesday: [
      { time: "09:00 - 10:00", subject: "Mathematics", teacher: "Prof. Singh", room: "Room 103" },
      { time: "10:00 - 11:00", subject: "Web Development", teacher: "Prof. Kumar", room: "Lab 1" },
      { time: "11:00 - 12:00", subject: "Java Programming", teacher: "Prof. Sharma", room: "Room 101" },
      { time: "12:00 - 01:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "01:00 - 02:00", subject: "Operating Systems", teacher: "Prof. Mishra", room: "Room 105" },
      { time: "02:00 - 03:00", subject: "DBMS Lab", teacher: "Prof. Gupta", room: "Lab 3" },
    ],

    Thursday: [
      { time: "09:00 - 10:00", subject: "Java Programming", teacher: "Prof. Sharma", room: "Room 101" },
      { time: "10:00 - 11:00", subject: "Mathematics", teacher: "Prof. Singh", room: "Room 103" },
      { time: "11:00 - 12:00", subject: "Data Structures", teacher: "Prof. Verma", room: "Room 102" },
      { time: "12:00 - 01:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "01:00 - 02:00", subject: "Web Development", teacher: "Prof. Kumar", room: "Lab 1" },
      { time: "02:00 - 03:00", subject: "DSA Lab", teacher: "Prof. Verma", room: "Lab 2" },
    ],

    Friday: [
      { time: "09:00 - 10:00", subject: "Operating Systems", teacher: "Prof. Mishra", room: "Room 105" },
      { time: "10:00 - 11:00", subject: "DBMS", teacher: "Prof. Gupta", room: "Room 104" },
      { time: "11:00 - 12:00", subject: "Java Programming", teacher: "Prof. Sharma", room: "Room 101" },
      { time: "12:00 - 01:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "01:00 - 02:00", subject: "Mathematics", teacher: "Prof. Singh", room: "Room 103" },
      { time: "02:00 - 03:00", subject: "Web Development Lab", teacher: "Prof. Kumar", room: "Lab 1" },
    ],

    Saturday: [
      { time: "09:00 - 10:00", subject: "Data Structures", teacher: "Prof. Verma", room: "Room 102" },
      { time: "10:00 - 11:00", subject: "DBMS", teacher: "Prof. Gupta", room: "Room 104" },
      { time: "11:00 - 12:00", subject: "Project Work", teacher: "Prof. Sharma", room: "Lab 2" },
    ],
  };

  return (
    <div className="timetable-page">

      <header className="tt-header">
        <h2>
          <GraduationCap size={30} />
          CampusConnect
        </h2>

        <button onClick={() => window.history.back()}>
          Back to Dashboard
        </button>
      </header>

      <main className="tt-container">

        <div className="tt-heading">
          <span>ACADEMIC SCHEDULE</span>
          <h1>My Time Table</h1>
          <p>View your weekly class schedule in one place.</p>
        </div>

        <div className="tt-stats">
          <div className="tt-stat-card">
            <CalendarDays />
            <h3>06</h3>
            <p>Working Days</p>
          </div>

          <div className="tt-stat-card">
            <BookOpen />
            <h3>06</h3>
            <p>Daily Lectures</p>
          </div>

          <div className="tt-stat-card">
            <Clock />
            <h3>09 AM</h3>
            <p>Class Starts</p>
          </div>
        </div>

        <div className="tt-day-selector">
          {days.map((day) => (
            <button
              key={day}
              className={selectedDay === day ? "active" : ""}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <section className="tt-schedule">
          <h2>{selectedDay} Schedule</h2>

          {timetable[selectedDay].map((item, index) => (
            <div
              className={`tt-class-card ${
                item.subject === "Lunch Break" ? "break-card" : ""
              }`}
              key={index}
            >
              <div className="tt-time">
                <Clock size={18} />
                <span>{item.time}</span>
              </div>

              <div className="tt-subject">
                <h3>{item.subject}</h3>
                <p>{item.teacher}</p>
              </div>

              <div className="tt-room">
                <MapPin size={17} />
                <span>{item.room}</span>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}

export default TimeTable;
