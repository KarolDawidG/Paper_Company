import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { handleError, handleWarning, limiter, verifyToken } from "../../config/config";
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
          return handleWarning(res, `Products Route: GET: No products found for locale: ${locale}`, MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
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
        return handleWarning(res, "Products/cart/id Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, productId);

      }
    return res.status(STATUS_CODES.SUCCESS).json(productsData );
  } catch (error: any) {
    return handleError(res, error, "Products/cart/id Route: GET", MESSAGES.UNKNOW_ERROR);
  }
});

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints for managing product data.
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of all products.
 *     description: This endpoint retrieves all products based on the locale specified in the 'Accept-Language' header.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         description: Locale for the products data (e.g., 'en', 'pl', 'fr').
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['en', 'pl', 'fr']
 *           default: 'en'
 *     responses:
 *       200:
 *         description: Operation completed successfully. Returns the list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productsData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Product identifier.
 *                         example: "9"
 *                       name:
 *                         type: string
 *                         description: Product name.
 *                         example: "Copy Self-Adhesive Paper A4"
 *                       description:
 *                         type: string
 *                         description: Detailed product description.
 *                         example: "Self-adhesive paper, A4 format, pack of 100 sheets"
 *                       category:
 *                         type: string
 *                         description: Product category.
 *                         example: "Papier do drukarek"
 *                       price:
 *                         type: number
 *                         format: float
 *                         description: Product price.
 *                         example: 29.99
 *                       stock:
 *                         type: integer
 *                         description: Available stock quantity.
 *                         example: 50
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the product was created.
 *                         example: "2024-03-21T14:45:29.000Z"
 *       404:
 *         description: No products found for the specified locale.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "No products found for the specified locale."
 *       500:
 *         description: An unknown server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An unknown server error occurred."
 */

/**
 * @swagger
 * /products/cart/{id}:
 *   get:
 *     summary: Retrieve a specific product by its ID.
 *     description: This endpoint retrieves a product by its ID. The locale can be specified as a query parameter.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve.
 *         schema:
 *           type: string
 *       - in: query
 *         name: locale
 *         description: Locale for the product data (e.g., 'en', 'pl', 'fr').
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['en', 'pl', 'fr']
 *           default: 'en'
 *     responses:
 *       200:
 *         description: Operation completed successfully. Returns the product data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Product identifier.
 *                   example: "9"
 *                 name:
 *                   type: string
 *                   description: Product name.
 *                   example: "Copy Self-Adhesive Paper A4"
 *                 description:
 *                   type: string
 *                   description: Detailed product description.
 *                   example: "Self-adhesive paper, A4 format, pack of 100 sheets"
 *                 category:
 *                   type: string
 *                   description: Product category.
 *                   example: "Papier do drukarek"
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: Product price.
 *                   example: 29.99
 *                 stock:
 *                   type: integer
 *                   description: Available stock quantity.
 *                   example: 50
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Date and time when the product was created.
 *                   example: "2024-03-21T14:45:29.000Z"
 *       404:
 *         description: Product with the given ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "No address found for the given ID."
 *       500:
 *         description: An unknown server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An unknown server error occurred."
 */


export default router;
