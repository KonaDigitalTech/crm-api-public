import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    // Get the JWT token from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "You can't steel my password") as { userId: string }; // Use your secret key here

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};