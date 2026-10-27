import React from 'react';
import './Hero.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Hero({
  totalStudents = 0,
  departmentCount = 0,
  semesterCount = 0,
  onAddStudent,
  onExportCSV,
}) {
  return (
    <section className="campus-hero" aria-label="Welcome">
      <span className="hero-blob hero-blob-1" aria-hidden="true" />
      <span className="hero-blob hero-blob-2" aria-hidden="true" />
      <span className="hero-blob hero-blob-3" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-eyebrow">{getGreeting()}</p>
        <h1 className="hero-title">Welcome to Student Portal</h1>
        <p className="hero-subtitle">
          Your command center for every student on campus. Search, filter and
          manage records in seconds.
        </p>

        <div className="hero-actions">
          <button type="button" className="hero-btn hero-btn-primary" onClick={onAddStudent}>
            + Add Student
          </button>
          <button type="button" className="hero-btn hero-btn-ghost" onClick={onExportCSV}>
            Export CSV
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>{totalStudents}</strong>
            <span>Students</span>
          </div>
          <div className="hero-stat">
            <strong>{departmentCount}</strong>
            <span>Departments</span>
          </div>
          <div className="hero-stat">
            <strong>{semesterCount}</strong>
            <span>Semesters</span>
          </div>
        </div>
      </div>
    </section>
  );
}
