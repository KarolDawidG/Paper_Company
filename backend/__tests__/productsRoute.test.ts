import request from 'supertest';
import express from 'express';
import { ProductsRecord } from '../database/Records/Products/ProductsRecord';
import STATUS_CODES from '../config/status-codes';
import router from '../routes/productsRoute/producsRoute';
import MESSAGES from '../config/messages';

const app = express();
app.use('/products', router);

jest.mock('../database/Records/Products/ProductsRecord');

describe('GET /products', () => {
  it('should return products data when products are found', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', description: 'Description 1', category: 'Category 1', price: 10.0, stock: 100, created_at: new Date().toISOString() },
      { id: '2', name: 'Product 2', description: 'Description 2', category: 'Category 2', price: 20.0, stock: 200, created_at: new Date().toISOString() },
    ];

    (ProductsRecord.getAll as jest.Mock).mockResolvedValue(mockProducts);

    const response = await request(app).get('/products').set('Accept-Language', 'en');

    expect(response.status).toBe(STATUS_CODES.SUCCESS);
    expect(response.body.productsData).toEqual(mockProducts);
  });

  it('should return 404 if no products are found', async () => {
    (ProductsRecord.getAll as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get('/products').set('Accept-Language', 'en');

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  it('should return 500 if there is an error', async () => {
    (ProductsRecord.getAll as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/products').set('Accept-Language', 'en');

    expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
    expect(response.text).toBe(MESSAGES.UNKNOW_ERROR);
  });
});


describe('GET /products/cart/:id', () => {
    it('should return product data when product is found', async () => {
      const mockProduct = { id: '1', name: 'Product 1', description: 'Description 1', category: 'Category 1', price: 10.0, stock: 100, created_at: new Date().toISOString() };
  
      (ProductsRecord.getById as jest.Mock).mockResolvedValue(mockProduct);
  
      const response = await request(app).get('/products/cart/1').query({ locale: 'en' });
  
      expect(response.status).toBe(STATUS_CODES.SUCCESS);
      expect(response.body).toEqual(mockProduct);
    });
  
    it('should return 404 if product is not found', async () => {
      (ProductsRecord.getById as jest.Mock).mockResolvedValue(null);
  
      const response = await request(app).get('/products/cart/1').query({ locale: 'en' });
  
      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.text).toBe(MESSAGES.NOT_FOUND);
    });
  
    it('should return 500 if there is an error', async () => {
      (ProductsRecord.getById as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      const response = await request(app).get('/products/cart/1').query({ locale: 'en' });
  
      expect(response.status).toBe(STATUS_CODES.SERVER_ERROR);
      expect(response.text).toBe(MESSAGES.UNKNOW_ERROR);
    });
  });