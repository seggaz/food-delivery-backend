const db = require('../db');

const createOrder = async (req, res) => {
	try {
		const {
			email,
			phone,
			name,
			orders_products
		} = req.body;

		if (!email || !phone || !name || !orders_products) {
			res.status(400).json({
				error: 'Missing required fields'
			});
			return;
		}

		const orderId = await db.createOrder({
			email,
			phone,
			name,
			orders_products
		});

		res.status(201).json({
			orderId: orderId,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			error: 'Failed to create order'
		});
	}
};

module.exports = {
	createOrder
};