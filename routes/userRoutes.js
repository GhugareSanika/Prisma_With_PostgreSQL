import { Router } from "express";
import { createUser,fetchUsers,updateUser,showUser,deleteUser } from "../Controller/UserController.js";

const router = Router()

router.get("/", fetchUsers);
router.get("/:id", showUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;