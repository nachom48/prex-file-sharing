import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserDTO from '../user/dto/user.dto'; 
import { UnauthorizedException } from '../../common/exceptions/unathorized-exception';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedException('Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded as UserDTO; 
      next();
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  } catch (error) {
    return next(new UnauthorizedException('Invalid token'));
  }
};

