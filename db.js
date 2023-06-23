const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, './database.db');

const db = new sqlite3.Database(dbPath);

// Створення таблиці "orders_products" (якщо її не має)
db.run(`
CREATE TABLE IF NOT EXISTS orders_products (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	order_id INTEGER,
	product_id INTEGER,
	quantity INTEGER,
	name TEXT,
	FOREIGN KEY (order_id) REFERENCES orders (id),
	FOREIGN KEY (product_id) REFERENCES products (id)
	)
	`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Таблицю "orders_products" успішно створено');
  }
});

// Створення таблиці "orders" (якщо її не має)
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255),
    phone VARCHAR(255),
    name VARCHAR(255)
  )
`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Таблицю "orders" успішно створено');
  }
});

// Створюємо таблицю "shops" (якщо немає) з автоінкрементним полем id
db.run(`
  CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255)
  )
`);

// Додавання даних у таблицю "shops" лише за її створенні
db.get(`SELECT COUNT(*) AS count FROM shops`, (err, row) => {
  if (err) {
    console.error(err);
  } else {
    if (row.count === 0) {
      const shopsData = [
        { name: 'Taco Bell' },
        { name: 'Pizza Hut' },
        { name: 'Subway' },
        { name: 'McDonald\'s' },
        { name: 'Burger King' }
      ];
      
      const insertShop = db.prepare('INSERT INTO shops (name) VALUES (?)');
      
      shopsData.forEach((shop) => {
        insertShop.run(shop.name);
      });
      
      insertShop.finalize();
    }
  }
});

// Створюємо таблицю "products" (якщо немає)
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id INTEGER,
    name VARCHAR(255),
    image TEXT,
    price FLOAT,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
  )
`);

