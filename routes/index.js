import { Router } from "express";
import UserRoutes from "./userRoutes.js"
import PostRoutes from "./postRoutes.js"
import CommentRoutes from "./commentRoute.js"

const router = Router()

//For User Routes
router.use("/api/user", UserRoutes)

//For Post Routes
router.use("/api/post", PostRoutes)

//For Comment Routes
router.use("/api/comment", CommentRoutes)

export default router