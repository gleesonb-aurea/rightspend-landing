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
        
        // Initialize cost graph if element exists
        initCostGraph();
        
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
