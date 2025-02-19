const fs = require('fs');
const path = require('path');

// Get all HTML files in dist directory
const htmlFiles = fs.readdirSync('dist').filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join('dist', file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Update paths
    content = content
        // Update CSS path
        .replace(/href="\/dist\/css\/styles\.css"/g, 'href="/css/styles.css"')
        // Update image paths
        .replace(/src="\.\.\/assets\/images\//g, 'src="/images/')
        .replace(/href="\.\.\/assets\/images\//g, 'href="/images/')
        // Update script paths
        .replace(/src="\.\.\/scripts\//g, 'src="/')
        // Update component paths
        .replace(/includeFile: '\.\.\/components\/shared\//g, 'includeFile: \'/shared/')
        // Update page links
        .replace(/href="\.\.\/pages\//g, 'href="/');

    fs.writeFileSync(filePath, content);
});

console.log('Paths updated in all HTML files');
