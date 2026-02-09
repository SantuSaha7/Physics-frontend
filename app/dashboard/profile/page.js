"use client";

export default function StudentProfile() {
  return (
    <div className="profile-page">
      <h1 className="profile-title">Student Profile</h1>

      <div className="profile-box">
        <div className="profile-row">
          <span>Name</span>
          <strong>Student Name</strong>
        </div>

        <div className="profile-row">
          <span>Student ID</span>
          <strong>STU12345</strong>
        </div>

        <div className="profile-row">
          <span>Class</span>
          <strong>11 (Physics)</strong>
        </div>

        <div className="profile-row">
          <span>Total Mock Tests</span>
          <strong>5</strong>
        </div>

        <div className="profile-row">
          <span>Average Score</span>
          <strong>72%</strong>
        </div>
      </div>
    </div>
  );
}
