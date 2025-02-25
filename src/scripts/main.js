// Initialize Google Analytics
function initGoogleAnalytics() {
    console.log('Initializing Google Analytics...');
    
    // Load GA script
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-9Z5L1G47QC';
    document.head.appendChild(gaScript);
    
    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9Z5L1G47QC');
    
    console.log('Google Analytics initialized');
}

// Track Events Helper
function trackEvent(category, action, label = null, value = null) {
    if (window.gtag) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
        console.log(`Tracked event: ${category} - ${action} - ${label}`);
    }
}

// Setup Event Tracking
function setupEventTracking() {
    console.log('Setting up event tracking...');
    
    // Track CTA Clicks
    document.querySelectorAll('a.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const destination = this.href;
            trackEvent('CTA', 'click', buttonText);
            
            // Track specific conversions
            if (buttonText.includes('Find Out More')) {
                trackEvent('Conversion', 'demo_request', destination);
            } else if (buttonText.includes('Calculate')) {
                trackEvent('Conversion', 'calculator_use', destination);
            }
        });
    });

    // Track Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            trackEvent('Navigation', 'click', this.textContent.trim());
        });
    });

    // Track Scroll Depth
    let scrollDepths = [25, 50, 75, 100];
    let scrolledDepths = new Set();
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrolledDepths.has(depth)) {
                scrolledDepths.add(depth);
                trackEvent('Scroll', 'depth_reached', `${depth}%`);
            }
        });
    });

    // Track Time on Page
    let timeIntervals = [30, 60, 180, 300]; // seconds
    timeIntervals.forEach(interval => {
        setTimeout(() => {
            trackEvent('Engagement', 'time_on_page', `${interval}s`);
        }, interval * 1000);
    });

    // Track External Links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            trackEvent('External Link', 'click', this.href);
        });
    });

    // Track Blog Engagement (if on blog page)
    if (window.location.pathname.includes('/blog')) {
        // Track article clicks
        document.querySelectorAll('article').forEach(article => {
            article.addEventListener('click', function(e) {
                const title = this.querySelector('h2, h3')?.textContent || 'Untitled';
                trackEvent('Blog', 'article_click', title);
            });
        });
    }

    console.log('Event tracking setup complete');
}

// Check if tracking is blocked
function isTrackingBlocked() {
    return window.doNotTrack === "1" || 
           navigator.doNotTrack === "1" || 
           navigator.doNotTrack === "yes";
}

// Initialize Apollo Tracking
function initApollo() {
    if (isTrackingBlocked()) {
        console.log('Tracking appears to be blocked by browser settings or extensions');
        return;
    }
    
    console.log('Initializing Apollo tracking...');
    var n = Math.random().toString(36).substring(7);
    var o = document.createElement("script");
    o.src = "https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=" + n;
    o.async = true;
    o.defer = true;
    o.onload = function() {
        console.log('Apollo script loaded successfully');
        window.trackingFunctions.onLoad({appId: "6602e615b2af9b0439deed0c"});
    };
    o.onerror = function(error) {
        console.log('Apollo script loading failed. This is normal if you have an ad blocker or privacy extension enabled.');
        // Optionally show a user-friendly message if needed
        // handleTrackingBlocked();
    };
    document.head.appendChild(o);
}

// Initialize RevenueBase (reb2b) Tracking
function initReb2b() {
    if (isTrackingBlocked()) {
        console.log('Tracking appears to be blocked by browser settings or extensions');
        return;
    }
    
    console.log('Initializing RevenueBase tracking...');
    var reb2b = window.reb2b = window.reb2b || [];
    if (reb2b.invoked) {
        console.log('RevenueBase already initialized');
        return;
    }
    reb2b.invoked = true;
    reb2b.methods = ["identify", "collect"];
    reb2b.factory = function(method) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            reb2b.push(args);
            return reb2b;
        };
    };
    for (var i = 0; i < reb2b.methods.length; i++) {
        var key = reb2b.methods[i];
        reb2b[key] = reb2b.factory(key);
    }
    reb2b.load = function(key) {
        console.log('Loading RevenueBase script...');
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://s3-us-west-2.amazonaws.com/b2bjsstore/b/" + key + "/LNKLDHP2G1OJ.js.gz";
        script.onload = function() {
            console.log('RevenueBase script loaded successfully');
        };
        script.onerror = function() {
            console.log('RevenueBase script loading failed. This is normal if you have an ad blocker or privacy extension enabled.');
            // Optionally show a user-friendly message if needed
            // handleTrackingBlocked();
        };
        var first = document.getElementsByTagName("script")[0];
        first.parentNode.insertBefore(script, first);
    };
    reb2b.SNIPPET_VERSION = "1.0.1";
    reb2b.load("LNKLDHP2G1OJ");
}

// Optional: Function to handle blocked tracking
/*
function handleTrackingBlocked() {
    // You could show a subtle notification to users about tracking being blocked
    // Only enable if you really need users to allow tracking
    console.log('Tracking is blocked - handling gracefully');
}
*/

// Initialize AOS and tracking scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing tracking scripts...');
    
    // Initialize all tracking scripts
    initGoogleAnalytics();
    initApollo();
    initReb2b();
    
    // Setup event tracking after analytics are loaded
    setTimeout(setupEventTracking, 1000);
    
    console.log('Main.js initialization complete');
});
