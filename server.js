const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3005;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
    extensions: ['html', 'htm'],
    index: 'index.html'
}));

// Handle all routes
app.get('*', (req, res) => {
    // Remove leading slash and try to find the file
    const filePath = path.join(__dirname, 'dist', req.path.replace(/^\//, ''));
    
    // If it's a directory, look for index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        res.sendFile(path.join(filePath, 'index.html'));
        return;
    }
    
    // Try to send the file
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
        return;
    }
    
    // If file doesn't exist, send 404
    res.status(404).sendFile(path.join(__dirname, 'dist', '404.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
