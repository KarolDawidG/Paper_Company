import express, { Request, Response, Router } from "express";
import axios from "axios";
import MESSAGES from "../../config/messages";
import URL from "../../config/url";
import middleware from "../../config/middleware";
import dotenv from "dotenv";
dotenv.config();
const REACT_APP_SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const router: Router = express.Router();

router.use(middleware);

router.post("/", async (req: Request, res: Response) => {
  const { token, inputVal } = req.body as { token: string; inputVal: string };
  try {
    const response = await axios.post(
      `${URL.RECAPTCHA}${REACT_APP_SECRET_KEY}&response=${token}`,
    );
    if (response.data.success) {
      return res.send("Human 👨 👩");
    } else {
      return res.status(403).send("Robot 🤖");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(MESSAGES.CAPTCHA_ERROR);
  }
});

/**
 * @swagger
 * tags:
 *   name: Captcha
 *   description: Endpointy do weryfikacji Captcha.
 */

/**
 * @swagger
 * /cap:
 *   post:
 *     summary: Weryfikuje Captcha.
 *     description: Endpoint do weryfikacji Captcha dla użytkownika.
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
 *                 description: Token Captcha do weryfikacji.
 *               inputVal:
 *                 type: string
 *                 description: Wartość wejściowa (opcjonalna) używana do dalszej weryfikacji.
 *     responses:
 *       200:
 *         description: Weryfikacja Captcha zakończona sukcesem - użytkownik jest człowiekiem.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Komunikat potwierdzający, że użytkownik jest człowiekiem.
 *       403:
 *         description: Weryfikacja Captcha nie powiodła się - użytkownik jest robotem.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Komunikat informujący, że użytkownik jest robotem.
 *       500:
 *         description: Błąd serwera podczas weryfikacji Captcha.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 */

export default router;
