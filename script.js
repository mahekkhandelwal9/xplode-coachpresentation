// ==========================================
// XPLODE PRESENTATION - INTERACTIONS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigationDots();
    initScrollAnimations();
    initMetricCounters();
    initSmoothScroll();
});

// === NAVIGATION DOTS ===
function initNavigationDots() {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');

    // Update active dot on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${sectionId}`) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(`
        .problem-card,
        .feature-card,
        .difference-card,
        .app-preview-card,
        .player-features-list li,
        .metric-card
    `);

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for cards
                setTimeout(() => {
                    entry.target.classList.add('fade-in', 'visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// === METRIC COUNTERS ===
function initMetricCounters() {
    const metricCards = document.querySelectorAll('.metric-card');
    let hasAnimated = false;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateMetrics();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    metricCards.forEach(card => observer.observe(card));
}

function animateMetrics() {
    const metricNumbers = document.querySelectorAll('.metric-number');

    metricNumbers.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === FULL-PAGE SNAP SCROLLING ===
let isScrolling = false;
const scrollDelay = 800; // Delay between scroll actions

document.addEventListener('keydown', (e) => {
    if (isScrolling) return;

    const sections = Array.from(document.querySelectorAll('.section'));
    const currentSection = getCurrentSection(sections);

    if (!currentSection) return;

    const currentIndex = sections.indexOf(currentSection);
    let targetSection = null;

    // Arrow Down, Space, or Page Down - Next section
    if ((e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') && currentIndex < sections.length - 1) {
        e.preventDefault();
        targetSection = sections[currentIndex + 1];
    }

    // Arrow Up or Page Up - Previous section
    if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentIndex > 0) {
        e.preventDefault();
        targetSection = sections[currentIndex - 1];
    }

    // Home - First section
    if (e.key === 'Home') {
        e.preventDefault();
        targetSection = sections[0];
    }

    // End - Last section
    if (e.key === 'End') {
        e.preventDefault();
        targetSection = sections[sections.length - 1];
    }

    if (targetSection) {
        scrollToSection(targetSection);
    }
});

// Mouse wheel support for full-page scrolling
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        // Allow native snap scrolling to handle it
        // This just prevents too rapid scrolling
    }, 100);
}, { passive: true });

// Helper: Get current section in viewport
function getCurrentSection(sections) {
    const viewportMiddle = window.innerHeight / 2;

    for (let section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
            return section;
        }
    }

    // Fallback to closest section
    return sections.reduce((closest, section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        const closestDistance = Math.abs(closest.getBoundingClientRect().top);
        return distance < closestDistance ? section : closest;
    });
}

// Helper: Scroll to a specific section
function scrollToSection(section) {
    isScrolling = true;
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    setTimeout(() => {
        isScrolling = false;
    }, scrollDelay);
}

// === PARALLAX EFFECT (SUBTLE) ===
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const patterns = document.querySelectorAll('.hero-pattern, .cta-pattern');

            patterns.forEach(pattern => {
                pattern.style.transform = `translateY(${scrolled * 0.3}px)`;
            });

            ticking = false;
        });

        ticking = true;
    }
});

// === PERFORMANCE OPTIMIZATION ===
// Reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// === PRINT FUNCTIONALITY ===
function printToPDF() {
    window.print();
}

// Expose print function globally if needed
window.printToPDF = printToPDF;

// === CONSOLE EASTER EGG ===
console.log('%c🏏 XPLODE - Your Academy, Supercharged', 'color: #FF6B35; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion for sports tech 🚀', 'color: #B0B0B0; font-size: 12px;');
