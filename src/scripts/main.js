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

// Initialize RevenueBase (reb2b) Tracking
function initReb2b() {
    var reb2b = window.reb2b = window.reb2b || [];
    if (reb2b.invoked) return;
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
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://s3-us-west-2.amazonaws.com/b2bjsstore/b/" + key + "/LNKLDHP2G1OJ.js.gz";
        var first = document.getElementsByTagName("script")[0];
        first.parentNode.insertBefore(script, first);
    };
    reb2b.SNIPPET_VERSION = "1.0.1";
    reb2b.load("LNKLDHP2G1OJ");
}

// Initialize AOS and tracking scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tracking scripts
    initApollo();
    initReb2b();
    
    // Any initialization code can go here
    console.log('Main.js loaded successfully');
    // TODO: Add accessibility features
});
