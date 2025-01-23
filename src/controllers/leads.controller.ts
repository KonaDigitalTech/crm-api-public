import { Request, Response } from "express";
import { Op } from "sequelize";
import xlsx from "xlsx";
import { OrderItem } from "sequelize/types";
import axios from "axios";

import Lead, { LeadAttributes, LeadCourse } from "../models/lead.model";
import User from "../models/user.model";
import { leadSchema } from "../schemas/lead.schema";
import Course from "../models/course.model";
import Task from "../models/task.model";
import Call from "../models/call.model";
import Email from "../models/email.model";
import Meeting from "../models/meeting.model";
import Message from "../models/message.model";
import EmailTemplate from "../models/email-template.model";
import Note from "../models/note.model";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";

export const getLeads = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract query parameters
    const {
      userId,
      fromDate,
      toDate,
      techStack,
      leadSource,
      courseId,
      leadStage,
    } = req.query;

    // Prepare filter object based on provided query parameters
    const filter: any = {};
    if (userId) {
      filter.userId = userId;
    }
    if (fromDate && toDate) {
      const parsedFromDate = new Date(Date.parse(fromDate as string));
      const parsedToDate = new Date(Date.parse(toDate as string));
      filter.createdAt = {
        [Op.between]: [parsedFromDate, parsedToDate],
      };
    }
    if (techStack) {
      filter.techStack = techStack;
    }
    if (leadSource) {
      filter.leadSource = leadSource;
    }
    // if (courseId) {
    //   filter.courseId = courseId;
    // }

    if (leadStage) {
      filter.leadStage = leadStage;
    }

    // Fetch all leads from the database with optional filtering
    const leads = await Lead.findAll({
      where: filter,
      include: [
        {
          model: User,
          as: "createdBy",
          attributes: ["name", "email"],
        },
        // {
        //   model: Course,
        //   as: "Courses",
        //   attributes: ["name", "description", "imgSrc"],
        // },
      ],
      order: [["createdAt", "DESC"]] as OrderItem[],
    });

    // Return the leads in the response
    return res.status(200).json({
      leads,
    });
  } catch (error: any) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error fetching leads:", error);
    return res
      .status(500)
      .json({ error: "Internal Server error", message: error.message });
  }
};

export const getLeadById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);

  try {
    // Find the lead by ID
    const lead = await Lead.findByPk(id, {
      include: [
        {
          model: User,
          as: "createdBy",
          attributes: ["name", "email"],
        },
        // {
        //   model: Course,
        //   as: "Courses",
        //   attributes: ["name", "description", "imgSrc"],
        // },
      ],
    });

    // If lead is not found, return 404 Not Found
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Return the lead in the response
    return res.status(200).json(lead);
  } catch (error: any) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error fetching lead by Id:", error);
    return res
      .status(500)
      .json({ error: "Internal Server error", message: error.message });
  }
};

export const createLead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    Lead.sync({ alter: true });
    LeadCourse.sync({ alter: true });
    Task.sync({ alter: true });
    EmailTemplate.sync({ alter: true });
    Email.sync({ alter: true });
    Meeting.sync({ alter: true });
    Message.sync({ alter: true });

    // Check if the phone number already exists
    // const existingLead = await Lead.findOne({ where: { phone: req.body.phone } });
    // if (existingLead) {
    //     return res.status(400).json({ error: 'Phone number already exists' });
    // }

    // Create lead in the database
    const newLead: any = await Lead.create(req.body);

    // If courseIds are provided in the request body, associate the lead with courses
    if (req.body.courseIds && Array.isArray(req.body.courseIds)) {
      // Fetch the courses by their ids
      const courses = await Course.findAll({
        where: { id: req.body.courseIds },
      });
      // Associate the lead with the fetched courses
      await newLead.setCourses(courses);
    }

    // await sendSlackNotification(newLead.name, newLead.email, newLead.phone, newLead.leadStatus);

    // Return success response
    return res.status(201).json({
      message: "Lead created successfully",
      data: newLead,
    });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract lead ID from request parameters
    const id = parseInt(req.params.id);

    // Find the lead by ID
    const lead: any = await Lead.findByPk(id);

    // If lead is not found, return 404 Not Found
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update lead attributes
    lead.set(req.body); // This will automatically update the lead attributes based on the request body

    // If courseIds are provided in the request body, associate the lead with courses
    if (req.body.courseIds && Array.isArray(req.body.courseIds)) {
      // Fetch the courses by their ids
      const courses = await Course.findAll({
        where: { id: req.body.courseIds },
      });
      // Associate the lead with the fetched courses
      await lead.setCourses(courses);
    }

    // Save the changes to the database
    await lead.save();

    // Check the leadStage and return a respective success message
    let message;
    switch (lead.leadStage) {
      case "lead":
        message = "Lead updated successfully";
        break;
      case "opportunity":
        message = "Opportunity updated successfully";
        break;
      case "learner":
        message = "Learner updated successfully";
        break;
      default:
        message = "Lead updated successfully"; // Default message if leadStage is not one of the specified values
    }

    // Return a JSON response with the updated lead details
    return res.json({
      message,
      lead,
    });
  } catch (error: any) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error updating lead:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Delete a lead by ID
export const deleteLead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract lead ID from request parameters
  const id = parseInt(req.params.id);

  try {
    // Find the lead by ID
    const lead = await Lead.findByPk(id);

    // If lead is not found, return 404 Not Found
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await Task.destroy({ where: { leadId: id } });
    await Email.destroy({ where: { leadId: id } });
    await Meeting.destroy({ where: { leadId: id } });
    await Message.destroy({ where: { leadId: id } });

    // Delete the lead from the database
    await lead.destroy();

    // Return a JSON response indicating successful deletion
    return res.status(200).json({ message: `Lead deleted successfully` });
  } catch (error: any) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error deleting lead:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete lead", error: error.message });
  }
};

