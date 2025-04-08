import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TeamMember = sequelize.define("TeamMember", {
  team_id: { type: DataTypes.INTEGER, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default TeamMember;
