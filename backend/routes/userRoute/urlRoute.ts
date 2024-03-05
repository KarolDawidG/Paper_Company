import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";

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
        .send("Unknown server error in get user route.");
    }
  },
);

router.put("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const img_url: string = req.body.img_url;

  console.log(id);
  console.log(img_url);

  try {
    await UsersRecord.updateImgUrl(id, img_url);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send("The operation has been successful.");
  } catch (error: any) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send("Unknown server error in update url.");
  }
});

router.delete(
  "/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    try {
      await UsersRecord.deleteUrl(id);
      return res
        .status(STATUS_CODES.SUCCESS)
        .send("The operation has been successful.");
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send("Unknown server error in delete.");
    }
  },
);

export default router;
