import express from "express";
const responseRouter = express.Router();

import {
  respond,
  getAllResponses,
  getResponsesByAgent,
  getResponsesByComplaint,
  getResponseById,
  updateResponse,
} from "../controllers/reponseController.js";

import { verifyToken } from "../middleWare/verifyToken.js";
import { isAdmin } from "../middleWare/isAdmin.js";

// POST - Agent responds to a complaint
responseRouter.post("/respond", verifyToken, respond);

// GET - All responses (admin use)
responseRouter.get("/all", verifyToken, getAllResponses);

// GET - Responses by the current agent
responseRouter.get("/by-agent", verifyToken, getResponsesByAgent);

// GET - Responses by complaint ID
responseRouter.get("/by-complaint/:id", verifyToken, getResponsesByComplaint);

// GET - Response by response ID
responseRouter.get("/:id", verifyToken, getResponseById);

// PUT - Update a response by ID (agent who created it)
responseRouter.put("/update/:id", verifyToken, updateResponse);

export default responseRouter;
