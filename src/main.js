// Cost Calculator
const calculateSavings = (currentSpend) => {
    // Conservative estimate of 35% savings
    return (currentSpend * 0.35).toFixed(2);
};

// Testimonials data
const testimonials = [
    {
        quote: "CloudFix saves us $27.8 million in our first 3 years, unlocking cash flow to invest in new high-growth projects.",
        author: "EdTech Company Executive",
        company: "$1B+ Revenue EdTech Company",
        source: "https://cloudfix.com/resources/edtech-company-saved-14-5-million-with-cloudfix-rightspend/"
    },
    {
        quote: "RightSpend helped us optimize our AWS costs while maintaining complete flexibility.",
        author: "Enterprise Architect",
        company: "Fortune 500 Company"
    },
    {
        quote: "The implementation was seamless, and we saw immediate savings.",
        author: "Cloud Operations Manager",
        company: "Global Technology Firm"
    }
];

// Alpine.js data and functions
document.addEventListener('alpine:init', () => {
    Alpine.data('calculator', () => ({
        monthlySpend: '',
        savings: 0,
        calculating: false,
        error: '',
        
        calculate() {
            if (!this.monthlySpend || isNaN(this.monthlySpend)) {
                this.error = 'Please enter a valid number';
                return;
            }
            
            this.error = '';
            this.calculating = true;
            
            // Simulate API call with setTimeout
            setTimeout(() => {
                this.savings = calculateSavings(parseFloat(this.monthlySpend));
                this.calculating = false;
            }, 600);
        }
    }));
    
    Alpine.data('testimonialSlider', () => ({
        testimonials,
        currentIndex: 0,
        
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        },
        
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        },
        
        init() {
            setInterval(() => this.next(), 5000); // Auto-advance every 5 seconds
        }
    }));
});
