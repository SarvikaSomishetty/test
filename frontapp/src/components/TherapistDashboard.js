import React, { useState } from 'react';
import '../styles/Therapist.css';

const students = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
const themes = ['Forest', 'Underwater', 'Space', 'Turquoise', 'Yellow'];

export default function StudentList() {
  const [selectedThemes, setSelectedThemes] = useState({});

  const handleThemeChange = (student, theme) => {
    setSelectedThemes((prev) => {
      const currentThemes = prev[student] || [];
      if (currentThemes.includes(theme)) {
        return {
          ...prev,
          [student]: currentThemes.filter((t) => t !== theme),
        };
      } else {
        if (currentThemes.length < 3) {
          return {
            ...prev,
            [student]: [...currentThemes, theme],
          };
        } else {
          alert('You can select only 3 themes!');
          return prev;
        }
      }
    });
  };

  const handleSubmit = (student) => {
    const themesForStudent = selectedThemes[student] || [];
    if (themesForStudent.length !== 3) {
      alert('Please select exactly 3 themes!');
      return;
    }
    console.log('Selected Themes for', student, ':', themesForStudent);
  };

  return (
    <div className="dashboard-container">
      <h2>Therapist Dashboard</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Theme Selection</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="student-row">
              <td>{student}</td>
              <td>
                {themes.map((theme, idx) => (
                  <label key={idx} className="theme-label">
                    <input
                      type="checkbox"
                      value={theme}
                      onChange={() => handleThemeChange(student, theme)}
                      checked={(selectedThemes[student] || []).includes(theme)}
                      disabled={
                        (selectedThemes[student]?.length || 0) === 3 &&
                        !selectedThemes[student]?.includes(theme)
                      }
                    />
                    {theme}
                  </label>
                ))}
              </td>
              <td>
                <button onClick={() => handleSubmit(student)}>Save Themes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
