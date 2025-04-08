const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/hackathons", userController.getHackathons);
router.post("/teams", userController.createTeam);
router.post("/teams/:id/invite", userController.inviteToTeam);
router.get("/invitation/accept/:token", userController.acceptInvitation);
router.get("/teams/:id", userController.getTeamDetails);
router.post("/projects", userController.submitProject);
router.get("/teams", userController.getUserTeams);
router.put("/profile", userController.updateProfile);

module.exports = router;
