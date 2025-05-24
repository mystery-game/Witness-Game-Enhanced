// GUILTY - Wordle-style Mystery Game

// Game configuration
const CLAUDE_API_URL = 'http://localhost:3000';
const MAX_GUESSES = 4;

// Fixed crime template
const CRIME_TEMPLATE = {
    title: "The Museum Diamond Heist",
    description: "The priceless 'Star of Mumbai' diamond was stolen from the Natural History Museum last night. Security footage shows the thief knew the guard rotation perfectly. The crime occurred between 2-3 AM."
};

// Suspect traits
const TRAITS = {
    job: ['Guard', 'Janitor', 'Curator', 'Tourist', 'Manager'],
    age: ['20s', '30s', '40s', '50s', '60s'],
    hair: ['Black', 'Brown', 'Blonde', 'Gray', 'Red'],
    motive: ['Debt', 'Revenge', 'Greed', 'Thrill', 'Love'],
    alibi: ['Weak', 'None', 'Strong', 'Shaky', 'Perfect']
};

// All possible suspects
const ALL_SUSPECTS = [
    { name: "Alex Chen", job: "Guard", age: "30s", hair: "Black", motive: "Debt", alibi: "Weak" },
    { name: "Maria Santos", job: "Janitor", age: "40s", hair: "Brown", motive: "Revenge", alibi: "None" },
    { name: "James Wilson", job: "Curator", age: "50s", hair: "Gray", motive: "Greed", alibi: "Shaky" },
    { name: "Emma Thompson", job: "Tourist", age: "20s", hair: "Blonde", motive: "Thrill", alibi: "Strong" },
    { name: "Robert Davis", job: "Manager", age: "60s", hair: "Gray", motive: "Debt", alibi: "Perfect" },
    { name: "Sophie Martin", job: "Guard", age: "20s", hair: "Red", motive: "Love", alibi: "Weak" },
    { name: "David Lee", job: "Janitor", age: "30s", hair: "Black", motive: "Greed", alibi: "None" },
    { name: "Lisa Anderson", job: "Curator", age: "40s", hair: "Brown", motive: "Revenge", alibi: "Strong" },
    { name: "Michael Brown", job: "Tourist", age: "50s", hair: "Black", motive: "Thrill", alibi: "Shaky" },
    { name: "Sarah Johnson", job: "Manager", age: "30s", hair: "Blonde", motive: "Greed", alibi: "Perfect" }
];

// Game state
let gameState = {
    suspects: [],
    culprit: null,
    guesses: [],
    currentGuess: 0,
    gameOver: false,
    won: false,
    sessionId: null,
    useAPI: false
};

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);

