import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { handleError, limiter } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import { BasketRecord } from "../../database/Records/Basket/BasketRecord";

const router = express.Router();
router.use(middleware, limiter);

router.post("/", verifyToken, async (req: Request, res: Response) => {
    try {
      const basketData = req.body;
      const orderId = basketData.order_id;

      if (!orderId) {
        logger.warn("Basket Route: POST: Missing order_id in request.");
        return res
            .status(STATUS_CODES.BAD_REQUEST)
            .send(MESSAGES.BAD_REQUEST);
    }

        for (const key in basketData) {
            if (key !== "order_id") {
                const { id, name, description, price, stock, clickCount } = basketData[key];

                try {
                    await BasketRecord.insert({
                        order_id: orderId,
                        product_id: id,
                        quantity: clickCount,
                    });
                } catch (error:any) {
                    logger.error(`Basket Route: POST: Error inserting product with ID ${id} for order ${orderId}. Error: ${error.message}, Stack: ${error.stack}`);
                    res.status(STATUS_CODES.SERVER_ERROR).send(`Basket error: ${MESSAGES.SERVER_ERROR}`);
                    return;
                }
            }
        }
        res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error:any) {
        return handleError(res, error, "Basket Route: POST", MESSAGES.UNKNOW_ERROR);
    }
});

export default router;