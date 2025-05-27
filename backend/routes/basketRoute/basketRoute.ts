import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { handleError, handleWarning, limiter } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import { BasketRecord } from "../../database/Records/Basket/BasketRecord";
import { ProductsRecord } from "../../database/Records/Products/ProductsRecord";

const router = express.Router();
router.use(middleware, limiter);

router.post("/", verifyToken, async (req: Request, res: Response) => {
  const basketData = req.body;
  const orderId = basketData.order_id;
    try {
      if (!orderId) {
        return handleWarning(res, "Basket Route: POST: Missing order_id in request", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
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
                    logger.error(`Error inserting product with ID ${id} for order ${orderId}`);
                    return handleError(res, error, "Basket Route: POST - insert", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR);
                }
            }
        }

        //zmniejszenie ilosci produktu

        try {
            await ProductsRecord.decreaseQuantitiesForOrder(orderId);
            
        } catch (error:any) {
                logger.error("Basket route: stock");
                return handleError(res, error, "Basket Route: POST: decrease", MESSAGES.UNKNOW_ERROR, 409);
        }



        res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error:any) {
        return handleError(res, error, "Basket Route: POST", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR);
    }
});

/**
 * @swagger
 * tags:
 *   name: Basket
 *   description: Endpointy do zarządzania koszykiem zakupów.
 */

/**
 * @swagger
 * /basket:
 *   post:
 *     summary: Add products to the basket for a given order.
 *     description: Endpoint for adding products to the basket based on the order ID and product details.
 *     tags:
 *       - Basket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: '123456789'
 *                 description: The ID of the order to which products are added.
 *               products:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 'prod123'
 *                       description: The ID of the product.
 *                     name:
 *                       type: string
 *                       example: 'Product Name'
 *                       description: The name of the product.
 *                     description:
 *                       type: string
 *                       example: 'Product Description'
 *                       description: A brief description of the product.
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 29.99
 *                       description: The price of the product.
 *                     stock:
 *                       type: integer
 *                       example: 50
 *                       description: The stock level of the product.
 *                     clickCount:
 *                       type: integer
 *                       example: 3
 *                       description: The quantity of the product added to the basket.
 *     responses:
 *       200:
 *         description: Successfully added products to the basket.
 *       400:
 *         description: Bad request due to missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Invalid request. Please check the data and try again.'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Server error encountered. Please contact the administrator for support.'
 */

export default router;