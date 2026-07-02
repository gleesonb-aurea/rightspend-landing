/**
 * Shared lead-form submission helper.
 *
 * POSTs to the n8n "cloudfix-website-forms" webhook with the auth header it
 * requires (x-webhook-secret). The secret is shipped in client JS at the
 * owner's explicit instruction — anyone can read it; the webhook should be
 * treated as a public intake endpoint (rate-limit / de-dupe in n8n).
 *
 * Usage:
 *   import { submitLead } from '/scripts/submit-lead.js';        // if modules
 *   // or rely on the global:
 *   await submitLead({ payload, submitButton, busyText });
 */
(function (global) {
    'use strict';

    var WEBHOOK_URL = 'https://automate.billgleeson.com/webhook/cloudfix-website-forms';
    var WEBHOOK_SECRET_HEADER = 'x-webhook-secret';
    var WEBHOOK_SECRET = '!pamplemousse90';

    /**
     * Submit a lead payload to the n8n webhook and resolve on success.
     * Throws an Error on any non-2xx response or network failure.
     *
     * @param {Object} opts
     * @param {Object} opts.payload        JSON body to send (merged with meta).
     * @param {HTMLButtonElement} [opts.submitButton]  Button to disable/show busy state.
     * @param {string} [opts.busyText='Sending...']    Text while in flight.
     * @returns {Promise<Object>}  Resolves with the parsed response (or {ok:true}).
     */
    async function submitLead(opts) {
        opts = opts || {};
        var payload = Object.assign({
            timestamp: new Date().toISOString(),
            page_url: global.location.href,
            user_agent: navigator.userAgent
        }, opts.payload || {});

        var button = opts.submitButton;
        var originalText = button ? button.textContent : null;
        if (button) {
            button.disabled = true;
            button.textContent = opts.busyText || 'Sending...';
        }

        try {
            var response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Auth header required by the n8n webhook (else HTTP 403).
                    [WEBHOOK_SECRET_HEADER]: WEBHOOK_SECRET
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Webhook returned ' + response.status);
            }

            return response.json().catch(function () { return { ok: true }; });
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = originalText;
            }
        }
    }

    global.submitLead = submitLead;
})(window);
