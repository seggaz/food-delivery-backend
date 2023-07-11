const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

const shopsController = require('./controllers/shopsController');
const orderController = require('./controllers/orderController');

app.use(express.json());
app.use(cors());

app.get('/shops', shopsController.getShops);
app.post('/orders', orderController.createOrder);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
