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

/* ---- Coverflow Carousel ---- */

(function () {
    const track = document.querySelector(".coverflow-track");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(".coverflow-slide"));
    const prevBtn = document.querySelector(".coverflow-prev");
    const nextBtn = document.querySelector(".coverflow-next");
    const label = document.querySelector(".coverflow-label");
    const total = slides.length;
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
        const coverflow = document.querySelector(".coverflow");
        if (!coverflow) return;
        const rect = coverflow.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        if (e.key === "ArrowLeft") { prev(); stopAuto(); startAuto(); }
        if (e.key === "ArrowRight") { next(); stopAuto(); startAuto(); }
    });

    layout();
    startAuto();
})();
