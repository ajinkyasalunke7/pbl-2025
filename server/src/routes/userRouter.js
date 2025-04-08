import express from "express";
import {
  register,
  login,
  getHackathons,
  enrollInHackathon,
  updateTeamMembers,
  getTeamMembers,
  resendInvitation,
  acceptInvitation,
  updateProfile,
  getTeamDetails,
  submitProject,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/hackathons", getHackathons);
router.post("/enroll", enrollInHackathon);
router.put("/teams/:id/members", updateTeamMembers);
router.get("/teams/:id/members", getTeamMembers);
router.post("/teams/:id/members/:memberId/resend", resendInvitation);
router.get("/invitation/accept/:token", acceptInvitation);
router.put("/profile", updateProfile);
router.get("/teams/:id", getTeamDetails);
router.post("/projects", submitProject);

export default router;
