(function () {
    const WHATSAPP_NUMBER = "971582023571";

    function trackEvent(eventName, payload) {
        const data = Object.assign({ event: eventName }, payload || {});
        if (Array.isArray(window.dataLayer)) window.dataLayer.push(data);
        if (typeof window.gtag === "function") window.gtag("event", eventName, payload || {});
    }

    document.querySelectorAll("[data-track='whatsapp']").forEach(function (link) {
        link.addEventListener("click", function () {
            trackEvent("whatsapp_click", {
                click_source: link.dataset.source || "unknown",
                page_path: window.location.pathname
            });
        });
    });

    var form = document.getElementById("quoteForm");
    var note = document.getElementById("formNote");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            note.textContent = "Please complete all required fields.";
            note.style.color = "#e63946";
            form.reportValidity();
            return;
        }

        var formData = new FormData(form);
        var payload = {
            name: String(formData.get("name") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            service: String(formData.get("service") || "").trim(),
            message: String(formData.get("message") || "").trim()
        };

        trackEvent("quote_form_submit", {
            selected_service: payload.service,
            lead_source: "landing-page",
            page_path: window.location.pathname
        });

        var waText = [
            "Hi P R I N T Advertising, I need a quote:",
            "Name: " + payload.name,
            "Phone: " + payload.phone,
            "Email: " + payload.email,
            "Service: " + payload.service,
            "Message: " + payload.message
        ].join("\n");

        note.textContent = "Thank you! Redirecting to WhatsApp...";
        note.style.color = "#25d366";

        setTimeout(function () {
            window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waText), "_blank", "noopener");
            form.reset();
            note.textContent = "Your details are used only to prepare your quote. We reply within 30 minutes.";
            note.style.color = "";
        }, 600);
    });

    var revealItems = document.querySelectorAll("[data-reveal]");
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach(function (item) { observer.observe(item); });

    var modalOverlay = document.querySelector('.modal-overlay');
    var modalClose = document.querySelector('.modal-close');

    function closeEnquiryModal() {
        document.body.classList.remove('modal-open');
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeEnquiryModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeEnquiryModal);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeEnquiryModal();
        }
    });

    document.body.classList.add('modal-open');

    document.getElementById("year").textContent = new Date().getFullYear();
})();
