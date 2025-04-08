import {
  User,
  Hackathon,
  Team,
  TeamInvitation,
  TeamMember,
  Project,
} from "../models";
import { sendInvitationEmail } from "../utils/mailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

const register = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    org_name,
    passout_year,
    domain,
    gender,
    phone_number,
    profile_pic_url,
  } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user && !user.is_placeholder) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    if (user) {
      await user.update({
        password_hash,
        first_name,
        last_name,
        org_name,
        passout_year,
        domain,
        gender,
        phone_number,
        profile_pic_url,
        is_placeholder: false,
      });
    } else {
      user = await User.create({
        email,
        password_hash,
        first_name,
        last_name,
        org_name,
        passout_year,
        domain,
        gender,
        phone_number,
        profile_pic_url,
        is_placeholder: false,
      });
    }

    const invitations = await TeamInvitation.findAll({
      where: { invited_user_id: user.user_id },
      include: [{ model: Team, include: [Hackathon] }],
    });
    const memberships = await TeamMember.findAll({
      where: { user_id: user.user_id },
      include: [{ model: Team, include: [Hackathon] }],
    });
    const previousEnrollments = [
      ...invitations.map((i) => ({
        hackathon: i.Team.Hackathon.title,
        team: i.Team.team_name,
        status: i.invitation_status,
      })),
      ...memberships.map((m) => ({
        hackathon: m.Team.Hackathon.title,
        team: m.Team.team_name,
        status: "joined",
      })),
    ];

    const token = jwt.sign({ user_id: user.user_id }, "your-secret-key");
    res.status(201).json({
      success: true,
      data: { token, previousEnrollments },
      message: "Registration successful",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (
      !user ||
      user.is_placeholder ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ user_id: user.user_id }, "your-secret-key");
    res.json({ success: true, data: { token }, message: "Login successful" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.findAll({
      where: {
        registration_start_date: { [Op.lte]: new Date() },
        registration_end_date: { [Op.gte]: new Date() },
      },
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

const createTeam = async (req, res) => {
  const { hackathon_id, team_name, description } = req.body;
  try {
    const hackathon = await Hackathon.findByPk(hackathon_id);
    if (
      !hackathon ||
      hackathon.registration_start_date > new Date() ||
      hackathon.registration_end_date < new Date()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Registration period is not active" });
    }
    const team = await Team.create({
      hackathon_id,
      team_name,
      description,
      team_leader_id: req.user.user_id,
    });
    res.status(201).json({
      success: true,
      data: team,
      message: "Team created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const inviteToTeam = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    org_name,
    passout_year,
    domain,
    gender,
    phone_number,
  } = req.body;
  try {
    const team = await Team.findOne({
      where: { team_id: id, team_leader_id: req.user.user_id },
    });
    if (!team)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized or team not found" });

    const hackathon = await Hackathon.findByPk(team.hackathon_id);
    if (
      hackathon.registration_start_date > new Date() ||
      hackathon.registration_end_date < new Date()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Registration period is not active" });
    }

    let invitedUser = await User.findOne({ where: { email } });
    if (!invitedUser) {
      invitedUser = await User.create({
        first_name,
        last_name,
        email,
        org_name,
        passout_year,
        domain,
        gender,
        phone_number,
        is_placeholder: true,
      });
    }

    const token = uuidv4();
    const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await TeamInvitation.create({
      team_id: id,
      invited_user_id: invitedUser.user_id,
      invited_by: req.user.user_id,
      invitation_token: token,
      org_name,
      passout_year,
      domain,
      gender,
      phone_number,
      expires_at,
    });

    await sendInvitationEmail(
      invitedUser.email,
      token,
      team.team_name,
      hackathon.title
    );
    res
      .status(201)
      .json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const acceptInvitation = async (req, res) => {
  const { token } = req.params;
  try {
    const invitation = await TeamInvitation.findOne({
      where: { invitation_token: token, invitation_status: "pending" },
    });
    if (!invitation || invitation.expires_at < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired invitation" });
    }

    const user = await User.findByPk(invitation.invited_user_id);
    if (user.is_placeholder) {
      return res.status(200).json({
        success: true,
        data: { email: user.email, invitation_token: token },
        message: "Please register to join the team",
      });
    }

    await TeamMember.create({
      team_id: invitation.team_id,
      user_id: invitation.invited_user_id,
    });
    await invitation.update({ invitation_status: "accepted" });
    await user.update({
      org_name: user.org_name || invitation.org_name,
      passout_year: user.passout_year || invitation.passout_year,
      domain: user.domain || invitation.domain,
      gender: user.gender || invitation.gender,
      phone_number: user.phone_number || invitation.phone_number,
    });

    res.json({ success: true, message: "Invitation accepted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const getTeamDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findByPk(id, {
      include: [
        { model: TeamMember, include: [User] },
        { model: User, as: "teamLeader" },
      ],
    });
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    res.json({
      success: true,
      data: team,
      message: "Team details retrieved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const submitProject = async (req, res) => {
  const { team_id, project_name, description, github_url, demo_url } = req.body;
  try {
    const team = await Team.findOne({
      where: { team_id, team_leader_id: req.user.user_id },
    });
    if (!team)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized or team not found" });

    const project = await Project.create({
      team_id,
      hackathon_id: team.hackathon_id,
      project_name,
      description,
      github_url,
      demo_url,
      submitted_at: new Date(),
    });
    res.status(201).json({
      success: true,
      data: project,
      message: "Project submitted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const getUserTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { team_leader_id: req.user.user_id },
    });
    const memberships = await TeamMember.findAll({
      where: { user_id: req.user.user_id },
      include: [Team],
    });
    res.json({
      success: true,
      data: { ledTeams: teams, memberTeams: memberships.map((m) => m.Team) },
      message: "User teams retrieved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const updateProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    org_name,
    passout_year,
    domain,
    gender,
    phone_number,
    profile_pic_url,
  } = req.body;
  try {
    const user = await User.findByPk(req.user.user_id);
    await user.update({
      first_name,
      last_name,
      org_name,
      passout_year,
      domain,
      gender,
      phone_number,
      profile_pic_url,
    });
    res.json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

export {
  register,
  login,
  getHackathons,
  createTeam,
  inviteToTeam,
  acceptInvitation,
  getTeamDetails,
  submitProject,
  getUserTeams,
  updateProfile,
};
