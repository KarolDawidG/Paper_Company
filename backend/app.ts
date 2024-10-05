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
import salesRoutes from "./routes/salesRoute/salesRoute";
import producsRoute from "./routes/productsRoute/producsRoute";
import basketRoute from "./routes/basketRoute/basketRoute";
import clientRoute from "./routes/clientRoute/clientRoute";
import addressRoute from "./routes/addressRoute/addressRoute";
import employeeRoute from "./routes/employeeRoute/employeeRoute"
import mailRoute from "./routes/mailRoute/mailRoute";

// swagger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swaggerOptions';

import MESSAGES from "./config/messages";
import STATUS_CODES from "./config/status-codes";
const specs = swaggerJsdoc(swaggerOptions);

//save api-docs into JSON
import fs from 'fs';
const jsonSpecs = JSON.stringify(specs, null, 2);
const outputPath = './swagger.json';
fs.writeFileSync(outputPath, jsonSpecs, 'utf-8');

const app: express.Application = express();
const PORT: number = 3001;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/register", regRoute);
app.use("/auth", logRoute);
app.use("/admin", adminRoute);
app.use("/logout", logoutRoute);
app.use("/users", usersRoute);
app.use("/reset", resetRoute);
app.use("/forgot", forgotRoute);
app.use("/cap", capRoutes);
app.use("/url", urlRoutes);
app.use("/sales", salesRoutes);
app.use("/products", producsRoute);
app.use("/basket", basketRoute);
app.use("/client", clientRoute);
app.use("/address", addressRoute);
app.use("/employee", employeeRoute);
app.use("/mail", mailRoute);

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
