import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import logger from "../../logs/logger";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import { handleError, handleWarning, verifyToken } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";

const router = express.Router();
router.use(middleware);

router.get("/", (req: Request, res: Response): Response => {
  logger.info(MESSAGES.SUCCESSFUL_LOGOUT);
  return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_LOGOUT);
});

router.post("/", verifyToken, async (req: Request, res: Response): Promise<Response | void> => {
  const { idUser, refreshToken } = req.body;

  if (!idUser) {
    return handleWarning(res, "Logout Route: POST", MESSAGES.MISSING_ID_USER, STATUS_CODES.UNPROCESSABLE_ENTITY);
  }

  if (!refreshToken) {
    return handleWarning(res, "Logout Route: POST", MESSAGES.NO_REFRESH_TOKEN, STATUS_CODES.UNAUTHORIZED, idUser);
  }

  try {
    const userInfo: any = await UsersRecord.selectTokenById([idUser]);
    if (userInfo.length === 0) {
      return handleWarning(res, "Logout Route: POST", MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND, idUser);
    }

    // 27.1.8: Wylogowanie czyści refresh token w bazie dopiero po potwierdzeniu, że klient zna jego aktualną wartość.
    const storedRefreshToken = userInfo[0]?.refresh_token;
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return handleWarning(res, "Logout Route: POST", MESSAGES.INVALID_REFRESH_TOKEN, STATUS_CODES.FORBIDDEN, idUser);
    }

    await UsersRecord.updateRefreshTokenById([null, idUser]);

    logger.info(`Logout Route: POST: User ${idUser} logged out.`);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_LOGOUT);
  } catch (error: any) {
    return handleError(res, error, "Logout Route: POST", MESSAGES.SERVER_ERROR, STATUS_CODES.SERVER_ERROR, idUser);
  }
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
