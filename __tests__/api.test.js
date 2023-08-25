const { describe, it, expect, afterAll } = require('@jest/globals');
const request = require('supertest');
const { app, closeServer } = require('../index.js');
const db = require('../db');

// Mock db.createOrder и db.getShops functions
jest.mock('../db', () => ({
	createOrder: jest.fn(() => Promise.resolve(1)), // Back id new order
	getShops: jest.fn(() => Promise.resolve([])), // Back empty list shops
  }));
  

describe('orderController', () => {
  it('should create a new order', async () => {
    const orderData = {
      email: 'test@example.com',
      phone: '1234567890',
      name: 'John Doe',
      orders_products: [
        { id: 1, name: 'Product 1', quantity: 2 },
        { id: 2, name: 'Product 2', quantity: 1 },
      ],
    };

    const response = await request(app)
      .post('/orders')
      .send(orderData)
      .expect(201);

    expect(response.body).toEqual({ orderId: 1 });
    expect(db.createOrder).toHaveBeenCalledWith(orderData);
  });

  it('should return 400 if required fields are missing', async () => {
    const invalidOrderData = {
      email: 'test@example.com',
      // Missing phone, name, and orders_products
    };

    await request(app)
      .post('/orders')
      .send(invalidOrderData)
      .expect(400);
  });

  it('should return 500 if an error occurs during order creation', async () => {
    // Mock db.createOrder to return an error
    db.createOrder.mockRejectedValueOnce(new Error('Database error'));

    const orderData = {
      email: 'test@example.com',
      phone: '1234567890',
      name: 'John Doe',
      orders_products: [
        { id: 1, name: 'Product 1', quantity: 2 },
        { id: 2, name: 'Product 2', quantity: 1 },
      ],
    };

    await request(app)
      .post('/orders')
      .send(orderData)
      .expect(500);
  });
});

describe('shopsController', () => {
  it('should return list of shops', async () => {
    // Mock db.getShops to return a list of shops
    const mockShops = [
      { id: 1, name: 'Shop 1', products: [] },
      { id: 2, name: 'Shop 2', products: [] },
    ];
    db.getShops.mockResolvedValueOnce(mockShops);

    const response = await request(app)
      .get('/shops')
      .expect(200);

    expect(response.body).toEqual({ shops: mockShops });
  });

  it('should return 500 if an error occurs during fetching shops', async () => {
    // Mock db.getShops to return an error
    db.getShops.mockRejectedValueOnce(new Error('Database error'));

    await request(app)
      .get('/shops')
      .expect(500);
  });
});
//Close server after all test done
afterAll((done) => {
	closeServer(done);
  });

  