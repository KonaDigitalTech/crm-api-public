import { Request, Response } from "express";
import Batch from "../models/batch.model";
import Lead from "../models/lead.model";
import MainTask from "../models/mainTask.model";
import Trainer from "../models/trainer.model";
import Learner from "../models/learner.model";

export const createTasks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Create a new batch in the database
    const newBatch = await MainTask.create(req.body);

    // Return success response
    return res.status(201).json({
      message: "Tasks created successfully",
      data: newBatch,
    });
  } catch (error: any) {
    console.error("Error creating batch:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getTasksById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskId = parseInt(req.params.id, 10);

    // Fetch the batch by its ID
    const task = await MainTask.findByPk(taskId, {
      // include: [
      //   {
      //     model: Lead,
      //     as: "leads",
      //     attributes: [
      //       "name",
      //       "classMode",
      //       "batchTiming",
      //       "email",
      //       "id",
      //       "createdAt",
      //       "techStack",
      //     ],
      //   },
      //   {
      //     model: Trainer,
      //     as: "trainer",
      //     attributes: ["trainerName"],
      //   },
      // ],
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return success response
    return res.status(200).json(task);
  } catch (error: any) {
    console.error("Error fetching batch:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract the optional learnerId, batchStatus, and trainerId query parameters
    // const batchStatus = req.query.batchStatus
    //   ? (req.query.batchStatus as string)
    //   : null;
    // const trainerId = req.query.trainerId
    //   ? parseInt(req.query.trainerId as string, 10)
    //   : null;

    // Construct query options
    const queryOptions: any = {
      // include: [
      //   {
      //     model: Lead,
      //     as: "leads",
      //     attributes: ["name", "techStack", "phone", "email"],
      //   },
      //   {
      //     model: Trainer,
      //     as: "trainer",
      //     attributes: ["trainerName"],
      //   },
      // ],
    };

    // If batchStatus is provided, add it to the query options
    // if (batchStatus) {
    //   queryOptions.where = {
    //     ...queryOptions.where,
    //     batchStatus: batchStatus,
    //   };
    // }

    // // If trainerId is provided, filter batches by the trainerId
    // if (trainerId) {
    //   queryOptions.where = {
    //     ...queryOptions.where,
    //     trainerId: trainerId,
    //   };
    // }

    // Fetch tasks with the constructed query options
    const tasks = await MainTask.findAll(queryOptions);

    // Return success response
    return res.status(200).json(tasks);
  } catch (error: any) {
    console.error("Error retrieving tasks:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const taskData = req.body;

    // Find the task to update
    const task: any = await MainTask.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    // Update task with new data
    await task.update(taskData);

    // If learnerIds are provided in the request body, update associations
    // if (req.body.learnerIds && Array.isArray(req.body.learnerIds)) {
    //   const leads = await Lead.findAll({ where: { id: req.body.learnerIds } });
    //   await task.setLeads(leads);
    // }

    // Return success response
    return res.status(200).json({
      message: "Task updated successfully",
      data: task,
    });
  } catch (error: any) {
    console.error("Error updating task:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteTasks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract and parse the ids from query params
    const ids = req.query.ids as string;
    const TaskIds = ids.split(",").map((id) => parseInt(id.trim(), 10));

    // Find the tasks to delete
    const tasks = await MainTask.findAll({
      where: {
        id: TaskIds,
      },
    });

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found with the provided IDs" });
    }

    // Delete the tasks
    await MainTask.destroy({
      where: {
        id: TaskIds,
      },
    });

    // Return success response
    return res.status(200).json({ message: "Tasks deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
