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
        .replace(/href=["']\/dist\/css\/styles\.css["']/gi, 'href="/css/styles.css"')
        // Update image paths with case-insensitive matching
        .replace(/src="\.\.\/assets\/images\/(.*?)"/gi, 'src="/images/$1"')
        .replace(/href="\.\.\/assets\/images\/(.*?)"/gi, 'href="/images/$1"')
        // Force lowercase filenames for PNGs
        .replace(/(src|href)="\/images\/([^"]+\.png)"/gi, (match, attr, filename) => {
            return `${attr}="/images/${filename.toLowerCase()}"`;
        })
        // Update script paths
        .replace(/src="\.\.\/scripts\//g, 'src="/')
        // Update component paths
        .replace(/includeFile: '\.\.\/components\/shared\//g, 'includeFile: \'/shared/')
        // Update page links
        .replace(/href="\.\.\/pages\//g, 'href="/');

    fs.writeFileSync(filePath, content);
});

console.log('Paths updated in all HTML files');
