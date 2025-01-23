import { Request, Response } from 'express';
import { Sequelize, Op } from 'sequelize';

import BatchTopic from '../models/batch-topics.model'; 
import Batch from '../models/batch.model';

// Create a new batch topic
export const createBatchTopic = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log(req.body);
        // Sync the Batch model with the database
        await BatchTopic.sync({ alter: true });

        // Validate if batchId exists
        const batch = await Batch.findByPk(req.body.batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }


        // Create a new batch topic record
        const newBatchTopic = await BatchTopic.create(req.body);

        // Return success response
        return res.status(201).json({
            message: 'Batch topic created successfully',
            data: newBatchTopic
        });
    } catch (error) {
        console.error('Error creating batch topic:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all batch topics or filter by batchId
export const getBatchTopics = async (req: Request, res: Response): Promise<Response> => {
    const { batchId } = req.query;

    try {
        // If batchId is provided, filter by batchId
        const query = batchId ? { where: { batchId: batchId as string } } : {};
        const batchTopics = await BatchTopic.findAll(query);

        return res.status(200).json({ batchTopics });
    } catch (error) {
        console.error('Error fetching batch topics:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single batch topic by ID
export const getBatchTopicById = async (req: Request, res: Response): Promise<Response> => {
    const batchTopicId = parseInt(req.params.id, 10);
    if (isNaN(batchTopicId)) {
        return res.status(400).json({ message: 'Invalid batch topic ID' });
    }
    try {
        const batchTopic = await BatchTopic.findByPk(batchTopicId);
        if (!batchTopic) {
            return res.status(404).json({ message: 'Batch topic not found' });
        }
        return res.status(200).json({ batchTopic });
    } catch (error) {
        console.error('Error fetching batch topic:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a batch topic
export const updateBatchTopic = async (req: Request, res: Response): Promise<Response> => {
    const batchTopicId = parseInt(req.params.id, 10);
    if (isNaN(batchTopicId)) {
        return res.status(400).json({ message: 'Invalid batch topic ID' });
    }

    try {
        const batchTopic = await BatchTopic.findByPk(batchTopicId);
        if (!batchTopic) {
            return res.status(404).json({ message: 'Batch topic not found' });
        }

        // Validate if batchId exists
        if (req.body.batchId) {
            const batch = await Batch.findByPk(req.body.batchId);
            if (!batch) {
                return res.status(404).json({ message: 'Batch not found' });
            }
        }

        await batchTopic.update(req.body);

        return res.status(200).json({
            message: 'Batch topic updated successfully',
            data: batchTopic
        });
    } catch (error) {
        console.error('Error updating batch topic:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a batch topic
export const deleteBatchTopic = async (req: Request, res: Response): Promise<Response> => {
    const batchTopicId = parseInt(req.params.id, 10);
    if (isNaN(batchTopicId)) {
        return res.status(400).json({ message: 'Invalid batch topic ID' });
    }
    try {
        const batchTopic = await BatchTopic.findByPk(batchTopicId);
        if (!batchTopic) {
            return res.status(404).json({ message: 'Batch topic not found' });
        }
        await batchTopic.destroy();
        return res.status(200).json({ message: 'Batch topic deleted successfully' });
    } catch (error) {
        console.error('Error deleting batch topic:', error);
        return res.status(500).json({ message: 'Failed to delete the batch topic' });
    }
};

export const upsertBatchTopics = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { batchId } = req.query;
        if (!batchId) {
            return res.status(400).json({ message: 'BatchId is required' });
        }
        const batch = await Batch.findByPk(batchId as string);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }



        const batchTopics = req.body;
        const result = await Promise.all(batchTopics.map(async (topic: any) => {
            if (topic.id) {
                // Update the batch topic if id exists
                const existingTopic = await BatchTopic.findByPk(topic.id);
                if (existingTopic) {
                    return existingTopic.update({...topic, batchId});
                }
            }
            // Create a new batch topic if id doesn't exist
            return BatchTopic.create({...topic, batchId});
        }));

        return res.status(200).json({
            message: 'Batch topics processed successfully',
            data: result
        });
    } catch (error) {
        console.error('Error processing batch topics:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBatchTopicsByMonth = async (req: Request, res: Response): Promise<Response> => {
    const { batchId } = req.query;

    try {
        // Construct the query to filter by batchId if provided
        const query = batchId ? { where: { batchId: batchId as string } } : {};

        // Fetch all batch topics sorted by createdAt in ascending order
        const batchTopics = await BatchTopic.findAll({
            ...query,
            order: [['date', 'ASC']],
        });

        // Group the batch topics by month and year
        const topicsByMonth: { [key: string]: BatchTopic[] } = {};
        
        batchTopics.forEach(topic => {
            if (topic.date) {
                const monthYear = topic.date.toLocaleString('default', { year: 'numeric', month: 'long' });
                if (!topicsByMonth[monthYear]) {
                    topicsByMonth[monthYear] = [];
                }
                topicsByMonth[monthYear].push(topic);
            }
        });

        // Convert the grouped topics into an array format
        const result = Object.keys(topicsByMonth).map(monthYear => ({
            monthYear,
            topics: topicsByMonth[monthYear],
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching batch topics:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBatchTopics = async (req: Request, res: Response): Promise<Response> => {
    const { ids } = req.query;

    if (!ids || typeof ids !== 'string') {
        return res.status(400).json({ message: 'Batch topic IDs are required' });
    }

    try {
        // Parse the comma-separated string into an array of numbers
        const batchTopicIds = ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

        if (batchTopicIds.length === 0) {
            return res.status(400).json({ message: 'No valid batch topic IDs provided' });
        }

        // Find and delete batch topics in bulk
        const deletedCount = await BatchTopic.destroy({
            where: {
                id: batchTopicIds
            }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'No batch topics found for the provided IDs' });
        }

        return res.status(200).json({ message: `Batch topics deleted successfully: ${deletedCount} deleted` });
    } catch (error) {
        console.error('Error deleting batch topics:', error);
        return res.status(500).json({ message: 'Failed to delete the batch topics' });
    }
};