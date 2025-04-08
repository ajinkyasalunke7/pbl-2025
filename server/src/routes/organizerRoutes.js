import express from "express";
const router = express.Router();
import * as organizerController from "../controllers/organizerController.js";

router.post("/hackathons", organizerController.createHackathon);
router.get("/hackathons", organizerController.getHackathons);
router.put("/hackathons/:id", organizerController.updateHackathon);
router.delete("/hackathons/:id", organizerController.deleteHackathon);
router.post("/hackathons/:id/judges", organizerController.assignJudge);
router.post("/hackathons/:id/prizes", organizerController.addPrize);
router.get("/hackathons/:id/projects", organizerController.getProjects);
router.post("/hackathons/:id/winners", organizerController.declareWinner);

export default router;
