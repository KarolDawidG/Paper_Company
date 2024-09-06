import { performTransaction } from '../../database/Records/performTransaction';
import { AddressRecord } from '../../database/Records/Address/AddressRecord';
import { Address } from '../../database/Records/Address/InterfaceAddress';
import { pool } from '../../database/pool';
import { SELECT_BY_CLIENT_ID } from '../../database/Records/Address/querryAddressRecord';

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

describe('AddressRecord', () => {
  const mockAddress: Address = {
    id: '1',
    client_id: 'client-1',
    miasto: 'Warszawa',
    ulica: 'Krakowska',
    nr_budynku: '10',
    nr_mieszkania: '5',
    kod: '00-001',
    nazwa_firmy: 'Test Company',
  };

  describe('insert', () => {
    it('should insert a new address and return the generated id', async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));

      const result = await AddressRecord.insert(mockAddress);

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'INSERT INTO client_addresses (id, client_id, miasto, ulica, nr_budynku, nr_mieszkania, kod, nazwa_firmy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          'mocked-uuid',
          mockAddress.client_id,
          mockAddress.miasto,
          mockAddress.ulica,
          mockAddress.nr_budynku,
          mockAddress.nr_mieszkania,
          mockAddress.kod,
          mockAddress.nazwa_firmy,
        ]
      );
      expect(result).toBe('mocked-uuid');
    });
  });

  describe('getListById', () => {
    it('should retrieve a list of addresses by client_id', async () => {
      const mockResults = [
        {
          id: '1',
          client_id: 'client-1',
          miasto: 'Warszawa',
          ulica: 'Krakowska',
          nr_budynku: '10',
          nr_mieszkania: '5',
          kod: '00-001',
          nazwa_firmy: 'Test Company',
        },
      ];

      (pool.execute as jest.Mock).mockResolvedValueOnce([mockResults]);

      const result = await AddressRecord.getListById('client-1');

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_CLIENT_ID, ['client-1']);
      expect(result).toEqual([new AddressRecord(mockResults[0])]);
    });

    it('should throw an error if something goes wrong', async () => {
      const mockError = new Error('Database error');
      (pool.execute as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(AddressRecord.getListById('client-1')).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete the address and associated orders', async () => {
      const mockConnection = { execute: jest.fn() };
      (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));

      await AddressRecord.delete('1');

      expect(performTransaction).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'DELETE FROM `orders` WHERE client_address_id = ?',
        ['1']
      );
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'DELETE FROM `client_addresses` WHERE id = ?',
        ['1']
      );
    });
  });
});
