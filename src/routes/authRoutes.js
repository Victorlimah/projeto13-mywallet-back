import { Router } from "express";
import { singIn, singUp } from "./../controllers/authController.js";

import {
  validateLogin,
  validateRegister,
} from "../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/sing-in", validateLogin, singIn);
authRoutes.post("/sing-up", validateRegister, singUp);

export default authRoutes;
