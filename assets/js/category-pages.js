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

    var categoryCatalog = {
        'stationery.html': { title: 'Stationery & Office Printing', image: 'assets/img/stationary_items/business card.webp', items: [
            ['Business Cards', 'Professional cards for everyday introductions.', '/products/business-cards.html', 'assets/img/stationary_items/business card.webp'],
            ['Letterheads', 'Branded stationery for clear business communication.', '/products/letterheads.html', 'assets/img/stationary_items/letterheads.webp'],
            ['Rubber Stamps', 'Practical branded stamps for office workflows.', '/products/catalog/rubber-stamps.html', 'assets/img/stationary_items/Stamps.webp'],
            ['Brochures', 'Printed brochures for products, services and presentations.', '/products/catalog/brochures.html', 'assets/img/trending-product/06.png'],
            ['Booklets', 'Bound print for guides, catalogues and company information.', '/products/catalog/booklets.html', 'assets/img/stationary_items/Booklets.webp'],
            ['ID Cards', 'Identification cards for teams, visitors and events.', '/products/catalog/id-cards.html', 'assets/img/stationary_items/id cards.webp'],
            ['Button Badges', 'Compact branded badges for teams and activations.', '/products/catalog/button-badges.html', 'assets/img/stationary_items/Button Badges.webp'],
            ['Notebooks', 'Branded notebooks for meetings and everyday notes.', '/products/custom-notebooks.html', 'assets/img/stationary_items/notebooks.webp'],
            ['Notepads', 'Custom notepads for offices, events and client handovers.', '/products/catalog/notepads.html', 'assets/img/stationary_items/notepads.webp']
        ]},
        'marketing.html': { title: 'Marketing, Promo & Branding Print', image: 'assets/img/shop/Marketing.webp', items: [
            ['Banners', 'Large-format graphics for promotions and spaces.', '/products/outdoor-banners.html', 'assets/img/Marketing_Promo/Banners.webp'],
            ['Standees', 'Promotional display formats for retail and events.', '/products/promotional-displays.html', 'assets/img/Marketing_Promo/Standee.webp'],
            ['Event Standees', 'Display graphics for event entrances and activations.', '/products/catalog/event-standees.html', 'assets/img/Marketing_Promo/event_Standee.webp'],
            ['Sun Board Signs', 'Rigid display signs for business and retail settings.', '/products/catalog/sun-board-signs.html', 'assets/img/Marketing_Promo/Sun Board Signs.webp'],
            ['Name Plates', 'Printed identification for offices and workspaces.', '/products/catalog/name-plates.html', 'assets/img/Marketing_Promo/Name_plate.webp'],
            ['Event Backdrops', 'Branded backdrops for stages, launches and photo areas.', '/products/catalog/event-backdrops.html', 'assets/img/Marketing_Promo/Event Backdrops.webp'],
            ['Decals', 'Branded adhesive graphics for campaigns and spaces.', '/products/catalog/decals.html', 'assets/img/Marketing_Promo/Dacals.webp'],
            ['Danglers', 'Suspended promotional print for retail visibility.', '/products/catalog/danglers.html', 'assets/img/Marketing_Promo/Danglers.webp']
        ]},
        'apparel.html': { title: 'Apparel & Textile Printing', image: 'assets/img/shop/Apparel%20.webp', items: [
            ['Custom T-Shirt Printing', 'Custom printed T-shirts for brands, teams, events, promotions, and everyday wear.', '/products/custom-t-shirt-printing.html', 'assets/img/Apparel/Custom_T-Shirt.webp'],
            ['Polo Shirts', 'Branded polo shirts for corporate teams, uniforms, events, and promotional campaigns.', '/products/polo-shirts.html', 'assets/img/Apparel/pol_tshirt.webp'],
            ['Workwear & Uniforms', 'Professional workwear and uniforms for offices, hotels, restaurants, clinics, and teams.', '/products/corporate-uniforms.html', 'assets/img/Apparel/Workwear.webp'],
            ['Hoodies & Sweatshirts', 'Custom hoodies and sweatshirts for brands, teams, events, and promotional campaigns.', '/products/catalog/sweatshirts-hoodies.html', 'assets/img/Apparel/Hoodies.webp'],
            ['Sportswear & Jerseys', 'Custom sports jerseys, teamwear, training shirts, and athletic apparel.', '/products/catalog/sports-jerseys.html', 'assets/img/Apparel/Custom_jerseys.webp'],
            ['Caps & Headwear', 'Branded caps, hats, beanies, and custom headwear for teams, businesses, and promotions.', '/products/caps-headwear.html', 'assets/img/Apparel/Caps.webp'],
            ['Jackets & Outerwear', 'Custom branded jackets and outerwear for corporate teams, workwear, events, and outdoor use.', '/products/jackets-outerwear.html', 'assets/img/Apparel/Jackets_outerware.webp'],
            ['Corporate & Promotional Apparel', 'Branded clothing for companies, promotional campaigns, events, giveaways, and corporate teams.', '/products/corporate-promotional-apparel.html', 'assets/img/Apparel/jackets.webp']
        ]},
        'gifts.html': { title: 'Corporate & Personalized Gifts', image: 'assets/img/shop/Corporate.webp', items: [
            ['Backpacks', 'Branded bags for employee and client gifting.', '/products/catalog/gift-backpacks.html', 'assets/img/corporate_gifts/Back_Backs.webp'],
            ['Drinkware', 'Custom drinkware for teams and client campaigns.', '/drinkware.html', 'assets/img/corporate_gifts/Drinkware.webp'],
            ['Apparel', 'Wearable branded gifts for teams and events.', '/apparel.html', 'assets/img/corporate_gifts/3.webp'],
            ['Gift Sets', 'Curated gift selections with branded presentation.', '/products/gift-boxes.html', 'assets/img/corporate_gifts/4.webp'],
            ['Desk Accessories', 'Useful branded pieces for the everyday workspace.', '/products/catalog/desk-accessories.html'],
            ['Pens', 'Everyday writing essentials for business gifting.', '/products/catalog/pens.html', 'assets/img/corporate_gifts/6.webp'],
            ['Notebooks', 'Branded notebooks for meetings and welcome kits.', '/products/custom-notebooks.html', 'assets/img/corporate_gifts/5.webp'],
            ['Calendars & Diaries', 'Year-round branded stationery for teams and clients.', '/calendars.html'],
            ['Laptop Sleeves', 'Branded protective sleeves for work and travel.', '/products/catalog/laptop-sleeves.html', 'assets/img/corporate_gifts/7.webp'],
            ['Mousepads', 'Practical branded additions to desk gift sets.', '/products/catalog/mousepads.html'],
            ['Keychains', 'Compact branded keepsakes for events and gifting.', '/products/catalog/keychains.html', 'assets/img/corporate_gifts/8.webp'],
            ['Tote Bags', 'Reusable branded bags for events and client packs.', '/products/catalog/tote-bags.html', 'assets/img/corporate_gifts/9.webp'],
            ['Lunch Bags', 'Useful branded bags for teams and everyday use.', '/products/catalog/lunch-bags.html', 'assets/img/corporate_gifts/10.webp']
        ]},
        'calendars.html': { title: 'Calendars & Diaries', image: 'assets/img/shop/Calendars.webp', items: [
            ['Custom Diaries', 'Branded diaries for planning and business gifting.', '/products/custom-diaries.html', 'assets/img/diaries_calanders/Diaries.webp'],
            ['Desk Calendars', 'Compact calendars for everyday workspaces.', '/products/desk-calendars.html', 'assets/img/diaries_calanders/Desk Calendars.webp'],
            ['Wall Calendars', 'Year-round brand visibility for offices and teams.', '/products/wall-calendars.html', 'assets/img/diaries_calanders/3.webp']
        ]},
        'drinkware.html': { title: 'Custom Drinkware', image: 'assets/img/shop/Drinkware.webp', items: [
            ['Branded Mugs', 'Custom mugs for offices, events and client gifts.', '/products/branded-mugs.html', 'assets/img/Drinkware/2.webp'],
            ['Custom Mugs', 'Personalized mug options for business campaigns.', '/products/custom-mugs.html', 'assets/img/Drinkware/1.webp'],
            ['Insulated Tumblers', 'Branded tumblers for teams and daily use.', '/products/insulated-tumblers.html', 'assets/img/Drinkware/3.webp'],
            ['Water Bottles', 'Custom bottles for events, teams and promotions.', '/products/water-bottles.html', 'assets/img/Drinkware/4.webp']
        ]},
        'express.html': { title: 'Express Print', image: 'assets/img/shop/Sameday.webp', items: [
            ['Express Business Cards', 'Business cards for time-sensitive requirements.', '/products/express-business-cards.html'],
            ['Fast Flyers', 'Promotional flyers for urgent campaigns.', '/products/fast-flyers.html'],
            ['On-Demand Posters', 'Poster printing for short-notice needs.', '/products/on-demand-posters.html']
        ]},
        'stickers.html': { title: 'Stickers & Labels', image: 'assets/img/Marketing_Promo/custom_sticker/Custom.webp', items: [
            ['Custom Stickers', 'Custom printed stickers for brands, events, promotions, packaging, and everyday use.', '/products/catalog/custom-stickers.html', 'assets/img/Marketing_Promo/custom_sticker/Custom.webp'],
            ['Die-Cut Stickers', 'Custom-shaped stickers cut precisely to your logo, artwork, character, or brand design.', '/products/catalog/die-cut-stickers.html', 'assets/img/Marketing_Promo/Die_Cut/custom_shape.png'],
            ['Product Labels', 'Professional product labels designed for packaging, branding, product information, and retail presentation.', '/products/catalog/product-labels.html', 'assets/img/Marketing_Promo/product_label/Product_label.webp'],
            ['Bottle Labels', 'Custom bottle labels for beverages, cosmetics, sauces, oils, and other packaged products.', '/products/catalog/bottle-labels.html', 'assets/img/Marketing_Promo/bottle_label/Water_Bottle_Labels.webp'],
            ['Waterproof Stickers', 'Durable waterproof stickers designed to withstand moisture, handling, and everyday outdoor use.', '/products/catalog/waterproof-stickers.html', 'assets/img/Marketing_Promo/waterproof_sticker/Outdoor_Stickers.webp'],
            ['Vinyl Stickers', 'Strong and versatile vinyl stickers for vehicles, windows, promotional displays, products, and branding.', '/products/catalog/vinyl-stickers.html', 'assets/img/Marketing_Promo/vinyl_stickers/vehicle_sticker.webp'],
            ['Transparent Stickers', 'Clear custom stickers that create a clean, premium look on bottles, packaging, glass, and other surfaces.', '/products/catalog/transparent-stickers.html', 'assets/img/Marketing_Promo/Transparent_stickers/Clear_logo_stickers.webp'],
            ['Roll Labels', 'Convenient roll labels for fast application across products, packaging, bottles, jars, and retail items.', '/products/catalog/roll-labels.html', 'assets/img/Marketing_Promo/roll_label/Product_Roll_Labels.webp']
        ]},
        'rewards-recognition.html': { title: 'Rewards & Recognition', image: 'assets/img/shop/subCatagory_hero/09-awards.webp', items: [
            ['Wooden Awards', 'Elegant wooden awards and plaques crafted for corporate recognition, employee achievements, schools, and special occasions.', '/products/catalog/wooden-awards.html', 'assets/img/awards/wooden_Awards.webp'],
            ['Trophies', 'Classic and custom trophies for sports, competitions, corporate achievements, schools, events, and recognition ceremonies.', '/products/catalog/trophies.html', 'assets/img/awards/trophies.webp'],
            ['Crystal Awards', 'Premium crystal awards designed to recognise exceptional achievements with a refined and elegant finish.', '/products/catalog/crystal-awards.html', 'assets/img/awards/cystal_awards.webp'],
            ['Acrylic Awards', 'Modern custom acrylic awards for corporate recognition, events, employee achievements, and branded celebrations.', '/products/catalog/acrylic-awards.html', 'assets/img/awards/Acrylic_Awards.webp'],
            ['Medals', 'Custom medals for sports, competitions, schools, events, employee recognition, and achievement ceremonies.', '/products/catalog/medals.html', 'assets/img/awards/medals.webp'],
            ['Certificates', 'Professionally printed certificates for achievements, training, participation, recognition, awards, and special events.', '/products/catalog/certificates.html', 'assets/img/awards/certificate.webp']
        ]},
        'packaging.html': { title: 'Custom Packaging & Accessories', image: 'assets/img/hero/packages.webp', items: [
            ['Gift Boxes', 'Custom packaging for corporate gifts and presentations.', '/products/gift-boxes.html']
        ]}
    };

    function makeDiscoveryCard(item, image) {
        var card = document.createElement('article');
        card.className = 'category-discovery-card';
        var media = document.createElement('div');
        media.className = 'category-discovery-media';
        var img = document.createElement('img');
        img.src = item[3] || image;
        img.alt = item[0];
        img.loading = 'lazy';
        media.appendChild(img);
        var copy = document.createElement('div');
        copy.className = 'category-discovery-copy';
        var heading = document.createElement('h3');
        heading.textContent = item[0];
        var description = document.createElement('p');
        description.textContent = item[1];
        var link = document.createElement('a');
        link.href = item[2];
        link.textContent = 'Explore';
        link.setAttribute('aria-label', 'Explore ' + item[0]);
        copy.append(heading, description, link);
        card.append(media, copy);
        return card;
    }

    if (isCategory) {
        var productSection = document.querySelector('.shop-category-page .shop-category-section');
        var quote = document.querySelector('.shop-category-page .shop-category-cta');
        var categoryBulkCta = document.querySelector('.shop-category-page .category-bulk-cta');
        if (productSection && (quote || categoryBulkCta)) {
            var pageKey = window.location.pathname.split('/').pop().toLowerCase();
            var catalog = categoryCatalog[pageKey];
            if (catalog) {
                var discovery = document.createElement('section');
                discovery.className = 'category-discovery-section';
                discovery.setAttribute('aria-labelledby', 'category-discovery-title');
                var discoveryInner = document.createElement('div');
                discoveryInner.className = 'container';
                var discoveryHeading = document.createElement('div');
                discoveryHeading.className = 'category-discovery-heading';
                discoveryHeading.innerHTML = '<span class="category-section-eyebrow">FIND THE RIGHT PRODUCT</span>';
                var discoveryTitle = document.createElement('h2');
                discoveryTitle.id = 'category-discovery-title';
                discoveryTitle.textContent = 'Explore ' + (pageKey === 'stationery.html' ? 'Stationery' : pageKey === 'marketing.html' ? 'Marketing Print' : pageKey === 'apparel.html' ? 'Apparel & Textiles' : pageKey === 'gifts.html' ? 'Corporate Gifts' : catalog.title);
                var discoveryIntro = document.createElement('p');
                discoveryIntro.textContent = 'Browse print options by product and explore the right fit for your business, team or event.';
                discoveryHeading.append(discoveryTitle, discoveryIntro);
                var discoveryGrid = document.createElement('div');
                discoveryGrid.className = 'category-discovery-grid';
                catalog.items.forEach(function (item) { discoveryGrid.appendChild(makeDiscoveryCard(item, catalog.image)); });
                discoveryInner.append(discoveryHeading, discoveryGrid);
                productSection.before(discovery);
                discovery.appendChild(discoveryInner);
                if (pageKey === 'packaging.html') {
                    var pageHeading = document.querySelector('.shop-category-page .page-heading h1');
                    var pageDescription = document.querySelector('.shop-category-page .page-heading p');
                    var bannerImage = document.querySelector('.shop-category-page .shop-category-banner img');
                    var bannerHeading = document.querySelector('.shop-category-page .shop-category-banner-content h2');
                    var bannerDescription = document.querySelector('.shop-category-page .shop-category-banner-content p');
                    if (pageHeading) pageHeading.textContent = catalog.title;
                    if (pageDescription) pageDescription.textContent = 'Custom packaging and accessories to elevate every gift, with options for corporate orders and branded presentation.';
                    if (bannerImage) { bannerImage.src = catalog.image; bannerImage.alt = 'Custom packaging and accessories'; }
                    if (bannerHeading) bannerHeading.textContent = 'Custom Packaging and Accessories to Elevate Every Gift';
                    if (bannerDescription) bannerDescription.textContent = 'Thoughtful packaging for corporate gifts, client presentations and branded moments.';
                }
            }
            var quoteSection = quote
                ? quote.closest('section')
                : categoryBulkCta;
            if (quoteSection && quote) quoteSection.classList.add('category-cta-section');

            var sameDay = document.createElement('section');
            sameDay.className = 'category-sameday-section';
            sameDay.innerHTML = '<div class="container category-sameday-inner"><div class="category-sameday-copy"><span class="category-section-eyebrow">LOCAL PRINT SUPPORT</span><h2>Same Day Delivery for Dubai Businesses</h2><p>Selected print jobs can be turned around quickly, with timing confirmed for your product, quantity and artwork.</p></div><ul class="category-sameday-benefits"><li>Fast Turnaround</li><li>Dubai Delivery</li><li>Business Support</li></ul><a class="theme-btn" href="https://wa.me/971582023571" target="_blank" rel="noopener">Talk to a Print Specialist</a></div>';

            var related = document.createElement('section');
            related.className = 'category-related-section';
            var relatedInner = document.createElement('div');
            relatedInner.className = 'container';
            var relatedTitle = document.createElement('h2');
            relatedTitle.textContent = 'Related print categories';
            relatedInner.appendChild(relatedTitle);
            addRelatedLinks(relatedInner, pageLinks);
            related.appendChild(relatedInner);

            productSection.after(sameDay, related);

            var faqContent = {
                'stationery.html': [
                    ['What stationery products can I order?', 'You can enquire about business cards, letterheads, notebooks and other branded office essentials shown on this page.'],
                    ['Can stationery be customized with my branding?', 'Yes. Share your logo, artwork and preferred finish so the team can advise on suitable options.'],
                    ['Can I request a bulk stationery quote?', 'Yes. Include the product mix, quantities and delivery location in your quote request for tailored pricing.'],
                    ['Can you review my print artwork?', 'The team can review supplied artwork and flag file details to confirm before production.'],
                    ['How quickly can stationery be produced?', 'Timing depends on the product, quantity, finishing and artwork approval. Ask the team to confirm the schedule for your order.']
                ],
                'marketing.html': [
                    ['What marketing print products can I order?', 'This category includes campaign print options such as flyers, leaflets and other promotional materials.'],
                    ['Can you print to my campaign specifications?', 'Share your format, quantity, artwork and preferred finish so the team can confirm the suitable options.'],
                    ['Can I order multiple campaign items together?', 'Yes. Include each item and quantity in your enquiry so the team can prepare a coordinated quote.'],
                    ['Can you check my artwork before printing?', 'The team can review supplied files and confirm production details before your order proceeds.'],
                    ['How long does campaign printing take?', 'Production timing varies by product, quantity, finishing and artwork approval. Contact the team with your deadline to check availability.']
                ],
                'apparel.html': [
                    ['What apparel can be branded?', 'Share the garment type, sizes, quantities and branding position to discuss suitable apparel options.'],
                    ['Can I request different sizes in one order?', 'Yes. Include a size breakdown with your enquiry so availability and pricing can be confirmed.'],
                    ['Which branding method should I choose?', 'The suitable method depends on the garment, artwork and intended use. The team can advise when you share those details.'],
                    ['Can you help with artwork placement?', 'Yes. Include your artwork and preferred placement for review before production.'],
                    ['How quickly can branded apparel be ready?', 'Timing depends on garment availability, quantity, branding method and artwork approval. Ask the team to confirm your schedule.']
                ],
                'gifts.html': [
                    ['What corporate gifts can I customize?', 'Share the gift type, quantity and branding requirements to explore options for your campaign or team.'],
                    ['Can gifts include our company branding?', 'Yes. Send your logo and preferred branding placement so the team can advise on available options.'],
                    ['Can I combine different gift items in one quote?', 'Yes. List each item and quantity in your enquiry for a combined proposal.'],
                    ['Can you support event or client gifting?', 'Share the event date, recipient quantities and delivery details so the team can recommend a suitable approach.'],
                    ['How long does a branded gift order take?', 'Timing varies by item, availability, quantity and branding method. Confirm your deadline with the team before ordering.']
                ],
                'calendars.html': [
                    ['What types of calendars and diaries are available?', 'Enquire about the calendar or diary format you need, along with size, quantity and branding details.'],
                    ['Can calendars be customized with our branding?', 'Yes. Provide your logo, artwork and preferred format for the team to review.'],
                    ['Can I request a bulk calendar quote?', 'Yes. Share the format, quantity and delivery location to receive a tailored quote.'],
                    ['When should I place a calendar order?', 'Lead time depends on format, quantity, finishing and artwork approval. Share your required delivery date to check timing.'],
                    ['Can you help prepare calendar artwork?', 'The team can review your supplied artwork and confirm the production requirements before printing.']
                ],
                'drinkware.html': [
                    ['What drinkware can be customized?', 'Share the drinkware style, quantity and intended use so the team can confirm available options.'],
                    ['Can drinkware include our logo?', 'Yes. Provide your logo and preferred branding position for the team to review.'],
                    ['Can I combine different drinkware styles?', 'Include each style and quantity in your enquiry so the options can be quoted together.'],
                    ['Can I request a sample or product details?', 'Mention the item you are considering in your enquiry and the team can advise on available product information.'],
                    ['How long does branded drinkware take?', 'Timing depends on product availability, quantity, branding and artwork approval. Contact the team with your deadline.']
                ],
                'express.html': [
                    ['Which print jobs may be available on the same day?', 'Same-day availability depends on the selected product, quantity, artwork readiness and current production schedule.'],
                    ['What information should I provide for an urgent job?', 'Share the product, quantity, finished size, artwork status and required delivery time so the team can check feasibility.'],
                    ['Can you review artwork for an express order?', 'Yes. Send your print-ready file with the enquiry; artwork changes or approval may affect the turnaround.'],
                    ['Is Dubai delivery available for express jobs?', 'Delivery options and timing depend on the job and destination. Confirm your location when you contact the team.'],
                    ['How do I confirm an express order?', 'Contact the team with your specifications and deadline. Production timing is confirmed after the job details and artwork are reviewed.']
                ],
                'stickers.html': [
                    ['What information should I share for a sticker or label quote?', 'Share the product type, size, quantity, material or finish, surface and artwork so the team can prepare suitable options.'],
                    ['Can stickers be cut to a custom shape?', 'Yes. Die-cut and custom-shape options can be discussed. Include your artwork or logo with the enquiry.'],
                    ['Are waterproof or outdoor options available?', 'Waterproof and vinyl options can be discussed for moisture or outdoor use. Mention where the sticker will be applied.'],
                    ['Can labels be supplied on rolls?', 'Yes. Roll labels can be requested for bottles, jars and packaging. Share your quantity and application method.'],
                    ['How soon can stickers and labels be ready in Dubai?', 'Timing depends on the product, quantity, finish and artwork approval. Share your deadline so the team can check the schedule.']
                ],
                'rewards-recognition.html': [
                    ['What information should I share for an awards quote?', 'Share the award type, quantity, size, material, engraving or print text, logo files and your required date.'],
                    ['Can awards be customised with a logo or engraving?', 'Yes. Logos, names and recognition wording can be discussed for each award type. Send your artwork with the enquiry.'],
                    ['Are certificates and medals available as well as trophies?', 'Yes. Certificates, medals, trophies and wooden, crystal and acrylic awards can all be requested.'],
                    ['Can I order awards for a school or sports event?', 'Yes. Share the event, quantity and deadline so the team can recommend suitable options.'],
                    ['How soon can awards be ready in Dubai?', 'Timing depends on the product, quantity, customisation and artwork approval. Share your deadline so the team can check the schedule.']
                ],
                'packaging.html': [
                    ['What custom packaging can I enquire about?', 'Gift boxes and branded packaging options are available to discuss. Share the intended use, quantity and presentation requirements.'],
                    ['Can packaging be customized with our branding?', 'Include your logo or artwork and preferred branding placement so the team can advise on the available approach.'],
                    ['Can packaging be ordered with corporate gifts?', 'Yes. Mention the gift items and packaging requirements together so the team can prepare a coordinated proposal.'],
                    ['Can I request a bulk packaging quote?', 'Share the quantity, delivery location and required date for a tailored corporate order quote.'],
                    ['How long does custom packaging take?', 'Timing depends on the packaging format, quantity, finishing and artwork approval. Contact the team with your delivery date.']
                ]
            };

            var slug = window.location.pathname.split('/').pop().toLowerCase();
            var questions = faqContent[slug] || [];
            var faq = document.createElement('section');
            faq.className = 'category-faq-section';
            var faqInner = document.createElement('div');
            faqInner.className = 'container category-faq-inner';
            var faqHeading = document.createElement('div');
            faqHeading.className = 'category-faq-heading';
            var eyebrow = document.createElement('span');
            eyebrow.className = 'category-section-eyebrow';
            eyebrow.textContent = 'HELP WITH YOUR ORDER';
            var heading = document.createElement('h2');
            heading.textContent = 'Frequently Asked Questions';
            faqHeading.append(eyebrow, heading);
            faqInner.appendChild(faqHeading);

            var accordion = document.createElement('div');
            accordion.className = 'accordion category-faq-accordion';
            accordion.id = 'category-faq-' + slug.replace(/[^a-z0-9-]/g, '-');
            questions.forEach(function (entry, index) {
                var collapseId = accordion.id + '-' + (index + 1);
                var item = document.createElement('div');
                item.className = 'accordion-item';
                item.innerHTML = '<h3 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' + collapseId + '" aria-expanded="false" aria-controls="' + collapseId + '"></button></h3><div id="' + collapseId + '" class="accordion-collapse collapse" data-bs-parent="#' + accordion.id + '"><div class="accordion-body"></div></div>';
                item.querySelector('.accordion-button').textContent = entry[0];
                item.querySelector('.accordion-body').textContent = entry[1];
                accordion.appendChild(item);
            });
            faqInner.appendChild(accordion);
            faq.appendChild(faqInner);
            if (quoteSection) quoteSection.after(faq);

            if (quote && !catalog) {
                quote.querySelector('h2').textContent = 'Need a custom printing solution?';
                quote.querySelector('p').textContent = 'Share your requirements and we’ll prepare a tailored proposal with samples and pricing.';
                quote.classList.add('category-visual-cta');
                var ctaEyebrow = document.createElement('span');
                ctaEyebrow.className = 'category-cta-eyebrow';
                ctaEyebrow.textContent = 'PRINTED & DELIVERED BY PRINT ADVERTISING';
                quote.prepend(ctaEyebrow);
                quote.querySelector('h2').textContent = 'Need Printing for Your Next Project?';
                quote.querySelector('p').textContent = 'From everyday business essentials to large corporate orders, we make printing simple.';
                var quoteLink = quote.querySelector('a[href]');
                if (quoteLink) {
                    quoteLink.textContent = 'GET A QUOTE';
                }
            }
        }
    } else {
        var relatedSection = document.querySelector('.shop-subcategory-page .catalog-related');
        if (relatedSection) {
            var catalogH1 = catalogHero.querySelector('h1');
            var catalogName = catalogH1 ? catalogH1.textContent.trim() : document.title;
            var catalogKey = document.body.getAttribute('data-subcategory-key') || window.location.pathname.split('/').pop().replace(/\.html$/i, '');
            var catalogMeta = {
                'rubber-stamps': ['/stationery.html', 'assets/img/shop-banner/stationery-banner.webp', 'Rubber Stamps'],
                'brochures': ['/stationery.html', 'assets/img/shop-banner/stationery-banner.webp', 'Brochures'],
                'booklets': ['/stationery.html', 'assets/img/shop-banner/stationery-banner.webp', 'Booklets'],
                'id-cards': ['/stationery.html', 'assets/img/shop-banner/stationery-banner.webp', 'ID Cards'],
                'button-badges': ['/stationery.html', 'assets/img/shop-banner/stationery-banner.webp', 'Button Badges'],
                'notepads': ['/stationery.html', 'assets/img/shop-banner/stationery-banner.webp', 'Notepads'],
                'event-standees': ['/marketing.html', 'assets/img/shop-banner/marketing-banner.webp', 'Event Standees'],
                'sun-board-signs': ['/marketing.html', 'assets/img/shop-banner/marketing-banner.webp', 'Sun Board Signs'],
                'name-plates': ['/marketing.html', 'assets/img/shop-banner/marketing-banner.webp', 'Name Plates'],
                'event-backdrops': ['/marketing.html', 'assets/img/shop-banner/marketing-banner.webp', 'Event Backdrops'],
                'decals': ['/marketing.html', 'assets/img/shop-banner/marketing-banner.webp', 'Decals'],
                'danglers': ['/marketing.html', 'assets/img/shop-banner/marketing-banner.webp', 'Danglers'],
                'apparel-backpacks': ['/apparel.html', 'assets/img/shop-banner/apparel-banner.webp', 'Custom Backpacks'],
                'sweatshirts-hoodies': ['/apparel.html', 'assets/img/Apparel/Custom_Printed_Sweatshirt.webp', 'Custom Printed Sweatshirts & Hoodies'],
                'sports-jerseys': ['/apparel.html', 'assets/img/Apparel/Custom_Sports_Jerseys.webp', 'Custom Sports Jerseys'],
                'gift-backpacks': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Backpacks'],
                'desk-accessories': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Desk Accessories'],
                'pens': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Pens'],
                'laptop-sleeves': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Laptop Sleeves'],
                'mousepads': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Mousepads'],
                'keychains': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Keychains'],
                'tote-bags': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Tote Bags'],
                'wooden-awards': ['/rewards-recognition.html', 'assets/img/hero/Vibrant Print Branding Showcase.webp', 'Wooden Awards'],
                'trophies': ['/rewards-recognition.html', 'assets/img/hero/Vibrant Print Branding Showcase.webp', 'Trophies'],
                'crystal-awards': ['/rewards-recognition.html', 'assets/img/hero/Vibrant Print Branding Showcase.webp', 'Crystal Awards'],
                'acrylic-awards': ['/rewards-recognition.html', 'assets/img/hero/Vibrant Print Branding Showcase.webp', 'Acrylic Awards'],
                'medals': ['/rewards-recognition.html', 'assets/img/hero/Vibrant Print Branding Showcase.webp', 'Medals'],
                'certificates': ['/rewards-recognition.html', 'assets/img/hero/Vibrant Print Branding Showcase.webp', 'Certificates'],
                'custom-stickers': ['/stickers.html', 'assets/img/Marketing_Promo/custom_sticker/Custom.webp', 'Custom Stickers'],
                'die-cut-stickers': ['/stickers.html', 'assets/img/Marketing_Promo/Die_Cut/Die_Cut.png', 'Die-Cut Stickers'],
                'product-labels': ['/stickers.html', 'assets/img/Marketing_Promo/product_label/Product_label.webp', 'Product Labels'],
                'bottle-labels': ['/stickers.html', 'assets/img/Marketing_Promo/bottle_label/Water_Bottle_Labels.webp', 'Bottle Labels'],
                'waterproof-stickers': ['/stickers.html', 'assets/img/Marketing_Promo/waterproof_sticker/Outdoor_Stickers.webp', 'Waterproof Stickers'],
                'vinyl-stickers': ['/stickers.html', 'assets/img/Marketing_Promo/vinyl_stickers/vinyl_logo_sticker.webp', 'Vinyl Stickers'],
                'transparent-stickers': ['/stickers.html', 'assets/img/Marketing_Promo/Transparent_stickers/Clear_logo_stickers.webp', 'Transparent Stickers'],
                'roll-labels': ['/stickers.html', 'assets/img/Marketing_Promo/roll_label/Product_Roll_Labels.webp', 'Roll Labels'],
                'lunch-bags': ['/gifts.html', 'assets/img/shop-banner/gifts-banner.webp', 'Lunch Bags']
            };
            var meta = catalogMeta[catalogKey];
            var parentPath = parentLink ? new URL(parentLink.href, window.location.href).pathname : (meta ? meta[0] : '/all-categories.html');
            var bannerSrc = meta ? meta[1] : parentPath.indexOf('stationery') > -1 ? 'assets/img/shop-banner/stationery-banner.webp' : parentPath.indexOf('marketing') > -1 ? 'assets/img/shop-banner/marketing-banner.webp' : parentPath.indexOf('apparel') > -1 ? 'assets/img/shop-banner/apparel-banner.webp' : parentPath.indexOf('gifts') > -1 ? 'assets/img/shop-banner/gifts-banner.webp' : 'assets/img/shop-banner/shop-banner.png';
            if (meta) catalogName = meta[2];
            var parentCategory = parentPath.split('/').pop().replace('.html', '');
            var catalogImage = document.createElement('section');
            catalogImage.className = 'catalog-banner';
            catalogImage.innerHTML = '<div class="container"><img src="/' + bannerSrc.replace(/^\//, '') + '" alt="' + catalogName + ' printing banner" loading="eager"></div>';
            catalogHero.after(catalogImage);
            var gridWrap = document.querySelector('.shop-subcategory-page .catalog-grid-wrap');
            if (gridWrap) {
                var grid = gridWrap.querySelector('.catalog-grid');
                var optionsHeading = document.createElement('div');
                optionsHeading.className = 'catalog-options-heading';
                optionsHeading.innerHTML = '<span class="category-section-eyebrow">PRODUCT OPTIONS</span><h2>Explore ' + catalogName + '</h2><p>Choose the format that fits your project. Share your quantity, artwork and delivery requirements for a tailored quote.</p>';
                gridWrap.querySelector('.container').prepend(optionsHeading);
                if (grid && !grid.children.length) {
                    grid.innerHTML = '<article class="catalog-card catalog-enquiry-card"><h2>' + catalogName + '</h2><p>Tell us what you need and our Dubai print team will help confirm suitable options for your order.</p><a class="theme-btn" href="/contact.html">Request a quote</a></article>';
                }
            }
            addRelatedLinks(relatedSection.querySelector('.container'), pageLinks);
            var sameDaySection = document.createElement('section');
            sameDaySection.className = 'catalog-sameday';
            sameDaySection.innerHTML = '<div class="container"><div><span class="category-section-eyebrow">LOCAL PRINT SUPPORT</span><h2>Same Day Delivery for Dubai Businesses</h2><p>Timing depends on the product, order details and artwork approval. Our team can help check your schedule.</p></div><ul><li>Fast Turnaround</li><li>Dubai Delivery</li><li>Business Support</li></ul><a class="theme-btn" href="https://wa.me/971582023571" target="_blank" rel="noopener">Talk to a Print Specialist</a></div>';
            var cta = document.createElement('section');
            cta.className = 'catalog-cta catalog-compact-cta';
            cta.innerHTML = '<div class="container"><div class="catalog-compact-cta-content"><h2>Need a custom print quote?</h2><p>Share your quantity, artwork and delivery requirements for a tailored proposal.</p><a class="theme-btn" href="/contact.html">GET A QUOTE</a></div></div>';
            var faq = document.createElement('section');
            faq.className = 'catalog-faq-section';
            var faqInner = document.createElement('div');
            faqInner.className = 'container';
            faqInner.innerHTML = '<div class="category-faq-heading"><span class="category-section-eyebrow">HELP WITH YOUR ORDER</span><h2>Frequently Asked Questions</h2></div>';
            var subFaq = document.createElement('div');
            subFaq.className = 'accordion category-faq-accordion';
            subFaq.id = 'subcategory-faq-' + catalogKey.replace(/[^a-z0-9-]/g, '-');
            var faqItems = [
                ['What information should I share to request ' + catalogName.toLowerCase() + '?', 'Share the quantity, intended use, delivery location and any preferred format or finish so the team can prepare relevant options.'],
                ['Can I include my company branding?', 'Yes. Include your artwork or logo and describe the branding placement you have in mind. The team can confirm the available approach for your order.'],
                ['Can I place a bulk or corporate order?', 'Yes. Include your quantities and any delivery schedule in your enquiry so the team can prepare a proposal for your requirements.'],
                ['Can you review my artwork before production?', 'The team can review supplied artwork and confirm file or production details before the order proceeds.'],
                ['How soon can this order be ready in Dubai?', 'Timing varies by product, quantity, finishing and artwork approval. Share your deadline so the team can check the schedule.']
            ];
            faqItems.forEach(function (entry, index) {
                var id = subFaq.id + '-' + (index + 1);
                var item = document.createElement('div');
                item.className = 'accordion-item';
                item.innerHTML = '<h3 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' + id + '" aria-expanded="false" aria-controls="' + id + '"></button></h3><div id="' + id + '" class="accordion-collapse collapse" data-bs-parent="#' + subFaq.id + '"><div class="accordion-body"></div></div>';
                item.querySelector('.accordion-button').textContent = entry[0];
                item.querySelector('.accordion-body').textContent = entry[1];
                subFaq.appendChild(item);
            });
            faqInner.appendChild(subFaq);
            faq.appendChild(faqInner);
            gridWrap.after(sameDaySection);
            relatedSection.after(cta, faq);
        }
    }
})();
