const fs = require('fs');
const path = require('path');

function fixPaths() {
  const distDir = path.join(__dirname, 'dist');
  const files = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(distDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace path references
    content = content
      .replace(/\.\.\/styles\/input\.css/g, '/css/styles.css')
      .replace(/\.\/styles\/styles\.css/g, '/css/styles.css')
      .replace(/\.\/components\//g, '/components/')
      .replace(/\/components\//g, '/components/')
      .replace(/\/src\/components\//g, '/components/')
      .replace(/\/assets\/assets\//g, '/assets/')
      .replace(/\/assets\/assets\/images\//g, '/assets/images/')
      .replace(/\.\.\/assets\/images\//g, '/assets/images/')
      .replace(/\.\/assets\/images\//g, '/assets/images/')
      .replace(/\/src\/assets\/images\//g, '/assets/images/')
      .replace(/\/images\//g, '/assets/images/')
      .replace(/\.\.\/scripts\//g, '/scripts/')
      .replace(/\.\/scripts\//g, '/scripts/')
      .replace(/\/src\/scripts\//g, '/scripts/')
      .replace(/\/pages\/features\.html/g, '/features.html');

    // Cleanup double asset paths
    content = content.replace(/\/assets\/assets\//g, '/assets/');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Processed ${file}`);
  });
}

try {
  fixPaths();
  console.log('✅ fix-paths.js finished');
} catch (err) {
  console.error('❌ fix-paths.js failed:', err);
  process.exit(1);
}
