import express from "express";
import {
  createHackathon,
  getHackathons,
  getHackathonProjects,
  assignJudge,
  addPrize,
  declareWinner,
} from "../controllers/organizerController.js";

const router = express.Router();

router.post("/hackathons", createHackathon);
router.get("/hackathons", getHackathons);
router.get("/hackathons/:id/projects", getHackathonProjects);
router.post("/hackathons/:id/judges", assignJudge);
router.post("/hackathons/:id/prizes", addPrize);
router.post("/hackathons/:id/winners", declareWinner);

export default router;
