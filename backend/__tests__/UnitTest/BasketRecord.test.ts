import { v4 as uuidv4 } from 'uuid';
import { performTransaction } from '../../database/Records/performTransaction';
import { BasketRecord } from '../../database/Records/Basket/BasketRecord';
import { INSERT_BASKET } from '../../database/Records/Basket/querryBasketRecord';


jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));
jest.mock('../../database/Records/performTransaction', () => ({
  performTransaction: jest.fn((callback) => callback({ execute: jest.fn() })),
}));

describe('BasketRecord', () => {
  const mockFormData = {
    order_id: 'order-1',
    product_id: 'product-1',
    quantity: '10',
  };

  describe('insert', () => {
    it('should insert a new basket record and return the generated id', async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));

      const result = await BasketRecord.insert(mockFormData);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        INSERT_BASKET,
        [
          'mocked-uuid',
          mockFormData.order_id,
          mockFormData.product_id,
          mockFormData.quantity,
        ]
      );
      expect(result).toBe('mocked-uuid');
    });
  });
});
