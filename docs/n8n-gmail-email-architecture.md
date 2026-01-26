# RightSpend Email Automation Architecture
## n8n + Gmail Implementation Guide

**Date:** January 26, 2026
**Status:** Design Phase
**Owner:** Bill Gleeson

---

## Executive Summary

This architecture implements a **zero-cost, scalable email automation system** using n8n workflows and Gmail. It replaces expensive ESPs (Email Service Providers) while maintaining professional deliverability and tracking capabilities.

**Why This Architecture?**
- ✅ Unlimited automation workflows (no Brevo-style automation limits)
- ✅ Unlimited subscribers (no per-contact fees)
- ✅ Full control over timing, segmentation, and personalization
- ✅ Professional Gmail-based sending (white-label domain ready)
- ✅ Built-in tracking via pixel tracking and link rewriting
- ✅ Self-hosted n8n instance (data sovereignty)

**Trade-offs:**
- ⚠️ Requires technical setup (one-time effort)
- ⚠️ Manual IP warmup needed for high volume (100K+/month)
- ⚠️ No drag-and-drop template editor (HTML templates required)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER FLOW                               │
└─────────────────────────────────────────────────────────────────┘

                      Lead Magnet Download Request
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │  Email Capture Form      │
                    │  (Name + Email)          │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │  n8n Webhook Trigger     │
                    │  POST /webhook/subscribe │
                    └──────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌─────────────────┐         ┌──────────────────┐
          │ Validate Email  │         │ Add to Google    │
          │ (Format + MX)   │         │ Sheets/Database  │
          └─────────────────┘         └──────────────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                    ┌──────────────────────────┐
                    │  Send Email 1 (Immediate) │
                    │  "Here's your download"   │
                    │  Via Gmail API            │
                    └──────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌─────────────────┐         ┌──────────────────┐
          │ Tracking Pixel  │         │ Rewritten Links  │
          │ (1x1 transparent│         │ (n8n redirect)   │
          │  GIF)           │         │                  │
          └─────────────────┘         └──────────────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                    ┌──────────────────────────┐
                    │  n8n Wait Node           │
                    │  (2 days)                │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │  Send Email 2            │
                    │  "Why I built this"      │
                    └──────────────────────────┘
                    ... (continues for 5-7 emails)
```

---

## Technical Components

### 1. n8n Instance Setup

**Hosting Options:**

| Option | Cost | Performance | Effort |
|--------|------|-------------|---------|
| **Self-hosted on VPS** (DigitalOcean, Linode) | $5-20/month | Good | Medium |
| **n8n Cloud** (managed) | $20+/month | Excellent | Low |
| **Docker on existing server** | $0 | Varies | Low |

**Recommended:** Self-hosted n8n on a $5-10/month VPS (DigitalOcean Droplet or Linode)

**Installation Commands:**
```bash
# Install Docker & Docker Compose
curl -ssl https://get.docker.com | sh
sudo apt-get install docker-compose

# Clone n8n
git clone https://github.com/n8n-io/n8n.git
cd n8n

# Run with Docker Compose
docker-compose up -d
```

**Configuration:**
- Set `WEBHOOK_URL` in environment variables
- Configure `N8N_BASIC_AUTH` for security
- Enable `EXECUTIONS_DATA_SAVE` for execution history
- Set `TIMEZONE` to your timezone

---

### 2. Gmail API Setup

**Step 1: Create Google Cloud Project**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: "rightspend-email-automation"
3. Enable Gmail API

**Step 2: Create OAuth Credentials**
1. Go to APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Application type: Web application
4. Add authorized redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
5. Download JSON credentials

**Step 3: Configure n8n Gmail Node**
1. In n8n, add "Gmail" node
2. Credential type: OAuth2
3. Upload the JSON credentials
4. Authorize the connection

**Important:**
- Use a dedicated Gmail account (e.g., `bill@rightspend.ai` if available)
- Enable 2-factor authentication
- Set up SPF/DKIM records for your sending domain
- Consider using Google Workspace for professional sending

---

### 3. n8n Workflow Architecture

#### **Workflow 1: Lead Magnet Delivery (Immediate)**

```
Trigger: Webhook (POST /webhook/lead-magnet)
  ↓
Function: Validate Email
  ├─ Check format (regex)
  ├─ Check MX records (optional)
  └─ Detect disposable emails
  ↓
Switch: Valid Email?
  ├─ NO → Send error response
  └─ YES → Continue
  ↓
