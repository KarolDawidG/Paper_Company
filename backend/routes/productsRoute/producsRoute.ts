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
    try {
      const locale = req.headers['accept-language'] || 'en';
      const productsData = await ProductsRecord.getAll(locale);
      return res.json({ productsData });
    } catch (error: any) {
      logger.error(`Products Route: GET: ${error.message}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Products Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.get("/cart/:id", async (req: Request, res: Response) => {

  try {
    const productId:string = req.params.id;
    const locale:any = req.query.locale || 'en';

    const productsData = await ProductsRecord.getById(productId, locale);
    //console.log({productsData});
    return res.json(productsData );
  } catch (error: any) {
    logger.error(`Products Route: GET: ${error.message}`);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Products Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

export default router;
