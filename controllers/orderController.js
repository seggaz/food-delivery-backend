const db = require('../db');

// POST /order
const createOrder = (req, res) => {
  const { email, phone, name, ordered_products } = req.body;

  if (!email || !phone || !name || !ordered_products) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const insertOrderQuery = `
    INSERT INTO orders (email, phone, name) VALUES (?, ?, ?)
  `;
  db.run(insertOrderQuery, [email, phone, name], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to insert order' });
    } else {
      const orderId = this.lastID;
      const orderedProducts = ordered_products.map((productId) => [orderId, productId]);

      const insertOrderProductsQuery = `
        INSERT INTO orders_products (order_id, product_id) VALUES (?, ?)
      `;
      db.run(insertOrderProductsQuery, orderedProducts, function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to insert order products' });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
};

module.exports = { createOrder };
