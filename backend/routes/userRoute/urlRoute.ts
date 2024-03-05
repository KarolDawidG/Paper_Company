import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";

const router = express.Router();
router.use(middleware, limiter, errorHandler);

router.get(
  "/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    try {
      const [userInfo]: any = await UsersRecord.selectUrlById([id]);
      return res.status(STATUS_CODES.SUCCESS).json(userInfo);
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`URL Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
  },
);

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const img_url: string = req.body.img_url;

  try {
    await UsersRecord.updateImgUrl(id, img_url);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error: any) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`URL Route: PUT: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

router.delete(
  "/:id", verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    try {
      await UsersRecord.deleteUrl(id);
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`URL Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
    }
  },
);

export default router;
