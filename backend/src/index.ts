import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// global router aggregates all feature routers
import globalRouter from "./router";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
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

    this.app.get("/", (req: Request, res: Response) => {
      res.send({ status: "ok" });
    });
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
