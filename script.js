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

                if (!visible) {
                    return;
                }

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

// Carousel Functionality
const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector(".carousel-button.next");
    const prevButton = carousel.querySelector(".carousel-button.prev");
    const dotsNav = carousel.querySelector(".carousel-dots");
    
    let currentIndex = 0;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("carousel-dot");
        if (index === 0) dot.classList.add("active");
        dot.setAttribute("aria-label", `Slide ${index + 1}`);
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const updateCarousel = (index) => {
        currentIndex = index;
        
        // Centering logic
        const containerWidth = carousel.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const trackOffset = (containerWidth / 2) - (slideWidth / 2) - (index * (slideWidth - 100)); // Account for overlap
        
        track.style.transform = `translateX(${trackOffset}px)`;
        
        // Update active classes
        slides.forEach((slide, i) => {
            slide.classList.remove("active", "prev-active");
            if (i === index) {
                slide.classList.add("active");
            } else if (i < index) {
                slide.classList.add("prev-active");
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    };

    const nextSlide = () => {
        const index = (currentIndex + 1) % slides.length;
        updateCarousel(index);
    };

    const prevSlide = () => {
        const index = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(index);
    };

    // AutoPlay
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    // Event Listeners
    nextButton.addEventListener("click", () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    prevButton.addEventListener("click", () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    dotsNav.addEventListener("click", (e) => {
        const targetDot = e.target.closest("button");
        if (!targetDot) return;
        
        const index = dots.indexOf(targetDot);
        updateCarousel(index);
        stopAutoPlay();
        startAutoPlay();
    });

    // Pause on hover
    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);

    // Initial positioning
    window.addEventListener("resize", () => updateCarousel(currentIndex));
    setTimeout(() => updateCarousel(0), 100);
    startAutoPlay();
});
