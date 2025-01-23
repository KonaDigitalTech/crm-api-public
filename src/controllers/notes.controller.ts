import { Request, Response } from "express";
import Note from "../models/note.model";
import User from "../models/user.model";
import Mention from "../models/mention.model";
import Learner from "../models/learner.model"; // Import Learner model if needed

export const createNote = async (req: Request, res: Response) => {
  const {
    content,
    leadId,
    batchId,
    leadStage,
    trainerId,
    campaignId,
    learnerId,
    mainTaskId,
  } = req.body;

  try {
    Mention.sync({ alter: true });
    Note.sync({ alter: true });

    // Extract mentioned usernames from the content
    const mentionedUsernames =
      content.match(/@\w+/g)?.map((username: string) => username.slice(1)) ||
      [];

    // Query the user table to get the corresponding user IDs
    const mentionedUsers = await User.findAll({
      where: { username: mentionedUsernames },
    });
    const mentionedUserIds = mentionedUsers.map((user) => user.id);

    // Create the note
    const note = await Note.create({
      content,
      leadId,
      batchId,
      leadStage,
      trainerId,
      campaignId,
      learnerId, // Include learnerId
      mainTaskId, // Include mainTaskId
    });

    // Associate mentioned users with the note
    if (mentionedUserIds.length > 0) {
      await note.setUsers(mentionedUsers);
    }

    return res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchAllNotes = async (req: Request, res: Response) => {
  try {
    let notes;
    const {
      leadId,
      batchId,
      leadStage,
      trainerId,
      campaignId,
      learnerId,
      mainTaskId,
    } = req.query;

    // Convert IDs to numbers if they exist
    const leadIdNumber = leadId ? parseInt(leadId as string, 10) : undefined;
    const batchIdNumber = batchId ? parseInt(batchId as string, 10) : undefined;
    const trainerIdNumber = trainerId
      ? parseInt(trainerId as string, 10)
      : undefined;
    const campaignIdNumber = campaignId
      ? parseInt(campaignId as string, 10)
      : undefined;
    const learnerIdNumber = learnerId
      ? parseInt(learnerId as string, 10)
      : undefined;
    const mainTaskIdNumber = mainTaskId
      ? parseInt(mainTaskId as string, 10)
      : undefined;

    const filter: any = {};

    if (leadIdNumber) {
      filter.leadId = leadIdNumber;
    }

    if (batchIdNumber) {
      filter.batchId = batchIdNumber;
    }

    if (trainerIdNumber) {
      filter.trainerId = trainerIdNumber;
    }

    if (campaignIdNumber) {
      filter.campaignId = campaignIdNumber;
    }

    if (learnerIdNumber) {
      filter.learnerId = learnerIdNumber; // Include learnerId in filter
    }
    if (mainTaskIdNumber) {
      filter.mainTaskId = mainTaskIdNumber; // Include learnerId in filter
    }

    if (leadStage) {
      filter.leadStage = leadStage;
    }

    if (Object.keys(filter).length > 0) {
      notes = await Note.findAll({ where: filter, include: "Users" });
    } else {
      notes = await Note.findAll({ include: "Users" });
    }

    // Map notes array to contain only necessary data and mentionedUsers
    const mappedNotes = notes.map((note: any) => ({
      id: note.id,
      content: note.content,
      leadId: note.leadId,
      batchId: note.batchId,
      trainerId: note.trainerId,
      campaignId: note.campaignId,
      learnerId: note.learnerId, // Include learnerId
      mainTaskId: note.mainTaskId, // Include mainTaskId
      leadStage: note.leadStage,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      mentionedUsers: note.Users.map((user: any) => ({
        id: user.id,
        username: user.username,
      })),
    }));

    return res.status(200).json({ data: mappedNotes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    content,
    leadId,
    batchId,
    leadStage,
    trainerId,
    campaignId,
    learnerId,
    mainTaskId,
  } = req.body;

  try {
    // Find the note by id
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Update the note fields
    note.content = content;
    note.leadId = leadId;
    note.batchId = batchId;
    note.leadStage = leadStage ? leadStage : note?.leadStage;
    note.trainerId = trainerId;
    note.campaignId = campaignId;
    note.learnerId = learnerId; // Update learnerId
    note.mainTaskId = mainTaskId; // Update mainTaskId

    // Save the updated note
    await note.save();

    // Update mentions if content has changed
    const mentionedUsernames =
      content.match(/@\w+/g)?.map((username: string) => username.slice(1)) ||
      [];
    const mentionedUsers = await User.findAll({
      where: { username: mentionedUsernames },
    });

    // Associate mentioned users with the note
    await note.setUsers(mentionedUsers);

    return res
      .status(200)
      .json({ message: "Note updated successfully", data: note });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNoteAndMentions = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find the note by id
    const note = await Note.findByPk(id, { include: "Users" });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Delete the note
    await note.destroy();

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
