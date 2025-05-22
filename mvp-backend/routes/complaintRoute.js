
import express  from "express";
const complaintRouter = express.Router();

import {sendComplaint,getAll,getComplaintsForMember, getComplaintsForAgent}from "../controllers/complaintController.js"
import { isAdmin } from "../middleWare/isAdmin.js";
import protect from "../middleWare/authMiddleware.js";
import { verifyToken } from "../middleWare/verifyToken.js";


//End points.
complaintRouter.get("/getall", getAll, verifyToken);
complaintRouter.get("/getclientcomplaints", getComplaintsForMember, verifyToken);
complaintRouter.post("/send",sendComplaint, verifyToken);
complaintRouter.get("/agent", getComplaintsForAgent);
// complaintRouter.put("/update/:id", updateLoan, verifyToken, isAdmin);
// complaintRouter.get("/getById/:id", getbyId, verifyToken,isAdmin);


export default complaintRouter;
            