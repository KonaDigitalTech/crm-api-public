import { Request, Response } from 'express';
import EmailTemplate from '../models/email-template.model';
import User from '../models/user.model';

export const createEmailTemplate = async (req: Request, res: Response): Promise<Response> => {
    const { name, subject, htmlContent, userId } = req.body;

    try {
        // Check if an email template with the same name already exists
        const existingTemplate = await EmailTemplate.findOne({ where: { name } });
        if (existingTemplate) {
            return res.status(400).json({ message: 'An email template with the same name already exists' });
        }

        // Ensure the EmailTemplate table exists
        await EmailTemplate.sync({ alter: true });

        // Create the email template
        const newTemplate = await EmailTemplate.create({
            name,
            subject,
            htmlContent,
            userId,
        });

        return res.status(201).json({ message: 'Email template created successfully', template: newTemplate });
    } catch (error: any) {
        console.error('Error creating email template:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all email templates
export const getAllEmailTemplates = async (req: Request, res: Response): Promise<Response> => {
    try {
        const templates = await EmailTemplate.findAll({
            include: [{ model: User, as: 'createdBy' }],
        });
        return res.status(200).json({ templates });
    } catch (error: any) {
        console.error('Error fetching email templates:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get email template by ID
export const getEmailTemplateById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    try {
        const template = await EmailTemplate.findByPk(id, {
            include: [{ model: User, as: 'createdBy' }],
        });
        if (!template) {
            return res.status(404).json({ message: 'Email template not found' });
        }
        return res.status(200).json({ template });
    } catch (error: any) {
        console.error('Error fetching email template by ID:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update an email template
export const updateEmailTemplate = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    const { name, subject, htmlContent, userId } = req.body;

    try {
        const template = await EmailTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: 'Email template not found' });
        }

        template.name = name;
        template.subject = subject;
        template.htmlContent = htmlContent;
        template.userId = userId;
        await template.save();

        return res.status(200).json({ message: 'Email template updated successfully', template });
    } catch (error: any) {
        console.error('Error updating email template:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete an email template
export const deleteEmailTemplate = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);

    try {
        const template = await EmailTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: 'Email template not found' });
        }

        await template.destroy();

        return res.status(200).json({ message: 'Email template deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting email template:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};