# 404 Error Analysis and Fixes
## RightSpend Website - Google Search Console

**Date:** January 26, 2026
**Total 404 URLs:** 14

---

## 📊 Category Breakdown

| Category | Count | Action Needed |
|----------|-------|---------------|
| Missing `.html` extension | 4 | Add redirects |
| Blog article wrong year | 1 | Add redirect |
| Short URLs (need `.html`) | 3 | Add redirects |
| Removed pages | 3 | Add redirects or 410 |
| Invalid URLs | 3 | Add redirects |

---

## 🔍 Detailed Analysis

### **Category 1: Missing `.html` Extension (4 URLs)**

These URLs exist but are being accessed without `.html`:

| 404 URL | Should Redirect To | Fix |
|---------|-------------------|-----|
| `/use-cases` | `/use-cases.html` | Add redirect |
| `/aws-cost-optimization` | `/aws-cost-optimization.html` | Add redirect |
| `/commitment-free-discounts` | `/commitment-free-discounts.html` | Add redirect |
| `/finops-aws-cost-optimization` | `/finops-aws-cost-optimization.html` | Add redirect |

**Issue:** Google is indexing the "clean" URLs but your site uses `.html` extensions.

**Solution Options:**
1. **Option A:** Add 301 redirects from clean URLs to `.html` URLs
2. **Option B:** Update sitemap to only include `.html` URLs
3. **Option C:** Change site to use clean URLs (remove `.html` from all links)

**Recommendation:** Option A (redirects) - keeps existing structure while fixing 404s.

---

### **Category 2: Blog Article Wrong Year (1 URL)**

| 404 URL | Should Redirect To | Fix |
|---------|-------------------|-----|
| `/blog/aws-reserved-instances-vs-savings-plans-2025` | `/blog/aws-reserved-instances-vs-savings-plans-2024.html` | Add redirect |

**Issue:** URL has `2025` but actual file is `2024`.

**Fix:** Add 301 redirect with correct year.

---

### **Category 3: Blog Index Without `.html` (2 URLs)**

| 404 URL | Should Redirect To | Fix |
|---------|-------------------|-----|
| `/blog/` | `/blog.html` | Add redirect |
| `/blog/finops-automation-2025-eliminate-manual-cost-management` | `/blog/finops-automation-2025-eliminate-manual-cost-management.html` | Add redirect |

---

### **Category 4: Removed Pages (3 URLs)**

These pages don't exist and may never have:

| 404 URL | Last Crawled | Action |
|---------|-------------|--------|
| `/about` | 2025-08-18 | Add redirect to homepage OR create page |
| `/contact.html` | 2025-08-18 | Add redirect to Calendly OR create page |
| `/mo` | 2025-11-22 | Add redirect to homepage (typo?) |

**Note:** `/mo` looks like a typo or incomplete URL.

---

### **Category 5: Invalid/Search URLs (2 URLs)**

| 404 URL | Last Crawled | Action |
|---------|-------------|--------|
| `/search?q=%7Bsearch_term_string%7D` | 2025-10-06 | Block in robots.txt (search URL) |
| `/aws-marketplace-rightspend-flex` | 2025-08-18 | Add redirect to `/aws-marketplace-rightspend-flex.html` |

---

## 🛠️ Implementation Plan

### **Phase 1: Add Redirects (Immediate)**

Create a redirect map file or configure server redirects:

```javascript
// Redirect map for all 404 URLs
const redirects = {
  // Missing .html extensions
  '/use-cases': '/use-cases.html',
  '/aws-cost-optimization': '/aws-cost-optimization.html',
  '/commitment-free-discounts': '/commitment-free-discounts.html',
  '/finops-aws-cost-optimization': '/finops-aws-cost-optimization.html',

  // Blog URLs
  '/blog/': '/blog.html',
  '/blog/aws-reserved-instances-vs-savings-plans-2025': '/blog/aws-reserved-instances-vs-savings-plans-2024.html',
  '/blog/finops-automation-2025-eliminate-manual-cost-management': '/blog/finops-automation-2025-eliminate-manual-cost-management.html',

  // Removed/missing pages
  '/about': '/about.html', // or redirect to homepage
  '/contact.html': 'https://cal.read.ai/bill-gleeson',
  '/mo': '/',

  // AWS Marketplace (missing .html)
  '/aws-marketplace-rightspend-flex': '/aws-marketplace-rightspend-flex.html'
};
```

### **Phase 2: Server Configuration Options**

**Option A: Nginx/Apache Redirects (if server control)**
```nginx
# Nginx example
rewrite ^/use-cases$ /use-cases.html permanent;
rewrite ^/aws-cost-optimization$ /aws-cost-optimization.html permanent;
# ... etc
```

**Option B: JavaScript Redirect (for SPA/routing)**
```javascript
// In your 404.html or main JS
if (window.location.pathname in redirects) {
  window.location.href = redirects[window.location.pathname];
}
```

**Option C: CloudFront/S3 Routing Rules**
```json
{
  "RoutingRules": [
    {
      "Condition": {
        "KeyPrefixEquals": "use-cases"
      },
      "Redirect": {
        "ReplaceKeyWith": "use-cases.html",
        "HttpRedirectCode": 301
      }
    }
  ]
}
```

### **Phase 3: Update Sitemap**

Ensure all URLs in `sitemap.xml` include `.html` extensions:

```xml
<!-- Current (WRONG): -->
<loc>https://rightspend.ai/use-cases</loc>

<!-- Should be (CORRECT): -->
<loc>https://rightspend.ai/use-cases.html</loc>
```

---

## 🎯 Priority Actions

### **High Priority (Do First):**
1. ✅ Add 301 redirects for 4 core pages (use-cases, aws-cost-optimization, etc.)
2. ✅ Fix blog article wrong year (2025 → 2024)
3. ✅ Add redirect for `/blog/` → `/blog.html`

### **Medium Priority:**
4. ✅ Add redirect for `/about` (create page or redirect to homepage)
5. ✅ Add redirect for `/contact.html` → Calendly
6. ✅ Add redirect for `/aws-marketplace-rightspend-flex` → `.html` version

### **Low Priority:**
7. ⚠️ Block `/search` URL in robots.txt (search URL, not content)
8. ⚠️ Redirect `/mo` → `/` (likely typo/crawler error)

---

## 📊 Expected Impact

**Fixing these 14 404 errors will:**
- ✅ Improve crawl budget (Google won't waste time on 404s)
- ✅ Preserve any link equity from backlinks
- ✅ Improve user experience (no broken links)
- ✅ Potentially improve rankings (404s hurt SEO)

---

## 🚀 Next Steps

**I can:**
1. Create a JavaScript redirect handler (if you don't have server control)
2. Update the 404.html page to handle redirects
3. Update sitemap.xml to ensure all URLs have `.html`
4. Create `/about.html` page (if needed)
5. Update any internal links that might be using clean URLs

**Let me know which approach you prefer and I'll implement it!**

---

Document Version: 1.0
Created: January 26, 2026
Status: Ready for implementation
