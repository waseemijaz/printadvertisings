/* Product-specific controls and recommendations for individual product pages. */
(function () {
  'use strict';

  const groups = {
    businessCards: {
      category: 'Business Cards', categoryUrl: '/products/business-cards.html',
      products: ['business-cards-standard', 'business-cards-premium', 'business-cards-matte', 'business-cards-glossy', 'business-cards-textured', 'business-cards-kraft', 'business-cards-spot-uv', 'business-cards-foil', 'business-cards-velvet', 'business-cards-plastic', 'business-cards-rounded-corner', 'business-cards-die-cut', 'business-cards-luxury', 'express-business-cards'],
      fields: [
        ['Size', 'text'], ['Paper', 'text'], ['GSM', 'text'],
        ['Finish', 'select', ['Standard', 'Premium', 'Matte', 'Glossy', 'Textured', 'Kraft', 'Spot UV', 'Foil', 'Velvet', 'Transparent / Plastic', 'Rounded Corner', 'Die-Cut', 'Luxury']],
        ['Quantity', 'text']
      ], ratio: 'landscape'
    },
    flyers: {
      category: 'Flyers & Leaflets', categoryUrl: '/products/flyers-leaflets.html',
      products: ['flyers-leaflets-a4', 'flyers-leaflets-a5', 'flyers-leaflets-a6', 'flyers-leaflets-dl', 'flyers-leaflets-single-sided', 'flyers-leaflets-double-sided', 'flyers-leaflets-promotional', 'flyers-leaflets-business', 'flyers-leaflets-restaurant', 'flyers-leaflets-real-estate', 'fast-flyers'],
      fields: [
        ['Size', 'select', ['A4', 'A5', 'A6', 'DL']], ['Paper', 'text'], ['GSM', 'text'],
        ['Single / Double Sided', 'select', ['Single-Sided', 'Double-Sided']], ['Finish', 'text'], ['Quantity', 'text'],
        ['Shape', 'text'], ['Lamination', 'text'], ['Design Service', 'text'], ['Delivery', 'text'], ['Artwork Upload', 'text']
      ], ratio: 'portrait'
    },
    letterheads: {
      category: 'Letterheads', categoryUrl: '/products/letterheads.html',
      products: ['letterheads-standard', 'letterheads-premium', 'letterheads-corporate', 'letterheads-ncr'],
      fields: [['Type', 'select', ['Standard', 'Premium', 'Corporate', 'NCR']], ['Paper', 'text'], ['GSM', 'text'], ['Quantity', 'text']], ratio: 'portrait'
    },
    banners: {
      category: 'Banners', categoryUrl: '/marketing.html', products: ['outdoor-banners'],
      fields: [['Width', 'text'], ['Height', 'text'], ['Material', 'text'], ['Printing Type', 'text'], ['Eyelets', 'text'], ['Finishing', 'text'], ['Quantity', 'text'], ['Installation', 'text'], ['Delivery', 'text']], ratio: 'landscape'
    },
    packaging: {
      category: 'Boxes', categoryUrl: '/gifts.html', products: ['gift-boxes'],
      fields: [['Size', 'text'], ['Material', 'text'], ['Printing', 'text']], ratio: 'square'
    },
    displays: {
      category: 'Display Products', categoryUrl: '/marketing.html', products: ['promotional-displays'],
      fields: [['Display Product', 'select', ['Standees', 'Roll-Up Stands', 'X-Banners', 'Exhibition Displays', 'Tabletop Displays', 'Backdrops', 'Event Backdrops']], ['Size', 'text'], ['Material', 'text'], ['Finishing', 'text'], ['Quantity', 'text']], ratio: 'portrait'
    },
    posters: {
      category: 'Posters', categoryUrl: '/marketing.html', products: ['on-demand-posters'],
      fields: [['Size', 'select', ['A4', 'A3', 'A2', 'A1', 'Large Format']], ['Paper', 'text'], ['Printing Type', 'text'], ['Finish', 'text'], ['Quantity', 'text']], ratio: 'portrait'
    },
    calendars: {
      category: 'Calendars', categoryUrl: '/calendars.html', products: ['desk-calendars', 'wall-calendars'],
      fields: [['Calendar Type', 'select', ['Wall Calendars', 'Desk Calendars', 'Table Calendars', 'Poster Calendars', 'Photo Calendars']], ['Size', 'text'], ['Paper', 'text'], ['Quantity', 'text']], ratio: 'portrait'
    },
    diaries: {
      category: 'Diaries', categoryUrl: '/calendars.html', products: ['custom-diaries'],
      fields: [['Diary Type', 'select', ['Hardcover', 'Softcover', 'Executive', 'Custom', 'Wiro']], ['Size', 'text'], ['Printing', 'text'], ['Quantity', 'text']], ratio: 'portrait'
    },
    drinkware: {
      category: 'Drinkware', categoryUrl: '/drinkware.html', products: ['branded-mugs', 'custom-mugs', 'insulated-tumblers', 'water-bottles'],
      fields: [['Drinkware Type', 'select', ['Mugs', 'Coffee Mugs', 'Travel Mugs', 'Water Bottles', 'Sippers', 'Tumblers']], ['Material', 'text'], ['Printing', 'text'], ['Quantity', 'text']], ratio: 'square'
    },
    apparel: {
      category: 'Apparel Printing', categoryUrl: '/apparel.html', products: ['custom-t-shirt-printing', 'corporate-uniforms', 'caps-headwear'],
      fields: [['Apparel Type', 'select', ['T-Shirts', 'Polo T-Shirts', 'Event T-Shirts', 'Team T-Shirts', 'Caps', 'Uniforms']], ['Size', 'text'], ['Printing', 'text'], ['Quantity', 'text']], ratio: 'portrait'
    },
    office: {
      category: 'Office Printing', categoryUrl: '/stationery.html', products: ['custom-notebooks', 'engraved-gifts'],
      fields: [['Product Type', 'text'], ['Material', 'text'], ['Printing / Engraving', 'text'], ['Quantity', 'text']], ratio: 'portrait'
    }
  };

  const productTitles = {
  "branded-mugs": "Branded Mugs for Corporate Gifting",
  "business-cards-die-cut": "Die-Cut Business Cards",
  "business-cards-foil": "Foil Business Cards",
  "business-cards-glossy": "Glossy Business Cards",
  "business-cards-kraft": "Kraft Business Cards",
  "business-cards-luxury": "Luxury Business Cards",
  "business-cards-matte": "Matte Business Cards",
  "business-cards-plastic": "Plastic Business Cards",
  "business-cards-premium": "Premium Business Cards",
  "business-cards-rounded-corner": "Rounded Corner Business Cards",
  "business-cards-spot-uv": "Spot UV Business Cards",
  "business-cards-standard": "Standard Business Cards",
  "business-cards-textured": "Textured Business Cards",
  "business-cards-velvet": "Velvet Business Cards",
  "caps-headwear": "Branded Caps & Headwear",
  "corporate-uniforms": "Corporate Uniforms - Bulk Order",
  "custom-diaries": "Custom Branded Diaries",
  "custom-mugs": "Custom Printed Mugs - Bulk Order",
  "custom-notebooks": "Custom Branded Notebooks",
  "custom-t-shirt-printing": "Custom T-Shirt Printing - Bulk Order",
  "desk-calendars": "Branded Desk Calendars",
  "engraved-gifts": "Personalized Engraved Gifts",
  "express-business-cards": "Express Business Cards",
  "fast-flyers": "Fast Flyer Printing",
  "flyers-leaflets-a4": "A4 Flyers and Leaflets",
  "flyers-leaflets-a5": "A5 Flyers and Leaflets",
  "flyers-leaflets-a6": "A6 Flyers and Leaflets",
  "flyers-leaflets-business": "Business Flyers and Leaflets",
  "flyers-leaflets-dl": "DL Flyers and Leaflets",
  "flyers-leaflets-double-sided": "Double-Sided Flyers and Leaflets",
  "flyers-leaflets-promotional": "Promotional Flyers and Leaflets",
  "flyers-leaflets-real-estate": "Real Estate Flyers and Leaflets",
  "flyers-leaflets-restaurant": "Restaurant Flyers and Leaflets",
  "flyers-leaflets-single-sided": "Single-Sided Flyers and Leaflets",
  "gift-boxes": "Custom Corporate Gift Boxes",
  "insulated-tumblers": "Premium Insulated Tumblers",
  "letterheads-corporate": "Corporate Letterheads",
  "letterheads-ncr": "NCR Letterheads",
  "letterheads-premium": "Premium Letterheads",
  "letterheads-standard": "Standard Letterheads",
  "on-demand-posters": "On-Demand Poster Printing",
  "outdoor-banners": "Outdoor Banners & Signage",
  "promotional-displays": "Promotional Display Materials",
  "wall-calendars": "Custom Wall Calendars - Bulk Order",
  "water-bottles": "Branded Water Bottles"
};

  const categoryLinks = {
    'Business Printing & Stationery': '/stationery.html',
    'Marketing & Promotional Printing': '/marketing.html',
    'Signage & Large Format Printing': '/marketing.html',
    'Packaging Printing': '/gifts.html',
    'Corporate Gifts & Promotional Products': '/gifts.html',
    'Apparel Printing': '/apparel.html',
    'Calendars & Diaries': '/calendars.html'
  };
  const siteCategories = {
    businessCards: ['Business Stationery', '/stationery.html'],
    flyers: ['Marketing Print', '/marketing.html'],
    letterheads: ['Business Stationery', '/stationery.html'],
    banners: ['Marketing Print', '/marketing.html'],
    packaging: ['Corporate Gifts', '/gifts.html'],
    displays: ['Marketing Print', '/marketing.html'],
    posters: ['Express Print', '/express.html'],
    calendars: ['Calendars & Diaries', '/calendars.html'],
    diaries: ['Calendars & Diaries', '/calendars.html'],
    drinkware: ['Drinkware', '/drinkware.html'],
    apparel: ['Apparel & Textiles', '/apparel.html'],
    office: ['Business Stationery', '/stationery.html']
  };

  const pageMap = {
    'branded-mugs': ['drinkware', 'Corporate Gifts & Promotional Products'],
    'business-cards-die-cut': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-foil': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-glossy': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-kraft': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-luxury': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-matte': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-plastic': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-premium': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-rounded-corner': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-spot-uv': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-standard': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-textured': ['businessCards', 'Business Printing & Stationery'],
    'business-cards-velvet': ['businessCards', 'Business Printing & Stationery'],
    'caps-headwear': ['apparel', 'Apparel Printing'],
    'corporate-uniforms': ['apparel', 'Apparel Printing'],
    'custom-diaries': ['diaries', 'Calendars & Diaries'],
    'custom-mugs': ['drinkware', 'Corporate Gifts & Promotional Products'],
    'custom-notebooks': ['office', 'Business Printing & Stationery'],
    'custom-t-shirt-printing': ['apparel', 'Apparel Printing'],
    'desk-calendars': ['calendars', 'Calendars & Diaries'],
    'engraved-gifts': ['office', 'Corporate Gifts & Promotional Products'],
    'express-business-cards': ['businessCards', 'Business Printing & Stationery'],
    'fast-flyers': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-a4': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-a5': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-a6': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-business': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-dl': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-double-sided': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-promotional': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-real-estate': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-restaurant': ['flyers', 'Marketing & Promotional Printing'],
    'flyers-leaflets-single-sided': ['flyers', 'Marketing & Promotional Printing'],
    'gift-boxes': ['packaging', 'Packaging Printing'],
    'insulated-tumblers': ['drinkware', 'Corporate Gifts & Promotional Products'],
    'letterheads-corporate': ['letterheads', 'Business Printing & Stationery'],
    'letterheads-ncr': ['letterheads', 'Business Printing & Stationery'],
    'letterheads-premium': ['letterheads', 'Business Printing & Stationery'],
    'letterheads-standard': ['letterheads', 'Business Printing & Stationery'],
    'on-demand-posters': ['posters', 'Marketing & Promotional Printing'],
    'outdoor-banners': ['banners', 'Signage & Large Format Printing'],
    'promotional-displays': ['displays', 'Signage & Large Format Printing'],
    'wall-calendars': ['calendars', 'Calendars & Diaries'],
    'water-bottles': ['drinkware', 'Corporate Gifts & Promotional Products']
  };

  const path = location.pathname.split('/').pop().replace(/\.html$/, '');
  const page = pageMap[path];
  const group = page && groups[page[0]];
  if (!group || !document.body.classList.contains('product-detail-page')) return;

  const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const title = document.querySelector('.product-detail-copy h1')?.textContent.trim() || document.title;
  const sectionHeading = document.querySelector('.product-types .product-section-heading h2');
  if (sectionHeading) sectionHeading.textContent = 'Product options';
  const sectionLabel = document.querySelector('.product-types .product-section-heading > span');
  if (sectionLabel) sectionLabel.textContent = group.category;
  const campaignLabel = document.querySelector('.product-promo-copy > span');
  if (campaignLabel) campaignLabel.textContent = `${group.category} · ${campaignLabel.textContent.trim()}`;

  const heroCopy = document.querySelector('.product-detail-copy');
  const heroActions = heroCopy?.querySelector('.product-detail-actions');
  if (heroCopy && heroActions) {
    const heroOptions = document.createElement('div');
    heroOptions.className = 'product-hero-options';
    heroOptions.setAttribute('aria-label', 'Key product options');
    group.fields.slice(0, 2).forEach(([label, type, choices], index) => {
      const wrap = document.createElement('label');
      wrap.className = 'product-option-control';
      wrap.dataset.optionLabel = label;
      wrap.innerHTML = `<span>${esc(label)}</span>`;
      if (type === 'select') {
        const select = document.createElement('select');
        select.setAttribute('aria-label', label);
        select.innerHTML = `<option value="">Choose ${esc(label.toLowerCase())}</option>${choices.map((choice) => `<option>${esc(choice)}</option>`).join('')}`;
        wrap.append(select);
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('aria-label', label);
        input.placeholder = label === 'Quantity' ? 'Enter quantity' : `Enter ${label.toLowerCase()}`;
        wrap.append(input);
      }
      heroOptions.append(wrap);
    });
    heroCopy.insertBefore(heroOptions, heroActions);
  }

  const optionGrid = document.querySelector('.product-types .product-type-grid');
  if (optionGrid) {
    optionGrid.innerHTML = group.fields.map(([label, type, choices]) => {
      const content = choices ? choices.join(' · ') : `Specify ${label.toLowerCase()} for your order.`;
      return `<article class="product-option-card"><span class="product-option-badge">${esc(group.category)}</span><h3>${esc(label)}</h3><p>${esc(content)}</p></article>`;
    }).join('');
    optionGrid.classList.add('product-option-grid');
  }

  const crumb = document.createElement('nav');
  crumb.className = 'product-detail-breadcrumb';
  crumb.setAttribute('aria-label', 'Breadcrumb');
  const [siteCategory, siteCategoryUrl] = path === 'branded-mugs'
    ? ['Corporate Gifts', '/gifts.html']
    : siteCategories[page[0]];
  const hasSubcategoryPage = group.categoryUrl.startsWith('/products/');
  const subcategory = group.category;
  crumb.innerHTML = `<div class="container"><a href="/index.html">Home</a><span aria-hidden="true">/</span><a href="${siteCategoryUrl}">${esc(siteCategory)}</a>${hasSubcategoryPage ? `<span aria-hidden="true">/</span><a href="${group.categoryUrl}">${esc(subcategory)}</a>` : ''}<span aria-hidden="true">/</span><strong aria-current="page">${esc(title)}</strong></div>`;
  const main = document.querySelector('.pa-site-shell')?.nextElementSibling;
  const existingCrumb = document.querySelector('.product-detail-breadcrumb');
  if (existingCrumb) existingCrumb.replaceWith(crumb);
  else if (main && main.tagName === 'MAIN') main.before(crumb);

  const relatedSection = document.querySelector('.product-related');
  const originalGrid = relatedSection?.querySelector('.product-related-grid');
  const relatedHeading = relatedSection?.querySelector('.product-section-heading h2');
  const relatedLabel = relatedSection?.querySelector('.product-section-heading > span');
  if (relatedSection && originalGrid) {
    if (relatedHeading) relatedHeading.textContent = 'Similar Products';
    if (relatedLabel) relatedLabel.textContent = 'Explore this product range';
    const relatedOverrides = {
      'outdoor-banners': ['promotional-displays'],
      'promotional-displays': ['outdoor-banners'],
      'gift-boxes': ['branded-mugs', 'engraved-gifts'],
      'engraved-gifts': ['gift-boxes', 'branded-mugs'],
      'branded-mugs': ['custom-mugs', 'insulated-tumblers', 'water-bottles'],
      'custom-mugs': ['branded-mugs', 'insulated-tumblers', 'water-bottles'],
      'on-demand-posters': ['fast-flyers', 'flyers-leaflets-a4', 'flyers-leaflets-promotional']
    };
    const relatedSlugs = (relatedOverrides[path] || group.products.filter((slug) => slug !== path)).slice(0, 6);
    originalGrid.innerHTML = relatedSlugs.map((slug) => {
      const anchor = document.querySelector(`a[href="${slug}.html"]`);
      let cardTitle = productTitles[slug] || anchor?.querySelector('strong')?.textContent.trim() || title;
      return `<a class="product-related-card product-related-card--${group.ratio}" href="${slug}.html"><img src="../assets/img/shop/product-placeholder.svg" alt="" loading="lazy"><span class="product-related-card__body"><strong>${esc(cardTitle)}</strong><span>View product details</span></span></a>`;
    }).join('');

    const interest = document.createElement('section');
    interest.className = 'product-related product-interest';
    interest.innerHTML = `<div class="container"><div class="product-section-heading"><span>Related category</span><h2>You might be interested in</h2></div><div class="product-related-grid"><a href="${group.categoryUrl}"><strong>${esc(subcategory)}</strong><span>Browse this category</span></a><a href="${parentUrl}"><strong>${esc(parent)}</strong><span>Browse related print categories</span></a></div></div>`;
    relatedSection.after(interest);
  }

  document.body.dataset.productType = page[0];
  const mainWhatsApp = document.querySelector('.product-detail-actions .theme-btn');
  if (mainWhatsApp) {
    mainWhatsApp.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp Order';
    mainWhatsApp.setAttribute('aria-label', `WhatsApp to order ${title}`);
    const baseUrl = new URL(mainWhatsApp.href, location.href);
    const updateOrderLink = () => {
      const values = Array.from(heroCopy.querySelectorAll('.product-option-control')).map((control) => {
        const value = control.querySelector('input, select')?.value.trim();
        return value ? `${control.dataset.optionLabel}: ${value}` : '';
      }).filter(Boolean);
      const params = new URLSearchParams(baseUrl.search);
      const originalMessage = params.get('text') || `Hello Print Advertising, I would like to order ${title}.`;
      params.set('text', values.length ? `${originalMessage}\n${values.join('\n')}` : originalMessage);
      mainWhatsApp.href = `${baseUrl.origin}${baseUrl.pathname}?${params.toString()}`;
    };
      heroCopy?.querySelectorAll('.product-option-control input, .product-option-control select').forEach((control) => {
      control.addEventListener('input', updateOrderLink);
      control.addEventListener('change', updateOrderLink);
    });
  }
})();
