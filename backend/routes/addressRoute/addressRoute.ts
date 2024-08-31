import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import { handleError, handleWarning, limiter } from "../../config/config";
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
        if (addressList.length === 0) {
          return handleWarning(res, "Address Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, id);
        }
      return res.status(STATUS_CODES.SUCCESS).json({ addressList });
    } catch (error: any) {
      return handleError(res, error, "Address Route: GET", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, id);
    }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const id:string = req.params.id;
    try {
      const [result] = await AddressRecord.delete(id);
        if (result.affectedRows === 0) {
          return handleWarning(res, "Address Route: DELETE", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, id);
        }
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) { 
      return handleError(res, error, "Address Route: DELETE", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, id);
    }
});

 /**
 * @swagger
 * tags:
 *   name: Address
 *   description: Endpoints for managing user addresses.
 */

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Retrieves the list of addresses for a given user ID.
 *     description: This endpoint retrieves a list of addresses based on the user ID.
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of addresses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 addressList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "ab68bc7d-39f1-4d3d-9a57-ff11a08c0a29"
 *                       client_id:
 *                         type: string
 *                         example: "84b4a462-e420-48b2-ab41-da6cf59e0220"
 *                       miasto:
 *                         type: string
 *                         example: "Gdynia"
 *                       ulica:
 *                         type: string
 *                         example: "Swietojanska"
 *                       nr_budynku:
 *                         type: string
 *                         example: "22"
 *                       nr_mieszkania:
 *                         type: string
 *                         example: "2"
 *                       kod:
 *                         type: string
 *                         example: "22-111"
 *                       nazwa_firmy:
 *                         type: string
 *                         example: "Kompany name Gdynia"
 *       404:
 *         description: No address found for the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No address found for the given ID."
 *       500:
 *         description: Server error while retrieving the list of addresses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server encountered an error. Please contact the administrator for support."
 */


/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     summary: Deletes an address by ID.
 *     description: This endpoint deletes an address based on its ID.
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operation completed successfully."
 *       404:
 *         description: No address found to delete for the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No address found for the given ID."
 *       500:
 *         description: Server error while deleting the address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server encountered an error. Please contact the administrator for support."
 */

export default router;
