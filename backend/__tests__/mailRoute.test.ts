import request from 'supertest';
import express from 'express';
import router from '../routes/mailRoute/mailRoute'; 
import STATUS_CODES from '../config/status-codes';
import MESSAGES from '../config/messages';
import { fetchAllMails } from '../config/mails/receiveEmails';
import { deleteMailById } from '../config/mails/deleteMailById';
import { sendEmployeeEmail } from '../config/mails/emailsSender';
import { validateEmail } from '../routes/mailRoute/helpers/validateEmailData';
import { EmployeeEmail } from '../routes/mailRoute/helpers/EmployeeEmailInterface';

jest.mock('../config/mails/receiveEmails', () => ({
  fetchAllMails: jest.fn()
}));

jest.mock('../config/mails/deleteMailById', () => ({
    deleteMailById: jest.fn()
  }));

  jest.mock('../config/mails/emailsSender', () => ({
    sendEmployeeEmail: jest.fn()
  }));
  
  jest.mock('../routes/mailRoute/helpers/validateEmailData', () => ({
    validateEmail: jest.fn()
  }));

const app = express();
app.use('/mail', router);

describe('GET /mail', () => {

  it('should return a list of emails', async () => {
    (fetchAllMails as jest.Mock).mockResolvedValue([
      { from: 'john.doe@example.com', subject: 'Test', text: 'Test message', id: 1 }
    ]);
    const response = await request(app).get('/mail');
    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('from', 'john.doe@example.com');
    expect(response.body[0]).toHaveProperty('subject', 'Test');
    expect(response.body[0]).toHaveProperty('text', 'Test message');
  });

  it('should return 404 if no emails are found', async () => {
    (fetchAllMails as jest.Mock).mockResolvedValue([]);
    const response = await request(app).get('/mail');
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error', async () => {
    (fetchAllMails as jest.Mock).mockRejectedValue(new Error('Server error'));
    const response = await request(app).get('/mail');
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.SERVER_ERROR);
  });

});

  //////////////////////////////////////////////////////
  //////          Test for method DELETE          ///////
  //////////////////////////////////////////////////////

describe('DELETE /mail/:id', () => {

    it('should delete the email and return a success message', async () => {
      (deleteMailById as jest.Mock).mockResolvedValue(undefined);
        const response = await request(app).delete('/mail/12345');
      expect(response.status).toBe(STATUS_CODES.SUCCESS);
      expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
    });
  
    it('should return 500 if there is a server error', async () => {
      (deleteMailById as jest.Mock).mockRejectedValue(new Error('Server error'));
      const response = await request(app).delete('/mail/12345');
      expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
      expect(response.text).toBe(MESSAGES.SERVER_ERROR);
    });
  
  });

  //////////////////////////////////////////////////////
  //////          Test for method POST          ///////
  //////////////////////////////////////////////////////

  describe('POST /mail', () => {

    // Test sprawdza, czy poprawne e-maile są wysyłane i zwracane z sukcesem.
    it('should send emails and return success for valid emails', async () => {
        // Mockujemy walidację e-maili jako poprawną
        (validateEmail as jest.Mock).mockImplementation((email: EmployeeEmail, errors: string[]) => true);
        // Mockujemy, że wysyłanie e-maili kończy się sukcesem
        (sendEmployeeEmail as jest.Mock).mockResolvedValue(undefined);

        const emailData = [
            { to: 'john.doe@example.com', subject: 'Test', message: 'Test message' }
        ];

        const response = await request(app).post('/mail').send(emailData);

        expect(response.status).toBe(STATUS_CODES.SUCCESS);
        expect(response.body.success).toEqual(['john.doe@example.com']);
        expect(response.body.errors).toEqual([]);
    });

    // Test sprawdza, czy niepoprawne e-maile powodują zwrócenie błędów walidacji.
    it('should return errors for invalid emails', async () => {
        // Mockujemy walidację e-maili jako niepoprawną
        (validateEmail as jest.Mock).mockImplementation((email: EmployeeEmail, errors: string[]) => {
            errors.push('Invalid data format in e-mail to invalid-email');
            return false;
        });

        const emailData = [
            { to: 'invalid-email', subject: 'Test', message: 'Test message' }
        ];

        const response = await request(app).post('/mail').send(emailData);

        expect(response.status).toBe(STATUS_CODES.BAD_REQUEST); // Kod statusu powinien być BAD_REQUEST
        expect(response.body.success).toEqual([]);
        expect(response.body.errors).toEqual(['Invalid data format in e-mail to invalid-email']);
    });    

    // Test sprawdza, czy serwer zwraca 500 w przypadku wewnętrznego błędu.
    it('should return 500 if there is a server error', async () => {
        // Mockujemy, że występuje wewnętrzny błąd serwera
        (validateEmail as jest.Mock).mockImplementation(() => {
            throw new Error('Server error');
        });

        const emailData = [
            { to: 'john.doe@example.com', subject: 'Test', message: 'Test message' }
        ];

        const response = await request(app).post('/mail').send(emailData);

        expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
        expect(response.text).toBe(MESSAGES.SERVER_ERROR);
    });

});


