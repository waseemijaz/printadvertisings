(function () {
    'use strict';

    var shell = document.querySelector('.pa-site-shell');
    if (!shell) return;

    /* Load the single shared quote dialog on every page using this shell. */
    var shellScript = document.currentScript;
    if (shellScript && !document.querySelector('script[data-pa-quote-loader]')) {
        var assetBase = new URL('../', shellScript.src);
        var quoteCss = document.createElement('link');
        quoteCss.rel = 'stylesheet';
        quoteCss.href = new URL('css/quote-form.css?v=4', assetBase).href;
        document.head.appendChild(quoteCss);
        var quoteScript = document.createElement('script');
        quoteScript.src = new URL('js/quote-form.js?v=6', assetBase).href;
        quoteScript.defer = true;
        quoteScript.dataset.paQuoteLoader = 'true';
        document.head.appendChild(quoteScript);
    }

    var toggle = shell.querySelector('.pa-menu-toggle');
    var nav = shell.querySelector('.pa-primary-nav');
    var dropdowns = Array.prototype.slice.call(shell.querySelectorAll('.pa-nav-dropdown'));
    var mobile = window.matchMedia('(max-width: 1000px)');
    var collectionPath = '/uae-national-day-printing/';
    var categoryMenu = shell.querySelector('.pa-mega-column');
    var categoryRail = shell.querySelector('.pa-category-inner');

    if (categoryMenu && !categoryMenu.querySelector('a[href="' + collectionPath + '"]')) {
        var collectionMenuLink = document.createElement('a');
        collectionMenuLink.href = collectionPath;
        collectionMenuLink.textContent = 'UAE National Day Collection';
        categoryMenu.appendChild(collectionMenuLink);
    }
    if (categoryRail && !categoryRail.querySelector('a[href="' + collectionPath + '"]')) {
        var collectionRailLink = document.createElement('a');
        collectionRailLink.href = collectionPath;
        collectionRailLink.textContent = 'National Day Collection';
        categoryRail.appendChild(collectionRailLink);
    }

    function closeMenu(returnFocus) {
        shell.classList.remove('pa-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        dropdowns.forEach(function (item) { item.open = false; });
        if (returnFocus) toggle.focus();
    }
    window.paCloseSiteMenus = function () { closeMenu(false); };

    toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        shell.classList.toggle('pa-menu-open', open);
    });

    dropdowns.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (!item.open) return;
            dropdowns.forEach(function (other) { if (other !== item) other.open = false; });
        });
    });

    document.addEventListener('click', function (event) {
        if (!shell.contains(event.target) && shell.classList.contains('pa-menu-open')) closeMenu(false);
        if (!shell.contains(event.target)) dropdowns.forEach(function (item) { item.open = false; });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            var wasOpen = shell.classList.contains('pa-menu-open') || dropdowns.some(function (item) { return item.open; });
            closeMenu(wasOpen && mobile.matches);
        }
    });

    var onBreakpointChange = function (event) {
        if (!event.matches) closeMenu(false);
    };
    if (mobile.addEventListener) mobile.addEventListener('change', onBreakpointChange);
    else if (mobile.addListener) mobile.addListener(onBreakpointChange);

    nav.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu(false);
        if (window.paCloseQuoteDialog) window.paCloseQuoteDialog();
    });
    shell.querySelectorAll('.pa-nav-dropdown > summary, .pa-menu-toggle').forEach(function (control) {
        control.addEventListener('click', function () {
            if (window.paCloseQuoteDialog) window.paCloseQuoteDialog();
        });
    });
})();
