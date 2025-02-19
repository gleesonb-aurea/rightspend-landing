const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other pages from the src/pages directory
app.get('/:page', (req, res) => {
    const page = req.params.page.replace('.html', '');
    res.sendFile(path.join(__dirname, 'src', 'pages', `${page}.html`));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
