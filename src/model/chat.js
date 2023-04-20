import mongoose from "mongoose";

export const Chat = mongoose.model("chat", {
  data: {
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
  status:{
    type: Number,
    default:1
  },
  message_type : {
    type :String
  }
});
