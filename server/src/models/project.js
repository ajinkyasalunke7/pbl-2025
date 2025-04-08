import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Team from "./team";
import Hackathon from "./hackathon";

const Project = sequelize.define("Project", {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  github_url: { type: DataTypes.STRING },
  demo_url: { type: DataTypes.STRING },
  submitted_at: { type: DataTypes.DATE },
});

Project.belongsTo(Team, { foreignKey: "team_id" });
Project.belongsTo(Hackathon, { foreignKey: "hackathon_id" });

export default Project;
