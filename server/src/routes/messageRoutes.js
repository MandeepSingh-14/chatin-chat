import { Router } from "express";
import { Auth } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = Router()

router.route("/").post(Auth,sendMessage)
router.route("/:chatId").get(Auth,getMessages)

export default router