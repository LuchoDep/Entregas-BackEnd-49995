import { Router } from "express";
import {
    getUsers,
    updateUser,
    deleteInactiveUsers,
    deleteUser
} from "../controllers/users.controller.js";

const router = Router();

router.get("/users", getUsers);
router.put("/updateUser/:uid", updateUser);
router.delete("/deleteUser/:uid", deleteUser);
router.delete("/deleteInactiveUser/:uid", deleteInactiveUsers)

export { router as userRouter};