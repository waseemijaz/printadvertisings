(function () {
    'use strict';
    if (document.getElementById('pa-quote-dialog')) return;

    var categories = [
        'Business Stationery', 'Marketing Print', 'Apparel & Textiles', 'Corporate Gifts',
        'Calendars & Diaries', 'Drinkware', 'Express Print'
    ];
    var products = [
        'Business Cards', 'Letterheads', 'Flyers & Leaflets', 'Express Business Cards',
        'Custom T-Shirt Printing', 'Corporate Uniforms', 'Custom Notebooks', 'Custom Mugs',
        'Water Bottles', 'Gift Boxes', 'Outdoor Banners', 'Promotional Displays'
    ];
    var categoryOptions = categories.map(function (name) { return '<option>' + name + '</option>'; }).join('');
    var productOptions = products.map(function (name) { return '<option>' + name + '</option>'; }).join('');
    var dialog = document.createElement('div');
    dialog.id = 'pa-quote-dialog';
    dialog.className = 'pa-quote-backdrop';
    dialog.hidden = true;
    dialog.innerHTML = '<section class="pa-quote-dialog" role="dialog" aria-modal="true" aria-labelledby="pa-quote-title" tabindex="-1">' +
        '<button type="button" class="pa-quote-close" aria-label="Close quote form">×</button>' +
        '<div class="pa-quote-dialog-heading"><span>Print Advertising Dubai</span><h2 id="pa-quote-title">Request a Quote</h2><p>Tell us what you need and our print team will be in touch.</p></div>' +
        '<form action="/api/leads.php" method="post" class="pa-quote-form" novalidate>' +
        '<input type="hidden" name="csrf_token" value=""><input type="hidden" name="lead_type" value="quote_request"><input type="hidden" name="category" value="">' +
        '<div class="pa-quote-fields">' +
        '<label class="pa-quote-field" for="pa-quote-name"><span>Name <b>*</b></span><input id="pa-quote-name" name="name" type="text" autocomplete="name" maxlength="120" required></label>' +
        '<label class="pa-quote-field" for="pa-quote-phone"><span>WhatsApp / Phone <b>*</b></span><input id="pa-quote-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" required></label>' +
        '<label class="pa-quote-field" for="pa-quote-product"><span>What do you need printed? <small>Optional</small></span><select id="pa-quote-product" class="pa-native-select" name="product"><option value="">Choose a category or product</option><optgroup label="Categories">' + categoryOptions + '</optgroup><optgroup label="Popular products">' + productOptions + '</optgroup></select></label>' +
        '<label class="pa-quote-field" for="pa-quote-quantity"><span>Approximate quantity <small>Optional</small></span><input id="pa-quote-quantity" name="quantity" type="number" inputmode="numeric" min="1" max="1000000000" step="1" placeholder="e.g. 500"></label>' +
        '<label class="pa-quote-field pa-quote-field--wide" for="pa-quote-email"><span>Email <small>Optional</small></span><input id="pa-quote-email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254"></label>' +
        '<label class="pa-quote-field pa-quote-field--wide" for="pa-quote-message"><span>Additional requirements <small>Optional</small></span><textarea id="pa-quote-message" name="message" rows="3" maxlength="2000" placeholder="Anything else we should know?"></textarea></label>' +
        '</div><div class="pa-quote-honeypot" aria-hidden="true"><label for="pa-quote-website">Leave this field empty</label><input id="pa-quote-website" name="website_url" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<p class="pa-quote-privacy">We\'ll use your details only to respond to your enquiry.</p><div class="pa-quote-actions"><button type="submit">Request a Quote</button><a class="pa-quote-whatsapp" target="_blank" rel="noopener">Chat on WhatsApp</a></div>' +
        '<p class="pa-quote-status" aria-live="polite" role="status" tabindex="-1"></p><div class="pa-quote-success" hidden tabindex="-1" aria-live="polite"><strong>Thank you — your enquiry has been received.</strong><span>Our print team will get back to you shortly.</span></div></form></section>';
    document.body.appendChild(dialog);

    var form = dialog.querySelector('form');
    var phoneInput = form.elements.phone;
    var panel = dialog.querySelector('.pa-quote-dialog');
    var closeButton = dialog.querySelector('.pa-quote-close');
    var returnFocus = null;
    var previousOverflow = '';
    var tokenPromise = null;

    function phoneValidationMessage(value) {
        value = value.trim();
        if (!value) return '';
        if (value.length < 7 || value.length > 30) return 'Enter a phone number between 7 and 30 characters.';
        var digits = 0;
        for (var i = 0; i < value.length; i++) {
            var character = value.charAt(i);
            if (character >= '0' && character <= '9') digits++;
            else if ('+(). -'.indexOf(character) === -1) return 'Use digits and standard phone punctuation only.';
        }
        if (digits < 7 || digits > 20) return 'Enter a phone number with 7 to 20 digits.';
        return '';
    }

    phoneInput.addEventListener('input', function () {
        phoneInput.setCustomValidity(phoneValidationMessage(phoneInput.value));
    });

    function requestToken(targetForm) {
        if (!tokenPromise) tokenPromise = fetch('/api/leads.php?action=token', { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } })
            .then(function (response) { if (!response.ok) throw new Error('token'); return response.json(); })
            .then(function (data) { if (!data || !data.token) throw new Error('token'); return data.token; })
            .catch(function (error) { tokenPromise = null; throw error; });
        return tokenPromise.then(function (token) { targetForm.elements.csrf_token.value = token; });
    }

    function openDialog(trigger) {
        if (window.paCloseSiteMenus) window.paCloseSiteMenus();
        returnFocus = trigger || document.activeElement;
        var card = trigger && trigger.closest('.shop-cat-card, .category-hub-card, .catalog-card, .shop-item-card, .product-detail-main, .product-final-cta, article');
        var categoryCard = card && (card.classList.contains('category-hub-card') || card.classList.contains('shop-cat-card'));
        var productName = (trigger && trigger.dataset.product) || (!categoryCard && card && card.querySelector('h1,h2,h3'))?.textContent.trim() || '';
        var pageTitle = document.querySelector('main h1, .page-heading h1, h1');
        var pageName = pageTitle ? pageTitle.textContent.trim() : '';
        var path = window.location.pathname;
        var categoryName = (trigger && trigger.dataset.category) || '';
        if (!categoryName && document.body.classList.contains('product-detail-page')) {
            var pill = document.querySelector('.product-detail-copy .shop-category-pill');
            categoryName = pill ? pill.textContent.trim() : '';
            if (!productName) productName = pageName;
        } else if (!categoryName && (document.body.classList.contains('shop-category-page') || document.body.classList.contains('shop-subcategory-page'))) {
            categoryName = pageName;
        }
        if (categoryCard) categoryName = (trigger && trigger.dataset.category) || card.querySelector('.shop-cat-title,h2,h3')?.textContent.trim() || categoryName;
        var select = form.elements.product;
        var known = Array.prototype.find.call(select.options, function (option) { return option.value.toLowerCase() === productName.toLowerCase() || option.text.toLowerCase() === productName.toLowerCase(); });
        if (!productName || known) {
            select.value = known ? known.value : '';
            form.elements.category.value = categoryName;
        } else {
            var custom = document.createElement('option');
            custom.value = productName.slice(0, 120);
            custom.textContent = productName.slice(0, 120);
            custom.dataset.context = 'true';
            var productGroup = select.querySelector('optgroup[label="Popular products"]');
            if (productGroup) productGroup.appendChild(custom);
            else select.appendChild(custom);
            select.value = custom.value;
            form.elements.category.value = categoryName;
        }
        var waText = 'Hello Print Advertising, I would like a quote';
        if (productName) waText += ' for ' + productName;
        if (!productName && categoryName) waText += ' for ' + categoryName;
        dialog.querySelector('.pa-quote-whatsapp').href = 'https://wa.me/971582023571?text=' + encodeURIComponent(waText + '.');
        form.reset();
        /* Restore context after reset, which also clears stale values on reopen. */
        select.value = known ? known.value : '';
        if (productName && !known) {
            var inserted = Array.prototype.find.call(select.options, function (option) { return option.dataset.context === 'true' && option.value === productName.slice(0, 120); });
            if (inserted) select.value = inserted.value;
        }
        form.elements.category.value = categoryName;
        form.querySelector('.pa-quote-status').textContent = '';
        form.querySelector('.pa-quote-success').hidden = true;
        Array.prototype.forEach.call(form.children, function (child) { if (child !== form.querySelector('.pa-quote-success') && child.name !== 'csrf_token') child.hidden = false; });
        dialog.hidden = false;
        document.body.classList.add('pa-quote-open');
        previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        requestToken(form).catch(function () { form.querySelector('.pa-quote-status').textContent = 'The form is temporarily unavailable. Please chat with us on WhatsApp.'; });
        window.setTimeout(function () { form.elements.name.focus(); }, 20);
    }

    function closeDialog() {
        if (dialog.hidden) return;
        dialog.hidden = true;
        document.body.classList.remove('pa-quote-open');
        document.documentElement.style.overflow = previousOverflow;
        if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    }
    window.paCloseQuoteDialog = closeDialog;
    window.paOpenQuoteDialog = openDialog;

    document.addEventListener('click', function (event) {
        var trigger = event.target.closest('[data-pa-quote-open], .pa-header-button--quote, .product-outline-btn');
        if (!trigger && !event.target.closest('[data-pa-quote-inline-form]') && event.target.closest('a,button')) {
            var link = event.target.closest('a,button');
            var label = ((link.textContent || '') + ' ' + (link.getAttribute('aria-label') || '')).replace(/\s+/g, ' ');
            if (/\b(get|request)\b.{0,28}\bquote\b/i.test(label)) trigger = link;
        }
        if (!trigger) return;
        if (/wa\.me\//i.test(trigger.href || '') && !/quote/i.test(trigger.textContent || '')) return;
        event.preventDefault();
        openDialog(trigger);
    });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) closeDialog(); });
    closeButton.addEventListener('click', closeDialog);
    document.addEventListener('keydown', function (event) {
        if (dialog.hidden) return;
        if (event.key === 'Escape') { event.preventDefault(); closeDialog(); }
        if (event.key === 'Tab') {
            var focusable = panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled])');
            var first = focusable[0], last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var status = form.querySelector('.pa-quote-status');
        var submit = form.querySelector('[type="submit"]');
        var success = form.querySelector('.pa-quote-success');
        status.textContent = '';
        phoneInput.setCustomValidity(phoneValidationMessage(phoneInput.value));
        if (!form.reportValidity()) return;
        submit.disabled = true;
        submit.textContent = 'Sending…';
        requestToken(form).then(function () {
            return fetch(form.action, { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json' }, body: new FormData(form) });
        }).then(function (response) {
            return response.json().then(function (data) { if (!response.ok || !data || data.success !== true) { var e = new Error('request'); e.code = data && data.code; throw e; } return data; });
        }).then(function () {
            Array.prototype.forEach.call(form.children, function (child) { if (child !== success) child.hidden = true; });
            success.hidden = false;
            success.focus();
        }).catch(function (error) {
            status.textContent = error.code === 'rate_limited' ? 'Please wait a few minutes before trying again, or chat with us on WhatsApp.' : error.code === 'invalid_input' ? 'Please check your name, WhatsApp number and email address, then try again.' : 'We could not send your enquiry just now. Please try again or chat with us on WhatsApp.';
            submit.disabled = false;
            submit.textContent = 'Request a Quote';
            status.focus();
        });
    });

    var inlineForm = document.querySelector('[data-pa-quote-inline-form]');
    if (inlineForm) {
        var inlinePhone = inlineForm.elements.phone;
        var inlineStatus = inlineForm.querySelector('.pa-quote-status');
        var inlineSuccess = inlineForm.querySelector('.pa-quote-inline-success');
        var inlineSubmit = inlineForm.querySelector('[type="submit"]');
        var inlineSubmitLabel = inlineForm.elements.lead_type.value === 'quick_enquiry' ? 'Send Enquiry' : 'Request a Quote';
        inlinePhone.addEventListener('input', function () {
            inlinePhone.setCustomValidity(phoneValidationMessage(inlinePhone.value));
        });
        inlineForm.addEventListener('input', function () {
            if (inlineSuccess.hidden) return;
            inlineSuccess.hidden = true;
            inlineSubmit.disabled = false;
            inlineSubmit.textContent = inlineSubmitLabel;
        });
        inlineForm.addEventListener('submit', function (event) {
            event.preventDefault();
            inlineStatus.textContent = '';
            inlinePhone.setCustomValidity(phoneValidationMessage(inlinePhone.value));
            if (!inlineForm.reportValidity()) return;
            inlineSubmit.disabled = true;
            inlineSubmit.textContent = 'Sending…';
            requestToken(inlineForm).then(function () {
                return fetch(inlineForm.action, { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json' }, body: new FormData(inlineForm) });
            }).then(function (response) {
                return response.json().then(function (data) { if (!response.ok || !data || data.success !== true) { var error = new Error('request'); error.code = data && data.code; throw error; } return data; });
            }).then(function () {
                inlineSuccess.hidden = false;
                inlineSubmit.textContent = 'Request Sent';
            }).catch(function (error) {
                inlineStatus.textContent = error.code === 'rate_limited' ? 'Please wait a few minutes before trying again, or chat with us on WhatsApp.' : error.code === 'invalid_input' ? 'Please check your name, WhatsApp number and email address, then try again.' : 'We could not send your enquiry just now. Please try again or chat with us on WhatsApp.';
                inlineSubmit.disabled = false;
                inlineSubmit.textContent = inlineSubmitLabel;
            });
        });
        requestToken(inlineForm).catch(function () {
            inlineStatus.textContent = 'The form is temporarily unavailable. Please chat with us on WhatsApp.';
        });
    }

    document.querySelectorAll('[data-pa-lead-form]').forEach(function (leadForm) {
        var status = leadForm.querySelector('.pa-lead-status');
        requestToken(leadForm).catch(function () {
            status.textContent = 'The form is temporarily unavailable. Please try again shortly.';
            status.classList.add('error');
        });
        leadForm.addEventListener('submit', function (event) {
            event.preventDefault();
            status.textContent = '';
            status.classList.remove('success', 'error');
            if (!leadForm.reportValidity()) return;
            var submit = leadForm.querySelector('[type="submit"]');
            submit.disabled = true;
            var originalLabel = submit.textContent;
            submit.textContent = 'SENDING…';
            requestToken(leadForm).then(function () {
                return fetch(leadForm.action, { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json' }, body: new FormData(leadForm) });
            }).then(function (response) {
                return response.json().then(function (data) { if (!response.ok || !data || data.success !== true) { var error = new Error('request'); error.code = data && data.code; throw error; } return data; });
            }).then(function () {
                Array.prototype.forEach.call(leadForm.elements, function (field) {
                    if (field.name !== 'csrf_token' && field.name !== 'lead_type' && field.name !== 'website_url' && 'value' in field) field.value = '';
                });
                status.textContent = 'Thank you. Your message has been sent successfully.';
                status.classList.add('success');
                submit.disabled = false;
                submit.textContent = originalLabel;
                status.focus();
            }).catch(function (error) {
                status.textContent = error.code === 'rate_limited' ? 'Please wait a few minutes before trying again.' : error.code === 'invalid_input' ? 'Please check your name, email address and message, then try again.' : 'Oops! An error occurred and your message could not be sent. Please try again.';
                status.classList.add('error');
                submit.disabled = false;
                submit.textContent = originalLabel;
                status.focus();
            });
        });
    });
})();
