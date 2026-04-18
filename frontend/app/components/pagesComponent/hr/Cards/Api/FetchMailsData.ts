import axiosInstance from "@/app/api/axiosInstance";
import { Mail } from "../Interfaces/MailInterface";
import { EmployeeMessageInterface } from "../Interfaces/EmployeeInterface";
import { notify } from "@/app/components/notification/Notify";

export const fetchMailsData = async (setEmails: (emails: Mail[]) => void) => {
    try {
      // 27.9.2: Skrzynka HR używa axiosInstance, żeby chronione requesty dziedziczyły token i odświeżanie sesji.
      const response = await axiosInstance.get(`/mail`);
      setEmails(response.data);
    } catch (error) {
      console.log(error);
      console.error('Error fetching data:', error);
    }
  };

  export const deleteMail = async (mailId: string, setEmails: React.Dispatch<React.SetStateAction<Mail[]>>) => {
    try {
      await axiosInstance.delete(`/mail/${mailId}`);
      fetchMailsData(setEmails);
    } catch (error) {
      console.error('Error deleting mail:', error);
    }
  };

  export const sendMail = async (emailData: EmployeeMessageInterface[]) => {
    try {
      await axiosInstance.post(`/mail`, emailData, {
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
