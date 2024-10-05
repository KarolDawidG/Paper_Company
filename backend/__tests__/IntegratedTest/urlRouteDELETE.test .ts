import request from 'supertest';
import express from 'express';
import router from '../../routes/userRoute/urlRoute';
import { generateTokenForUnitTest, handleNoRecordsModified } from '../../config/config';
import { UsersRecord } from '../../database/Records/Users/UsersRecord';
import STATUS_CODES from '../../config/status-codes';
import MESSAGES from '../../config/messages';
import { RowDataPacket } from 'mysql2';

// Aplikacja
const createApp = () => {
  const app = express();
  app.use('/url', router);
  return app;
};

// Token dla testów
const token = generateTokenForUnitTest('user');

// Zamockowanie funkcji handleNoRecordsModified na poziomie importu
jest.mock('../../config/config', () => ({
  ...jest.requireActual('../../config/config'),
  handleNoRecordsModified: jest.fn(), // Zamockowanie handleNoRecordsModified jako funkcji
}));

describe('Test for method DELETE', () => {
  let app:any;

  beforeEach(() => {
    jest.resetModules();  // Resetuje moduły przed każdym testem
    app = createApp();     // Tworzy nową instancję aplikacji przed każdym testem
    jest.clearAllMocks();  // Czyści wszystkie mocki
  });

  it('should successfully delete an order when the order exists', async () => {
    const orderId = '123';
    const mockDeleteUrl = jest.spyOn(UsersRecord, 'deleteUrl').mockResolvedValue([{ affectedRows: 1 }]);
    const response = await request(app).delete(`/url/${orderId}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
    expect(mockDeleteUrl).toHaveBeenCalledWith(orderId);
  });

  it('should return 404 if no records modified on img_url deletion', async () => {
    jest.spyOn(UsersRecord, 'deleteUrl').mockResolvedValue([{ affectedRows: 0 }]);

    const response = await request(app)
      .delete('/url/id1')
      .set('Authorization', `Bearer ${token}`);

    console.log('Response status:', response.status);
    console.log('Response text:', response.text);

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NO_RECORDS_MODIFIED);
  });


  it('should return 500 if there is a server error during img_url deletion', async () => {
    jest.spyOn(UsersRecord, 'deleteUrl').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .delete('/url/id1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.SERVER_ERROR}`);
  });
});

// Inne testy pozostają bez zmian