// Get daily seed based on date
function getDailySeed() {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// Simple seeded random number generator
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Initialize the game
async function initGame() {
    // Load stats
    loadStats();
    
    // Set up daily game
    const seed = getDailySeed();
    const random = seededRandom(seed);
    
    // Select today's culprit
    const culpritIndex = Math.floor(random * ALL_SUSPECTS.length);
    gameState.culprit = ALL_SUSPECTS[culpritIndex];
    
    // Select 5 suspects (including the culprit)
    gameState.suspects = [gameState.culprit];
    const otherSuspects = ALL_SUSPECTS.filter((s, i) => i !== culpritIndex);
    
    // Add 4 more random suspects
    for (let i = 0; i < 4; i++) {
        const index = Math.floor(seededRandom(seed + i + 1) * otherSuspects.length);
        gameState.suspects.push(otherSuspects.splice(index, 1)[0]);
    }
    
    // Shuffle suspects
    gameState.suspects.sort(() => seededRandom(seed + 100) - 0.5);
    
    // Display crime
    document.getElementById('crimeDescription').textContent = CRIME_TEMPLATE.description;
    
    // Display suspects
    displaySuspects();
    
    // Try to connect to Claude API
    try {
        const response = await fetch(`${CLAUDE_API_URL}/api/guilty/new-game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                crime: CRIME_TEMPLATE,
                culprit: gameState.culprit
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            gameState.sessionId = data.sessionId;
            gameState.useAPI = true;
            document.getElementById('apiStatus').textContent = '🤖 AI Enhanced';
            document.getElementById('apiStatus').classList.add('active');
        }
    } catch (error) {
        console.log('API not available, using fallback responses');
        document.getElementById('apiStatus').textContent = '📝 Classic Mode';
    }
}

// Display suspects
function displaySuspects() {
    const grid = document.getElementById('suspectsGrid');
    grid.innerHTML = '';
    
    gameState.suspects.forEach((suspect, index) => {
        const card = document.createElement('div');
        card.className = 'suspect-card';
        card.onclick = () => makeGuess(index);
        
        // Check if already guessed
        if (gameState.guesses.some(g => g.name === suspect.name)) {
            card.classList.add('disabled');
            card.onclick = null;
        }
        
        card.innerHTML = `
            <div class="suspect-info">${suspect.name}</div>
            <div class="suspect-trait">${suspect.job}</div>
            <div class="suspect-trait">${suspect.age}</div>
            <div class="suspect-trait">${suspect.hair}</div>
            <div class="suspect-trait">${suspect.motive}</div>
            <div class="suspect-trait">${suspect.alibi}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Make a guess
async function makeGuess(suspectIndex) {
    if (gameState.gameOver || gameState.currentGuess >= MAX_GUESSES) return;
    
    const suspect = gameState.suspects[suspectIndex];
    gameState.guesses.push(suspect);
    gameState.currentGuess++;
    
    // Add guess to board
    displayGuess(suspect);
    
    // Get witness reaction
    const reaction = await getWitnessReaction(suspect);
    showWitnessReaction(reaction);
    
    // Check if won
    if (suspect.name === gameState.culprit.name) {
        endGame(true);
    } else if (gameState.currentGuess >= MAX_GUESSES) {
        endGame(false);
    }
    
    // Update suspect display
    displaySuspects();
}

// Display a guess with colored feedback
function displayGuess(suspect) {
    const board = document.getElementById('gameBoard');
    const row = document.createElement('div');
    row.className = 'guess-row';
    
    // Suspect name
    const nameBox = document.createElement('div');
    nameBox.className = 'suspect-name';
    nameBox.textContent = suspect.name;
    row.appendChild(nameBox);
    
    // Check each trait
    const traits = ['job', 'age', 'hair', 'motive', 'alibi'];
    traits.forEach(trait => {
        const box = document.createElement('div');
        box.className = 'trait-box';
        
        // Determine result
        let result = 'absent';
        if (suspect[trait] === gameState.culprit[trait]) {
            result = 'correct';
        } else if (Object.values(gameState.culprit).includes(suspect[trait])) {
            result = 'present';
        }
        
        // Add content
        box.innerHTML = `
            <div class="trait-label">${trait}</div>
            <div class="trait-value">${suspect[trait]}</div>
        `;
        
        // Animate after a delay
        setTimeout(() => {
            box.classList.add(result);
        }, 300);
        
        row.appendChild(box);
    });
    
    board.appendChild(row);
}

// Get witness reaction (API or fallback)
async function getWitnessReaction(suspect) {
    if (gameState.useAPI && gameState.sessionId) {
        try {
            const response = await fetch(`${CLAUDE_API_URL}/api/guilty/witness-reaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: gameState.sessionId,
                    guess: suspect,
                    guessNumber: gameState.currentGuess,
                    culprit: gameState.culprit
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.reaction;
            }
        } catch (error) {
            console.log('API error, using fallback');
        }
    }
    
    // Fallback reactions
    return generateFallbackReaction(suspect);
}

// Generate fallback witness reactions
function generateFallbackReaction(suspect) {
    const reactions = {
        1: {
            correct: "The witness nods vigorously. 'Yes! That's exactly right!'",
            close: "The witness shifts nervously. 'You're getting warmer... some of those details match what I saw.'",
            wrong: "The witness shakes their head. 'No, that doesn't match what I remember at all.'"
        },
        2: {
            correct: "The witness's eyes widen. 'That's them! I'm sure of it!'",
            close: "The witness furrows their brow. 'Some of that sounds familiar, but something's not quite right.'",
            wrong: "The witness looks confused. 'Are you sure? That doesn't sound like the person I saw.'"
        },
        3: {
            correct: "The witness points excitedly. 'Yes! That's definitely who I saw!'",
            close: "The witness hesitates. 'Hmm, you're close but I think you're missing something important.'",
            wrong: "The witness sighs. 'No, you're way off. Think about the evidence more carefully.'"
        },
        4: {
            correct: "The witness looks relieved. 'Finally! Yes, that's the culprit!'",
            close: "The witness looks worried. 'This is your last chance... you're close but not quite there.'",
            wrong: "The witness looks disappointed. 'No, that's not who I saw. The real culprit got away.'"
        }
    };
    
    // Count correct traits
    let correctCount = 0;
    ['job', 'age', 'hair', 'motive', 'alibi'].forEach(trait => {
        if (suspect[trait] === gameState.culprit[trait]) correctCount++;
    });
    
    const guessReactions = reactions[gameState.currentGuess];
    if (suspect.name === gameState.culprit.name) {
        return guessReactions.correct;
    } else if (correctCount >= 2) {
        return guessReactions.close;
    } else {
        return guessReactions.wrong;
    }
}

// Show witness reaction
function showWitnessReaction(reaction) {
    const reactionDiv = document.getElementById('witnessReaction');
    const reactionText = document.getElementById('witnessText');
    
    reactionText.textContent = reaction;
    reactionDiv.style.display = 'block';
    
    // Scroll to reaction
    setTimeout(() => {
        reactionDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// End the game
function endGame(won) {
    gameState.gameOver = true;
    gameState.won = won;
    
    // Update stats
    updateStats(won);
    
    // Show game over message
    const gameOverDiv = document.getElementById('gameOver');
    const titleElement = document.getElementById('gameOverTitle');
    const messageElement = document.getElementById('gameOverMessage');
    
    if (won) {
        gameOverDiv.className = 'game-over won';
        titleElement.textContent = 'GUILTY!';
        messageElement.textContent = `You found the culprit in ${gameState.currentGuess}/${MAX_GUESSES} guesses!`;
    } else {
        gameOverDiv.className = 'game-over lost';
        titleElement.textContent = 'ESCAPED!';
        messageElement.textContent = `The culprit was ${gameState.culprit.name}. Better luck tomorrow!`;
    }
    
    gameOverDiv.style.display = 'block';
    
    // Hide suspects section
    document.getElementById('suspectsSection').style.display = 'none';
}

// Share results
function shareResults() {
    let shareText = `GUILTY ${getDailySeed()}\n\n`;
    
    if (gameState.won) {
        shareText += `Got it in ${gameState.currentGuess}/${MAX_GUESSES}!\n\n`;
    } else {
        shareText += `Failed ${MAX_GUESSES}/${MAX_GUESSES}\n\n`;
    }
    
    // Add emoji grid
    gameState.guesses.forEach(guess => {
        const traits = ['job', 'age', 'hair', 'motive', 'alibi'];
        traits.forEach(trait => {
            if (guess[trait] === gameState.culprit[trait]) {
                shareText += '🟩';
            } else if (Object.values(gameState.culprit).includes(guess[trait])) {
                shareText += '🟨';
            } else {
                shareText += '⬜';
            }
        });
        shareText += '\n';
    });
    
    shareText += '\nPlay at: ' + window.location.href;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
    });
}

// Stats management
let playerStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0]
};

function loadStats() {
    const saved = localStorage.getItem('guiltyStats');
    if (saved) {
        playerStats = JSON.parse(saved);
    }
}

function saveStats() {
    localStorage.setItem('guiltyStats', JSON.stringify(playerStats));
}

function updateStats(won) {
    playerStats.gamesPlayed++;
    
    if (won) {
        playerStats.gamesWon++;
        playerStats.currentStreak++;
        playerStats.guessDistribution[gameState.currentGuess - 1]++;
        
        if (playerStats.currentStreak > playerStats.maxStreak) {
            playerStats.maxStreak = playerStats.currentStreak;
        }
    } else {
        playerStats.currentStreak = 0;
    }
    
    saveStats();
}

function showStats() {
    const modal = document.getElementById('statsModal');
    const display = document.getElementById('statsDisplay');
    
    const winRate = playerStats.gamesPlayed > 0 
        ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) 
        : 0;
    
    display.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Games Played</span>
            <span class="stat-value">${playerStats.gamesPlayed}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Win Rate</span>
            <span class="stat-value">${winRate}%</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Current Streak</span>
            <span class="stat-value">${playerStats.currentStreak}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Max Streak</span>
            <span class="stat-value">${playerStats.maxStreak}</span>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function hideStats() {
    document.getElementById('statsModal').style.display = 'none';
} 