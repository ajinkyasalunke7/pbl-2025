import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { authenticate, restrictToOrganizer } from "./utils/helper.js";
import defineAssociations from "./models/associations.js";

// Middlewares
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

// Routes
import userRouter from "./routes/userRouter.js";
import utilsRouter from "./routes/utilsRouter.js";
import sequelize from "./config/db.js";
import organizerRoutes from "./routes/organizerRoutes.js";

const app = express();

// Use()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// const authenticate = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   if (!token)
//     return res
//       .status(401)
//       .json({ success: false, message: "No token provided" });
//   jwt.verify(token, "your-secret-key", (err, decoded) => {
//     if (err)
//       return res.status(401).json({ success: false, message: "Invalid token" });
//     req.user = decoded;
//     next();
//   });
// };

// const restrictToOrganizer = (req, res, next) => {
//   if (req.user.user_type !== "organizer") {
//     return res.status(403).json({
//       success: false,
//       message: "Access restricted to organizers only",
//     });
//   }
//   next();
// };

// app.use(express.static("public"));

// Test route

app.get("/", (req, res, next) => {
   res.status(200).json({ message: "Server running" });
});

// Routers
app.use("/api/user", userRouter);
app.use("/api/organizer", authenticate, restrictToOrganizer, organizerRoutes);
app.use("/api/utils", utilsRouter);

const dropTablesInOrder = async () => {
   try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.drop();
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      console.log("All tables dropped successfully");
   } catch (error) {
      console.error("Error dropping tables:", error);
   }
};
// Db Connection
sequelize
   .authenticate()
   .then(async () => {
      console.log("Database connected");
      // await dropTablesInOrder();
      defineAssociations();
      await sequelize.sync({ alter: true });
   })
   .catch((err) => console.error("Database connection error:", err));

// Global Error Handler
app.use(globalErrorHandler);

export default app;
