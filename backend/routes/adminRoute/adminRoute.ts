import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";

const router = express.Router();

router.use(middleware, limiter, errorHandler);
//todo: dokumentacja do edycji
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await UsersRecord.listAll();
    return res.json({ usersList });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
},
);

router.put("/:id/:role", verifyToken, async (req, res) => {
  const id = req.params.id;
  const role = req.params.role;

  try {
    await UsersRecord.updateRole(role, id);
    return res.status(200).send("The operation has been successful.");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Unknown server error. Please contact your administrator.");
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;

  try {
    await UsersRecord.delete(id);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send("The operation has been successful.");
  } catch (error: any) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Users Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
  }
},
);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpointy do zarządzania użytkownikami.
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Pobiera listę wszystkich użytkowników.
 *     description: Endpoint służący do pobierania listy wszystkich użytkowników.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano listę użytkowników.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usersList:
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
 * /admin/{id}/{role}:
 *   put:
 *     summary: Aktualizuje rolę użytkownika.
 *     description: Endpoint służący do aktualizacji roli użytkownika na podstawie jego identyfikatora.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *       - in: path
 *         name: role
 *         required: true
 *         description: Nowa rola użytkownika.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie zaktualizowano rolę użytkownika.
 *       500:
 *         description: Błąd serwera podczas aktualizacji roli użytkownika.
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
 * /admin/{id}:
 *   delete:
 *     summary: Usuwa użytkownika.
 *     description: Endpoint służący do usuwania użytkownika na podstawie jego identyfikatora.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie usunięto użytkownika.
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
