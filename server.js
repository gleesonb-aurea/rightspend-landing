const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

// Serve other pages from the src/pages directory
app.get('/:page', (req, res) => {
    const page = req.params.page.replace('.html', '');
    res.sendFile(path.join(__dirname, 'src', 'pages', `${page}.html`));
});

// Handle component requests
app.get('/components/:type/:component', (req, res) => {
    const { type, component } = req.params;
    res.sendFile(path.join(__dirname, 'src', 'components', type, component));
});

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src', 'pages', '404.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
