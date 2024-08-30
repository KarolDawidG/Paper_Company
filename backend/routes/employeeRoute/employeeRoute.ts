import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";
import { EmployeeRecord } from "../../database/Records/Employee/EmployeeRecord";
const router = express.Router();
router.use(middleware, limiter, errorHandler);

//todo: dokumentacja do zmiany
router.get("/", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersList = await EmployeeRecord.selectAll();
        if (usersList.length === 0) {
          logger.warn("Employee Route: GET: No employees found.");
          return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
        }
      return res.status(STATUS_CODES.SUCCESS).json(usersList );
    } catch (error: any) {
      return handleError(res, error, "Employee Route: GET", MESSAGES.SERVER_ERROR);
  }
  },
);


/**
 * @swagger
 * tags:
 *   name: nn
 *   description: Endpointy do zarzadzania danymi pracownikow.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobiera listę wszystkich użytkowników.
 *     description: Endpoint dostępny tylko dla użytkowników o roli "admin".
 *     tags:
 *       - nn
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
 *       - nn
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
 *     tags: [nn]
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
