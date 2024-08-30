import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import {ClientRecord} from "../../database/Records/Client/ClientRecord";
const router = express.Router();
router.use(middleware, limiter);

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
      const clientList = await ClientRecord.getList();
      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ clientList });
    } catch (error: any) {
      logger.error(`Client Route: GET: Failed to fetch client list. Error: ${error.message}, Stack: ${error.stack}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Client Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.get("/client-data/:clientid/:addresid", async (req: Request, res: Response) => {
  const clientid:string = req.params.clientid;
  const addresid:string = req.params.addresid;

  try {
    const clientData = await ClientRecord.getClientData(clientid, addresid);
    return res
      .status(STATUS_CODES.SUCCESS)
      .json(clientData);
  } catch (error: any) {
    logger.error(`Client/client-data Route: GET: Failed to fetch data for client ${clientid} and address ${addresid}. Error: ${error.message}, Stack: ${error.stack}`);

    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Client/client-data Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

// uprzatnac ten syf xD
router.get("/:addressId", verifyToken, async (req: Request, res: Response) => {
  const id:string = req.params.addressId;

  try {
    const clientAddress = await ClientRecord.getAddress([id]);
    return res
      .status(STATUS_CODES.SUCCESS)
      .json({ clientAddress });
  } catch (error: any) {
    logger.error(`Client Route Get Address: GET: Failed to fetch address with ID ${id}. Error: ${error.message}, Stack: ${error.stack}`);
    return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Client Route Get Address: GET: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  const formData = req.body;

    try {
      await ClientRecord.insert(formData)
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      logger.error(`Client Route: POST: Failed to insert client data: ${JSON.stringify(formData)}. Error: ${error.message}, Stack: ${error.stack}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Client Route: POST: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.delete("/:clientId", verifyToken, async (req: Request, res: Response) => {
  const id:string = req.params.clientId;

    try {
      await ClientRecord.delete(id)
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      logger.error(`Client Route: DELETE: Failed to delete client with ID ${id}. Error: ${error.message}, Stack: ${error.stack}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Client Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { first_name, second_name, email } = req.body;

    try {
      await ClientRecord.updateClient([id, first_name, second_name, email ]);
      return res
        .status(STATUS_CODES.SUCCESS)
        .send("Dane ustawione poprawnie.");
    } catch (error: any) {
      logger.error(`Users Route: PUT: Failed to update client with ID ${id}. Data: ${JSON.stringify(req.body)}. Error: ${error.message}, Stack: ${error.stack}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Users Route: PUT: ${MESSAGES.UNKNOW_ERROR}`);
    }
});


/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Endpointy do zarzadzania klientami.
 */

/**
 * @swagger
 * /client:
 *   get:
 *     summary: Pobiera listę wszystkich klientow.
 *     description: Endpoint służący do pobierania listy wszystkich klientow.
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano listę klientow.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ordersList:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Błąd serwera podczas pobierania listy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 */

/**
 * @swagger
 * /client:
 *   post:
 *     summary: Dodaje nowego klienta.
 *     description: Jak wyzej.
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
 *               second_name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Pomyślnie pobrano listę.
 *       '400':
 *         description: Błąd w żądaniu.
 *       '401':
 *         description: Nieautoryzowany dostęp.
 *       '500':
 *         description: Wystąpił błąd serwera.
 */

/**
 * @swagger
 * /client/{id}:
 *   delete:
 *     summary: Usuwa danego klienta.
 *     description: Endpoint służący do usuwania danego klienta.
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie usunięto klienta.
 *       500:
 *         description: Błąd serwera podczas usuwania.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 */
export default router;