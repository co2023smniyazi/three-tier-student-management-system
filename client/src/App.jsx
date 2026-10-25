import React, { useState, useMemo } from 'react';
import { useStudents } from './hooks/useStudents';
import { useTheme } from './hooks/useTheme';
import { useDebounce } from './hooks/useDebounce';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { SearchBar } from './components/SearchBar';
import { StudentTable } from './components/StudentTable';
import { StudentFormModal } from './components/StudentFormModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { exportStudentsToCSV } from './utils/csvExport';
import { api } from './api';
import './App.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Search & Filter state
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal & Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification toast state
  const [toast, setToast] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Data fetching hook
  const {
    students,
    loading,
    error,
    dbStatus,
    isWakingUp,
    stats,
    refresh,
    checkHealth,
  } = useStudents(debouncedSearch);

  // Extract unique departments and semesters for filter dropdowns
  const availableDepartments = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set).sort();
  }, [students]);

  const availableSemesters = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.semester) set.add(s.semester);
    });
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(String(a).match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(String(b).match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  }, [students]);

  // Client-side filtering and sorting
  const processedStudents = useMemo(() => {
    let result = [...students];

    // Filter by department
    if (departmentFilter) {
      result = result.filter(
        (s) => s.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }

    // Filter by semester
    if (semesterFilter) {
      result = result.filter(
        (s) => s.semester?.toLowerCase() === semesterFilter.toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, departmentFilter, semesterFilter, sortBy, sortOrder]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refresh(), checkHealth()]);
      showToast('success', 'Data and health status refreshed.');
    } catch {
      showToast('error', 'Failed to refresh data from server.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle sort order or field
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchInput('');
    setDepartmentFilter('');
    setSemesterFilter('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const success = exportStudentsToCSV(
      processedStudents,
      `campusconnect-students-${new Date().toISOString().slice(0, 10)}.csv`
    );
    if (success) {
      showToast('success', `Exported ${processedStudents.length} student records to CSV.`);
    } else {
      showToast('error', 'No student records available to export.');
    }
  };

  // Open add student modal
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  // Open edit student modal
  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  // Close form modal
  const handleCloseForm = () => {
    if (!isSubmitting) {
      setIsFormOpen(false);
      setEditingStudent(null);
    }
  };

  // Submit form (create or edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        const idToUpdate = editingStudent._id || editingStudent.studentId;
        await api.updateStudent(idToUpdate, formData);
        showToast('success', `Student "${formData.name}" updated successfully!`);
      } else {
        await api.createStudent(formData);
        showToast('success', `Student "${formData.name}" added successfully!`);
      }
      setIsFormOpen(false);
      setEditingStudent(null);
      refresh();
    } catch (err) {
      showToast('error', err.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirm dialog
  const handleOpenDelete = (student) => {
    setStudentToDelete(student);
    setIsConfirmOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      const idToDelete = studentToDelete._id || studentToDelete.studentId;
      await api.deleteStudent(idToDelete);
      showToast('success', `Student "${studentToDelete.name}" deleted.`);
      setIsConfirmOpen(false);
      setStudentToDelete(null);
      refresh();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete student.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      <Header
        dbStatus={dbStatus}
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddStudent={handleOpenAdd}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="main-content" id="main-content">
        <StatsCards stats={stats} loading={loading && students.length === 0} />

        <SearchBar
          search={searchInput}
          onSearchChange={setSearchInput}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          semesterFilter={semesterFilter}
          onSemesterChange={setSemesterFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={handleToggleSortOrder}
          departments={availableDepartments}
          semesters={availableSemesters}
          totalCount={students.length}
          filteredCount={processedStudents.length}
          onExportCSV={handleExportCSV}
          onResetFilters={handleResetFilters}
        />

        <StudentTable
          students={processedStudents}
          loading={loading}
          isWakingUp={isWakingUp}
          error={error}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onClearFilters={handleResetFilters}
          onAddStudent={handleOpenAdd}
          onRetry={handleRefresh}
          hasActiveFilters={Boolean(searchInput || departmentFilter || semesterFilter)}
        />
      </main>

      <Footer />

      {/* Modals & Portals */}
      <StudentFormModal
        isOpen={isFormOpen}
        isEditing={Boolean(editingStudent)}
        initialData={editingStudent}
        onSubmit={handleFormSubmit}
        onClose={handleCloseForm}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        student={studentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setIsConfirmOpen(false);
            setStudentToDelete(null);
          }
        }}
        isConfirming={isDeleting}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
