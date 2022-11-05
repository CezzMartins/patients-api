import { Request, Response } from "express";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../config/mysql.config";
import { HttpResponse } from "../domain/HttpResponse";
import { Code } from "../enum/code.enum";
import { Status } from "../enum/status.enum";
import { Patient } from "../interface/patient";
import { QUERY } from "../query/patient.query";

type ResultSet = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]];

export const getPatients = async(request: Request, response: Response): Promise<Response<Patient[]>> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${request.method}${request.originalUrl} Request from ${request.rawHeaders[0]} ${request.rawHeaders[1]}`);
    try{
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENTS);
        return response.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, "Patients retrieved.", result[1]));
    } catch(error: unknown) {
        console.error(error);
        return response.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "An error occurred."));
    }
    
};