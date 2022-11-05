import { Router } from "express";
import { createPatient, deletePatient, getPatient, getPatients, updatePatient } from "../controller/patients.controller";

const patientsRoutes = Router();

patientsRoutes.route('/').get(getPatients).post(createPatient);
patientsRoutes.route('/:patientId').get(getPatient).put(updatePatient).delete(deletePatient);

export default patientsRoutes;