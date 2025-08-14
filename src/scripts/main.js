// LLM-Friendly Bot Detection
function isLLMCrawler() {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
        'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
        'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
        'chatgpt', 'claude', 'perplexity', 'anthropic', 'openai',
        'crawler', 'spider', 'scraper', 'bot', 'archiver'
    ];
    return botPatterns.some(pattern => userAgent.includes(pattern)) ||
           navigator.webdriver === true ||
           window.navigator.plugins.length === 0;
}

// Enhanced CTA Schema for LLM Understanding
function addConversionSchema() {
    if (isLLMCrawler()) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "mainEntity": {
                "@type": "Service",
                "name": "RightSpend AWS Cost Optimization",
                "provider": {
                    "@type": "Organization", 
                    "name": "CloudFix"
                },
                "potentialAction": {
                    "@type": "ConsumeAction",
                    "target": "https://cal.read.ai/bill-gleeson",
                    "name": "Schedule Free Demo",
                    "description": "Book a free consultation for AWS cost optimization"
                }
            },
            "significantLink": "https://cal.read.ai/bill-gleeson"
        };
        
        const scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.text = JSON.stringify(schema);
        document.head.appendChild(scriptTag);
    }
}

// Initialize Google Analytics
function initGoogleAnalytics() {
    console.log('Initializing Google Analytics...');
    return new Promise((resolve, reject) => {
        try {
            // Load GA script
            var gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-9Z5L1G47QC';
            
            gaScript.onload = () => {
                // Initialize dataLayer and gtag
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-9Z5L1G47QC');
                console.log('Google Analytics initialized successfully');
                resolve();
            };
            
            gaScript.onerror = (error) => {
                console.error('Failed to load Google Analytics:', error);
                resolve(); // Resolve anyway to not block other tracking
            };
            
            document.head.appendChild(gaScript);
        } catch (error) {
            console.error('Error initializing Google Analytics:', error);
            resolve(); // Resolve anyway to not block other tracking
        }
    });
}

// Initialize Apollo Tracking
function initApollo() {
    console.log('Initializing Apollo tracking...');
    return new Promise((resolve, reject) => {
        if (isTrackingBlocked()) {
            console.log('Apollo tracking blocked by browser settings');
            resolve();
            return;
        }

        try {
            var n = Math.random().toString(36).substring(7);
            var o = document.createElement("script");
            o.src = "https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=" + n;
            o.async = true;
            o.defer = true;
            
            o.onload = function() {
                try {
                    window.trackingFunctions.onLoad({appId: "6602e615b2af9b0439deed0c"});
                    console.log('Apollo tracking initialized successfully');
                } catch (error) {
                    console.error('Error in Apollo onLoad callback:', error);
                }
                resolve();
            };
            
            o.onerror = function(error) {
                console.error('Apollo script loading failed:', error);
                resolve(); // Resolve anyway to not block other tracking
            };
            
            document.head.appendChild(o);
        } catch (error) {
            console.error('Error initializing Apollo tracking:', error);
            resolve();
        }
    });
}

// Initialize RevenueBase (RB2B) tracking
function initRb2b() {
    console.log('Initializing RevenueBase tracking...');
    return new Promise((resolve, reject) => {
        try {
            // Initialize RB2B global object
            window.reb2b = window.reb2b || [];
            if (window.reb2b.invoked) {
                console.log('RB2B already initialized');
                resolve();
                return;
            }

            window.reb2b = {
                invoked: true,
                methods: ["identify", "collect"],
                factory: function(method) {
                    return function() {
                        var args = Array.prototype.slice.call(arguments);
                        args.unshift(method);
                        window.reb2b.push(args);
                        return window.reb2b;
                    };
                },
                load: function(key) {
                    return new Promise((resolveLoad, rejectLoad) => {
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.async = true;
                        script.src = `https://s3-us-west-2.amazonaws.com/b2bjsstore/b/${key}/LNKLDHP2G1OJ.js.gz`;
                        
                        script.onload = () => {
                            console.log('RB2B script loaded successfully');
                            resolveLoad();
                        };
                        
                        script.onerror = (error) => {
                            console.error('Failed to load RB2B script:', error);
                            rejectLoad(error);
                        };
                        
                        var first = document.getElementsByTagName("script")[0];
                        first.parentNode.insertBefore(script, first);
                    });
                },
                SNIPPET_VERSION: "1.0.1"
            };

            // Set up method factories
            for (var i = 0; i < window.reb2b.methods.length; i++) {
                var key = window.reb2b.methods[i];
                window.reb2b[key] = window.reb2b.factory(key);
            }

            // Load RB2B script
            window.reb2b.load("LNKLDHP2G1OJ")
                .then(() => {
                    console.log('RB2B initialized successfully');
                    resolve();
                })
                .catch((error) => {
                    console.error('RB2B initialization failed:', error);
                    reject(error);
                });

        } catch (error) {
            console.error('Error during RB2B initialization:', error);
            reject(error);
        }
    });
}

