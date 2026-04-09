/* ---- Nav scroll highlighting ---- */

const navContainers = document.querySelectorAll("[data-section-nav]");

if ("IntersectionObserver" in window && navContainers.length > 0) {
    const sections = Array.from(
        document.querySelectorAll("main section[id]")
    );

    navContainers.forEach((navContainer) => {
        const links = Array.from(navContainer.querySelectorAll('a[href^="#"]'));
        const linkMap = new Map(
            links.map((link) => [link.getAttribute("href").slice(1), link])
        );

        const setCurrent = (id) => {
            links.forEach((link) => {
                const isCurrent = link.getAttribute("href") === `#${id}`;
                if (isCurrent) {
                    link.setAttribute("aria-current", "true");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        };

        const initialId = window.location.hash.replace("#", "");
        if (linkMap.has(initialId)) {
            setCurrent(initialId);
        } else if (links.length > 0) {
            setCurrent(links[0].getAttribute("href").slice(1));
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visible) return;
                if (linkMap.has(visible.target.id)) {
                    setCurrent(visible.target.id);
                }
            },
            {
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0.2, 0.45, 0.7]
            }
        );

        sections.forEach((section) => {
            if (linkMap.has(section.id)) {
                observer.observe(section);
            }
        });
    });
}

const COMMERCE_CONFIG = {
    bird: {
        sectionLabel: "Photography",
        ctaLabel: "Prints & Downloads",
        href: "prints-and-downloads.html",
        emailSubjectPrefix: "Print inquiry"
    },
    nail: {
        sectionLabel: "Nail Art",
        ctaLabel: "Order These Nails",
        href: "order-nails.html",
        emailSubjectPrefix: "Nail order inquiry"
    }
};

function normalizeText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
}

function getCategoryFromElement(element) {
    if (!element) return null;

    if (typeof element.getAttribute === "function") {
        const directCategory = element.getAttribute("data-commerce-category");
        if (directCategory) return directCategory;
    }

    const taggedAncestor = element.closest?.("[data-commerce-category]");
    if (taggedAncestor) {
        return taggedAncestor.getAttribute("data-commerce-category");
    }

    if (element.closest?.("#photography")) return "bird";
    if (element.closest?.("#nails")) return "nail";

    return null;
}

function getMediaTitle(element) {
    if (!element) return "";

    if (typeof element.getAttribute === "function") {
        const explicitTitle = element.getAttribute("data-commerce-title");
        if (explicitTitle) return normalizeText(explicitTitle);
    }

    const figureTitle = element.closest?.("figure")?.querySelector("figcaption strong")?.textContent;
    if (figureTitle) return normalizeText(figureTitle);

    const slide = element.closest?.(".coverflow-slide");
    const slideTitle = slide?.getAttribute("data-commerce-title");
    if (slideTitle) return normalizeText(slideTitle);

    const altText = typeof element.getAttribute === "function" ? element.getAttribute("alt") : "";
    return normalizeText(altText);
}

function getCommerceDetails(sourceElement) {
    const category = getCategoryFromElement(sourceElement);
    const config = category ? COMMERCE_CONFIG[category] : null;
    if (!config) return null;

    const title = getMediaTitle(sourceElement);
    const imageSrc = typeof sourceElement.getAttribute === "function"
        ? sourceElement.getAttribute("src")
        : "";

    const url = new URL(config.href, window.location.href);
    if (title) url.searchParams.set("title", title);
    if (imageSrc) url.searchParams.set("image", imageSrc);

    return {
        category,
        title,
        ctaLabel: config.ctaLabel,
        href: `${url.pathname}${url.search}`
    };
}

function hydrateCommerceLink(link, sourceElement) {
    const commerce = getCommerceDetails(sourceElement);
    if (!commerce) return false;

    link.href = commerce.href;
    link.textContent = commerce.ctaLabel;
    link.setAttribute("data-commerce-category", commerce.category);

    if (commerce.title) {
        link.setAttribute("aria-label", `${commerce.ctaLabel} for ${commerce.title}`);
    } else {
        link.setAttribute("aria-label", commerce.ctaLabel);
    }

    return true;
}

function initializeCommerceLinks() {
    const cardLinks = document.querySelectorAll(".media-card-cta");
    cardLinks.forEach((link) => {
        const sourceImage = link.closest("figure")?.querySelector("img");
        if (sourceImage) {
            hydrateCommerceLink(link, sourceImage);
        }
    });
}

initializeCommerceLinks();

/* ---- Coverflow Carousel ---- */

