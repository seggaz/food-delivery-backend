const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, './database.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY,
      name VARCHAR(255)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      shop_id INTEGER,
      name VARCHAR(255),
      image TEXT,
      price FLOAT,
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      email VARCHAR(255),
      phone VARCHAR(255),
      name VARCHAR(255)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders_products (
      order_id INTEGER,
      product_id INTEGER,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
});

module.exports = db;

