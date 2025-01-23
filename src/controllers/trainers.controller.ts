import { Request, Response } from 'express';
import Trainer from '../models/trainer.model';
import { uploadFile } from '../utilities/utilities';
import Batch from '../models/batch.model';
import { sequelize } from '../database';
import Lead from '../models/lead.model';
import { Sequelize, QueryTypes } from 'sequelize';

interface UploadedFiles {
    [fieldname: string]: Express.Multer.File[];
}

interface TrainerStatsResult {
    id: number;
    trainerName: string;
    phone: string;
    email: string;
    batchCount: number;
    learnerCount: number;
}

export const createTrainer = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Sync the Trainer model with the database
        await Trainer.sync({ alter: true });

        let imgUrl = null;
        const files = req.files as UploadedFiles;
        if (files && files['idProof']) {
            const idProof = files['idProof'][0];
            imgUrl = await uploadFile('trainerIdProofs', idProof);
        }

        // Create trainer in the database
        const newTrainer = await Trainer.create({...req.body, idProof: imgUrl });

        // Return success response
        return res.status(201).json({
            message: 'Trainer created successfully',
            data: newTrainer
        });
    } catch (error: any) {
        console.error('Error creating trainer:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getTrainerById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const trainerId = parseInt(req.params.id, 10);

        // Fetch the trainer by its ID
        const trainer = await Trainer.findByPk(trainerId);

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        // Return success response
        return res.status(200).json(trainer);
    } catch (error: any) {
        console.error('Error fetching trainer:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getAllTrainers = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Extract filter parameter from query
        const batchStage = req.query.batchStage as string | undefined;

        // Construct query options with optional filter
        const queryOptions: any = {};

        // Add filter for batchStage if provided
        if (batchStage) {
            queryOptions.where = { batchStage: batchStage };
        }

        // Fetch all trainers with optional filter
        const trainers = await Trainer.findAll(queryOptions);

        // Return success response
        return res.status(200).json({
            message: 'Trainers retrieved successfully',
            data: trainers
        });
    } catch (error: any) {
        console.error('Error retrieving trainers:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateTrainer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const trainerId = parseInt(req.params.id, 10);
        const trainerData = req.body;

        // Find the trainer to update
        const trainer = await Trainer.findByPk(trainerId);

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        const files = req.files as UploadedFiles;
        if (files && files['idProof']) {
            const idProof = files['idProof'][0];
            trainerData.idProof = await uploadFile('trainerIdProofs', idProof);
        }

        // Update trainer with new data
        await trainer.update(trainerData);

        // Return success response
        return res.status(200).json({
            message: 'Trainer updated successfully',
            data: trainer
        });
    } catch (error: any) {
        console.error('Error updating trainer:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deleteTrainers = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Extract and parse the ids from query params
        const ids = req.query.ids as string; // expecting something like "?ids=1,2,3"
        const trainerIds = ids.split(',').map(id => parseInt(id.trim(), 10));

        // Find the trainers to delete
        const trainers = await Trainer.findAll({
            where: {
                id: trainerIds
            }
        });

        if (trainers.length === 0) {
            return res.status(404).json({ message: 'No trainers found with the provided IDs' });
        }

        // Delete the trainers
        await Trainer.destroy({
            where: {
                id: trainerIds
            }
        });

        // Return success response
        return res.status(200).json({ message: 'Trainers deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting trainers:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getAllTrainerStats = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Raw SQL query to get all trainers with batch count and learner count
        const results = await sequelize.query<TrainerStatsResult>(
            `SELECT trainers.id, trainers."trainerName", trainers.phone, trainers.email,
                    COUNT(DISTINCT batches.id) AS "batchCount",
                    COUNT(DISTINCT leads.id) AS "learnerCount"
             FROM trainers
             LEFT JOIN batches ON batches."trainerId" = trainers.id
             LEFT JOIN batch_lead ON batch_lead."batchId" = batches.id
             LEFT JOIN leads ON leads.id = batch_lead."leadId"
             GROUP BY trainers.id
             ORDER BY trainers."trainerName"`,
            {
                type: QueryTypes.SELECT,
            }
        );

        // Return success response with all trainers and their stats
        return res.status(200).json(results);
    } catch (error: any) {
        console.error('Error fetching trainer stats:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};