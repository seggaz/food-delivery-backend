const db = require('../db');

// GET /shops
const getShops = (req, res) => {
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
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve shops' });
    } else {
      const shops = rows.map((row) => ({
        id: row.id,
        name: row.name,
        products: JSON.parse(row.products),
      }));

      res.json({ shops });
    }
  });
};

module.exports = { getShops };

