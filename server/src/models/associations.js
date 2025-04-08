import User from "./user.js";
import Hackathon from "./hackathon.js";
import Team from "./team.js";
import TeamMember from "./teamMember.js";
import TeamInvitation from "./teamInvitation.js";
import Project from "./project.js";
import Enrollment from "./enrollment.js";
import JudgeAssignment from "./judgeAssignment.js";
import ProjectScore from "./projectScore.js";
import Prize from "./prize.js";
import Winner from "./winner.js";

const defineAssociations = () => {
  User.hasMany(Team, { foreignKey: "team_leader_id", as: "ledTeams" });
  User.hasMany(TeamMember, { foreignKey: "user_id" });
  User.hasMany(Hackathon, { foreignKey: "organizer_id" });
  User.hasMany(Enrollment, { foreignKey: "user_id" });
  User.hasMany(JudgeAssignment, { foreignKey: "judge_id" });
  User.hasMany(ProjectScore, { foreignKey: "judge_id" });

  Hackathon.belongsTo(User, { foreignKey: "organizer_id" });
  Hackathon.hasMany(Team, { foreignKey: "hackathon_id" });
  Hackathon.hasMany(Enrollment, { foreignKey: "hackathon_id" });
  Hackathon.hasMany(Project, { foreignKey: "hackathon_id" });
  Hackathon.hasMany(JudgeAssignment, { foreignKey: "hackathon_id" });
  Hackathon.hasMany(Prize, { foreignKey: "hackathon_id" });

  Team.belongsTo(Hackathon, { foreignKey: "hackathon_id" });
  Team.belongsTo(User, { foreignKey: "team_leader_id", as: "teamLeader" });
  Team.hasMany(TeamMember, { foreignKey: "team_id" });
  Team.hasMany(TeamInvitation, { foreignKey: "team_id" });
  Team.hasMany(Project, { foreignKey: "team_id" });
  Team.hasMany(Winner, { foreignKey: "team_id" });

  TeamMember.belongsTo(Team, { foreignKey: "team_id" });
  TeamMember.belongsTo(User, { foreignKey: "user_id" });

  TeamInvitation.belongsTo(Team, { foreignKey: "team_id" });
  TeamInvitation.belongsTo(User, {
    foreignKey: "invited_user_id",
    as: "invitedUser",
  });

  Project.belongsTo(Team, { foreignKey: "team_id" });
  Project.belongsTo(Hackathon, { foreignKey: "hackathon_id" });
  Project.hasMany(ProjectScore, { foreignKey: "project_id" });

  Enrollment.belongsTo(User, { foreignKey: "user_id" });
  Enrollment.belongsTo(Hackathon, { foreignKey: "hackathon_id" });

  JudgeAssignment.belongsTo(User, { foreignKey: "judge_id" });
  JudgeAssignment.belongsTo(Hackathon, { foreignKey: "hackathon_id" });

  ProjectScore.belongsTo(Project, { foreignKey: "project_id" });
  ProjectScore.belongsTo(User, { foreignKey: "judge_id" });

  Prize.belongsTo(Hackathon, { foreignKey: "hackathon_id" });
  Prize.hasOne(Winner, { foreignKey: "prize_id" });

  Winner.belongsTo(Prize, { foreignKey: "prize_id" });
  Winner.belongsTo(Team, { foreignKey: "team_id" });
};

export default defineAssociations;
