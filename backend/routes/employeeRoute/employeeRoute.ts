import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError, handleWarning } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import { verifyToken } from "../../config/config";
import { EmployeeRecord } from "../../database/Records/Employee/EmployeeRecord";
const router = express.Router();
router.use(middleware, limiter, errorHandler);

//todo: dokumentacja do zmiany
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersList = await EmployeeRecord.selectAll();
        if (usersList.length === 0) {
          return handleWarning(res, "Employee Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }
      return res.status(STATUS_CODES.SUCCESS).json(usersList );
    } catch (error: any) {
      return handleError(res, error, "Employee Route: GET", MESSAGES.SERVER_ERROR,  STATUS_CODES.NOT_FOUND);
  }
});

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Endpoints for managing employee data.
 */

/**
 * @swagger
 * /employee:
 *   get:
 *     summary: Retrieve a list of all employees.
 *     description: This endpoint returns a list of all employees and is only available to users with a valid authorization token.
 *     tags:
 *       - Employee
 *     responses:
 *       200:
 *         description: Operation completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Employee identifier.
 *                     example: "12345"
 *                   first_name:
 *                     type: string
 *                     description: Employee's first name.
 *                     example: "Jan"
 *                   last_name:
 *                     type: string
 *                     description: Employee's last name.
 *                     example: "Kowalski"
 *                   email:
 *                     type: string
 *                     description: Employee's email address.
 *                     example: "jan.kowalski@example.com"
 *       404:
 *         description: No address found for the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "No address found for the given ID."
 *       500:
 *         description: Server error encountered. Please contact the administrator for support.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server encountered an error. Please contact the administrator for support."
 */

export default router;
