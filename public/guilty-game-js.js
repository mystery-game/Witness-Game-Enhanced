// GUILTY Game - Complete Implementation with Unknown Traits and Fixed Logic
// This replaces the game logic portion of your guilty-game-js.js file

(function() {
    'use strict';

    // Game constants with corrected trait values matching your screenshots
    const TRAIT_VALUES = {
        access: ['None', 'Visitor', 'Contractor', 'Staff', 'VIP'],
        timing: ['Asleep', 'Working', 'Home', 'Out', 'Verified'],
        knowledge: ['None', 'Basic', 'Limited', 'Familiar', 'Expert'],
        motive: ['None', 'Curious', 'Vengeful', 'Greedy', 'Desperate'],
        behavior: ['Helpful', 'Normal', 'Changed', 'Nervous', 'Suspicious']
    };

    // Enhanced difficulty settings with unknown traits
    const DIFFICULTY_SETTINGS = {
        easy: {
            maxGuesses: 8,
            yellowClues: 2,
            greenClues: 1,
            unknownTraits: 1,
            minViableSuspects: 8,
            maxViableSuspects: 12,
            targetAverage: 3.5
        },
        medium: {
            maxGuesses: 6,
            yellowClues: 1,
            greenClues: 0,
            unknownTraits: 2,
            minViableSuspects: 10,
            maxViableSuspects: 14,
            targetAverage: 3.8
        },
        hard: {
            maxGuesses: 4,
            yellowClues: 1,
            greenClues: 0,
            unknownTraits: 3,
            minViableSuspects: 12,
            maxViableSuspects: 16,
            targetAverage: 4.0
        }
    };

    // Core game logic functions
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

    // Get allowed values for yellow feedback
    function getYellowAllowedValues(observedValue, traitType) {
        const values = TRAIT_VALUES[traitType];
        const index = values.indexOf(observedValue);
        const allowed = [];
        
        if (index > 0) allowed.push(values[index - 1]);
        if (index < values.length - 1) allowed.push(values[index + 1]);
        
        return allowed;
    }

    // Get excluded values for gray feedback (value + adjacent values)
    function getGrayExcludedValues(observedValue, traitType) {
        const values = TRAIT_VALUES[traitType];
        const index = values.indexOf(observedValue);
        const excluded = [observedValue]; // The value itself
        
        // Also exclude adjacent values
        if (index > 0) excluded.push(values[index - 1]);
        if (index < values.length - 1) excluded.push(values[index + 1]);
        
        return excluded;
    }

    // Check if a suspect is viable given the initial feedback
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

    // Select which traits to hide based on information value
    function selectTraitsToHide(feedback, difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const traits = Object.keys(feedback);
        const traitsToHide = [];
        
        // Categorize traits by information value
        const traitsByValue = {
            green: [],
            yellow: [],
            gray: []
        };
        
        traits.forEach(trait => {
            const fb = feedback[trait];
            if (fb === 'green') traitsByValue.green.push(trait);
            else if (fb === 'yellow') traitsByValue.yellow.push(trait);
            else if (fb === 'gray') traitsByValue.gray.push(trait);
        });
        
        // Hide most informative traits first
        let hiddenCount = 0;
        const hideOrder = ['green', 'yellow', 'gray'];
        
        for (const category of hideOrder) {
            for (const trait of traitsByValue[category]) {
                if (hiddenCount < settings.unknownTraits) {
                    traitsToHide.push(trait);
                    hiddenCount++;
                }
            }
        }
        
        // If we still need to hide more, randomly select
        while (hiddenCount < settings.unknownTraits && hiddenCount < traits.length) {
            const remainingTraits = traits.filter(t => !traitsToHide.includes(t));
            if (remainingTraits.length > 0) {
                const randomTrait = remainingTraits[Math.floor(Math.random() * remainingTraits.length)];
                traitsToHide.push(randomTrait);
                hiddenCount++;
            } else {
                break;
            }
        }
        
        return traitsToHide;
    }

    // Generate initial suspect with appropriate difficulty
    function generateInitialSuspectPattern(suspects, culprit, difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const candidatePatterns = [];
        
        // Try each suspect as potential initial suspect
        for (const suspect of suspects) {
            if (suspect === culprit) continue;
            
            // Calculate feedback pattern
            const feedback = {};
            let greenCount = 0;
            let yellowCount = 0;
            let grayCount = 0;
            
            for (const trait of Object.keys(TRAIT_VALUES)) {
                const result = compareTraits(suspect[trait], culprit[trait], trait);
                feedback[trait] = result;
                
                if (result === 'green') greenCount++;
                else if (result === 'yellow') yellowCount++;
                else if (result === 'gray') grayCount++;
            }
            
            // Skip if too many greens or wrong yellow count
            if (greenCount > settings.greenClues) continue;
            if (yellowCount < settings.yellowClues) continue;
            
            // Calculate viable suspects for this pattern
            const viableCount = suspects.filter(s => 
                isViableSuspect(s, suspect, feedback)
            ).length;
            
            // Skip if outside target range
            if (viableCount < settings.minViableSuspects || 
                viableCount > settings.maxViableSuspects) continue;
            
            candidatePatterns.push({
                suspect,
                feedback,
                viableCount,
                greenCount,
                yellowCount,
                grayCount
            });
        }
        
        // If no perfect patterns, relax constraints
        if (candidatePatterns.length === 0) {
            // Try again with relaxed constraints
            return generateInitialSuspectPatternRelaxed(suspects, culprit, difficulty);
        }
        
        // Score patterns
        candidatePatterns.forEach(pattern => {
            pattern.score = 0;
            
            // Prefer patterns close to target viable count
            const targetViable = (settings.minViableSuspects + settings.maxViableSuspects) / 2;
            pattern.score -= Math.abs(pattern.viableCount - targetViable);
            
            // Prefer exact yellow count
            if (pattern.yellowCount === settings.yellowClues) pattern.score += 5;
            
            // Penalize extra greens
            pattern.score -= pattern.greenCount * 3;
        });
        
        // Sort and pick best
        candidatePatterns.sort((a, b) => b.score - a.score);
        const chosen = candidatePatterns[0];
        
        // Apply unknown traits
        const traitsToHide = selectTraitsToHide(chosen.feedback, difficulty);
        const finalFeedback = { ...chosen.feedback };
        
        traitsToHide.forEach(trait => {
            finalFeedback[trait] = 'unknown';
        });
        
        // Recalculate viable count with unknowns
        const finalViableCount = suspects.filter(s => 
            isViableSuspect(s, chosen.suspect, finalFeedback)
        ).length;
        
        return {
            suspect: chosen.suspect,
            feedback: finalFeedback,
            hiddenTraits: traitsToHide,
            viableCount: finalViableCount,
            theoreticalMinGuesses: Math.max(3, Math.ceil(Math.log2(finalViableCount)))
        };
    }

    // Relaxed pattern generation if strict criteria can't be met
    function generateInitialSuspectPatternRelaxed(suspects, culprit, difficulty) {
        // Similar to above but with wider constraints
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const patterns = [];
        
        for (const suspect of suspects) {
            if (suspect === culprit) continue;
            
            const feedback = {};
            for (const trait of Object.keys(TRAIT_VALUES)) {
                feedback[trait] = compareTraits(suspect[trait], culprit[trait], trait);
            }
            
            patterns.push({
                suspect,
                feedback,
                viableCount: suspects.filter(s => isViableSuspect(s, suspect, feedback)).length
            });
        }
        
        // Sort by closest to target viable count
        const targetViable = (settings.minViableSuspects + settings.maxViableSuspects) / 2;
        patterns.sort((a, b) => 
            Math.abs(a.viableCount - targetViable) - Math.abs(b.viableCount - targetViable)
        );
        
        const chosen = patterns[0];
        
        // Apply unknowns
        const traitsToHide = selectTraitsToHide(chosen.feedback, difficulty);
        const finalFeedback = { ...chosen.feedback };
        traitsToHide.forEach(trait => {
            finalFeedback[trait] = 'unknown';
        });
        
        const finalViableCount = suspects.filter(s => 
            isViableSuspect(s, chosen.suspect, finalFeedback)
        ).length;
        
        return {
            suspect: chosen.suspect,
            feedback: finalFeedback,
            hiddenTraits: traitsToHide,
            viableCount: finalViableCount,
            theoreticalMinGuesses: Math.max(3, Math.ceil(Math.log2(finalViableCount)))
        };
    }

    // Update suspect card display to handle eliminated suspects
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

    // Calculate and update viable suspect count
    function updateViableCount(gameState) {
        const viable = gameState.suspects.filter(suspect => {
            // Skip eliminated suspects
            if (gameState.eliminatedSuspects.has(suspect.id)) return false;
            
            // Check against initial feedback
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
            
            // Generate initial pattern
            const pattern = generateInitialSuspectPattern(suspects, culprit, this.difficulty);
            this.initialSuspect = pattern.suspect;
            this.initialFeedback = pattern.feedback;
            this.theoreticalMinGuesses = pattern.theoreticalMinGuesses;
            
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

    // GameManager object-literal implementation
    const GameManager = {
        // Game state
        gameState: null,
        suspects: [],
        devMode: false,
        difficulty: 'medium',
        
        // Initialize game
        init() {
            console.log('Initializing GUILTY game...');
            
            // Get difficulty
            const difficulty = this.difficulty || 'medium';
            
            // Create new game state
            this.gameState = new GuiltyGameState(difficulty);
            
            // Load suspects and start game
            this.loadSuspects();
            this.setupEventHandlers && this.setupEventHandlers();
            this.startTimer && this.startTimer();
        },
        
        // Load suspects based on current scenario
        loadSuspects() {
            // Use your existing suspect loading logic
            const scenario = this.getCurrentScenario && this.getCurrentScenario();
            this.suspects = this.generateSuspects ? this.generateSuspects(scenario) : [];
            
            // Select random culprit
            const culpritIndex = Math.floor(Math.random() * this.suspects.length);
            const culprit = this.suspects[culpritIndex];
            
            // Initialize game with suspects and culprit
            this.gameState.initialize(this.suspects, culprit);
            
            // Display suspects
            this.displaySuspects();
        },
        
        // Display all suspects
        displaySuspects() {
            const grid = document.getElementById('suspectsGrid');
            grid.innerHTML = '';
            
            this.suspects.forEach((suspect, index) => {
                const card = this.createSuspectCard(suspect);
                grid.appendChild(card);
                
                // Animate appearance
                setTimeout(() => {
                    card.style.animationDelay = `${index * 50}ms`;
                    card.classList.add('appear');
                }, 100);
            });
        },
        
        // Create suspect card element
        createSuspectCard(suspect) {
            const card = document.createElement('div');
            card.className = 'suspect-card';
            card.setAttribute('data-suspect-id', suspect.id);
            
            // Build trait display
            const traits = ['access', 'timing', 'knowledge', 'motive', 'behavior'];
            const traitLabels = {
                access: 'Museum Access',
                timing: 'Alibi Time',
                knowledge: 'Security Knowledge',
                motive: 'Motive Strength',
                behavior: 'Recent Behavior'
            };
            
            const traitsHtml = traits.map(trait => `
                <div class="trait-item">
                    <span class="trait-label">${traitLabels[trait]}:</span>
                    <span class="trait-value ${!suspect[trait] ? 'unknown-value' : ''}">${suspect[trait] || '?'}</span>
                </div>
            `).join('');
            
            card.innerHTML = `
                <div class="suspect-name">${suspect.name}</div>
                <div class="suspect-job">${suspect.job}</div>
                <div class="suspect-traits">${traitsHtml}</div>
                <div class="suspect-actions">
                    <button class="suspect-button accuse-btn" onclick="GameManager.accuseSuspect('${suspect.id}')">ACCUSE</button>
                    <button class="suspect-button exonerate-btn" onclick="GameManager.exonerateSuspect('${suspect.id}')">EXONERATE</button>
                </div>
            `;
            
            return card;
        },
        
        // Handle suspect accusation
        accuseSuspect(suspectId) {
            const suspect = this.suspects.find(s => s.id === suspectId);
            if (!suspect || this.gameState.isOver) return;
            
            // Make guess
            this.gameState.makeGuess(suspect);
        },
        
        // Handle suspect exoneration
        exonerateSuspect(suspectId) {
            const suspect = this.suspects.find(s => s.id === suspectId);
            if (!suspect || this.gameState.isOver) return;
            
            // Toggle elimination
            this.gameState.eliminateSuspect(suspect);
        },
        
        // Get culprit for dev mode
        getCulpritForTesting() {
            if (!this.devMode || !this.gameState) return null;
            return this.gameState.culprit;
        },
        
        // Share results
        shareResults() {
            if (!this.gameState) return;
            
            const result = this.getShareableResults();
            
            // Copy to clipboard
            navigator.clipboard.writeText(result).then(() => {
                alert('Results copied to clipboard!');
            }).catch(() => {
                // Fallback
                prompt('Copy your results:', result);
            });
        },
        
        getShareableResults() {
            const difficulty = this.gameState.difficulty.charAt(0).toUpperCase();
            const guessCount = this.gameState.guesses.length;
            const won = this.gameState.guesses[guessCount - 1]?.suspect === this.gameState.culprit;
            const puzzleNum = this.getPuzzleNumber && this.getPuzzleNumber();
            
            let result = `GUILTY #${puzzleNum} ${guessCount}/${this.gameState.settings.maxGuesses}`;
            if (this.gameState.wasLucky) result += ' 🍀';
            result += '\n\n';
            
            // Add guess pattern
            for (let i = 0; i < guessCount; i++) {
                if (i === guessCount - 1 && won) {
                    result += '🟩';
                } else {
                    result += '⬜';
                }
            }
            
            result += '\n\nguilty-game.com';
            
            return result;
        },
        
        // Toggle developer mode
        toggleDevMode() {
            this.devMode = !this.devMode;
            const devTools = document.getElementById('devTools');
            if (devTools) {
                devTools.style.display = this.devMode ? 'block' : 'none';
            }
        },
        
        // Run AI tests
        async runAITests(numGames = 200) {
            const results = {
                wins: 0,
                totalGuesses: 0,
                guessCounts: {},
                luckyWins: 0
            };
            
            for (let i = 0; i < numGames; i++) {
                // Simulate a game
                const testState = new GuiltyGameState(this.gameState.difficulty);
                const testSuspects = [...this.suspects];
                const testCulprit = testSuspects[Math.floor(Math.random() * testSuspects.length)];
                
                testState.initialize(testSuspects, testCulprit);
                
                // AI plays optimally
                let guesses = 0;
                let won = false;
                const maxGuesses = testState.settings.maxGuesses;
                
                while (guesses < maxGuesses && !won) {
                    // Get viable suspects
                    const viable = testSuspects.filter(s => 
                        isViableSuspect(s, testState.initialSuspect, testState.initialFeedback) &&
                        !testState.eliminatedSuspects.has(s.id)
                    );
                    
                    // Pick random from viable (simulating imperfect play)
                    if (viable.length > 0) {
                        const guess = viable[Math.floor(Math.random() * viable.length)];
                        guesses++;
                        
                        if (guess === testCulprit) {
                            won = true;
                            results.wins++;
                            results.totalGuesses += guesses;
                            results.guessCounts[guesses] = (results.guessCounts[guesses] || 0) + 1;
                            
                            if (guesses <= 2) {
                                results.luckyWins++;
                            }
                        }
                    }
                }
            }
            
            // Calculate statistics
            const winRate = (results.wins / numGames * 100).toFixed(1);
            const avgGuesses = (results.totalGuesses / results.wins).toFixed(2);
            const luckyRate = (results.luckyWins / results.wins * 100).toFixed(1);
            
            // Format output
            let output = `AI Agent Results (${numGames} games):\n`;
            output += `Win rate: ${winRate}%\n`;
            output += `Average guesses to win: ${avgGuesses}\n`;
            output += `Lucky wins: ${results.luckyWins} (${luckyRate}%)\n\n`;
            output += 'Guess distribution:\n';
            
            for (let i = 1; i <= 8; i++) {
                if (results.guessCounts[i]) {
                    const pct = (results.guessCounts[i] / results.wins * 100).toFixed(1);
                    output += `${i} guesses: ${results.guessCounts[i]} (${pct}%)\n`;
                }
            }
            
            return output;
        }
    };

    // Minimal trait reference UI update function
    function updateTraitReference() {
        // Find or create trait reference container
        let refContainer = document.querySelector('.trait-reference-container');
        if (!refContainer) {
            refContainer = document.createElement('div');
            refContainer.className = 'trait-reference-container';
            
            // Insert after initial suspect section
            const suspectSection = document.querySelector('.initial-suspect-section');
            if (suspectSection && suspectSection.parentNode) {
                suspectSection.parentNode.insertBefore(refContainer, suspectSection.nextSibling);
            }
        }
        
        // Update with minimal trait reference
        refContainer.innerHTML = `
            <div class="trait-reference-minimal">
                <h4>Trait Reference</h4>
                <p class="reference-subtitle">Yellow = one step away • Gray = two or more steps away</p>
                
                <div class="trait-grid">
                    <div class="trait-line">
                        <span class="trait-name">Access</span>
                        <div class="trait-flow">
                            <span>None</span>
                            <i>→</i>
                            <span>Visitor</span>
                            <i>→</i>
                            <span>Contractor</span>
                            <i>→</i>
                            <span>Staff</span>
                            <i>→</i>
                            <span>VIP</span>
                        </div>
                    </div>
                    <div class="trait-line">
                        <span class="trait-name">Timing</span>
                        <div class="trait-flow">
                            <span>Asleep</span>
                            <i>→</i>
                            <span>Working</span>
                            <i>→</i>
                            <span>Home</span>
                            <i>→</i>
                            <span>Out</span>
                            <i>→</i>
                            <span>Verified</span>
                        </div>
                    </div>
                    <div class="trait-line">
                        <span class="trait-name">Knowledge</span>
                        <div class="trait-flow">
                            <span>None</span>
                            <i>→</i>
                            <span>Basic</span>
                            <i>→</i>
                            <span>Limited</span>
                            <i>→</i>
                            <span>Familiar</span>
                            <i>→</i>
                            <span>Expert</span>
                        </div>
                    </div>
                    <div class="trait-line">
                        <span class="trait-name">Motive</span>
                        <div class="trait-flow">
                            <span>None</span>
                            <i>→</i>
                            <span>Curious</span>
                            <i>→</i>
                            <span>Vengeful</span>
                            <i>→</i>
                            <span>Greedy</span>
                            <i>→</i>
                            <span>Desperate</span>
                        </div>
                    </div>
                    <div class="trait-line">
                        <span class="trait-name">Behavior</span>
                        <div class="trait-flow">
                            <span>Helpful</span>
                            <i>→</i>
                            <span>Normal</span>
                            <i>→</i>
                            <span>Changed</span>
                            <i>→</i>
                            <span>Nervous</span>
                            <i>→</i>
                            <span>Suspicious</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Export to window for use in HTML
    window.GuiltyGameState = GuiltyGameState;
    window.TRAIT_VALUES = TRAIT_VALUES;
    window.updateViableCount = updateViableCount;
    window.isViableSuspect = isViableSuspect;
    window.GameManager = GameManager;
    window.updateTraitReference = updateTraitReference;
})();
