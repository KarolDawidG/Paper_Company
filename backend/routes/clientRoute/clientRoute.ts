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

      return res.json({ clientList });
    } catch (error: any) {
      logger.error(`Client Route: GET: ${error.message}`);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Client Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
});
// uprzatnac ten syf xD
router.get("/:addressId", verifyToken, async (req: Request, res: Response) => {
  const id:string = req.params.addressId;
  try {
    const clientAddress = await ClientRecord.getAddress([id]);
    return res.json({ clientAddress });
  } catch (error: any) {
    logger.error(`Client Route Get Address: GET: ${error.message}`);
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
      logger.error(`Client Route: POST: ${error.message}`);
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
      logger.error(`Client Route: DELETE: ${error.message}`);
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
      logger.error(error.message);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Users Route: PUT: ${MESSAGES.UNKNOW_ERROR}`);
    }
});


// router.put("/:id", verifyToken, async (req: Request, res: Response) => {
//   const id: string = req.params.id;
//   const {first_name, second_name, email} = req.body;
//     try {
//       await ClientRecord.updateClient(first_name, second_name, email, id);
//       return res
//         .status(STATUS_CODES.SUCCESS)
//         .send("Dane ustawione poprawnie.");
//     } catch (error: any) {
//       logger.error(error.message);
//       return res
//         .status(STATUS_CODES.SERVER_ERROR)
//         .send(`nn Route: PUT: ${MESSAGES.UNKNOW_ERROR}`);
//     }
// });

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


// ssh -o KexAlgorithms=diffie-hellman-group1-sha1 
// -o HostKeyAlgorithms=+ssh-rsa 
// -o Ciphers=+aes128-cbc 
// -o MACs=+hmac-sha1 user@192.168.1.200
