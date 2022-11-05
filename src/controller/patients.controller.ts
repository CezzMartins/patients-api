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
        return response.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, "Patients retrieved.", result[0]));
    } catch(error: unknown) {
        console.error(error);
        return response.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "An error occurred."));
    }
};

export const getPatient = async(request: Request, response: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${request.method}${request.originalUrl} Request from ${request.rawHeaders[0]} ${request.rawHeaders[1]}`);
    try{
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [request.params.patientId]);
        if((result[0] as Array<ResultSet>).length > 0) {
            return response.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, "Patient retrieved.", result[0]));
        } else {
            return response.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, "Patient NOT FOUND."));
        }
    } catch(error: unknown) {
        console.error(error);
        return response.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "An error occurred."));
    }
};


export const createPatient = async(request: Request, response: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${request.method}${request.originalUrl} Request from ${request.rawHeaders[0]} ${request.rawHeaders[1]}`);
    let patient: Patient = { ...request.body };
    try{
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.CREATE_PATIENT, Object.values(patient));
        patient = { id: (result[0] as ResultSetHeader).insertId, ...request.body };
        return response.status(Code.CREATED).send(new HttpResponse(Code.CREATED, Status.CREATED, "Patient Created.", patient));
    } catch(error: unknown) {
        console.error(error);
        return response.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "An error occurred."));
    }
};

export const updatePatient = async(request: Request, response: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${request.method}${request.originalUrl} Request from ${request.rawHeaders[0]} ${request.rawHeaders[1]}`);
    let patient: Patient = { ...request.body };
    try{
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [request.params.patientId]);
        if((result[0] as Array<ResultSet>).length > 0) {
            const result: ResultSet = await pool.query(QUERY.UPDATE_PATIENT, [...Object.values(patient), request.params.patientId]);
            return response.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, "Patient Updated.", {...patient, id: request.params.patientId }));
        } else {
            return response.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, "Patient NOT FOUND."));
        }
    } catch(error: unknown) {
        console.error(error);
        return response.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "An error occurred."));
    }
};

export const deletePatient = async(request: Request, response: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${request.method}${request.originalUrl} Request from ${request.rawHeaders[0]} ${request.rawHeaders[1]}`);
    try{
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [request.params.patientId]);
        if((result[0] as Array<ResultSet>).length > 0) {
            const result: ResultSet = await pool.query(QUERY.DELETE_PATIENT, [request.params.patientId]);
            return response.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, "Patient Deleted."));
        } else {
            return response.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, "Patient NOT FOUND."));
        }
    } catch(error: unknown) {
        console.error(error);
        return response.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "An error occurred."));
    }
};