// Game state
let currentGame = null;
let difficulty = 'medium';

// DOM Elements
const startBtn = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty-select');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startInvestigation();
        });
    }

    // Difficulty select
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        difficultySelect.addEventListener('change', (e) => {
            difficulty = e.target.value;
        });
    }

    // Exonerate buttons
    document.querySelectorAll('.exonerate-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const suspectId = Number(btn.dataset.id);
            exonerateSuspect(suspectId);
        });
    });

    // Accuse buttons
    document.querySelectorAll('.accuse-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const suspectId = Number(btn.dataset.id);
            accuseSuspect(suspectId);
        });
    });
});

// Game functions
function startInvestigation() {
    // Initialize game state
    currentGame = {
        difficulty,
        startTime: Date.now(),
        guesses: 0,
        maxGuesses: difficulty === 'easy' ? 8 : difficulty === 'medium' ? 6 : 4
    };
    
    // Show game interface
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-interface').style.display = 'block';
    
    // Initialize suspects
    initializeSuspects();
}

function exonerateSuspect(suspectId) {
    if (!currentGame) return;
    
    const suspect = document.querySelector(`[data-suspect-id="${suspectId}"]`);
    if (suspect) {
        suspect.classList.add('exonerated');
        suspect.querySelector('.exonerate-btn').disabled = true;
    }
}

function accuseSuspect(suspectId) {
    if (!currentGame) return;
    
    currentGame.guesses++;
    
    // Check if correct
    if (isCorrectSuspect(suspectId)) {
        endGame(true);
    } else if (currentGame.guesses >= currentGame.maxGuesses) {
        endGame(false);
    }
}

function initializeSuspects() {
    // Implementation will depend on your game logic
    // This is just a placeholder
}

function isCorrectSuspect(suspectId) {
    // Implementation will depend on your game logic
    // This is just a placeholder
    return false;
}

function endGame(won) {
    const gameInterface = document.getElementById('game-interface');
    const endScreen = document.getElementById('end-screen');
    
    gameInterface.style.display = 'none';
    endScreen.style.display = 'block';
    
    if (won) {
        endScreen.querySelector('.result').textContent = 'Case Solved!';
    } else {
        endScreen.querySelector('.result').textContent = 'Case Failed!';
    }
    
    // Reset game state
    currentGame = null;
} 