import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import { limiter } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import {AddressRecord} from "../../database/Records/Address/AddressRecord";
const router = express.Router();
router.use(middleware, limiter);

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id:string = req.params.id;
    try {
      const addressList = await AddressRecord.getListById(id);
      return res.json({ addressList });
    } catch (error: any) {
      logger.error(`Address Route: GET: ${error.message}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Address Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const id:string = req.params.id;

    try {
      await AddressRecord.delete(id)
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      logger.error(`Address Route: DELETE: ${error.message}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Address Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
    }
});

/**
 * @swagger
 * tags:
 *   name: Adres
 *   description: Endpointy do zarzadzania sprzedaza.
 */

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Pobiera listę wszystkich adresow danego uzytkownika.
 *     description: Endpoint służący do pobierania adresow.
 *     tags: [Adres]
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano listę.
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
 * /address/{id}:
 *   delete:
 *     summary: Usuwa adres.
 *     description: Endpoint służący do usuwania adresu na podstawie jego identyfikatora.
 *     tags: [Adres]
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
