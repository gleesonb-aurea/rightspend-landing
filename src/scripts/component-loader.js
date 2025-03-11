const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const pagesDir = path.join(__dirname, '..', 'pages');

// Standard component IDs
const COMPONENTS = {
    header: {
        id: 'header',
        path: '/components/header.html'
    },
    footer: {
        id: 'footer',
        path: '/components/footer.html'
    }
};

// Process all HTML files in the pages directory
function processDirectory(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(directory, dirent.name);
        
        if (dirent.isDirectory()) {
            processDirectory(fullPath);
            return;
        }
        
        if (!dirent.name.endsWith('.html')) {
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');
        const $ = cheerio.load(content);

        // Remove any existing component loading scripts
        $('script').each((i, elem) => {
            const script = $(elem).html() || '';
            if (script.includes('includeFile') || script.includes('loadComponent')) {
                $(elem).remove();
            }
        });

        // Remove any existing component containers with x-data
        $('div[x-data]').each((i, elem) => {
            const xData = $(elem).attr('x-data') || '';
            if (xData.includes('includeFile')) {
                $(elem).remove();
            }
        });

        // Remove old header spacers
        $('div.h-32').each((i, elem) => {
            const prevElem = $(elem).prev();
            const nextElem = $(elem).next();
            const comments = elem.previousSibling && elem.previousSibling.nodeType === 8 ? elem.previousSibling.data : '';
            
            // Check if this is a header spacer by looking at surrounding context
            if (
                prevElem.attr('id') === 'header' ||
                nextElem.attr('id') === 'header' ||
                comments.includes('header') ||
                comments.includes('Header')
            ) {
                $(elem).remove();
            }
        });

        // Add standard component containers
        const body = $('body');
        
        // Add header after body opening tag
        if (!$('#header').length) {
            body.prepend(`
    <!-- Header Component -->
    <div id="header"></div>

    <!-- Spacer for fixed header (adjusted via script) -->
    <div id="header-spacer"></div>
`);
        }

        // Add footer before body closing tag
        if (!$('#footer').length) {
            body.append(`
    <!-- Footer Component -->
    <div id="footer"></div>
`);
        }

        // Write updated content back to file
        fs.writeFileSync(fullPath, $.html());
        console.log(`Updated ${path.relative(pagesDir, fullPath)}`);
    });
}

// Start processing from pages directory
processDirectory(pagesDir);
