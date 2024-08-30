import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter } from "../../config/config";
import { ProductsRecord } from "../../database/Records/Products/ProductsRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
const router = express.Router();
router.use(middleware, limiter);

router.get("/", async (req: Request, res: Response) => {
  const locale = req.headers['accept-language'] || 'en';

    try {
      const productsData = await ProductsRecord.getAll(locale);
      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ productsData });
    } catch (error: any) {
      logger.error(`Products Route: GET: Failed to fetch products list for locale: ${locale}. Error: ${error.message}, Stack: ${error.stack}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Products Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.get("/cart/:id", async (req: Request, res: Response) => {
  const productId:string = req.params.id;
  const locale:any = req.query.locale || 'en';

  try {
    const productsData = await ProductsRecord.getById(productId, locale);

    return res
      .status(STATUS_CODES.SUCCESS)
      .json(productsData );
  } catch (error: any) {
    logger.error(`Products/cart/id Route: GET: Failed for productId: ${productId}. Error: ${error.message}, Stack: ${error.stack}`);
      return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Products Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

export default router;
