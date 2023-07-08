const db = require('../db');

const getShops = async (req, res) => {
  try {
    const shops = await db.getShops();
    res.json({ shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve shops' });
  }
};

module.exports = { getShops };
