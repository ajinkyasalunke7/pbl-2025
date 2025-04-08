import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING },
  first_name: { type: DataTypes.STRING, defaultValue: "null" },
  last_name: { type: DataTypes.STRING, defaultValue: "null" },
  user_type: {
    type: DataTypes.ENUM("participant", "organizer", "judge", "admin"),
    defaultValue: "participant",
  },
  org_name: { type: DataTypes.STRING },
  passout_year: { type: DataTypes.INTEGER },
  domain: { type: DataTypes.STRING },
  gender: {
    type: DataTypes.ENUM("male", "female", "other", "prefer_not_to_say"),
  },
  phone_number: { type: DataTypes.STRING },
  profile_pic_url: { type: DataTypes.STRING },
  is_placeholder: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default User;
