import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import router from '../routes/userRoute/registerRoute';
import { UsersRecord } from '../database/Records/Users/UsersRecord';
import MESSAGES from '../config/messages';
import STATUS_CODES from '../config/status-codes';
import URL from '../config/url';
import { sendRegisterEmail } from '../config/mails/emailsSender';

jest.mock('../database/Records/Users/UsersRecord');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../config/mails/emailsSender');

const app = express();
app.use(express.json());
app.use('/register', router);

describe('Register Route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should return 400 if the password is invalid', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'short'
                });

            expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
            expect(response.text).toBe(MESSAGES.INVALID_PASS);
        });

        it('should return 403 if the email already exists', async () => {
            (UsersRecord.selectByEmail as jest.Mock).mockResolvedValue([{ id: 1 }]);

            const response = await request(app)
                .post('/register')
                .send({
                    email: 'existing@example.com',
                    username: 'newuser',
                    password: 'ValidPass123'
                });

            expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
            expect(response.text).toBe(MESSAGES.EMAIL_EXIST);
        });

        it('should return 403 if the username already exists', async () => {
            (UsersRecord.selectByUsername as jest.Mock).mockResolvedValue([{ id: 1 }]);

            const response = await request(app)
                .post('/register')
                .send({
                    email: 'new@example.com',
                    username: 'existinguser',
                    password: 'ValidPass123'
                });

            expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
            expect(response.text).toBe(MESSAGES.EMAIL_EXIST);
        });

        it('should return 200 and register the user successfully', async () => {
            (UsersRecord.selectByEmail as jest.Mock).mockResolvedValue([]);
            (UsersRecord.selectByUsername as jest.Mock).mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (UsersRecord.insert as jest.Mock).mockResolvedValue(1);
            (jwt.sign as jest.Mock).mockReturnValue('activationToken');

            const response = await request(app)
                .post('/register')
                .send({
                    email: 'newuser@example.com',
                    username: 'newuser',
                    password: 'ValidPass123'
                });

            expect(response.status).toBe(STATUS_CODES.SUCCESS);
            expect(response.text).toBe(MESSAGES.SUCCESSFUL_SIGN_UP);
            expect(sendRegisterEmail).toHaveBeenCalledWith(
                'newuser@example.com',
                'newuser',
                `${URL.REGISTER_URL}activationToken`
            );
        });

        it('should return 500 if an error occurs during registration', async () => {
            (UsersRecord.selectByEmail as jest.Mock).mockRejectedValue(new Error('Database Error'));

            const response = await request(app)
                .post('/register')
                .send({
                    email: 'erroruser@example.com',
                    username: 'erroruser',
                    password: 'ValidPass123'
                });

            expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
            expect(response.text).toBe(MESSAGES.SERVER_ERROR);
        });
    });

    describe('GET /register/:token', () => {
        it('should activate the account and redirect to login page', async () => {
            const mockDecodedToken = { userId: 1 };
            (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
                callback(null, mockDecodedToken);
            });

            const response = await request(app).get('/register/validToken');

            expect(response.status).toBe(STATUS_CODES.REDIRECT);
            expect(response.header.location).toBe(URL.URL_LOGIN);
            expect(UsersRecord.activateAccount).toHaveBeenCalledWith(1);
        });

        it('should return 401 if the token is invalid', async () => {
            (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
                callback(new Error('Invalid Token'), null);
            });

            const response = await request(app).get('/register/invalidToken');

            expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
            expect(response.text).toBe(MESSAGES.JWT_ERROR);
        });

//   it('should return 500 if an error occurs during account activation', async () => {
//     (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
//       callback(null, { userId: 1 });
//     });
//     (UsersRecord.activateAccount as jest.Mock).mockRejectedValue(new Error('Database Error'));
//     const response = await request(app).get('/register/validToken');
//     expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
//     expect(response.text).toBe(MESSAGES.SERVER_ERROR);
//   });
    });
});
