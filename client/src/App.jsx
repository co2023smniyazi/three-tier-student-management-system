import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import './App.css';

const initialFormData = {
  studentId: '',
  name: '',
  email: '',
  department: '',
  semester: '',
  contact: '',
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking');

  // Show notification banner helper
  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Fetch health status
  const checkHealth = useCallback(async () => {
    try {
      const data = await api.checkHealth();
      setDbStatus(data.database || 'connected');
    } catch {
      setDbStatus('disconnected');
    }
  }, []);

  // Fetch students
  const loadStudents = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await api.getAllStudents(query);
      setStudents(res.data || []);
    } catch (err) {
      notify('error', err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    loadStudents();
  }, [checkHealth, loadStudents]);

  // Handle Search input change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    loadStudents(val);
  };

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.studentId.trim()) return 'Student ID is required';
    if (!formData.name.trim()) return 'Student Name is required';
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      return 'A valid email address is required';
    }
    if (!formData.department.trim()) return 'Department is required';
    if (!formData.semester.trim()) return 'Semester is required';
    if (!formData.contact.trim()) return 'Contact number is required';
    return null;
  };

  // Submit create or edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      notify('error', validationError);
      return;
    }

    try {
      if (editingId) {
        await api.updateStudent(editingId, formData);
        notify('success', 'Student updated successfully!');
      } else {
        await api.createStudent(formData);
        notify('success', 'Student added successfully!');
      }

      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      loadStudents(search);
    } catch (err) {
      notify('error', err.message || 'Operation failed');
    }
  };

  // Start editing a student
  const handleEdit = (student) => {
    setEditingId(student._id || student.studentId);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      department: student.department,
      semester: student.semester,
      contact: student.contact,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit / add form
  const handleCancelForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowForm(false);
  };

  // Delete student
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"?`)) {
      return;
    }

    try {
      await api.deleteStudent(id);
      notify('success', `Student "${name}" deleted successfully!`);
      loadStudents(search);
    } catch (err) {
      notify('error', err.message || 'Failed to delete student');
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <div className="header-title">
          <h1>Student Portal</h1>
          <p>Three-Tier College Architecture (React + Express + MongoDB Atlas)</p>
        </div>
        <div className={`health-badge ${dbStatus === 'connected' ? 'connected' : 'disconnected'}`}>
          <span className="badge-dot"></span>
          Database: {dbStatus}
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button className="close-btn" onClick={() => setNotification(null)}>
            &times;
          </button>
        </div>
      )}

      {/* Action / Search Controls */}
      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID, name, or department..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm && !editingId) {
              handleCancelForm();
            } else {
              setEditingId(null);
              setFormData(initialFormData);
              setShowForm(true);
            }
          }}
        >
          {showForm && !editingId ? 'Close Form' : '+ Add New Student'}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="form-card">
          <div className="form-header">
            <h2>{editingId ? 'Edit Student Details' : 'Add New Student'}</h2>
            <button className="close-btn" onClick={handleCancelForm}>
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-group">
              <label htmlFor="studentId">Student ID *</label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="e.g. STU1001"
                value={formData.studentId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. jane.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <input
                id="semester"
                name="semester"
                type="text"
                placeholder="e.g. 5 or Semester 5"
                value={formData.semester}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number *</label>
              <input
                id="contact"
                name="contact"
                type="text"
                placeholder="e.g. +1 555-0199"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Student' : 'Save Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Student List Table */}
      <div className="table-card">
        {loading ? (
          <div className="loading-state">
            <p>Loading student records...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <h3>No Students Found</h3>
            <p>
              {search
                ? `No students matching "${search}". Try clearing the search.`
                : 'No student records in the database yet. Click "+ Add New Student" to add the first one.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id || student.studentId}>
                    <td>
                      <strong>{student.studentId}</strong>
                    </td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td>{student.semester}</td>
                    <td>{student.contact}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(student)}
                          title="Edit Student"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(student._id || student.studentId, student.name)
                          }
                          title="Delete Student"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Three-Tier Application Assignment | Frontend: Vercel | Backend: Render | DB: MongoDB Atlas | MCP Protocol Ready</p>
      </footer>
    </div>
  );
}
