/**
 * Build-time: ensure every page has <link rel="preconnect"> for Google Fonts
 * before the fonts CSS <link>. Idempotent — skips pages that already have it.
 * Run as part of the build (see package.json standardize step).
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');

const PRECONNECT = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;

function processDirectory(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(directory, dirent.name);
        if (dirent.isDirectory()) {
            processDirectory(fullPath);
            return;
        }
        if (!dirent.name.endsWith('.html')) return;

        let content = fs.readFileSync(fullPath, 'utf8');

        // Already has a preconnect for fonts — leave it.
        if (/preconnect[^>]*fonts\.googleapis/.test(content)) return;

        // Find the Google Fonts stylesheet link.
        const fontsLinkRe = /(\s*)(<link[^>]*href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>)/;
        if (!fontsLinkRe.test(content)) return; // no fonts link, nothing to do

        content = content.replace(fontsLinkRe, (match, indent, link) => {
            return PRECONNECT + indent + link;
        });

        fs.writeFileSync(fullPath, content);
        console.log(`✅ Added fonts preconnect: ${path.relative(pagesDir, fullPath)}`);
    });
}

processDirectory(pagesDir);
