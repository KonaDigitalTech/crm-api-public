import { Request, Response } from "express";
import Learner, { LearnerBatch } from "../models/learner.model";
import User from "../models/user.model";
import Course from "../models/course.model";
import Batch from "../models/batch.model";
import LearnerCourse from "../models/learner-course.model";
import { uploadFile } from "../utilities/utilities";

// Define CourseData interface if not already defined
interface CourseData {
  id: number;
  courseId: number;
  techStack?: string;
  courseComments?: string;
  slackAccess?: string;
  lmsAccess?: string;
  preferableTime?: string;
  batchTiming?: string;
  modeOfClass?: string;
  comment?: string;
}

interface UploadedFiles {
  [fieldname: string]: Express.Multer.File[];
}

export const createLearner = async (req: Request, res: Response) => {
  const {
    // firstName,
    // lastName,
    // phone,
    // alternatePhone,
    // email,
    // location,
    // source,
    // attendedDemo,
    // leadCreatedTime,
    // counselingDoneBy,
    // idProof,
    // dateOfBirth,
    // registeredDate,
    // description,
    // exchangeRate,
    // learnerOwner,
    // currency,
    // learnerStage,
    batchIds = [],
    // courses = []
  } = req.body;

  try {
    Learner.sync({ alter: true });
    // LearnerCourse.sync({ alter: true });
    LearnerBatch.sync({ alter: true });

    // Create the learner record
    const learner: any = await Learner.create(req.body);

    if (batchIds.length > 0) {
      const validBatches = await Batch.findAll({
        where: { id: batchIds },
      });

      const associations = validBatches.map((batch) => ({
        learnerId: learner.id,
        batchId: batch.id,
      }));

      if (associations.length > 0) {
        await LearnerBatch.bulkCreate(associations);
      } else {
        console.log("No valid batch IDs found.");
      }
    }

    // Process courses and create associations
    // if (courses.length > 0) {
    //     const courseAssociations = courses.map((course: CourseData) => ({
    //         learnerId: learner.id,
    //         courseId: course.courseId,
    //         techStack: course.techStack,
    //         courseComments: course.courseComments,
    //         slackAccess: course.slackAccess,
    //         lmsAccess: course.lmsAccess,
    //         preferableTime: course.preferableTime,
    //         batchTiming: course.batchTiming,
    //         modeOfClass: course.modeOfClass,
    //         comment: course.comment
    //     }));

    //     await LearnerCourse.bulkCreate(courseAssociations);
    // }

    res.status(201).json(learner);
  } catch (error) {
    console.error("Error creating learner:", error);
    res.status(500).json({ message: "Error creating learner" });
  }
};

