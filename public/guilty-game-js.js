// GUILTY Game - Modern Edition with Daily Themes
(function() {
    'use strict';
    
    // Game state
    const gameState = {
        currentTheme: null,
        suspects: [],
        culprit: null,
        initialSuspect: null,
        difficulty: 'medium',
        startTime: null,
        timerInterval: null,
        guesses: 0,
        maxGuesses: 6
    };

    // Configuration
    const CONFIG = {
        DIFFICULTY_SETTINGS: {
            easy: {
                yellowTraits: 3,
                grayTraits: 2,
                missingTraitsInitial: 1
            },
            medium: {
                yellowTraits: 2,
                grayTraits: 2,
                missingTraitsInitial: 2
            },
            hard: {
                yellowTraits: 1,
                grayTraits: 2,
                missingTraitsInitial: 3
            }
        }
    };

    // Initialize the game
    function initGame() {
        // Set up event listeners
        document.getElementById('start-game').addEventListener('click', startGame);
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            gameState.difficulty = e.target.value;
            gameState.maxGuesses = e.target.value === 'easy' ? 8 : e.target.value === 'medium' ? 6 : 4;
        });

        // Load theme and start timer
        loadTheme();
        startNextPuzzleTimer();
    }

    // Start the game
    function startGame() {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        // Generate suspects and display initial suspect
        generateSuspects();
        displayInitialSuspect();
        startTimer();
    }

    // Display the initial suspect
    function displayInitialSuspect() {
        const theme = gameState.currentTheme;
        const container = document.createElement('div');
        container.className = 'initial-suspect-section';
        
        let html = '<h3>Initial Suspect Profile</h3>';
        html += '<p>This person is NOT guilty. Find who shares these patterns:</p>';
        html += '<div class="initial-suspect-traits">';
        
        Object.keys(theme.traits).forEach(trait => {
            const initialValue = gameState.initialSuspect[trait];
            const suspectValue = gameState.culprit[trait];
            
            if (initialValue !== undefined && suspectValue !== undefined) {
                const colorClass = initialValue === suspectValue ? 'green' : 
                                 initialValue === undefined ? 'gray' : 'yellow';
                html += `<div class="initial-trait ${colorClass}">
                            <span class="trait-label">${trait}:</span>
                            <span class="trait-value">${initialValue}</span>
                        </div>`;
            }
        });
        
        html += '</div>';
        html += '<div class="color-legend">';
        html += '<span class="legend-item"><span class="color-box green"></span> = Exact match with culprit</span>';
        html += '<span class="legend-item"><span class="color-box yellow"></span> = Close to culprit</span>';
        html += '<span class="legend-item"><span class="color-box gray"></span> = Different from culprit</span>';
        html += '</div>';
        
        container.innerHTML = html;
        document.getElementById('suspectsSection').appendChild(container);
    }

    // Initialize the game when the DOM is loaded
    document.addEventListener('DOMContentLoaded', initGame);
