import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { handleError, handleNoRecordsModified, limiter } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import {ClientRecord} from "../../database/Records/Client/ClientRecord";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";
const router = express.Router();
router.use(middleware, limiter);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const clientList = await ClientRecord.getList();
    if (clientList.length === 0) {
      logger.warn("Client Route: GET: No clients found.");
      return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
    }
    return res.status(STATUS_CODES.SUCCESS).json({ clientList });
  } catch (error: any) {
    return handleError(res, error, "Client Route: GET", MESSAGES.UNKNOW_ERROR);
  }
});

router.get("/client-data/:clientid/:addresid", async (req: Request, res: Response) => {
  const { clientid, addresid } = req.params;

  try {
    const queryResult = await ClientRecord.getClientData(clientid, addresid);
    const clientData = queryResult as any[]; 
    //generuje niepotrzeny log, gdy brakuje klientow i adresow dostaw
      // if (clientData.length === 0) {
      //   logger.warn(`Client Route: GET: No data found for client ${clientid} and address ${addresid}.`);
      //   return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
      // }
      // TODO: Jesli clientData.length === 0 nie wysyłac json
    return res.status(STATUS_CODES.SUCCESS).json(clientData);
  } catch (error: any) {
    return handleError(res, error, "Client/client-data Route: GET", MESSAGES.UNKNOW_ERROR);
  }
});

router.get("/:addressId/:orderId", async (req: Request, res: Response) => {
  const addressId:string = req.params.addressId;
  const orderId:string = req.params.orderId;

    try {
      //pobieranie adresów poszczególnego zamówienia
      const clientAddress = await ClientRecord.getAddress([addressId]);
      // pobieranie danych produktów z poszczególnego zamówienia
      const quantityAndItems = await OrdersRecord.quantityAndItems(orderId);
      
      const orderDetails = {
        clientAddress: clientAddress,
        products: quantityAndItems,
      };
     // console.log(orderDetails);
      return res.status(STATUS_CODES.SUCCESS).json({ orderDetails });
    } catch (error: any) {
      return handleError(res, error, "Client Route Get Address: GET", MESSAGES.UNKNOW_ERROR);
    }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  const formData = req.body;
    if (!formData.first_name || !formData.second_name || !formData.email ) {
      return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.BAD_REQUEST);
    }
  try {
    console.log(formData);
    await ClientRecord.insert(formData);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error: any) {
    return handleError(res, error, "Client Route: POST", MESSAGES.UNKNOW_ERROR);
  }
});

router.delete("/:clientId", verifyToken, async (req: Request, res: Response) => {
  const { clientId } = req.params;
  
    try {
      const [result] = await ClientRecord.delete(clientId);
        if (handleNoRecordsModified(res, "Client Route: DELETE", clientId, result)) {
          return; 
        }
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      return handleError(res, error, "Client Route: DELETE", MESSAGES.UNKNOW_ERROR);
    }
});

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { first_name, second_name, email } = req.body;

      if (!first_name || !second_name || !email ) {
        return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.BAD_REQUEST);
      }
    try {
      const result = await ClientRecord.updateClient([id, first_name, second_name, email ]);
        if (handleNoRecordsModified(res, "Client Route: PUT", id, result)) {
          return; 
        }
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      return handleError(res, error, "Client Route: PUT", MESSAGES.UNKNOW_ERROR);
    }
});


/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Endpoints for managing clients.
 */

/**
 * @swagger
 * /client:
 *   get:
 *     summary: Get list of all clients.
 *     description: Endpoint to fetch the list of all clients.
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of clients.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Client ID.
 *                         example: '12345'
 *                       first_name:
 *                         type: string
 *                         description: Client's first name.
 *                         example: 'John'
 *                       second_name:
 *                         type: string
 *                         description: Client's second name.
 *                         example: 'Doe'
 *                       email:
 *                         type: string
 *                         description: Client's email.
 *                         example: 'john.doe@example.com'
 *       500:
 *         description: Server error during fetching the client list.
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

/**
 * @swagger
 * /client:
 *   post:
 *     summary: Add a new client.
 *     description: Endpoint to add a new client.
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Client's first name.
 *                 example: 'John'
 *               second_name:
 *                 type: string
 *                 description: Client's second name.
 *                 example: 'Doe'
 *               email:
 *                 type: string
 *                 description: Client's email.
 *                 example: 'john.doe@example.com'
 *     responses:
 *       200:
 *         description: Successfully added new client.
 *       400:
 *         description: Bad request due to invalid input.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error during client insertion.
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

/**
 * @swagger
 * /client/{id}:
 *   delete:
 *     summary: Delete a client.
 *     description: Endpoint to delete a client by ID.
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Client ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the client.
 *       500:
 *         description: Server error during client deletion.
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

/**
 * @swagger
 * /client/{id}:
 *   put:
 *     summary: Update client data.
 *     description: Endpoint to update client details by ID.
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Client ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Client's first name.
 *                 example: 'John'
 *               second_name:
 *                 type: string
 *                 description: Client's second name.
 *                 example: 'Doe'
 *               email:
 *                 type: string
 *                 description: Client's email.
 *                 example: 'john.doe@example.com'
 *     responses:
 *       200:
 *         description: Successfully updated client data.
 *       400:
 *         description: Bad request due to invalid input.
 *       500:
 *         description: Server error during client update.
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