// Initialize all tracking systems in parallel
function initializeTracking() {
    console.log('Initializing tracking systems...');
    
    return Promise.allSettled([
        initGoogleAnalytics().catch(error => {
            console.error('GA initialization failed:', error);
            return Promise.reject(error);
        }),
        initApollo().catch(error => {
            console.error('Apollo initialization failed:', error);
            return Promise.reject(error);
        }),
        initRb2b().catch(error => {
            console.error('RB2B initialization failed:', error);
            return Promise.reject(error);
        })
    ]).then(results => {
        results.forEach((result, index) => {
            const tracker = ['Google Analytics', 'Apollo', 'RB2B'][index];
            if (result.status === 'fulfilled') {
                console.log(`${tracker} initialized successfully`);
            } else {
                console.warn(`${tracker} initialization failed:`, result.reason);
            }
        });
    });
}

// Initialize cost savings graph
function initCostGraph() {
    const graphElement = document.getElementById('costGraph');
    if (!graphElement) {
        console.warn('Cost graph element not found on this page');
        return;
    }

    const ctx = graphElement.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
            datasets: [
                {
                    label: 'On-Demand Cost',
                    data: [100000, 105000, 110000, 115000, 120000, 125000],
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    fill: true
                },
                {
                    label: 'RightSpend Cost',
                    data: [100000, 85000, 70000, 60000, 55000, 52000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'AWS Cost Comparison Over Time',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Check if tracking is blocked
function isTrackingBlocked() {
    return window.doNotTrack === "1" || 
           navigator.doNotTrack === "1" || 
           navigator.doNotTrack === "yes";
}

// Component Loading
async function loadComponent(id, path) {
    if (!id || !path) {
        console.error('Invalid component parameters - id:', id, 'path:', path);
        throw new Error('Component ID and path are required');
    }

    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id '${id}' not found`);
        throw new Error(`Target element '${id}' not found`);
    }

    try {
        // Ensure path starts with /components/
        const validPath = path.startsWith('/components/') ? path : `/components/${path}`;
        console.log(`Loading component ${id} from ${validPath}`);

        const response = await fetch(validPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${validPath} (${response.status})`);
        }

        const html = await response.text();
        element.innerHTML = html;
        console.log(`Component ${id} loaded successfully`);
    } catch (error) {
        console.error(`Error loading component ${id}:`, error);
        throw error;
    }
}

// Adjust header spacing based on actual header height
function adjustHeaderSpacing() {
    const header = document.getElementById('header');
    const spacer = document.getElementById('header-spacer');
    
    if (!header || !spacer) {
        console.warn('Header or spacer elements not found');
        return;
    }

    // Get the actual rendered height of the header
    const headerHeight = header.getBoundingClientRect().height;
    
    // Add a small buffer (8px) to prevent content from touching the header
    spacer.style.height = `${headerHeight + 8}px`;
    
    console.log(`Adjusted header spacing to ${headerHeight + 8}px`);
}

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing application...');
    
    try {
        // Load components first with explicit paths
        await Promise.all([
            loadComponent('header', '/components/header.html'),
            loadComponent('footer', '/components/footer.html')
        ]);
        
        console.log('Components loaded, initializing Alpine.js...');
        
        // Wait for Alpine.js to initialize
        document.addEventListener('alpine:init', () => {
            // Adjust header spacing after Alpine.js initializes components
            setTimeout(adjustHeaderSpacing, 100);
        });
        
        // Initialize tracking
        await initializeTracking();
        
        // Initialize enhanced page view tracking
        trackPageView();
        
        // Setup enhanced event tracking
        setupEventTracking();
        
        // Initialize cost graph if element exists
        initCostGraph();
        
        // Initialize LLM-friendly conversion optimization
        // Load conversion script dynamically for better performance
        const conversionScript = document.createElement('script');
        conversionScript.src = '/scripts/llm-friendly-conversion.js';
        conversionScript.async = true;
        document.head.appendChild(conversionScript);
        
        // Load GA4 conversion configuration
        const ga4ConfigScript = document.createElement('script');
        ga4ConfigScript.src = '/scripts/ga4-conversion-config.js';
        ga4ConfigScript.async = true;
        document.head.appendChild(ga4ConfigScript);
        
        // Re-adjust header spacing after images load (which might affect layout)
        window.addEventListener('load', () => {
            // Allow time for images to affect layout
            setTimeout(adjustHeaderSpacing, 100);
        });
        
        // Re-adjust on window resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(adjustHeaderSpacing, 100);
        });
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Track Events Helper - Enhanced for GA4 conversion tracking
function trackEvent(category, action, label = null, value = null, customParams = {}) {
    if (window.gtag) {
        const eventParams = {
            'event_category': category,
            ...customParams
        };
        
        if (label) eventParams.event_label = label;
        if (value) eventParams.value = value;
        
        gtag('event', action, eventParams);
        console.log(`Tracked event: ${category} - ${action} - ${label}`, eventParams);
    }
}

