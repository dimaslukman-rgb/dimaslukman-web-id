(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const SLIDES = document.querySelectorAll('.slide');
    const TOTAL = SLIDES.length;
    let currentIndex = 0;
    let isTransitioning = false;
    let countersAnimated = false;

    // ===== DOM REFS =====
    const dots = document.querySelectorAll('.slide-dot');
    const arrowUp = document.getElementById('arrowUp');
    const arrowDown = document.getElementById('arrowDown');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');

    // Init counter display
    totalSlidesEl.textContent = String(TOTAL).padStart(2, '0');
    updateSlideCounter();

    // ===== NAVIGATION FUNCTIONS =====
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex || index < 0 || index >= TOTAL) return;
        isTransitioning = true;

        // Remove active from current
        SLIDES[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // Set new active
        currentIndex = index;
        SLIDES[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        updateSlideCounter();

        // Animate counters on dashboard slide
        if (currentIndex === 6 && !countersAnimated) {
            setTimeout(animateCounters, 400);
            countersAnimated = true;
        }

        setTimeout(() => { isTransitioning = false; }, 750);
    }

    // Expose globally for inline onclick
    window.goToSlide = goToSlide;

    function nextSlide() {
        if (currentIndex < TOTAL - 1) goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        if (currentIndex > 0) goToSlide(currentIndex - 1);
    }

    function updateSlideCounter() {
        currentSlideEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // ===== EVENT LISTENERS =====

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
        });
    });

    // Arrow buttons
    arrowUp.addEventListener('click', prevSlide);
    arrowDown.addEventListener('click', nextSlide);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(TOTAL - 1);
                break;
        }
    });

    // Mouse wheel
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) nextSlide();
            else prevSlide();
        }, 60);
    }, { passive: false });

    // Touch swipe
    let touchStartY = 0;
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const deltaY = touchStartY - e.changedTouches[0].clientY;
        const deltaX = touchStartX - e.changedTouches[0].clientX;
        const minSwipe = 50;

        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipe) {
            if (deltaY > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.dash-num');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                counter.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ===== ANCHOR LINK HANDLING =====
    document.querySelectorAll('a[href^="#slide-"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#slide-', '');
            goToSlide(parseInt(targetId));
        });
    });

})();