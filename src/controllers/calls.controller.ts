import { Request, Response } from "express";
import Call from "../models/call.model";
import axios from "axios";
import User from "../models/user.model";

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      callerid,
      to,
      status,
      user,
      user_no,
      time,
      direction,
      answeredsec,
      record,
      filename,
    } = req.body;

    Call.sync({ alter: true });

    // Create the call record in the database
    await Call.create({
      callerId: callerid,
      to: to,
      status,
      agentId: user,
      userNo: user_no,
      time,
      direction,
      answeredSeconds: answeredsec,
      isRecorded: record,
      filename,
    });

    //Triggering the Python API
    const pythonApiUrl = "https://api.dev.ai.crm.skillcapital.ai/process-phone-number"; // Replace with your Python API URL
    const response = await axios.post(pythonApiUrl, {
      phone: to.toString(), 
    });

    console.log(response);
    
    return res
      .status(200)
      .json({ message: "Call details saved successfully." });
  } catch (error: any) {
    console.log(error);
    console.error("Error sending call details:", error.toString());
    return res
      .status(500)
      .json({ message: "Error sending call details.", error: error.message });
  }
};

export const createCall = async (req: Request, res: Response): Promise<Response> => {
  try {
      const newCall = await Call.create(req.body);
      return res.status(201).json(newCall);
  } catch (error: any) {
      console.error('Error creating call:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateCall = async (req: Request, res: Response): Promise<Response> => {
  try {
      const callId = parseInt(req.params.id, 10);
      const [updated] = await Call.update(req.body, { where: { id: callId } });

      if (!updated) {
          return res.status(404).json({ message: 'Call not found' });
      }

      const updatedCall = await Call.findByPk(callId);
      return res.status(200).json(updatedCall);
  } catch (error: any) {
      console.error('Error updating call:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getCalls = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let phoneNo: string | undefined = undefined;
  let status: string | undefined = undefined;

  // Parse phoneNo and status query parameters
  if (req.query.phoneNo) {
    phoneNo = req.query.phoneNo as string;
    // Optionally, you can add additional validation for the phone number format here
  }
  if (req.query.status) {
    status = req.query.status as string;
  }

  try {
    // Construct the where clause based on provided filters
    let whereClause: any = {};
    if (phoneNo !== undefined) {
      whereClause.to = phoneNo;
    }
    if (status !== undefined) {
      whereClause.status = status;
    }

    // Retrieve calls based on the constructed where clause
    const calls = await Call.findAll({ where: whereClause });
    return res.status(200).json({ calls });
  } catch (error: any) {
    console.error("Error fetching calls by lead phone no:", error.toString());
    return res.status(500).json({
      message: "Error fetching calls by lead no.",
      error: error.message,
    });
  }
};

export const agentLogin = async (userId: number): Promise<any> => {
  try {
    const userInfo: any = await User.findByPk(userId);
    console.log(userInfo);
    if (userInfo && userInfo.teleCMIAgentId && userInfo.teleCMIPassword) {
      const { data } = await axios.post(
        "https://piopiy.telecmi.com/v1/agentLogin",
        {
          id: userInfo?.teleCMIAgentId,
          password: userInfo?.teleCMIPassword,
        }
      );
      return data;
    } else {
      return {};
    }
  } catch (error) {
    // Handle error
    throw error;
  }
};

export const connect = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { agentId, token, to } = req.body;

    const { data } = await axios.post(
      "https://piopiy.telecmi.com/v1/adminConnect",
      {
        agent_id: agentId,
        // token: "da94074c-84ea-4aa9-8ded-80a9854f39ef",
        token: "2f7c9d96-bb83-4ff6-b5cd-cc49a3dcf08a",
        to,
        custom: "Custom Parameter",
      }
    );
    if (data.code === 401) {
      return res.status(401).json({ message: "Failed to initiate call." });
    }

    return res
      .status(200)
      .json({ message: "Call initiated successfully.", data });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error initiating call.", error: error.message });
  }
};

export const download = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fileName } = req.query;

    const { data } = await axios.get(
      `https://piopiy.telecmi.com/v1/play?appid=2226954&token=2f7c9d96-bb83-4ff6-b5cd-cc49a3dcf08a&file=${fileName}`,
      {
        responseType: "arraybuffer",
      }
    );

    // Set appropriate response headers for file download
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Send the file data in the response
    return res.send(data);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error initiating call.", error: error.message });
  }
};
