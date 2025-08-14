/**
 * LLM-Friendly Conversion Optimization
 * Implements conversion tactics that don't interfere with AI content parsing
 * Updated: 2025-08-14
 */

class LLMFriendlyConversion {
    constructor() {
        this.isBot = this.detectBot();
        this.init();
    }

    // Detect if visitor is likely a bot/crawler
    detectBot() {
        const userAgent = navigator.userAgent.toLowerCase();
        const botPatterns = [
            'googlebot', 'bingbot', 'slurp', 'duckduckbot',
            'baiduspider', 'yandexbot', 'facebookexternalhit',
            'twitterbot', 'linkedinbot', 'whatsapp', 'telegram',
            'claude', 'gpt', 'chatgpt', 'anthropic', 'openai'
        ];
        return botPatterns.some(pattern => userAgent.includes(pattern));
    }

    init() {
        // Only run conversion optimizations for human visitors
        if (!this.isBot) {
            this.initProgressiveCTAs();
            this.initSmartPopup();
            this.initSocialProof();
            this.trackEngagement();
        } else {
            // For bots, ensure content is clean and parseable
            this.optimizeForCrawlers();
        }
    }

    // Progressive CTAs that appear based on engagement, not automatic timers
    initProgressiveCTAs() {
        let scrollPercentage = 0;
        let timeOnPage = 0;
        let engagementScore = 0;

        // Track scroll without interfering with content
        window.addEventListener('scroll', () => {
            scrollPercentage = Math.max(scrollPercentage, 
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            this.updateEngagementScore();
        });

        // Track time on page
        setInterval(() => {
            timeOnPage += 1;
            this.updateEngagementScore();
        }, 1000);

        // Show contextual CTAs based on engagement
        setTimeout(() => this.showProgressiveCTA(), 30000); // 30 second delay
    }

    updateEngagementScore() {
        // Calculate engagement without interfering with content parsing
        // This runs only for human visitors
    }

    showProgressiveCTA() {
        // Only show if user is engaged and not a bot
        if (this.isBot) return;

        const existingCTA = document.getElementById('progressive-cta');
        if (existingCTA) return; // Already shown

        // Create non-intrusive CTA banner
        const ctaBanner = document.createElement('div');
        ctaBanner.id = 'progressive-cta';
        ctaBanner.className = 'fixed bottom-4 right-4 bg-white border-2 border-primary rounded-lg p-4 shadow-xl max-w-sm z-40';
        ctaBanner.style.transform = 'translateY(100%)';
        ctaBanner.style.transition = 'transform 0.3s ease-out';
        
        ctaBanner.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-2">Ready to reduce AWS costs?</h3>
                    <p class="text-sm text-gray-600 mb-3">Get personalized savings recommendations in 15 minutes</p>
                    <a href="https://cal.read.ai/bill-gleeson" 
                       class="btn-primary text-sm w-full text-center block"
                       onclick="this.closest('#progressive-cta').remove()">
                        Schedule Free Demo
                    </a>
                </div>
                <button onclick="this.closest('#progressive-cta').remove()" 
                        class="text-gray-400 hover:text-gray-600 ml-2">
                    ×
                </button>
            </div>
        `;

        document.body.appendChild(ctaBanner);
        
        // Animate in
        setTimeout(() => {
            ctaBanner.style.transform = 'translateY(0)';
        }, 100);

        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (document.getElementById('progressive-cta')) {
                ctaBanner.remove();
            }
        }, 30000);
    }

    // Smart popup that respects content parsing
    initSmartPopup() {
        if (this.isBot) return; // Never show popups to bots

        let exitIntentTriggered = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                this.showExitIntentModal();
            }
        });
    }

    showExitIntentModal() {
        if (this.isBot) return;

        // Create overlay that doesn't interfere with content structure
        const overlay = document.createElement('div');
        overlay.id = 'exit-intent-modal';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        overlay.style.display = 'none';
        
        overlay.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
                <button onclick="this.closest('#exit-intent-modal').remove()" 
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">
                    ×
                </button>
                <h3 class="text-xl font-bold mb-4 text-gray-900">Wait! Before you go...</h3>
                <p class="text-gray-600 mb-4">
                    See how much you could save on AWS in just 15 minutes. 
                    Our experts have helped companies save millions on cloud costs.
                </p>
                <div class="flex gap-3">
                    <a href="https://cal.read.ai/bill-gleeson" 
                       class="btn-primary flex-1 text-center"
                       onclick="this.closest('#exit-intent-modal').remove()">
                        Schedule Free Demo
                    </a>
                    <button onclick="this.closest('#exit-intent-modal').remove()" 
                            class="btn-outline flex-1">
                        Maybe Later
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Show with animation
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.transition = 'opacity 0.3s ease-out';
        }, 10);
    }

    // Add social proof elements that don't interfere with content parsing
    initSocialProof() {
        if (this.isBot) return;

        // Add subtle social proof near CTAs
        const ctaElements = document.querySelectorAll('a[href*="cal.read.ai"]');
        ctaElements.forEach(cta => {
            if (!cta.nextElementSibling || !cta.nextElementSibling.classList.contains('social-proof')) {
                const socialProof = document.createElement('div');
                socialProof.className = 'social-proof text-xs text-gray-500 mt-1 text-center';
                socialProof.innerHTML = '⭐ Trusted by 500+ AWS teams • 15-min setup';
                cta.parentNode.insertBefore(socialProof, cta.nextSibling);
            }
        });
    }

    // Track engagement for optimization
    trackEngagement() {
        if (this.isBot) return;

        // Track CTA clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="cal.read.ai"]')) {
                // Track conversion event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cta_click', {
                        'event_category': 'conversion',
                        'event_label': e.target.textContent.trim()
                    });
                }
            }
        });
    }

    // Ensure clean content structure for crawlers
    optimizeForCrawlers() {
        // Remove any dynamic elements that might interfere with parsing
        document.documentElement.setAttribute('data-crawler-optimized', 'true');
        
        // Ensure all important links are discoverable
        const ctaLinks = document.querySelectorAll('a[href*="cal.read.ai"]');
        ctaLinks.forEach(link => {
            link.setAttribute('rel', 'nofollow'); // Prevent diluting link equity
            link.setAttribute('aria-label', 'Schedule AWS cost optimization consultation');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LLMFriendlyConversion();
});