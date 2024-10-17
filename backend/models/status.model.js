// import mongoose from "mongoose";

// const statusModel = mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     content: { type: String, required: true },
//     mediaUrl: { 
//       type: String, 
//       default: "https://wallpapers.com/images/featured/plain-black-background-02fh7564l8qq4m6d.jpg" 
//     },
//     expiresAt: { 
//       type: Date, 
//       default: Date.now, // Set the default to current date
//       index: { expires: '24h' } // TTL index, will expire 24 hours after creation
//     },
//   },
//   { timestamps: true }
// );

// const Status = mongoose.model("Status", statusModel);

// export default Status;
