import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    agentId: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    responseOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint", 
      required: true,
    },
  },
  { timestamps: true }
);

export const Response = mongoose.model("Response", responseSchema);
