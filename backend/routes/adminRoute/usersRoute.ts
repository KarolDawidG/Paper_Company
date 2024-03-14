import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
const router = express.Router();
router.use(middleware, limiter, errorHandler);

//todo: dokumentacja do zmiany
router.get("/:role", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const role: string = req.params.role;
    try {
      const usersList = await UsersRecord.listByRole(role);
      return res.json({ usersList });
    } catch (error: any) {
      logger.error(error.message);
      return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
    }
  },
);

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const userId: string = req.params.id;
  const {username, email} = req.body;
    try {
      await UsersRecord.updateUserData([username, email, userId]);
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

router.get("/user/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    try {
      const [userInfo]: any = await UsersRecord.selectById([id]);

      return res.status(STATUS_CODES.SUCCESS).json(userInfo);
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send(`Users Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
    }
  },
);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpointy do zarzadzania danymi uzytkownika.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobiera listę wszystkich użytkowników.
 *     description: Endpoint dostępny tylko dla użytkowników o roli "admin".
 *     tags:
 *       - Users
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
 *                     properties:
 *                       // Odpowiednie pola, takie jak id, username, email itp.
 *       403:
 *         description: Brak dostępu do zasobu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *       500:
 *         description: Błąd serwera.
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
 * /users/{id}:
 *   get:
 *     summary: Pobiera informacje o użytkowniku.
 *     description: Endpoint dostępny tylko dla użytkowników o roli "admin".
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano informacje o użytkowniku.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                    // Odpowiednie pola, takie jak id, username, email itp.
 *       403:
 *         description: Brak dostępu do zasobu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *       500:
 *         description: Błąd serwera.
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
 * /users/user/{id}:
 *   get:
 *     summary: Pobiera informacje o użytkowniku.
 *     description: Pobiera informacje o użytkowniku na podstawie jego identyfikatora.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano informacje o użytkowniku.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Brak dostępu do zasobu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *       500:
 *         description: Błąd serwera.
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
