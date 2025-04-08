import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Hackathon from "./hackathon";

const Prize = sequelize.define("Prize", {
  prize_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  prize_name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  position: { type: DataTypes.INTEGER, allowNull: false },
});

Prize.belongsTo(Hackathon, { foreignKey: "hackathon_id" });

export default Prize;
