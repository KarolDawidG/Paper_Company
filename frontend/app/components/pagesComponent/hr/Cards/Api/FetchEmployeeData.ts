import axiosInstance from "@/app/api/axiosInstance";
import { EmployeeInterface } from "../Interfaces/EmployeeInterface";
const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;

export const fetchEmployeeData = async (setEmployeeData: (employeeData: EmployeeInterface[]) => void) => {
    try {
      const response = await axiosInstance.get(`${BACKEND}/employee`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };