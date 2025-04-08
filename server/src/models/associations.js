import User from "./user.js";
import Hackathon from "./hackathon.js";
import Team from "./team.js";
import TeamMember from "./teamMember.js";
import TeamInvitation from "./teamInvitation.js";
import JudgeAssignment from "./judgeAssignment.js";
import Prize from "./prize.js";
import Winner from "./winner.js";

const defineAssociations = () => {
  User.hasMany(Team, { foreignKey: "team_leader_id", as: "ledTeams" });
  User.hasMany(TeamMember, { foreignKey: "user_id" });
  User.hasMany(Hackathon, { foreignKey: "organizer_id" });
  User.hasMany(JudgeAssignment, { foreignKey: "judge_id" });

  Hackathon.belongsTo(User, { foreignKey: "organizer_id" });
  Hackathon.hasMany(Team, { foreignKey: "hackathon_id" });
  Hackathon.hasMany(JudgeAssignment, { foreignKey: "hackathon_id" });
  Hackathon.hasMany(Prize, { foreignKey: "hackathon_id" });

  Team.belongsTo(Hackathon, { foreignKey: "hackathon_id" });
  Team.belongsTo(User, { foreignKey: "team_leader_id", as: "teamLeader" });
  Team.hasMany(TeamMember, { foreignKey: "team_id" });
  Team.hasMany(TeamInvitation, { foreignKey: "team_id" });
  Team.hasMany(Winner, { foreignKey: "team_id" });

  TeamMember.belongsTo(Team, { foreignKey: "team_id" });
  TeamMember.belongsTo(User, { foreignKey: "user_id" });

  TeamInvitation.belongsTo(Team, { foreignKey: "team_id" });
  TeamInvitation.belongsTo(User, {
    foreignKey: "invited_user_id",
    as: "invitedUser",
  });

  JudgeAssignment.belongsTo(User, { foreignKey: "judge_id" });
  JudgeAssignment.belongsTo(Hackathon, { foreignKey: "hackathon_id" });

  Prize.belongsTo(Hackathon, { foreignKey: "hackathon_id" });
  Prize.hasOne(Winner, { foreignKey: "prize_id" });

  Winner.belongsTo(Prize, { foreignKey: "prize_id" });
  Winner.belongsTo(Team, { foreignKey: "team_id" });
};

export default defineAssociations;
