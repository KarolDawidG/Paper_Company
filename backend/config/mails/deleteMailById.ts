import Imap from 'imap';
import dotenv from 'dotenv';
import { imapConfig } from './configs/imapConfig';
dotenv.config();

export const deleteMailById = (mailId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const imap = new Imap(imapConfig);
      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) return reject(err);
  
          imap.setFlags(mailId, '\\Deleted', (err) => {
            if (err) return reject(err);
            
            imap.expunge((err) => {
              if (err) return reject(err);
              imap.end();
              resolve();
            });
          });
        });
      });
  
      imap.once('error', (err: any) => {
        reject(err);
      });
  
      imap.once('end', () => {
      });
  
      imap.connect();
    });
  };