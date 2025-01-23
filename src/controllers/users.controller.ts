import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import xlsx from "xlsx";
import { Op } from "sequelize";

import User, { UserAttributes } from "../models/user.model";
import { agentLogin } from "./calls.controller";

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract query parameters
    const { role } = req.query;

    // Prepare filter object based on provided query parameters
    const filter: any = {};
    if (role) {
      filter.role = role;
    }

    // Fetch all users from the database
    const users = await User.findAll({
      where: filter,
    });

    // Return the users in the response
    return res.status(200).json({ users });
  } catch (error) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error fetching users:", error);
    return res.status(500).json("Internal Server error");
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    // If user is not found, return 404 Not Found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user in the response
    return res.status(200).json(user);
  } catch (error) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error fetching user by ID:", error);
    return res.status(500).json("Internal Server error");
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    empCode,
    username,
    email,
    mobile,
    password,
    name,
    role,
    teleCMIAgentId,
    teleCMIPassword,
  } = req.body;

  try {
    // Ensure the User table exists
    await User.sync({ alter: true });

    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      // Username already exists, return error response
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with hashed password
    const newUser = await User.create({
      empCode,
      username,
      email,
      mobile,
      password: hashedPassword,
      name,
      role,
      teleCMIAgentId,
      teleCMIPassword,
    });

    // Return success response
    return res.status(201).json({
      message: "User created successfully",
      data: {
        id: newUser.id,
        empCode: newUser.empCode,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        name: newUser.name,
        role: newUser.role,
        teleCMIAgentId: newUser.teleCMIAgentId,
        teleCMIPassword: newUser.teleCMIPassword,
      },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    // Return error response
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // If user is not found, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, return 401 Unauthorized
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      "You can't steel my password", // Use a strong secret key
      { expiresIn: "24h" } // Token expiration time
    );

    // const teleCMIData = await agentLogin(user.id);

    return res.status(200).json({
      message: "Login successful",
      token,
      userInfo: {
        empCode: user.empCode,
        userId: user.id,
        email: user.email,
        mobile: user.mobile,
        username: user.username,
        role: user.role,
      },
      teleCMI: {
        agentId: user.teleCMIAgentId,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a user by ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract user ID from request parameters
  const id = parseInt(req.params.id);

  // Extract updated user details from request body
  const {
    name,
    empCode,
    username,
    email,
    mobile,
    password,
    role,
    teleCMIAgentId,
    teleCMIPassword,
  } = req.body;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    // If user is not found, return 404 Not Found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // let hashedPassword;
    // if (password) {
    // 	// Hash the password
    // 	hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    // } else {
    // 	hashedPassword = user.password;
    // }

    // Update user attributes
    user.empCode = empCode;
    user.name = name;
    user.username = username;
    user.email = email;
    user.mobile = mobile;
    // user.password = hashedPassword;
    user.role = role;
    user.teleCMIAgentId = teleCMIAgentId;
    user.teleCMIPassword = teleCMIPassword;

    // Save the changes to the database
    await user.save();

    // Return a JSON response with the updated user details
    return res.json({
      message: "User updated successfully",
      user: {
        id,
        empCode,
        name,
        username,
        email,
        mobile,
        role,
        teleCMIAgentId,
        teleCMIPassword,
      },
    });
  } catch (error) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error updating user:", error);
    return res.status(500).json("Internal Server error");
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract user ID from request parameters
  const id = parseInt(req.params.id);

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    // If user is not found, return 404 Not Found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.id === 1) {
      return res.status(401).json({ message: "Admin user cannot be deleted." });
    }

    // Delete the user from the database
    await user.destroy();

    // Return a JSON response indicating successful deletion
    return res
      .status(200)
      .json({ message: `User ${user.username} deleted successfully` });
  } catch (error) {
    // Handle errors, log them, and return an internal server error response
    console.error("Error deleting user:", error);
    return res.status(500).json("Internal Server error");
  }
};

export const processExcelData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract the uploaded Excel file from the request
    console.log(req.file);
    const excelFile = req.file;
    if (!excelFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Load the Excel workbook
    const workbook = xlsx.readFile(excelFile.path);

    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Extract data from the worksheet
    const userData: UserAttributes[] = xlsx.utils.sheet_to_json(worksheet);

    // Validate and process each row of data
    for (let i = 0; i < userData.length; i++) {
      const user = userData[i];
      user.name = user.name.toLowerCase();
      user.mobile = user.mobile?.toString();
      user.password = await bcrypt.hash(user.password.toString(), 10);

      // Joi schema for user data validation
      const userSchema = Joi.object({
        empCode: Joi.string().required(),
        name: Joi.string().required(),
        username: Joi.string().required(),
        mobile: Joi.string()
          .required()
          .pattern(/^[0-9]{10}$/),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("admin", "user", "salesperson").required(),
      });

      // Validate the user data
      const validationResult = userSchema.validate(user, { abortEarly: false });
      if (validationResult.error) {
        return res
          .status(400)
          .json({
            error: `Validation error in row ${
              i + 1
            }: ${validationResult.error.details
              .map((detail) => detail.message)
              .join("; ")}`,
          });
      }
    }

    // Insert validated user data into the database
    await User.bulkCreate(userData);

    // Return success response
    return res.status(200).json({ message: "Data inserted successfully" });
  } catch (error: any) {
    console.error("Error processing Excel data:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const suggestUsers = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`,
        },
      },
      limit: 10,
    });

    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
