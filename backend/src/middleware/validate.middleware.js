import { validationResult } from 'express-validator';
import { ApiError } from './error.middleware.js';

/**
 * Validation Result Handler
 * Checks for validation errors and returns formatted response
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    throw new ApiError(400, 'Validation failed', formattedErrors);
  }
  
  next();
};