Google Sheets: Add Subscriber
  ├─ Spreadsheet: "RightSpend Email List"
  ├─ Worksheet: "All Subscribers"
  └─ Columns: email, name, source, date, status, tags
  ↓
Gmail: Send Delivery Email
  ├─ To: {{email}}
  ├─ Subject: "Your AWS Cost Optimization Checklist"
  ├─ Body: HTML template with tracking pixel
  └─ Attachments: PDF checklist
  ↓
Respond to Webhook: Success
```

**Key Settings:**
- **Webhook URL:** `https://your-n8n-instance.com/webhook/lead-magnet`
- **Method:** POST
- **Response:** JSON `{ success: true, message: "Check your inbox!" }`

---

#### **Workflow 2: Welcome Email Sequence (Days 2, 4, 6, 8, 10)**

```
Trigger: Cron (Every 6 hours)
  ↓
Google Sheets: Find Subscribers Due for Email
  ├─ Filter: status = "active"
  ├─ Filter: last_email_date = 2/4/6/8/10 days ago
  └─ Filter: email_number < 5
  ↓
Loop: For Each Subscriber
  ↓
Switch: Which Email Number?
  ├─ Email 1 (Day 2) → Send "Why I built this"
  ├─ Email 2 (Day 4) → Send "Quick win strategy"
  ├─ Email 3 (Day 6) → Send "Case study: Ellucian"
  ├─ Email 4 (Day 8) → Send "CFD differentiator"
  └─ Email 5 (Day 10) → Send "Demo request"
  ↓
Gmail: Send Email
  ├─ Personalize: {{first_name}}
  ├─ Tracking pixel: Add to HTML
  ├─ Link rewriting: Add n8n redirect
  └─ Unsubscribe link: Required
  ↓
Google Sheets: Update Subscriber
  ├─ Increment: email_number
  └─ Set: last_email_date = today
  ↓
End Loop
```

---

#### **Workflow 3: Link Click Tracking**

```
Trigger: Webhook (GET /webhook/click/{{subscriber_id}}/{{link_id}})
  ↓
Google Sheets: Log Click
  ├─ Subscriber: {{subscriber_id}}
  ├─ Link: {{link_id}}
  ├─ Timestamp: now
  └─ IP address (from headers)
  ↓
Switch: Link Type?
  ├─ Lead magnet → Redirect to PDF
  ├─ Blog article → Redirect to URL
  └─ Calendly → Redirect to scheduling link
  ↓
Respond to Webhook: HTTP 302 Redirect
```

**Example Link Rewriting:**
```
Original: https://cal.read.ai/bill-gleeson
Rewritten: https://your-n8n.com/webhook/click/{{subscriber_id}}/calendly
```

---

#### **Workflow 4: Email Open Tracking**

```
Trigger: Webhook (GET /webhook/track-open/{{subscriber_id}}/{{email_id}})
  ↓
Google Sheets: Log Open
  ├─ Subscriber: {{subscriber_id}}
  ├─ Email: {{email_id}}
  ├─ Timestamp: now
  └─ User agent (from headers)
  ↓
Respond to Webhook: 1x1 transparent GIF
  ├─ Content-Type: image/gif
  └─ Binary: GIF89a (43 bytes)
```

**Tracking Pixel HTML:**
```html
<img src="https://your-n8n.com/webhook/track-open/{{subscriber_id}}/{{email_id}}" width="1" height="1" style="display:none;">
```

---

### 4. Email Templates (HTML)

