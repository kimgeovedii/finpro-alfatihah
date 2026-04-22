import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger"

// global router aggregates all feature routers
import globalRouter from "./router";
import { success } from "zod";
import { sendError } from "./utils/apiResponse";
import { Prisma } from "@prisma/client";
import { CartCron } from "./features/carts/crons/cart.cron";
import { OrderCron } from "./features/orders/crons/order.cron";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureCron()
    this.errorHandler()
  }

  private configureMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  private configureRoutes() {
    this.app.use("/api", globalRouter);

    // Swagger
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    
    this.app.get("/", (req: Request, res: Response) => {
      res.send({ status: "ok" });
    });
  }

  private configureCron() {
    const cartCron = new CartCron()
    const orderCron = new OrderCron()
    
    cartCron.start()
    orderCron.start()
  }

  // Error handling
  private errorHandler = () => {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      // Zod validation error handler
      if (err instanceof ZodError) {
        const structuredErrors = err.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))
        const sentence = structuredErrors.map(e => `${e.field}: ${e.message}`).join(", ")

        return sendError(res, {
          message: sentence,
          errors: structuredErrors
        }, 400)
      }
      
      // Multer file upload limit size
      if (err.code === "LIMIT_FILE_SIZE") return sendError(res, "File size exceeds 2MB limit", 400)

      // Prisma error handler
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002': 
            return sendError(res, "Duplicate entry", 409)
          case 'P2003': 
            return sendError(res, "Related record not found", 409)
          case 'P2025': 
            return sendError(res, "Record not found", 404)
          default:      
            return sendError(res, "Database error", 500)
        }
      }

      const statusCode = err.status || err.code || 500
      console.log(err)
      // Audit server error
      if (statusCode === 500) return sendError(res, "Something went wrong", 500)

      return sendError(res, err.message, statusCode)
    })
  }

  public start(port: number | string = process.env.PORT || 3000) {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

const server = new App();
server.start();

export default server;
