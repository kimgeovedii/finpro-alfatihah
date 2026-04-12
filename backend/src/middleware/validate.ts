import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).send({ errors: result.error.issues });
      }
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
