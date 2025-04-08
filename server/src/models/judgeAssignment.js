import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user";
import Hackathon from "./hackathon";

const JudgeAssignment = sequelize.define("JudgeAssignment", {
  judge_id: { type: DataTypes.INTEGER, primaryKey: true },
  hackathon_id: { type: DataTypes.INTEGER, primaryKey: true },
  assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

JudgeAssignment.belongsTo(User, { foreignKey: "judge_id" });
JudgeAssignment.belongsTo(Hackathon, { foreignKey: "hackathon_id" });

export default JudgeAssignment;