//   describe('POST /mail', () => {

//     // Test sprawdza, czy poprawne e-maile są wysyłane i zwracane z sukcesem.
//     it('should send emails and return success for valid emails', async () => {
//       (validateEmail as jest.Mock).mockImplementation((email: EmployeeEmail, errors: string[]) => true);
//       (sendEmployeeEmail as jest.Mock).mockResolvedValue(undefined);
//       const emailData = [
//         { to: 'john.doe@example.com', subject: 'Test', message: 'Test message' }
//       ];
//       const response = await request(app).post('/mail').send(emailData);
//       expect(response.status).toBe(STATUS_CODES.SUCCESS);
//       expect(response.body.success).toEqual(['john.doe@example.com']);
//       expect(response.body.errors).toEqual([]);
//     });
  
//     // Test sprawdza, czy niepoprawne e-maile powodują zwrócenie błędów walidacji.
//     it('should return errors for invalid emails', async () => {
//       (validateEmail as jest.Mock).mockImplementation((email: EmployeeEmail, errors: string[]) => {
//         errors.push('Invalid data format in e-mail to invalid-email');
//         return false;
//       });
//       const emailData = [
//         { to: 'invalid-email', subject: 'Test', message: 'Test message' }
//       ];
//       const response = await request(app).post('/mail').send(emailData);
//       expect(response.status).toBe(STATUS_CODES.BAD_REQUEST); // Kod statusu powinien być BAD_REQUEST
//       expect(response.body.success).toEqual([]);
//       expect(response.body.errors).toEqual(['Invalid data format in e-mail to invalid-email']);
//     });
  
// // Test sprawdza, czy błędy podczas wysyłania e-maili są prawidłowo obsługiwane, gdy część e-maili jest wysyłana pomyślnie.
// it('should handle errors during email sending', async () => {
//     // Mockujemy, że e-maile są poprawne
//     (validateEmail as jest.Mock).mockImplementation((email: EmployeeEmail, errors: string[]) => true);
    
//     // Mockujemy, że podczas wysyłania e-maila występuje błąd
//     (sendEmployeeEmail as jest.Mock).mockRejectedValue(new Error('Email sending failed'));
    
//     const emailData = [
//       { to: 'john.doe@example.com', subject: 'Test', message: 'Test message' }
//     ];
    
//     const response = await request(app).post('/mail').send(emailData);
    
//     expect(response.status).toBe(STATUS_CODES.MULTI_STATUS); // Kod statusu powinien być MULTI_STATUS, ponieważ część e-maili została wysłana
//     expect(response.body.success).toEqual([]); // Żaden e-mail nie został wysłany pomyślnie
//     expect(response.body.errors).toEqual(['Failed to send email to john.doe@example.com']); // Błąd związany z wysyłaniem e-maila
//   });
  
  
  
//     // Test sprawdza, czy serwer zwraca 500 w przypadku wewnętrznego błędu.
//     it('should return 500 if there is a server error', async () => {
//       (validateEmail as jest.Mock).mockImplementation(() => {
//         throw new Error('Server error');
//       });
//       const emailData = [
//         { to: 'john.doe@example.com', subject: 'Test', message: 'Test message' }
//       ];
//       const response = await request(app).post('/mail').send(emailData);
//       expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
//       expect(response.text).toBe(MESSAGES.SERVER_ERROR);
//     });
  
//   });
  
