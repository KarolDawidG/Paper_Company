import request from 'supertest';
import express from 'express';
import axios from 'axios';
import STATUS_CODES from '../../config/status-codes';
import MESSAGES from '../../config/messages';
import router from '../../routes/captchaRoute/capRoute';

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/cap', router);

describe('CAPTCHA Verification API', () => {
  const mockCaptchaSuccessResponse = { data: { success: true } };
  const mockCaptchaFailureResponse = { data: { success: false } };

  beforeEach(() => {
    process.env.REACT_APP_SECRET_KEY = 'test-secret-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and "Human 👨 👩" if CAPTCHA verification succeeds', async () => {
    (axios.post as jest.Mock).mockResolvedValue(mockCaptchaSuccessResponse);

    const response = await request(app)
      .post('/cap')
      .send({
        token: 'valid-token',
        inputVal: 'someInputValue',
      });

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe('Human 👨 👩');
  });

  it('should return 403 and "Robot 🤖" if CAPTCHA verification fails', async () => {
    (axios.post as jest.Mock).mockResolvedValue(mockCaptchaFailureResponse);

    const response = await request(app)
      .post('/cap')
      .send({
        token: 'invalid-token',
        inputVal: 'someInputValue',
      });

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.text).toBe('Robot 🤖');
  });


  it('should return 500 if there is a server error', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Server Error'));

    const response = await request(app)
      .post('/cap')
      .send({
        token: 'valid-token',
        inputVal: 'someInputValue',
      });
    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(`${MESSAGES.UNKNOW_ERROR}`);
  });
});
