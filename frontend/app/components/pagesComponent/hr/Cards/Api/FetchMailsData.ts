import axios from "axios";
import { Mail } from "../Interfaces/MailInterface";
import { EmployeeMessageInterface } from "../Interfaces/EmployeeInterface";
import { notify } from "@/app/components/notification/Notify";
const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;

export const fetchMailsData = async (setEmails: (emails: Mail[]) => void) => {
    try {
      const response = await axios.get(`${BACKEND}/mail`);
      setEmails(response.data);
    } catch (error) {
      console.log(error);
      console.error('Error fetching data:', error);
    }
  };

  export const deleteMail = async (mailId: string, setEmails: React.Dispatch<React.SetStateAction<Mail[]>>) => {
    try {
      await axios.delete(`${BACKEND}/mail/${mailId}`);
      fetchMailsData(setEmails);
    } catch (error) {
      console.error('Error deleting mail:', error);
    }
  };

  export const sendMail = async (emailData: EmployeeMessageInterface[]) => {
    try {
      await axios.post(`${BACKEND}/mail`, emailData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      notify("Emails sent successfully");
    } catch (error) {
      console.error('Error sending emails:', error);
      notify("Error sending emails");
    }
  };