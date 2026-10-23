import express from 'express';
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/studentService.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  const dbStatus = getDBStatus();
  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime(),
  });
});

// GET /api/students
router.get('/students', async (req, res, next) => {
  try {
    const { search } = req.query;
    const students = await listStudents(search);
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/:id
router.get('/students/:id', async (req, res, next) => {
  try {
    const student = await getStudent(req.params.id);
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/students
router.post('/students', async (req, res, next) => {
  try {
    const newStudent = await createStudent(req.body);
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/students/:id
router.put('/students/:id', async (req, res, next) => {
  try {
    const updatedStudent = await updateStudent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/students/:id
router.delete('/students/:id', async (req, res, next) => {
  try {
    const removedStudent = await deleteStudent(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: removedStudent,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
