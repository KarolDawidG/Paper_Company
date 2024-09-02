import request from 'supertest';
import express from 'express';
import router from '../routes/userRoute/urlRoute'; // Ścieżka do routera URL
import { generateTokenForUnitTest, handleNoRecordsModified } from '../config/config';
import { UsersRecord } from '../database/Records/Users/UsersRecord';
import STATUS_CODES from '../config/status-codes';
import MESSAGES from '../config/messages';
import { RowDataPacket } from 'mysql2';

const app = express();
app.use('/url', router);


const token = generateTokenForUnitTest('user');


// describe('Test for method DELETE', () => {

//     beforeEach(() => {
//         jest.clearAllMocks();
//       });

//   //////////////////////////////////////////////////////
//   //////          Test for method DELETE         ///////
//   //////////////////////////////////////////////////////

//   it('should successfully delete an order when the order exists', async () => {
//     const orderId = '123';
//     const mockDeleteUrl = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);
//     (UsersRecord as any).deleteUrl = mockDeleteUrl;

//    const mockHandleNoRecordsModified = jest.fn();
//     (handleNoRecordsModified as jest.Mock) = mockHandleNoRecordsModified;

//     const response = await request(app)
//       .delete(`/url/${orderId}`)
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(STATUS_CODES.SUCCESS);
//     expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
//     expect(UsersRecord.deleteUrl).toHaveBeenCalledWith(orderId);
    
//   });

//   it('should return 404 if no records modified on img_url deletion', async () => {
//     // Mockowanie, aby deleteUrl zwracało brak zmienionych rekordów
//     jest.spyOn(UsersRecord, 'deleteUrl').mockResolvedValue([{ affectedRows: 0 }]);
  
//     const response = await request(app)
//       .delete('/url/id1')
//       .set('Authorization', `Bearer ${token}`);
  
//     expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
//     expect(response.text).toBe(MESSAGES.NO_RECORDS_MODIFIED);
//   });
  

//   it('should return 500 if there is a server error during img_url deletion', async () => {
//     jest.spyOn(UsersRecord, 'deleteUrl').mockRejectedValue(new Error('Database error'));

//     const response = await request(app)
//       .delete('/url/id1')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
//     expect(response.text).toBe(`${MESSAGES.SERVER_ERROR}`);
//   });

// });

describe('Test for method GET', () => {
   
    beforeEach(() => {
        jest.clearAllMocks();
      });
  //////////////////////////////////////////////////////
  //////          Test for method GET          ///////
  //////////////////////////////////////////////////////

  it('should return user information by ID', async () => {
    jest.spyOn(UsersRecord, 'selectUrlById').mockResolvedValue([
      {
        id: 'id1',
        img_url: 'https://example.com/avatar.png',
      } as RowDataPacket,
    ]);

    const response = await request(app)
      .get('/url/id1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toHaveProperty('id', 'id1');
    expect(response.body).toHaveProperty('img_url', 'https://example.com/avatar.png');
  });

  it('should return 404 if user not found', async () => {
    jest.spyOn(UsersRecord, 'selectUrlById').mockResolvedValue([]);

    const response = await request(app)
      .get('/url/id1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(UsersRecord, 'selectUrlById').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/url/id1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.SERVER_ERROR}`);
  });
});

describe('Test for method PUT', () => {

    beforeEach(() => {
        jest.clearAllMocks();
      });

  //////////////////////////////////////////////////////
  //////          Test for method PUT           ///////
  //////////////////////////////////////////////////////

  it('should update user img_url and return success', async () => {
    jest.spyOn(UsersRecord, 'updateImgUrl').mockResolvedValue({ affectedRows: 1 });

    const response = await request(app)
      .put('/url/id1')
      .set('Authorization', `Bearer ${token}`)
      .send({ img_url: 'https://example.com/new-avatar.png' });

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
  });

  it('should return 404 if no records modified on img_url update', async () => {
    jest.spyOn(UsersRecord, 'updateImgUrl').mockResolvedValue({ affectedRows: 0 });

    const response = await request(app)
      .put('/url/id1')
      .set('Authorization', `Bearer ${token}`)
      .send({ img_url: 'https://example.com/new-avatar.png' });

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NO_RECORDS_MODIFIED);
  });

  it('should return 500 if there is a server error during img_url update', async () => {
    jest.spyOn(UsersRecord, 'updateImgUrl').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .put('/url/id1')
      .set('Authorization', `Bearer ${token}`)
      .send({ img_url: 'https://example.com/new-avatar.png' });

    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.SERVER_ERROR}`);
  });
});