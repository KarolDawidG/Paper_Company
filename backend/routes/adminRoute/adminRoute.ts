import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError, handleWarning, handleNoRecordsModified } from "../../config/config";
import { verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";

const router = express.Router();

router.use(middleware, limiter, errorHandler);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await UsersRecord.listAll();
      if (usersList.length === 0) {
        return handleWarning(res, "Admin Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }
    return res.status(STATUS_CODES.SUCCESS).json({ usersList });
  } catch (error: any) {
    return handleError(res, error, "Admin Route: GET", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR);
  }
});

router.put("/:id/:role", verifyToken, async (req, res) => {
  const {id, role} = req.params;
    try {
      const [result] = await UsersRecord.updateRole(role, id);
        if (handleNoRecordsModified(res, "Admin Route: PUT", id, result)) {
          return; 
        }
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error:any) {
      return handleError(res, error, "Admin Route: PUT", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, id);
    }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;
    try {
      const [result] = await UsersRecord.delete(id);
      if (handleNoRecordsModified(res, "Admin Route: DELETE", id, result)) {
        return; 
      }
        return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      return handleError(res, error, "Admin Route: DELETE", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, id);
    }
});

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
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 'fa97c775-1613-4035-b93b-2fb852e37ec0'
 *                       username:
 *                         type: string
 *                         example: 'Alexis'
 *                       email:
 *                         type: string
 *                         example: 'brill_alexis@gmail.com'
 *                       role:
 *                         type: string
 *                         example: 'hr'
 *                       img_url:
 *                         type: string
 *                         format: uri
 *                         example: 'https://utfs.io/f/0bdc1601-50e6-4862-8c05-bfb2e2a45f6f-hfzk01.jpg'
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-03-21T15:14:55.000Z'
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
 *                   example: 'Napotkano błąd serwera. Proszę skontaktować się z administratorem w celu uzyskania wsparcia.'
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
 *                   example: 'Napotkano błąd serwera. Proszę skontaktować się z administratorem w celu uzyskania wsparcia.'
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
 *                   example: 'Napotkano błąd serwera. Proszę skontaktować się z administratorem w celu uzyskania wsparcia.'
 */

export default router;
