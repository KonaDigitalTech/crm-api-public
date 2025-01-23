import Message from "../models/message.model";
import { Request, Response } from "express";
import Lead from "../models/lead.model";
import User from "../models/user.model";
import twilio from "twilio";
import MessageTemplate from "../models/message-template.model";

const accountSid =
  process.env.TWILIO_ACCOUNT_SID || "ACe0a703c6f216ea4ca203480643e3a8af";
const authToken =
  process.env.TWILIO_ACCOUNT_TOKEN || "f272e2df4de81517da81a931b443057c";
const client = twilio(accountSid, authToken);

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const {
      phoneNumber,
      messageContent,
      leadId,
      userId,
      type,
      messageTemplateId,
      batchId,
      trainerId,
      campaignId,
    } = req.body;

    let messageSid;
    let finalMessageContent = messageContent;

    // If messageTemplateId is provided, fetch message content from the template
    if (messageTemplateId) {
      const messageTemplate = await MessageTemplate.findByPk(messageTemplateId);
      if (!messageTemplate) {
        return res.status(404).json({ message: "Message template not found" });
      }
      finalMessageContent = messageTemplate.content;
    }

    // Send message using Twilio
    if (type === "whatsapp") {
      const message = await client.messages.create({
        body: finalMessageContent,
        from: "whatsapp:+919866297283",
        to: `whatsapp:${phoneNumber}`,
      });
      messageSid = message.sid;
    } else {
      const message = await client.messages.create({
        body: finalMessageContent,
        from: "+12567334172",
        to: phoneNumber,
      });
      messageSid = message.sid;
    }

    // Create a new message record in the database
    await Message.sync({ alter: true });
    const newMessage = await Message.create({
      phoneNumber,
      messageId: messageSid,
      messageContent: finalMessageContent,
      leadId: leadId || null,
      batchId: batchId || null,
      trainerId: trainerId || null,
      userId,
      type,
      messageTemplateId: messageTemplateId || null,
      campaignId: campaignId || null, // Include campaignId
    });

    res.status(200).json({ message: "Message sent successfully.", newMessage });
  } catch (error: any) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ error: "Error sending message.", errorMessage: error.message });
  }
};

export const createWhatsappMsg = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { Body, From, To, MessageSid } = req.body;

    const lead: any = await Lead.findOne({ where: { phone: From.slice(-10) } });
    const user: any = await User.findOne({ where: { username: "admin" } });

    const newMessage = await Message.create({
      phoneNumber: From.slice(-13),
      messageId: MessageSid,
      messageContent: Body,
      leadId: lead.id,
      userId: user.id,
      type: "whatsapp",
      messageTemplateId: null,
    });

    return res
      .status(200)
      .json({ message: "Message saved successfully.", newMessage });
  } catch (error: any) {
    console.error("Error saving whatsapp message:", error.toString());
    return res
      .status(500)
      .json({
        message: "Error saving whatsapp message.",
        error: error.message,
      });
  }
};

export const getAllMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { type, leadId, batchId, trainerId, campaignId, learnerId } =
      req.query;

    const leadOptions = {
      model: Lead,
      as: "lead",
      attributes: ["name", "techStack", "phone", "email"],
    };

    const userOptions = {
      model: User,
      as: "createdBy",
      attributes: ["id", "name", "email", "mobile"],
    };

    const templateOptions = {
      model: MessageTemplate,
      as: "messageTemplate",
      attributes: ["id", "name", "content"],
    };

    // Construct filter conditions based on optional parameters
    const filterConditions: any = {};

    if (type) {
      filterConditions.type = type;
    }

    if (leadId) {
      filterConditions.leadId = leadId;
    }

    if (batchId) {
      filterConditions.batchId = batchId;
    }

    if (trainerId) {
      filterConditions.trainerId = trainerId;
    }

    if (campaignId) {
      filterConditions.campaignId = campaignId;
    }

    if (learnerId) {
      filterConditions.learnerId = learnerId;
    }

    // Fetch all messages with associated lead and user details, applying optional filters
    const messages = await Message.findAll({
      include: [leadOptions, userOptions, templateOptions],
      where: filterConditions,
    });

    return res.status(200).json({ messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error.toString());
    return res
      .status(500)
      .json({ message: "Error fetching messages.", error: error.message });
  }
};
