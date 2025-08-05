import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/ApiError';

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new UnauthorizedError('Insufficient permissions'));
        }

        next();
    };
}; 