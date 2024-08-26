import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import { imapConfig } from './configs/imapConfig';
dotenv.config();

export const fetchAllMails = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    const emails: any[] = [];
    imap.once('ready', () => {
      imap.openBox('INBOX', false, () => {
        imap.search(['ALL', ['SINCE', new Date()]], (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) {
            resolve(emails);
            imap.end();
            return;
          }
          const f = imap.fetch(results, { bodies: '' });
          f.on('message', (msg) => {
            let uid: number | undefined;
            msg.once('attributes', (attrs: { uid: number }) => {
              uid = attrs.uid;
            });
            msg.on('body', (stream: Readable) => {
              simpleParser(stream, (err, parsed) => {
                if (err) return reject(err);
                emails.push({
                  from: parsed.from?.value[0].address,
                  subject: parsed.subject,
                  text: parsed.text,
                  id: uid
                });
              });
            });
          });
          f.once('error', err => {
            reject(err);
          });
          f.once('end', () => {
            imap.end();
          });
        });
      });
    });
    imap.once('error', (err: any) => {
      reject(err);
    });
    imap.once('end', () => {
      resolve(emails);
    });
    imap.connect();
  });
};





