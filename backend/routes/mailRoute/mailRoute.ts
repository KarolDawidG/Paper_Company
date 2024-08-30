import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { EmployeeEmail } from "./helpers/EmployeeEmailInterface";
import { validateEmail } from "./helpers/validateEmailData";
import { handleResponse } from "./helpers/responseHandler";
import { fetchAllMails } from "../../config/mails/receiveEmails"; 
import { deleteMailById } from "../../config/mails/deleteMailById";
import { sendEmployeeEmail } from "../../config/mails/emailsSender";

const router = express.Router();
router.use(middleware, limiter, errorHandler);
router.use(express.json());

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emails = await fetchAllMails();
      if (emails.length === 0) {
        logger.warn("Mail Route: GET: No emails found.");
        return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
      }
    return res.status(STATUS_CODES.SUCCESS).json(emails); 
  } catch (error: any) {
    return handleError(res, error, "Mail Route: GET", MESSAGES.SERVER_ERROR);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id: any = req.params.id;

  try {
    await deleteMailById(id);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error: any) {
    return handleError(res, error, "Mail Route: DELETE", MESSAGES.SERVER_ERROR);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const emailData: EmployeeEmail[] = req.body;
  const errors: string[] = [];
  const successEmails: string[] = [];
  
  try {
    const emailPromises = emailData.map(async (email) => {
      if (!validateEmail(email, errors)) return;

      try {
        await sendEmployeeEmail(email.to, email.subject, email.message);
        successEmails.push(email.to);
      } catch (error:any) {
        logger.error(`Mail Route: POST: Failed to send email to ${email.to}. Error: ${error.message}`);
        errors.push(`Failed to send email to ${email.to}`);
      }
    });
    await Promise.all(emailPromises);

    return handleResponse(res, errors, successEmails);
  } catch (error: any) {
    return handleError(res, error, "Mail Route: POST", MESSAGES.SERVER_ERROR);
  }
});



/**
 * @swagger
 * tags:
 *   name: Mail
 *   description: Endpoints for managing email operations.
 */

/**
 * @swagger
 * /mail:
 *   get:
 *     summary: Retrieve a list of all emails.
 *     description: This endpoint retrieves all emails and is only available to authorized users.
 *     tags:
 *       - Mail
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
 *                     description: Email identifier.
 *                     example: "12345"
 *                   to:
 *                     type: string
 *                     description: Recipient's email address.
 *                     example: "jan.kowalski@example.com"
 *                   subject:
 *                     type: string
 *                     description: Subject of the email.
 *                     example: "Meeting Reminder"
 *                   message:
 *                     type: string
 *                     description: Body of the email.
 *                     example: "This is a reminder for the meeting scheduled at 10 AM."
 *       404:
 *         description: No emails found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "No emails found."
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

/**
 * @swagger
 * /mail/{id}:
 *   delete:
 *     summary: Delete an email by its ID.
 *     description: This endpoint allows the deletion of an email by its ID.
 *     tags:
 *       - Mail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the email to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Operation completed successfully."
 *       404:
 *         description: Email not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Email not found."
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

/**
 * @swagger
 * /mail:
 *   post:
 *     summary: Send emails.
 *     description: This endpoint allows sending multiple emails. It processes an array of email objects and handles errors accordingly.
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 to:
 *                   type: string
 *                   description: Recipient's email address.
 *                   example: "jan.kowalski@example.com"
 *                 subject:
 *                   type: string
 *                   description: Subject of the email.
 *                   example: "Meeting Reminder"
 *                 message:
 *                   type: string
 *                   description: Body of the email.
 *                   example: "This is a reminder for the meeting scheduled at 10 AM."
 *     responses:
 *       200:
 *         description: Operation completed successfully. Lists successfully sent emails and errors if any.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of successfully sent email addresses.
 *                   example: ["jan.kowalski@example.com"]
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of errors encountered.
 *                   example: ["Failed to send email to jan.kowalski@example.com"]
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