export const updateLearner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    //     firstName,
    //     lastName,
    //     phone,
    //     alternatePhone,
    //     email,
    //     location,
    //     source,
    //     attendedDemo,
    //     leadCreatedTime,
    //     counselingDoneBy,
    //     idProof,
    //     dateOfBirth,
    //     registeredDate,
    //     description,
    //     exchangeRate,
    //     learnerOwner,
    //     currency,
    batchId,
    //     courses = []
  } = req.body;

  try {
    const learnerData = req.body;

    const batchIds = batchId ? batchId.split(",") : [];
    learnerData.batchId = batchIds;

    const files = req.files as any;
    let imgUrl = null;
    if (files && files["instalment1Screenshot"]) {
      const screenshot = files["instalment1Screenshot"][0];
      console.log("🚀 ~ updateLearner ~ screenshot:", screenshot);
      imgUrl = await uploadFile("instalment1Screenshot", screenshot);
      console.log("🚀 ~ updateLearner ~ imgUrl:", imgUrl);
    }
    const learner = await Learner.findByPk(id);
    learnerData.instalment1Screenshot = imgUrl ? [imgUrl] : [learner?.instalment1Screenshot?.[0]];
    // Find the learner by ID

    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }


    // Update learner details
    await learner.update(learnerData);

    // Update batches
    if (batchIds.length > 0) {
      console.log("Batch IDs:", batchIds);

      const validBatches = await Batch.findAll({
        where: { id: batchIds },
      });

      // Remove existing associations
      await LearnerBatch.destroy({
        where: { learnerId: learner.id },
      });

      // Create new associations
      const associations = validBatches.map((batch) => ({
        learnerId: learner.id,
        batchId: batch.id,
      }));

      if (associations.length > 0) {
        await LearnerBatch.bulkCreate(associations);
      } else {
        console.log("No valid batch IDs found.");
      }
    }

    // // Process courses: update or create
    // const coursePromises = courses.map(async (course: CourseData) => {
    //     if (course.id) {
    //         // Update existing course
    //         const existingCourse = await LearnerCourse.findByPk(course.id);
    //         if (!existingCourse) {
    //             return res.status(404).json({ message: `Course with ID ${course.id} not found` });
    //         }
    //         await existingCourse.update({
    //             techStack: course.techStack,
    //             courseComments: course.courseComments,
    //             slackAccess: course.slackAccess,
    //             lmsAccess: course.lmsAccess,
    //             preferableTime: course.preferableTime,
    //             batchTiming: course.batchTiming,
    //             modeOfClass: course.modeOfClass,
    //             comment: course.comment
    //         });
    //         return existingCourse;
    //     } else {
    //         // Create new course
    //         return await LearnerCourse.create({
    //             learnerId: learner.id,
    //             courseId: course.courseId,
    //             techStack: course.techStack,
    //             courseComments: course.courseComments,
    //             slackAccess: course.slackAccess,
    //             lmsAccess: course.lmsAccess,
    //             preferableTime: course.preferableTime,
    //             batchTiming: course.batchTiming,
    //             modeOfClass: course.modeOfClass,
    //             comment: course.comment
    //         });
    //     }
    // });

    // const results = await Promise.all(coursePromises);

    // res.status(200).json({ learner, courses: results });
    res.status(200).json({ learner });
  } catch (error) {
    console.error("Error updating learner:", error);
    res.status(500).json({ message: "Error updating learner" });
  }
};

export const createOrUpdateCourses = async (req: Request, res: Response) => {
  const { courses = [], learnerId } = req.body;

  try {
    const coursePromises = courses.map(async (course: CourseData) => {
      if (course.id) {
        // Update existing course
        const existingCourse = await LearnerCourse.findByPk(course.id);
        if (!existingCourse) {
          return res
            .status(404)
            .json({ message: `Course with ID ${course.id} not found` });
        }
        await existingCourse.update({
          techStack: course.techStack,
          courseComments: course.courseComments,
          slackAccess: course.slackAccess,
          lmsAccess: course.lmsAccess,
          preferableTime: course.preferableTime,
          batchTiming: course.batchTiming,
          modeOfClass: course.modeOfClass,
          comment: course.comment,
        });
        return existingCourse;
      } else {
        return await LearnerCourse.create({
          learnerId: learnerId,
          techStack: course.techStack,
          courseComments: course.courseComments,
          slackAccess: course.slackAccess,
          lmsAccess: course.lmsAccess,
          preferableTime: course.preferableTime,
          batchTiming: course.batchTiming,
          modeOfClass: course.modeOfClass,
          comment: course.comment,
        });
      }
    });

    const results = await Promise.all(coursePromises);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error creating/updating courses:", error);
    res.status(500).json({ message: "Error processing courses" });
  }
};

export const getAllLearners = async (req: Request, res: Response) => {
  const { learnerStage } = req.query;

  try {
    // Define the query options for fetching learners
    const queryOptions: any = {
      // include: [
      //     {
      //         model: User,
      //         as: 'counselor',
      //         attributes: ['name']
      //     },
      //     {
      //         model: User,
      //         as: 'owner',
      //         attributes: ['name']
      //     }
      // ]
    };

    // Apply the learnerStage filter if provided
    if (learnerStage) {
      queryOptions.where = {
        ...queryOptions.where,
        learnerStage,
      };
    }

    // Fetch all learners with optional filtering
    const learners = await Learner.findAll(queryOptions);

    res.status(200).json(learners);
  } catch (error) {
    console.error("Error fetching learners:", error);
    res.status(500).json({ message: "Error fetching learners" });
  }
};

