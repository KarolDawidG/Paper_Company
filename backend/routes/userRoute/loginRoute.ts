import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import {
  errorHandler,
  handleError,
  limiterLogin,
  queryParameterize,
} from "../../config/config";
import middleware from "../../config/middleware";

import {
  SECRET_REFRESH_TOKEN,
  generateRefreshToken,
  generateToken,
} from "../../config/tokenUtils";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";

const router: Router = express.Router();

router.use(middleware);
router.use(errorHandler);


interface UserInterface {
  id: string,
  is_active: number,
  role: string,
  password: string
}

router.post("/", limiterLogin, async (req: Request, res: Response) => {
  const { username: user, password } = req.body;

  if (!user || !password) {
    logger.warn("Login Route: POST: Missing username or password.");
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(MESSAGES.UNPROCESSABLE_ENTITY);
  }

  try {
    const users = await UsersRecord.selectByUsername([user]) as UserInterface[];
      if (!Array.isArray(users) || users.length === 0) {
        logger.warn(`Login Route: POST: User not found. Username: ${user}`);
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.UNPROCESSABLE_ENTITY);
      }

    const userRecord = users[0];
      if (!userRecord.is_active) {
        logger.warn(`Login Route: POST: User is inactive. Username: ${user}`);
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.FORBIDDEN);
      }

    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
      if (!isPasswordValid) {
        logger.warn(`Login Route: POST: Wrong password. Username: ${user}`);
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.UNPROCESSABLE_ENTITY);
      }

    const token = generateToken(user, userRecord.role);
    const refreshToken = generateRefreshToken(user, userRecord.role);

    await UsersRecord.updateRefreshTokenById([refreshToken, userRecord.id]);

    logger.info(`Logged in user: ${user}, access level: ${userRecord.role}`);
    return res.status(STATUS_CODES.SUCCESS).json({
      token,
      idUser: userRecord.id,
      message: MESSAGES.SUCCESSFUL_SIGN_UP,
    });
  } catch (error) {
    return handleError(res, error, "Login Route: POST", MESSAGES.SERVER_ERROR);
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  const { idUser } = req.body;
    if (!idUser) {
      return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(MESSAGES.MISSING_ID_USER);
    }
  try {
    const userInfo: any = await UsersRecord.selectTokenById([idUser]);
      if (userInfo.length === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.USER_NOT_FOUND);
      }

    const refreshToken = userInfo[0]?.refresh_token;
      if (!refreshToken) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.NO_REFRESH_TOKEN);
      }

    jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, (err: any, decoded: any) => {
      if (err) {
        return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.INVALID_REFRESH_TOKEN);
      }

      const { user: username, role } = decoded;
      const newToken: string = generateToken(username, role);
      const newRefreshToken: string = generateRefreshToken(username, role);
    
      UsersRecord.updateRefreshTokenById([newRefreshToken, idUser])
        .then(() => {
          return res.json({ token: newToken });
        })
        .catch((error) => {
          logger.error(`Refresh Route: POST: Error updating refresh token for user ID: ${idUser}`, error);
          return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
        });
    });

  } catch (error:any) {
      return handleError(res, error, "Refresh Route: POST", MESSAGES.SERVER_ERROR);
  }



});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for handling user authentication and token management.
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns an access token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user.
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully logged in the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Access token for the user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 idUser:
 *                   type: string
 *                   description: User's identifier.
 *                   example: "123456"
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Login successful."
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating invalid input.
 *                   example: "Invalid request data."
 *       401:
 *         description: Incorrect username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating incorrect credentials.
 *                   example: "Invalid username or password."
 *       403:
 *         description: Account inactive or locked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating account status.
 *                   example: "Account is inactive or locked."
 *       422:
 *         description: Unprocessable entity due to missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating unprocessable entity.
 *                   example: "Missing or invalid username or password."
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Refreshes the user's access token based on the refresh token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 description: Identifier of the user requesting the token refresh.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Missing or invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating missing or invalid refresh token.
 *                   example: "No refresh token provided or invalid token."
 *       403:
 *         description: Invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating invalid refresh token.
 *                   example: "Invalid refresh token."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user was not found.
 *                   example: "User not found."
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


export default router;
