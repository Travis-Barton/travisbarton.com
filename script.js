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

