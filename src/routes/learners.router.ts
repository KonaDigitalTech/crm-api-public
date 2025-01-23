import { Router } from "express";
import {
  createLearner,
  createOrUpdateCourses,
  updateLearner,
  deleteLearners,
  getAllLearners,
  getLearnerById,
} from "../controllers/learners.controller";
import multer from "multer";
import { authorize } from "../middlewares/authorize";

const router = Router();

// Set up multer middleware
const upload = multer({ dest: "uploads/" });

router.post("/courses", authorize, createOrUpdateCourses);
router.post("/", authorize, createLearner);
router.get("/:id", authorize, getLearnerById);
router.get("/", authorize, getAllLearners);
router.put(
  "/:id",
  authorize,
  upload.fields([{ name: "instalment1Screenshot", maxCount: 1 }]),
  updateLearner
);
router.delete("/", authorize, deleteLearners);

export default router;
