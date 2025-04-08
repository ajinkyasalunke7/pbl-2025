import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Team from "./team";
import User from "./user";

const TeamInvitation = sequelize.define("TeamInvitation", {
  invitation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invitation_status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
  invitation_token: { type: DataTypes.STRING, unique: true, allowNull: false },
  org_name: { type: DataTypes.STRING },
  passout_year: { type: DataTypes.INTEGER },
  domain: { type: DataTypes.STRING },
  gender: {
    type: DataTypes.ENUM("male", "female", "other", "prefer_not_to_say"),
  },
  phone_number: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expires_at: { type: DataTypes.DATE, allowNull: false },
});

TeamInvitation.belongsTo(Team, { foreignKey: "team_id" });
TeamInvitation.belongsTo(User, {
  as: "invitedUser",
  foreignKey: "invited_user_id",
});
TeamInvitation.belongsTo(User, { as: "invitedBy", foreignKey: "invited_by" });

export default TeamInvitation;
