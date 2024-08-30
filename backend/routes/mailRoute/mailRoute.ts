import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
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
    return res
      .status(STATUS_CODES.SUCCESS)
      .json(emails); 
  } catch (error: any) {
    logger.error(`Mail Route: GET: Failed to fetch mail list. Error: ${error.message}, Stack: ${error.stack}`);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(MESSAGES.SERVER_ERROR);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id: any = req.params.id;

  try {
    await deleteMailById(id);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error: any) {
    logger.error(`Mail Route: DELETE: Failed to delete mail with ID ${id}. Error: ${error.message}, Stack: ${error.stack}`);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(MESSAGES.SERVER_ERROR);
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
      } catch (error) {
        errors.push(`Failed to send email to ${email.to}`);
      }
    });
    await Promise.all(emailPromises);

    return handleResponse(res, errors, successEmails);
  } catch (error: any) {
    logger.error(`Mail Route: POST: Failed to send mails. Error: ${error.message}, Stack: ${error.stack}`);
    
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

export default router;