import request from 'supertest';
import express from 'express';
import { OrdersRecord } from '../../../database/Records/Orders/OrdersRecord';
import STATUS_CODES from '../../../config/status-codes';
import MESSAGES from '../../../config/messages';
import router from '../../../routes/salesRoute/salesRoute';
import { handleError, handleNoRecordsModified, handleWarning } from '../../../config/config';

const app = express();
app.use(express.json());
app.use('/sales', router);

jest.mock('../../../database/Records/Orders/OrdersRecord');
jest.mock('../../../config/config', () => ({
  handleError: jest.fn(),
  handleWarning: jest.fn(),
  handleNoRecordsModified: jest.fn(),
}));

  describe('DELETE /sales/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should successfully delete an order when the order exists', async () => {
      const orderId = '123';
  
      // Mock the OrdersRecord.delete to return a result indicating success
      (OrdersRecord.delete as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]); // Assume 1 indicates successful deletion
  
      // Mock handleNoRecordsModified to return nothing (indicating records were modified)
      (handleNoRecordsModified as jest.Mock).mockImplementation(() => { /* No-op */ });
  
      const response = await request(app)
        .delete(`/sales/${orderId}`)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.SUCCESS);
      expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
      expect(OrdersRecord.delete).toHaveBeenCalledWith(orderId);
      expect(handleNoRecordsModified).toHaveBeenCalledWith(expect.anything(), "Sales Route: DELETE", orderId, { affectedRows: 1 });
    });
  
    it('should return 404 if no records were modified', async () => {
        const orderId = '123';
      
        // Mock the OrdersRecord.delete to return a result indicating no records deleted
        (OrdersRecord.delete as jest.Mock).mockResolvedValue([{ affectedRows: 0 }]); // Assume 0 indicates no records deleted
      
        // Mock handleNoRecordsModified to call the handleWarning function
        (handleNoRecordsModified as jest.Mock).mockImplementation((res, route, id, result) => {
          return handleWarning(res, route, MESSAGES.NO_RECORDS_MODIFIED, STATUS_CODES.NOT_FOUND, id);
        });
      
        // Mock handleWarning to check its usage
        (handleWarning as jest.Mock).mockImplementation((res, route, message, status, id) => {
          res.status(status).json({ message });
        });
      
        const response = await request(app)
          .delete(`/sales/${orderId}`)
          .set('Accept-Language', 'en');
      
        expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
        expect(response.body.message).toBe(MESSAGES.NO_RECORDS_MODIFIED);
        expect(OrdersRecord.delete).toHaveBeenCalledWith(orderId);
        expect(handleNoRecordsModified).toHaveBeenCalledWith(expect.anything(), "Sales Route: DELETE", orderId, { affectedRows: 0 });
    });
      
  
    it('should return 500 if there is an error deleting the order', async () => {
      const orderId = '123';
  
      // Mock the OrdersRecord.delete to throw an error
      (OrdersRecord.delete as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      // Mock handleError to check its usage
      (handleError as jest.Mock).mockImplementation((res, error, route, message, status, id) => {
        res.status(status).json({ message });
      });
  
      const response = await request(app)
        .delete(`/sales/${orderId}`)
        .set('Accept-Language', 'en');
  
      expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
      expect(response.body.message).toBe(MESSAGES.UNKNOW_ERROR);
      expect(handleError).toHaveBeenCalledWith(expect.anything(), expect.any(Error), "Sales Route: DELETE", MESSAGES.UNKNOW_ERROR, STATUS_CODES.SERVER_ERROR, orderId);
    });
  });


