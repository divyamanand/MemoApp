import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be at least 6 characters"]
    },

    k_vals: {
      type: Map,
      of: Number,
      default: () => ({ hard: 1, medium: 1, easy: 2 }),
    },

    c_vals: {
      type: Map,
      of: Number,
      default: () => ({ hard: 1.3, medium: 1.7, easy: 2 }),
    },

    iterations: {
      type: Map,
      of: Number,
      default: () => ({ hard: 25, medium: 13, easy: 10 }),
    },

    streakCount : {
      type: Number,
      default: 0
    },

    lastPOTDDate: {
      type: Date,
    },

    targetDate: {
      type: Date,
    },

    maximumHours: {
      type: Number
    },

    currentPOTD: {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      assignedAt: { type: Date, default: Date.now },
      completed: { type: Boolean, default: false },
    },

    refreshToken: {
      type: String
    },
    
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name
  },
  process.env.ACCESS_TOKEN_KEY,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name
  },
  process.env.REFRESH_TOKEN_KEY,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  })
}

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema);

