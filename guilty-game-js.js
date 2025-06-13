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
            updateExonerationTracker();
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
            // Start with minimal information - just 1 clue for all difficulties
            // CRITICAL: Ensure NO exact matches (greens) - only yellow/gray matches allowed
            const numClues = 1;
            
            let attempts = 0;
            const maxAttempts = 50;
            
            while (attempts < maxAttempts) {
                // Clear any existing clues
                gameState.cluesRevealed = [];
                
                const traitTypes = Object.keys(TRAIT_PROGRESSIONS);
                const selectedTraitType = traitTypes[Math.floor(Math.random() * traitTypes.length)];
                
                gameState.cluesRevealed.push({
                    type: selectedTraitType,
                    value: gameState.culprit.traits[selectedTraitType]
                });
                
                // Check if this clue creates any exact matches (greens)
                const exactMatches = gameState.suspects.filter(suspect => 
                    suspect !== gameState.culprit && 
                    suspect.traits[selectedTraitType] === gameState.culprit.traits[selectedTraitType]
                ).length;
                
                // If no exact matches, this clue is good
                if (exactMatches === 0) {
                    break;
                }
                
                attempts++;
            }
            
            // If we couldn't find a trait with no exact matches, fall back to any trait
            if (attempts >= maxAttempts) {
                gameState.cluesRevealed = [];
                const traitTypes = Object.keys(TRAIT_PROGRESSIONS);
                const selectedTraitType = traitTypes[Math.floor(Math.random() * traitTypes.length)];
                gameState.cluesRevealed.push({
                    type: selectedTraitType,
                    value: gameState.culprit.traits[selectedTraitType]
                });
            }

            updateSuspectStatuses();
            renderClues();
            updateExonerationTracker();
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
                const distance = getTraitDistance(clue.type, suspectValue, culpritValue);
                
                // Fixed logic: If suspect matches exactly, they're viable
                if (suspectValue === culpritValue) {
                    return true;
                }
                
                // Yellow zone logic with edge case handling
                if (gameState.difficulty === 'easy') {
                    return distance <= 1;
                } else if (gameState.difficulty === 'medium') {
                    return distance <= 1;
                } else {
                    // Hard mode: Only exact matches count
                    return false;
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
                const card = document.createElement('div');
                card.className = 'suspect-card';
                card.dataset.suspectId = suspect.id;

                // Apply visual states
                if (suspect.exonerated) {
                    card.classList.add('exonerated');
                }
                if (suspect.shouldExonerate && !suspect.exonerated) {
                    card.classList.add('should-exonerate');
                }

                // Create action buttons based on exonerated state
                const actionButton = suspect.exonerated ? 
                    `<button class="suspect-button un-exonerate-btn" onclick="GameManager.unExonerateSuspect(${suspect.id})">
                        Un-Exonerate
                    </button>` :
                    `<button class="suspect-button exonerate-btn" onclick="GameManager.exonerateSuspect(${suspect.id})">
                        Exonerate
                    </button>`;

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
                        ${actionButton}
                    </div>
                `;

                grid.appendChild(card);
            });
        }

        function exonerateSuspect(suspectId) {
            const suspect = gameState.suspects.find(s => s.id === suspectId);
            if (!suspect || suspect.exonerated) return;

            console.log(`Exonerating suspect: ${suspect.name}`);
            suspect.exonerated = true;
            
            // Check if this was the culprit
            if (suspect === gameState.culprit) {
                endGame(false, "You exonerated the culprit!");
                return;
            }

            // Update all displays and trackers
            updateGameStats();
            renderSuspects();
            updateExonerationTracker();

            // Check if only culprit remains (among non-exonerated)
            const remainingSuspects = gameState.suspects.filter(s => !s.exonerated);
            if (remainingSuspects.length === 1) {
                endGame(true, "Congratulations! You found the culprit!");
            }
        }

        function unExonerateSuspect(suspectId) {
            const suspect = gameState.suspects.find(s => s.id === suspectId);
            if (!suspect || !suspect.exonerated) return;

            console.log(`Un-exonerating suspect: ${suspect.name}`);
            suspect.exonerated = false;
            
            // Update all displays and trackers
            updateGameStats();
            renderSuspects();
            updateExonerationTracker();
        }

        function checkExonerations() {
            console.log('checkExonerations called'); // Debug log
            
            // Ensure suspect statuses are up to date
            updateSuspectStatuses();
            
            let correctExonerations = 0;
            let incorrectExonerations = 0;
            let shouldExonerateCount = 0;
            let notExoneratedCount = 0;

            gameState.suspects.forEach(suspect => {
                if (suspect.shouldExonerate) {
                    shouldExonerateCount++;
                    if (suspect.exonerated) {
                        correctExonerations++;
                    } else {
                        notExoneratedCount++;
                    }
                } else if (suspect.exonerated && suspect !== gameState.culprit) {
                    incorrectExonerations++;
                }
            });

            console.log('Exoneration Check:', {
                shouldExonerateCount,
                correctExonerations,
                notExoneratedCount,
                incorrectExonerations
            });

            // Check if all eligible suspects have been exonerated and no incorrect ones
            if (correctExonerations === shouldExonerateCount && incorrectExonerations === 0 && shouldExonerateCount > 0) {
                // Perfect round - give new clue
                addNewClue();
                gameState.eliminationRound++;
                updatePhaseIndicator();
                updateExonerationTracker();
                showHint(`✅ Perfect elimination! New clue revealed for Round ${gameState.eliminationRound}`);
            } else {
                // Show specific feedback about what needs to be fixed
                let message = "";
                if (incorrectExonerations > 0) {
                    message = `❌ You exonerated ${incorrectExonerations} suspect(s) incorrectly. Un-exonerate suspects who DO match the clues.`;
                } else if (notExoneratedCount > 0) {
                    message = `⚠️ You need to exonerate ${notExoneratedCount} more suspect(s) who don't match ALL the clues. Look for suspects highlighted in yellow.`;
                } else if (shouldExonerateCount === 0) {
                    message = `🤔 No suspects need to be exonerated right now. All remaining suspects are viable matches for the current clues.`;
                } else {
                    message = `📝 Review the current clues and suspect traits carefully.`;
                }
                showHint(message);
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

                console.log(`New clue added: ${newTraitType} = ${gameState.culprit.traits[newTraitType]}`);
                
                // Update everything after new clue
                updateSuspectStatuses();
                renderClues();
                renderSuspects();
                updateGameStats();
                updateExonerationTracker();
            }
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

            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.remove();
                }
            }, 5000);
        }

        function updateExonerationTracker() {
            // Recalculate suspect statuses first to ensure accuracy
            updateSuspectStatuses();
            
            const shouldExonerate = gameState.suspects.filter(s => s.shouldExonerate && !s.exonerated).length;
            const exonerated = gameState.suspects.filter(s => s.exonerated).length;
            const remaining = gameState.suspects.filter(s => !s.exonerated).length;
            
            // Count incorrect exonerations (suspects who are exonerated but shouldn't be, excluding culprit)
            const incorrectlyExonerated = gameState.suspects.filter(s => 
                s.exonerated && !s.shouldExonerate && s !== gameState.culprit
            ).length;

            document.getElementById('shouldExonerateCount').textContent = shouldExonerate;
            document.getElementById('exoneratedCount').textContent = exonerated;
            document.getElementById('remainingCount').textContent = remaining;

            // Enable check button if there's any work to do:
            // - Suspects that should be exonerated but aren't
            // - Suspects that are incorrectly exonerated
            const checkBtn = document.getElementById('checkExonerationsBtn');
            const hasWork = shouldExonerate > 0 || incorrectlyExonerated > 0;
            checkBtn.disabled = !hasWork;
            
            // Debug logging (remove in production)
            console.log('Tracker Update:', {
                shouldExonerate,
                exonerated, 
                remaining,
                incorrectlyExonerated,
                hasWork,
                buttonDisabled: checkBtn.disabled
            });
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
            exonerateSuspect,
            unExonerateSuspect
        };
    })();

    // Initialize the game
    GameManager.init();
    
    // Make GameManager globally accessible
    window.GameManager = GameManager;
}); 