const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

const shopsController = require('./controllers/shopsController');
const orderController = require('./controllers/orderController');
const db = require('./db');
const initialData = require('./data/data.json');

app.use(express.json());
app.use(cors());

db.serialize(() => {
  initialData.shops.forEach((shop) => {
    const { id, name, products } = shop;

    const insertShopQuery = `INSERT INTO shops (id, name) VALUES (?, ?)`;
    db.run(insertShopQuery, [id, name], (err) => {
      if (err) {
        console.error(err);
      }
    });

    products.forEach((product) => {
      const { id: productId, name, image, price } = product;

      const insertProductQuery = `
        INSERT INTO products (id, shop_id, name, image, price) VALUES (?, ?, ?, ?, ?)
      `;
      db.run(
        insertProductQuery,
        [productId, id, name, image, price],
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    });
  });
});

app.get('/shops', shopsController.getShops);

app.post('/order', orderController.createOrder);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
