import { Router } from "express";
import { currentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controller/user.controller.js";
import { existingUserCheck } from "../middleware/existingCheck.middleware.js";
import {verifyJWT} from "../middleware/verifyJWT.middleware.js"


const router = Router()

router.post("/register", existingUserCheck, registerUser)
router.post("/login", existingUserCheck, loginUser)
router.post("/logout", verifyJWT, logoutUser)
router.get("/getCurrentUser", verifyJWT, currentUser)
router.post("/refresh-token", refreshAccessToken)


export default router