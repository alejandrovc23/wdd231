/* =====================
   ROUTINE BUILDER JAVASCRIPT
   ===================== */

import { openModal, closeModal } from './main.js';

let allWorkouts = [];
let customRoutine = [];

// Initialize routine page
document.addEventListener('DOMContentLoaded', async () => {
    await loadWorkouts();
    loadRoutineFromStorage();
    setupEventListeners();
    displayAvailableWorkouts(allWorkouts);
    updateRoutineDisplay();
});

// Fetch all workouts
async function loadWorkouts() {
    try {
        const response = await fetch('./data/workouts.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allWorkouts = data.workouts;

    } catch (error) {
        console.error('Error loading workouts:', error);
        const list = document.getElementById('availableWorkoutsList');
        if (list) {
            list.innerHTML = '<p style="color: #ff4444; text-align: center;">Error loading workouts. Please try again later.</p>';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchWorkouts');
    const muscleFilter = document.getElementById('muscleGroupFilter');
    const clearRoutineBtn = document.getElementById('clearRoutineBtn');
    const exportRoutineBtn = document.getElementById('exportRoutineBtn');
    const closeExportModal = document.getElementById('closeExportModal');

    if (searchInput) {
        searchInput.addEventListener('input', filterAvailableWorkouts);
    }

    if (muscleFilter) {
        muscleFilter.addEventListener('change', filterAvailableWorkouts);
    }

    if (clearRoutineBtn) {
        clearRoutineBtn.addEventListener('click', clearRoutine);
    }

    if (exportRoutineBtn) {
        exportRoutineBtn.addEventListener('click', showExportModal);
    }

    if (closeExportModal) {
        closeExportModal.addEventListener('click', () => {
            closeModal(document.getElementById('exportModal'));
        });
    }
}

// Filter available workouts
function filterAvailableWorkouts() {
    const searchTerm = document.getElementById('searchWorkouts').value.toLowerCase();
    const muscleGroup = document.getElementById('muscleGroupFilter').value;

    const filtered = allWorkouts.filter(workout => {
        const matchesSearch =
            workout.name.toLowerCase().includes(searchTerm) ||
            workout.description.toLowerCase().includes(searchTerm);

        const matchesMuscle = muscleGroup === '' || workout.muscleGroup === muscleGroup;

        return matchesSearch && matchesMuscle;
    });

    displayAvailableWorkouts(filtered);
}

// Display available workouts
function displayAvailableWorkouts(workouts) {
    const list = document.getElementById('availableWorkoutsList');
    list.innerHTML = '';

    if (workouts.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No workouts found.</p>';
        return;
    }

    // Use map to create workout items
    const items = workouts.map(workout => createAvailableWorkoutItem(workout));
    items.forEach(item => list.appendChild(item));
}

// Create available workout item
function createAvailableWorkoutItem(workout) {
    const item = document.createElement('div');
    item.className = 'available-workout-item';

    const isInRoutine = customRoutine.some(w => w.id === workout.id);

    item.innerHTML = `
        <div class="workout-item-info">
            <div class="workout-item-name">${workout.name}</div>
            <div class="workout-item-details">
                <span class="workout-item-badge">${workout.muscleGroup}</span>
                <span class="workout-item-badge">${workout.difficulty}</span>
                <span class="workout-item-badge">${workout.caloriesBurned} cal</span>
            </div>
        </div>
        <button class="btn-add-to-routine" data-workout-id="${workout.id}">
            ${isInRoutine ? '✓ Added' : '+ Add'}
        </button>
    `;

    const btn = item.querySelector('.btn-add-to-routine');
    btn.disabled = isInRoutine;

    btn.addEventListener('click', () => {
        if (!isInRoutine) {
            addWorkoutToRoutine(workout);
            btn.textContent = '✓ Added';
            btn.disabled = true;
        }
    });

    return item;
}

// Add workout to routine
function addWorkoutToRoutine(workout) {
    customRoutine.push(workout);
    saveRoutineToStorage();
    updateRoutineDisplay();
    displayAvailableWorkouts(filterWorkouts());
}

// Remove workout from routine
function removeWorkoutFromRoutine(workoutId) {
    customRoutine = customRoutine.filter(w => w.id !== workoutId);
    saveRoutineToStorage();
    updateRoutineDisplay();
    displayAvailableWorkouts(filterWorkouts());
}

// Update routine display
function updateRoutineDisplay() {
    const routineList = document.getElementById('customRoutineList');
    const routineCount = document.getElementById('routineCount');
    const statsSection = document.getElementById('routineStats');

    if (!routineList) return;

    routineCount.textContent = customRoutine.length;

    if (customRoutine.length === 0) {
        routineList.innerHTML = `
            <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                No workouts in your routine yet. Add exercises from the available workouts list.
            </p>
        `;
        statsSection.style.display = 'none';
        return;
    }

    routineList.innerHTML = '';

    // Use map to create routine items
    const items = customRoutine.map(workout => createRoutineExerciseItem(workout));
    items.forEach(item => routineList.appendChild(item));

    // Update stats
    updateRoutineStats();
    statsSection.style.display = 'block';
}

// Create routine exercise item
function createRoutineExerciseItem(workout) {
    const item = document.createElement('div');
    item.className = 'routine-exercise-item';

    item.innerHTML = `
        <div class="routine-exercise-info">
            <div class="routine-exercise-name">${workout.name}</div>
            <div class="routine-exercise-details">
                <span class="routine-exercise-badge">${workout.muscleGroup}</span>
                <span class="routine-exercise-badge">${workout.difficulty}</span>
                <span class="routine-exercise-badge">${workout.equipment}</span>
                <span class="routine-exercise-badge">${workout.caloriesBurned} cal</span>
            </div>
        </div>
        <button class="btn-remove" data-workout-id="${workout.id}" aria-label="Remove from routine">Remove</button>
    `;

    const removeBtn = item.querySelector('.btn-remove');
    removeBtn.addEventListener('click', () => {
        removeWorkoutFromRoutine(workout.id);
    });

    return item;
}

// Update routine statistics
function updateRoutineStats() {
    const totalExercises = document.getElementById('totalExercises');
    const totalCalories = document.getElementById('totalCalories');
    const avgDifficulty = document.getElementById('avgDifficulty');

    if (!totalExercises) return;

    totalExercises.textContent = customRoutine.length;

    // Calculate total calories using reduce
    const totalCals = customRoutine.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    totalCalories.textContent = totalCals;

    // Calculate average difficulty
    const difficultyMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const avgDiff = customRoutine.reduce((sum, workout) => sum + (difficultyMap[workout.difficulty] || 1), 0) / customRoutine.length;
    const difficultyNames = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };
    avgDifficulty.textContent = difficultyNames[Math.round(avgDiff)] || 'Mixed';
}

// Clear entire routine
function clearRoutine() {
    if (confirm('Are you sure you want to clear your entire routine? This action cannot be undone.')) {
        customRoutine = [];
        saveRoutineToStorage();
        updateRoutineDisplay();
        displayAvailableWorkouts(filterWorkouts());
    }
}

// Show export modal
function showExportModal() {
    if (customRoutine.length === 0) {
        alert('Your routine is empty. Add some workouts first!');
        return;
    }

    const modal = document.getElementById('exportModal');
    const exportContent = document.getElementById('exportContent');

    // Create formatted routine text
    const routineText = generateRoutineText();

    exportContent.innerHTML = `
        <p style="margin-bottom: 1rem;">Your custom routine is ready to export:</p>
        <div class="export-content">${routineText}</div>
        <div class="export-actions">
            <button class="btn btn-copy" id="copyBtn" aria-label="Copy routine to clipboard">📋 Copy to Clipboard</button>
            <button class="btn btn-secondary" id="closeExportBtn" aria-label="Close export modal">Close</button>
        </div>
    `;

    const copyBtn = document.getElementById('copyBtn');
    const closeBtn = document.getElementById('closeExportBtn');

    copyBtn.addEventListener('click', () => {
        const text = customRoutine.map(w =>
            `${w.name} - ${w.muscleGroup} (${w.difficulty})`
        ).join('\n');

        navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy to Clipboard';
            }, 2000);
        });
    });

    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });

    openModal(modal);
}

