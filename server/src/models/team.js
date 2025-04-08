import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define("Team", {
  team_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hackathon_id: { type: DataTypes.INTEGER, allowNull: false },
  team_name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  team_leader_id: { type: DataTypes.INTEGER, allowNull: false },
  team_size: { type: DataTypes.INTEGER, allowNull: false },
});

export default Team;
