import { Request, Response } from "express";
import Batch from "../models/batch.model";
import Lead from "../models/lead.model";
import Trainer from "../models/trainer.model";
import Learner, { LearnerBatch } from "../models/learner.model";
import LearnerCourse from "../models/learner-course.model";

export const createBatch = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    Batch.sync({ alter: true });
    Learner.sync({ alter: true });
    LearnerBatch.sync({ alter: true });
    LearnerCourse.sync({ alter: true });
    Trainer.sync({ alter: true });

    // Create a new batch in the database
    const newBatch = await Batch.create(req.body);

    // Check if learnerIds are provided and are valid
    if (req.body.learnerIds && Array.isArray(req.body.learnerIds)) {
      // Fetch learners by their IDs
      const learners = await Learner.findAll({
        where: {
          id: req.body.learnerIds,
        },
      });

      // Associate the batch with the fetched learners if any learners are found
      if (learners.length > 0) {
        // Create entries in the learnerBatch table
        const associations = learners.map((learner) => ({
          learnerId: learner.id,
          batchId: newBatch.id,
        }));
        await LearnerBatch.bulkCreate(associations);
      } else {
        console.warn("No learners found for provided IDs");
      }
    }

    // Return success response
    return res.status(201).json({
      message: "Batch created successfully",
      data: newBatch,
    });
  } catch (error: any) {
    console.error("Error creating batch:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getBatchById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const batchId = parseInt(req.params.id, 10);

    // Fetch the batch by its ID
    const batch = await Batch.findByPk(batchId, {
      include: [
        {
          model: Lead,
          as: "leads",
          attributes: [
            "name",
            "classMode",
            "batchTiming",
            "email",
            "id",
            "createdAt",
            "techStack",
          ],
        },
        {
          model: Trainer,
          as: "trainer",
          attributes: ["trainerName"],
        },
      ],
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Return success response
    return res.status(200).json(batch);
  } catch (error: any) {
    console.error("Error fetching batch:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getBatchesByLead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract the optional learnerId, batchStatus, and trainerId query parameters
    const batchStatus = req.query.batchStatus
      ? (req.query.batchStatus as string)
      : null;
    const trainerId = req.query.trainerId
      ? parseInt(req.query.trainerId as string, 10)
      : null;

    // Construct query options
    const queryOptions: any = {
      include: [
        {
          model: Lead,
          as: "leads",
          attributes: ["name", "techStack", "phone", "email"],
        },
        {
          model: Trainer,
          as: "trainer",
          attributes: ["trainerName"],
        },
      ],
    };

    // If batchStatus is provided, add it to the query options
    if (batchStatus) {
      queryOptions.where = {
        ...queryOptions.where,
        batchStatus: batchStatus,
      };
    }

    // If trainerId is provided, filter batches by the trainerId
    if (trainerId) {
      queryOptions.where = {
        ...queryOptions.where,
        trainerId: trainerId,
      };
    }

    // Fetch batches with the constructed query options
    const batches = await Batch.findAll(queryOptions);

    // Return success response
    return res.status(200).json(batches);
  } catch (error: any) {
    console.error("Error retrieving batches:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateBatch = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const batchId = parseInt(req.params.id, 10);
    const batchData = req.body;

    // Find the batch to update
    const batch: any = await Batch.findByPk(batchId);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Update batch with new data
    await batch.update(batchData);

    // If learnerIds are provided in the request body, update associations
    if (req.body.learnerIds && Array.isArray(req.body.learnerIds)) {
      const leads = await Lead.findAll({ where: { id: req.body.learnerIds } });
      await batch.setLeads(leads);
    }

    // Return success response
    return res.status(200).json({
      message: "Batch updated successfully",
      data: batch,
    });
  } catch (error: any) {
    console.error("Error updating batch:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteBatches = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract and parse the ids from query params
    const ids = req.query.ids as string;
    const batchIds = ids.split(",").map((id) => parseInt(id.trim(), 10));

    // Find the batches to delete
    const batches = await Batch.findAll({
      where: {
        id: batchIds,
      },
    });

    if (batches.length === 0) {
      return res
        .status(404)
        .json({ message: "No batches found with the provided IDs" });
    }

    // Delete the batches
    await Batch.destroy({
      where: {
        id: batchIds,
      },
    });

    // Return success response
    return res.status(200).json({ message: "Batches deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting batches:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
