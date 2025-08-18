import { Router } from "express";
import { currentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserDetails } from "../controller/user.controller.js";
import {verifyJWT} from "../middleware/verifyJWT.middleware.js"

const router = Router()

router.post("/register", registerUser)
router.post("/login",  loginUser)
router.post("/logout", verifyJWT, logoutUser)
router.get("/getCurrentUser", verifyJWT, currentUser)
router.post("/refresh-token", refreshAccessToken)
router.patch("/update", verifyJWT, updateUserDetails)


export default router