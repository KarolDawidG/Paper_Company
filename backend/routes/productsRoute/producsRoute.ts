import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { ProductsRecord } from "../../database/Records/Users/ProductsRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
const router = express.Router();
router.use(middleware, limiter, errorHandler);

router.get("/", async (req: Request, res: Response) => {
    try {
      const productsData = await ProductsRecord.getAll();
      return res.json({ productsData });
    } catch (error: any) {
      logger.error(`Products Route: GET: ${error.message}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Products Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

export default router;
