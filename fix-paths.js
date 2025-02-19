const fs = require('fs');
const path = require('path');

// Get all HTML files in dist directory
const htmlFiles = fs.readdirSync('dist').filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join('dist', file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Update paths
    content = content
        // Update CSS path patterns
        .replace(/href=["']\.\.\/styles\/input\.css["']/gi, 'href="/css/styles.css"')
        // Update image paths with case normalization
        .replace(/(src|href)=["'](?:\.\.\/)*assets\/images\/([^"']+)["']/gi, (match, attr, filename) => {
            return `${attr}="/images/${filename.toLowerCase()}"`;
        })
        // Update script paths
        .replace(/(src|href)=["'](?:\.\.\/)*scripts\/([^"']+)["']/gi, (match, attr, path) => {
            return `${attr}="/${path.toLowerCase()}"`;
        })
        // Update component paths
        .replace(/includeFile: ["'](?:\.\.\/)*components\/shared\/([^"']+)["']/gi, 'includeFile: \'/shared/$1\'')
        // Update page links and normalize case
        .replace(/(href)=["'](.*?)pages\/([^"']+)["']/gi, (match, attr, prefix, path) => {
            return `${attr}="/${path.toLowerCase()}"`;
        })
        // Add base href for production
        .replace(/(<head>)/i, '$1\n<base href="/">')
        // General case normalization for all file references
        .replace(/(href|src)=["']\/([^"']+)["']/gi, (match, attr, path) => {
            const ext = path.split('.').pop();
            const basePath = path.replace(`.${ext}`, '').toLowerCase();
            return `${attr}="/${basePath}.${ext}"`;
        });

    fs.writeFileSync(filePath, content);
});

console.log('Paths updated in all HTML files');