export const deleteLeads = async (req: Request, res: Response) => {
  const idsString = req.query.ids as string;
  const ids = idsString.split(",").map((id) => parseInt(id, 10));
  try {
    // await Promise.all(
    //   ids.map(async (id) => {
    //     await LeadCourse.destroy({ where: { leadId: id } });
    //     await Task.destroy({ where: { leadId: id } });
    //     await Email.destroy({ where: { leadId: id } });
    //     await Meeting.destroy({ where: { leadId: id } });
    //     await Message.destroy({ where: { leadId: id } });
    //     await Note.destroy({ where: { leadId: id } });
    //   })
    // );

    const deletedRowCount = await Lead.destroy({
      where: { id: { [Op.in]: ids } },
    });
    if (deletedRowCount === 0) {
      return res.status(404).json({ message: "Leads not found" });
    }
    res.status(200).json({ message: "Leads deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting contacts:", error);
    res
      .status(500)
      .json({ message: "Failed to delete leads", error: error.message });
  }
};

export const processExcelData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract the uploaded Excel file from the request
    const excelFile = req.file;
    if (!excelFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Load the Excel workbook
    const workbook = xlsx.readFile(excelFile.path);

    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Extract data from the worksheet
    const leadsData: LeadAttributes[] = xlsx.utils.sheet_to_json(worksheet);

    // Validate and process each row of data
    for (let i = 0; i < leadsData.length; i++) {
      const lead = leadsData[i];
      lead.phone = lead.phone ? lead.phone.toString() : "";

      // Validate the lead data
      const validationResult = leadSchema.validate(lead, { abortEarly: false });
      if (validationResult.error) {
        return res.status(400).json({
          error: `Validation error in row ${
            i + 1
          }: ${validationResult.error.details
            .map((detail) => detail.message)
            .join("; ")}`,
        });
      }
    }

    // Insert validated lead data into the database
    await Lead.bulkCreate(leadsData);

    // Return success response
    return res.status(200).json({ message: "Leads inserted successfully" });
  } catch (error: any) {
    console.error("Error processing Excel data:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getLeadsStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day

    // Array to store hourly leads count
    const hourlyLeadsCount: { hour: number; count: number }[] = [];

    // Query to get hourly leads count for the current day
    for (let i = 0; i < 24; i++) {
      const startHour = new Date(today);
      const endHour = new Date(today);
      startHour.setHours(i, 0, 0, 0);
      endHour.setHours(i + 1, 0, 0, 0);

      const leadsCountForHour = await Lead.count({
        where: {
          createdAt: {
            [Op.gte]: startHour,
            [Op.lt]: endHour,
          },
        },
      });

      hourlyLeadsCount.push({ hour: i, count: leadsCountForHour });
    }

    // Query to get today's leads count
    const todaysLeadsCount = await Lead.count({
      where: { createdAt: { [Op.gte]: today } },
    });

    // Query to get leads count by leadStatus
    const leadsCountByLeadStatus = await Lead.findAll({
      attributes: ["leadStatus", [Lead.sequelize.fn("COUNT", "id"), "count"]],
      group: ["leadStatus"],
    });

    // Query to get leads count by courseId and include course name
    // const leadsCountByCourseId = await LeadCourse.findAll({
    //     attributes: ['courseId', [sequelize.fn('COUNT', sequelize.col('LeadCourse.leadId')), 'count']],
    //     include: [
    //         {
    //             model: Course,
    //             attributes: ['name']
    //         }
    //     ],
    //     group: ['courseId']
    // });

    res.status(200).json({
      todaysLeadsCount,
      leadsCountByLeadStatus,
      leadsCountByCourseId: [],
      hourlyLeadsCount,
      // Add more statistics as needed
    });
  } catch (error: any) {
    console.error("Error fetching leads statistics:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const sendSlackNotification = async (
  name: string,
  email: string,
  mobile: string,
  leadStatus: string
) => {
  try {
    const payload = {
      text: "*New Lead Created!* :tada:",
      attachments: [
        {
          color: "#36a64f",
          title: "Lead Details",
          fields: [
            { title: "Name", value: name, short: true },
            { title: "Email", value: email, short: true },
            { title: "Mobile Number", value: mobile, short: true },
          ],
          footer: "CRM System",
          footer_icon:
            "https://platform.slack-edge.com/img/default_application_icon.png",
          ts: Math.floor(Date.now() / 1000),
        },
        {
          text: "Select Lead Status",
          fallback:
            "If you could read this message, your client does not support interactive messages.",
          color: "#3AA3E3",
          attachment_type: "default",
          callback_id: "lead_status_selection",
          actions: [
            {
              name: "lead_status_list",
              text: "Pick a lead status...",
              type: "select",
              options: [
                { text: "None", value: "None" },
                { text: "NotContacted", value: "NotContacted" },
                { text: "Attempted", value: "Attempted" },
                { text: "Warm Lead", value: "Warm Lead" },
                { text: "Opportunity", value: "Opportunity" },
                { text: "Attended Demo", value: "Attended Demo" },
                { text: "Visited", value: "Visited" },
                { text: "Registered", value: "Registered" },
                { text: "Cold Lead", value: "Cold Lead" },
              ],
              selected_options: [{ text: leadStatus, value: leadStatus }],
            },
          ],
        },
      ],
      user: {
        name,
        email,
        mobile,
      },
    };

    await axios.post(SLACK_WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error handling slack interaction:", error);
    throw { error: "Internal server error", message: error.message };
  }
};
