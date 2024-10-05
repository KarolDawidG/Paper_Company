import { EmployeeInterface } from "./EmployeeInterface";

export interface EmployeeDialogProps {
    open: boolean;
    onClose: () => void;
    employee: EmployeeInterface | null;
  }