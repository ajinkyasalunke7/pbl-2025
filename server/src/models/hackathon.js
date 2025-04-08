import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user";

const Hackathon = sequelize.define("Hackathon", {
  hackathon_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING },
  is_virtual: { type: DataTypes.BOOLEAN, defaultValue: false },
  max_team_size: { type: DataTypes.INTEGER, defaultValue: 6 },
  registration_start_date: { type: DataTypes.DATE, allowNull: false },
  registration_end_date: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("upcoming", "ongoing", "completed"),
    defaultValue: "upcoming",
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Hackathon.belongsTo(User, { as: "organizer", foreignKey: "organizer_id" });

export default Hackathon;
