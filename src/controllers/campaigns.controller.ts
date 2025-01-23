import { Request, Response } from "express";
import Campaign from "../models/campaign.model";
import User from "../models/user.model";

// Create a new campaign
export const createCampaign = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    name,
    status,
    type,
    campaignDate,
    endDate,
    campaignOwner,
    phone,
    courseId,
    active,
    amountSpent,
  } = req.body;

  try {
    // Ensure the Campaign table exists
    await Campaign.sync({ alter: true });

    // Create the campaign
    const newCampaign = await Campaign.create(req.body);

    return res.status(201).json({
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get all campaigns
export const getAllCampaigns = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract optional filters from query parameters
    const { status, campaignOwner, courseId } = req.query;

    // Build the query conditions
    const queryConditions: any = {
      where: {},
      include: [
        {
          model: User,
          as: "campaignOwnerName", // Use the alias defined in your association
          attributes: ["id", "username"], // Select specific attributes from the User table
        },
      ],
      order: [["createdAt","DESC"]],
    };

    // Apply status filter if provided
    if (status) {
      queryConditions.where = { ...queryConditions.where, status };
    }

    // Apply campaignOwner filter if provided
    if (campaignOwner) {
      queryConditions.where = { ...queryConditions.where, campaignOwner };
    }

    // Apply courseId filter if provided
    if (courseId) {
      queryConditions.where = { ...queryConditions.where, courseId };
    }

    const campaigns = await Campaign.findAll(queryConditions);
    return res.status(200).json({ campaigns });
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get campaign by ID
export const getCampaignById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);
  try {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    return res.status(200).json({ campaign });
  } catch (error: any) {
    console.error("Error fetching campaign by ID:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update a campaign
export const updateCampaign = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);
  const {
    name,
    status,
    type,
    campaignDate,
    endDate,
    campaignOwner,
    phone,
    courseId,
    active,
    amountSpent,
    description,
  } = req.body;

  try {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Update campaign fields
    campaign.name = name;
    campaign.status = status;
    campaign.type = type;
    campaign.campaignDate = campaignDate;
    campaign.endDate = endDate;
    campaign.campaignOwner = campaignOwner; // New field
    campaign.phone = phone;
    campaign.courseId = courseId;
    campaign.active = active;
    campaign.amountSpent = amountSpent;
    campaign.description = description;

    await campaign.save();

    return res
      .status(200)
      .json({ message: "Campaign updated successfully", campaign });
  } catch (error: any) {
    console.error("Error updating campaign:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Delete campaigns
export const deleteCampaigns = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract and parse the ids from query params
    const ids = req.query.ids as string; // expecting something like "?ids=1,2,3"
    const campaignIds = ids.split(",").map((id) => parseInt(id.trim(), 10));

    // Find the campaigns to delete
    const campaigns = await Campaign.findAll({
      where: {
        id: campaignIds,
      },
    });

    if (campaigns.length === 0) {
      return res
        .status(404)
        .json({ message: "No campaigns found with the provided IDs" });
    }

    // Delete the campaigns
    await Campaign.destroy({
      where: {
        id: campaignIds,
      },
    });

    // Return success response
    return res.status(200).json({ message: "Campaigns deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting campaigns:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
