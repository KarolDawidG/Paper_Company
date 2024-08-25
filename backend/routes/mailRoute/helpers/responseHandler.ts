import { Response } from "express";
import STATUS_CODES from "../../../config/status-codes";
import logger from "../../../logs/logger";

export const handleResponse = (res: Response, errors: string[], successEmails: string[]) => {
  if (successEmails.length === 0) {
    logger.error(`Errors: ${errors.join(", ")}`);
    return res.status(STATUS_CODES.BAD_REQUEST).json({ errors });
  }

  if (errors.length > 0) {
    logger.error(`Errors: ${errors.join(", ")}`);
    return res.status(STATUS_CODES.MULTI_STATUS).json({ errors });
  }

  return res.status(STATUS_CODES.SUCCESS).json({ message: "Emails sent successfully", successEmails });
};
