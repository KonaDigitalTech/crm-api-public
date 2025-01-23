import sgMail from "@sendgrid/mail";
import { Request, Response } from "express";
import axios from "axios";

import User from "../models/user.model";
import Meeting from "../models/meeting.model";
import Lead from "../models/lead.model";
import { generateZoomAccessToken } from "../utilities/utilities";
import Trainer from "../models/trainer.model";
import Campaign from "../models/campaign.model";
import Batch from "../models/batch.model";
import Learner from "../models/learner.model";

const sendGridApiKey =
  process.env.TWILIO_API_KEY ||
  "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";
sgMail.setApiKey(sendGridApiKey);

export const sendEmails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      hostId,
      participants,
      meetingName,
      location,
      startTime,
      endTime,
      leadId,
      userId,
      batchId,
      trainerId,
      campaignId,
      learnerId,
      mainTaskId
    } = req.body;

    const host: any = await User.findByPk(hostId);
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }
    const hostEmail = host.email;

    const zoomAccessToken = await generateZoomAccessToken();

    const formattedStartTime = new Date(startTime).toLocaleString("en-GB");
    const formattedEndTime = new Date(endTime).toLocaleString("en-GB");

    const subject = `Meeting Invitation: ${meetingName}`;

    const zoomMeeting = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: meetingName,
        type: 2,
        start_time: new Date(startTime).toISOString(),
        duration: Math.floor(
          (new Date(endTime).getTime() - new Date(startTime).getTime()) /
            (1000 * 60)
        ),
        timezone: "UTC",
      },
      {
        headers: {
          Authorization: `Bearer ${zoomAccessToken}`,
        },
      }
    );

    const zoomMeetingUrl = `https://zoom.us/j/${zoomMeeting.data.id}`;

    const html = `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                    }
                    h2 {
                        color: #007bff;
                    }
                    .meeting-details {
                        background-color: #fff;
                        border-radius: 5px;
                        padding: 10px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .meeting-details strong {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="meeting-details">
                    <p>You have been invited to a meeting.</p>
                    <p><strong>Meeting Name:</strong> ${meetingName}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Start Time:</strong> ${formattedStartTime}</p>
                    <p><strong>End Time:</strong> ${formattedEndTime}</p>
                    <p><strong>Zoom Meeting Link:</strong> <a href="${zoomMeetingUrl}">${zoomMeetingUrl}</a></p>
                </div>
            </body>
            </html>
        `;

    await sgMail.send({
      to: [...new Set([hostEmail, ...participants])],
      from: "kona@digital-edify.com",
      subject: subject,
      html: html,
    });

    await Meeting.sync({ alter: true });

    await Meeting.create({
      hostId,
      participants,
      meetingName,
      location,
      zoomMeetingId: zoomMeeting.data.id,
      startTime,
      endTime,
      leadId: leadId || null,
      batchId: batchId || null,
      userId,
      trainerId: trainerId || null,
      campaignId: campaignId || null,
      learnerId: learnerId || null, // Handle learnerId
      mainTaskId: mainTaskId || null, 
    });

    return res.status(200).json({ message: "Scheduled meeting successfully." });
  } catch (error: any) {
    console.error("Error occurred while scheduling meeting:", error);
    return res
      .status(500)
      .json({
        message: "Error occurred while scheduling meeting.",
        error: error.message,
      });
  }
};

export const getAllMeetings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { batchId, leadId, trainerId, campaignId, learnerId,mainTaskId } = req.query;

    const filter: any = {};

    if (batchId) {
      filter.batchId = parseInt(batchId as string, 10);
    }
    if (leadId) {
      filter.leadId = parseInt(leadId as string, 10);
    }
    if (trainerId) {
      filter.trainerId = parseInt(trainerId as string, 10);
    }
    if (campaignId) {
      filter.campaignId = parseInt(campaignId as string, 10);
    }
    if (learnerId) {
      filter.learnerId = parseInt(learnerId as string, 10);
    }
    if (mainTaskId) {
      filter.mainTaskId = parseInt(mainTaskId as string, 10);
    }

    const meetings = await Meeting.findAll({
      where: filter,
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "name", "email", "mobile"],
        },
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "name", "email", "mobile"],
        },
        // {
        //   model: Lead,
        //   as: "lead",
        //   attributes: ["name", "techStack", "phone", "email"],
        // },
        {
          model: Trainer,
          as: "trainer",
          attributes: ["id", "trainerName"],
        },
        {
          model: Campaign,
          as: "campaign",
          attributes: ["id", "name"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "batchName"],
        },
        {
          model: Learner,
          as: "learner",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json({ meetings });
  } catch (error: any) {
    console.error("Error occurred while fetching meetings:", error.toString());
    return res
      .status(500)
      .json({ message: "Error occurred while fetching meetings." });
  }
};

export const getMeetingsByLeadId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const leadId = parseInt(req.params.leadId);
  try {
    const meetings = await Meeting.findAll({
      where: { leadId },
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: ["name", "techStack", "phone", "email"],
        },
      ],
    });
    return res.status(200).json({ meetings });
  } catch (error: any) {
    console.error("Error fetching meetings by lead ID:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
