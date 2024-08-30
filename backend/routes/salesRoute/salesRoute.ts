import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { handleError, limiter } from "../../config/config";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import {AddressRecord} from "../../database/Records/Address/AddressRecord";
const router = express.Router();
router.use(middleware, limiter);

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
      const ordersList = await OrdersRecord.getListById();
        if (!ordersList || ordersList.length === 0) {
          logger.warn("Sales Route: GET: No orders found.");
          return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
        }
      return res.status(STATUS_CODES.SUCCESS).json({ ordersList });
    } catch (error: any) {
      return handleError(res, error, "Sales Route: GET", MESSAGES.UNKNOW_ERROR);
    }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
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
      logger.warn("Sales Route: POST: Missing required address or client data.");
      return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.BAD_REQUEST);
    }
    try {
      await AddressRecord.insert(formData);
      return res.status(STATUS_CODES.SUCCESS).send({ message: MESSAGES.SUCCESSFUL_OPERATION });
    } catch (error: any) {
      logger.error(`Sales Route address: POST: Failed to insert address for client id: ${formData.client_id}. Error: ${error.message}`);
      return res.status(STATUS_CODES.SERVER_ERROR).send(`Sales Route address: POST: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.post("/new-order", verifyToken, async (req: Request, res: Response) => {
  const {client_id, client_address_id} = req.body;

    if (!client_id || !client_address_id) {
      logger.warn("Sales/new-order Route: POST: Missing client or address ID.");
      return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.BAD_REQUEST);
    }

    try {
      const order_id = await OrdersRecord.insert(client_id, client_address_id );
      return res.status(STATUS_CODES.SUCCESS).send({ order_id: order_id, message: MESSAGES.SUCCESSFUL_OPERATION });
    } catch (error: any) {
      logger.error(`Sales/new-order Route: POST: Failed to create new order for client id: ${client_id}. Error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(`Sales/new-order Route: POST: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const id:string = req.params.id;
    try {
      const [result] = await OrdersRecord.delete(id);
        if (result.affectedRows === 0) {
          logger.warn(`Sales Route: DELETE: No order found with ID ${id}.`);
          return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
        }
  
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      logger.error(`Sales Route: DELETE: Failed to delete order with ID ${id}. Error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(`Sales Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Endpointy do zarzadzania sprzedaza.
 */

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Pobiera listę wszystkich zamowien nad ktorymi pracuje dany sprzedawca.
 *     description: Endpoint służący do pobierania listy wszystkich sprzedazy.
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano listę sprzedazy.
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
 *         description: Błąd serwera podczas pobierania listy użytkowników.
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
 * /sales:
 *   post:
 *     summary: Dodaje nowe sprzedarze.
 *     description: Jak wyzej.
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imie:
 *                 type: string
 *               email:
 *                 type: string
 *               produkt:
 *                 type: string
 *               ilosc:
 *                 type: string
 *               miasto:
 *                 type: string
 *               ulica:
 *                 type: string
 *               nr_budynku:
 *                 type: string
 *               nr_mieszkania:
 *                 type: string
 *               kod:
 *                 type: string
 *               nazwa_firmy:
 *                 type: string
 *               salesId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Pomyślnie pobrano listę zamowien.
 *       '400':
 *         description: Błąd w żądaniu.
 *       '401':
 *         description: Nieautoryzowany dostęp.
 *       '500':
 *         description: Wystąpił błąd serwera.
 */

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Usuwa zamowienia.
 *     description: Endpoint służący do usuwania zamowienia na podstawie jego identyfikatora.
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator zamowienia.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie usunięto zamowienie.
 *       500:
 *         description: Błąd serwera podczas usuwania użytkownika.
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
