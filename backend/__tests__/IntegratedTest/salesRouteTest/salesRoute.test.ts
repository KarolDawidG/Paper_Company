import request from 'supertest';
import express from 'express';
import { OrdersRecord } from '../../../database/Records/Orders/OrdersRecord';
import STATUS_CODES from '../../../config/status-codes';
import MESSAGES from '../../../config/messages';
import router from '../../../routes/salesRoute/salesRoute';
import { handleError, handleWarning } from '../../../config/config';
import { AddressRecord } from '../../../database/Records/Address/AddressRecord';

const app = express();
app.use(express.json());
app.use('/sales', router);

jest.mock('../../../database/Records/Address/AddressRecord');
jest.mock('../../../database/Records/Orders/OrdersRecord');
jest.mock('../../../config/config', () => ({
  handleError: jest.fn(),
  handleWarning: jest.fn(),
}));

describe('GET /sales', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

  it('should return orders list when orders are found', async () => {
    const mockOrders = [
      { id: '1', client_id: '456', client_address_id: '789', created_at: new Date().toISOString() },
      { id: '2', client_id: '457', client_address_id: '790', created_at: new Date().toISOString() },
    ];

    (OrdersRecord.getListById as jest.Mock).mockResolvedValue(mockOrders);

    const response = await request(app).get('/sales').set('Accept-Language', 'en');

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body.ordersList).toEqual(mockOrders);
  });

  it('should return 404 if no orders are found', async () => {
    (OrdersRecord.getListById as jest.Mock).mockResolvedValue([]);

    // Mock the handleWarning function to check its usage
    (handleWarning as jest.Mock).mockImplementation((res, route, message, status) => {
      res.status(status).json({ message });
    });

    const response = await request(app).get('/sales').set('Accept-Language', 'en');

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.body.message).toBe(MESSAGES.NOT_FOUND);
    expect(handleWarning).toHaveBeenCalledWith(expect.anything(), "Sales Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  });

  it('should return 500 if there is an error', async () => {
    (OrdersRecord.getListById as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Mock the handleError function to check its usage
    (handleError as jest.Mock).mockImplementation((res, error, route, message) => {
      res.status(STATUS_CODES.SERVER_ERROR).json({ message });
    });

    const response = await request(app).get('/sales').set('Accept-Language', 'en');

    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.body.message).toBe(MESSAGES.UNKNOW_ERROR);
    expect(handleError).toHaveBeenCalledWith(expect.anything(), expect.any(Error), "Sales Route: GET", MESSAGES.UNKNOW_ERROR);
  });
});

describe('POST /sales', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should successfully add an address when data is complete', async () => {
      const formData = {
        city: 'Warsaw',
        street: 'Main St',
        building: '12A',
        no_apartment: '5',
        code: '00-123',
        company_name: 'Tech Solutions',
        client_id: '456'
      };
  
      (AddressRecord.insert as jest.Mock).mockResolvedValue(undefined);
  
      const response = await request(app)
        .post('/sales')
        .send(formData)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.SUCCESS);
      expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
      expect(AddressRecord.insert).toHaveBeenCalledWith({
        miasto: 'Warsaw',
        ulica: 'Main St',
        nr_budynku: '12A',
        nr_mieszkania: '5',
        kod: '00-123',
        nazwa_firmy: 'Tech Solutions',
        client_id: '456'
      });
    });
  
    it('should return 400 if required data is missing', async () => {
      const formData = {
        city: 'Warsaw',
        street: '' // Missing street
      };
  
      // Mock handleWarning to check its usage
      (handleWarning as jest.Mock).mockImplementation((res, route, message, status) => {
        res.status(status).json({ message });
      });
  
      const response = await request(app)
        .post('/sales')
        .send(formData)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(MESSAGES.BAD_REQUEST);
      expect(handleWarning).toHaveBeenCalledWith(expect.anything(), "Sales Route: POST: Missing required address or client data", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
    });
  
    it('should return 500 if there is an error', async () => {
      const formData = {
        city: 'Warsaw',
        street: 'Main St',
        building: '12A',
        no_apartment: '5',
        code: '00-123',
        company_name: 'Tech Solutions',
        client_id: '456'
      };
  
      (AddressRecord.insert as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      // Mock handleError to check its usage
      (handleError as jest.Mock).mockImplementation((res, error, route, message, status, clientId) => {
        res.status(status).json({ message });
      });
  
      const response = await request(app)
        .post('/sales')
        .send(formData)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
      expect(response.body.message).toBe(MESSAGES.UNKNOW_ERROR);
      expect(handleError).toHaveBeenCalledWith(expect.anything(), expect.any(Error), "Sales Route address: POST", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, '456');
    });
  });

  
