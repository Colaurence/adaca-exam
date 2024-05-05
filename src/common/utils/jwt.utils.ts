import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

export const extractUserRole = (req: Request): string | null => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      role: string;
    };
    return decodedToken.role;
  } catch (error) {
    return null;
  }
};

export const extractUserId = (req: Request): string | null => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    return decodedToken.sub;
  } catch (error) {
    return null;
  }
};
