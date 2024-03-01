import express, { Request, Response, Router } from "express";
import axios from "axios";
import MESSAGES  from "../../config/messages";
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
      `${URL.RECAPTCHA}${REACT_APP_SECRET_KEY}&response=${token}`
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

export default router;
