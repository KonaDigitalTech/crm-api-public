import express from 'express';
import multer from 'multer';

import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/courses.controller';

const router = express.Router();

// Set up multer middleware
const upload = multer({ dest: 'uploads/' });

// Create a new course
router.post('/', upload.fields([{ name: 'courseImage', maxCount: 1 }, { name: 'courseBrochure', maxCount: 1 }]), createCourse);

// Get all courses
router.get('/', getCourses);

// Get a single course by ID
router.get('/:id', getCourseById);

// Update a course
router.put('/:id', upload.fields([{ name: 'courseImage', maxCount: 1 }, { name: 'courseBrochure', maxCount: 1 }]), updateCourse);

// Delete a course
router.delete('/:id', deleteCourse);

export default router;