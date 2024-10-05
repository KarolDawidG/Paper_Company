import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import middleware from "../../config/middleware";
import { errorHandler, handleError, handleWarning } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import URL from "../../config/url";
import logger from "../../logs/logger";
import { sendResetPasswordEmail } from "../../config/mails/emailsSender";
require("dotenv").config();
const jwt_secret: string = process.env.jwt_secret || "";

const router: Router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post("/", async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
    if (!email) {
      return handleWarning(res, "Forgot Pass Route: POST", MESSAGES.INVALID_EMAIL, STATUS_CODES.BAD_REQUEST);
    }
  try {
    const [userRecord]: any = await UsersRecord.selectByEmail([email]);
      if (!userRecord) {
        logger.warn(`Forgot Pass Route: POST: Email not found: ${email}`);
        return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
      }

    const { username, email: userEmail, id, password } = userRecord;
    const secret: string = jwt_secret + password;
    const payload = { email: userEmail, id };
    const token: string = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link: string = `${URL.RESET_URL}${id}/${token}`;

    await sendResetPasswordEmail(userEmail, username, link);
    logger.info(`Forgot Pass Route: POST: Reset email sent to ${userEmail}`);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
  } catch (error: any) {
    return handleError(res, error, "Forgot Pass Route: POST", MESSAGES.SERVER_ERROR);
  }
});

/**
 * @swagger
 * tags:
 *   name: Forgot Password
 *   description: Endpoints for handling password reset requests.
 */

/**
 * @swagger
 * /forgot:
 *   post:
 *     summary: Send a password reset email.
 *     description: Endpoint for sending a password reset email with a link to reset the user's password.
 *     tags:
 *       - Forgot Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting a password reset.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully sent a password reset email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message for the reset email.
 *                   example: "Password reset email sent successfully."
 *       400:
 *         description: Bad request due to missing or invalid email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating missing or invalid email.
 *                   example: "Invalid email address provided."
 *       404:
 *         description: Email not found in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the email was not found.
 *                   example: "Email not found in the system."
 *       500:
 *         description: Server error during the password reset process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unknown server error.
 *                   example: "An unknown server error occurred."
 */

export default router;
