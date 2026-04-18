import express, { Request, Response } from "express";
import middleware from "../../config/middleware";
import { errorHandler, handleError, handleWarning, limiter, verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";

const router = express.Router();

router.use(middleware, limiter, errorHandler);

router.get("/:role", verifyToken, async (req: Request, res: Response) => {
  const role: string = req.params.role;

  try {
    // 27.3.3: Dedykowany endpoint kontaktowy dla UI "brak uprawnień", zamiast używania /users/:role.
    const contacts = await UsersRecord.listSupportByRole(role);
    if (contacts.length === 0) {
      return handleWarning(
        res,
        `Support Route: GET for role ${role}`,
        MESSAGES.NOT_FOUND,
        STATUS_CODES.NOT_FOUND,
      );
    }

    return res.status(STATUS_CODES.SUCCESS).json({ contacts });
  } catch (error: any) {
    return handleError(
      res,
      error,
      `Support Route: GET for role ${role}`,
      MESSAGES.UNKNOW_ERROR,
      STATUS_CODES.SERVER_ERROR,
    );
  }
});

export default router;
