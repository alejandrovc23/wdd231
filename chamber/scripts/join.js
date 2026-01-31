// Set hidden timestamp when the page loads and handle modals accessibility
document.addEventListener('DOMContentLoaded', function () {
    const ts = document.getElementById('timestamp');
    if (ts) {
        ts.value = new Date().toISOString();
    }

    // Set English validation messages for required fields
    const form = document.querySelector('.join-form');
    if (form) {
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('invalid', function (e) {
                e.preventDefault();
                const f = e.target;
                if (f.validity.valueMissing) {
                    f.setCustomValidity('Please fill out this field');
                } else if (f.type === 'email' && f.validity.typeMismatch) {
                    f.setCustomValidity('Please enter a valid email address');
                } else if (f.validity.patternMismatch) {
                    f.setCustomValidity('Please enter at least 7 letters (letters, spaces, hyphens only)');
                } else {
                    f.setCustomValidity('Please fill out this field');
                }
            });
            field.addEventListener('input', function (e) { e.target.setCustomValidity(''); });
        });
    }

    // Modal handling
    let lastFocused = null;
    const openLinks = document.querySelectorAll('.open-modal');
    openLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.dataset.modal;
            const modal = document.getElementById(id);
            if (modal) openModal(modal, link);
        });
    });

    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) closeModal(modal);
    }));

    // close on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    function openModal(modal, opener) {
        lastFocused = opener || document.activeElement;
        modal.setAttribute('open', '');
        modal.setAttribute('aria-hidden', 'false');
        const dialog = modal.querySelector('.modal-dialog');
        if (dialog) {
            dialog.setAttribute('tabindex', '-1');
            dialog.focus();
        }
        // trap focus minimally
        document.addEventListener('focus', enforceFocus, true);
        document.addEventListener('keydown', handleKeydown);
    }

    function closeModal(modal) {
        modal.removeAttribute('open');
        modal.setAttribute('aria-hidden', 'true');
        document.removeEventListener('focus', enforceFocus, true);
        document.removeEventListener('keydown', handleKeydown);
        if (lastFocused) lastFocused.focus();
    }

    function enforceFocus(e) {
        const modal = document.querySelector('.modal[open]');
        if (!modal) return;
        if (!modal.contains(e.target)) {
            const dialog = modal.querySelector('.modal-dialog');
            if (dialog) dialog.focus();
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal[open]');
            if (modal) closeModal(modal);
        }
    }
});