// Enhanced CTA Click Tracking with Conversion Detection
function trackCTAClick(element, eventData = {}) {
    const buttonText = element.textContent.trim();
    const destination = element.href;
    const pageTitle = document.title;
    const currentPath = window.location.pathname;
    
    // Determine CTA location
    let ctaLocation = 'unknown';
    if (element.closest('header')) {
        ctaLocation = element.closest('.md\\:hidden') ? 'header_mobile' : 'header_desktop';
    } else if (element.closest('section')) {
        // Try to identify section by nearby headings
        const section = element.closest('section');
        const heading = section.querySelector('h1, h2, h3');
        if (heading) {
            ctaLocation = heading.textContent.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
        } else {
            ctaLocation = 'page_content';
        }
    } else if (element.closest('footer')) {
        ctaLocation = 'footer';
    }
    
    // Check if this is a conversion CTA (cal.read.ai link)
    const isConversionCTA = destination && destination.includes('cal.read.ai/bill-gleeson');
    
    if (isConversionCTA) {
        // Track as conversion with enhanced parameters
        trackEvent('conversion', 'schedule_demo_click', buttonText, null, {
            'cta_location': ctaLocation,
            'source_page': currentPath,
            'page_title': pageTitle,
            'destination_url': destination,
            'button_text': buttonText,
            'conversion_category': 'demo_request',
            'conversion_value': 1000, // Estimated lead value in cents for GA4
            'currency': 'USD'
        });
        
        // Also send as a specific GA4 conversion event
        gtag('event', 'conversion', {
            'send_to': 'G-9Z5L1G47QC/schedule_demo',
            'event_category': 'conversion',
            'event_label': `${ctaLocation}_${buttonText}`,
            'value': 10.00, // Dollar value
            'currency': 'USD'
        });
        
        console.log(`🎯 CONVERSION: Demo scheduling click tracked from ${ctaLocation}`);
    } else {
        // Regular CTA tracking
        trackEvent('engagement', 'cta_click', buttonText, null, {
            'cta_location': ctaLocation,
            'source_page': currentPath,
            'destination_url': destination,
            'button_text': buttonText
        });
    }
}

// Enhanced Funnel Tracking
function trackFunnelStep(step, stepName, additionalData = {}) {
    trackEvent('funnel', 'step_completed', stepName, step, {
        'funnel_step': step,
        'step_name': stepName,
        'page_path': window.location.pathname,
        'page_title': document.title,
        ...additionalData
    });
    
    console.log(`📊 Funnel Step ${step}: ${stepName} completed`);
}

// Page View Tracking with Enhanced Attribution
function trackPageView() {
    const pageData = {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_path': window.location.pathname,
        'content_group1': getContentGroup(), // Page category
        'content_group2': getPageType(), // Page type
    };
    
    // Add referrer information if available
    if (document.referrer) {
        pageData.referrer = document.referrer;
    }
    
    // Add campaign parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        if (urlParams.get(param)) {
            pageData[param] = urlParams.get(param);
        }
    });
    
    gtag('config', 'G-9Z5L1G47QC', pageData);
    
    // Track specific funnel steps based on page
    trackPageSpecificFunnelStep();
}

