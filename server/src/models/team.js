import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Hackathon from "./hackathon";
import User from "./user";

const Team = sequelize.define("Team", {
  team_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  team_name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Team.belongsTo(Hackathon, { foreignKey: "hackathon_id" });
Team.belongsTo(User, { as: "teamLeader", foreignKey: "team_leader_id" });

export default Team;
