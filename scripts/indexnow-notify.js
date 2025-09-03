#!/usr/bin/env node
/**
 * IndexNow notification script for RightSpend
 * Automatically notify search engines when content changes
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    API_KEY: '5a11b1db5cb4e06a424fb4cd08992d5701797810cbd79fa29cba4296476d1bd9',
    HOST: 'rightspend.ai',
    ENDPOINT: 'api.indexnow.org'
};

/**
 * Get all HTML pages from the build output
 */
function getAllPages() {
    const pages = [
        '/',
        '/commitment-free-discounts.html',
        '/finops-aws-cost-optimization.html', 
        '/aws-marketplace-rightspend-flex.html',
        '/aws-cost-optimization.html',
        '/features.html',
        '/benefits.html',
        '/use-cases.html',
        '/pricing.html',
        '/how-it-works.html',
        '/engine.html',
        '/faq.html',
        '/blog.html',
        '/admin-panel.html',
        '/automotive-manufacturer-saves-millions.html',
        '/cut-aws-costs-with-cloudfix-rightspend.html',
        '/no-break-even-worries.html',
        // Blog articles
        '/blog/7-aws-billing-mistakes-that-cost-companies-millions-2025.html',
        '/blog/reduce-aws-costs-30-percent-30-days-2025.html',
        '/blog/finops-automation-2025-eliminate-manual-cost-management.html',
        '/blog/reduce-aws-costs-immediately.html',
        '/blog/aws-reserved-instances-vs-savings-plans-2024.html',
        '/blog/cloudfix-rightspend-integration-maximum-aws-cost-optimization.html'
    ];
    
    return pages.map(page => `https://${CONFIG.HOST}${page}`);
}

/**
 * Submit URLs to IndexNow API
 */
function submitToIndexNow(urls) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            host: CONFIG.HOST,
            key: CONFIG.API_KEY,
            keyLocation: `https://${CONFIG.HOST}/${CONFIG.API_KEY}.txt`,
            urlList: urls
        });

        const options = {
            hostname: CONFIG.ENDPOINT,
            port: 443,
            path: '/indexnow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(payload);
        req.end();
    });
}

/**
 * Main execution
 */
async function main() {
    console.log('🔍 IndexNow Notification for RightSpend');
    console.log('=====================================');
    
    try {
        const urls = getAllPages();
        console.log(`📄 Submitting ${urls.length} URLs to IndexNow...`);
        
        const response = await submitToIndexNow(urls);
        
        if (response.statusCode === 200) {
            console.log('✅ URLs successfully submitted to IndexNow!');
        } else if (response.statusCode === 202) {
            console.log('✅ URLs accepted and queued for processing!');
        } else {
            console.log(`⚠️  Response: ${response.statusCode}`);
            console.log(`Data: ${response.data}`);
        }
        
        console.log('\n📝 IndexNow notification complete');
        
    } catch (error) {
        console.error('❌ Error submitting to IndexNow:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { submitToIndexNow, getAllPages };