(function () {
    const coverflow = document.querySelector(".coverflow");
    const track = document.querySelector(".coverflow-track");
    if (!coverflow || !track) return;

    function collectGalleryItems(selector, category) {
        const container = document.querySelector(selector);
        if (!container) return [];

        const config = COMMERCE_CONFIG[category];
        if (!config) return [];

        const items = [];
        const seen = new Set();

        container.querySelectorAll("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (!src || seen.has(src)) return;

            seen.add(src);

            const figure = img.closest("figure");
            const figureTitle = figure?.querySelector("figcaption strong")?.textContent;
            const title = normalizeText(figureTitle || img.getAttribute("alt"));
            const alt = normalizeText(img.getAttribute("alt") || title);

            items.push({
                category,
                src,
                alt,
                title: title || alt || "Untitled",
                label: `${config.sectionLabel} · ${title || alt || "Untitled"}`
            });
        });

        return items;
    }

    function interleaveCollections(collections) {
        const queues = collections.map((items) => items.slice());
        const merged = [];
        let hasItems = true;

        while (hasItems) {
            hasItems = false;

            queues.forEach((queue) => {
                if (queue.length === 0) return;
                merged.push(queue.shift());
                hasItems = true;
            });
        }

        return merged;
    }

    const photographyItems = collectGalleryItems("#photography .bird-grid", "bird");
    const nailItems = collectGalleryItems("#nails .nail-grid", "nail");
    const coverflowItems = interleaveCollections([photographyItems, nailItems]);

    if (coverflowItems.length > 0) {
        const slides = coverflowItems.map((item, index) => {
            const slide = document.createElement("div");
            slide.className = "coverflow-slide";
            slide.setAttribute("data-label", item.label);
            slide.setAttribute("data-commerce-category", item.category);
            slide.setAttribute("data-commerce-title", item.title);

            const image = document.createElement("img");
            image.src = item.src;
            image.alt = item.alt || item.label;
            image.loading = index < 6 ? "eager" : "lazy";
            image.decoding = "async";
            image.setAttribute("data-commerce-category", item.category);
            image.setAttribute("data-commerce-title", item.title);

            slide.appendChild(image);
            return slide;
        });

        track.replaceChildren(...slides);
    }

    const slides = Array.from(track.querySelectorAll(".coverflow-slide"));
    const prevBtn = document.querySelector(".coverflow-prev");
    const nextBtn = document.querySelector(".coverflow-next");
    const label = document.querySelector(".coverflow-label");
    const total = slides.length;
    if (total === 0) return;

    let current = 0;
    let autoTimer = null;

    function layout() {
        slides.forEach((slide, i) => {
            let pos = i - current;

            if (pos > Math.floor(total / 2)) pos -= total;
            if (pos < -Math.floor(total / 2)) pos += total;

            if (Math.abs(pos) > 3) {
                slide.style.visibility = "hidden";
                slide.removeAttribute("data-pos");
            } else {
                slide.style.visibility = "visible";
                slide.setAttribute("data-pos", pos);
            }
        });

        if (label) {
            label.textContent = slides[current].getAttribute("data-label") || "";
        }
    }

    function goTo(index) {
        current = ((index % total) + total) % total;
        layout();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        if (total < 2) return;
        stopAuto();
        autoTimer = setInterval(next, 4000);
    }

    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); stopAuto(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { next(); stopAuto(); startAuto(); });

    slides.forEach((slide, i) => {
        slide.addEventListener("click", () => {
            if (i !== current) {
                goTo(i);
                stopAuto();
                startAuto();
            }
        });
    });

    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        stopAuto();
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            dx > 0 ? prev() : next();
        }
        startAuto();
    }, { passive: true });

    document.addEventListener("keydown", (e) => {
        const rect = coverflow.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        if (e.key === "ArrowLeft") { prev(); stopAuto(); startAuto(); }
        if (e.key === "ArrowRight") { next(); stopAuto(); startAuto(); }
    });

    layout();
    startAuto();
})();

/* ---- Lightbox Gallery ---- */

