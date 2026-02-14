/* =====================
   ROUTINES LIST PAGE JAVASCRIPT
   ===================== */

import { openModal, closeModal } from './main.js';

let allRoutines = [];

// Initialize routines page
document.addEventListener('DOMContentLoaded', async () => {
    await loadRoutines();
    displayRoutines(allRoutines);
});

// Fetch routines from JSON
async function loadRoutines() {
    const grid = document.getElementById('routinesGrid');

    try {
        const response = await fetch('./data/routines.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allRoutines = data.routines;

    } catch (error) {
        console.error('Error loading routines:', error);
        grid.innerHTML = '<p style="grid-column: 1/-1; color: #ff4444; text-align: center;">Error loading routines. Please try again later.</p>';
    }
}

// Display routines in grid
function displayRoutines(routines) {
    const grid = document.getElementById('routinesGrid');
    grid.innerHTML = '';

    if (routines.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-secondary); text-align: center; padding: 2rem;">No routines found.</p>';
        return;
    }

    // Use map to create routine cards
    const cards = routines.map(routine => createRoutineCard(routine));
    cards.forEach(card => grid.appendChild(card));
}

// Create a routine card element
function createRoutineCard(routine) {
    const card = document.createElement('div');
    card.className = 'routine-card';

    const benefitsHTML = routine.benefits.map(benefit => `<span class="routine-benefit-tag">${benefit}</span>`).join('');

    card.innerHTML = `
        <div class="routine-image-container">
            <img 
                src="${routine.image}" 
                alt="${routine.name}" 
                class="routine-image"
                loading="lazy"
            >
            <div class="routine-image-overlay"></div>
            <span class="routine-difficulty-badge">${routine.difficulty}</span>
        </div>
        <div class="routine-body">
            <h3 class="routine-name">${routine.name}</h3>
            <p class="routine-description">${routine.description}</p>
            <div class="routine-meta">
                <div class="routine-meta-item">
                    <span class="routine-meta-label">Duration</span>
                    <span class="routine-meta-value">${routine.duration}</span>
                </div>
                <div class="routine-meta-item">
                    <span class="routine-meta-label">Frequency</span>
                    <span class="routine-meta-value">${routine.frequency}</span>
                </div>
            </div>
            <div class="routine-benefits">
                ${benefitsHTML}
            </div>
            <div class="routine-actions">
                <button class="btn-view-routine" data-routine-id="${routine.id}">View Details</button>
                <button class="btn-use-routine" data-routine-id="${routine.id}">Use Routine</button>
            </div>
        </div>
    `;

    // Add click handlers
    const viewBtn = card.querySelector('.btn-view-routine');
    const useBtn = card.querySelector('.btn-use-routine');

    viewBtn.addEventListener('click', () => showRoutineModal(routine));
    useBtn.addEventListener('click', () => useRoutine(routine));

    return card;
}

// Show routine detail modal
function showRoutineModal(routine) {
    const modal = document.getElementById('routineModal');
    const modalBody = document.getElementById('routineModalBody');
    const modalTitle = document.getElementById('routineModalTitle');

    modalTitle.textContent = routine.name;

    // Create exercise items HTML
    const exercisesHTML = routine.exercises.map(exercise => `
        <div class="exercise-item">
            <div>
                <div class="exercise-name">${exercise.name}</div>
                <div class="exercise-details">
                    <span class="exercise-detail-item"><strong>Sets:</strong> ${exercise.sets}</span>
                    <span class="exercise-detail-item"><strong>Reps:</strong> ${exercise.reps}</span>
                    <span class="exercise-detail-item"><strong>Rest:</strong> ${exercise.rest}</span>
                </div>
            </div>
        </div>
    `).join('');

    modalBody.innerHTML = `
        <img src="${routine.image}" alt="${routine.name}" class="routine-modal-image">
        
        <div class="routine-modal-header">
            <div>
                <p style="color: var(--text-secondary); margin: 0 0 0.5rem 0;">${routine.description}</p>
            </div>
        </div>

        <div class="routine-modal-info">
            <div class="routine-modal-info-item">
                <span class="routine-modal-info-label">Duration</span>
                <span class="routine-modal-info-value">${routine.duration}</span>
            </div>
            <div class="routine-modal-info-item">
                <span class="routine-modal-info-label">Difficulty</span>
                <span class="routine-modal-info-value">${routine.difficulty}</span>
            </div>
            <div class="routine-modal-info-item">
                <span class="routine-modal-info-label">Frequency</span>
                <span class="routine-modal-info-value">${routine.frequency}</span>
            </div>
            <div class="routine-modal-info-item">
                <span class="routine-modal-info-label">Calories</span>
                <span class="routine-modal-info-value">${routine.caloriesBurned}</span>
            </div>
        </div>

        <h3 style="color: var(--accent-green); margin-top: 1.5rem; margin-bottom: 1rem;">About This Routine</h3>
        <p style="color: var(--text-secondary); line-height: 1.8;">${routine.details}</p>

        <div class="routine-exercises">
            <h3>Exercises (<span style="color: var(--accent-green);">${routine.exercises.length}</span>)</h3>
            <div class="exercise-list">
                ${exercisesHTML}
            </div>
        </div>

        <div style="margin-top: 1.5rem;">
            <h3 style="color: var(--accent-green);">Benefits</h3>
            <ul style="color: var(--text-secondary); padding-left: 1.5rem;">
                ${routine.benefits.map(benefit => `<li style="margin-bottom: 0.5rem;">${benefit}</li>`).join('')}
            </ul>
        </div>

        <div class="routine-modal-actions">
            <button class="btn btn-large" data-routine-id="${routine.id}" id="addToRoutineFromModal">Add All Exercises to My Routine</button>
            <button class="btn btn-secondary" id="closeFromModal">Close</button>
        </div>
    `;

    const addBtn = document.getElementById('addToRoutineFromModal');
    const closeBtn = document.getElementById('closeFromModal');

    addBtn.addEventListener('click', () => {
        useRoutine(routine);
        closeModal(modal);
    });

    closeBtn.addEventListener('click', () => closeModal(modal));

    openModal(modal);
}

// Use routine - add all exercises to custom routine
function useRoutine(routine) {
    try {
        const currentRoutine = JSON.parse(localStorage.getItem('customRoutine')) || [];

        // Add all exercises from this routine
        let addedCount = 0;
        routine.exercises.forEach(exercise => {
            // Create a workout object from the exercise
            const workout = {
                id: `routine-${routine.id}-${exercise.name}`,
                name: exercise.name,
                muscleGroup: routine.name,
                difficulty: routine.difficulty,
                equipment: 'varies',
                caloriesBurned: Math.round(routine.caloriesBurned / routine.exercises.length),
                description: routine.details,
                image: routine.image,
                sets: exercise.sets,
                reps: exercise.reps,
                rest: exercise.rest
            };

            // Check if already exists
            if (!currentRoutine.find(w => w.id === workout.id)) {
                currentRoutine.push(workout);
                addedCount++;
            }
        });

        localStorage.setItem('customRoutine', JSON.stringify(currentRoutine));

        if (addedCount > 0) {
            alert(`✓ ${routine.name} added to your routine! Added ${addedCount} exercise(s).`);
        } else {
            alert(`All exercises from "${routine.name}" are already in your routine.`);
        }
    } catch (error) {
        console.error('Error adding routine:', error);
        alert('Error adding routine to your plan.');
    }
}
