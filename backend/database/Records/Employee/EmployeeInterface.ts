export interface EmployeeInterface {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    department: string;
    position: string;
    hire_date: Date;
    account_id?: string;
  }