const db = require('../db');

// POST /order
const createOrder = (req, res) => {
  const { email, phone, name, orders_products } = req.body;

  if (!email || !phone || !name || !orders_products) {
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
        db.run(insertOrderProductsQuery, [product.order_id, product.product_id, product.quantity, product.name], function (err) {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to insert order products' });
          }
        });
      });

      res.status(201).json({ orderedProducts: orderedProducts });
    }
  });
};

module.exports = { createOrder };
