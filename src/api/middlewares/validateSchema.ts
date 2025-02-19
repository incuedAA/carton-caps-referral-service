import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ErrorResponse, createErrorResponse } from "../dtos/error.dto";

/** Middleware to validate the request body using class-validator and class-transformer
 *
 * @param dtoClass
 * @returns
 */
export const validateRequest = <T extends object>(dtoClass: new () => T) => {
  return async (
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction,
  ) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      console.error(JSON.stringify(errors));
      const validationErrors = errors.map((error) => {
        // Handle nested validation errors
        if (error.children && error.children.length > 0) {
          return {
            property: error.property,
            errors: error.children.map((childError) => ({
              property: childError.property,
              constraints: Object.values(childError.constraints || {}).join(
                ", ",
              ),
            })),
          };
        }
        // Handle direct validation errors
        return {
          property: error.property,
          constraints: Object.values(error.constraints || {}).join(", "),
        };
      });
      return res
        .status(422)
        .json(createErrorResponse(JSON.stringify(validationErrors)));
    }

    req.body = dtoInstance;
    next();
  };
};