// Generate routine text
function generateRoutineText() {
    let text = `<strong>FitTrack Custom Routine</strong>\n`;
    text += `Created: ${new Date().toLocaleDateString()}\n`;
    text += `Total Exercises: ${customRoutine.length}\n\n`;
    text += `─────────────────────────\n\n`;

    // Use map to create routine text
    const routineLines = customRoutine.map((w, index) => {
        return `${index + 1}. ${w.name}\n   • Muscle Group: ${w.muscleGroup}\n   • Difficulty: ${w.difficulty}\n   • Equipment: ${w.equipment}\n   • Calories: ${w.caloriesBurned} kcal`;
    });

    text += routineLines.join('\n\n');
    text += `\n\n─────────────────────────\n`;
    text += `Total Calories: ${customRoutine.reduce((sum, w) => sum + w.caloriesBurned, 0)} kcal`;

    return text.replace(/\n/g, '<br>');
}

// Filter available workouts (helper)
function filterWorkouts() {
    const searchTerm = document.getElementById('searchWorkouts')?.value.toLowerCase() || '';
    const muscleGroup = document.getElementById('muscleGroupFilter')?.value || '';

    return allWorkouts.filter(workout => {
        const matchesSearch =
            workout.name.toLowerCase().includes(searchTerm) ||
            workout.description.toLowerCase().includes(searchTerm);

        const matchesMuscle = muscleGroup === '' || workout.muscleGroup === muscleGroup;

        return matchesSearch && matchesMuscle;
    });
}

// Save routine to localStorage
function saveRoutineToStorage() {
    localStorage.setItem('customRoutine', JSON.stringify(customRoutine));
}

// Load routine from localStorage
function loadRoutineFromStorage() {
    const routine = JSON.parse(localStorage.getItem('customRoutine')) || [];
    customRoutine = routine;
}
