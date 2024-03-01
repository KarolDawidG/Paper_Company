import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import logger from "../../logs/logger";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";

const router = express.Router();
router.use(middleware);

router.get("/", (req: Request, res: Response) => {
  logger.info(MESSAGES.SUCCESSFUL_LOGOUT);
  return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_LOGOUT);
});

export default router;
