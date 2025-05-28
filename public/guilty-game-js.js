// GUILTY Game - Complete Implementation with Fixed Gray Logic and Better Patterns
// This replaces the game logic portion of your guilty-game-js.js file

(function() {
    'use strict';

    // Game constants with corrected trait values
    const TRAIT_VALUES = {
        access: ['None', 'Visitor', 'Contractor', 'Staff', 'VIP'],
        timing: ['Asleep', 'Working', 'Home', 'Out', 'Verified'],
        knowledge: ['None', 'Basic', 'Limited', 'Familiar', 'Expert'],
        motive: ['None', 'Curious', 'Vengeful', 'Greedy', 'Desperate'],
        behavior: ['Helpful', 'Normal', 'Changed', 'Nervous', 'Suspicious']
    };

    // Balanced difficulty settings with more unknowns
    const DIFFICULTY_SETTINGS = {
        easy: {
            maxGuesses: 8,
            patterns: [
                { grays: 2, yellows: 1, unknowns: 2 },  // 2 gray + 1 yellow + 2 unknown
                { grays: 3, yellows: 0, unknowns: 2 },  // 3 gray + 0 yellow + 2 unknown
            ],
            minViableSuspects: 10,
            maxViableSuspects: 14,
            targetAverage: 3.5
        },
        medium: {
            maxGuesses: 6,
            patterns: [
                { grays: 1, yellows: 1, unknowns: 3 },  // 1 gray + 1 yellow + 3 unknown
                { grays: 2, yellows: 0, unknowns: 3 },  // 2 gray + 0 yellow + 3 unknown
            ],
            minViableSuspects: 10,
            maxViableSuspects: 14,
            targetAverage: 3.8
        },
        hard: {
            maxGuesses: 4,
            patterns: [
                { grays: 1, yellows: 0, unknowns: 4 },  // 1 gray + 0 yellow + 4 unknown
                { grays: 0, yellows: 1, unknowns: 4 },  // 0 gray + 1 yellow + 4 unknown
            ],
            minViableSuspects: 12,
            maxViableSuspects: 16,
            targetAverage: 4.0
        }
    };

    // Core trait comparison logic
    function compareTraits(suspectValue, culpritValue, traitType) {
        if (!suspectValue || !culpritValue) {
            return 'unknown';
        }
        
        const values = TRAIT_VALUES[traitType];
        const suspectIndex = values.indexOf(suspectValue);
        const culpritIndex = values.indexOf(culpritValue);
        
        if (suspectIndex === -1 || culpritIndex === -1) {
            return 'unknown';
        }
        
        const diff = Math.abs(suspectIndex - culpritIndex);
        
        if (diff === 0) return 'green';
        if (diff === 1) return 'yellow';
        return 'gray';
    }

    // FIXED: Get allowed values for yellow feedback (adjacent values)
    function getYellowAllowedValues(observedValue, traitType) {
        const values = TRAIT_VALUES[traitType];
        const index = values.indexOf(observedValue);
        const allowed = [];
        
        if (index > 0) allowed.push(values[index - 1]);
        if (index < values.length - 1) allowed.push(values[index + 1]);
        
        return allowed;
    }

    // FIXED: Get excluded values for gray feedback (value + ALL adjacent values)
    function getGrayExcludedValues(observedValue, traitType) {
        const values = TRAIT_VALUES[traitType];
        const index = values.indexOf(observedValue);
        const excluded = [];
        
        // Gray means culprit is 2+ steps away, so exclude:
        // 1. The exact value
        excluded.push(observedValue);
        
        // 2. ALL values that are 1 step away (adjacent)
        if (index > 0) excluded.push(values[index - 1]);
        if (index < values.length - 1) excluded.push(values[index + 1]);
        
        return excluded;
    }

    // Check if a suspect is viable given the constraints
    function isViableSuspect(candidateSuspect, initialSuspect, initialFeedback) {
        for (const trait in initialFeedback) {
            const feedback = initialFeedback[trait];
            
            // Skip unknown traits - they don't constrain
            if (!feedback || feedback === 'unknown') continue;
            
            const initialValue = initialSuspect[trait];
            const candidateValue = candidateSuspect[trait];
            
            if (!initialValue || !candidateValue) continue;
            
            // What feedback would we see if this candidate was the culprit?
            const hypotheticalFeedback = compareTraits(initialValue, candidateValue, trait);
            
            if (hypotheticalFeedback !== feedback) {
                return false;
            }
        }
        
        return true;
    }

    // Generate initial pattern with proper balance
    function generateBalancedPattern(suspects, culprit, difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        let bestPattern = null;
        let bestScore = -Infinity;
        
        // Try each pattern type for this difficulty
        for (const patternRule of settings.patterns) {
            // Try multiple suspects
            for (let attempt = 0; attempt < 50; attempt++) {
                const pattern = tryGeneratePattern(suspects, culprit, patternRule);
                
                if (pattern && pattern.viableCount >= settings.minViableSuspects && 
                    pattern.viableCount <= settings.maxViableSuspects) {
                    
                    // Score based on how close to target viable count
                    const targetViable = (settings.minViableSuspects + settings.maxViableSuspects) / 2;
                    const score = -Math.abs(pattern.viableCount - targetViable);
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestPattern = pattern;
                    }
                }
            }
        }
        
        // If no good pattern found, use safe fallback
        if (!bestPattern) {
            bestPattern = createSafeFallbackPattern(suspects, culprit, difficulty);
        }
        
        return bestPattern;
    }

    // Try to generate a pattern matching the rule
    function tryGeneratePattern(suspects, culprit, rule) {
        // Pick a random innocent suspect
        const innocents = suspects.filter(s => s !== culprit);
        const suspect = innocents[Math.floor(Math.random() * innocents.length)];
        
        // Calculate all feedback
        const fullFeedback = {};
        const feedbackCounts = { green: 0, yellow: 0, gray: 0 };
        
        for (const trait of Object.keys(TRAIT_VALUES)) {
            const fb = compareTraits(suspect[trait], culprit[trait], trait);
            fullFeedback[trait] = fb;
            if (fb !== 'unknown') feedbackCounts[fb]++;
        }
        
        // Check if we have enough of each type
        if (feedbackCounts.gray < rule.grays) return null;
        if (feedbackCounts.yellow < rule.yellows) return null;
        
        // Build the pattern
        const finalFeedback = {};
        const traits = Object.keys(TRAIT_VALUES);
        
        // Start with all unknowns
        traits.forEach(t => finalFeedback[t] = 'unknown');
        
        // Add required grays
        let graysAdded = 0;
        for (const trait of traits) {
            if (fullFeedback[trait] === 'gray' && graysAdded < rule.grays) {
                finalFeedback[trait] = 'gray';
                graysAdded++;
            }
        }
        
        // Add required yellows (but never more than 1!)
        let yellowsAdded = 0;
        for (const trait of traits) {
            if (fullFeedback[trait] === 'yellow' && yellowsAdded < rule.yellows) {
                finalFeedback[trait] = 'yellow';
                yellowsAdded++;
            }
        }
        
        // Verify we met the requirements
        if (graysAdded < rule.grays || yellowsAdded < rule.yellows) return null;
        
        // Count viable suspects
        const viableCount = suspects.filter(s => 
            isViableSuspect(s, suspect, finalFeedback)
        ).length;
        
        return {
            suspect,
            feedback: finalFeedback,
            viableCount,
            theoreticalMinGuesses: Math.max(3, Math.ceil(Math.log2(viableCount)))
        };
    }

    // Create a safe fallback pattern
    function createSafeFallbackPattern(suspects, culprit, difficulty) {
        const suspect = suspects.find(s => s !== culprit);
        const feedback = {};
        
        // Show mostly unknowns with 1 gray
        let grayShown = false;
        for (const trait of Object.keys(TRAIT_VALUES)) {
            const fb = compareTraits(suspect[trait], culprit[trait], trait);
            if (fb === 'gray' && !grayShown) {
                feedback[trait] = 'gray';
                grayShown = true;
            } else {
                feedback[trait] = 'unknown';
            }
        }
        
        return {
            suspect,
            feedback,
            viableCount: 14,
            theoreticalMinGuesses: 4
        };
    }

    // Display initial suspect with unknowns
    function displayInitialSuspect(suspect, feedback) {
        let html = `
            <div class="initial-suspect-section">
                <div class="initial-suspect-header">
                    <h3>Initial Suspect Profile</h3>
                    <p class="initial-suspect-note">This person is NOT guilty. Find who shares these trait patterns:</p>
                </div>
                <div class="initial-suspect-traits">
        `;
        
        const traitOrder = ['access', 'timing', 'knowledge', 'motive', 'behavior'];
        const traitLabels = {
            access: 'Museum Access',
            timing: 'Alibi Time',
            knowledge: 'Security Knowledge',
            motive: 'Motive Strength',
            behavior: 'Recent Behavior'
        };
        
        traitOrder.forEach(trait => {
            const value = suspect[trait];
            const fb = feedback[trait];
            let className = 'initial-trait';
            let displayValue = value;
            
            if (fb === 'unknown') {
                className += ' unknown';
                displayValue = '?';
            } else if (fb === 'green') {
                className += ' green';
            } else if (fb === 'yellow') {
                className += ' yellow';
            } else if (fb === 'gray') {
                className += ' gray';
            }
            
            html += `
                <div class="${className}">
                    <div class="initial-trait-label">${traitLabels[trait]}</div>
                    <div class="initial-trait-value">${displayValue}</div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="color-legend">
                    <div class="legend-item">
                        <div class="color-box green"></div>
                        <span>= Exact match with culprit</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box yellow"></div>
                        <span>= Close to culprit</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box gray"></div>
                        <span>= Different from culprit</span>
                    </div>
                    <div class="legend-item">
                        <div class="color-box unknown"></div>
                        <span>= Unknown</span>
                    </div>
                </div>
            </div>
        `;
        
        const board = document.getElementById('gameBoard');
        board.innerHTML = html;
    }

    // Update viable suspect count with fixed logic
    function updateViableCount(gameState) {
        const viable = gameState.suspects.filter(suspect => {
            // Skip eliminated suspects
            if (gameState.eliminatedSuspects.has(suspect.id)) return false;
            
            // Check against initial feedback with FIXED gray logic
            if (!isViableSuspect(suspect, gameState.initialSuspect, gameState.initialFeedback)) {
                return false;
            }
            
            // Check against all guesses
            for (const guess of gameState.guesses) {
                for (const trait in guess.feedback) {
                    const expectedFeedback = compareTraits(
                        guess.suspect[trait],
                        suspect[trait],
                        trait
                    );
                    if (expectedFeedback !== guess.feedback[trait]) {
                        return false;
                    }
                }
            }
            
            return true;
        });
        
        // Update display
        const viableCount = viable.length;
        const totalSuspects = gameState.suspects.length;
        const eliminated = totalSuspects - viableCount;
        const confidence = Math.round((eliminated / totalSuspects) * 100);
        
        document.getElementById('viableDisplay').textContent = viableCount;
        
        // Update confidence meter
        const confidenceFill = document.querySelector('.confidence-fill');
        const confidenceText = document.querySelector('.confidence-text');
        
        if (confidenceFill) {
            confidenceFill.style.width = `${confidence}%`;
        }
        
        if (confidenceText) {
            confidenceText.textContent = `Confidence: ${confidence}% (${viableCount} suspects remain viable)`;
        }
        
        return viable;
    }

    // Main game state class
    class GuiltyGameState {
        constructor(difficulty = 'medium') {
            this.difficulty = difficulty;
            this.settings = DIFFICULTY_SETTINGS[difficulty];
            this.suspects = [];
            this.culprit = null;
            this.initialSuspect = null;
            this.initialFeedback = null;
            this.guesses = [];
            this.eliminatedSuspects = new Set();
            this.startTime = Date.now();
            this.theoreticalMinGuesses = 3;
            this.isOver = false;
            this.wasLucky = false;
        }
        
        initialize(suspects, culprit) {
            this.suspects = suspects;
            this.culprit = culprit;
            
            // Generate balanced pattern
            const pattern = generateBalancedPattern(suspects, culprit, this.difficulty);
            this.initialSuspect = pattern.suspect;
            this.initialFeedback = pattern.feedback;
            this.theoreticalMinGuesses = pattern.theoreticalMinGuesses;
            
            // Debug log in dev mode
            if (window.GameManager && window.GameManager.devMode) {
                console.log('Initial pattern:', {
                    feedback: pattern.feedback,
                    viableCount: pattern.viableCount,
                    minGuesses: pattern.theoreticalMinGuesses
                });
                
                // Count feedback types
                const counts = { green: 0, yellow: 0, gray: 0, unknown: 0 };
                Object.values(pattern.feedback).forEach(fb => counts[fb]++);
                console.log('Feedback distribution:', counts);
            }
            
            // Display initial suspect
            displayInitialSuspect(this.initialSuspect, this.initialFeedback);
            
            // Display minimum guess message
            this.displayMinGuessMessage();
            
            // Initial viable count
            updateViableCount(this);
        }
        
        displayMinGuessMessage() {
            const message = `It is possible to solve this through logical deduction alone in ${this.theoreticalMinGuesses} guesses`;
            
            // Remove any existing message
            const existing = document.querySelector('.min-guess-message');
            if (existing) existing.remove();
            
            const messageEl = document.createElement('div');
            messageEl.className = 'min-guess-message';
            messageEl.textContent = message;
            messageEl.style.cssText = `
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid #6366f1;
                color: #a5b4fc;
                padding: 12px 20px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
                font-weight: 500;
            `;
            
            const gameStats = document.querySelector('.game-stats');
            if (gameStats && gameStats.nextSibling) {
                gameStats.parentNode.insertBefore(messageEl, gameStats.nextSibling);
            }
        }
        
        makeGuess(suspect) {
            if (this.isOver) return;
            
            const guessNumber = this.guesses.length + 1;
            const feedback = {};
            
            // Calculate feedback for each trait
            for (const trait of Object.keys(TRAIT_VALUES)) {
                feedback[trait] = compareTraits(suspect[trait], this.culprit[trait], trait);
            }
            
            // Add to guess history
            this.guesses.push({
                suspect,
                feedback,
                guessNumber
            });
            
            // Update guess display
            document.getElementById('guessDisplay').textContent = 
                `${guessNumber}/${this.settings.maxGuesses}`;
            
            // Display feedback
            this.displayGuessFeedback(suspect, feedback, guessNumber);
            
            // Check if won
            if (suspect === this.culprit) {
                // Determine if lucky
                if (guessNumber <= 2) {
                    this.wasLucky = true;
                } else {
                    const viableBeforeGuess = updateViableCount(this);
                    if (guessNumber < this.theoreticalMinGuesses) {
                        this.wasLucky = true;
                    }
                }
                
                this.endGame(true);
                return;
            }
            
            // Check if lost
            if (guessNumber >= this.settings.maxGuesses) {
                this.endGame(false);
                return;
            }
            
            // Update viable count
            updateViableCount(this);
        }
        
        displayGuessFeedback(suspect, feedback, guessNumber) {
            const board = document.getElementById('gameBoard');
            
            // Create guess row
            const guessRow = document.createElement('div');
            guessRow.className = 'guess-row-v2';
            guessRow.innerHTML = `
                <div class="guess-suspect">
                    <div class="guess-name">${suspect.name}</div>
                    <div class="guess-job">${suspect.job}</div>
                </div>
                <div class="guess-feedback">
                    ${this.createFeedbackElements(suspect, feedback)}
                </div>
            `;
            
            board.appendChild(guessRow);
            
            // Animate feedback reveal
            setTimeout(() => {
                guessRow.querySelectorAll('.trait-feedback').forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, i * 100);
                });
            }, 100);
        }
        
        createFeedbackElements(suspect, feedback) {
            const traitOrder = ['access', 'timing', 'knowledge', 'motive', 'behavior'];
            const traitLabels = {
                access: 'Access',
                timing: 'Timing',
                knowledge: 'Knowledge',
                motive: 'Motive',
                behavior: 'Behavior'
            };
            
            return traitOrder.map(trait => {
                const fb = feedback[trait];
                const value = suspect[trait];
                let className = 'trait-feedback';
                let hint = '';
                
                if (fb === 'green') {
                    className += ' correct';
                    hint = 'Exact match!';
                } else if (fb === 'yellow') {
                    className += ' close';
                    hint = 'One step away';
                } else if (fb === 'gray') {
                    className += ' wrong';
                    hint = 'Different';
                } else {
                    className += ' unknown';
                    hint = 'Unknown';
                }
                
                return `
                    <div class="${className}">
                        <div class="trait-feedback-label">${traitLabels[trait]}</div>
                        <div class="trait-feedback-value">${value || '?'}</div>
                        <div class="trait-feedback-hint">${hint}</div>
                    </div>
                `;
            }).join('');
        }
        
        eliminateSuspect(suspect) {
            if (this.eliminatedSuspects.has(suspect.id)) {
                // Restore
                this.eliminatedSuspects.delete(suspect.id);
                updateSuspectCard(suspect, false);
            } else {
                // Eliminate
                this.eliminatedSuspects.add(suspect.id);
                updateSuspectCard(suspect, true);
            }
            
            updateViableCount(this);
        }
        
        endGame(won) {
            this.isOver = true;
            const endTime = Date.now();
            const timeTaken = Math.floor((endTime - this.startTime) / 1000);
            const guessCount = this.guesses.length;
            
            let title, message;
            
            if (won) {
                if (this.wasLucky) {
                    title = "🍀 Lucky Win!";
                    message = `You found the culprit in ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}! ` +
                             `That required some luck - the minimum through pure deduction was ${this.theoreticalMinGuesses} guesses.`;
                } else {
                    title = "🎯 Case Solved!";
                    message = `Excellent deduction! You found the culprit in ${guessCount} guesses.`;
                }
            } else {
                title = "❌ Case Unsolved";
                message = `The culprit escaped! It was ${this.culprit.name} (${this.culprit.job}).`;
            }
            
            this.showGameOver(won, title, message, guessCount, timeTaken);
        }
        
        showGameOver(won, title, message, guessCount, timeTaken) {
            const gameOverEl = document.getElementById('gameOver');
            const titleEl = document.getElementById('gameOverTitle');
            const messageEl = document.getElementById('gameOverMessage');
            
            gameOverEl.className = won ? 'game-over won' : 'game-over lost';
            titleEl.textContent = title;
            
            const minutes = Math.floor(timeTaken / 60);
            const seconds = timeTaken % 60;
            const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            
            let detailsHtml = `
                <p>${message}</p>
                <div class="game-stats-final">
                    <div class="stat-final">
                        <span class="stat-label">Guesses:</span>
                        <span class="stat-value">${guessCount}/${this.settings.maxGuesses}</span>
                    </div>
                    <div class="stat-final">
                        <span class="stat-label">Time:</span>
                        <span class="stat-value">${timeStr}</span>
                    </div>
                    ${this.wasLucky ? `
                    <div class="stat-final lucky">
                        <span class="stat-label">Lucky Factor:</span>
                        <span class="stat-value">🍀 High</span>
                    </div>
                    ` : ''}
                </div>
            `;
            
            if (!won) {
                detailsHtml += `
                    <div class="culprit-reveal">
                        <strong>The culprit was:</strong> ${this.culprit.name} (${this.culprit.job})
                    </div>
                `;
            }
            
            messageEl.innerHTML = detailsHtml;
            gameOverEl.style.display = 'block';
            
            // Scroll to game over
            gameOverEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Update suspect card display
    function updateSuspectCard(suspect, isEliminated) {
        const card = document.querySelector(`[data-suspect-id="${suspect.id}"]`);
        if (!card) return;
        
        if (isEliminated) {
            card.classList.add('eliminated');
            card.querySelector('.accuse-btn').disabled = true;
            card.querySelector('.exonerate-btn').textContent = 'RESTORE';
            
            // Add visual X mark
            if (!card.querySelector('.elimination-mark')) {
                const mark = document.createElement('div');
                mark.className = 'elimination-mark';
                mark.textContent = '✕';
                card.appendChild(mark);
            }
        } else {
            card.classList.remove('eliminated');
            card.querySelector('.accuse-btn').disabled = false;
            card.querySelector('.exonerate-btn').textContent = 'EXONERATE';
            
            const mark = card.querySelector('.elimination-mark');
            if (mark) mark.remove();
        }
    }

    // Diagnostic function for development
    window.diagnoseSuspectViability = function() {
        if (!window.GameManager || !window.GameManager.gameState) {
            console.log("No active game");
            return;
        }
        
        const state = window.GameManager.gameState;
        const feedback = state.initialFeedback;
        const initialSuspect = state.initialSuspect;
        
        console.log("\n=== SUSPECT VIABILITY DIAGNOSIS ===");
        console.log("Initial feedback:", feedback);
        
        // Analyze constraints
        const constraints = {};
        for (const trait in feedback) {
            if (feedback[trait] === 'yellow') {
                constraints[trait] = {
                    type: 'yellow',
                    allowed: getYellowAllowedValues(initialSuspect[trait], trait)
                };
            } else if (feedback[trait] === 'gray') {
                constraints[trait] = {
                    type: 'gray',
                    excluded: getGrayExcludedValues(initialSuspect[trait], trait),
                    allowed: TRAIT_VALUES[trait].filter(v => 
                        !getGrayExcludedValues(initialSuspect[trait], trait).includes(v)
                    )
                };
            } else if (feedback[trait] !== 'unknown') {
                constraints[trait] = {
                    type: feedback[trait],
                    allowed: [initialSuspect[trait]]
                };
            }
        }
        
        console.log("\nConstraints:", constraints);
        
        // Check each suspect
        let viableCount = 0;
        state.suspects.forEach(suspect => {
            const isViable = isViableSuspect(suspect, initialSuspect, feedback);
            if (isViable) {
                viableCount++;
                console.log(`✓ ${suspect.name} is viable`);
            }
        });
        
        console.log(`\nTotal viable: ${viableCount}`);
    };

    // Export to window
    window.GuiltyGameState = GuiltyGameState;
    window.TRAIT_VALUES = TRAIT_VALUES;
    window.updateViableCount = updateViableCount;
    window.isViableSuspect = isViableSuspect;
})();
