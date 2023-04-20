
import mongoose from "mongoose";

export const User = mongoose.model("user", {
  name: {
    type: String,
    required: true,
  },
  friend_list: {
    type: Array
  },
  block :{
    type: Boolean,
    default:false
  },
  status: {
    type: Boolean,
    default:false
  }

});