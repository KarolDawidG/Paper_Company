import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError } from "../../config/config";
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
        logger.warn("Admin Route: GET: No users found.");
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send(MESSAGES.NOT_FOUND);
      }
    return res
      .status(STATUS_CODES.SUCCESS)
      .json({ usersList });
  } catch (error: any) {
    return handleError(res, error, "Admin Route: GET", MESSAGES.UNKNOW_ERROR);
  }
},
);

router.put("/:id/:role", verifyToken, async (req, res) => {
  const {id, role} = req.params;

  try {
    const [result] = await UsersRecord.updateRole(role, id);
      if (result.affectedRows === 0) {
        logger.warn(`Admin Route: PUT: No user found with ID ${id} to update.`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send(MESSAGES.NOT_FOUND);
      }
    return res
      .status(STATUS_CODES.SUCCESS)
      .send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error:any) {
    logger.error(`Admin Route: PUT: Error updating role for user ID ${id} to ${role}. Error: ${error.message}, Stack: ${error.stack}`);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Admin Route: PUT: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;

  try {
    const [result] = await UsersRecord.delete(id);
      if (result.affectedRows === 0) {
        logger.warn(`Admin Route: DELETE: No user found to delete with ID ${id}.`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send(MESSAGES.NOT_FOUND);
      }
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error: any) {
    logger.error(`Admin Route: DELETE: Error deleting user with ID ${id}. Error: ${error.message}, Stack: ${error.stack}`);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Admin Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
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
