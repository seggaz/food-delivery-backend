const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

const shopsController = require('./controllers/shopsController');
const orderController = require('./controllers/orderController');
const authController = require('./controllers/authController');
const middleware = require('./middleware');

app.use(express.json());
app.use(cors());

app.post('/register', authController.registerUser);
app.post('/login', authController.loginUser);

app.use(middleware.verifyToken);

app.get('/shops', shopsController.getShops);
app.post('/orders', orderController.createOrder);

const server = app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
  });
  
  const closeServer = (done) => {
	server.close(done);
  };
  
  module.exports = { app, closeServer };
