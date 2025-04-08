import {
   User,
   Hackathon,
   Team,
   TeamInvitation,
   TeamMember,
   Project,
   Enrollment,
} from "../models/index.js";
import { sendInvitationEmail } from "../utils/mailer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

export const register = async (req, res) => {
   const {
      email,
      password,
      first_name,
      last_name,
      college_name,
      gender,
      user_type,
   } = req.body;
   try {
      let user = await User.findOne({ where: { email } });
      if (user && !user.is_placeholder) {
         return res
            .status(400)
            .json({ success: false, message: "Email already registered" });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const validUserTypes = ["participant", "organizer", "judge"];
      const finalUserType = validUserTypes.includes(user_type)
         ? user_type
         : "participant";

      if (user) {
         await user.update(
            {
               password_hash,
               first_name,
               last_name,
               college_name,
               gender,
               user_type: finalUserType,
               is_placeholder: false,
            },
            {
               attributes: {
                  exclude: ["password_hash"], // Exclude the password field
               },
            }
         );
      } else {
         user = await User.create(
            {
               email,
               password_hash,
               first_name,
               last_name,
               college_name,
               gender,
               user_type: finalUserType,
            },
            {
               attributes: {
                  exclude: ["password_hash"], // Exclude the password field
               },
            }
         );
      }

      const token = jwt.sign(
         { user_id: user.user_id, user_type: finalUserType },
         "your-secret-key"
      );
      res.status(201).json({
         success: true,
         data: { user, token, user_type: finalUserType },
         message: "Registration successful",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
         return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
      }
      const token = jwt.sign(
         { user_id: user.user_id, user_type: user.user_type },
         "your-secret-key"
      );
      res.json({
         success: true,
         data: { token, user_type: user.user_type },
         message: "Login successful",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const getHackathons = async (req, res) => {
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
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const enrollInHackathon = async (req, res) => {
   const { hackathon_id, team_name, description, team_size } = req.body;
   try {
      const hackathon = await Hackathon.findByPk(hackathon_id);
      if (
         !hackathon ||
         hackathon.registration_start_date > new Date() ||
         hackathon.registration_end_date < new Date()
      ) {
         return res.status(400).json({
            success: false,
            message: "Registration period is not active",
         });
      }
      if (team_size > hackathon.max_team_size) {
         return res.status(400).json({
            success: false,
            message: "Team size exceeds hackathon limit",
         });
      }

      const team = await Team.create({
         hackathon_id,
         team_name,
         description,
         team_leader_id: req.user.user_id,
         team_size,
      });

      await Enrollment.create({ user_id: req.user.user_id, hackathon_id });
      await TeamMember.create({
         team_id: team.team_id,
         user_id: req.user.user_id,
         verified: true,
      });

      res.status(201).json({
         success: true,
         data: {
            team_id: team.team_id,
            redirect: `/api/user/teams/${team.team_id}/members`,
         },
         message: "Team created, add members next",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const updateTeamMembers = async (req, res) => {
   const { id } = req.params; // team_id
   const { members } = req.body; // Array of { email, first_name, last_name, college_name, gender }
   try {
      const team = await Team.findOne({
         where: { team_id: id, team_leader_id: req.user.user_id },
      });
      if (!team)
         return res.status(403).json({
            success: false,
            message: "Not authorized or team not found",
         });

      const hackathon = await Hackathon.findByPk(team.hackathon_id);
      if (
         members.length + 1 > team.team_size ||
         members.length + 1 > hackathon.max_team_size
      ) {
         return res.status(400).json({
            success: false,
            message: "Too many members for team size",
         });
      }

      const invitations = [];
      for (const member of members) {
         let user = await User.findOne({ where: { email: member.email } });
         if (!user) {
            user = await User.create({
               email: member.email,
               password_hash: "placeholder",
               first_name: member.first_name,
               last_name: member.last_name,
               college_name: member.college_name,
               gender: member.gender,
               is_placeholder: true,
            });
         }

         const existingMember = await TeamMember.findOne({
            where: { team_id: id, user_id: user.user_id },
         });
         if (!existingMember) {
            await TeamMember.create({
               team_id: id,
               user_id: user.user_id,
               verified: false,
            });
            const token = uuidv4();
            const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);
            await TeamInvitation.create({
               team_id: id,
               invited_user_id: user.user_id,
               invitation_token: token,
               expires_at,
            });
            await sendInvitationEmail(
               member.email,
               token,
               team.team_name,
               hackathon.title
            );
            invitations.push({ email: member.email, token });
         }
      }

      res.json({
         success: true,
         data: { invitations },
         message: "Team members updated, invitations sent",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const getTeamMembers = async (req, res) => {
   const { id } = req.params; // team_id
   try {
      const team = await Team.findOne({
         where: { team_id: id, team_leader_id: req.user.user_id },
      });
      if (!team)
         return res.status(403).json({
            success: false,
            message: "Not authorized or team not found",
         });

      const members = await TeamMember.findAll({
         where: { team_id: id },
         include: [
            {
               model: User,
               attributes: [
                  "email",
                  "first_name",
                  "last_name",
                  "college_name",
                  "gender",
               ],
            },
         ],
      });

      res.json({
         success: true,
         data: members,
         message: "Team members retrieved",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const resendInvitation = async (req, res) => {
   const { id, memberId } = req.params; // team_id, user_id
   try {
      const team = await Team.findOne({
         where: { team_id: id, team_leader_id: req.user.user_id },
      });
      if (!team)
         return res.status(403).json({
            success: false,
            message: "Not authorized or team not found",
         });

      const member = await TeamMember.findOne({
         where: { team_id: id, user_id: memberId, verified: false },
      });
      if (!member)
         return res.status(400).json({
            success: false,
            message: "Member not found or already verified",
         });

      const user = await User.findByPk(memberId);
      const token = uuidv4();
      const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);
      await TeamInvitation.create({
         team_id: id,
         invited_user_id: memberId,
         invitation_token: token,
         expires_at,
      });

      const hackathon = await Hackathon.findByPk(team.hackathon_id);
      await sendInvitationEmail(
         user.email,
         token,
         team.team_name,
         hackathon.title
      );
      res.json({
         success: true,
         data: { token },
         message: "Invitation resent",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const acceptInvitation = async (req, res) => {
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
            message: "Please register first",
         });
      }

      await TeamMember.update(
         { verified: true },
         {
            where: {
               team_id: invitation.team_id,
               user_id: invitation.invited_user_id,
            },
         }
      );
      await invitation.update({ invitation_status: "accepted" });
      res.json({ success: true, message: "Invitation accepted" });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const updateProfile = async (req, res) => {
   const { first_name, last_name, college_name, gender } = req.body;
   try {
      const user = await User.findByPk(req.user.user_id, {
         attributes: {
            exclude: ["password_hash"], // Exclude the password field
         },
      });
      if (!user)
         return res
            .status(404)
            .json({ success: false, message: "User not found" });

      await user.update({ first_name, last_name, college_name, gender });
      res.json({
         success: true,
         data: user,
         message: "Profile updated successfully",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const getTeamDetails = async (req, res) => {
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
         message: "Team details retrieved",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};

export const submitProject = async (req, res) => {
   const { team_id, project_name, description, github_url, demo_url } =
      req.body;
   try {
      const team = await Team.findOne({
         where: { team_id, team_leader_id: req.user.user_id },
      });
      if (!team)
         return res.status(403).json({
            success: false,
            message: "Not authorized or team not found",
         });

      const project = await Project.create({
         team_id,
         hackathon_id: team.hackathon_id,
         project_name,
         description,
         github_url,
         demo_url,
      });
      res.status(201).json({
         success: true,
         data: project,
         message: "Project submitted successfully",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error: " + error.message,
      });
   }
};
