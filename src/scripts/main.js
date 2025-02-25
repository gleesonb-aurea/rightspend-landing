// Initialize Apollo Tracking
function initApollo() {
    var n = Math.random().toString(36).substring(7);
    var o = document.createElement("script");
    o.src = "https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=" + n;
    o.async = true;
    o.defer = true;
    o.onload = function() {
        window.trackingFunctions.onLoad({appId: "6602e615b2af9b0439deed0c"});
    };
    document.head.appendChild(o);
}

// Initialize AOS and Apollo
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Apollo tracking
    initApollo();
    
    // Any initialization code can go here
    console.log('Main.js loaded successfully');
    // TODO: Add accessibility features
});
