const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix paths in HTML files
function fixPaths() {
    const distDir = path.join(__dirname, 'dist');
    
    // Find all HTML files in dist directory
    glob.sync('**/*.html', { cwd: distDir }).forEach(file => {
        const filePath = path.join(distDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix paths to match dist directory structure
        content = content
            // Fix CSS paths
            .replace(/\.\.\/styles\/input\.css/g, '/css/styles.css')
            .replace(/\.\/styles\/styles\.css/g, '/css/styles.css')
            // Fix component paths
            .replace(/\.\/components\//g, '/components/')
            .replace(/\/components\//g, '/components/')
            .replace(/\/src\/components\//g, '/components/')
            // Fix asset paths - prevent double assets and handle all variations
            .replace(/\/assets\/assets\//g, '/assets/')
            .replace(/\/assets\/assets\/images\//g, '/assets/images/')
            .replace(/\.\.\/assets\/images\//g, '/assets/images/')
            .replace(/\.\/assets\/images\//g, '/assets/images/')
            .replace(/\/src\/assets\/images\//g, '/assets/images/')
            .replace(/\/images\//g, '/assets/images/')
            // Fix script paths
            .replace(/\.\.\/scripts\//g, '/scripts/')
            .replace(/\.\/scripts\//g, '/scripts/')
            .replace(/\/src\/scripts\//g, '/scripts/')
            // Fix page paths
            .replace(/\.\/pages\//g, '/')
            .replace(/\/src\/pages\//g, '/');
        
        // Final cleanup pass for any remaining double assets
        content = content.replace(/\/assets\/assets\//g, '/assets/');
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed paths in ${file}`);
        
        // Debug: Log the image paths in the file
        const imagePaths = content.match(/src="[^"]*\.(png|jpg|jpeg|gif|svg)"/g);
        if (imagePaths) {
            console.log(`Image paths in ${file}:`, imagePaths);
        }
    });
}

try {
    fixPaths();
    console.log('Paths fixed successfully!');
} catch (error) {
    console.error('Error fixing paths:', error);
    process.exit(1);
}
