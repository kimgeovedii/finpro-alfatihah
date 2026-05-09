import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        return res.status(400).send({ 
          status: "error",
          message: "Validation failed",
          errors: result.error.issues 
        });
      }
      Object.defineProperty(req, source, {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};
