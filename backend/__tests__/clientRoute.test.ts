import request from 'supertest';
import express from 'express';
import router from '../routes/clientRoute/clientRoute';
import { ClientRecord } from '../database/Records/Client/ClientRecord';
import STATUS_CODES from '../config/status-codes';
import MESSAGES from '../config/messages';
import { generateTokenForUnitTest } from '../config/config';
import { RowDataPacket } from 'mysql2';

const app = express();
app.use('/client', router);

const token = generateTokenForUnitTest('user');

describe('GET /client', () => {

  it('should return a list of clients', async () => {
    jest.spyOn(ClientRecord, 'getList').mockResolvedValue([
      { id: '1', first_name: 'John', second_name: 'Doe', email: 'john.doe@example.com' }
    ]);

    const response = await request(app)
      .get('/client')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body.clientList).toBeInstanceOf(Array);
    expect(response.body.clientList[0]).toHaveProperty('first_name', 'John');
  });

  it('should return 404 if no clients are found', async () => {
    jest.spyOn(ClientRecord, 'getList').mockResolvedValue([]);

    const response = await request(app)
      .get('/client')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(ClientRecord, 'getList').mockRejectedValue(new Error('Server error'));

    const response = await request(app)
      .get('/client')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.UNKNOW_ERROR);
  });

});

describe('GET /client/client-data/:clientid/:addresid', () => {
    it('should return client data for valid IDs', async () => {
      // Mockowanie zwracanej wartości
      jest.spyOn(ClientRecord, 'getClientData').mockResolvedValue([
        {
          id: '12',
          first_name: 'John',
          email: 'john.doe@example.com'
        } as RowDataPacket
      ]);
  
      const response = await request(app).get('/client/client-data/12/1');
      
      expect(response.status).toBe(STATUS_CODES.SUCCESS);
      // Zakładając, że dane są w tablicy
      expect(response.body[0]).toHaveProperty('first_name', 'John');
    });
  
    it('should return 404 if no client data is found', async () => {
      // Mockowanie pustego wyniku
      jest.spyOn(ClientRecord, 'getClientData').mockResolvedValue([]);
  
      const response = await request(app).get('/client/client-data/fake-id/fake-id2');
      
      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.text).toBe(MESSAGES.NOT_FOUND);
    });
  
    it('should return 500 if there is a server error', async () => {
      // Symulowanie błędu serwera
      jest.spyOn(ClientRecord, 'getClientData').mockRejectedValue(new Error('Server error'));
  
      const response = await request(app).get('/client/client-data/1/1');
      
      expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
      expect(response.text).toBe(MESSAGES.UNKNOW_ERROR);
    });
  });
  
  
  