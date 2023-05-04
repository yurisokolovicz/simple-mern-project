const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const app = express();

const DUMMY_PRODUCTS = []; // not a database, just some in-memory storage for now

app.use(bodyParser.json());

// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});
// Send back a response with some dummy products
app.get('/products', (req, res, next) => {
    res.status(200).json({ products: DUMMY_PRODUCTS });
});
// Create a new product and return it
app.post('/product', (req, res, next) => {
    const { title, price } = req.body;
    // Here we validate the input
    if (!title || title.trim().length === 0 || !price || price <= 0) {
        return res.status(422).json({
            message: 'Invalid input, please enter a valid title and price.'
        });
    }

    const createdProduct = {
        id: uuid(), //creating a unique id with uuid (third party package/library)
        title,
        price
    };
    // Adding the product to our dummy database
    DUMMY_PRODUCTS.push(createdProduct);
    // Returning a response with a 201 status code and the created product
    res.status(201).json({ message: 'Created new product.', product: createdProduct });
});

app.listen(5000); // start Node + Express server on port 5000

//The Core backend logic
