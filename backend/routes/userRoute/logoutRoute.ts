import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import logger from "../../logs/logger";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";

const router = express.Router();
router.use(middleware);

router.get("/", (req: Request, res: Response): Response => {
  logger.info(MESSAGES.SUCCESSFUL_LOGOUT);
  return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_LOGOUT);
});

export default router;

/**
 * @swagger
 * tags:
 *   name: Logout
 *   description: Endpoint to handle user logout.
 */

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: User logout
 *     description: Logs out the user and returns a success message.
 *     tags:
 *       - Logout
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the user has been logged out.
 *                   example: "User has been successfully logged out."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating a server error.
 *                   example: "Internal server error occurred."
 */
