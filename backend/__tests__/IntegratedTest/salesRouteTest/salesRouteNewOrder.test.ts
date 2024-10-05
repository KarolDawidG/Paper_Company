import request from 'supertest';
import express from 'express';
import { OrdersRecord } from '../../../database/Records/Orders/OrdersRecord';
import STATUS_CODES from '../../../config/status-codes';
import MESSAGES from '../../../config/messages';
import router from '../../../routes/salesRoute/salesRoute';
import { handleError, handleWarning } from '../../../config/config';

const app = express();
app.use(express.json());
app.use('/sales', router);

jest.mock('../../../database/Records/Orders/OrdersRecord');
jest.mock('../../../config/config', () => ({
  handleError: jest.fn(),
  handleWarning: jest.fn(),
}));


  describe('POST /sales/new-order', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should successfully create a new order when client_id and client_address_id are provided', async () => {
      const formData = {
        client_id: '456',
        client_address_id: '789'
      };
  
      // Mock the OrdersRecord.insert to return an order_id
      (OrdersRecord.insert as jest.Mock).mockResolvedValue('123');
  
      const response = await request(app)
        .post('/sales/new-order')
        .send(formData)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.SUCCESS);
      expect(response.body).toEqual({ order_id: '123', message: MESSAGES.SUCCESSFUL_OPERATION });
      expect(OrdersRecord.insert).toHaveBeenCalledWith('456', '789');
    });
  
    it('should return 400 if client_id or client_address_id is missing', async () => {
      const formData = {
        client_id: '456' // Missing client_address_id
      };
  
      // Mock handleWarning to check its usage
      (handleWarning as jest.Mock).mockImplementation((res, route, message, status) => {
        res.status(status).json({ message });
      });
  
      const response = await request(app)
        .post('/sales/new-order')
        .send(formData)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(MESSAGES.BAD_REQUEST);
      expect(handleWarning).toHaveBeenCalledWith(expect.anything(), "Sales/new-order Route: POST: Missing client or address ID", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
    });
  
    it('should return 500 if there is an error creating the order', async () => {
      const formData = {
        client_id: '456',
        client_address_id: '789'
      };
  
      (OrdersRecord.insert as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      // Mock handleError to check its usage
      (handleError as jest.Mock).mockImplementation((res, error, route, message, status, clientId) => {
        res.status(status).json({ message });
      });
  
      const response = await request(app)
        .post('/sales/new-order')
        .send(formData)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
      expect(response.body.message).toBe(MESSAGES.UNKNOW_ERROR);
      expect(handleError).toHaveBeenCalledWith(expect.anything(), expect.any(Error), "Sales/new-order Route: POST: Failed to create new order for client id", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, '456');
    });
  });



