import express, { Request, Response, Router } from "express";
import axios from "axios";
import MESSAGES from "../../config/messages";
import URL from "../../config/url";
import middleware from "../../config/middleware";
import dotenv from "dotenv";
import STATUS_CODES from "../../config/status-codes";
import { handleError } from "../../config/config";
dotenv.config();
const REACT_APP_SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const router: Router = express.Router();

router.use(middleware);

// TODO upgrade frontend

router.post("/", async (req: Request, res: Response) => {
  const { token, inputVal } = req.body as { token: string; inputVal: string };
  try {
    const response = await axios.post(`${URL.RECAPTCHA}${REACT_APP_SECRET_KEY}&response=${token}`,);
      if (response.data.success) {
        return res.status(STATUS_CODES.SUCCESS).send("Human 👨 👩");
      } else {
        return res.status(STATUS_CODES.FORBIDDEN).send("Robot 🤖");
      }
  } catch (error:any) {
    return handleError(res, error, "CAPTCHA Verification Error", MESSAGES.UNKNOW_ERROR);
  }
});

/**
 * @swagger
 * tags:
 *   name: Captcha
 *   description: Endpoints for CAPTCHA verification.
 */

/**
 * @swagger
 * /cap:
 *   post:
 *     summary: Verify CAPTCHA.
 *     description: Endpoint for verifying CAPTCHA for the user.
 *     tags: [Captcha]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: CAPTCHA token for verification.
 *                 example: '03AOLTBLTQIo19BzZ6oY8MTtk5O6z6IC4U_t8RyO7Vcld8XgF5O0FN0l3l7s1NmOCYyS7rU8VloM5SH9k0U9rY5GHxOjY4HQqI6BmgXqY9VwR2U9fGfGXBZ5zWcrkFQyWlEwFZ6VgTh9RYm8XUK0VpXk8XU_1LqZw1KrMjwP1dNpoGgFvRYz-K-ei_LH4h6oRd_D5g'
 *               inputVal:
 *                 type: string
 *                 description: Optional input value used for further verification.
 *                 example: 'someInputValue'
 *     responses:
 *       200:
 *         description: CAPTCHA verification successful - user is a human.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Confirmation message that the user is a human.
 *               example: 'Human 👨 👩'
 *       403:
 *         description: CAPTCHA verification failed - user is a robot.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Message indicating that the user is a robot.
 *               example: 'Robot 🤖'
 *       500:
 *         description: Server error during CAPTCHA verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Server error encountered. Please contact the administrator for support.'
 */

export default router;
