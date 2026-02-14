/* =====================
   WORKOUTS PAGE JAVASCRIPT
   ===================== */

import { openModal, closeModal } from './main.js';

let allWorkouts = [];
let filteredWorkouts = [];
let favorites = new Set();

// Initialize workouts page
document.addEventListener('DOMContentLoaded', async () => {
    await loadWorkouts();
    loadFavoritesFromStorage();
    setupEventListeners();
    displayWorkouts(allWorkouts);
});

// Fetch workouts from JSON
async function loadWorkouts() {
    const grid = document.getElementById('workoutsGrid');

    try {
        const response = await fetch('./data/workouts.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allWorkouts = data.workouts;
        filteredWorkouts = [...allWorkouts];

        updateResultsCount();

    } catch (error) {
        console.error('Error loading workouts:', error);
        grid.innerHTML = '<p style="grid-column: 1/-1; color: #ff4444; text-align: center;">Error loading workouts. Please try again later.</p>';
    }
}

// Setup event listeners for filters and search
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const muscleFilter = document.getElementById('muscleFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const resetButton = document.getElementById('resetFilters');
    const toggleFavoritesBtn = document.getElementById('toggleFavorites');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (muscleFilter) {
        muscleFilter.addEventListener('change', applyFilters);
    }

    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', applyFilters);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    if (toggleFavoritesBtn) {
        toggleFavoritesBtn.addEventListener('click', toggleFavoritesView);
    }
}

// Apply all filters and search
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const muscleGroup = document.getElementById('muscleFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;

    filteredWorkouts = allWorkouts.filter(workout => {
        const matchesSearch =
            workout.name.toLowerCase().includes(searchTerm) ||
            workout.description.toLowerCase().includes(searchTerm);

        const matchesMuscle = muscleGroup === '' || workout.muscleGroup === muscleGroup;
        const matchesDifficulty = difficulty === '' || workout.difficulty === difficulty;

        return matchesSearch && matchesMuscle && matchesDifficulty;
    });

    displayWorkouts(filteredWorkouts);
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('muscleFilter').value = '';
    document.getElementById('difficultyFilter').value = '';
    filteredWorkouts = [...allWorkouts];
    displayWorkouts(filteredWorkouts);
}

// Toggle favorites view
function toggleFavoritesView() {
    const searchInput = document.getElementById('searchInput');
    const muscleFilter = document.getElementById('muscleFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const toggleBtn = document.getElementById('toggleFavorites');

    if (toggleBtn.textContent.includes('View')) {
        // Show only favorites
        const favoriteWorkouts = allWorkouts.filter(w => favorites.has(w.id));
        filteredWorkouts = favoriteWorkouts;
        displayWorkouts(filteredWorkouts);
        toggleBtn.textContent = `☆ View All (${allWorkouts.length})`;
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.color = 'var(--accent-green)';

        // Disable filters
        searchInput.disabled = true;
        muscleFilter.disabled = true;
        difficultyFilter.disabled = true;
    } else {
        // Show all
        filteredWorkouts = [...allWorkouts];
        displayWorkouts(filteredWorkouts);
        toggleBtn.textContent = `★ View Favorites (${favorites.size})`;
        toggleBtn.style.background = '';
        toggleBtn.style.color = '';

        // Enable filters
        searchInput.disabled = false;
        muscleFilter.disabled = false;
        difficultyFilter.disabled = false;
    }
}

// Display workouts in grid
function displayWorkouts(workouts) {
    const grid = document.getElementById('workoutsGrid');
    grid.innerHTML = '';

    if (workouts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-secondary); text-align: center; padding: 2rem;">No workouts found. Try adjusting your filters.</p>';
        updateResultsCount();
        return;
    }

    // Use map to create workout cards
    const cards = workouts.map(workout => createWorkoutCard(workout));
    cards.forEach(card => grid.appendChild(card));

    updateResultsCount();
}

