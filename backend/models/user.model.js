import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    status: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    }],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true } // Fixed typo here
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    return next(); // Ensure to return next to stop execution
  }

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt); // Ensure password is hashed correctly
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
