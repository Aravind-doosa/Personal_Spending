const express = require('express'); 
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/db.js');

const app = express();  
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM expenses ORDER BY date DESC');
        res.render('index', { expenses: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/add', (req, res) => {
    res.render('add-expenses');
});

app.post('/add', async (req, res) => {
    const { description, amount } = req.body;
    try {
        await db.query('INSERT INTO expenses (description, amount) VALUES ($1, $2)', [description, amount]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try  {
        const result = await db.query('SELECT * FROM expenses WHERE id = $id', [id]);
        res.render('edit-expenses', { expense: result.rows[0] });
    } catch (err) {
        res.status(500).send('Server error');
    }
});
app.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;
    try {
        await db.query('UPDATE expenses SET description = $1, amount = $2 WHERE id = $3', [description, amount, id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM expenses WHERE id = $1', [id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM expenses WHERE id = $1', [id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});