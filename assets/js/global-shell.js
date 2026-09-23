(function () {
    'use strict';

    var shell = document.querySelector('.pa-site-shell');
    if (!shell) return;

    var toggle = shell.querySelector('.pa-menu-toggle');
    var nav = shell.querySelector('.pa-primary-nav');
    var dropdowns = Array.prototype.slice.call(shell.querySelectorAll('.pa-nav-dropdown'));
    var mobile = window.matchMedia('(max-width: 1000px)');

    function closeMenu(returnFocus) {
        shell.classList.remove('pa-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        dropdowns.forEach(function (item) { item.open = false; });
        if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        shell.classList.toggle('pa-menu-open', open);
    });

    dropdowns.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (!item.open || !mobile.matches) return;
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
    });
})();
