import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Prize from "./prize";
import Team from "./team";

const Winner = sequelize.define("Winner", {
  winner_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  awarded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Winner.belongsTo(Prize, { foreignKey: "prize_id" });
Winner.belongsTo(Team, { foreignKey: "team_id" });

export default Winner;
