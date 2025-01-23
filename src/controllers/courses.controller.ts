import { Request, Response } from 'express';

import { uploadFile } from '../utilities/utilities';
import Course from '../models/course.model';

interface UploadedFiles {
    [fieldname: string]: Express.Multer.File[];
}

// Create a new course
export const createCourse = async (req: Request, res: Response): Promise<Response> => {
    const { name, description, fee } = req.body;
    try {
        let imgUrl = null;
        let brochureUrl = null;
        
        const files = req.files as UploadedFiles;

        // Upload course image to Azure Blob Storage
        if (files && files['courseImage']) {
            const courseImage = files['courseImage'][0];
            imgUrl = await uploadFile('courseImages', courseImage);
        }

        // Upload course brochure to Azure Blob Storage
        if (files && files['courseBrochure']) {
            const courseBrochure = files['courseBrochure'][0];
            brochureUrl = await uploadFile('courseBrochures', courseBrochure);
        }

        // Sync the Course model
        Course.sync({ alter: true });

        // Create a new course record
        const newCourse = await Course.create({
            name,
            description,
            imgSrc: imgUrl,
            fee,
            brochureUrl
        });

        // Return success response
        return res.status(201).json({
            message: 'Course created successfully',
            data: newCourse
        });
    } catch (error) {
        console.error('Error creating course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all courses
export const getCourses = async (req: Request, res: Response): Promise<Response> => {
    try {
        const courses = await Course.findAll();
        return res.status(200).json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single course by ID
export const getCourseById = async (req: Request, res: Response): Promise<Response> => {
    const courseId = req.params.id;
    try {
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.status(200).json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a course
export const updateCourse = async (req: Request, res: Response): Promise<Response> => {
    const courseId = req.params.id;
    const { name, description, fee } = req.body;
    try {
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        let imgUrl = course.imgSrc;
        let brochureUrl = course.brochureUrl;

        const files = req.files as UploadedFiles;

        // Upload updated course image to Azure Blob Storage
        if (files && files['courseImage']) {
            const courseImage = files['courseImage'][0];
            imgUrl = await uploadFile('courseImages', courseImage);
        }

        // Upload updated course brochure to Azure Blob Storage
        if (files && files['courseBrochure']) {
            const courseBrochure = files['courseBrochure'][0];
            brochureUrl = await uploadFile('courseBrochures', courseBrochure);
        }

        await course.update({
            name,
            description,
            imgSrc: imgUrl,
            fee,
            brochureUrl
        });

        return res.status(200).json({
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response): Promise<Response> => {
    const courseId = req.params.id;
    try {
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.destroy();
        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return res.status(500).json({ message: 'Failed to delete the course' });
    }
};
