import { Router } from "express";
import { getUserByID, login, logoutUser, register, searchUsers, updateInfo } from "../controllers/userController.js";
import { Auth } from "../middleware/auth.middleware.js";
//import { upload } from "../middleware/multer.js";



const router = Router()

router.route("/register").post(register)

router.route("/login").post(login);
router.route("/logout").get(Auth,logoutUser);
router.route('/user?').get(Auth, searchUsers);
router.route('/users/:id').get(Auth,getUserByID);
router.route('/users/update').patch(Auth,updateInfo);

export default router