(function() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    const overlay = document.getElementById("lightbox-close-overlay");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const imgEl = document.querySelector(".lightbox-img");
    const captionEl = document.querySelector(".lightbox-caption");
    const commerceLink = document.querySelector(".lightbox-commerce");

    let currentGallery = [];
    let currentIndex = 0;

    function openLightbox(imgElement) {
        // Group by section containers
        const container = imgElement.closest(".coverflow-track, .bird-grid, .nail-grid");
        if (!container) return;

        currentGallery = Array.from(container.querySelectorAll("img"));
        currentIndex = currentGallery.indexOf(imgElement);

        if (currentIndex === -1) return;

        updateLightbox();
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function updateLightbox() {
        const item = currentGallery[currentIndex];
        if (!item) return;
        
        imgEl.src = item.src;
        imgEl.alt = item.alt;
        
        let captionText = "";
        const figure = item.closest("figure");
        if (figure) {
            const figcap = figure.querySelector("figcaption strong");
            if (figcap) captionText = figcap.textContent;
        } else {
            const slide = item.closest(".coverflow-slide");
            if (slide) {
                captionText = slide.getAttribute("data-label");
            }
        }
        
        captionEl.textContent = captionText || item.alt || "";

        if (commerceLink) {
            const hasCommerce = hydrateCommerceLink(commerceLink, item);
            commerceLink.hidden = !hasCommerce;
        }
    }

    function nextImage() {
        if (!currentGallery.length) return;
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox();
    }

    function prevImage() {
        if (!currentGallery.length) return;
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    }

    const allGalleryItems = document.querySelectorAll(".bird-card, .nail-card");
    allGalleryItems.forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.closest("[data-commerce-link]")) return;
            const img = card.querySelector("img");
            if (img) openLightbox(img);
        });
    });

    const slides = document.querySelectorAll(".coverflow-slide");
    slides.forEach((slide) => {
        slide.addEventListener("click", (e) => {
            if (slide.getAttribute("data-pos") === "0") {
                const img = slide.querySelector("img");
                if (img) openLightbox(img);
            }
        });
    });

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", nextImage);
    prevBtn.addEventListener("click", prevImage);

    document.addEventListener("keydown", (e) => {
        if (lightbox.getAttribute("aria-hidden") === "false") {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        }
    });
})();

/* ---- Commerce Placeholder Pages ---- */

(function () {
    const page = document.querySelector("[data-commerce-page]");
    if (!page) return;

    const category = page.getAttribute("data-commerce-page");
    const config = COMMERCE_CONFIG[category];
    if (!config) return;

    const params = new URLSearchParams(window.location.search);
    const selectedTitle = normalizeText(params.get("title")) || page.getAttribute("data-fallback-title") || "Selected work";
    const selectedImage = params.get("image");

    const titleTargets = document.querySelectorAll("[data-commerce-title]");
    titleTargets.forEach((target) => {
        target.textContent = selectedTitle;
    });

    const previewWrap = page.querySelector("[data-commerce-preview-wrap]");
    const previewImage = page.querySelector("[data-commerce-preview]");
    if (previewWrap && previewImage && selectedImage) {
        previewWrap.hidden = false;
        previewImage.src = selectedImage;
        previewImage.alt = selectedTitle;
    }

    const contactLink = page.querySelector("[data-commerce-contact]");
    if (contactLink) {
        const body = category === "nail"
            ? `Hi Travis,\n\nI’m interested in ordering the nail set "${selectedTitle}".\n\nCan you send me details when this is ready?\n`
            : `Hi Travis,\n\nI’m interested in prints/downloads for "${selectedTitle}".\n\nCan you send me details when this is ready?\n`;

        contactLink.href = `mailto:travis@travisbarton.com?subject=${encodeURIComponent(`${config.emailSubjectPrefix}: ${selectedTitle}`)}&body=${encodeURIComponent(body)}`;
    }
})();

/* ---- Contact Modal ---- */
(function() {
    const modal = document.getElementById("contact-modal");
    if (!modal) return;

    const triggers = document.querySelectorAll("[data-contact-btn]");
    const closeBtns = document.querySelectorAll("[data-close-modal]");
    const form = document.getElementById("contact-form");
    
    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
        setTimeout(() => document.getElementById("contact-subject")?.focus(), 100);
    }
    
    function closeModal(e) {
        if (e) e.preventDefault();
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
    
    triggers.forEach(btn => btn.addEventListener("click", openModal));
    closeBtns.forEach(btn => btn.addEventListener("click", closeModal));
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const subject = encodeURIComponent(document.getElementById("contact-subject").value || "Hello from travisbarton.com");
            const message = encodeURIComponent(document.getElementById("contact-message").value);
            
            // Use an anchor tag to ensure the mailto link opens reliably
            const mailtoLink = document.createElement('a');
            mailtoLink.href = `mailto:travis@travisbarton.com?subject=${subject}&body=${message}`;
            mailtoLink.target = "_blank";
            mailtoLink.click();
            
            closeModal();
            form.reset();
        });
    }
})();
