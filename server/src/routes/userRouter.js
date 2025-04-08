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
import { authenticate, restrictToOrganizer } from "../utils/helper.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/hackathons", authenticate, getHackathons);
router.post("/enroll", authenticate, enrollInHackathon);
router.put("/teams/:id/members", authenticate, updateTeamMembers);
router.get("/teams/:id/members", authenticate, getTeamMembers);
router.post(
   "/teams/:id/members/:memberId/resend",
   authenticate,
   resendInvitation
);
router.get("/invitation/accept/:token", acceptInvitation);
router.put("/profile", authenticate, updateProfile);
router.get("/teams/:id", authenticate, getTeamDetails);
router.post("/projects", authenticate, submitProject);
router.get("/profile", getProfile);

export default router;
