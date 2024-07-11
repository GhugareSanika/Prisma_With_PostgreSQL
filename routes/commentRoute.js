import { Router } from "express";
import { createComment, fetchComment, updateComment, showComment, deleteComment } from "../Controller/CommentController.js";

const router = Router()

router.get("/", fetchComment);
router.get("/:id", showComment);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;