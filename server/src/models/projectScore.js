import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Project from "./project";
import User from "./user";

const ProjectScore = sequelize.define("ProjectScore", {
  score_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  innovation_score: { type: DataTypes.INTEGER },
  technical_score: { type: DataTypes.INTEGER },
  presentation_score: { type: DataTypes.INTEGER },
  comments: { type: DataTypes.TEXT },
  scored_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

ProjectScore.belongsTo(Project, { foreignKey: "project_id" });
ProjectScore.belongsTo(User, { foreignKey: "judge_id" });

export default ProjectScore;
