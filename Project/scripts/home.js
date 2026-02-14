/* =====================
   HOME PAGE JAVASCRIPT
   ===================== */

import { openModal, closeModal } from './main.js';

// Fetch and display featured workouts
async function loadFeaturedWorkouts() {
    const container = document.getElementById('featuredWorkouts');

    if (!container) return;

    try {
        const response = await fetch('./data/workouts.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const workouts = data.workouts;

        // Select 3 random workouts for featured section
        const featuredWorkouts = selectRandomWorkouts(workouts, 3);

        // Render featured workouts
        container.innerHTML = '';
        featuredWorkouts.forEach(workout => {
            const card = createWorkoutCard(workout);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading featured workouts:', error);
        container.innerHTML = '<p style="color: #ff4444; text-align: center;">Error loading workouts. Please try again later.</p>';
    }
}

// Select random workouts from array
function selectRandomWorkouts(workouts, count) {
    const shuffled = [...workouts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Create a workout card element
function createWorkoutCard(workout) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';

    const tagColor = getDifficultyColor(workout.difficulty);

    card.innerHTML = `
        <img 
            src="${workout.image}" 
            alt="${workout.name}" 
            class="card-image"
            loading="lazy"
        >
        <h3 class="card-title">${workout.name}</h3>
        <p class="card-text">${workout.description.substring(0, 100)}...</p>
        <div class="card-tags">
            <span class="card-tag">${workout.muscleGroup}</span>
            <span class="card-tag" style="background: ${tagColor}20; border-color: ${tagColor}; color: ${tagColor};">${workout.difficulty}</span>
        </div>
    `;

    card.addEventListener('click', () => showWorkoutModal(workout));

    return card;
}

// Get color based on difficulty
function getDifficultyColor(difficulty) {
    const colors = {
        'beginner': '#39ff14',
        'intermediate': '#ffd700',
        'advanced': '#ff6b6b'
    };
    return colors[difficulty] || '#39ff14';
}

// Show workout detail modal
function showWorkoutModal(workout) {
    const modal = document.getElementById('workoutModal');

    if (!modal) {
        // Create modal if it doesn't exist
        createModalStructure();
        return showWorkoutModal(workout);
    }

    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    modalTitle.textContent = workout.name;

    modalBody.innerHTML = `
        <img src="${workout.image}" alt="${workout.name}" style="width: 100%; border-radius: 6px; margin-bottom: 1rem;">
        <h3>Overview</h3>
        <p>${workout.description}</p>
        
        <h3>Details</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0;">
            <div style="background: rgba(0, 255, 65, 0.05); padding: 1rem; border-radius: 6px;">
                <strong style="color: var(--accent-green);">Muscle Group:</strong>
                <p style="margin: 0; text-transform: capitalize;">${workout.muscleGroup}</p>
            </div>
            <div style="background: rgba(0, 255, 65, 0.05); padding: 1rem; border-radius: 6px;">
                <strong style="color: var(--accent-green);">Difficulty:</strong>
                <p style="margin: 0; text-transform: capitalize;">${workout.difficulty}</p>
            </div>
            <div style="background: rgba(0, 255, 65, 0.05); padding: 1rem; border-radius: 6px;">
                <strong style="color: var(--accent-green);">Equipment:</strong>
                <p style="margin: 0; text-transform: capitalize;">${workout.equipment}</p>
            </div>
            <div style="background: rgba(0, 255, 65, 0.05); padding: 1rem; border-radius: 6px;">
                <strong style="color: var(--accent-green);">Calories Burned:</strong>
                <p style="margin: 0;">${workout.caloriesBurned} kcal</p>
            </div>
        </div>
        
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 1rem;">
            Click "View All Workouts" to add this exercise to your routine.
        </p>
    `;

    openModal(modal);
}

// Create modal structure if it doesn't exist
function createModalStructure() {
    if (!document.getElementById('workoutModal')) {
        const modal = document.createElement('div');
        modal.id = 'workoutModal';
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modalTitle');
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">Workout Details</h2>
                    <button class="modal-close" aria-label="Close modal"></button>
                </div>
                <div id="modalBody" class="modal-body"></div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => closeModal(modal));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedWorkouts();
});
