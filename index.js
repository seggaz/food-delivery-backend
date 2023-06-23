const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

const shopsController = require('./controllers/shopsController');
const orderController = require('./controllers/orderController');
const db = require('./db');

app.use(express.json());
app.use(cors());

app.get('/shops', shopsController.getShops);
app.post('/orders', orderController.createOrder);

//Перевірка створені дані або не створені
db.serialize(() => {
  db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
    if (err) {
      console.error(err);
    } else {
      if (row) {
        console.log("The database already exists.");
        startServer();
      } else {
        console.log("The database does not exist. We are creating a new...");
        createTables();
      }
    }
  });
});

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255)
    )
  `, (err) => {
    if (err) {
      console.error(err);
    } else {
      createProductsTable(err);
    }
  });
}

function createProductsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER,
      name VARCHAR(255),
      image TEXT,
      price FLOAT,
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    )
  `, (err) => {
    if (err) {
      console.error(err);
    } else {
      createOrdersTable(err);
    }
  });
}

function createOrdersTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255),
      phone VARCHAR(255),
      name VARCHAR(255)
    )
  `, (err) => {
    if (err) {
      console.error(err);
    } else {
      createOrdersProductsTable(err);
    }
  });
}

function createOrdersProductsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders_products (
      order_id INTEGER,
      product_id INTEGER,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, (err) => {
    if (err) {
      console.error(err);
    } else {
      startServer(err);
    }
  });
}

function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

