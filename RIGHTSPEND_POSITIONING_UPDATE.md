# RightSpend Positioning Update - Fair Pricing Rebel

**Date:** April 2, 2026
**Positioning:** THE FAIR PRICING REBEL
**Status:** Proposed changes (not yet live)

---

## Overview

Updated both rightspend.ai and cloudfix.com RightSpend page with new fair pricing positioning that emphasizes only charging for net new savings, unlike competitors who take credit for existing savings.

---

## Core Messaging

### Hero Tagline
**"AWS Cost Optimization That Only Charges for Net New Savings"**

### Key Positioning Points
1. Only charge for **net new savings** we find
2. Don't take credit for existing Reserved Instances or Savings Plans
3. Risk-free trial
4. No lock-in
5. Fair pricing model vs industry standard

---

## Proposed Changes

### 1. rightspend.ai (Homepage)
**File:** `/home/ubuntu/rightspend-landing/src/pages/index.html`
**Repo:** gleesonb-aurea/rightspend-landing
**Branch:** fair-pricing-positioning
**PR:** https://github.com/gleesonb/rightspend-landing/pull/1

**Changes made:**
- Updated hero title to emphasize net new savings
- Updated hero description with fair pricing messaging
- Added new section: "Why RightSpend Pricing Is Fairer"
- Added problem/solution comparison cards
- Updated meta description and SEO tags
- Updated Open Graph and Twitter Card metadata
- Updated schema.org structured data

**New sections added:**
```html
<section class="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
  <h2>Why RightSpend Pricing Is Fairer</h2>

  <div class="bg-white p-8 rounded-lg border-l-4 border-red-400">
    <h3>⚠️ The Industry Problem</h3>
    <p>Other tools charge a percentage of your total AWS spend or total savings —
    including savings from Reserved Instances and Savings Plans you already had.</p>
  </div>

  <div class="bg-white p-8 rounded-lg border-l-4 border-green-500">
    <h3>✓ The RightSpend Way</h3>
    <p>We only charge for net new savings we find for you. If you already have
    RIs or Savings Plans saving you money, we don't take credit for those.</p>
  </div>
</section>
```

---

### 2. cloudfix.com RightSpend Page
**Page ID:** 14599
**URL:** https://cloudfix.com/rightspend/
**File:** `/tmp/rightspend-update.html`

**Changes prepared:**
- Updated page title: "RightSpend - Fair Pricing AWS Cost Optimization"
- Added hero section: "The Only AWS Cost Tool That Only Charges for Net New Savings"
- Added "The Fair Pricing Problem" section explaining industry issue
- Added "What Are Commitment Free Discounts (CFDs)?" section
- Added comparison table showing RightSpend vs competitors
- Added risk-free trial messaging throughout
- Updated all CTAs to emphasize "no obligation, no lock-in"

**Key content sections:**
1. Hero: Net new savings focus
2. The Fair Pricing Problem (competitors take credit for your existing savings)
3. What are CFDs? (Commitment Free Discounts explanation)
4. How CFDs Compare (table vs RIs, Savings Plans, Spot)
5. Risk-free trial messaging
6. FAQ section with fair pricing focus

---

## WordPress API Update Attempt

**Endpoint:** POST https://cloudfix.com/wp-json/wp/v2/pages/14599

**Status:** API call returned success but changes may not be reflected live
(response showed page modified 2026-04-02T12:44:47)

**Recommendation:** Manually verify and/or update via WordPress admin if needed

---

## Files for Reference

1. **rightspend.ai changes:**
   - Local: `/home/ubuntu/rightspend-landing/src/pages/index.html`
   - GitHub PR: https://github.com/gleesonb/rightspend-landing/pull/1

2. **cloudfix.com content:**
   - Prepared HTML: `/tmp/rightspend-update.html`
   - JSON payload: `/tmp/wp_update_final.json`

---

## Next Steps

1. **rightspend.ai:** Review and merge PR #1 when ready
2. **cloudfix.com:** Verify changes took effect, or manually update via WordPress admin
3. **QA:** Check both sites for fair pricing messaging consistency
4. **SEO:** Verify meta tags and schema markup are rendering correctly

---

## Commit Info

- Repository: marketing-skills
- Branch: main
- Commit message: "Document RightSpend fair pricing positioning changes"
