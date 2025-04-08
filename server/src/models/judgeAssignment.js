import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const JudgeAssignment = sequelize.define("JudgeAssignment", {
  judge_id: { type: DataTypes.INTEGER, primaryKey: true },
  hackathon_id: { type: DataTypes.INTEGER, primaryKey: true },
});

export default JudgeAssignment;
