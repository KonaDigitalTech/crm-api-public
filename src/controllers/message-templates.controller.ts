import { Request, Response } from 'express';
import MessageTemplate from '../models/message-template.model';
import User from '../models/user.model';

// Create a new message template
export const createMessageTemplate = async (req: Request, res: Response): Promise<Response> => {
    const { name, type, content, userId } = req.body;

    try {
        // Check if a message template with the same name already exists
        const existingTemplate = await MessageTemplate.findOne({ where: { name } });
        if (existingTemplate) {
            return res.status(400).json({ message: 'A message template with the same name already exists' });
        }

        // Ensure the MessageTemplate table exists
        await MessageTemplate.sync({ alter: true });

        // Create the message template
        const newTemplate = await MessageTemplate.create({
            name,
            type,
            content,
            userId,
        });

        return res.status(201).json({ message: 'Message template created successfully', template: newTemplate });
    } catch (error: any) {
        console.error('Error creating message template:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all message templates with optional type filter
export const getAllMessageTemplates = async (req: Request, res: Response): Promise<Response> => {
    const { type } = req.query;

    try {

        const filter: any = {};

        if (type) {
            filter.type = type;
        }

        let includeOptions: any[] = [{
            model: User,
            as: 'createdBy',
            attributes: ['name', 'email', 'mobile']
        }];

        const templates = await MessageTemplate.findAll({
            where: filter,
            include: includeOptions,
        });

        return res.status(200).json({ templates });
    } catch (error: any) {
        console.error('Error fetching message templates:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get message template by ID
export const getMessageTemplateById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    try {
        const template = await MessageTemplate.findByPk(id, {
            include: [{
                model: User,
                as: 'createdBy',
                attributes: ['name', 'email', 'mobile']
            }],
        });
        if (!template) {
            return res.status(404).json({ message: 'Message template not found' });
        }
        return res.status(200).json({ template });
    } catch (error: any) {
        console.error('Error fetching message template by ID:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update a message template
export const updateMessageTemplate = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    const { name, type, content, userId } = req.body;

    try {
        const template = await MessageTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: 'Message template not found' });
        }

        template.name = name;
        template.type = type;
        template.content = content;
        template.userId = userId;
        await template.save();

        return res.status(200).json({ message: 'Message template updated successfully', template });
    } catch (error: any) {
        console.error('Error updating message template:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete a message template
export const deleteMessageTemplate = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);

    try {
        const template = await MessageTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: 'Message template not found' });
        }

        await template.destroy();

        return res.status(200).json({ message: 'Message template deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting message template:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};