// Додавання даних у таблицю "products" лише за її створенні
db.get(`SELECT COUNT(*) AS count FROM products`, (err, row) => {
  if (err) {
    console.error(err);
  } else {
    if (row.count === 0) {
		const productsData = [
			{
			  shop_id: 1,
			  name: 'Cheese Quesadilla',
			  image: 'https://dinnersdishesanddesserts.com/wp-content/uploads/2022/11/Cheese-Quesadilla-square-scaled-735x735.jpg',
			  price: 100,
			  id: 1
			},
			{
			  shop_id: 1,
			  name: 'Crunchwrap Supreme',
			  image: 'https://www.createkidsclub.com/wp-content/uploads/2018/05/crunchwrap-recipe-supreme00007.jpg',
			  price: 120,
			  id: 2
			},
			{
			  shop_id: 1,
			  name: 'Nacho Fries',
			  image: 'https://kitchendivas.com/wp-content/uploads/2021/10/Homemade-Taco-Bell-Nacho-Fries-24-of-49.jpg',
			  price: 130,
			  id: 3
			},
			{
			  shop_id: 1,
			  name: 'Tac Bell',
			  image: 'https://www.tacobueno.com/assets/food/tacos/Taco_BFT_Beef_990x725.jpg',
			  price: 150,
			  id: 4
			},
			{
			  shop_id: 2,
			  name: 'Cheese Stuffed Crust Pizza',
			  image: 'https://www.fastfoodpost.com/wp-content/uploads/2021/06/Little-Caesars-Introduces-New-Pepperoni-And-Cheese-Stuffed-Crust-Pizza.jpg',
			  price: 270,
			  id: 5
			},
			{
			  shop_id: 2,
			  name: 'Margherita Pizza',
			  image: 'https://previews.123rf.com/images/supergranto/supergranto1405/supergranto140500009/28236273-pizza-margherita-with-mozzarella-isolated-on-white-background.jpg',
			  price: 200,
			  id: 6
			},
			{
			  shop_id: 2,
			  name: 'Pepperoni Pizza',
			  image: 'https://media.istockphoto.com/id/1084529684/photo/pizza-pepperoni-top-view-isolated-on-white-background.jpg?s=170667a&w=0&k=20&c=y4nHx8eHjP_rtvhJfWGvsOztgbCKnik3OeOBm2VCmUg=',
			  price: 250,
			  id: 7
			},
			{
			  shop_id: 2,
			  name: 'Supreme Pizza',
			  image: 'https://media.istockphoto.com/id/1349560847/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BA%D0%BE%D0%BB%D0%B1%D0%B0%D1%81%D0%BD%D0%B0%D1%8F-%D0%B8-%D0%BE%D0%B2%D0%BE%D1%89%D0%BD%D0%B0%D1%8F-%D0%BF%D0%B8%D1%86%D1%86%D0%B0-%D0%BD%D0%B0-%D1%82%D0%B5%D0%BC%D0%BD%D0%BE%D0%BC-%D1%84%D0%BE%D0%BD%D0%B5.jpg?s=612x612&w=0&k=20&c=aCdRq6ZHDo1agap-R-6wwKaAmom5YO99-OSGuD77siM=',
			  price: 220,
			  id: 8
			},
			{
			  shop_id: 3,
			  name: 'Chicken Teriyaki',
			  image: 'https://media.istockphoto.com/id/1311498370/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BA%D1%83%D1%80%D0%B8%D1%86%D0%B0-%D1%82%D0%B5%D1%80%D0%B8%D1%8F%D0%BA%D0%B8-%D0%BD%D0%B0-%D1%82%D0%B0%D1%80%D0%B5%D0%BB%D0%BA%D0%B5.jpg?s=612x612&w=0&k=20&c=INzXdt9EZbF3JY5W5AVhoCE7hSqV-W-dePtCkufSDkA=',
			  price: 190,
			  id: 9
			},
			{
			  shop_id: 3,
			  name: 'Italian BMT',
			  image: 'https://mysubway.ro/wp-content/uploads/2019/08/Italian-BMT-02.jpg',
			  price: 180,
			  id: 10
			},
			{
			  shop_id: 3,
			  name: 'Subway Club',
			  image: 'https://media.istockphoto.com/id/1269313446/photo/two-long-submarine-sandwiches-with-meat-cheese-bacon-tomatoes-lettuce-cucumbers-and-onions-on.jpg?s=612x612&w=0&k=20&c=1BE5-EfDMotL3uD4z_iMx2dU7n-w61CpYpyAiHh6bY8=',
			  price: 170,
			  id: 11
			},
			{
			  shop_id: 3,
			  name: 'Veggie Delite',
			  image: 'https://external-preview.redd.it/nFHbFOI9R4XVuyLHUxupkHuE-pG3qewp1K0_3tq17PU.jpg?auto=webp&s=e1f050d16883ecfa3f68430e1960cdcb2c26b8e2',
			  price: 150,
			  id: 12
			},
			{
			  shop_id: 4,
			  name: 'Big Mac',
			  image: 'https://media.9news.com/assets/KUSA/images/d047bf3b-6306-46db-96a4-c149efc0af23/d047bf3b-6306-46db-96a4-c149efc0af23_1140x641.jpg',
			  price: 170,
			  id: 13
			},
			{
			  shop_id: 4,
			  name: 'Cheeseburger',
			  image: 'https://st.depositphotos.com/1776387/1284/i/950/depositphotos_12840574-stock-photo-hamburger.jpg',
			  price: 120,
			  id: 14
			},
			{
			  shop_id: 4,
			  name: 'Chicken McNuggets',
			  image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Chicken_McNuggets.jpg',
			  price: 130,
			  id: 15
			},
			{
			  shop_id: 4,
			  name: 'Filet-O-Fish',
			  image: 'https://content.wkyc.com/photo/2016/02/26/Filet-O-Fish_1456496078194_436797_ver1.0.jpg',
			  price: 160,
			  id: 16
			},
			{
			  shop_id: 4,
			  name: 'McChicken',
			  image: 'https://mcdonalds.com.mt/wp-content/uploads/2018/05/0001_WEBSITE-MC-CHICKEN.jpg',
			  price: 140,
			  id: 17
			},
			{
			  shop_id: 5,
			  name: 'Cheese Bacon King',
			  image: 'https://www.fastfoodpost.com/wp-content/uploads/2021/07/Burger-King-new-Single-Bacon-King-Sandwich.jpg',
			  price: 220,
			  id: 18
			},
			{
			  shop_id: 5,
			  name: 'Chicken Fries',
			  image: 'https://media.istockphoto.com/id/458899491/photo/fries-and-nuggets.jpg?s=612x612&w=0&k=20&c=nHrNpAMUraFLOeMFDOIGRB4oDtKD-Yg_0WLvgESb4o4=',
			  price: 150,
			  id: 19
			},
			{
			  shop_id: 5,
			  name: 'Chicken Royale',
			  image: 'https://s3-eu-central-1.amazonaws.com/www.burger-king.ng/wp-media-folder-burger-king-nigeria//home/ubuntu/wordpress/web/app/uploads/sites/12/2021/09/original-chicken-1.jpg',
			  price: 180,
			  id: 20
			},
			{
			  shop_id: 5,
			  name: 'Crispy Chicken Sandwich',
			  image: 'https://media.istockphoto.com/id/585602032/photo/chicken-bacon-club-sandwich.jpg?s=612x612&w=0&k=20&c=lExm5lCegJgc618_RU7AJFfsXkUYZerOwqJchXhOTuI=',
			  price: 170,
			  id: 21
			},
			{
			  shop_id: 5,
			  name: 'Whopper',
			  image: 'https://www.vmcdn.ca/f/files/via/import/2009/01/whopper.jpg;w=960',
			  price: 190,
			  id: 22
			}
		  ];		  
      const insertProduct = db.prepare('INSERT INTO products (shop_id, name, image, price) VALUES (?, ?, ?, ?)');
      
      productsData.forEach((product) => {
        insertProduct.run(product.shop_id, product.name, product.image, product.price);
      });
      
      insertProduct.finalize();
    }
  }
});

module.exports = db;
