import request from 'supertest';
import express from 'express';
import router from '../../routes/adminRoute/adminRoute';
import { generateTokenForUnitTest } from '../../config/config';
import { UsersRecord } from '../../database/Records/Users/UsersRecord';
import STATUS_CODES from '../../config/status-codes';
import MESSAGES from '../../config/messages';

const app = express();
app.use('/admin', router);

describe('Admin API', () => {

  // Mock JWT token generation
  const token = generateTokenForUnitTest('admin');

  //////////////////////////////////////////////////////
  //////          Test for method GET          ///////
  //////////////////////////////////////////////////////

  it('should return list of all users', async () => {
    jest.spyOn(UsersRecord, 'listAll').mockResolvedValue([
      {
        id: 'id',
        username: 'Alexis',
        email: 'brill_alexis@gmail.com',
        role: 'hr',
        img_url: 'https://utfs.io/f/0bdc1601-50e6-4862-8c05-bfb2e2a45f6f-hfzk01.jpg',
        created_at: new Date().toISOString(),
      },
    ]);

    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toHaveProperty('usersList');
    expect(response.body.usersList).toBeInstanceOf(Array);
  });

  it('should return 404 if no users found', async () => {
    jest.spyOn(UsersRecord, 'listAll').mockResolvedValue([]);
  
    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(UsersRecord, 'listAll').mockRejectedValue(new Error('Database error'));
      
    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR}`);
  });

  //////////////////////////////////////////////////////
  //////          Test for method PUT           ///////
  //////////////////////////////////////////////////////

  it('should update user role and return success', async () => {
    jest.spyOn(UsersRecord, 'updateRole').mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app)
      .put('/admin/test-id/new-role')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
  });

  it('should return 404 if no records modified on role update', async () => {
    jest.spyOn(UsersRecord, 'updateRole').mockResolvedValue([{ affectedRows: 0 }]);

    const response = await request(app)
      .put('/admin/invalid-id/new-role')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NO_RECORDS_MODIFIED);
  });

  it('should return 500 if there is a server error during role update', async () => {
    jest.spyOn(UsersRecord, 'updateRole').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .put('/admin/test-id/new-role')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR} (ID: test-id)`);
  });

  //////////////////////////////////////////////////////
  //////          Test for method DELETE         ///////
  //////////////////////////////////////////////////////

  it('should delete user and return success', async () => {
    jest.spyOn(UsersRecord, 'delete').mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app)
      .delete('/admin/test-id')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
  });

  it('should return 404 if no records modified on user deletion', async () => {
    jest.spyOn(UsersRecord, 'delete').mockResolvedValue([{ affectedRows: 0 }]);

    const response = await request(app)
      .delete('/admin/invalid-id')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NO_RECORDS_MODIFIED);
  });

  it('should return 500 if there is a server error during user deletion', async () => {
    jest.spyOn(UsersRecord, 'delete').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .delete('/admin/test-id')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR} (ID: test-id)`);
  });

  it('should return 401 if authorization token is invalid for deletion', async () => {
    jest.spyOn(UsersRecord, 'delete').mockResolvedValue([]);

    const response = await request(app)
      .delete('/admin/invalid-id')
      .set('Authorization', `Bearer fake-token`);
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.SESSION_EXPIRED);
  });

});
