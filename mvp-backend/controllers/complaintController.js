import { Complaint } from "../models/complaintModel.js";
import { verifyToken } from "../middleWare/verifyToken.js";
//import { Fund } from "../models/fundsModel.js";
import { User } from "../models/userModel.js";


export const sendComplaint = async (req, res) => {
  try {
    // Run verifyToken first, then our async callback
    verifyToken(req, res, async () => {
      const { name, idno, complaint, paymentWay, board } = req.body;
      const userId = req.userId;

      // Optional: validate that req.userId matches idno
      const user = await User.findById(userId);
      if (!user || user.idno !== idno) {
        return res.status(400).json({ error: "Invalid user or id number" });
      }

      // Create complaint with owner set
      const newComplaint = await Complaint.create({
        name,
        idno,
        complaintOwner: userId,
        complaint,
        paymentWay,
        board,
      });

      res.status(201).json(newComplaint);
    });
  } catch (error) {
    console.error("Error in sendComplaint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Getting complaints made by a particular user
export const getComplaintsForMember = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const userId = req.userId;
      const userComplaint = await Complaint.find({ complaintOwner: userId }).populate('complaintOwner');
      res.status(200).json(userComplaint);
    });
  } catch (error) {
    console.error("Error fetching client complaints:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All complaints
export const getAll = async (req, res) => {
  try {
    let allComplaints = await Complaint.find({});
    res.status(200).json(allComplaints);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET complaint for a particulart agent
export const getComplaintsForAgent = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const user = await User.findById(req.userId);
      if (
        !user ||
        typeof user.role !== "string" ||
        !user.role.startsWith("agent_")
      ) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Derive the agent’s board code from their role.
      // E.g. role "agent_rdb" → boardCode "rdb"
      const boardCode = user.role.split("_")[1].toLowerCase();

      const complaints = await Complaint
        .find({ board: boardCode })
        .populate("complaintOwner", "name email");

      res.status(200).json(complaints);
    });
  } catch (err) {
    console.error("Error in getComplaintsForAgent:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};