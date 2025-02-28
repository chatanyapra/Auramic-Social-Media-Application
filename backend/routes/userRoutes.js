import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserForSidebar, auramicaiTextExtract } from "../controller/userController.js";
import upload from "../middleware/fileUpload.js"

const router = express.Router();

router.get("/", protectRoute, getUserForSidebar)


router.post("/extract-text", protectRoute, upload.single('file'),auramicaiTextExtract)



export default router;