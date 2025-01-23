import { Router } from "express";
import multer from "multer";
import {
  createTasks,
  deleteTasks,
  getAllTasks,
  getTasksById,
  updateTask,
} from "../controllers/mainTask.controller";

const router = Router();

// Set up multer middleware
const upload = multer({ dest: "uploads/" });

// Route to create a new trainer
// router.post('/', upload.fields([{ name: 'idProof', maxCount: 1 }]), createTrainer);
router.post("/", createTasks);

// Route to get a specific trainer by ID
router.get("/:id", getTasksById);

// Route to get all trainers
router.get("/", getAllTasks);

// Route to update a trainer by ID
router.put("/:id", updateTask);

// Route to delete a trainer by ID
router.delete("/", deleteTasks);

export default router;
