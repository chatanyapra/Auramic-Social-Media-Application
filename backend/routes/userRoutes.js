import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserForSidebar, auramicaiTextExtract, uploadCoverImage, uploadProfileImage, updateUserBio, getUserProfileData, getUserProfileDataById } from "../controller/userController.js";
import upload from "../middleware/fileUpload.js"

const router = express.Router();

router.get("/", protectRoute, getUserForSidebar)
router.get("/profile", protectRoute, getUserProfileData)
router.get("/profile/:userId", protectRoute, getUserProfileDataById)
router.put("/update-bio", protectRoute, updateUserBio)
router.post("/extract-text", protectRoute, upload.single('file'),auramicaiTextExtract)
router.put("/upload-cover-image", protectRoute, upload.single('file'),uploadCoverImage)
router.put("/upload-profile-image", protectRoute, upload.single('file'),uploadProfileImage)


export default router;