export const getLearnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch learner with counselor and owner associations
    const learner = await Learner.findByPk(id, {
      include: [
        // {
        //     model: User,
        //     as: 'counselor',
        //     attributes: ['id', 'name'],
        // },
        // {
        //     model: User,
        //     as: 'owner',
        //     attributes: ['id', 'name'],
        // }
      ],
      // attributes: [
      //     'id', 'firstName', 'lastName', 'phone', 'alternatePhone', 'email', 'location',
      //     'source', 'attendedDemo', 'leadCreatedTime', 'counselingDoneBy', 'idProof',
      //     'dateOfBirth', 'registeredDate', 'description', 'exchangeRate', 'learnerOwner',
      //     'currency', 'learnerStage'  // Include learnerStage field
      // ]
    });

    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // Fetch associated batches from LearnerBatch table
    const learnerBatches = await LearnerBatch.findAll({
      where: { learnerId: learner.id },
      include: [
        {
          model: Batch,
          attributes: [
            "id",
            "batchName",
            "stage",
            "batchStatus",
            "location",
            "stack",
            "startDate",
            "tentativeEndDate",
          ],
        },
      ],
      attributes: ["batchId"],
    });

    // // Fetch associated courses from LearnerCourse table
    // const learnerCourses = await LearnerCourse.findAll({
    //     where: { learnerId: learner.id },
    //     include: [
    //         {
    //             model: Course,
    //             attributes: ['id', 'name'],
    //         }
    //     ],
    //     attributes: ['courseId', 'techStack', 'courseComments', 'slackAccess', 'lmsAccess', 'preferableTime', 'batchTiming', 'modeOfClass', 'comment']
    // });

    // // Construct response with learner, batches, and courses
    const response = {
      ...learner.get({ plain: true }),
      batches: learnerBatches.map((lb: any) => ({
        id: lb.batchId,
        batchName: lb.Batch.batchName,
        stage: lb.Batch.stage,
        batchStatus: lb.Batch.batchStatus,
        location: lb.Batch.location,
        stack: lb.Batch.stack,
        startDate: lb.Batch.startDate,
        tentativeEndDate: lb.Batch.tentativeEndDate,
      })),
      //     courses: learnerCourses.map((lc: any) => ({
      //         id: lc.courseId,
      //         courseName: lc.Course?.name,
      //         techStack: lc.techStack,
      //         courseComments: lc.courseComments,
      //         slackAccess: lc.slackAccess,
      //         lmsAccess: lc.lmsAccess,
      //         preferableTime: lc.preferableTime,
      //         batchTiming: lc.batchTiming,
      //         modeOfClass: lc.modeOfClass,
      //         comment: lc.comment,
      //     })),
    };

    res.status(200).json({ learner, response });
  } catch (error: any) {
    console.error("Error fetching learner:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteLearners = async (req: Request, res: Response) => {
  try {
    const idsString = req.query.ids as string;

    if (!idsString) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const idArray = idsString.split(",").map((id) => parseInt(id.trim(), 10));

    // Validate IDs
    if (idArray.some(isNaN)) {
      return res.status(400).json({ message: "Invalid ID(s) provided" });
    }

    // // Delete related learner batches
    await LearnerBatch.destroy({
      where: {
        learnerId: idArray,
      },
    });

    // // Delete related learner courses
    // await LearnerCourse.destroy({
    //     where: {
    //         learnerId: idArray,
    //     },
    // });

    // Delete learners with the specified IDs
    const deletedCount = await Learner.destroy({
      where: {
        id: idArray,
      },
    });

    if (deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(404)
        .json({ message: "No learners found with the provided IDs" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
