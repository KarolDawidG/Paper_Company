import { RowDataPacket } from "mysql2/promise";
import { pool } from "../../pool";
import { performTransaction } from "../performTransaction";
import { v4 as uuidv4 } from "uuid";
import { EmployeeInterface } from "./EmployeeInterface";
import { INSERT_EMPLOYEE, SELECT_EMPLOYEE } from "./querryEmployeeRecord";

class EmployeeRecord implements EmployeeInterface {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  department: string;
  position: string;
  hire_date: Date;
  account_id?: string;

  constructor(obj: EmployeeInterface) {
    this.id = obj.id;
    this.first_name = obj.first_name;
    this.last_name = obj.last_name;
    this.email = obj.email;
    this.phone_number = obj.phone_number;
    this.department = obj.department;
    this.position = obj.position;
    this.hire_date = obj.hire_date;
    this.account_id = obj.account_id;
  }

  static async insertEmployee(first_name: string, last_name: string, email: string, phone_number: string, department: string, position: string) {
    const id = uuidv4();
    return performTransaction(async (connection) => {
      await connection.execute(INSERT_EMPLOYEE, 
        [
          id, 
          first_name, 
          last_name, 
          email, 
          phone_number, 
          department, 
          position, 
          new Date(),
          null
        ]
      );
      return id;
    });
  }

  static async selectAll() {
    try {
        const [results] = await pool.execute(SELECT_EMPLOYEE) as any;
        return results.map((obj: any) => new EmployeeRecord(obj));
    } catch (error) {
        console.error("Error in selectAll:", error);
        throw error;
    }
}
}

export { EmployeeRecord };
