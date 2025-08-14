/**
 * GA4 Conversion Configuration for RightSpend
 * This file contains conversion goals, custom dimensions, and reporting setup
 */

// GA4 Conversion Goals Configuration
const GA4_CONVERSIONS = {
    // Primary conversion: Schedule Demo clicks
    schedule_demo: {
        event_name: 'schedule_demo_click',
        conversion_value: 10.00,
        currency: 'USD',
        conversion_id: 'G-9Z5L1G47QC/schedule_demo',
        description: 'User clicked Schedule Demo CTA leading to cal.read.ai',
        category: 'lead_generation'
    },
    
    // Secondary conversions for funnel analysis
    pricing_view: {
        event_name: 'pricing_page_view',
        conversion_value: 2.00,
        currency: 'USD', 
        description: 'User viewed pricing page (intent signal)',
        category: 'engagement'
    },
    
    high_engagement: {
        event_name: 'high_engagement',
        conversion_value: 1.00,
        currency: 'USD',
        description: 'User spent 5+ minutes on site with scroll depth >75%',
        category: 'engagement'
    },
    
    blog_engagement: {
        event_name: 'blog_high_engagement', 
        conversion_value: 0.50,
        currency: 'USD',
        description: 'User read >75% of blog article',
        category: 'content_engagement'
    }
};

// Custom Dimensions for Enhanced Attribution
const GA4_CUSTOM_DIMENSIONS = {
    cta_location: {
        parameter_name: 'cta_location',
        display_name: 'CTA Location',
        description: 'Location of clicked CTA (header_desktop, header_mobile, etc.)',
        scope: 'event'
    },
    
    source_page: {
        parameter_name: 'source_page', 
        display_name: 'Source Page',
        description: 'Page where conversion action originated',
        scope: 'event'
    },
    
    engagement_score: {
        parameter_name: 'engagement_score',
        display_name: 'Engagement Score', 
        description: 'Calculated engagement score based on time and interactions',
        scope: 'event'
    },
    
    conversion_category: {
        parameter_name: 'conversion_category',
        display_name: 'Conversion Category',
        description: 'Type of conversion (demo_request, engagement, etc.)',
        scope: 'event'
    },
    
    funnel_step: {
        parameter_name: 'funnel_step',
        display_name: 'Funnel Step',
        description: 'Step number in conversion funnel',
        scope: 'event'
    },
    
    page_category: {
        parameter_name: 'page_category',
        display_name: 'Page Category', 
        description: 'Category of page (homepage, blog, pricing, etc.)',
        scope: 'event'
    }
};

// GA4 Audiences for Retargeting and Analysis
const GA4_AUDIENCES = {
    high_intent_visitors: {
        name: 'High Intent Visitors',
        description: 'Users who viewed pricing page or spent >3 minutes on site',
        conditions: [
            'event_name = pricing_page_view',
            'OR session_engaged = true AND engagement_time_msec > 180000'
        ]
    },
    
    demo_clickers: {
        name: 'Demo CTA Clickers',
        description: 'Users who clicked any Schedule Demo CTA',
        conditions: [
            'event_name = schedule_demo_click'
        ]
    },
    
    blog_readers: {
        name: 'Blog Content Readers',
        description: 'Users who engaged with blog content',
        conditions: [
            'page_path contains /blog/',
            'AND scroll_depth > 50'
        ]
    },
    
    return_visitors: {
        name: 'Return Visitors',
        description: 'Users who visited multiple times without converting',
        conditions: [
            'session_number > 1',
            'AND NOT event_name = schedule_demo_click'
        ]
    }
};

// Conversion Funnel Configuration
const CONVERSION_FUNNEL = {
    steps: [
        {
            step: 1,
            name: 'Site Entry',
            event: 'page_view',
            description: 'User lands on any page'
        },
        {
            step: 2, 
            name: 'Content Engagement',
            events: ['scroll_depth', 'time_on_page'],
            description: 'User engages with content (scroll >25% OR time >30s)'
        },
        {
            step: 3,
            name: 'Product Interest',
            events: ['features_view', 'pricing_view', 'use_cases_view'],
            description: 'User views product-related pages'
        },
        {
            step: 4,
            name: 'Demo Intent',
            event: 'schedule_demo_click',
            description: 'User clicks Schedule Demo CTA'
        },
        {
            step: 5,
            name: 'Conversion',
            event: 'conversion',
            description: 'User completes demo scheduling (external)'
        }
    ]
};

// Track high-value engagement automatically
function trackHighEngagement() {
    let engagementScore = 0;
    let timeOnPage = 0;
    let maxScrollDepth = 0;
    let pageViews = 1;
    
    // Start engagement tracking
    const startTime = Date.now();
    
    // Track scroll depth
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
        maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
    });
    
    // Check for high engagement every 30 seconds
    setInterval(() => {
        timeOnPage = Math.floor((Date.now() - startTime) / 1000);
        engagementScore = calculateEngagementScore(timeOnPage);
        
        // High engagement threshold: 5+ minutes AND 75%+ scroll depth
        if (timeOnPage >= 300 && maxScrollDepth >= 75 && !window.highEngagementTracked) {
            trackEvent('conversion', 'high_engagement', 'qualified_visitor', null, {
                'engagement_score': engagementScore,
                'time_on_page': timeOnPage,
                'max_scroll_depth': Math.round(maxScrollDepth),
                'page_category': getContentGroup()
            });
            
            window.highEngagementTracked = true;
            console.log('🔥 High engagement conversion tracked!');
        }
    }, 30000);
}

// Enhanced CTA Performance Analysis
function generateCTAReport() {
    // This would integrate with GA4 Reporting API
    console.log('CTA Performance Analysis Configuration:', {
        metrics: [
            'event_count',
            'conversions',
            'conversion_rate', 
            'total_revenue'
        ],
        dimensions: [
            'event_name',
            'cta_location',
            'source_page',
            'device_category'
        ],
        segments: [
            'new_users',
            'returning_users',
            'high_intent_visitors'
        ]
    });
}

// Initialize enhanced conversion tracking
function initializeConversionTracking() {
    console.log('Initializing GA4 conversion tracking...');
    
    // Track high engagement behavior
    trackHighEngagement();
    
    // Set up pricing page conversion tracking
    if (window.location.pathname.includes('pricing')) {
        trackEvent('conversion', 'pricing_page_view', 'pricing_intent', null, {
            'conversion_category': 'engagement',
            'page_category': 'pricing'
        });
    }
    
    // Set up blog engagement tracking
    if (window.location.pathname.includes('/blog')) {
        setTimeout(() => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
            if (scrollPercent > 75) {
                trackEvent('conversion', 'blog_high_engagement', 'content_reader', null, {
                    'conversion_category': 'content_engagement',
                    'article_category': getBlogCategory()
                });
            }
        }, 120000); // Check after 2 minutes
    }
    
    console.log('Conversion tracking initialized');
}

// Determine blog category for enhanced attribution
function getBlogCategory() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('aws-billing')) return 'billing_optimization';
    if (path.includes('finops')) return 'finops';
    if (path.includes('costs')) return 'cost_optimization';
    if (path.includes('automation')) return 'automation';
    return 'general';
}

// Export configuration for GA4 setup
window.GA4_CONFIG = {
    conversions: GA4_CONVERSIONS,
    customDimensions: GA4_CUSTOM_DIMENSIONS,
    audiences: GA4_AUDIENCES,
    funnel: CONVERSION_FUNNEL
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConversionTracking);
} else {
    initializeConversionTracking();
}