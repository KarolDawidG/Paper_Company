import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { OrdersRecord } from "../../database/Records/Users/OrdersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
const router = express.Router();
router.use(middleware, limiter, errorHandler);

router.get("/", async (req: Request, res: Response) => {
  const idUser:any = req.query.idUser;
    try {
      const ordersList = await OrdersRecord.getListById(idUser)
      return res.json({ ordersList });
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Sales Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  const formData = req.body;

    try {
      console.log(`Sales route: ${JSON.stringify(formData)}`);
      await OrdersRecord.insert(formData)
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Sales Route: POST: ${MESSAGES.UNKNOW_ERROR}`);
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

export default router;
