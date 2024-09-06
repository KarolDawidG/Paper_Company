import request from 'supertest';
import express from 'express';
import router from '../../routes/employeeRoute/employeeRoute';
import { EmployeeRecord } from '../../database/Records/Employee/EmployeeRecord';
import STATUS_CODES from '../../config/status-codes';
import MESSAGES from '../../config/messages';
import { generateTokenForUnitTest } from '../../config/config';

const app = express();
app.use('/employee', router);

const token = generateTokenForUnitTest('user');

describe('GET /employee', () => {
  it('should return a list of employees', async () => {
    jest.spyOn(EmployeeRecord, 'selectAll').mockResolvedValue([
      { id: '1', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }
    ]);
    const response = await request(app).get('/employee').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('first_name', 'John');
  });

  it('should return 404 if no employees are found', async () => {
    jest.spyOn(EmployeeRecord, 'selectAll').mockResolvedValue([]);
    const response = await request(app).get('/employee').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(EmployeeRecord, 'selectAll').mockRejectedValue(new Error('Server error'));
    const response = await request(app).get('/employee').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.SERVER_ERROR);
  });

  it('should return 401 if authorization token is invalid', async () => {
    jest.spyOn(EmployeeRecord, 'selectAll').mockResolvedValue([]);
    const response = await request(app).get('/employee').set('Authorization', `Bearer fake-token`);
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.SESSION_EXPIRED);
  });
});
