import {Router} from "express"
import { Auth } from "../middleware/auth.middleware.js"
import { accessChat, addUser, createGroup, fetchChat, kickUser, renameGroup } from "../controllers/chatController.js"

const router = Router()

router.route("/").post(Auth,accessChat)
router.route("/").get(Auth,fetchChat)
router.route("/group").post(Auth,createGroup)
router.route("/rename").put(Auth,renameGroup)
router.route("/add").put(Auth,addUser)
router.route("/kick").put(Auth,kickUser)


export default router;