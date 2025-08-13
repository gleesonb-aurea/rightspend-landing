#!/usr/bin/env node
/**
 * Google Search Console Integration Script
 * 
 * This script connects to Google Search Console API to pull indexing errors,
 * crawl issues, and performance data for rightspend.ai
 * 
 * Setup Instructions:
 * 1. Install dependencies: npm install googleapis fs path
 * 2. Set up Google Service Account credentials
 * 3. Add your site property to Google Search Console
 * 4. Run: node scripts/gsc-integration.js
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class GSCIntegration {
    constructor() {
        this.siteUrl = 'https://rightspend.ai/';
        this.credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './gsc-credentials.json';
        this.searchconsole = null;
        this.outputDir = './reports';
    }

    async initialize() {
        try {
            // Load service account credentials
            const credentials = JSON.parse(await fs.readFile(this.credentialsPath, 'utf8'));
            
            // Create JWT auth client
            const auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
            });

            // Initialize Search Console API
            this.searchconsole = google.searchconsole({ version: 'v1', auth });
            
            console.log('✅ Google Search Console API initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize GSC API:', error.message);
            return false;
        }
    }

    async getCoverageIssues() {
        try {
            console.log('📊 Fetching coverage issues...');
            
            const response = await this.searchconsole.urlInspection.index.inspect({
                requestBody: {
                    inspectionUrl: this.siteUrl,
                    siteUrl: this.siteUrl
                }
            });

            return response.data;
        } catch (error) {
            console.error('❌ Error fetching coverage issues:', error.message);
            return null;
        }
    }

    async getSitemaps() {
        try {
            console.log('🗺️ Fetching sitemap status...');
            
            const response = await this.searchconsole.sitemaps.list({
                siteUrl: this.siteUrl
            });

            return response.data.sitemap || [];
        } catch (error) {
            console.error('❌ Error fetching sitemaps:', error.message);
            return [];
        }
    }

    async getIndexingErrors() {
        try {
            console.log('🔍 Fetching indexing errors...');
            
            // Get URL inspection data for specific pages
            const criticalPages = [
                'https://rightspend.ai/',
                'https://rightspend.ai/features.html',
                'https://rightspend.ai/pricing.html',
                'https://rightspend.ai/how-it-works.html',
                'https://rightspend.ai/faq.html',
                'https://rightspend.ai/blog.html',
                'https://rightspend.ai/commitment-free-discounts.html',
                'https://rightspend.ai/finops-aws-cost-optimization.html',
                'https://rightspend.ai/aws-marketplace-rightspend-flex.html',
                'https://rightspend.ai/use-cases.html',
                'https://rightspend.ai/benefits.html',
                'https://rightspend.ai/admin-panel.html'
            ];

            const results = [];
            
            for (const url of criticalPages) {
                try {
                    const response = await this.searchconsole.urlInspection.index.inspect({
                        requestBody: {
                            inspectionUrl: url,
                            siteUrl: this.siteUrl
                        }
                    });
                    
                    results.push({
                        url,
                        status: response.data.inspectionResult?.indexStatusResult?.verdict,
                        coverageState: response.data.inspectionResult?.indexStatusResult?.coverageState,
                        crawlTime: response.data.inspectionResult?.indexStatusResult?.lastCrawlTime,
                        issues: response.data.inspectionResult?.indexStatusResult?.pageFetchState
                    });
                    
                    // Rate limiting - wait 100ms between requests
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.warn(`⚠️ Could not inspect ${url}:`, error.message);
                    results.push({
                        url,
                        error: error.message
                    });
                }
            }

            return results;
        } catch (error) {
            console.error('❌ Error fetching indexing data:', error.message);
            return [];
        }
    }

    async generateReport() {
        try {
            console.log('📋 Generating comprehensive SEO report...');
            
            // Ensure output directory exists
            await fs.mkdir(this.outputDir, { recursive: true });

            // Gather all data
            const [coverageIssues, sitemaps, indexingErrors] = await Promise.all([
                this.getCoverageIssues(),
                this.getSitemaps(),
                this.getIndexingErrors()
            ]);

            // Generate report
            const report = {
                generatedAt: new Date().toISOString(),
                siteUrl: this.siteUrl,
                summary: {
                    totalPagesInspected: indexingErrors.length,
                    indexedPages: indexingErrors.filter(p => p.status === 'PASS').length,
                    errorPages: indexingErrors.filter(p => p.error || p.status !== 'PASS').length,
                    sitemapsFound: sitemaps.length
                },
                coverageIssues,
                sitemaps,
                indexingErrors,
                recommendations: this.generateRecommendations(indexingErrors, sitemaps)
            };

            // Save detailed JSON report
            const jsonPath = path.join(this.outputDir, 'gsc-report.json');
            await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));

            // Generate human-readable summary
            const summaryPath = path.join(this.outputDir, 'seo-issues-summary.txt');
            const summary = this.generateTextSummary(report);
            await fs.writeFile(summaryPath, summary);

            console.log(`✅ Reports generated:`);
            console.log(`   📄 Detailed: ${jsonPath}`);
            console.log(`   📝 Summary: ${summaryPath}`);

            return report;
        } catch (error) {
            console.error('❌ Error generating report:', error.message);
            return null;
        }
    }

    generateRecommendations(indexingErrors, sitemaps) {
        const recommendations = [];

        // Check for indexing issues
        const errorPages = indexingErrors.filter(p => p.error || p.status !== 'PASS');
        if (errorPages.length > 0) {
            recommendations.push({
                type: 'indexing',
                priority: 'high',
                message: `${errorPages.length} pages have indexing issues`,
                action: 'Review page structure, robots.txt, and canonical URLs',
                affectedPages: errorPages.map(p => p.url)
            });
        }

        // Check sitemap coverage
        if (sitemaps.length === 0) {
            recommendations.push({
                type: 'sitemap',
                priority: 'high',
                message: 'No sitemaps found in Google Search Console',
                action: 'Submit sitemap.xml to Google Search Console'
            });
        }

        // Check for crawl errors
        const crawlErrors = indexingErrors.filter(p => 
            p.issues && p.issues !== 'SUCCESSFUL'
        );
        
        if (crawlErrors.length > 0) {
            recommendations.push({
                type: 'crawling',
                priority: 'medium',
                message: `${crawlErrors.length} pages have crawl errors`,
                action: 'Fix server errors, redirects, and blocked resources',
                affectedPages: crawlErrors.map(p => p.url)
            });
        }

        return recommendations;
    }

    generateTextSummary(report) {
        const { summary, recommendations, indexingErrors } = report;
        
        let text = `Google Search Console Report - ${new Date().toLocaleDateString()}\n`;
        text += `====================================================\n\n`;
        
        text += `SUMMARY:\n`;
        text += `- Total pages inspected: ${summary.totalPagesInspected}\n`;
        text += `- Successfully indexed: ${summary.indexedPages}\n`;
        text += `- Pages with errors: ${summary.errorPages}\n`;
        text += `- Sitemaps found: ${summary.sitemapsFound}\n\n`;

        if (recommendations.length > 0) {
            text += `RECOMMENDATIONS:\n`;
            recommendations.forEach((rec, i) => {
                text += `${i + 1}. [${rec.priority.toUpperCase()}] ${rec.message}\n`;
                text += `   Action: ${rec.action}\n`;
                if (rec.affectedPages) {
                    text += `   Affected pages: ${rec.affectedPages.slice(0, 3).join(', ')}${rec.affectedPages.length > 3 ? '...' : ''}\n`;
                }
                text += `\n`;
            });
        }

        text += `DETAILED PAGE STATUS:\n`;
        indexingErrors.forEach(page => {
            const status = page.error ? 'ERROR' : (page.status === 'PASS' ? 'INDEXED' : 'ISSUE');
            text += `[${status}] ${page.url}\n`;
            if (page.error) {
                text += `  Error: ${page.error}\n`;
            }
            if (page.crawlTime) {
                text += `  Last crawled: ${new Date(page.crawlTime).toLocaleDateString()}\n`;
            }
            text += `\n`;
        });

        return text;
    }

    async run() {
        console.log('🚀 Starting Google Search Console integration...\n');

        // Initialize API connection
        const initialized = await this.initialize();
        if (!initialized) {
            console.log('\n📝 Setup Instructions:');
            console.log('1. Create a Google Cloud Project');
            console.log('2. Enable the Search Console API');
            console.log('3. Create a service account and download credentials');
            console.log('4. Save credentials as gsc-credentials.json');
            console.log('5. Add service account email to Search Console property');
            return;
        }

        // Generate comprehensive report
        const report = await this.generateReport();
        
        if (report) {
            console.log('\n🎯 Quick Fixes for Current Issues:');
            console.log('1. ✅ Fixed Open Graph URL mismatches (og:url now matches canonical)');
            console.log('2. ✅ Updated robots.txt to explicitly allow admin-panel.html');
            console.log('3. ✅ Updated sitemap.xml with current dates (2025-08-13)');
            console.log('4. ✅ Removed non-existent blog URLs from sitemap');
            console.log('\n💡 Next steps: Re-submit updated sitemap to Google Search Console');
        }
    }
}

// Run the integration if called directly
if (require.main === module) {
    const gsc = new GSCIntegration();
    gsc.run().catch(console.error);
}

module.exports = GSCIntegration;