import express, { Request, Response, Router } from "express";
import middleware from "../../config/middleware";
import { errorHandler } from "../../config/config";
import { sendContactEmail } from "../../config/emailSender";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";

const router: Router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post("/", async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  await sendContactEmail(name, email, subject, message);

  try {
    logger.info("An E-mail has been sent!");
    res.status(STATUS_CODES.SUCCESS).send("An E-mail has been sent!");
  } catch (error:any) {
    logger.error(`Server error contact route: ${error.message}`);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

export default router;
