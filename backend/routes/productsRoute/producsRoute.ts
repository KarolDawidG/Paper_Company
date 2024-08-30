import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { handleError, limiter } from "../../config/config";
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
        if (!productsData || productsData.length === 0) {
          logger.warn(`Products Route: GET: No products found for locale: ${locale}`);
          return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
        }
      return res.status(STATUS_CODES.SUCCESS).json({ productsData });
    } catch (error: any) {
      return handleError(res, error, "Products Route: GET", MESSAGES.UNKNOW_ERROR);
  }
});

router.get("/cart/:id", async (req: Request, res: Response) => {
  const productId:string = req.params.id;
  const locale:any = req.query.locale || 'en';

  try {
    const productsData = await ProductsRecord.getById(productId, locale);
      if (!productsData) {
        logger.warn(`Products/cart/id Route: GET: No product found with ID ${productId}`);
        return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
      }
    return res.status(STATUS_CODES.SUCCESS).json(productsData );
  } catch (error: any) {
    return handleError(res, error, "Products/cart/id Route: GET", MESSAGES.UNKNOW_ERROR);
  }
});

export default router;
