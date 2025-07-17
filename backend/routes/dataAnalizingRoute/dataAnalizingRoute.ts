// routes/analytics/top-products.ts
import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import logger from "../../logs/logger";
import STATUS_CODES from "../../config/status-codes";
import MESSAGES from "../../config/messages";
import { DataRecord } from "../../database/Records/DataAnalizing/DataRecord";

const router = express.Router();
router.use(middleware, limiter, errorHandler);
router.use(express.json({ limit: "10mb" }));

router.get("/top-product", async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'pl';

  try {
    const topProducts = await DataRecord.getTopProducts(lang);
    return res.status(200).json(topProducts);
  } catch (error) {
    logger.error("Error fetching top products:", error);
    return res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
});

export default router;