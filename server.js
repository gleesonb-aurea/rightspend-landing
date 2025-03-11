const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3006;

// Serve static files from 'dist' directory
app.use(express.static(path.join(__dirname, 'dist'), {
    extensions: ['html', 'htm'],
    index: 'index.html'
}));

// Serve static files from the root directory
app.use(express.static(__dirname, {
    extensions: ['html', 'htm', 'xml'],
    index: 'index.html'
}));

// Handle all routes
app.get('*', (req, res) => {
    let filePath = path.join(__dirname, 'dist', req.path.replace(/^\//, ''));
    
    // Check if the file exists in the 'dist' directory
    if (fs.existsSync(filePath)) {
        if (fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        res.sendFile(filePath);
        return;
    }

    // If not found in 'dist', check the root directory
    filePath = path.join(__dirname, req.path.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
        if (fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        res.sendFile(filePath);
        return;
    }
    
    // If file doesn't exist, send 404
    res.status(404).sendFile(path.join(__dirname, 'dist', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
