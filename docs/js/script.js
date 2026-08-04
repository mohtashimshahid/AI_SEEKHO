/**
 * Shared JavaScript for EduSweden Navigator
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll animation observer for elements with .fade-in-up
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => fadeObserver.observe(el));

    // 2. Mobile navigation toggle setup if present
    const menuBtn = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 3. FAQ Accordion functionality
    const accordionButtons = document.querySelectorAll('.faq-accordion-btn');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            if (content) {
                content.classList.toggle('hidden');
                const icon = button.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = content.classList.contains('hidden') ? 'expand_more' : 'expand_less';
                }
            }
        });
    });
});
