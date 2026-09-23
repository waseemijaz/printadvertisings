(function () {
    'use strict';

    var isCategory = document.body.classList.contains('shop-category-page');
    var catalogHero = document.querySelector('.shop-subcategory-page .catalog-hero');
    if (!isCategory && !catalogHero) return;

    var title = isCategory
        ? document.querySelector('.shop-category-page .page-heading h1')
        : catalogHero.querySelector('h1');
    var parentLink = catalogHero && catalogHero.querySelector('.container > a');
    var breadcrumb = document.createElement('nav');
    breadcrumb.className = 'category-page-breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');

    var crumbInner = document.createElement('div');
    crumbInner.className = 'container';
    var home = document.createElement('a');
    home.href = '/index.html';
    home.textContent = 'Home';
    crumbInner.appendChild(home);

    function separator() {
        var span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.textContent = '/';
        crumbInner.appendChild(span);
    }

    if (isCategory) {
        separator();
        var all = document.createElement('a');
        all.href = '/all-categories.html';
        all.textContent = 'All Products';
        crumbInner.appendChild(all);
    } else if (parentLink) {
        separator();
        var parentCrumb = document.createElement('a');
        parentCrumb.href = parentLink.href;
        parentCrumb.textContent = parentLink.textContent.replace(/^\s*←\s*/, '').trim();
        crumbInner.appendChild(parentCrumb);
    }

    separator();
    var current = document.createElement('span');
    current.setAttribute('aria-current', 'page');
    current.textContent = title ? title.textContent.trim() : document.title;
    crumbInner.appendChild(current);
    breadcrumb.appendChild(crumbInner);
    (isCategory ? document.querySelector('.shop-category-page .breadcrumb-wrapper') : catalogHero)
        .before(breadcrumb);

    var categoryRail = document.querySelector('.pa-category-rail');
    var pageLinks = categoryRail ? Array.prototype.filter.call(categoryRail.querySelectorAll('a'), function (link) {
        var url = new URL(link.href, window.location.href);
        return url.pathname !== '/all-categories.html' && url.pathname !== window.location.pathname &&
            (!parentLink || url.pathname !== new URL(parentLink.href, window.location.href).pathname);
    }) : [];

    function addRelatedLinks(container, links) {
        var list = document.createElement('div');
        list.className = 'category-related-links';
        links.forEach(function (source) {
            var link = document.createElement('a');
            link.href = source.href;
            link.textContent = source.textContent.trim();
            list.appendChild(link);
        });
        container.appendChild(list);
    }

    if (isCategory) {
        var productSection = document.querySelector('.shop-category-page .shop-category-section');
        var quote = document.querySelector('.shop-category-page .shop-category-cta');
        if (productSection && quote) {
            var quoteSection = quote.closest('section');
            if (quoteSection) quoteSection.classList.add('category-cta-section');
            var related = document.createElement('section');
            related.className = 'category-related-section';
            var relatedInner = document.createElement('div');
            relatedInner.className = 'container';
            var relatedTitle = document.createElement('h2');
            relatedTitle.textContent = 'Related print categories';
            relatedInner.appendChild(relatedTitle);
            addRelatedLinks(relatedInner, pageLinks);
            related.appendChild(relatedInner);

            var why = document.createElement('section');
            why.className = 'category-why-section';
            why.innerHTML = '<div class="container category-why-inner"><h2>Why Print Advertising</h2><ul class="category-why-points"><li>Fast turnaround</li><li>UAE-wide support</li><li>Quality printing</li></ul></div>';
            productSection.after(related, why);

            var quoteLink = quote.querySelector('a[href]');
            if (quoteLink) {
                var whatsapp = document.createElement('a');
                whatsapp.className = 'theme-btn';
                whatsapp.href = 'https://wa.me/971582023571';
                whatsapp.target = '_blank';
                whatsapp.rel = 'noopener';
                whatsapp.textContent = 'WhatsApp us';
                quoteLink.after(whatsapp);
            }
        }
    } else {
        var relatedSection = document.querySelector('.shop-subcategory-page .catalog-related');
        if (relatedSection) {
            addRelatedLinks(relatedSection.querySelector('.container'), pageLinks);
            var cta = document.createElement('section');
            cta.className = 'catalog-cta';
            cta.innerHTML = '<div class="container catalog-cta-inner"><p>Need help choosing the right print option?</p><div class="catalog-cta-actions"><a href="https://wa.me/971582023571" target="_blank" rel="noopener">WhatsApp us</a><a href="/contact.html">Get a quote</a></div></div>';
            relatedSection.after(cta);
        }
    }
})();
