import { Request, Response } from 'express';
import Attendance from '../models/attendance.model';
import User from '../models/user.model';
import { Op } from 'sequelize';

// Create a new attendance record
export const createAttendance = async (req: Request, res: Response): Promise<Response> => {
    const { userId, clockIn, clockOut } = req.body;

    try {

        // Ensure the Contact table exists
        await Attendance.sync({ alter: true});

        const newAttendance = await Attendance.create({
            userId,
            clockIn,
            clockOut,
        });

        return res.status(201).json({ message: 'Attendance created successfully', attendance: newAttendance });
    } catch (error: any) {
        console.error('Error creating attendance:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all attendance records with working hours
export const getAllAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
        const attendanceRecords = await Attendance.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                },
            ]
        });
        const attendanceWithWorkingHours = calculateWorkingHours(attendanceRecords);
        return res.status(200).json({ attendance: attendanceWithWorkingHours });
    } catch (error: any) {
        console.error('Error fetching attendance records:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get attendance by userId with working hours
export const getAttendanceByUserId = async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId);

    try {
        const attendanceRecords = await Attendance.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }
            ]
        });        
        console.log(attendanceRecords);
        const attendanceWithWorkingHours = calculateWorkingHours(attendanceRecords);
        return res.status(200).json({ attendance: attendanceWithWorkingHours });
    } catch (error: any) {
        console.error('Error fetching attendance records by userId:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get attendance by ID
export const getAttendanceById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);

    try {
        const attendanceRecord = await Attendance.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }
            ]
        });
        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance not found' });
        }
        const attendanceWithWorkingHours = calculateWorkingHours([attendanceRecord]);
        return res.status(200).json({ attendance: attendanceWithWorkingHours[0] });
    } catch (error) {
        console.error('Error fetching attendance by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an attendance record
export const updateAttendance = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    const { clockIn, clockOut } = req.body;

    try {
        const attendanceRecord = await Attendance.findByPk(id);
        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        attendanceRecord.clockIn = clockIn;
        attendanceRecord.clockOut = clockOut;
        await attendanceRecord.save();

        return res.status(200).json({ message: 'Attendance updated successfully', attendance: attendanceRecord });
    } catch (error: any) {
        console.error('Error updating attendance record:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete an attendance record
export const deleteAttendance = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);

    try {
        const attendanceRecord = await Attendance.findByPk(id);
        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        await attendanceRecord.destroy();

        return res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting attendance record:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deleteAttendances = async (req: Request, res: Response) => {
    const idsString = req.query.ids as string;
    const ids = idsString.split(',').map(id => parseInt(id, 10));
    try {
        const deletedRowCount = await Attendance.destroy({ where: { id: { [Op.in]: ids } } });
        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Attendance not found' });
        }
        res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting attendance:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Calculate working hours for all attendance records
const calculateWorkingHours = (attendanceRecords: any[]): any[] => {
    return attendanceRecords.map(attendance => {
        if (attendance.clockIn && attendance.clockOut) {
            const clockIn = new Date(attendance.clockIn);
            const clockOut = new Date(attendance.clockOut);
            const diffInMilliseconds = clockOut.getTime() - clockIn.getTime();
            const workingHours = diffInMilliseconds / (1000 * 60 * 60);
            return { ...attendance.toJSON(), workingHours };
        } 
        return attendance;
    });
};
