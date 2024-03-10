import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { verifyToken } from "../../config/config";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";

const router = express.Router();

router.use(middleware, limiter, errorHandler);
//todo: dokumentacja do edycji
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await UsersRecord.listAll();
    return res.json({ usersList });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
},
);

router.put("/:id/:role", verifyToken, async (req, res) => {
  const id = req.params.id;
  const role = req.params.role;

  try {
    await UsersRecord.updateRole(role, id);
    return res.status(200).send("The operation has been successful.");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Unknown server error. Please contact your administrator.");
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;

  try {
    await UsersRecord.delete(id);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send("The operation has been successful.");
  } catch (error: any) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Users Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
  }
},
);

export default router;
