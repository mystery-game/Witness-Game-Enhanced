// GUILTY - Detective Mystery Game - Complete Implementation
document.addEventListener('DOMContentLoaded', function() {
    const GameManager = (function() {
        // Game state
        let gameState = {
            difficulty: 'medium',
            suspects: [],
            culprit: null,
            cluesRevealed: [],
            startTime: null,
            timerInterval: null,
            gameActive: false,
            eliminationRound: 1,
            phase: 'elimination' // 'elimination' or 'final'
        };

        // Trait definitions with progressions
        const TRAIT_PROGRESSIONS = {
            access: ['None', 'Visitor', 'Contractor', 'Staff', 'VIP'],
            timing: ['Asleep', 'Working', 'Home', 'Out', 'Verified'],
            knowledge: ['None', 'Basic', 'Limited', 'Familiar', 'Expert'],
            motive: ['None', 'Curious', 'Vengeful', 'Greedy', 'Desperate'],
            behavior: ['Helpful', 'Normal', 'Changed', 'Nervous', 'Suspicious']
        };

        // Crime scenarios
        const CRIME_SCENARIOS = [
            {
                title: "The Museum Heist",
                description: "A priceless artifact has vanished from the Metropolitan Museum during a private gala. The thief left behind only subtle clues and disappeared into the night."
            },
            {
                title: "TechCorp Data Breach",
                description: "Confidential client data has been stolen from TechCorp's secure servers. The insider threat has compromised years of sensitive information."
            },
            {
                title: "The Restaurant Poisoning",
                description: "A celebrity chef has been poisoned at an exclusive restaurant opening. Someone with access to the kitchen had deadly intentions."
            }
        ];

        // Names pool for suspects
        const SUSPECT_NAMES = [
            'Alex Chen', 'Jordan Rivera', 'Morgan Blake', 'Taylor Swift', 'Casey Wong',
            'Riley Park', 'Avery Stone', 'Quinn Davis', 'Sage Miller', 'Drew Wilson',
            'Finley Cruz', 'Rowan Foster', 'Harper Lane', 'Kendall Gray', 'Logan Reed',
            'Cameron Bell'
        ];

        const JOBS = [
            'Security Guard', 'Curator', 'Caterer', 'Guest', 'Maintenance',
            'IT Specialist', 'Manager', 'Artist', 'Journalist', 'VIP',
            'Staff Member', 'Contractor', 'Volunteer', 'Photographer', 'Server',
            'Chef'
        ];

        // Initialize game
        function init() {
            bindEvents();
            showMainMenu();
        }

        function bindEvents() {
            // Main menu events
            document.getElementById('start-game').addEventListener('click', startGame);
            document.getElementById('rules-btn').addEventListener('click', showRules);
            document.getElementById('difficulty-select').addEventListener('change', (e) => {
                gameState.difficulty = e.target.value;
            });

            // Game events
            document.getElementById('checkExonerationsBtn').addEventListener('click', checkExonerations);
        }

        function showMainMenu() {
            document.getElementById('main-menu').style.display = 'block';
            document.getElementById('game-screen').style.display = 'none';
        }

        function showRules() {
            alert(`HOW TO PLAY GUILTY:

1. ELIMINATION ROUNDS: Exonerate suspects who don't match the clues
2. TRAIT MATCHING: Green = exact match, Yellow = close, Gray = wrong
3. PROGRESSION: Complete elimination rounds to get more clues
4. WIN CONDITION: Find the culprit when only one suspect remains
5. TIME CHALLENGE: Solve as quickly as possible!

DIFFICULTY LEVELS:
• Easy: More starting clues, forgiving matching
• Medium: Balanced challenge
• Hard: Minimal clues, precise matching required`);
        }

        function startGame() {
            // Hide menu, show game
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('game-screen').style.display = 'block';

            // Initialize game state
            gameState.startTime = Date.now();
            gameState.gameActive = true;
            gameState.eliminationRound = 1;
            gameState.phase = 'elimination';
            gameState.cluesRevealed = [];

            // Generate game content
            setupCrimeScenario();
            generateSuspects();
            generateCulprit();
            generateInitialClues();
            
            // Start UI updates
            startTimer();
            updateGameStats();
            renderSuspects();
            updatePhaseIndicator();
        }

        function setupCrimeScenario() {
            const scenario = CRIME_SCENARIOS[Math.floor(Math.random() * CRIME_SCENARIOS.length)];
            document.getElementById('crimeTitle').textContent = scenario.title;
            document.getElementById('crimeDescription').textContent = scenario.description;
        }

        function generateSuspects() {
            gameState.suspects = [];
            const shuffledNames = [...SUSPECT_NAMES].sort(() => Math.random() - 0.5);
            const shuffledJobs = [...JOBS].sort(() => Math.random() - 0.5);

            for (let i = 0; i < 16; i++) {
                const suspect = {
                    id: i,
                    name: shuffledNames[i],
                    job: shuffledJobs[i],
                    traits: generateRandomTraits(),
                    exonerated: false,
                    shouldExonerate: false
                };
                gameState.suspects.push(suspect);
            }
        }

        function generateRandomTraits() {
            const traits = {};
            Object.keys(TRAIT_PROGRESSIONS).forEach(traitType => {
                const values = TRAIT_PROGRESSIONS[traitType];
                traits[traitType] = values[Math.floor(Math.random() * values.length)];
            });
            return traits;
        }

        function generateCulprit() {
            // Select random suspect as culprit
            const availableSuspects = gameState.suspects.filter(s => !s.exonerated);
            gameState.culprit = availableSuspects[Math.floor(Math.random() * availableSuspects.length)];
        }

        function generateInitialClues() {
            const numClues = gameState.difficulty === 'easy' ? 3 : 
                            gameState.difficulty === 'medium' ? 2 : 1;
            
            const traitTypes = Object.keys(TRAIT_PROGRESSIONS);
            const selectedTraits = traitTypes.sort(() => Math.random() - 0.5).slice(0, numClues);
            
            selectedTraits.forEach(traitType => {
                gameState.cluesRevealed.push({
                    type: traitType,
                    value: gameState.culprit.traits[traitType]
                });
            });

            updateSuspectStatuses();
            renderClues();
        }

        function updateSuspectStatuses() {
            gameState.suspects.forEach(suspect => {
                suspect.shouldExonerate = !matchesCulpritClues(suspect);
            });
        }

        function matchesCulpritClues(suspect) {
            return gameState.cluesRevealed.every(clue => {
                const suspectValue = suspect.traits[clue.type];
                const culpritValue = clue.value;
                
                if (gameState.difficulty === 'easy') {
                    return getTraitDistance(clue.type, suspectValue, culpritValue) <= 1;
                } else if (gameState.difficulty === 'medium') {
                    return suspectValue === culpritValue || 
                           getTraitDistance(clue.type, suspectValue, culpritValue) <= 1;
                } else {
                    return suspectValue === culpritValue;
                }
            });
        }

        function getTraitDistance(traitType, value1, value2) {
            const progression = TRAIT_PROGRESSIONS[traitType];
            const index1 = progression.indexOf(value1);
            const index2 = progression.indexOf(value2);
            return Math.abs(index1 - index2);
        }

        function renderClues() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = '<h3>Current Clues:</h3>';
            
            if (gameState.cluesRevealed.length === 0) {
                gameBoard.innerHTML += '<p>No clues revealed yet. Start eliminating suspects!</p>';
                return;
            }

            const clueRow = document.createElement('div');
            clueRow.className = 'clue-row';
            
            const clueFeedback = document.createElement('div');
            clueFeedback.className = 'clue-feedback';
            
            gameState.cluesRevealed.forEach(clue => {
                const traitDiv = document.createElement('div');
                traitDiv.className = 'trait-feedback correct';
                traitDiv.innerHTML = `<strong>${capitalizeFirst(clue.type)}:</strong> ${clue.value}`;
                clueFeedback.appendChild(traitDiv);
            });
            
            clueRow.appendChild(clueFeedback);
            gameBoard.appendChild(clueRow);
        }

        function renderSuspects() {
            const grid = document.getElementById('suspectsGrid');
            grid.innerHTML = '';

            gameState.suspects.forEach(suspect => {
                if (suspect.exonerated) return; // Don't show exonerated suspects

                const card = document.createElement('div');
                card.className = 'suspect-card';
                card.dataset.suspectId = suspect.id;

                if (suspect.shouldExonerate) {
                    card.classList.add('should-exonerate');
                }

                card.innerHTML = `
                    <div class="suspect-name">${suspect.name}</div>
                    <div class="suspect-job">${suspect.job}</div>
                    <div class="suspect-traits">
                        ${Object.entries(suspect.traits).map(([type, value]) => 
                            `<div class="trait-item">
                                <span>${capitalizeFirst(type)}</span>
                                <span>${value}</span>
                            </div>`
                        ).join('')}
                    </div>
                    <div class="suspect-actions">
                        <button class="suspect-button exonerate-btn" onclick="GameManager.exonerateSuspect(${suspect.id})">
                            Exonerate
                        </button>
                    </div>
                `;

                grid.appendChild(card);
            });
        }

        function exonerateSuspect(suspectId) {
            const suspect = gameState.suspects.find(s => s.id === suspectId);
            if (!suspect || suspect.exonerated) return;

            suspect.exonerated = true;
            
            // Check if this was the culprit
            if (suspect === gameState.culprit) {
                endGame(false, "You exonerated the culprit!");
                return;
            }

            updateGameStats();
            renderSuspects();
            updateExonerationTracker();

            // Check if only culprit remains
            const remainingSuspects = gameState.suspects.filter(s => !s.exonerated);
            if (remainingSuspects.length === 1) {
                endGame(true, "Congratulations! You found the culprit!");
            }
        }

        function checkExonerations() {
            let correctExonerations = 0;
            let incorrectExonerations = 0;
            let shouldExonerateCount = 0;

            gameState.suspects.forEach(suspect => {
                if (suspect.shouldExonerate) {
                    shouldExonerateCount++;
                    if (suspect.exonerated) {
                        correctExonerations++;
                    }
                } else if (suspect.exonerated) {
                    incorrectExonerations++;
                }
            });

            // Check if all eligible suspects have been exonerated
            if (correctExonerations === shouldExonerateCount && incorrectExonerations === 0) {
                // Give new clue
                addNewClue();
                gameState.eliminationRound++;
                updatePhaseIndicator();
            } else {
                // Show feedback
                showExonerationFeedback(correctExonerations, shouldExonerateCount, incorrectExonerations);
            }
        }

        function addNewClue() {
            const availableTraits = Object.keys(TRAIT_PROGRESSIONS).filter(type => 
                !gameState.cluesRevealed.some(clue => clue.type === type)
            );

            if (availableTraits.length > 0) {
                const newTraitType = availableTraits[Math.floor(Math.random() * availableTraits.length)];
                gameState.cluesRevealed.push({
                    type: newTraitType,
                    value: gameState.culprit.traits[newTraitType]
                });

                updateSuspectStatuses();
                renderClues();
                renderSuspects();
                updateExonerationTracker();

                // Show hint
                showHint(`New clue revealed! The culprit has ${newTraitType}: ${gameState.culprit.traits[newTraitType]}`);
            }
        }

        function showExonerationFeedback(correct, total, incorrect) {
            const message = incorrect > 0 ? 
                `❌ You exonerated ${incorrect} suspects incorrectly. Only exonerate suspects who don't match ALL clues.` :
                `✅ ${correct}/${total} correct exonerations. Exonerate ${total - correct} more suspects to get a new clue!`;
            
            showHint(message);
        }

        function showHint(message) {
            const existing = document.querySelector('.hint-reveal');
            if (existing) existing.remove();

            const hint = document.createElement('div');
            hint.className = 'hint-reveal';
            hint.innerHTML = `
                <div class="hint-title">Investigation Update</div>
                <div>${message}</div>
            `;

            document.getElementById('gameBoard').appendChild(hint);
        }

        function updateExonerationTracker() {
            const shouldExonerate = gameState.suspects.filter(s => s.shouldExonerate && !s.exonerated).length;
            const exonerated = gameState.suspects.filter(s => s.exonerated).length;
            const remaining = gameState.suspects.filter(s => !s.exonerated).length;

            document.getElementById('shouldExonerateCount').textContent = shouldExonerate;
            document.getElementById('exoneratedCount').textContent = exonerated;
            document.getElementById('remainingCount').textContent = remaining;

            // Enable/disable check button
            const checkBtn = document.getElementById('checkExonerationsBtn');
            checkBtn.disabled = shouldExonerate === 0;
        }

        function updatePhaseIndicator() {
            const indicator = document.getElementById('phaseIndicator');
            const title = indicator.querySelector('.phase-title');
            const description = indicator.querySelector('.phase-description');

            title.textContent = `Elimination Round ${gameState.eliminationRound}`;
            description.textContent = 'Exonerate all suspects who don\'t match the clues to receive another trait!';
        }

        function startTimer() {
            gameState.timerInterval = setInterval(() => {
                if (!gameState.gameActive) return;

                const elapsed = Date.now() - gameState.startTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                
                document.getElementById('timerDisplay').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }

        function updateGameStats() {
            document.getElementById('cluesDisplay').textContent = gameState.cluesRevealed.length;
            document.getElementById('viableDisplay').textContent = 
                gameState.suspects.filter(s => !s.exonerated).length;
            document.getElementById('roundsDisplay').textContent = gameState.eliminationRound;
        }

        function endGame(won, message) {
            gameState.gameActive = false;
            clearInterval(gameState.timerInterval);

            // Show culprit
            if (gameState.culprit) {
                const culpritCard = document.querySelector(`[data-suspect-id="${gameState.culprit.id}"]`);
                if (culpritCard) {
                    culpritCard.classList.add('the-culprit');
                }
            }

            // Show game over screen
            setTimeout(() => {
                const gameOver = document.getElementById('gameOver');
                const title = document.getElementById('gameOverTitle');
                const messageDiv = document.getElementById('gameOverMessage');

                title.textContent = won ? '🎉 Case Solved!' : '❌ Case Failed!';
                messageDiv.innerHTML = `
                    <p>${message}</p>
                    <p>The culprit was: <strong>${gameState.culprit.name}</strong></p>
                    <p>Time: ${document.getElementById('timerDisplay').textContent}</p>
                    <p>Rounds: ${gameState.eliminationRound}</p>
                `;

                if (won) {
                    gameOver.classList.add('won');
                }

                gameOver.style.display = 'block';
            }, 2000);
        }

        function capitalizeFirst(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        // Public API
        return {
            init,
            exonerateSuspect
        };
    })();

    // Initialize the game
    GameManager.init();
    
    // Make GameManager globally accessible
    window.GameManager = GameManager;
}); 