import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import STATUS_CODES from "../../config/status-codes";
import { verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";

const router = express.Router();
router.use(middleware, limiter, errorHandler);

router.get("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    try {
      const [userInfo]: any = await UsersRecord.selectUrlById([id]);
      return res.status(STATUS_CODES.SUCCESS).json(userInfo);
    } catch (error: any) {
      return handleError(res, error, "URL Route: GET", MESSAGES.SERVER_ERROR);
    }
  },
);

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const img_url: string = req.body.img_url;

  try {
    await UsersRecord.updateImgUrl(id, img_url);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error: any) {
    return handleError(res, error, "URL Route: PUT", MESSAGES.SERVER_ERROR);
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;
  
    try {
      await UsersRecord.deleteUrl(id);
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      return handleError(res, error, "URL Route: DELETE", MESSAGES.SERVER_ERROR);
    }
  },
);

/**
 * @swagger
 * tags:
 *   name: URL
 *   description: Endpointy do obsługi danych związanych z URL awatara użytkownika.
 */

/**
 * @swagger
 * /url/{id}:
 *   get:
 *     summary: Pobiera informacje dotyczące URL użytkownika.
 *     description: Endpoint do pobierania informacji dotyczących URL użytkownika na podstawie identyfikatora.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano informacje dotyczące URL użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userInfo:
 *                   type: object
 *                   description: Informacje dotyczące URL użytkownika.
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
 * /url/{id}:
 *   put:
 *     summary: Aktualizuje URL użytkownika.
 *     description: Endpoint do aktualizacji URL użytkownika na podstawie identyfikatora.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               img_url:
 *                 type: string
 *                 description: Nowy URL obrazu użytkownika.
 *     responses:
 *       200:
 *         description: Pomyślnie zaktualizowano URL użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat potwierdzający aktualizację.
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
 * /url/{id}:
 *   delete:
 *     summary: Usuwa URL użytkownika.
 *     description: Endpoint do usuwania URL użytkownika na podstawie identyfikatora.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pomyślnie usunięto URL użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat potwierdzający usunięcie.
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