// Determine content group based on URL
function getContentGroup() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('blog')) return 'blog';
    if (path.includes('pricing')) return 'pricing';
    if (path.includes('features')) return 'product';
    if (path.includes('use-case')) return 'use_cases';
    if (path === '/' || path === '/index.html') return 'homepage';
    return 'other';
}

// Determine page type
function getPageType() {
    const path = window.location.pathname.toLowerCase();
    if (path === '/' || path === '/index.html') return 'landing_page';
    if (path.includes('blog/')) return 'blog_post';
    if (path.includes('.html')) return 'product_page';
    return 'content_page';
}

// Track funnel steps based on current page
function trackPageSpecificFunnelStep() {
    const path = window.location.pathname.toLowerCase();
    
    if (path === '/' || path === '/index.html') {
        trackFunnelStep(1, 'homepage_view', { page_type: 'entry' });
    } else if (path.includes('features')) {
        trackFunnelStep(2, 'features_view', { page_type: 'product_info' });
    } else if (path.includes('pricing')) {
        trackFunnelStep(3, 'pricing_view', { page_type: 'pricing_info' });
    } else if (path.includes('use-case')) {
        trackFunnelStep(2, 'use_cases_view', { page_type: 'social_proof' });
    } else if (path.includes('blog')) {
        trackFunnelStep(2, 'blog_view', { page_type: 'content' });
    }
}

// Setup Event Tracking
function setupEventTracking() {
    console.log('Setting up enhanced event tracking...');
    
    // Track All CTA Clicks (Primary & Secondary)
    const ctaSelectors = [
        'a.btn-primary',
        'a.btn-outline', 
        'a[href*="cal.read.ai"]',
        'button.btn-primary',
        'button.btn-outline'
    ];
    
    ctaSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', function(e) {
                trackCTAClick(this);
            });
        });
    });

    // Track Navigation with Enhanced Context
    document.querySelectorAll('nav a, header a, .navigation a').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.textContent.trim();
            const destination = this.href;
            
            trackEvent('navigation', 'click', linkText, null, {
                'link_text': linkText,
                'destination_url': destination,
                'nav_location': this.closest('header') ? 'header' : 'navigation'
            });
        });
    });

    // Enhanced Scroll Depth Tracking with Time Context
    let scrollDepths = [25, 50, 75, 100];
    let scrolledDepths = new Set();
    let pageStartTime = Date.now();
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
        const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrolledDepths.has(depth)) {
                scrolledDepths.add(depth);
                trackEvent('engagement', 'scroll_depth', `${depth}%`, depth, {
                    'scroll_depth': depth,
                    'time_to_scroll': timeOnPage,
                    'page_path': window.location.pathname
                });
            }
        });
    });

    // Enhanced Time on Page Tracking with Engagement Scoring
    let timeIntervals = [10, 30, 60, 120, 300, 600]; // seconds - more granular tracking
    timeIntervals.forEach(interval => {
        setTimeout(() => {
            const engagementScore = calculateEngagementScore(interval);
            trackEvent('engagement', 'time_on_page', `${interval}s`, interval, {
                'time_seconds': interval,
                'engagement_score': engagementScore,
                'page_category': getContentGroup()
            });
        }, interval * 1000);
    });

    // Track External Links with Enhanced Attribution
    document.querySelectorAll('a[href^="http"]:not([href*="rightspend.ai"]), a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const destination = this.href;
            trackEvent('external_link', 'click', destination, null, {
                'destination_domain': new URL(destination).hostname,
                'link_text': this.textContent.trim(),
                'source_page': window.location.pathname
            });
        });
    });

    // Track Blog Engagement with Reading Behavior
    if (window.location.pathname.includes('/blog')) {
        setupBlogTracking();
    }

    // Track Form Interactions (if any forms exist)
    document.querySelectorAll('form, input, textarea').forEach(element => {
        element.addEventListener('focus', function(e) {
            trackEvent('form', 'field_focus', this.type || 'form', null, {
                'form_element': this.tagName.toLowerCase(),
                'field_type': this.type || 'unknown'
            });
        });
    });

    // Track Video Interactions (if any videos exist)
    document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').forEach(video => {
        video.addEventListener('play', function(e) {
            trackEvent('media', 'video_play', this.src || 'embedded_video');
        });
    });

    // Track Search Interactions (if search exists)
    document.querySelectorAll('input[type="search"], .search-input').forEach(searchInput => {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length > 2) {
                    trackEvent('search', 'query', this.value.substring(0, 50)); // Limit PII
                }
            }, 1000); // Debounce search tracking
        });
    });

    console.log('Enhanced event tracking setup complete');
}

