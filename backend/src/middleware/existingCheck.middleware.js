import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../schema/userSchema.js";

export const existingUserCheck = asyncHandler(async (req, _, next) => {

  const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ", "")

  if (!token) return next();

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (decodedToken && decodedToken._id) {
      const user = await User.findById(decodedToken._id)
      return next(new ApiError(400, "User already logged in"));
    }
  } catch {
    return next();
  }

  next();
});
