import mongoose from "mongoose";

const complaintSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
  },
  idno: {
    type: String,
  },
  complaintOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  complaint: {
    type: String,
  },
  paymentWay: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  board: {
    type: String,
    required: true,
  },
},
{
    timestamps: true,
});

export const Complaint = mongoose.model("Complaint", complaintSchema);
