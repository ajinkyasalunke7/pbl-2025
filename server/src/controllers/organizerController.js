import {
  Hackathon,
  Project,
  Prize,
  Winner,
  JudgeAssignment,
} from "../models/index.js";

export const createHackathon = async (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    max_team_size,
    registration_start_date,
    registration_end_date,
  } = req.body;
  try {
    const hackathon = await Hackathon.create({
      organizer_id: req.user.user_id,
      title,
      description,
      start_date,
      end_date,
      max_team_size,
      registration_start_date,
      registration_end_date,
    });
    res.status(201).json({
      success: true,
      data: hackathon,
      message: "Hackathon created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

export const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.findAll({
      where: { organizer_id: req.user.user_id },
    });
    res.json({
      success: true,
      data: hackathons,
      message: "Hackathons retrieved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

export const getHackathonProjects = async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await Project.findAll({ where: { hackathon_id: id } });
    res.json({
      success: true,
      data: projects,
      message: "Projects retrieved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

export const assignJudge = async (req, res) => {
  const { id } = req.params;
  const { judge_id } = req.body;
  try {
    await JudgeAssignment.create({ judge_id, hackathon_id: id });
    res.json({ success: true, message: "Judge assigned successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

export const addPrize = async (req, res) => {
  const { id } = req.params;
  const { prize_name, description, position } = req.body;
  try {
    const prize = await Prize.create({
      hackathon_id: id,
      prize_name,
      description,
      position,
    });
    res.status(201).json({
      success: true,
      data: prize,
      message: "Prize added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

export const declareWinner = async (req, res) => {
  const { id } = req.params;
  const { prize_id, team_id } = req.body;
  try {
    const winner = await Winner.create({ prize_id, team_id });
    res.status(201).json({
      success: true,
      data: winner,
      message: "Winner declared successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};
