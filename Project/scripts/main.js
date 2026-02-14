/* =====================
   GLOBAL JAVASCRIPT
   ===================== */

// Initialize hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Utility function to open modal
export function openModal(modalElement, ariaHidden = false) {
    if (modalElement) {
        modalElement.classList.add('active');
        if (!ariaHidden) {
            modalElement.setAttribute('aria-hidden', 'false');
        }
    }
}

// Utility function to close modal
export function closeModal(modalElement, ariaHidden = false) {
    if (modalElement) {
        modalElement.classList.remove('active');
        if (!ariaHidden) {
            modalElement.setAttribute('aria-hidden', 'true');
        }
    }
}

// Setup modal close buttons
export function setupModalCloseButtons() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal);
            });
        }

        // Close modal when clicking outside of modal-content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    });
}

// Initialize all global functionality
function initGlobal() {
    initHamburgerMenu();
    setupModalCloseButtons();
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobal);
} else {
    initGlobal();
}

export default {
    openModal,
    closeModal,
    setupModalCloseButtons
};
