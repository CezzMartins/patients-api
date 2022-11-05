import cors from "cors";
import express, { Application, Request, Response } from "express";
import ip from "ip";
import { HttpResponse } from "./domain/HttpResponse";
import { Code } from "./enum/code.enum";
import { Status } from "./enum/status.enum";
import patientsRoutes from "./routes/patient.routes";

export class App {
    private readonly app: Application;
    private readonly APPLICATION_RUNNING = "Application is running on: ";
    private readonly ROUTE_NOT_FOUN = "SERVICE IS NOT FOUND!";

    constructor(private readonly port: (string | number) = process.env.SERVER_PORT || 5000){
        this.app = express(); //create server
        this.middleWare();
        this.routes();
    }

    listen(): void {
        this.app.listen(this.port, () => console.log(`Server on port: ${this.port}`));
        console.log(`${this.APPLICATION_RUNNING}, ${ip.address()}:${this.port}`);
    }

    private routes(): void {
        this.app.use("/patients", patientsRoutes);
        this.app.get("/", (_: Request, response: Response) => response.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Welcome to * PATIENTS API * version 1.0.0')));
        this.app.all("*", (_: Request, response: Response) => response.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUN)));
    }

    private middleWare(): void {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.json());
    }
}