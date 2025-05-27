import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { handleError, handleNoRecordsModified, handleWarning } from "../../config/config";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import {AddressRecord} from "../../database/Records/Address/AddressRecord";
const router = express.Router();

router.use(middleware);

router.get("/", async (req: Request, res: Response) => {
    try {
      const ordersList = await OrdersRecord.getPendingList();
     // console.log(ordersList);
      return res.status(STATUS_CODES.SUCCESS).json({ ordersList });
    } catch (error: any) {
      return handleError(res, error, "Sales Route: GET", MESSAGES.UNKNOW_ERROR);
    }
});

router.post("/", async (req: Request, res: Response) => {
  let formData = req.body;
  formData = {
    miasto: formData.city || null,
    ulica: formData.street || null,
    nr_budynku: formData.building || null,
    nr_mieszkania: formData.no_apartment || null,
    kod: formData.code || null,
    nazwa_firmy: formData.company_name || null,
    client_id: formData.client_id || null
  };

    if (!formData.client_id || !formData.miasto || !formData.ulica) {
      return handleWarning(res, "Sales Route: POST: Missing required address or client data", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
    }
    try {
      await AddressRecord.insert(formData);
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      return handleError(res, error, "Sales Route address: POST", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, formData.client_id);
    }
});

router.post("/new-order", async (req: Request, res: Response) => {
  const {client_id, client_address_id} = req.body;
    if (!client_id || !client_address_id) {
      return handleWarning(res, "Sales/new-order Route: POST: Missing client or address ID", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
    }
    try {
      const order_id = await OrdersRecord.insert(client_id, client_address_id );
      return res.status(STATUS_CODES.SUCCESS).send({ order_id: order_id, message: MESSAGES.SUCCESSFUL_OPERATION });
    } catch (error: any) {
      return handleError(res, error, "Sales/new-order Route: POST: Failed to create new order for client id", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, client_id);
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id:string = req.params.id;
    try {
      const [result] = await OrdersRecord.delete(id); 
        if (handleNoRecordsModified(res, "Sales Route: DELETE", id, result)) {
          return; 
        }
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      return handleError(res, error, "Sales Route: DELETE", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, id);
    }
});

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Endpoints for managing sales and orders.
 */

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Retrieve a list of all orders.
 *     description: This endpoint retrieves all orders assigned to the seller. Requires authentication.
 *     tags:
 *       - Sales
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ordersList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Order identifier.
 *                         example: "123"
 *                       client_id:
 *                         type: string
 *                         description: Client identifier.
 *                         example: "456"
 *                       client_address_id:
 *                         type: string
 *                         description: Client address identifier.
 *                         example: "789"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the order was created.
 *                         example: "2024-03-21T14:45:29.000Z"
 *       404:
 *         description: No orders found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "No orders found."
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
 * /sales:
 *   post:
 *     summary: Add a new address.
 *     description: This endpoint adds a new address. Requires authentication.
 *     tags:
 *       - Sales
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 description: City of the address.
 *                 example: "Warsaw"
 *               street:
 *                 type: string
 *                 description: Street name of the address.
 *                 example: "Main St"
 *               building:
 *                 type: string
 *                 description: Building number.
 *                 example: "12A"
 *               no_apartment:
 *                 type: string
 *                 description: Apartment number.
 *                 example: "5"
 *               code:
 *                 type: string
 *                 description: Postal code.
 *                 example: "00-123"
 *               company_name:
 *                 type: string
 *                 description: Name of the company.
 *                 example: "Tech Solutions"
 *               client_id:
 *                 type: string
 *                 description: Client identifier.
 *                 example: "456"
 *     responses:
 *       200:
 *         description: Successfully added the address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Operation completed successfully."
 *       400:
 *         description: Bad request due to missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Bad request. Missing required address or client data."
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
 * /sales/new-order:
 *   post:
 *     summary: Create a new order.
 *     description: This endpoint creates a new order. Requires authentication.
 *     tags:
 *       - Sales
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: string
 *                 description: Client identifier.
 *                 example: "456"
 *               client_address_id:
 *                 type: string
 *                 description: Client address identifier.
 *                 example: "789"
 *     responses:
 *       200:
 *         description: Successfully created a new order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: string
 *                   description: Identifier of the newly created order.
 *                   example: "123"
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Operation completed successfully."
 *       400:
 *         description: Bad request due to missing client or address ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Bad request. Missing client or address ID."
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
 * /sales/{id}:
 *   delete:
 *     summary: Delete an order.
 *     description: This endpoint deletes an order by its identifier. Requires authentication.
 *     tags:
 *       - Sales
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the order.
 *       404:
 *         description: No order found with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "No order found with ID 123."
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
