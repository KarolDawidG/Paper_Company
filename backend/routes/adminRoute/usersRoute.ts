import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { verifyToken } from "../../config/config";

const router = express.Router();

router.use(middleware, limiter, errorHandler);

router.get("/", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const userRole: string = (req as any).userRole;

  if (userRole !== "admin") {
    return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.FORBIDDEN);
  }

  try {
    const usersList = await UsersRecord.listAll();
    return res.json({ usersList });
  } catch (error:any) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

router.put("/:user/:role", verifyToken, async (req: Request, res: Response) => {
  const user: string = req.params.user;
  const role: string = req.params.role;

  try {
    await UsersRecord.updateRole(role, user);
    return res.status(STATUS_CODES.SUCCESS).send("The operation has been successful.");
  } catch (error:any) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send("Unknown server error. Please contact your administrator.");
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;

  try {
    await UsersRecord.delete(id);
    return res.status(STATUS_CODES.SUCCESS).send("The operation has been successful.");
  } catch (error:any) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send("Unknown server error. Please contact your administrator.");
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id:string = req.params.id;

  try {
    const [userInfo]:any = await UsersRecord.selectById([id]);
    return res.status(STATUS_CODES.SUCCESS).json(userInfo);
  } catch (error:any) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send("Unknown server error. Please contact your administrator.");
  }
});

export default router;
