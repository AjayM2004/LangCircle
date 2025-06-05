import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  login,
  logout,
  signup,
  onboard,
} from "../controllers/auth.controller.js";
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);
//forget-password
//reset-password

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ user: req.user });
});
export default router;
//
// This code defines an Express router for authentication routes.
