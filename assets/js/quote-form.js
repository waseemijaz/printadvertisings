(function () {
    'use strict';

    var forms = Array.prototype.slice.call(document.querySelectorAll('.pa-quote-form'));
    if (!forms.length) return;

    function updateVisibleFormState() {
        var visible = forms.some(function (form) {
            var rect = form.getBoundingClientRect();
            return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
        });
        document.body.classList.toggle('pa-quote-form-visible', visible);
    }
    window.addEventListener('scroll', updateVisibleFormState, { passive: true });
    window.addEventListener('resize', updateVisibleFormState);
    updateVisibleFormState();

    function requestToken(form) {
        var tokenUrl = new URL(form.action, window.location.href);
        tokenUrl.searchParams.set('action', 'token');
        return fetch(tokenUrl.toString(), {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        }).then(function (response) {
            if (!response.ok) throw new Error('token');
            return response.json();
        }).then(function (data) {
            if (!data || !data.token) throw new Error('token');
            form.elements.csrf_token.value = data.token;
        });
    }

    forms.forEach(function (form) {
        var status = form.querySelector('.pa-quote-status');
        var submit = form.querySelector('[type="submit"]');
        var success = form.querySelector('.pa-quote-success');
        var tokenReady = requestToken(form).then(function () { return true; }).catch(function () { return false; });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            status.textContent = '';
            if (!form.reportValidity()) return;

            submit.disabled = true;
            submit.textContent = 'Sending…';

            tokenReady.then(function (ready) {
                return (ready ? Promise.resolve() : requestToken(form)).then(function () {
                    return fetch(form.action, {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: { 'Accept': 'application/json' },
                        body: new FormData(form)
                    });
                });
            }).then(function (response) {
                return response.json().then(function (data) {
                    if (!response.ok || !data || data.success !== true) {
                        var error = new Error('request');
                        error.code = data && data.code;
                        throw error;
                    }
                    return data;
                });
            }).then(function () {
                Array.prototype.forEach.call(form.children, function (child) {
                    if (child !== success && child.name !== 'csrf_token') child.hidden = true;
                });
                success.hidden = false;
                success.focus();
            }).catch(function (error) {
                if (error && error.code === 'rate_limited') {
                    status.textContent = 'Please wait a few minutes before trying again, or chat with us on WhatsApp.';
                } else if (error && error.code === 'invalid_input') {
                    status.textContent = 'Please check your name, WhatsApp number and email address, then try again.';
                } else {
                    status.textContent = 'We could not send your enquiry just now. Please try again or chat with us on WhatsApp.';
                }
                submit.disabled = false;
                submit.textContent = 'Request a Quote';
                status.focus();
            });
        });
    });
})();
