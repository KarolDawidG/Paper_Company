export interface EmployeeInterface {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    department: string;
    position: string;
    hire_date: string;
    account_id?: string;
}

export interface EmployeeMessageInterface {
    to: string;
    subject: string;
    message: string;
}
