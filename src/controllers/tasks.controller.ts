import { Request, Response } from 'express';
import Task from '../models/task.model';
import User from '../models/user.model';
import Lead from '../models/lead.model';
import Course from '../models/course.model';
import Batch from '../models/batch.model';
import Learner from '../models/learner.model';

export const createTask = async (req: Request, res: Response): Promise<Response> => {
    const { subject, dueDate, priority, userId, leadId, batchId, trainerId, campaignId, learnerId,mainTaskId } = req.body;

    try {
        await Task.sync({ alter: true });

        const newTask = await Task.create({
            subject,
            dueDate,
            priority,
            userId,
            leadId,
            batchId,
            trainerId,
            campaignId,
            learnerId,
            mainTaskId,
        });

        return res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error: any) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getAllTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { leadId, batchId, userId, trainerId, campaignId, learnerId ,mainTaskId} = req.query;

        const queryConditions: any = {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'mobile']
                },
                // {
                //     model: Lead,
                //     as: 'lead',
                //     attributes: ['name', 'techStack', 'phone', 'email'],
                //     // include: [
                //     //     {
                //     //         model: Course,
                //     //         as: 'Courses',
                //     //         attributes: ['name']
                //     //     }
                //     // ]
                // },
                {
                    model: Batch,
                    as: 'batch',
                    attributes: ['batchName']
                },
                {
                    model: Learner,
                    as: 'learner',
                    attributes: ['id', 'name']
                }
            ]
        };

        if (leadId) {
            queryConditions.where = { ...queryConditions.where, leadId };
        }
        if (batchId) {
            queryConditions.where = { ...queryConditions.where, batchId };
        }
        if (userId) {
            queryConditions.where = { ...queryConditions.where, userId };
        }
        if (trainerId) {
            queryConditions.where = { ...queryConditions.where, trainerId };
        }
        if (campaignId) {
            queryConditions.where = { ...queryConditions.where, campaignId };
        }
        if (learnerId) {
            queryConditions.where = { ...queryConditions.where, learnerId };
        }
        if (mainTaskId) {
            queryConditions.where = { ...queryConditions.where, mainTaskId };
        }

        const tasks = await Task.findAll(queryConditions);

        return res.status(200).json({ tasks });
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    try {
        const task = await Task.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'mobile']
                },
                {
                    model: Lead,
                    as: 'lead',
                    attributes: ['name', 'techStack', 'phone', 'email'],
                    include: [
                        {
                            model: Course,
                            as: 'Courses',
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: Batch,
                    as: 'batch',
                    attributes: ['batchName']
                },
                {
                    model: Learner,
                    as: 'learner',
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(200).json({ task });
    } catch (error: any) {
        console.error('Error fetching task by ID:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getTasksByLeadId = async (req: Request, res: Response): Promise<Response> => {
    const leadId = parseInt(req.params.leadId);
    try {
        const tasks = await Task.findAll({
            where: { leadId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'mobile']
                },
                // {
                //     model: Lead,
                //     as: 'lead',
                //     attributes: ['name', 'techStack', 'phone', 'email'],
                //     include: [
                //         {
                //             model: Course,
                //             as: 'Courses',
                //             attributes: ['name']
                //         }
                //     ]
                // },
                {
                    model: Batch,
                    as: 'batch',
                    attributes: ['batchName']
                },
                {
                    model: Learner,
                    as: 'learner',
                    attributes: ['id', 'name']
                }
            ]
        });
        return res.status(200).json({ tasks });
    } catch (error: any) {
        console.error('Error fetching tasks by lead ID:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getTasksByUserId = async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId);
    try {
        const tasks = await Task.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'mobile']
                },
                // {
                //     model: Lead,
                //     as: 'lead',
                //     attributes: ['name', 'techStack', 'phone', 'email'],
                //     include: [
                //         {
                //             model: Course,
                //             as: 'Courses',
                //             attributes: ['name']
                //         }
                //     ]
                // },
                {
                    model: Batch,
                    as: 'batch',
                    attributes: ['batchName']
                },
                {
                    model: Learner,
                    as: 'learner',
                    attributes: ['id', 'name']
                }
            ]
        });
        return res.status(200).json({ tasks });
    } catch (error: any) {
        console.error('Error fetching tasks by user ID:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    const { subject, dueDate, priority, userId, leadId, batchId, trainerId, campaignId, learnerId ,mainTaskId} = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.subject = subject;
        task.dueDate = dueDate;
        task.priority = priority;
        task.userId = userId;
        task.leadId = leadId;
        task.batchId = batchId;
        task.trainerId = trainerId;
        task.campaignId = campaignId;
        task.learnerId = learnerId; // Update learnerId
        task.mainTaskId = mainTaskId; // Update learnerId
        await task.save();

        return res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error: any) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};