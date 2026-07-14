#!/usr/bin/env node
/**
 * Notify search engines when RightSpend content changes. Runs on every deploy.
 *
 * Two channels fire:
 *   1. IndexNow — pushes the full URL list to Bing/Yandex/Naver/Seznam.
 *                 Primary; needs no API key — verification is the key file
 *                 served at https://rightspend.ai/<KEY>.txt (src/<KEY>.txt).
 *   2. Bing BWT — SubmitUrlBatch via the Bing Webmaster API key. Complementary
 *                 (appears in the BWT dashboard). Skipped silently when
 *                 BWT_API_KEY is not set, so this never blocks a deploy.
 *
 * The URL list is derived from dist/sitemap.xml so it can never drift from what
 * is actually deployed, plus a small EXTRAS list for AI-crawler files that are
 * intentionally excluded from the sitemap.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'rightspend.ai';
// Intentionally public — IndexNow verification IS the key file at /<KEY>.txt.
const INDEXNOW_KEY = '5a11b1db5cb4e06a424fb4cd08992d5701797810cbd79fa29cba4296476d1bd9';
const INDEXNOW_PATH = '/indexnow';
const BWT_PATH = '/webmaster/api.svc/json/SubmitUrlBatch';

// Pinged in addition to the sitemap (AI-crawler discovery files, not in sitemap.xml).
const EXTRAS = [
    `https://${HOST}/.well-known/llms.txt`,
    `https://${HOST}/.well-known/llms-full.txt`,
];

/** Every <loc> in the built sitemap, de-duped + sorted, unioned with EXTRAS. */
function getUrlsFromSitemap() {
    const sitemapPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
        throw new Error(`sitemap.xml not found at ${sitemapPath} — build must run first`);
    }
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const urls = new Set(EXTRAS);
    const re = /<loc>([^<]+)<\/loc>/g;
    let m;
    while ((m = re.exec(xml)) !== null) urls.add(m[1].trim());
    return [...urls].sort();
}

function httpsJson(hostname, urlPath, payload) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(payload.body);
        const req = https.request({
            hostname,
            port: 443,
            path: urlPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Length': Buffer.byteLength(body),
            },
        }, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

/** IndexNow: one POST carrying the whole list + the key. 200|202 = success. */
async function notifyIndexNow(urls) {
    const res = await httpsJson('api.indexnow.org', INDEXNOW_PATH, {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
    });
    if (res.statusCode === 200 || res.statusCode === 202) return true;
    throw new Error(`HTTP ${res.statusCode} ${res.data.slice(0, 200)}`);
}

/** Bing Webmaster API: SubmitUrlBatch in <=500-URL chunks (API limit). */
async function notifyBing(urls) {
    const apiKey = process.env.BWT_API_KEY;
    if (!apiKey) {
        console.log('   (BWT_API_KEY not set — skipping Bing SubmitUrlBatch)');
        return;
    }
    for (let i = 0; i < urls.length; i += 500) {
        const batch = urls.slice(i, i + 500);
        const res = await httpsJson('ssl.bing.com', `${BWT_PATH}?apikey=${apiKey}`, {
            siteUrl: `https://${HOST}`,
            urlList: batch,
        });
        const ok = res.statusCode === 200 && /"d"\s*:\s*null/.test(res.data);
        console.log(`   SubmitUrlBatch[${i + 1}-${i + batch.length}]: ${ok ? 'OK' : `HTTP ${res.statusCode} ${res.data.slice(0, 180)}`}`);
        if (!ok) throw new Error(`HTTP ${res.statusCode}`);
    }
}

async function main() {
    console.log('🔍 RightSpend search-engine notification');
    console.log('==========================================');
    const urls = getUrlsFromSitemap();
    console.log(`📄 ${urls.length} URLs (dist/sitemap.xml + ${EXTRAS.length} extras)`);

    console.log('\n[1/2] IndexNow (Bing/Yandex/Naver/Seznam)...');
    try {
        await notifyIndexNow(urls);
        console.log('   ✅ submitted');
    } catch (e) {
        console.error(`   ❌ ${e.message}`);
    }

    console.log('\n[2/2] Bing Webmaster SubmitUrlBatch...');
    try {
        await notifyBing(urls);
        console.log('   ✅ done');
    } catch (e) {
        console.error(`   ❌ ${e.message}`);
    }

    console.log('\n📝 notification complete');
}

if (require.main === module) {
    main();
}

module.exports = { getUrlsFromSitemap, notifyIndexNow, notifyBing };
