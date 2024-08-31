import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleWarning, handleError } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import { verifyToken } from "../../config/config";
const router = express.Router();
router.use(middleware, limiter, errorHandler);

router.get("/:role", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const role: string = req.params.role;
    try {
      const usersList = await UsersRecord.listByRole(role);
        if (usersList.length === 0) {
          return handleWarning(res, `Users Route: GET for role ${role}`, MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }
      return res.status(STATUS_CODES.SUCCESS).json({ usersList });
    } catch (error: any) {
      return handleError(res, error, `Users Route: GET for role ${role}`, MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR);
    }
  },
);

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const userId: string = req.params.id;
  const {username, email} = req.body;

  if (!username || !email) {
    return handleWarning(res, `Users Route: PUT Missing required fields: username: ${username}, or email: ${email}`, MESSAGES.NOT_FOUND, STATUS_CODES.BAD_REQUEST);
  }
    try {
      await UsersRecord.updateUserData([username, email, userId]);
        return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
    } catch (error: any) {
      return handleError(res, error, `Users Route: PUT: Error updating user with ID ${userId}`, MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR);
    }
});

router.get("/user/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;
    try {
      const [userInfo]: any = await UsersRecord.selectById([id]);
      if (!userInfo) {
        return handleWarning(res, "Users/user Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, id);
      }
      return res.status(STATUS_CODES.SUCCESS).json(userInfo);
    } catch (error: any) {
      return handleError(res, error, "Users/user Route: GET", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, id);
    }
  },
);


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpointy do zarządzania użytkownikami.
 */

/**
 * @swagger
 * /users/{role}:
 *   get:
 *     summary: Retrieve a list of users by role.
 *     description: Endpoint available only for users with "admin" role. Retrieves a list of users with the specified role.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         description: The role of the users to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usersList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 'fa97c775-1613-4035-b93b-2fb852e37ec0'
 *                       username:
 *                         type: string
 *                         example: 'Alexis'
 *                       email:
 *                         type: string
 *                         example: 'brill_alexis@gmail.com'
 *                       role:
 *                         type: string
 *                         example: 'hr'
 *                       img_url:
 *                         type: string
 *                         format: uri
 *                         example: 'https://utfs.io/f/0bdc1601-50e6-4862-8c05-bfb2e2a45f6f-hfzk01.jpg'
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-03-21T15:14:55.000Z'
 *       403:
 *         description: Access denied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Access denied. Insufficient permissions for the requested resource.'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Server error encountered. Please contact the administrator for support.'
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user data.
 *     description: Endpoint for updating user data based on their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose data will be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'Alexis'
 *               email:
 *                 type: string
 *                 example: 'brill_alexis@gmail.com'
 *     responses:
 *       200:
 *         description: Successfully updated user data.
 *       403:
 *         description: Access denied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Access denied. Insufficient permissions for the requested resource.'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Server error encountered. Please contact the administrator for support.'
 */

/**
 * @swagger
 * /users/user/{id}:
 *   get:
 *     summary: Retrieve user information by ID.
 *     description: Endpoint for retrieving detailed information about a user based on their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose information will be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 'fa97c775-1613-4035-b93b-2fb852e37ec0'
 *                 username:
 *                   type: string
 *                   example: 'Alexis'
 *                 email:
 *                   type: string
 *                   example: 'brill_alexis@gmail.com'
 *                 role:
 *                   type: string
 *                   example: 'hr'
 *                 img_url:
 *                   type: string
 *                   format: uri
 *                   example: 'https://utfs.io/f/0bdc1601-50e6-4862-8c05-bfb2e2a45f6f-hfzk01.jpg'
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-03-21T15:14:55.000Z'
 *       403:
 *         description: Access denied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Access denied. Insufficient permissions for the requested resource.'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Server error encountered. Please contact the administrator for support.'
 */

export default router;
