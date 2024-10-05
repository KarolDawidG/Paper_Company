import request from 'supertest';
import express from 'express';
import { AddressRecord } from '../../database/Records/Address/AddressRecord';
import router from '../../routes/addressRoute/addressRoute';
import MESSAGES from '../../config/messages';
import { generateTokenForUnitTest } from '../../config/config';
import STATUS_CODES from '../../config/status-codes';

const app = express();
app.use('/address', router);

describe('Address API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //////////////////////////////////////////////////////
  //////          Test for method GET          ///////
  //////////////////////////////////////////////////////

  it('should return address list for a valid ID', async () => {
    jest.spyOn(AddressRecord, 'getListById').mockResolvedValue([
      {
        id: 'id',
        client_id: 'client_id',
        miasto: 'Gdynia',
        ulica: 'Swietojanska',
        nr_budynku: '21',
        nr_mieszkania: '37',
        kod: '22-111',
        nazwa_firmy: 'Stocznia S.A. ',
      },
    ]);

    const response = await request(app)
      .get('/address/valid-id')
      .set('Authorization', `Bearer ${generateTokenForUnitTest('user')}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('addressList');
    expect(response.body.addressList).toBeInstanceOf(Array);
  });

  it('should return 200 and empty [] if no addresses found', async () => {
    jest.spyOn(AddressRecord, 'getListById').mockResolvedValue([]);
  
    const response = await request(app)
      .get('/address/invalid-id')
      .set('Authorization', `Bearer ${generateTokenForUnitTest('user')}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body.addressList).toEqual([]);
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(AddressRecord, 'getListById').mockRejectedValue(new Error('Database error'));
      
    const response = await request(app)
      .get('/address/valid-id')
      .set('Authorization', `Bearer ${generateTokenForUnitTest('user')}`);
    expect(response.status).toBe(500);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR} (ID: valid-id)`);
  });

  it('should return 401 if authorization token is invalid', async () => {
    jest.spyOn(AddressRecord, 'getListById').mockResolvedValue([]);
  
    const response = await request(app)
      .get('/address/invalid-id')
      .set('Authorization', `Bearer fake-token`);
    expect(response.status).toBe(401);
    expect(response.text).toBe(MESSAGES.SESSION_EXPIRED);
  });

  //////////////////////////////////////////////////////
  //////          Test for method DELETE         ///////
  //////////////////////////////////////////////////////

  it('should delete an address and return success', async () => {
    jest.spyOn(AddressRecord, 'delete').mockResolvedValue([{}]);
  
    const response = await request(app)
      .delete('/address/test-id')
      .set('Authorization', `Bearer ${generateTokenForUnitTest('user')}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
  });
  
  it('should return 404 if address not found for deletion', async () => {
    jest.spyOn(AddressRecord, 'delete').mockResolvedValue([{ affectedRows: 0 }]);
    
    const response = await request(app)
      .delete('/address/invalid-id')
      .set('Authorization', `Bearer ${generateTokenForUnitTest('user')}`);
    expect(response.status).toBe(404);
    expect(response.text).toBe(MESSAGES.NO_RECORDS_MODIFIED);
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(AddressRecord, 'delete').mockRejectedValue(new Error('Database error'));
      
    const response = await request(app)
      .delete('/address/valid-id')
      .set('Authorization', `Bearer ${generateTokenForUnitTest('user')}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR} (ID: valid-id)`);
  });

  it('should return 401 if authorization token is invalid for deletion', async () => {
    jest.spyOn(AddressRecord, 'delete').mockResolvedValue([]);
  
    const response = await request(app)
      .delete('/address/invalid-id')
      .set('Authorization', `Bearer fake-token`);
    expect(response.status).toBe(401);
    expect(response.text).toBe(MESSAGES.SESSION_EXPIRED);
  });

});