// Calculate engagement score based on time and interactions
function calculateEngagementScore(timeSeconds) {
    let score = Math.min(timeSeconds / 10, 10); // Base score from time
    
    // Boost score for scroll depth
    const maxScrollDepth = Math.max(...Array.from(document.querySelectorAll('[data-scroll-depth]')).map(el => 
        parseInt(el.getAttribute('data-scroll-depth')) || 0
    ));
    if (maxScrollDepth > 50) score += 2;
    if (maxScrollDepth > 75) score += 3;
    
    return Math.round(score * 10) / 10; // Round to 1 decimal
}

// Enhanced Blog Tracking
function setupBlogTracking() {
    // Track blog article engagement
    document.querySelectorAll('article, .blog-post').forEach(article => {
        const title = article.querySelector('h1, h2, .title')?.textContent || 'Untitled';
        
        article.addEventListener('click', function(e) {
            trackEvent('blog', 'article_interaction', title, null, {
                'article_title': title,
                'interaction_type': 'click'
            });
        });
    });

    // Track reading progress for blog posts
    const articleContent = document.querySelector('article, .blog-content, .post-content');
    if (articleContent) {
        const readingProgressTracker = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = Math.round((entry.target.offsetTop / articleContent.scrollHeight) * 100);
                    if (progress % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                        trackEvent('blog', 'reading_progress', `${progress}%`, progress);
                    }
                }
            });
        });

        // Observe paragraphs for reading progress
        articleContent.querySelectorAll('p').forEach(paragraph => {
            readingProgressTracker.observe(paragraph);
        });
    }
}

// Function to initialize the chart
function initChart() {
    const ctx = document.getElementById('costGraph');
    if (ctx) {
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Before RightSpend', 'After RightSpend'],
                datasets: [
                    {
                        label: 'Reserved Instances',
                        data: [0, 125],
                        backgroundColor: 'rgb(59, 130, 246)',
                    },
                    {
                        label: 'On-Demand Costs',
                        data: [220, 25],
                        backgroundColor: 'rgb(251, 191, 36)',
                    }
                ],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Cloud Costs (USD)',
                        font: {
                            size: 16
                        }
                    },
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            title: {
                                display: true,
                                display: true,
                                text: 'Cost in USD',
                            },
                        },
                    },
                },
            },
        });
    } else {
        console.error('Could not find element with id "costGraph"');
    }
}

// Smart Conversion Optimization (Human-Only)
function initSmartConversion() {
    if (!isLLMCrawler()) {
        // Add subtle urgency to CTAs after user engagement
        setTimeout(() => {
            const ctaButtons = document.querySelectorAll('a[href*="cal.read.ai"]');
            ctaButtons.forEach(btn => {
                if (btn.textContent.includes('Schedule Free Demo')) {
                    btn.setAttribute('aria-label', 'Schedule Free Demo - Limited Availability');
                }
            });
        }, 30000); // After 30 seconds
        
        // Track high-engagement users
        let scrollDepth = 0;
        let timeOnPage = 0;
        
        window.addEventListener('scroll', () => {
            scrollDepth = Math.max(scrollDepth, 
                Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100));
        });
        
        setInterval(() => timeOnPage += 1, 1000);
        
        // Enhanced CTA tracking for engaged users
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.includes('cal.read.ai')) {
                if (window.gtag) {
                    gtag('event', 'schedule_demo_click', {
                        'cta_location': getCTALocation(e.target),
                        'scroll_depth': scrollDepth,
                        'time_on_page': timeOnPage,
                        'engagement_score': scrollDepth + (timeOnPage * 2)
                    });
                }
                console.log('🎯 CONVERSION: Demo scheduling click tracked from', getCTALocation(e.target));
            }
        });
    }
}

function getCTALocation(element) {
    if (element.closest('header')) return 'header';
    if (element.closest('.hero')) return 'hero';
    if (element.closest('footer')) return 'footer';
    return 'content';
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 RightSpend: Initializing LLM-friendly conversion optimization...');
    
    // Add schema for LLM crawlers
    addConversionSchema();
    
    // Initialize human-only features
    initSmartConversion();
    
    // Initialize analytics
    initGoogleAnalytics();
    
    console.log('✅ RightSpend: All systems initialized');
});
