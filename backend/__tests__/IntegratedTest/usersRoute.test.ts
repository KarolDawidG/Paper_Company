import request from 'supertest';
import express from 'express';
import router from '../../routes/adminRoute/usersRoute';
import { generateTokenForUnitTest } from '../../config/config';
import { UsersRecord } from '../../database/Records/Users/UsersRecord';
import STATUS_CODES from '../../config/status-codes';
import MESSAGES from '../../config/messages';
import { RowDataPacket } from 'mysql2';

const app = express();
app.use(express.json()); 
app.use('/users', router);

const token = generateTokenForUnitTest('admin');
const selfToken = generateTokenForUnitTest('user', 'id1');
const otherUserToken = generateTokenForUnitTest('user', 'id2');

describe('Users API', () => {

  //////////////////////////////////////////////////////
  //////          Test for method GET by role     ///////
  //////////////////////////////////////////////////////

  it('should return list of users by role', async () => {
    jest.spyOn(UsersRecord, 'listByRole').mockResolvedValue([
      {
        id: 'id1',
        username: 'Alexis',
        email: 'alexis@example.com',
        role: 'hr',
        img_url: 'https://example.com/image.jpg',
        created_at: new Date().toISOString(),
      },
    ]);

    const response = await request(app)
      .get('/users/hr')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toHaveProperty('usersList');
    expect(response.body.usersList).toBeInstanceOf(Array);
  });

  it('should return 404 if no users found for the role', async () => {
    jest.spyOn(UsersRecord, 'listByRole').mockResolvedValue([]);

    const response = await request(app)
      .get('/users/unknown-role')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(UsersRecord, 'listByRole').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/users/hr')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.UNKNOW_ERROR);
  });

  //////////////////////////////////////////////////////
  //////          Test for method PUT            ///////
  //////////////////////////////////////////////////////

  it('should update user data successfully', async () => {
    jest.spyOn(UsersRecord, 'updateUserData').mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app)
      .put('/users/test-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'NewName', email: 'newemail@example.com' });
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .put('/users/test-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'NewName' }); 
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error during update', async () => {
    jest.spyOn(UsersRecord, 'updateUserData').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .put('/users/test-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'NewName', email: 'newemail@example.com' });
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR}`);
  });

  it('should return 403 when user tries to update someone else profile', async () => {
    const response = await request(app)
      .put('/users/id1')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ username: 'NewName', email: 'newemail@example.com' });

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe(MESSAGES.FORBIDDEN);
  });

  it('should allow user to update own profile', async () => {
    jest.spyOn(UsersRecord, 'updateUserData').mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app)
      .put('/users/id1')
      .set('Authorization', `Bearer ${selfToken}`)
      .send({ username: 'OwnName', email: 'own@example.com' });

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
  });

  //////////////////////////////////////////////////////
  //////          Test for method GET user by ID  ///////
  //////////////////////////////////////////////////////

  it('should retrieve user information by ID', async () => {
    jest.spyOn(UsersRecord, 'selectById').mockResolvedValue([
      {
        id: 'id1',
        username: 'john_doe',
        email: 'john@example.com',
        created_at: '2023-01-01',
        password: 'hashedPassword',
        role: 'user'
      } as RowDataPacket
    ]);
    
    const response = await request(app)
      .get('/users/user/id1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('id1');
  });

  it('should return 404 if user not found by ID', async () => {
    jest.spyOn(UsersRecord, 'selectById').mockResolvedValue([]);

    const response = await request(app)
      .get('/users/user/unknown-id')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error retrieving user by ID', async () => {
    jest.spyOn(UsersRecord, 'selectById').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/users/user/id1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR} (ID: id1)`);
  });

  it('should return 403 when user tries to read another profile', async () => {
    const response = await request(app)
      .get('/users/user/id1')
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe(MESSAGES.FORBIDDEN);
  });

  it('should allow user to read own profile', async () => {
    jest.spyOn(UsersRecord, 'selectById').mockResolvedValue([
      {
        id: 'id1',
        username: 'john_doe',
        email: 'john@example.com',
        created_at: '2023-01-01',
        password: 'hashedPassword',
        role: 'user'
      } as RowDataPacket
    ]);

    const response = await request(app)
      .get('/users/user/id1')
      .set('Authorization', `Bearer ${selfToken}`);

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body.id).toBe('id1');
  });

});
