import { pool } from "../../database/pool";
import { EmployeeInterface } from "../../database/Records/Employee/EmployeeInterface";
import { EmployeeRecord } from "../../database/Records/Employee/EmployeeRecord";
import { INSERT_EMPLOYEE, SELECT_EMPLOYEE } from "../../database/Records/Employee/querryEmployeeRecord";
import { performTransaction } from "../../database/Records/performTransaction";
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../database/pool', () => ({
  pool: {
    execute: jest.fn(),
  },

}));
jest.mock('../../database/Records/performTransaction', () => ({
  performTransaction: jest.fn((callback) => callback({ execute: jest.fn() })),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('EmployeeRecord', () => {
///test

const mockEmploy: EmployeeInterface = {
  id: 'mocked-uuid',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone_number: '555555555',
  department: 'Office',
  position: 'Sales',
  hire_date: new Date('2024-01-01T00:00:00Z'),
  account_id: '111',
};

describe('insert', () => {
  it('should insert a new employee and return the id', async () => {
    const mockConnection = { execute: jest.fn() };
    (performTransaction as jest.Mock).mockImplementation((callback) => callback(mockConnection));

    const first_name = 'John';
    const last_name = 'Doe';
    const email = 'john.doe@example.com';
    const phone_number = '555555555';
    const department = 'Office';
    const position = 'Sales';

    const result = await EmployeeRecord.insertEmployee(
      first_name,
      last_name,
      email,
      phone_number,
      department,
      position
    );

    expect(performTransaction).toHaveBeenCalled();
    
    expect(mockConnection.execute).toHaveBeenCalledWith(
      INSERT_EMPLOYEE,
      [
        'mocked-uuid',
        first_name,
        last_name,
        email,
        phone_number,
        department,
        position,
        expect.any(Date),
        null
      ]
    );

    expect(result).toBe('mocked-uuid');
  });
});

//////


  describe('selectAll', () => {
    it('should retrieve all employees and return EmployeeRecord instances', async () => {
      const mockResults = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone_number: '1234567890',
          department: 'Engineering',
          position: 'Software Engineer',
          hire_date: new Date('2024-01-01T00:00:00Z'),
          account_id: 'account-1',
        },
      ];

      (pool.execute as jest.Mock).mockResolvedValueOnce([mockResults]);

      const result = await EmployeeRecord.selectAll();

      expect(pool.execute).toHaveBeenCalledWith(SELECT_EMPLOYEE);
      expect(result).toEqual([new EmployeeRecord(mockResults[0])]);
    });

    it('should throw an error if something goes wrong', async () => {
      const mockError = new Error('Database error');
      (pool.execute as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(EmployeeRecord.selectAll()).rejects.toThrow('Database error');
    });
  });
});
