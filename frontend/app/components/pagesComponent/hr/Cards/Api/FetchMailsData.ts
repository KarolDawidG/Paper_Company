import axios from "axios";
import { Mail } from "../Interfaces/MailInterface";

export const fetchMailsData = async (setEmails: (emails: Mail[]) => void) => {
    try {
      const response = await axios.get(`http://localhost:3001/mail`);
      console.log(response.data);
      console.log(response);
      setEmails(response.data);
    } catch (error) {
      console.log(error);
      console.error('Error fetching data:', error);
    }
  };

  export const deleteMail = async (mailId: string, setEmails: React.Dispatch<React.SetStateAction<Mail[]>>) => {
    try {
      await axios.delete(`http://localhost:3001/mail/${mailId}`);
      fetchMailsData(setEmails);
    } catch (error) {
      console.error('Error deleting mail:', error);
    }
  };