**Template Structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject_line}}</title>
  <style>
    /* Email-safe CSS */
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .button { background: #1e40af; color: white; padding: 12px 24px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>{{subject_line}}</h1>
    <p>Hi {{first_name}},</p>
    <div class="content">{{email_body}}</div>
    <a href="https://your-n8n.com/webhook/click/{{subscriber_id}}/cta" class="button">CTA Button</a>
    <p style="font-size: 12px; color: #666;">
      <a href="https://your-n8n.com/webhook/unsubscribe/{{subscriber_id}}">Unsubscribe</a>
    </p>
    <img src="https://your-n8n.com/webhook/track-open/{{subscriber_id}}/{{email_id}}" width="1" height="1">
  </div>
</body>
</html>
```

---

## 5. Email Sequence: 7-Email Welcome Flow

### **Email 1: Delivery (Immediate)**

**Subject:** Your AWS Cost Optimization Checklist is here

**Preview:** Here's how to save 20-55% on EC2 starting today

```html
Hi {{first_name}},

Your AWS Cost Optimization Checklist is ready.

[Download the Checklist PDF]

This checklist walks you through the exact steps companies like Ellucian ($5M saved annually), Zaxbys ($12K/month), and BCG ($75K/month) used to cut their AWS costs dramatically.

**Quick start:**
1. Review your current EC2 spending
2. Check your RI/Savings Plans coverage
3. Identify your on-demand proportion
4. Apply the 3-year all-upfront rate to your on-demand

That's the core RightSpend methodology.

**Over the next 10 days, I'll share:**
- How CFDs beat traditional RIs and Savings Plans
- Real case studies from companies saving $50K+/month
- The hidden lock-in risk most companies ignore
- Why "flexibility" matters more than "highest discount"

**Quick question:** What's your biggest AWS cost challenge right now?

Hit reply and tell me. I read every response.

— Bill
RightSpend by CloudFix

P.S. If you want immediate results, schedule a free 15-minute assessment: [Schedule Now]
```

---

### **Email 2: Connection (Day 2)**

**Subject:** Why I built RightSpend (the $5M problem)

**Preview:** Most companies choose wrong and lose 15-20%

```html
Quick story:

Last year, I worked with Ellucian.

They were spending $50M annually on AWS ($25M on EC2).

Their problem? They were 100% on-demand, terrified of RI lock-in.

But they were also terrified of their $25M annual EC2 bill.

They felt stuck.

**The wrong solution:**
Traditional 3-year Savings Plans or Reserved Instances would save them money...

But only if their usage stayed EXACTLY the same for 3 years.

If usage dropped? They'd be locked in and losing money.
If usage skyrocketed? They'd be buying more RIs anyway.

**The RightSpend solution:**
Commitment Free Discounts (CFDs).

We applied 3-year all-upfront rates to their on-demand spend.

Result: **$5M saved in the first year.**

With zero lock-in. Zero commitment risk.

If their usage changed tomorrow? They'd adapt immediately.

That's what I built RightSpend to do.

Tomorrow: How Zaxbys went from 100% on-demand to $12K/month in savings.

— Bill

P.S. See how much YOU could save with our interactive calculator: [Calculate Your Savings]
```

---

### **Email 3: Case Study (Day 4)**

**Subject:** Zaxbys: $12K/month saved (was 100% on-demand)

**Preview:** They were paying full price for EC2. Here's what changed.

```html
Zaxbys came to us with a problem:

They were running 100% on AWS EC2 on-demand pricing.

No Reserved Instances. No Savings Plans.

They were leaving ~30% savings on the table every month.

**But they refused to buy RIs.**

Why? They'd tried it before. Usage fluctuated wildly. They ended up with unused RIs costing them money.

**The RightSpend approach:**

We analyzed their EC2 spend:
- Monthly EC2: ~$40K
- On-demand proportion: 100%
- Existing discounts: 0%

We applied our CFD methodology:
- 3-year all-upfront pricing on the on-demand portion
- Zero commitment or lock-in
- Instant savings, instant flexibility

**The result:**
**$12,000 saved per month.**
$144,000 annually.

And if their usage changed next month? No problem. No lock-in.

**This works for any company running EC2.**

Whether you're spending $10K/month or $500K/month.

The math is the same. The savings are real.

Want to see YOUR savings potential?

[Use the Interactive Calculator]

— Bill

P.S. Tomorrow: The $75K/month BCG case study.
```

---

### **Email 4: More Case Study (Day 6)**

**Subject:** BCG: $75K/month savings (the enterprise approach)

**Preview:** How a consulting giant optimized multi-account AWS

```html
Boston Consulting Group had a different challenge:

Multi-account complexity. Hundreds of EC2 instances. Different teams, different usage patterns.

Their EC2 spend: ~$250K/month.

They'd tried Savings Plans. But with varying usage across accounts, they either:
- Under-committed (lost money)
- Over-committed (wasted money)

**The RightSpend enterprise solution:**

We analyzed each account's EC2 usage:
- Overall EC2 spend: $250K/month
- Existing RI/SP coverage: 40%
- On-demand portion: $150K/month

We applied CFDs to the on-demand portion:
- 3-year all-upfront rates on uncovered instances
- Account-by-account optimization
- Zero cross-account lock-in

**The result:**
**$75,000 saved per month.**
$900,000 annually.

With the flexibility to:
- Scale up without new commitments
- Scale down without wasted spend
- Optimize each account independently

**This is the future of AWS cost optimization.**

No lock-in. No wasted commitments. Just savings.

— Bill

P.S. Curious what YOU could save? [Calculate Your Savings in 60 Seconds]
```

---

### **Email 5: The Differentiator (Day 8)**

**Subject:** You can save 20% with RIs. But at what cost?

**Preview:** The hidden risk nobody talks about

```html
Here's the AWS discount matrix:

| Option | Discount | Lock-in | Flexibility |
|--------|----------|---------|-------------|
| On-Demand | 0% | None | 100% |
| Savings Plans (1-year) | ~30% | 1 year | Low |
| Savings Plans (3-year) | ~50% | 3 years | Zero |
| Reserved Instances | ~50-70% | 3 years | Zero |
| **RightSpend CFDs** | **~40-55%** | **None** | **100%** |

**The problem with traditional discounts:**

You're trading flexibility for savings.

And in a world where:
- Usage fluctuates seasonally
- Companies scale up and down
- Projects start and stop

Lock-in is RISKY.

**The RightSpend difference:**

We give you 3-year all-upfront pricing...
- WITHOUT the 3-year commitment
- WITHOUT the usage risk
- WITH full flexibility

**Real example:**

Karma Automove saves $10K/month with RightSpend.

If they'd bought 3-year RIs? They'd be locked in.
If their usage dropped? They'd be losing money.

With CFDs? They save $10K/month regardless.

**The question isn't "can I save with RIs?"**

It's "do I want to be locked in for 3 years to save that money?"

With RightSpend: You don't have to choose.

— Bill

P.S. See your exact savings potential with our calculator: [Calculate Now]
```

---

### **Email 6: Social Proof (Day 10)**

**Subject:** Real results from real companies (no fluff)

**Preview:** Nu Skin: $15K/month. Karma: $10K/month. And more.

```html
Let me prove this works.

**Real companies. Real savings.**

| Company | AWS Spend | Monthly Savings | Annual Savings |
|---------|-----------|-----------------|----------------|
| Ellucian | $50M/year | $416K/month | **$5M/year** |
| BCG | $3M/year | $75K/month | **$900K/year** |
| Zaxbys | $480K/year | $12K/month | **$144K/year** |
| Karma Automove | $200K/year | $10K/month | **$120K/year** |
| Nu Skin | $180K/year | $15K/month | **$180K/year** |

**What they all have in common:**

1. They were overpaying for AWS EC2
2. They were terrified of RI lock-in
3. They found RightSpend
4. They're now saving 20-55% with zero commitment

**The methodology is simple:**

1. Analyze your EC2 spend
2. Identify your on-demand proportion
3. Apply 3-year all-upfront pricing
4. Save 20-55% with no lock-in

**This isn't magic.**

It's math.
It's automation.
It's a better discount structure.

And it works for companies spending $10K/month or $1M/month.

**Tomorrow: I'll show you how to get started.**

— Bill

P.S. Ready to see your savings? [Calculate Your Potential Savings]
```

---

### **Email 7: The Ask (Day 12)**

**Subject:** Ready to stop overpaying for AWS?

**Preview:** Let's see how much YOU can save (15 minutes, no commitment)

```html
Over the past 12 days, you've learned:

- How companies like Ellucian saved $5M annually
- Why Zaxbys switched from 100% on-demand to CFDs
- How BCG saves $75K/month with multi-account optimization
- The lock-in risk of traditional RIs and Savings Plans
- Real results from 5+ companies saving $10K-$416K/month

**Now it's your turn.**

Let's see how much YOU could save.

**Option 1: Use the Free Calculator**

[Calculate Your Savings in 60 Seconds]

See your potential savings instantly. No commitment, no contact required.

**Option 2: Schedule a Free 15-Minute Assessment**

I'll review your AWS spend and give you a custom savings estimate.

[Schedule Your Free Assessment]

We'll look at:
- Your current EC2 spending
- Your existing RI/SP coverage
- Your on-demand proportion
- Your specific savings potential with CFDs

**No pressure. No obligation.**

Just data and a clear savings estimate.

— Bill
RightSpend by CloudFix

P.S. Even if you're not ready to talk, use the calculator to see your potential: [Calculate Now]
```

---

## 6. Database Schema (Google Sheets)

### **Sheet 1: Subscribers**

| Column | Type | Description |
|--------|------|-------------|
| subscriber_id | String | Unique UUID |
| email | String | Primary email address |
| first_name | String | First name |
| last_name | String | Last name (optional) |
| source | String | "checklist", "calculator", "blog" |
| status | String | "active", "unsubscribed", "bounced" |
| email_number | Number | Current email in sequence (0-5) |
| last_email_date | Date | Last email sent date |
| subscribed_date | Date | Original opt-in date |
| tags | String | Comma-separated (e.g., "enterprise,high-value") |
| opens | Number | Total tracked opens |
| clicks | Number | Total tracked clicks |
| last_open_date | Date | Most recent open |
| last_click_date | Date | Most recent click |

### **Sheet 2: Email Log**

| Column | Type | Description |
|--------|------|-------------|
| log_id | String | Unique UUID |
| subscriber_id | String | Foreign key to Subscribers |
| email_number | Number | Which email (1-5) |
| sent_date | Date | When sent |
| opened | Boolean | Tracked open? |
| open_count | Number | Times opened |
| clicked | Boolean | Tracked click? |
| click_count | Number | Times clicked |

### **Sheet 3: Link Clicks**

| Column | Type | Description |
|--------|------|-------------|
| click_id | String | Unique UUID |
| subscriber_id | String | Foreign key to Subscribers |
| link_type | String | "cta", "calculator", "calendly", "unsubscribe" |
| target_url | String | Final destination |
| click_date | Date | When clicked |
| ip_address | String | Optional IP for analytics |

---

## 7. HTML Email Capture Forms

### **Form 1: Lead Magnet Download (Homepage Hero)**

```html
<form id="leadMagnetForm" class="flex flex-col sm:flex-row gap-4">
  <input
    type="email"
    name="email"
    placeholder="Enter your work email"
    required
    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  >
  <input
    type="text"
    name="name"
    placeholder="First name"
    class="w-full sm:w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  >
  <button
    type="submit"
    class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200"
  >
    Get the Checklist →
  </button>
  <p class="text-sm text-gray-500 mt-2">
    No spam. Unsubscribe anytime.
  </p>
</form>

<script>
document.getElementById('leadMagnetForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    email: formData.get('email'),
    name: formData.get('name'),
    source: 'checklist-homepage'
  };

  try {
    const response = await fetch('https://your-n8n-instance.com/webhook/lead-magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      // Show success message
      alert('Check your inbox for the checklist!');
      e.target.reset();
    } else {
      alert('Something went wrong. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
});
</script>
```

### **Form 2: Inline Blog Subscribe**

```html
<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
  <h3 class="text-lg font-bold text-gray-900 mb-2">Get AWS Cost Optimization Tips</h3>
  <p class="text-sm text-gray-600 mb-4">
    Join 1,000+ engineers and get weekly AWS savings strategies (no fluff).
  </p>
  <form id="blogSubscribeForm">
    <input
      type="email"
      name="email"
      placeholder="your@email.com"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-2"
    >
    <button
      type="submit"
      class="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
    >
      Subscribe to AWS Savings Tips
    </button>
  </form>
</div>

<script>
// Similar JavaScript as above, different source: 'blog-subscribe'
</script>
```

### **Form 3: Calculator Results Email Capture**

```html
<div id="emailCapture" class="hidden">
  <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
    <h3 class="text-xl font-bold text-green-800 mb-2">
      Get Your Custom Savings Report
    </h3>
    <p class="text-sm text-green-700 mb-4">
      We'll email you a detailed breakdown of your savings potential with RightSpend CFDs.
    </p>
    <form id="calculatorEmailForm">
      <input type="hidden" name="savings_estimate" id="savingsEstimate">
      <input type="hidden" name="monthly_spend" id="monthlySpend">
      <input
        type="email"
        name="email"
        placeholder="Enter your work email"
        required
        class="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
      >
      <button
        type="submit"
        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
      >
        Email My Savings Report
      </button>
    </form>
  </div>
</div>

<script>
// After calculation completes, show email capture form
function showEmailCapture(savings, monthlySpend) {
  document.getElementById('savingsEstimate').value = savings;
  document.getElementById('monthlySpend').value = monthlySpend;
  document.getElementById('emailCapture').classList.remove('hidden');
}
</script>
```

---

## 8. Implementation Checklist

### **Phase 1: Setup (Week 1)**

- [ ] Set up n8n instance (self-hosted or cloud)
- [ ] Create Google Cloud project
- [ ] Enable Gmail API
- [ ] Create OAuth2 credentials
- [ ] Configure n8n Gmail node
- [ ] Create Google Sheets for database
- [ ] Set up SPF/DKIM records for sending domain
- [ ] Test email sending (send test email to yourself)

### **Phase 2: Workflows (Week 1-2)**

- [ ] Build "Lead Magnet Delivery" workflow
- [ ] Build "Welcome Sequence" workflow (5 emails)
- [ ] Build "Link Click Tracking" workflow
- [ ] Build "Email Open Tracking" workflow
- [ ] Test all workflows end-to-end
- [ ] Set up error handling and retry logic

### **Phase 3: Integration (Week 2)**

- [ ] Add email capture form to homepage
- [ ] Add email capture to calculator page
- [ ] Add inline subscribe forms to blog articles
- [ ] Add footer newsletter signup
- [ ] Test form submissions across all pages
- [ ] Set up GA4 events for email signups

### **Phase 4: Launch (Week 2)**

- [ ] Send test sequence to yourself
- [ ] Verify all links work
- [ ] Verify tracking pixels fire
- [ ] Verify unsubscribe functionality
- [ ] Check spam score (use Mail-Tester.com)
- [ ] Launch live

---

## 9. Monitoring & Analytics

### **Key Metrics to Track**

| Metric | Definition | Target |
|--------|------------|--------|
| Signup Rate | Email captures / page visitors | 5-10% |
| Delivery Rate | Emails delivered / emails sent | >95% |
| Open Rate | Unique opens / emails delivered | 25-35% |
| Click Rate | Unique clicks / emails delivered | 3-5% |
| Unsubscribe Rate | Unsubscribes / emails delivered | <1% |
| Conversion Rate | Demo bookings / email signups | 2-5% |

### **Google Sheets Dashboard**

Create a "Dashboard" sheet with formulas:

```excel
=COUNTA(Subscribers!A:A) - 1  // Total subscribers
=COUNTIF(Subscribers!H:H, "active")  // Active subscribers
=AVERAGE(Subscribers!I:I)  // Avg email opens
=COUNTA(Email_Log!A:A) - 1  // Total emails sent
```

---

## 10. Troubleshooting

### **Issue: Emails going to spam**

**Solutions:**
1. Check SPF/DKIM records (use MXToolbox)
2. Reduce email frequency
3. Improve email content (less salesy)
4. Warm up IP gradually (start with 50/day, increase 20% weekly)
5. Check spam score at Mail-Tester.com

### **Issue: Low open rates (<20%)**

**Solutions:**
1. Improve subject lines (add curiosity, numbers, specificity)
2. Clean list (remove inactive subscribers)
3. A/B test send times
4. Verify sender name is recognizable

### **Issue: n8n workflow fails**

**Solutions:**
1. Check n8n execution logs
2. Verify API credentials are valid
3. Test individual nodes
4. Add error handling nodes (on error → log to Sheets)
5. Set up n8n error notifications (email/Webhook)

---

## 11. Cost Comparison

### **Brevo (Current) vs n8n + Gmail**

| Factor | Brevo | n8n + Gmail |
|--------|-------|-------------|
| **Monthly Cost (1K subs)** | $25/month | $0-10/month |
| **Monthly Cost (10K subs)** | $155/month | $0-10/month |
| **Monthly Cost (100K subs)** | $715/month | $0-20/month |
| **Automation Limits** | 3K active contacts | Unlimited |
| **Email Sending** | Included (300/day free) | Gmail limits (500/day free, Workspace unlimited) |
| **Setup Effort** | Low | Medium (one-time) |
| **Maintenance** | Ongoing subscription | Server maintenance |
| **Data Ownership** | Third-party | Full control |

**Breakeven Analysis:**
- At 1K subscribers: n8n saves ~$180/year
- At 10K subscribers: n8n saves ~$1,740/year
- At 100K subscribers: n8n saves ~$8,340/year

**ROI:** If you spend 10 hours setting up n8n, and save $1,740/year in the first year, that's **$174/hour** for your time.

---

## 12. Next Steps

1. **Review this architecture** - Does it align with your goals?
2. **Choose hosting** - Self-hosted n8n or n8n Cloud?
3. **Set up Gmail API** - Create Google Cloud project
4. **Install n8n** - Follow installation commands
5. **Build first workflow** - Start with "Lead Magnet Delivery"
6. **Test thoroughly** - Send test emails to yourself
7. **Launch** - Add forms to website and go live

---

## Questions?

If you have questions about this architecture, reach out:

**Bill Gleeson**
- Email: bill@rightspend.ai
- Calendly: https://cal.read.ai/bill-gleeson

---

**Document Version:** 1.0
**Last Updated:** January 26, 2026
**Status:** Ready for Implementation
