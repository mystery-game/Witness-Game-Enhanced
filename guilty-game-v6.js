// GUILTY v6 - Enhanced Security, Difficulty, and Performance
(function() {
    'use strict';
    
    // Enhanced security: Hide sensitive game data in closure
    const GAME_DATA = (function() {
        const scenarios = [
            {
                id: 'museum_heist',
                title: 'The Museum Heist',
                description: 'A priceless artifact has been stolen from the Metropolitan Museum.',
                theme: {
                    primaryColor: '#8B4513',
                    secondaryColor: '#D2691E',
                    backgroundColor: '#FFF8DC',
                    accentColor: '#CD853F'
                },
                traits: {
                    'Access Card': { weight: 0.9, description: 'Had museum access card' },
                    'Art Knowledge': { weight: 0.8, description: 'Extensive knowledge of art history' },
                    'Security Training': { weight: 0.7, description: 'Former security personnel' },
                    'Financial Troubles': { weight: 0.6, description: 'Recent financial difficulties' },
                    'Night Shift': { weight: 0.8, description: 'Worked night shift during theft' },
                    'Alibi Verified': { weight: -0.9, description: 'Solid alibi confirmed by multiple witnesses' },
                    'Clean Record': { weight: -0.5, description: 'No prior criminal history' },
                    'Loyal Employee': { weight: -0.4, description: 'Long-term loyal employee' }
                }
            },
            {
                id: 'tech_breach',
                title: 'The Data Breach',
                description: 'Confidential customer data has been leaked from TechCorp.',
                theme: {
                    primaryColor: '#0066CC',
                    secondaryColor: '#4A90E2',
                    backgroundColor: '#F0F8FF',
                    accentColor: '#1E90FF'
                },
                traits: {
                    'Admin Access': { weight: 0.9, description: 'Had administrative system access' },
                    'Coding Skills': { weight: 0.8, description: 'Advanced programming abilities' },
                    'Disgruntled': { weight: 0.7, description: 'Recently passed over for promotion' },
                    'Debt Issues': { weight: 0.6, description: 'Significant personal debt' },
                    'Late Hours': { weight: 0.7, description: 'Frequently worked late alone' },
                    'Whistleblower': { weight: -0.8, description: 'Previously reported security issues' },
                    'Team Player': { weight: -0.5, description: 'Well-liked by colleagues' },
                    'New Employee': { weight: -0.3, description: 'Recently hired, still learning systems' }
                }
            },
            {
                id: 'recipe_theft',
                title: 'The Secret Recipe',
                description: 'The secret formula for ChefMaster\'s signature sauce has been stolen.',
                theme: {
                    primaryColor: '#228B22',
                    secondaryColor: '#32CD32',
                    backgroundColor: '#F0FFF0',
                    accentColor: '#90EE90'
                },
                traits: {
                    'Recipe Access': { weight: 0.9, description: 'Had access to secret recipes' },
                    'Culinary Training': { weight: 0.8, description: 'Professional culinary background' },
                    'Competitor Contact': { weight: 0.8, description: 'Known contact with rival restaurant' },
                    'Money Problems': { weight: 0.6, description: 'Facing financial hardship' },
                    'Key Holder': { weight: 0.7, description: 'Had keys to restricted areas' },
                    'Company Loyalty': { weight: -0.8, description: 'Long history of company loyalty' },
                    'Family Business': { weight: -0.6, description: 'Family member of owner' },
                    'Satisfied Employee': { weight: -0.4, description: 'Recently received raise and promotion' }
                }
            },
            {
                id: 'restaurant_poisoning',
                title: 'The Restaurant Poisoning',
                description: 'Several customers fell ill after dining at Bella Vista restaurant.',
                theme: {
                    primaryColor: '#DC143C',
                    secondaryColor: '#FF6347',
                    backgroundColor: '#FFF5EE',
                    accentColor: '#FF4500'
                },
                traits: {
                    'Kitchen Access': { weight: 0.9, description: 'Had access to kitchen and food prep' },
                    'Chemistry Knowledge': { weight: 0.8, description: 'Background in chemistry or toxicology' },
                    'Grudge Against Owner': { weight: 0.7, description: 'Known conflict with restaurant owner' },
                    'Health Violations': { weight: 0.6, description: 'Previously cited for health code violations' },
                    'Closing Shift': { weight: 0.7, description: 'Worked during the evening in question' },
                    'Food Safety Certified': { weight: -0.7, description: 'Current food safety certification' },
                    'Victim Themselves': { weight: -0.9, description: 'Also became ill from the incident' },
                    'Reputation Conscious': { weight: -0.5, description: 'Cares deeply about restaurant reputation' }
                }
            }
        ];

        const names = [
            'Alex Chen', 'Jordan Smith', 'Taylor Brown', 'Morgan Davis', 'Casey Wilson',
            'Riley Johnson', 'Avery Garcia', 'Quinn Martinez', 'Sage Anderson', 'River Thompson',
            'Phoenix Lee', 'Skylar White', 'Rowan Clark', 'Ember Rodriguez', 'Storm Lewis',
            'Nova Walker', 'Sage Hall', 'River Allen', 'Phoenix Young', 'Skylar King'
        ];

        return { scenarios, names };
    })();

    // Enhanced difficulty balancing
    const DIFFICULTY_SETTINGS = {
        easy: {
            suspectCount: 6,
            traitDistribution: { positive: 0.4, negative: 0.3, neutral: 0.3 },
            culpritTraitStrength: 0.8,
            innocentTraitStrength: 0.6
        },
        medium: {
            suspectCount: 8,
            traitDistribution: { positive: 0.35, negative: 0.35, neutral: 0.3 },
            culpritTraitStrength: 0.7,
            innocentTraitStrength: 0.5
        },
        hard: {
            suspectCount: 10,
            traitDistribution: { positive: 0.3, negative: 0.4, neutral: 0.3 },
            culpritTraitStrength: 0.6,
            innocentTraitStrength: 0.4
        }
    };

    // Enhanced performance: Caching and batched DOM updates
    const DOMCache = {
        elements: new Map(),
        get(id) {
            if (!this.elements.has(id)) {
                this.elements.set(id, document.getElementById(id));
            }
            return this.elements.get(id);
        },
        clear() {
            this.elements.clear();
        }
    };

    class GuiltyGameV6 {
        constructor() {
            this.currentScenario = null;
            this.suspects = [];
            this.culprit = null;
            this.gameStartTime = null;
            this.difficulty = 'medium';
            this.statistics = this.loadStatistics();
            this.confidenceLevel = 100;
            this.viableSuspects = [];
            
            this.initializeGame();
        }

        initializeGame() {
            this.setupEventListeners();
            this.showMainMenu();
        }

        setupEventListeners() {
            // Batch DOM queries
            const elements = {
                startBtn: DOMCache.get('start-game'),
                difficultySelect: DOMCache.get('difficulty-select'),
                newGameBtn: DOMCache.get('new-game'),
                accuseBtn: DOMCache.get('accuse-btn'),
                hintBtn: DOMCache.get('hint-btn'),
                statsBtn: DOMCache.get('stats-btn'),
                backBtn: DOMCache.get('back-to-menu')
            };

            if (elements.startBtn) {
                elements.startBtn.addEventListener('click', () => this.startNewGame());
            }
            
            if (elements.difficultySelect) {
                elements.difficultySelect.addEventListener('change', (e) => {
                    this.difficulty = e.target.value;
                });
            }

            if (elements.newGameBtn) {
                elements.newGameBtn.addEventListener('click', () => this.startNewGame());
            }

            if (elements.accuseBtn) {
                elements.accuseBtn.addEventListener('click', () => this.showAccusationDialog());
            }

            if (elements.hintBtn) {
                elements.hintBtn.addEventListener('click', () => this.showHint());
            }

            if (elements.statsBtn) {
                elements.statsBtn.addEventListener('click', () => this.showStatistics());
            }

            if (elements.backBtn) {
                elements.backBtn.addEventListener('click', () => this.showMainMenu());
            }
        }

        startNewGame() {
            this.gameStartTime = Date.now();
            this.currentScenario = this.selectRandomScenario();
            this.applyTheme(this.currentScenario.theme);
            this.generateSuspects();
            this.confidenceLevel = 100;
            this.updateConfidenceDisplay();
            this.showGameScreen();
            this.displayScenario();
            this.displaySuspects();
            this.startTimer();
        }

        selectRandomScenario() {
            const scenarios = GAME_DATA.scenarios;
            return scenarios[Math.floor(Math.random() * scenarios.length)];
        }

        applyTheme(theme) {
            const root = document.documentElement;
            root.style.setProperty('--primary-color', theme.primaryColor);
            root.style.setProperty('--secondary-color', theme.secondaryColor);
            root.style.setProperty('--background-color', theme.backgroundColor);
            root.style.setProperty('--accent-color', theme.accentColor);
        }

        generateSuspects() {
            const settings = DIFFICULTY_SETTINGS[this.difficulty];
            const suspectCount = settings.suspectCount;
            const availableNames = [...GAME_DATA.names];
            const availableTraits = Object.keys(this.currentScenario.traits);
            
            this.suspects = [];
            this.viableSuspects = [];

            // Generate suspects with improved trait distribution
            for (let i = 0; i < suspectCount; i++) {
                const nameIndex = Math.floor(Math.random() * availableNames.length);
                const name = availableNames.splice(nameIndex, 1)[0];
                
                const suspect = {
                    id: i,
                    name: name,
                    traits: this.generateSuspectTraits(availableTraits, settings),
                    suspicionLevel: 0,
                    isRevealed: false
                };

                this.suspects.push(suspect);
            }

            // Designate culprit and adjust their traits
            this.culprit = this.suspects[Math.floor(Math.random() * this.suspects.length)];
            this.adjustCulpritTraits(settings);
            
            // Calculate initial suspicion levels
            this.calculateSuspicionLevels();
            this.updateViableSuspects();
        }

        generateSuspectTraits(availableTraits, settings) {
            const traits = {};
            const traitCount = Math.floor(Math.random() * 3) + 3; // 3-5 traits per suspect
            const selectedTraits = this.selectRandomTraits(availableTraits, traitCount);

            selectedTraits.forEach(trait => {
                const rand = Math.random();
                const dist = settings.traitDistribution;
                
                if (rand < dist.positive) {
                    traits[trait] = true;
                } else if (rand < dist.positive + dist.negative) {
                    traits[trait] = false;
                } else {
                    // Neutral - trait not present
                }
            });

            return traits;
        }

        selectRandomTraits(availableTraits, count) {
            const shuffled = [...availableTraits].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }

        adjustCulpritTraits(settings) {
            const scenarioTraits = this.currentScenario.traits;
            
            // Ensure culprit has some incriminating traits
            Object.keys(scenarioTraits).forEach(trait => {
                const traitData = scenarioTraits[trait];
                const rand = Math.random();
                
                if (traitData.weight > 0 && rand < settings.culpritTraitStrength) {
                    this.culprit.traits[trait] = true;
                } else if (traitData.weight < 0 && rand < settings.innocentTraitStrength) {
                    this.culprit.traits[trait] = false;
                }
            });
        }

        calculateSuspicionLevels() {
            this.suspects.forEach(suspect => {
                let suspicion = 0;
                const scenarioTraits = this.currentScenario.traits;
                
                Object.keys(suspect.traits).forEach(trait => {
                    if (scenarioTraits[trait]) {
                        const hasPositiveTrait = suspect.traits[trait] === true;
                        const hasNegativeTrait = suspect.traits[trait] === false;
                        const weight = scenarioTraits[trait].weight;
                        
                        if (hasPositiveTrait && weight > 0) {
                            suspicion += weight;
                        } else if (hasNegativeTrait && weight < 0) {
                            suspicion += Math.abs(weight);
                        }
                    }
                });
                
                suspect.suspicionLevel = Math.max(0, Math.min(100, suspicion * 50));
            });
        }

        updateViableSuspects() {
            this.viableSuspects = this.suspects.filter(suspect => 
                suspect.suspicionLevel > 30 && !suspect.isRevealed
            );
            this.updateConfidenceDisplay();
        }

        updateConfidenceDisplay() {
            const confidenceElement = DOMCache.get('confidence-level');
            const viableCountElement = DOMCache.get('viable-count');
            
            if (confidenceElement) {
                confidenceElement.textContent = `${Math.round(this.confidenceLevel)}%`;
                confidenceElement.className = this.getConfidenceClass();
            }
            
            if (viableCountElement) {
                viableCountElement.textContent = this.viableSuspects.length;
            }
        }

        getConfidenceClass() {
            if (this.confidenceLevel > 70) return 'confidence-high';
            if (this.confidenceLevel > 40) return 'confidence-medium';
            return 'confidence-low';
        }

        displayScenario() {
            const scenarioElement = DOMCache.get('scenario-description');
            if (scenarioElement) {
                scenarioElement.innerHTML = `
                    <h2>${this.currentScenario.title}</h2>
                    <p>${this.currentScenario.description}</p>
                `;
            }
        }

        displaySuspects() {
            const suspectsContainer = DOMCache.get('suspects-container');
            if (!suspectsContainer) return;

            // Batch DOM updates
            const fragment = document.createDocumentFragment();
            
            this.suspects.forEach(suspect => {
                const suspectCard = this.createSuspectCard(suspect);
                fragment.appendChild(suspectCard);
            });

            suspectsContainer.innerHTML = '';
            suspectsContainer.appendChild(fragment);
        }

        createSuspectCard(suspect) {
            const card = document.createElement('div');
            card.className = 'suspect-card';
            card.dataset.suspectId = suspect.id;
            
            const suspicionClass = this.getSuspicionClass(suspect.suspicionLevel);
            
            card.innerHTML = `
                <div class="suspect-header">
                    <h3>${suspect.name}</h3>
                    <div class="suspicion-meter ${suspicionClass}">
                        <div class="suspicion-fill" style="width: ${suspect.suspicionLevel}%"></div>
                        <span class="suspicion-text">${Math.round(suspect.suspicionLevel)}%</span>
                    </div>
                </div>
                <div class="suspect-traits">
                    ${this.renderSuspectTraits(suspect)}
                </div>
                <div class="suspect-actions">
                    <button onclick="game.investigateSuspect(${suspect.id})" class="investigate-btn">
                        Investigate
                    </button>
                    <button onclick="game.accuseSuspect(${suspect.id})" class="accuse-btn">
                        Accuse
                    </button>
                </div>
            `;

            return card;
        }

        renderSuspectTraits(suspect) {
            const scenarioTraits = this.currentScenario.traits;
            let traitsHtml = '';
            
            Object.keys(suspect.traits).forEach(trait => {
                if (scenarioTraits[trait]) {
                    const hasPositiveTrait = suspect.traits[trait] === true;
                    const hasNegativeTrait = suspect.traits[trait] === false;
                    const traitData = scenarioTraits[trait];
                    
                    if (hasPositiveTrait || hasNegativeTrait) {
                        const traitClass = this.getTraitClass(traitData.weight, hasPositiveTrait);
                        const traitText = hasNegativeTrait ? `No ${trait}` : trait;
                        
                        traitsHtml += `
                            <span class="trait ${traitClass}" title="${traitData.description}">
                                ${traitText}
                            </span>
                        `;
                    }
                }
            });
            
            return traitsHtml || '<span class="no-traits">No notable traits discovered</span>';
        }

        getTraitClass(weight, hasPositiveTrait) {
            if (weight > 0 && hasPositiveTrait) return 'trait-incriminating';
            if (weight < 0 && hasPositiveTrait) return 'trait-exonerating';
            if (weight > 0 && !hasPositiveTrait) return 'trait-exonerating';
            if (weight < 0 && !hasPositiveTrait) return 'trait-incriminating';
            return 'trait-neutral';
        }

        getSuspicionClass(level) {
            if (level > 70) return 'suspicion-high';
            if (level > 40) return 'suspicion-medium';
            return 'suspicion-low';
        }

        investigateSuspect(suspectId) {
            const suspect = this.suspects[suspectId];
            if (!suspect || suspect.isRevealed) return;

            // Reveal additional information
            suspect.isRevealed = true;
            this.confidenceLevel = Math.max(0, this.confidenceLevel - 10);
            
            // Recalculate suspicion levels with new information
            this.calculateSuspicionLevels();
            this.updateViableSuspects();
            
            // Update display
            this.displaySuspects();
            
            this.showInvestigationResult(suspect);
        }

        showInvestigationResult(suspect) {
            const modal = this.createModal('Investigation Result', `
                <div class="investigation-result">
                    <h3>Investigation: ${suspect.name}</h3>
                    <p>Your investigation has revealed additional information about this suspect.</p>
                    <div class="revealed-traits">
                        ${this.renderSuspectTraits(suspect)}
                    </div>
                    <p class="confidence-impact">Confidence decreased by 10%</p>
                </div>
            `);
            
            document.body.appendChild(modal);
        }

        accuseSuspect(suspectId) {
            const suspect = this.suspects[suspectId];
            if (!suspect) return;

            const isCorrect = suspect.id === this.culprit.id;
            const gameTime = Date.now() - this.gameStartTime;
            
            this.endGame(isCorrect, suspect, gameTime);
        }

        showAccusationDialog() {
            const suspectsOptions = this.suspects.map(suspect => 
                `<option value="${suspect.id}">${suspect.name}</option>`
            ).join('');
            
            const modal = this.createModal('Make Your Accusation', `
                <div class="accusation-dialog">
                    <p>Who do you believe is guilty?</p>
                    <select id="accusation-select" class="accusation-select">
                        <option value="">Select a suspect...</option>
                        ${suspectsOptions}
                    </select>
                    <div class="modal-actions">
                        <button onclick="this.closest('.modal').remove()" class="cancel-btn">Cancel</button>
                        <button onclick="game.makeAccusation()" class="confirm-btn">Accuse</button>
                    </div>
                </div>
            `);
            
            document.body.appendChild(modal);
        }

        makeAccusation() {
            const select = document.getElementById('accusation-select');
            const suspectId = parseInt(select.value);
            
            if (isNaN(suspectId)) {
                alert('Please select a suspect first.');
                return;
            }
            
            // Close modal
            select.closest('.modal').remove();
            
            this.accuseSuspect(suspectId);
        }

        showHint() {
            if (this.confidenceLevel < 20) {
                this.showModal('No Hints Available', 'Your confidence is too low to provide reliable hints.');
                return;
            }
            
            this.confidenceLevel = Math.max(0, this.confidenceLevel - 15);
            this.updateConfidenceDisplay();
            
            const hint = this.generateHint();
            this.showModal('Hint', hint);
        }

        generateHint() {
            const viableCount = this.viableSuspects.length;
            const culpritSuspicion = this.culprit.suspicionLevel;
            
            if (viableCount <= 2) {
                return "You're getting close! Focus on the suspects with the highest suspicion levels.";
            } else if (culpritSuspicion > 60) {
                return "One of your prime suspects is indeed very suspicious. Trust your instincts.";
            } else if (culpritSuspicion < 40) {
                return "Don't overlook suspects with lower suspicion levels. Sometimes the guilty party hides in plain sight.";
            } else {
                return "Look for patterns in the traits. The guilty party likely has access and motive.";
            }
        }

        endGame(isCorrect, accusedSuspect, gameTime) {
            const timeInSeconds = Math.round(gameTime / 1000);
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = timeInSeconds % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update statistics
            this.updateStatistics(isCorrect, timeInSeconds);
            
            let resultHtml = `
                <div class="game-result">
                    <h2>${isCorrect ? 'Congratulations!' : 'Case Closed'}</h2>
                    <p class="result-text ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? 
                            `You correctly identified ${accusedSuspect.name} as the culprit!` :
                            `${accusedSuspect.name} was innocent. The real culprit was ${this.culprit.name}.`
                        }
                    </p>
                    <div class="game-stats">
                        <p><strong>Time:</strong> ${timeString}</p>
                        <p><strong>Difficulty:</strong> ${this.difficulty}</p>
                        <p><strong>Final Confidence:</strong> ${Math.round(this.confidenceLevel)}%</p>
                    </div>
                    <div class="culprit-reveal">
                        <h3>The Real Culprit: ${this.culprit.name}</h3>
                        <div class="culprit-traits">
                            ${this.renderSuspectTraits(this.culprit)}
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button onclick="game.startNewGame(); this.closest('.modal').remove();" class="play-again-btn">
                            Play Again
                        </button>
                        <button onclick="game.showMainMenu(); this.closest('.modal').remove();" class="menu-btn">
                            Main Menu
                        </button>
                    </div>
                </div>
            `;
            
            const modal = this.createModal('Game Over', resultHtml);
            document.body.appendChild(modal);
        }

        updateStatistics(isCorrect, timeInSeconds) {
            this.statistics.gamesPlayed++;
            if (isCorrect) {
                this.statistics.gamesWon++;
                this.statistics.totalTime += timeInSeconds;
                
                if (!this.statistics.bestTime || timeInSeconds < this.statistics.bestTime) {
                    this.statistics.bestTime = timeInSeconds;
                }
            }
            
            this.statistics.difficultyStats[this.difficulty] = this.statistics.difficultyStats[this.difficulty] || { played: 0, won: 0 };
            this.statistics.difficultyStats[this.difficulty].played++;
            if (isCorrect) {
                this.statistics.difficultyStats[this.difficulty].won++;
            }
            
            this.saveStatistics();
        }

        showStatistics() {
            const stats = this.statistics;
            const winRate = stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1) : 0;
            const avgTime = stats.gamesWon > 0 ? Math.round(stats.totalTime / stats.gamesWon) : 0;
            const avgTimeString = avgTime > 0 ? `${Math.floor(avgTime / 60)}:${(avgTime % 60).toString().padStart(2, '0')}` : 'N/A';
            const bestTimeString = stats.bestTime ? `${Math.floor(stats.bestTime / 60)}:${(stats.bestTime % 60).toString().padStart(2, '0')}` : 'N/A';
            
            let difficultyStatsHtml = '';
            Object.keys(stats.difficultyStats).forEach(difficulty => {
                const diffStats = stats.difficultyStats[difficulty];
                const diffWinRate = diffStats.played > 0 ? ((diffStats.won / diffStats.played) * 100).toFixed(1) : 0;
                difficultyStatsHtml += `
                    <div class="difficulty-stat">
                        <strong>${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}:</strong>
                        ${diffStats.won}/${diffStats.played} (${diffWinRate}%)
                    </div>
                `;
            });
            
            const modal = this.createModal('Statistics', `
                <div class="statistics">
                    <div class="stat-group">
                        <h3>Overall Performance</h3>
                        <p><strong>Games Played:</strong> ${stats.gamesPlayed}</p>
                        <p><strong>Games Won:</strong> ${stats.gamesWon}</p>
                        <p><strong>Win Rate:</strong> ${winRate}%</p>
                    </div>
                    <div class="stat-group">
                        <h3>Time Statistics</h3>
                        <p><strong>Best Time:</strong> ${bestTimeString}</p>
                        <p><strong>Average Time:</strong> ${avgTimeString}</p>
                    </div>
                    <div class="stat-group">
                        <h3>Difficulty Breakdown</h3>
                        ${difficultyStatsHtml}
                    </div>
                    <div class="modal-actions">
                        <button onclick="this.closest('.modal').remove()" class="close-btn">Close</button>
                    </div>
                </div>
            `);
            
            document.body.appendChild(modal);
        }

        loadStatistics() {
            const defaultStats = {
                gamesPlayed: 0,
                gamesWon: 0,
                totalTime: 0,
                bestTime: null,
                difficultyStats: {}
            };
            
            try {
                const saved = localStorage.getItem('guiltyGameV6Stats');
                return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
            } catch (e) {
                return defaultStats;
            }
        }

        saveStatistics() {
            try {
                localStorage.setItem('guiltyGameV6Stats', JSON.stringify(this.statistics));
            } catch (e) {
                console.warn('Could not save statistics:', e);
            }
        }

        startTimer() {
            const timerElement = DOMCache.get('game-timer');
            if (!timerElement) return;
            
            const updateTimer = () => {
                if (!this.gameStartTime) return;
                
                const elapsed = Date.now() - this.gameStartTime;
                const seconds = Math.floor(elapsed / 1000);
                const minutes = Math.floor(seconds / 60);
                const displaySeconds = seconds % 60;
                
                timerElement.textContent = `${minutes}:${displaySeconds.toString().padStart(2, '0')}`;
            };
            
            updateTimer();
            this.timerInterval = setInterval(updateTimer, 1000);
        }

        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        }

        createModal(title, content) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            `;
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            return modal;
        }

        showModal(title, content) {
            const modal = this.createModal(title, `
                <p>${content}</p>
                <div class="modal-actions">
                    <button onclick="this.closest('.modal').remove()" class="close-btn">Close</button>
                </div>
            `);
            document.body.appendChild(modal);
        }

        showMainMenu() {
            this.stopTimer();
            DOMCache.get('main-menu').style.display = 'block';
            DOMCache.get('game-screen').style.display = 'none';
            DOMCache.get('statistics-screen').style.display = 'none';
        }

        showGameScreen() {
            DOMCache.get('main-menu').style.display = 'none';
            DOMCache.get('game-screen').style.display = 'block';
            DOMCache.get('statistics-screen').style.display = 'none';
        }
    }

    // Initialize game when DOM is loaded
    let game;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            game = new GuiltyGameV6();
            window.game = game; // Make globally accessible for onclick handlers
        });
    } else {
        game = new GuiltyGameV6();
        window.game = game;
    }
})();
