const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let items = [
    { id: 1, name: 'Laptop', price: 1000 },
    { id: 2, name: 'Headphones', price: 200 }
];

let cart = [];

// Visa produkter
app.get('/', (req, res) => {
    let productHTML = items.map(item => `
        <div>
            <p>${item.name} - $${item.price}</p>
            <form action="/add-to-cart" method="POST">
                <input type="hidden" name="id" value="${item.id}" />
                <input type="number" name="quantity" placeholder="Quantity" />
                <button type="submit">Add to Cart</button>
            </form>
        </div>
    `).join('');

    res.send(`
        <h1>Webshop</h1>
        ${productHTML}
        <a href="/cart">View Cart</a>
    `);
});

// Lägg till i varukorg
app.post('/add-to-cartss', (req, res) => {
    const { id, quantity } = req.body;
    const item = items.find(i => i.id == id);
    if (item) {
        cart.push({ ...item, quantity: parseInt(quantity) });
    }
    res.redirect('/');
});

// Visa varukorg
app.get('/cart', (req, res) => {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let cartHTML = cart.map(item => `
        <div>
            <p>${item.name} - $${item.price} x ${item.quantity}</p>
        </div>
    `).join('');

    res.send(`
        <h1>Your Cart</h1>
        ${cartHTML}
        <p>Total: $${total}</p>
        <a href="/">Continue Shopping</a>
    `);
});

// Korrekt hantering av varukorg
app.post('/add-to-cart', (req, res) => {
    const { id, quantity } = req.body;
    const item = items.find(i => i.id == id);
    if (item) {
        const qty = parseInt(quantity);
        if (qty > 0) { // Validering
            cart.push({ ...item, quantity: qty });
        } else {
            return res.status(400).send('Invalid quantity');
        }
    }
    res.redirect('/');
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
