import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { areNonEmptyStrings, handleError, handleNoRecordsModified, handleWarning, limiter, normalizeString, requireRoles, validateEmail, verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import {ClientRecord} from "../../database/Records/Client/ClientRecord";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";
import { saveOrderDetailsToFile } from "../../config/fileUtils";

const router = express.Router();
router.use(middleware, limiter);

const getNormalizedClientPayload = (body: any) => ({
  first_name: normalizeString(body.first_name),
  second_name: normalizeString(body.second_name),
  email: normalizeString(body.email),
  company_name: normalizeString(body.company_name),
});

router.get("/", verifyToken, requireRoles("sales", "admin"), async (req: Request, res: Response) => {
  try {
    const clientList = await ClientRecord.getList();
    if (clientList.length === 0) {
      logger.warn("Client Route: GET: No clients found.");
      // 27.10.5.16: Lista klientów używa handleWarning, żeby brak danych był obsłużony tak samo jak w innych routerach.
      return handleWarning(res, "Client Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    return res.status(STATUS_CODES.SUCCESS).json({ clientList });
  } catch (error: any) {
    return handleError(res, error, "Client Route: GET", MESSAGES.UNKNOW_ERROR);
  }
});

router.get("/client-data/:clientid/:addresid", verifyToken, requireRoles("sales", "admin"), async (req: Request, res: Response) => {
  const clientid = normalizeString(req.params.clientid);
  const addresid = normalizeString(req.params.addresid);

  if (!areNonEmptyStrings(clientid, addresid)) {
    return handleWarning(res, "Client/client-data Route: GET: Missing ids", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
  }

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

// 27.8.3: Szczegóły zamówienia są współdzielone przez sprzedaż i księgowość przy generowaniu faktur.
router.get("/:addressId/:orderId", verifyToken, requireRoles("sales", "accounting", "admin"), async (req: Request, res: Response) => {
  const addressId:string = normalizeString(req.params.addressId);
  const orderId:string = normalizeString(req.params.orderId);
    if (!areNonEmptyStrings(addressId, orderId)) {
      return handleWarning(res, "Client Route Get Address: GET: Missing ids", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
    }
    try {
      const clientAddress = await ClientRecord.getAddress([addressId]);
      const quantityAndItems = await OrdersRecord.quantityAndItems(orderId);
      const orderDetails = {
        clientAddress: clientAddress,
        products: quantityAndItems,
      };
    
      return res.status(STATUS_CODES.SUCCESS).json({ orderDetails });
    } catch (error: any) {
      return handleError(res, error, "Client Route Get Address: GET", MESSAGES.UNKNOW_ERROR);
    }
});

// Nowy endpoint zapisujący szczegóły zamówienia do pliku JSON po naciśnięciu przycisku "Zapisz" na froncie
router.post("/save/:orderId", verifyToken, requireRoles("sales", "admin"), async (req: Request, res: Response) => {
  const orderId: string = normalizeString(req.params.orderId);
  const addressId: string = normalizeString(req.body.addressId);
  const clientId: string = normalizeString(req.body.clientId);

  if (!areNonEmptyStrings(orderId, addressId, clientId)) {
    return handleWarning(res, "Client Route: POST /save: Missing order, address or client id", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
  }

    try {
      const clientAddress = await ClientRecord.getAddress([addressId]);
      const quantityAndItems = await OrdersRecord.quantityAndItems(orderId);
      const clientData = await ClientRecord.getClientDataById([clientId])
    
      const orderDetails = { clientAddress: clientAddress, clientData: clientData, products: quantityAndItems,};

      // Zapis danych zamówienia do pliku JSON
      saveOrderDetailsToFile(orderDetails, orderId);

      await OrdersRecord.updateStatus(orderId, 'shipped');

      return res.status(STATUS_CODES.SUCCESS).json({ message: "Order details saved to file." });
    } catch (error: any) {
      return handleError(res, error, "Error saving order details", MESSAGES.UNKNOW_ERROR);
    }
});


router.post("/", verifyToken, requireRoles("sales", "admin"), async (req: Request, res: Response) => {
  const formData = getNormalizedClientPayload(req.body);
    // 27.7.3: Dane klienta przechodzą wspólną walidację pól wymaganych i formatu e-mail.
    if (!areNonEmptyStrings(formData.first_name, formData.second_name, formData.email, formData.company_name)) {
      return handleWarning(res, "Client Route: POST: Missing required client fields", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
    }
    if (!validateEmail(formData.email)) {
      return handleWarning(res, "Client Route: POST: Invalid email", MESSAGES.INVALID_EMAIL, STATUS_CODES.BAD_REQUEST);
    }
  try {
    
    await ClientRecord.insert(formData);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error: any) {
    return handleError(res, error, "Client Route: POST", MESSAGES.UNKNOW_ERROR);
  }
});

router.delete("/:clientId", verifyToken, requireRoles("sales", "admin"), async (req: Request, res: Response) => {
  const clientId = normalizeString(req.params.clientId);
  if (!clientId) {
    return handleWarning(res, "Client Route: DELETE: Missing client id", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
  }
  
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

router.put("/:id", verifyToken, requireRoles("sales", "admin"), async (req: Request, res: Response) => {
  const id: string = normalizeString(req.params.id);
  const formData = getNormalizedClientPayload(req.body);

      if (!areNonEmptyStrings(id, formData.first_name, formData.second_name, formData.email)) {
        return handleWarning(res, "Client Route: PUT: Missing required client fields", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
      }
      if (!validateEmail(formData.email)) {
        return handleWarning(res, "Client Route: PUT: Invalid email", MESSAGES.INVALID_EMAIL, STATUS_CODES.BAD_REQUEST);
      }
    try {
      const result = await ClientRecord.updateClient([id, formData.first_name, formData.second_name, formData.email ]);
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
