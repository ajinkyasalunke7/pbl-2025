import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user";
import Hackathon from "./hackathon";

const Enrollment = sequelize.define("Enrollment", {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  hackathon_id: { type: DataTypes.INTEGER, primaryKey: true },
  enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Enrollment.belongsTo(User, { foreignKey: "user_id" });
Enrollment.belongsTo(Hackathon, { foreignKey: "hackathon_id" });

export default Enrollment;
