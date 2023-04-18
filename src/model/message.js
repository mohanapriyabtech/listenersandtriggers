import mongoose from "mongoose";

export const Message = mongoose.model("message", {
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  message_status:{
    type: String,
    default:"sent"
  }
});
