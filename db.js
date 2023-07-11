const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, './database.db');

const db = new sqlite3.Database(dbPath);

const getShops = () => {
  return new Promise((resolve, reject) => {
    const selectShopsQuery = `
      SELECT shops.id, shops.name, JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'image', products.image,
          'price', products.price
        )
      ) AS products
      FROM shops
      LEFT JOIN products ON shops.id = products.shop_id
      GROUP BY shops.id
    `;

    db.all(selectShopsQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const shops = rows.map((row) => ({
          id: row.id,
          name: row.name,
          products: JSON.parse(row.products),
        }));

        resolve(shops);
      }
    });
  });
};

const createOrder = (orderData) => {
  return new Promise((resolve, reject) => {
    const { email, phone, name, orders_products } = orderData;

    const insertOrderQuery = `
      INSERT INTO orders (email, phone, name) VALUES (?, ?, ?)
    `;

    db.run(insertOrderQuery, [email, phone, name], function (err) {
      if (err) {
        reject(err);
      } else {
        const orderId = this.lastID;
        const orderedProducts = orders_products.map((product) => ({
          order_id: orderId,
          product_id: product.id,
          quantity: product.quantity,
          name: product.name,
        }));

        const insertOrderProductsQuery = `
          INSERT INTO orders_products (order_id, product_id, quantity, name) VALUES (?, ?, ?, ?)
        `;

        orderedProducts.forEach((product) => {
          db.run(insertOrderProductsQuery, [product.order_id, product.product_id, product.quantity, product.name], (err) => {
            if (err) {
              console.error(err);
              reject(err);
            }
          });
        });

        resolve(orderId);
      }
    });
  });
};

module.exports = {
  getShops,
  createOrder
};
