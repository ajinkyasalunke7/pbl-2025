import {
  Hackathon,
  User,
  JudgeAssignment,
  Prize,
  Winner,
  Project,
} from "../models";
import { Op } from "sequelize";

const createHackathon = async (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    location,
    is_virtual,
    max_team_size,
    registration_start_date,
    registration_end_date,
  } = req.body;
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    const hackathon = await Hackathon.create({
      title,
      description,
      start_date,
      end_date,
      location,
      is_virtual,
      max_team_size,
      registration_start_date,
      registration_end_date,
      organizer_id: req.user.user_id,
    });
    res
      .status(201)
      .json({
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

const getHackathons = async (req, res) => {
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
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

const updateHackathon = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    const [updated] = await Hackathon.update(req.body, {
      where: { hackathon_id: id, organizer_id: req.user.user_id },
    });
    if (!updated)
      return res
        .status(404)
        .json({
          success: false,
          message: "Hackathon not found or not authorized",
        });
    const hackathon = await Hackathon.findByPk(id);
    res.json({
      success: true,
      data: hackathon,
      message: "Hackathon updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const deleteHackathon = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    const deleted = await Hackathon.destroy({
      where: { hackathon_id: id, organizer_id: req.user.user_id },
    });
    if (!deleted)
      return res
        .status(404)
        .json({
          success: false,
          message: "Hackathon not found or not authorized",
        });
    res
      .status(204)
      .json({ success: true, message: "Hackathon deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const assignJudge = async (req, res) => {
  const { id } = req.params;
  const { judge_id } = req.body;
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    const hackathon = await Hackathon.findOne({
      where: { hackathon_id: id, organizer_id: req.user.user_id },
    });
    if (!hackathon)
      return res
        .status(404)
        .json({
          success: false,
          message: "Hackathon not found or not authorized",
        });
    const judge = await User.findOne({
      where: { user_id: judge_id, user_type: "judge" },
    });
    if (!judge)
      return res
        .status(400)
        .json({ success: false, message: "Invalid judge ID" });
    await JudgeAssignment.create({ judge_id, hackathon_id: id });
    res
      .status(201)
      .json({ success: true, message: "Judge assigned successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const addPrize = async (req, res) => {
  const { id } = req.params;
  const { prize_name, description, position } = req.body;
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    const hackathon = await Hackathon.findOne({
      where: { hackathon_id: id, organizer_id: req.user.user_id },
    });
    if (!hackathon)
      return res
        .status(404)
        .json({
          success: false,
          message: "Hackathon not found or not authorized",
        });
    const prize = await Prize.create({
      hackathon_id: id,
      prize_name,
      description,
      position,
    });
    res
      .status(201)
      .json({
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

const getProjects = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    const hackathon = await Hackathon.findOne({
      where: { hackathon_id: id, organizer_id: req.user.user_id },
    });
    if (!hackathon)
      return res
        .status(404)
        .json({
          success: false,
          message: "Hackathon not found or not authorized",
        });
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

const declareWinner = async (req, res) => {
  const { id } = req.params;
  const { prize_id, team_id } = req.body;
  try {
    if (req.user.user_type !== "organizer")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    const hackathon = await Hackathon.findOne({
      where: { hackathon_id: id, organizer_id: req.user.user_id },
    });
    if (!hackathon)
      return res
        .status(404)
        .json({
          success: false,
          message: "Hackathon not found or not authorized",
        });
    const prize = await Prize.findOne({
      where: { prize_id, hackathon_id: id },
    });
    const team = await Team.findOne({ where: { team_id, hackathon_id: id } });
    if (!prize || !team)
      return res
        .status(400)
        .json({ success: false, message: "Invalid prize or team ID" });
    const winner = await Winner.create({ prize_id, team_id });
    res
      .status(201)
      .json({
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

export {
  createHackathon,
  getHackathons,
  updateHackathon,
  deleteHackathon,
  assignJudge,
  addPrize,
  getProjects,
  declareWinner,
};
