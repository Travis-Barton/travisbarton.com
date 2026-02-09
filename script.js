// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation items on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form submission handling (using Formspree)
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', function(e) {
        // Check if using the placeholder form action
        if (this.action.includes('YOUR_FORM_ID')) {
            e.preventDefault();
            alert('Please configure Formspree by replacing YOUR_FORM_ID in index.html with your actual Formspree form ID. Visit https://formspree.io/ to create a free form endpoint.');
            return;
        }
        
        // If form is properly configured, let it submit normally
        // Formspree will handle the actual email sending
    });
}

// Add scroll reveal animation (disabled on the main page to avoid fighting ghost text)
if (document.body.classList.contains('project-body')) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards and about section content
    document.querySelectorAll('.project-card, .about-content').forEach(target => {
        target.style.opacity = '0';
        target.style.transform = 'translateY(20px)';
        target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(target);
    });
}

// Streamed text effect for the project post
if (document.body.classList.contains('project-body')) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const textSelector = '.article-kicker, .article-title, .article-subtitle, .meta-pill, .video-badge, .video-title, .video-text, .article-heading, .article-section p, .article-section li, .article-footnote';
    const blockSelector = '.article-card, .article-callout, .article-links';
    const sequence = Array.from(document.querySelectorAll(`${blockSelector}, ${textSelector}`));

    if (!reducedMotion && sequence.length > 0) {
        const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
        const pageTop = (element) => element.getBoundingClientRect().top + window.scrollY;
        let scrollVelocity = 0;
        let lastScrollY = window.scrollY;
        let lastScrollTime = performance.now();

        window.addEventListener('scroll', () => {
            const now = performance.now();
            const deltaY = Math.abs(window.scrollY - lastScrollY);
            const deltaT = Math.max(1, now - lastScrollTime);
            const instantVelocity = deltaY / deltaT; // px/ms

            // Keep it stable but responsive to quick scroll changes.
            scrollVelocity = (scrollVelocity * 0.6) + (instantVelocity * 0.4);
            lastScrollY = window.scrollY;
            lastScrollTime = now;
        }, { passive: true });

        const buildGhostChars = (element) => {
            if (element.dataset.streamBuilt === '1') {
                return element.querySelectorAll('.llm-char').length;
            }

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            const textNodes = [];
            let node = walker.nextNode();
            while (node) {
                if (node.nodeValue && node.nodeValue.trim().length > 0) {
                    textNodes.push(node);
                }
                node = walker.nextNode();
            }

            let count = 0;
            textNodes.forEach((textNode) => {
                const fragment = document.createDocumentFragment();
                const tokens = textNode.nodeValue.split(/(\s+)/);
                tokens.forEach((token) => {
                    if (!token) return;
                    if (/^\s+$/.test(token)) {
                        fragment.appendChild(document.createTextNode(token));
                        return;
                    }

                    const word = document.createElement('span');
                    word.className = 'llm-word';
                    for (const char of token) {
                        const span = document.createElement('span');
                        span.className = 'llm-char';
                        span.textContent = char;
                        word.appendChild(span);
                        count += 1;
                    }
                    fragment.appendChild(word);
                });
                textNode.parentNode.replaceChild(fragment, textNode);
            });

            element.dataset.streamBuilt = '1';
            return count;
        };

        const streamElement = (element, getBoost) => new Promise((resolve) => {
            const chars = Array.from(element.querySelectorAll('.llm-char'));
            if (!chars.length) {
                element.style.visibility = 'visible';
                resolve();
                return;
            }

            element.classList.add('llm-stream');
            element.style.visibility = 'visible';
            chars.forEach((char) => char.classList.remove('llm-char-on'));

            let index = 0;
            const baseBurst = element.tagName.startsWith('H') ? 1 : 2;
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve();
            };

            const step = () => {
                if (done) return;
                if (index >= chars.length) {
                    finish();
                    return;
                }

                let pause = 0;
                const boost = getBoost ? getBoost() : 0;
                const burst = baseBurst + boost;
                for (let i = 0; i < burst && index < chars.length; i += 1) {
                    const current = chars[index];
                    current.classList.add('llm-char-on');
                    if (/[.,!?;:]/.test(current.textContent || '')) {
                        pause = 1;
                    }
                    index += 1;
                }

                if (boost >= 3) {
                    pause = 0;
                }
                window.setTimeout(step, pause);
            };

            window.setTimeout(step, 0);
        });

        const revealBlock = (element) => new Promise((resolve) => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            window.setTimeout(resolve, 36);
        });

        const gridElements = Array.from(document.querySelectorAll('.article-grid'));
        const getGridId = (element) => {
            const grid = element.closest('.article-grid');
            if (!grid) return null;
            return gridElements.indexOf(grid);
        };

        const getPhaseKey = (element, index) => {
            if (element.matches(blockSelector)) {
                if (element.classList.contains('article-card')) {
                    const gridId = getGridId(element);
                    if (gridId >= 0) return `grid-${gridId}-block`;
                }
                return `single-block-${index}`;
            }

            const card = element.closest('.article-card');
            if (card) {
                const gridId = getGridId(card);
                if (gridId >= 0) {
                    const cardTextTargets = Array.from(card.querySelectorAll(textSelector));
                    const textIndex = cardTextTargets.indexOf(element);
                    if (textIndex >= 0) return `grid-${gridId}-text-${textIndex}`;
                }
            }

            return `single-text-${index}`;
        };

        const runStreamSequence = async () => {
            const phaseOrder = [];
            const phases = new Map();
            const phaseTopMap = new Map();

            for (const element of sequence) {
                const phaseKey = getPhaseKey(element, phaseOrder.length);
                element.dataset.streamPhase = phaseKey;
                if (!phases.has(phaseKey)) {
                    phases.set(phaseKey, []);
                    phaseOrder.push(phaseKey);
                }
                phases.get(phaseKey).push(element);

                if (element.matches(blockSelector)) {
                    element.dataset.streamKind = 'block';
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(10px)';
                    element.style.transition = 'opacity 95ms ease, transform 120ms ease';
                    continue;
                }

                const text = element.textContent.trim();
                if (!text) continue;

                element.dataset.streamKind = 'text';
                buildGhostChars(element);
                element.style.minHeight = `${element.offsetHeight}px`;
                element.style.visibility = 'hidden';
            }

            phaseOrder.forEach((phaseKey) => {
                const phaseElements = phases.get(phaseKey) || [];
                const top = phaseElements.length
                    ? Math.min(...phaseElements.map((el) => pageTop(el)))
                    : Number.POSITIVE_INFINITY;
                phaseTopMap.set(phaseKey, top);
            });

            await wait(4);

            for (const phaseKey of phaseOrder) {
                const phaseElements = phases.get(phaseKey) || [];
                const blockElements = phaseElements.filter((el) => el.dataset.streamKind === 'block');
                const textElements = phaseElements.filter((el) => el.dataset.streamKind === 'text');
                const phaseTop = phaseTopMap.get(phaseKey) || Number.POSITIVE_INFINITY;
                const getBoost = () => {
                    const behind = window.scrollY - phaseTop;
                    const ahead = phaseTop - (window.scrollY + window.innerHeight);

                    // Velocity-based boost to improve responsiveness when user scrolls quickly.
                    let velocityBoost = 0;
                    if (scrollVelocity > 2.4) velocityBoost = 2;
                    else if (scrollVelocity > 1.0) velocityBoost = 1;

                    // Distance-based boost keeps pace with where the reader is.
                    let distanceBoost = 0;
                    if (behind > window.innerHeight * 1.5) distanceBoost = 3;
                    else if (behind > window.innerHeight * 0.7) distanceBoost = 2;
                    else if (behind > 0 || ahead < window.innerHeight * 0.35) distanceBoost = 1;

                    return Math.min(4, velocityBoost + distanceBoost);
                };

                if (blockElements.length > 0) {
                    await Promise.all(blockElements.map((el) => revealBlock(el)));
                }

                if (textElements.length > 0) {
                    await Promise.all(textElements.map((el) => streamElement(el, getBoost)));
                    textElements.forEach((el) => {
                        el.style.minHeight = '';
                    });
                }

                await wait(scrollVelocity > 1.0 ? 0 : 1);
            }
        };

        runStreamSequence();
    }
}

