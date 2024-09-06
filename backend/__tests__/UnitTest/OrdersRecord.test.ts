import { v4 as uuidv4 } from "uuid";
import { performTransaction } from "../../database/Records/performTransaction";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";
import { DELETE_ORDER, INSERT_ORDER, SELECT_ORDERS } from "../../database/Records/Orders/querryOrderRecord";
import { pool } from "../../database/pool";
import { Order } from "../../database/Records/Orders/InterfaceOrder";

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid'),
  }));
  
jest.mock("../../database/Records/performTransaction", () => ({
  performTransaction: jest.fn()
}));

jest.mock("../../database/pool", () => ({
  pool: {
    execute: jest.fn()
  }
}));

describe('OrdersRecord', () => {
    const mockEmploy: Order = {
        id: 'mocked-uuid',
        client_id: 'client-id-123',
        client_address_id: 'address-id-456',
        created_at: '2024-01-01T00:00:00Z',
      };
      
  describe('insert', () => {
        it('should insert a new employee and return the id', async () => {
          const mockConnection = { execute: jest.fn() };
          (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));
      
          const client_id = 'client-id-123';
          const client_address_id = 'address-id-456';
                
          const result = await OrdersRecord.insert(
            client_id,
            client_address_id,
          );
      
          expect(performTransaction).toHaveBeenCalled();
          
          expect(mockConnection.execute).toHaveBeenCalledWith(
            INSERT_ORDER,
            [
              'mocked-uuid',
              client_id,
              client_address_id,
            ]
          );
      
          expect(result).toBe('mocked-uuid');
        });
    });
  });

  describe('getListById', () => {
    it('should retrieve all orders and return OrdersRecord instances', async () => {
      const mockResults = [
        { id: '1', client_id: 'client-id-123', client_address_id: 'address-id-456', created_at: new Date().toISOString() }
      ];
      (pool.execute as jest.Mock).mockResolvedValue([mockResults]);

      const result = await OrdersRecord.getListById();

      expect(pool.execute).toHaveBeenCalledWith(SELECT_ORDERS);
      expect(result).toEqual(mockResults.map(order => new OrdersRecord(order)));
    });

    it('should throw an error if something goes wrong', async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(OrdersRecord.getListById()).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete an order by id', async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));

      const id = 'mocked-uuid';

      await OrdersRecord.delete(id);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        DELETE_ORDER,
        [id]
      );
    });
  });

