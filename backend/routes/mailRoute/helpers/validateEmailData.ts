import { EmployeeEmail } from "./EmployeeEmailInterface";

export const validateEmail = (email: EmployeeEmail, errors: string[]): boolean => {
  if (!email.to || !email.subject || !email.message) {
    errors.push(`Invalid data format in e-mail to ${email.to}`);
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.to)) {
    errors.push(`Invalid email format in e-mail to ${email.to}`);
    return false;
  }

  return true;
};
