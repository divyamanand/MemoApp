import { ApiError } from "../utils/ApiError.js";
import { User } from "../schema/userSchema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";

// Utility to generate access + refresh tokens
const generateAccessAndRefreshTokens = async id => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "No user to generate tokens");
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  console.log(refreshToken, accessToken);
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

// Register user controller
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const clientType = req.get("x-client-type");

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are Required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create({ name, email, password });
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Error in creating account. Please try again.");
  }

  if (clientType === "mobile") {
    return res.status(201).json(
      new ApiResponse(200, { createdUser, accessToken }, "User Created Successfully")
    );
  }

  const options = { httpOnly: true, secure: true };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

// Login user controller
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const clientType = req.get("x-client-type");

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Email and Password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  if (clientType === "mobile") {
    return res.status(200).json(
      new ApiResponse(200, { loggedInUser, accessToken }, "User Logged In Successfully")
    );
  }

  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User Logged In Successfully"));
});


export const currentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "Login or create a new account");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current User Found Successfully"));
});

// Logout controller
export const logoutUser = asyncHandler(async (req, res) => {
  const clientType = req.get("x-client-type");

  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  const options = { httpOnly: true, secure: true };

  if (clientType === "mobile") {
    return res.status(200).json(new ApiResponse(200, {}, "User logged out"));
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// Refresh token controller
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const clientType = req.get("x-client-type");

  if (!refreshToken) throw new ApiError(401, "Refresh Token Missing. Login Again");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
  } catch {
    throw new ApiError(403, "Invalid Refresh Token");
  }

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== refreshToken)
    throw new ApiError(403, "Refresh Token Didn't Match. Unauthorized Request");

  const {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  } = await generateAccessAndRefreshTokens(user._id);

  const opts = { httpOnly: true, secure: true };

  if (clientType === "mobile") {
    return res
      .status(200)
      .json(new ApiResponse(200, { accessToken: newAccessToken }, "Access Token Refreshed"));
  }

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, opts)
    .cookie("refreshToken", newRefreshToken, opts)
    .json(new ApiResponse(200, { accessToken: newAccessToken }, "Access Token Refreshed"));
});

// Update user controller
export const updateUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;
  const clientType = req.get("x-client-type");

  if (!user) throw new ApiError(401, "Login to update details");

  const { name, email, k_vals, c_vals, iterations } = req.body;

  if (!name && !email && !k_vals && !c_vals && !iterations) {
    throw new ApiError(400, "Nothing to Update");
  }

  const updates = {};
  if (name) updates.name = name;
  if (email) {
    const emailExist = await User.findOne({ email }).lean();
    if (emailExist && emailExist._id.toString() !== user._id.toString())
      throw new ApiError(400, "Email already exists. Can't be updated!");
    updates.email = email;
  }
  if (k_vals) updates.k_vals = k_vals;
  if (c_vals) updates.c_vals = c_vals;
  if (iterations) updates.iterations = iterations;

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User details updated"));
});
