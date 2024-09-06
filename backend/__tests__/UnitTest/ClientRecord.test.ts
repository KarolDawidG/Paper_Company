import { v4 as uuidv4 } from 'uuid';
import { performTransaction } from '../../database/Records/performTransaction';
import { ClientRecord } from '../../database/Records/Client/ClientRecord';
import { pool } from '../../database/pool';
import { Client } from '../../database/Records/Client/InterfaceClient';
import {
    DELETE_CLIENT,
    CLIENT_ORDER_DATA,
    INSERT_CLIENT,
    SELECT_CLIENT_BY_ID,
    SELECT_CLIENTS,
    UPDATE_CLIENT
  } from '../../database/Records/Client/querryClientRecord';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));
jest.mock('../../database/pool', () => ({
  pool: {
    execute: jest.fn(),
  },
}));
jest.mock('../../database/Records/performTransaction', () => ({
  performTransaction: jest.fn((callback) => callback({ execute: jest.fn() })),
}));

describe('ClientRecord', () => {
  const mockClient: Client = {
    id: '1',
    first_name: 'John',
    second_name: 'Doe',
    email: 'john.doe@example.com',
    created_at: '2024-01-01T00:00:00Z',
  };

  describe('getList', () => {
    it('should retrieve a list of clients', async () => {
      const mockResults = [
        {
          id: '1',
          first_name: 'John',
          second_name: 'Doe',
          email: 'john.doe@example.com',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      (pool.execute as jest.Mock).mockResolvedValueOnce([mockResults]);

      const result = await ClientRecord.getList();

      expect(pool.execute).toHaveBeenCalledWith(SELECT_CLIENTS);
      expect(result).toEqual([new ClientRecord(mockResults[0])]);
    });

    it('should throw an error if something goes wrong', async () => {
      const mockError = new Error('Database error');
      (pool.execute as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(ClientRecord.getList()).rejects.toThrow('Database error');
    });
  });

  describe('getAddress', () => {
    it('should retrieve client data by client ID', async () => {
      const mockResults = [
        {
          id: '1',
          first_name: 'John',
          second_name: 'Doe',
          email: 'john.doe@example.com',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      (pool.execute as jest.Mock).mockResolvedValueOnce([mockResults]);

      const result = await ClientRecord.getAddress(['1']);

      expect(pool.execute).toHaveBeenCalledWith(SELECT_CLIENT_BY_ID, ['1']);
      expect(result).toEqual(mockResults);
    });
  });

  describe('insert', () => {
    it('should insert a new client and return the generated id', async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));

      const result = await ClientRecord.insert(mockClient);

      expect(performTransaction).toHaveBeenCalled();

      expect(mockConnection.execute).toHaveBeenCalledWith(
        INSERT_CLIENT,
        [
          'mocked-uuid',
          mockClient.first_name,
          mockClient.second_name,
          mockClient.email
        ]
      );
      
      expect(result).toBe('mocked-uuid');
    });
  });

  describe('delete', () => {
    it('should delete the client and associated client addresses', async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));

      await ClientRecord.delete('1');

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'DELETE FROM `client_addresses` WHERE client_id = ?',
        ['1']
      );
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'DELETE FROM `clients` WHERE id = ?',
        ['1']
      );
    });
  });

  describe('updateClient', () => {
    it('should update the client details', async () => {
      const mockConnection = { execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]) };
      (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));
  
      const result = await ClientRecord.updateClient(['1', 'Jane', 'Doe', 'jane.doe@example.com']);
  
      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        UPDATE_CLIENT,
        ['Jane', 'Doe', 'jane.doe@example.com', '1']
      );
      expect(result).toEqual({ affectedRows: 1 });
    });
  });
  

  describe('getClientData', () => {
    it('should retrieve client data and address data', async () => {
      const mockResults = [
        {
          client_id: '1',
          address_id: 'address-1',
        },
      ];

      (pool.execute as jest.Mock).mockResolvedValueOnce([mockResults]);

      const result = await ClientRecord.getClientData('1', 'address-1');

      expect(pool.execute).toHaveBeenCalledWith(CLIENT_ORDER_DATA, ['1', 'address-1']);
      expect(result).toEqual(mockResults);
    });
  });
});
