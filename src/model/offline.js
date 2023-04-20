import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


export const Offline = mongoose.model("offline", {

  receiver: {
    type: ObjectId
  },
  event:{
    type: String
  },
  message : {
    type : String
  }
});