// Create a workout card element
function createWorkoutCard(workout) {
    const card = document.createElement('div');
    card.className = 'workout-card';

    const isFavorite = favorites.has(workout.id);
    const favoriteClass = isFavorite ? 'active' : '';

    card.innerHTML = `
        <div class="workout-image-container">
            <img 
                src="${workout.image}" 
                alt="${workout.name}" 
                class="workout-image"
                loading="lazy"
            >
            <div class="workout-image-overlay"></div>
        </div>
        <div class="workout-body">
            <div>
                <h3 class="workout-name">${workout.name}</h3>
                <div class="workout-meta">
                    <span class="workout-tag">${workout.muscleGroup}</span>
                    <span class="workout-tag">${workout.difficulty}</span>
                </div>
                <div class="workout-stats">
                    <div class="stat">
                        <span class="stat-value">${workout.equipment}</span>
                        <span>Equipment</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${workout.caloriesBurned}</span>
                        <span>Calories</span>
                    </div>
                </div>
            </div>
            <div class="workout-actions">
                <button class="btn-view-details" data-workout-id="${workout.id}">Details</button>
                <button class="btn-favorite ${favoriteClass}" data-workout-id="${workout.id}" aria-label="Add to favorites">★</button>
            </div>
        </div>
    `;

    // Add click handlers
    const detailsBtn = card.querySelector('.btn-view-details');
    const favoriteBtn = card.querySelector('.btn-favorite');

    detailsBtn.addEventListener('click', () => showWorkoutModal(workout));
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(workout.id);
        favoriteBtn.classList.toggle('active');
        updateFavoriteCount();
    });

    return card;
}

// Show workout detail modal
function showWorkoutModal(workout) {
    const modal = document.getElementById('workoutModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    modalTitle.textContent = workout.name;

    const isFavorite = favorites.has(workout.id);

    modalBody.innerHTML = `
        <img src="${workout.image}" alt="${workout.name}">
        
        <h3>Description</h3>
        <p>${workout.description}</p>
        
        <h3>Exercise Details</h3>
        <div class="modal-tags">
            <span class="workout-tag">${workout.muscleGroup}</span>
            <span class="workout-tag">${workout.difficulty}</span>
            <span class="workout-tag">${workout.equipment}</span>
        </div>
        
        <div class="modal-stats">
            <div class="modal-stat">
                <span class="modal-stat-label">Muscle Group</span>
                <span class="modal-stat-value">${workout.muscleGroup}</span>
            </div>
            <div class="modal-stat">
                <span class="modal-stat-label">Difficulty</span>
                <span class="modal-stat-value">${workout.difficulty}</span>
            </div>
            <div class="modal-stat">
                <span class="modal-stat-label">Equipment</span>
                <span class="modal-stat-value">${workout.equipment}</span>
            </div>
            <div class="modal-stat">
                <span class="modal-stat-label">Calories Burned</span>
                <span class="modal-stat-value">${workout.caloriesBurned} kcal</span>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn btn-add-to-routine" data-workout-id="${workout.id}">Add to Routine</button>
            <button class="btn btn-secondary" id="favoriteToggleBtn" style="border-color: var(--accent-green); color: var(--accent-green);">
                ${isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
            </button>
        </div>
    `;

    const addToRoutineBtn = modalBody.querySelector('.btn-add-to-routine');
    const favToggleBtn = document.getElementById('favoriteToggleBtn');

    addToRoutineBtn.addEventListener('click', () => {
        addToRoutine(workout);
        closeModal(modal);
    });

    favToggleBtn.addEventListener('click', () => {
        toggleFavorite(workout.id);
        isFavorite = favorites.has(workout.id);
        favToggleBtn.textContent = isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites';
        updateFavoriteCount();
    });

    openModal(modal);
}

// Toggle favorite status
function toggleFavorite(workoutId) {
    if (favorites.has(workoutId)) {
        favorites.delete(workoutId);
    } else {
        favorites.add(workoutId);
    }
    saveFavoritesToStorage();
}

// Add workout to routine
function addToRoutine(workout) {
    const routine = JSON.parse(localStorage.getItem('customRoutine')) || [];

    if (!routine.find(w => w.id === workout.id)) {
        routine.push(workout);
        localStorage.setItem('customRoutine', JSON.stringify(routine));

        // Show confirmation message
        alert(`✓ "${workout.name}" added to your routine!`);
    } else {
        alert(`"${workout.name}" is already in your routine.`);
    }
}

// Save favorites to localStorage
function saveFavoritesToStorage() {
    const favArray = Array.from(favorites);
    localStorage.setItem('favorites', JSON.stringify(favArray));
}

// Load favorites from localStorage
function loadFavoritesFromStorage() {
    const favArray = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = new Set(favArray);
    updateFavoriteCount();
}

// Update favorite count display
function updateFavoriteCount() {
    const favCount = document.getElementById('favCount');
    if (favCount) {
        favCount.textContent = favorites.size;
    }
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const count = filteredWorkouts.length;
        resultsCount.textContent = `Showing ${count} workout${count !== 1 ? 's' : ''}`;
    }
}
