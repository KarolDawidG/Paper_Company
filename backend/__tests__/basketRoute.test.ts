import request from 'supertest';
import express from 'express';
import router from '../routes/basketRoute/basketRoute';
import { generateTokenForUnitTest } from '../config/config';
import { BasketRecord } from '../database/Records/Basket/BasketRecord';
import STATUS_CODES from '../config/status-codes';
import MESSAGES from '../config/messages';

const app = express();
app.use(express.json());
app.use('/basket', router);

const token = generateTokenForUnitTest('user');

describe('Basket API', () => {

  beforeAll(() => {
    jest.spyOn(BasketRecord, 'insert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add products to the basket successfully', async () => {
    (BasketRecord.insert as jest.Mock).mockResolvedValue('mocked-id');

    const response = await request(app)
      .post('/basket')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: 'order123',
        product1: {
          id: 'prod123',
          name: 'Product Name',
          description: 'Product Description',
          price: 29.99,
          stock: 50,
          clickCount: 3,
        },
      });

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.text).toBe(MESSAGES.SUCCESSFUL_OPERATION);
  });

  it('should return 404 if order_id is missing', async () => {
    const response = await request(app)
      .post('/basket')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product1: {
          id: 'prod123',
          name: 'Product Name',
          description: 'Product Description',
          price: 29.99,
          stock: 50,
          clickCount: 3,
        },
      });

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is a server error during insertion', async () => {
    (BasketRecord.insert as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/basket') 
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: 'order123',
        product1: {
          id: 'prod123',
          name: 'Product Name',
          description: 'Product Description',
          price: 29.99,
          stock: 50,
          clickCount: 3,
        },
      });

    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.UNKNOW_ERROR);
  });

  it('should return 401 if authorization token is invalid for deletion', async () => {
    (BasketRecord.insert as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/basket') 
      .set('Authorization', `Bearer fake-token`)
      .send({
        order_id: 'order123',
        product1: {
          id: 'prod123',
          name: 'Product Name',
          description: 'Product Description',
          price: 29.99,
          stock: 50,
          clickCount: 3,
        },
      });

    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.text).toBe(MESSAGES.SESSION_EXPIRED);
  });
});
