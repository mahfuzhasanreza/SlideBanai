import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if a user is authenticated
 * @param req Express request
 * @param res Express response
 * @param next Next function
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): any {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}