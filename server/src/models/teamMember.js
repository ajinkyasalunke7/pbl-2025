const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const Team = require("./team");
const User = require("./user");

const TeamMember = sequelize.define("TeamMember", {
  team_id: { type: DataTypes.INTEGER, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

TeamMember.belongsTo(Team, { foreignKey: "team_id" });
TeamMember.belongsTo(User, { foreignKey: "user_id" });

module.exports = TeamMember;
