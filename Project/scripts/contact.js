/* =====================
   CONTACT PAGE JAVASCRIPT
   ===================== */

import { openModal, closeModal } from './main.js';

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    setupFormHandling();
});

// Setup form handling
function setupFormHandling() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        handleFormSubmission(form);
    });
}

// Handle form submission
async function handleFormSubmission(form) {
    try {
        // Get form data
        const formData = new FormData(form);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            submittedAt: new Date().toLocaleString()
        };

        // Validate form data
        if (!validateFormData(data)) {
            return;
        }

        // Display submission details in modal
        showSubmissionModal(data);

        // Reset form
        form.reset();

        // Save to localStorage (optional - for demo purposes)
        saveSubmissionToStorage(data);

    } catch (error) {
        console.error('Error processing form:', error);
        alert('There was an error processing your form. Please try again.');
    }
}

// Validate form data
function validateFormData(data) {
    if (!data.fullName || data.fullName.trim() === '') {
        alert('Please enter your full name.');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!data.subject || data.subject === '') {
        alert('Please select a subject.');
        return false;
    }

    if (!data.message || data.message.trim() === '') {
        alert('Please enter a message.');
        return false;
    }

    return true;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show submission modal
function showSubmissionModal(data) {
    const modal = document.getElementById('submissionModal');
    const submissionContent = document.getElementById('submissionContent');

    const subjectOptions = {
        'feedback': 'Feedback',
        'suggestion': 'Suggestion',
        'bug': 'Bug Report',
        'partnership': 'Partnership Inquiry',
        'other': 'Other'
    };

    submissionContent.innerHTML = `
        <div class="submission-message">
            <p class="submission-success">✓ Thank you for contacting us, ${escapeHtml(data.fullName)}!</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
        </div>

        <div class="submission-details">
            <dl>
                <dt>Full Name:</dt>
                <dd>${escapeHtml(data.fullName)}</dd>

                <dt>Email:</dt>
                <dd><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></dd>

                ${data.phone ? `
                    <dt>Phone:</dt>
                    <dd>${escapeHtml(data.phone)}</dd>
                ` : ''}

                <dt>Subject:</dt>
                <dd>${subjectOptions[data.subject] || data.subject}</dd>

                <dt>Message:</dt>
                <dd>${escapeHtml(data.message).replace(/\n/g, '<br>')}</dd>

                ${data.newsletter ? `
                    <dt>Newsletter:</dt>
                    <dd style="color: var(--accent-green);">✓ Subscribed</dd>
                ` : ''}

                <dt>Submitted:</dt>
                <dd>${data.submittedAt}</dd>
            </dl>
        </div>

        <div style="text-align: center; margin-top: 1.5rem;">
            <button class="btn" id="closeSubmissionBtn" aria-label="Close submission modal">Close</button>
        </div>
    `;

    const closeBtn = document.getElementById('closeSubmissionBtn');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });

    openModal(modal);
}

// Save submission to localStorage
function saveSubmissionToStorage(data) {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    submissions.push(data);
    localStorage.setItem('submissions', JSON.stringify(submissions));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
