  import mongoose from "mongoose";

  const statusModel = mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      content: { type: String, required: true, default: "" },
      mediaUrl: { 
        type: String, 
        default: "https://wallpapers.com/images/featured/plain-black-background-02fh7564l8qq4m6d.jpg" 
      },
      expiresAt: { 
        type: Date, 
        default: () => Date.now() + 24 * 60 * 60 * 1000, // Set expiration 1 minute in the future
        expires: 0 // TTL index will work based on the `expiresAt` field value
      },
    },
    { timestamps: true }
  );

  statusModel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const Status = mongoose.model("Status", statusModel);

  export default Status;
