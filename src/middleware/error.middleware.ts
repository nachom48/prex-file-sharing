import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../common/exceptions/custom-error';
import { ValidationError } from 'class-validator';

const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('Error captured in middleware:', error); // Debugging

    if (error instanceof CustomError) {
        console.log('CustomError detected:', error.message); // Debugging
        return res.status(error.statusCode).json({ message: error.message });
    }

    if (Array.isArray(error) && error[0] instanceof ValidationError) {
        const validationErrors = error.map((err: ValidationError) => Object.values(err.constraints || {})).flat();
        return res.status(400).json({ message: validationErrors });
    }

    return res.status(500).json({ message: 'Internal server error' });
};

export default errorMiddleware;
