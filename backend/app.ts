import express, { Request, Response } from "express";
import { createDatabaseIfNotExists } from "./database/createDatabaseIfNotExists";
import { initializeDatabase } from "./database/initializeDatabase";
import { limiter, errorHandler } from "./config/config";
import middleware from "./config/middleware";
import logRoute from "./routes/userRoute/loginRoute";
import adminRoute from "./routes/adminRoute/adminRoute";
import regRoute from "./routes/userRoute/registerRoute";
import logoutRoute from "./routes/userRoute/logoutRoute";
import usersRoute from "./routes/adminRoute/usersRoute";
import resetRoute from "./routes/userRoute/resetRoute";
import forgotRoute from "./routes/userRoute/forgotPassRoute";
import capRoutes from "./routes/captchaRoute/capRoute";
import urlRoutes from "./routes/userRoute/urlRoute";

import MESSAGES from "./config/messages";
import STATUS_CODES from "./config/status-codes";

const app: express.Application = express();
const PORT: number = 3001;

app.use("/register", regRoute);
app.use("/auth", logRoute);
app.use("/admin", adminRoute);
app.use("/logout", logoutRoute);
app.use("/users", usersRoute);
app.use("/reset", resetRoute);
app.use("/forgot", forgotRoute);
app.use("/cap", capRoutes);
app.use("/url", urlRoutes);

app.use(middleware);
app.use(limiter);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
});

(async () => {
  try {
    await createDatabaseIfNotExists();
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Initialization failed:", err);
  }
})();
