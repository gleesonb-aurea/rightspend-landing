// Main JavaScript file for RightSpend website

// Initialize Alpine.js components
document.addEventListener('alpine:init', () => {
    // Calculator Component
    Alpine.data('calculator', () => ({
        monthlySpend: '',
        coverageType: 'none',
        calculating: false,
        savings: 0,
        savingsRate: 35,
        error: '',
        chart: null,

        setCoverageType(type) {
            this.coverageType = type;
            if (type === 'none') this.savingsRate = 35;
            if (type === 'savings-plan') this.savingsRate = 25;
            if (type === 'reserved') this.savingsRate = 20;
        },

        formatNumber(num) {
            return new Intl.NumberFormat().format(Math.round(num));
        },

        async calculate() {
            this.error = '';
            
            if (!this.monthlySpend || this.monthlySpend <= 0) {
                this.error = 'Please enter a valid monthly spend amount';
                return;
            }

            this.calculating = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.savings = this.monthlySpend * (this.savingsRate / 100);
            this.calculating = false;

            // Create chart after calculation
            this.$nextTick(() => {
                this.createChart();
            });
        },

        createChart() {
            if (this.chart) {
                this.chart.destroy();
            }

            const ctx = this.$refs.savingsChart.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Current Cost', 'With RightSpend'],
                    datasets: [{
                        data: [
                            this.monthlySpend * 12,
                            (this.monthlySpend * 12) - (this.savings * 12)
                        ],
                        backgroundColor: ['#4A69B1', '#7C3AED'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + new Intl.NumberFormat().format(value);
                                }
                            }
                        }
                    }
                }
            });
        }
    }));

    // Testimonials Component
    Alpine.data('testimonialSlider', () => ({
        currentIndex: 0,
        testimonials: [
            {
                quote: "RightSpend has transformed how we manage our AWS costs. The flexibility and automated optimization have helped us achieve significant savings without any long-term commitments.",
                author: "Sarah Chen",
                title: "Cloud Infrastructure Manager",
                company: "TechCorp Solutions",
                avatar: "/assets/testimonials/avatar-1.jpg"
            },
            {
                quote: "The ability to optimize our AWS spend while maintaining complete flexibility has been game-changing. RightSpend's automated approach takes the guesswork out of cost optimization.",
                author: "Michael Rodriguez",
                title: "Director of Cloud Operations",
                company: "DataFlow Systems",
                avatar: "/assets/testimonials/avatar-2.jpg"
            },
            {
                quote: "We've seen a 45% reduction in our AWS costs since implementing RightSpend. The best part is the zero-risk approach - we only pay for actual savings achieved.",
                author: "Emily Watson",
                title: "VP of Engineering",
                company: "CloudScale Inc",
                avatar: "/assets/testimonials/avatar-3.jpg"
            }
        ],

        prev() {
            this.currentIndex = this.currentIndex === 0 
                ? this.testimonials.length - 1 
                : this.currentIndex - 1;
        },

        next() {
            this.currentIndex = this.currentIndex === this.testimonials.length - 1 
                ? 0 
                : this.currentIndex + 1;
        },

        init() {
            // Auto-advance every 5 seconds
            setInterval(() => {
                if (!document.hidden) {
                    this.next();
                }
            }, 5000);
        }
    }));
});

// Performance optimization utilities
const PerformanceUtils = {
    // WebP support detection
    supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    },

    // Lazy loading implementation
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            });
        }
    },

    // Critical CSS inlining (placeholder for build process)
    loadNonCriticalCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/non-critical.css';
        link.media = 'print';
        link.onload = function() {
            this.media = 'all';
        };
        document.head.appendChild(link);
    },

    // Preload critical resources
    preloadCriticalResources() {
        // Preload critical fonts
        const fontPreloads = [
            '/fonts/inter-var.woff2'
        ];

        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Preload hero image
        const heroImageWebP = '/assets/images/hero-illustration.webp';
        const heroImageFallback = '/assets/images/hero-illustration.svg';
        
        this.supportsWebP().then(supportsWebP => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = supportsWebP ? heroImageWebP : heroImageFallback;
            link.as = 'image';
            document.head.appendChild(link);
        });
    },

    // Optimize third-party scripts
    loadThirdPartyScripts() {
        // Defer non-critical third-party scripts
        const scripts = [
            'https://unpkg.com/aos@2.3.1/dist/aos.js'
        ];

        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            document.head.appendChild(script);
        });
    }
};

// Initialize global functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance optimizations
    PerformanceUtils.initLazyLoading();
    PerformanceUtils.preloadCriticalResources();

    // Initialize AOS with performance considerations
    if (window.AOS) {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 // Disable animations on mobile for better performance
        });
    }

    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Performance monitoring
    if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({entryTypes: ['largest-contentful-paint']});

        // Monitor Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                }
            }
        }).observe({entryTypes: ['layout-shift']});
    }
});
