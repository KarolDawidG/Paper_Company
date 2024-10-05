import { Response } from "express";
import STATUS_CODES from "../../../config/status-codes";
import logger from "../../../logs/logger";

export const handleResponse = (res: Response, errors: string[], successEmails: string[]) => {
  console.log('Errors:', errors);
  console.log('Success Emails:', successEmails);

  if (errors.length > 0 && successEmails.length > 0) {
    logger.error(`MULTI STATUS Errors: ${errors.join(", ")}`);
    return res.status(STATUS_CODES.MULTI_STATUS).json({ errors, success: [] });
  }

  if (errors.length > 0) {
    logger.error(`Errors: ${errors.join(", ")}`);
    return res.status(STATUS_CODES.BAD_REQUEST).json({ errors, success: [] });
  }

  return res.status(STATUS_CODES.SUCCESS).json({ message: "Emails sent successfully", success: successEmails, errors: [] });
};


// export const handleResponse = (res: Response, errors: string[], successEmails: string[]) => {
//   if (errors.length > 0) {
//     // Jeśli są błędy, ale są także pomyślnie wysłane e-maile
//     if (successEmails.length > 0) {
//       logger.error(`Errors: ${errors.join(", ")}`);
//       return res.status(STATUS_CODES.MULTI_STATUS).json({ errors, success: successEmails });
//     }
    
//     // Jeśli nie ma pomyślnie wysłanych e-maili
//     logger.error(`Errors: ${errors.join(", ")}`);
//     return res.status(STATUS_CODES.BAD_REQUEST).json({ errors, success: [] });
//   }

//   return res.status(STATUS_CODES.SUCCESS).json({ message: "Emails sent successfully", success: successEmails, errors: [] });
// };

// export const handleResponse = (res: Response, errors: string[], successEmails: string[]) => {
//   if (errors.length > 0) {
//     logger.error(`Errors: ${errors.join(", ")}`);
//     return res.status(STATUS_CODES.SUCCESS).json({ errors, success: [] });
//   }

//   return res.status(STATUS_CODES.SUCCESS).json({ message: "Emails sent successfully", success: successEmails, errors: [] });
// };