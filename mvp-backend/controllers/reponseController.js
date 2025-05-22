import { Response } from "../models/reponseModel.js";
import { User } from "../models/userModel.js";
import { verifyToken } from "../middleWare/verifyToken.js";
import { Complaint } from "../models/complaintModel.js";

// Note: verifyToken should be used as Express middleware in your routes, not inside controller

// POST /responses/respond
// POST /responses/respond
export const respond = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { complaintId, response: responseText } = req.body;

      if (!complaintId || !responseText) {
        return res.status(400).json({ error: "complaintId and response are required" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const newResponse = await Response.create({
        name: user.name,
        agentId: user._id.toString(),
        responseOwner: user._id,
        complaint: complaintId,
        response: responseText,
      });

      // Use populate with execPopulate
      const populatedResponse = await Response.findById(newResponse._id)
        .populate("responseOwner", "name email")
        .populate("complaint");

      res.status(201).json(populatedResponse);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// GET /responses - all responses
export const getAllResponses = async (req, res) => {
  try {
    const all = await Response.find({})
      .populate("responseOwner", "name email")
      .populate("complaint");
    res.status(200).json(all);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /responses/agent - responses by current agent
export const getResponsesByAgent = async (req, res) => {
  try {
    const responses = await Response.find({ agentId: req.userId })
      .populate("responseOwner", "name email")
      .populate("complaint");
    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /responses/complaint/:id - responses by complaint id
export const getResponsesByComplaint = async (req, res) => {
  try {
    const { id: complaintId } = req.params;
    const responses = await Response.find({ complaint: complaintId })
      .populate("responseOwner", "name email")
      .populate("complaint");
    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /responses/:id - response by id
export const getResponseById = async (req, res) => {
  try {
    const resp = await Response.findById(req.params.id)
      .populate("responseOwner", "name email")
      .populate("complaint");
    if (!resp) {
      return res.status(404).json({ error: "Response not found" });
    }
    res.status(200).json(resp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /responses/:id - update response (only by creator)
export const updateResponse = async (req, res) => {
  try {
    const resp = await Response.findById(req.params.id);
    if (!resp) {
      return res.status(404).json({ error: "Response not found" });
    }
    if (resp.agentId !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    resp.response = req.body.response ?? resp.response;
    const updated = await resp.save();

    await updated
      .populate("responseOwner", "name email")
      .populate("complaint");

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
