(function () {
    'use strict';

    var hero = document.querySelector('[data-hero-rotator]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.landing-hero-slide'));
        var dots = document.querySelector('.landing-hero-dots');
        var arrows = hero.parentNode.querySelectorAll('[data-hero-direction]');
        var active = Math.max(0, slides.findIndex(function (slide) { return slide.classList.contains('is-active'); }));
        var timer;

        if (dots && slides.length > 1) {
            dots.innerHTML = '';
            slides.forEach(function (_, index) {
                var button = document.createElement('button');
                button.type = 'button';
                button.setAttribute('aria-label', 'Show featured product ' + (index + 1));
                button.addEventListener('click', function () { show(index); restart(); });
                dots.appendChild(button);
            });
        }

        Array.prototype.forEach.call(arrows, function (button) {
            button.addEventListener('click', function () {
                show(active + (button.getAttribute('data-hero-direction') === 'next' ? 1 : -1));
                restart();
            });
        });

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
                slide.setAttribute('aria-hidden', i === active ? 'false' : 'true');
            });
            if (dots) Array.prototype.forEach.call(dots.children, function (dot, i) {
                dot.classList.toggle('is-active', i === active);
                dot.setAttribute('aria-current', i === active ? 'true' : 'false');
            });
        }
        function restart() {
            window.clearInterval(timer);
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && slides.length > 1) {
                timer = window.setInterval(function () { show(active + 1); }, 5200);
            }
        }
        hero.addEventListener('mouseenter', function () { window.clearInterval(timer); });
        hero.addEventListener('mouseleave', restart);
        hero.addEventListener('focusin', function () { window.clearInterval(timer); });
        hero.addEventListener('focusout', restart);
        show(active);
        restart();
    }

    var carousel = document.querySelector('[data-product-carousel]');
    if (carousel) {
        var section = carousel.closest('.landing-bestsellers');
        var progress = section && section.querySelector('.landing-carousel-progress span');
        var controls = section && section.querySelectorAll('[data-carousel-direction]');
        function updateProgress() {
            if (!progress) return;
            var max = carousel.scrollWidth - carousel.clientWidth;
            var ratio = max > 0 ? carousel.scrollLeft / max : 0;
            var visibleRatio = carousel.scrollWidth > 0 ? carousel.clientWidth / carousel.scrollWidth : 1;
            progress.style.width = Math.max(visibleRatio * 100, 18) + '%';
            progress.style.transform = 'translateX(' + (ratio * (100 - Math.max(visibleRatio * 100, 18))) + '%)';
        }
        Array.prototype.forEach.call(controls || [], function (button) {
            button.addEventListener('click', function () {
                var direction = button.getAttribute('data-carousel-direction') === 'next' ? 1 : -1;
                carousel.scrollBy({ left: direction * carousel.clientWidth * 0.82, behavior: 'smooth' });
            });
        });
        carousel.addEventListener('scroll', updateProgress, { passive: true });
        carousel.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                carousel.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * 280, behavior: 'smooth' });
            }
        });
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }
})();
