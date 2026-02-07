import { places } from '../data/discover.mjs';

function daysBetween(msA, msB) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(Math.abs(msA - msB) / msPerDay);
}

function showVisitMessage(container) {
    const last = localStorage.getItem('discover-last-visit');
    const now = Date.now();
    let message = '';

    if (!last) {
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const diffDays = daysBetween(now, parseInt(last, 10));
        const diffMs = Math.abs(now - parseInt(last, 10));
        if (diffMs < 24 * 60 * 60 * 1000) {
            message = 'Back so soon! Awesome!';
        } else {
            message = `You last visited ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago.`;
        }
    }

    container.textContent = message;
    localStorage.setItem('discover-last-visit', String(now));
}

function createCard(place) {
    const article = document.createElement('article');
    article.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = place.title;

    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = place.image;
    img.alt = place.title;
    img.loading = 'lazy';
    fig.appendChild(img);

    const addr = document.createElement('address');
    addr.textContent = place.address;

    const p = document.createElement('p');
    p.textContent = place.description;

    const btn = document.createElement('button');
    btn.className = 'learn-more';
    btn.type = 'button';
    btn.textContent = 'Learn more';

    article.append(h2, fig, addr, p, btn);
    return article;
}

function renderGrid() {
    const grid = document.querySelector('.discover-grid');
    if (!grid) return;

    places.forEach(place => {
        const card = createCard(place);
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const messageBox = document.querySelector('.visit-message');
    if (messageBox) showVisitMessage(messageBox);
    renderGrid();
});