// Streamed text effect for the main page (markdown-like)
if (!document.body.classList.contains('project-body')) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const textSelector = '.hero-title, .hero-subtitle, .cta-button, .section-title, .about-content p, .project-title, .project-description, .project-tags .tag';
    const blockSelector = '.project-card';
    const sequence = Array.from(document.querySelectorAll(`${blockSelector}, ${textSelector}`));

    if (!reducedMotion && sequence.length > 0) {
        const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

        const buildGhostChars = (element) => {
            if (element.dataset.streamBuilt === '1') {
                return element.querySelectorAll('.llm-char').length;
            }

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            const textNodes = [];
            let node = walker.nextNode();
            while (node) {
                if (node.nodeValue && node.nodeValue.trim().length > 0) {
                    textNodes.push(node);
                }
                node = walker.nextNode();
            }

            let count = 0;
            textNodes.forEach((textNode) => {
                const fragment = document.createDocumentFragment();
                for (const char of textNode.nodeValue) {
                    if (char === ' ') {
                        fragment.appendChild(document.createTextNode(' '));
                        continue;
                    }
                    const span = document.createElement('span');
                    span.className = 'llm-char';
                    span.textContent = char;
                    fragment.appendChild(span);
                    count += 1;
                }
                textNode.parentNode.replaceChild(fragment, textNode);
            });

            element.dataset.streamBuilt = '1';
            return count;
        };

        const streamElement = (element) => new Promise((resolve) => {
            const chars = Array.from(element.querySelectorAll('.llm-char'));
            if (!chars.length) {
                element.style.visibility = 'visible';
                resolve();
                return;
            }

            element.classList.add('llm-stream');
            element.style.visibility = 'visible';
            chars.forEach((char) => char.classList.remove('llm-char-on'));

            let index = 0;
            const baseBurst = element.tagName.startsWith('H') ? 1 : 2;
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve();
            };

            const step = () => {
                if (done) return;
                if (index >= chars.length) {
                    finish();
                    return;
                }

                let pause = 0;
                const burst = baseBurst;
                for (let i = 0; i < burst && index < chars.length; i += 1) {
                    const current = chars[index];
                    current.classList.add('llm-char-on');
                    if (/[.,!?;:]/.test(current.textContent || '')) {
                        pause = 1;
                    }
                    index += 1;
                }

                window.setTimeout(step, pause);
            };

            window.setTimeout(step, 0);
        });

        const revealBlock = (element) => new Promise((resolve) => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            window.setTimeout(resolve, 36);
        });

        const gridElements = Array.from(document.querySelectorAll('.projects-grid'));
        const getGridId = (element) => {
            const grid = element.closest('.projects-grid');
            if (!grid) return null;
            return gridElements.indexOf(grid);
        };

        const getPhaseKey = (element, index) => {
            if (element.matches(blockSelector)) {
                const gridId = getGridId(element);
                if (gridId >= 0) return `grid-${gridId}-block`;
                return `single-block-${index}`;
            }

            const card = element.closest('.project-card');
            if (card) {
                const gridId = getGridId(card);
                if (gridId >= 0) {
                    const cardTextTargets = Array.from(card.querySelectorAll(textSelector));
                    const textIndex = cardTextTargets.indexOf(element);
                    if (textIndex >= 0) return `grid-${gridId}-text-${textIndex}`;
                }
            }

            return `single-text-${index}`;
        };

        const runStreamSequence = async () => {
            const phaseOrder = [];
            const phases = new Map();

            for (const element of sequence) {
                const phaseKey = getPhaseKey(element, phaseOrder.length);
                element.dataset.streamPhase = phaseKey;
                if (!phases.has(phaseKey)) {
                    phases.set(phaseKey, []);
                    phaseOrder.push(phaseKey);
                }
                phases.get(phaseKey).push(element);

                if (element.matches(blockSelector)) {
                    element.dataset.streamKind = 'block';
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(10px)';
                    element.style.transition = 'opacity 95ms ease, transform 120ms ease';
                    continue;
                }

                const text = element.textContent.trim();
                if (!text) continue;

                element.dataset.streamKind = 'text';
                buildGhostChars(element);
                element.style.minHeight = `${element.offsetHeight}px`;
                element.style.visibility = 'hidden';
            }

            await wait(4);

            for (const phaseKey of phaseOrder) {
                const phaseElements = phases.get(phaseKey) || [];
                const blockElements = phaseElements.filter((el) => el.dataset.streamKind === 'block');
                const textElements = phaseElements.filter((el) => el.dataset.streamKind === 'text');

                if (blockElements.length > 0) {
                    await Promise.all(blockElements.map((el) => revealBlock(el)));
                }

                if (textElements.length > 0) {
                    await Promise.all(textElements.map((el) => streamElement(el)));
                    textElements.forEach((el) => {
                        el.style.minHeight = '';
                    });
                }

                await wait(1);
            }
        };

        runStreamSequence();
    }
}
