import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";

const router = express.Router();

router.use(middleware, limiter, errorHandler);

router.get(
  "/",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;
    logger.info(`${MESSAGES.AUTHORIZATION_LVL}: admin ${userRole}`);

    if (userRole !== "admin") {
      return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.FORBIDDEN);
    }

    try {
      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: `${MESSAGES.SUCCESSFUL_OPERATION}` });
    } catch (error: any) {
      console.error(error);
      logger.error(error.message);
      return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
    }
  },
);

export default router;
