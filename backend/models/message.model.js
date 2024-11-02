import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    file: { type: String, trim: true , default: null},
    type: { type: String, trim: true, default: null}
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;