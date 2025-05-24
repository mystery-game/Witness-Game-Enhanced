// TWENTY - Daily 20 Questions Game

// Game configuration
const CLAUDE_API_URL = 'http://localhost:3000';
const MAX_QUESTIONS = 20;

// Object database with categories and properties
const OBJECTS_DATABASE = [
    // Animals
    { name: "Dog", category: "Animal", properties: { alive: true, manMade: false, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: true, domesticated: true, edible: false, electronic: false, hasWheels: false }},
    { name: "Elephant", category: "Animal", properties: { alive: true, manMade: false, holdable: false, biggerThanPerson: true, foundIndoors: false, hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: false }},
    { name: "Cat", category: "Animal", properties: { alive: true, manMade: false, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: true, domesticated: true, edible: false, electronic: false, hasWheels: false }},
    { name: "Bird", category: "Animal", properties: { alive: true, manMade: false, holdable: true, biggerThanPerson: false, foundIndoors: "sometimes", hasFur: false, domesticated: "sometimes", edible: "sometimes", electronic: false, hasWheels: false }},
    
    // Technology
    { name: "Smartphone", category: "Technology", properties: { alive: false, manMade: true, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: true, hasWheels: false }},
    { name: "Television", category: "Technology", properties: { alive: false, manMade: true, holdable: false, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: true, hasWheels: false }},
    { name: "Laptop", category: "Technology", properties: { alive: false, manMade: true, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: true, hasWheels: false }},
    { name: "Refrigerator", category: "Technology", properties: { alive: false, manMade: true, holdable: false, biggerThanPerson: true, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: true, hasWheels: false }},
    
    // Food
    { name: "Apple", category: "Food", properties: { alive: false, manMade: false, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: true, electronic: false, hasWheels: false }},
    { name: "Pizza", category: "Food", properties: { alive: false, manMade: true, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: true, electronic: false, hasWheels: false }},
    { name: "Bread", category: "Food", properties: { alive: false, manMade: true, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: true, electronic: false, hasWheels: false }},
    
    // Transportation
    { name: "Car", category: "Transportation", properties: { alive: false, manMade: true, holdable: false, biggerThanPerson: true, foundIndoors: false, hasFur: false, domesticated: false, edible: false, electronic: "partially", hasWheels: true }},
    { name: "Bicycle", category: "Transportation", properties: { alive: false, manMade: true, holdable: false, biggerThanPerson: false, foundIndoors: "sometimes", hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: true }},
    { name: "Airplane", category: "Transportation", properties: { alive: false, manMade: true, holdable: false, biggerThanPerson: true, foundIndoors: false, hasFur: false, domesticated: false, edible: false, electronic: true, hasWheels: true }},
    
    // Household Items
    { name: "Chair", category: "Furniture", properties: { alive: false, manMade: true, holdable: false, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: "sometimes" }},
    { name: "Table", category: "Furniture", properties: { alive: false, manMade: true, holdable: false, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: false }},
    { name: "Book", category: "Object", properties: { alive: false, manMade: true, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: false }},
    { name: "Pencil", category: "Object", properties: { alive: false, manMade: true, holdable: true, biggerThanPerson: false, foundIndoors: true, hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: false }},
    
    // Nature
    { name: "Tree", category: "Nature", properties: { alive: true, manMade: false, holdable: false, biggerThanPerson: true, foundIndoors: false, hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: false }},
    { name: "Flower", category: "Nature", properties: { alive: true, manMade: false, holdable: true, biggerThanPerson: false, foundIndoors: "sometimes", hasFur: false, domesticated: "sometimes", edible: "sometimes", electronic: false, hasWheels: false }},
    { name: "Rock", category: "Nature", properties: { alive: false, manMade: false, holdable: "sometimes", biggerThanPerson: "sometimes", foundIndoors: "sometimes", hasFur: false, domesticated: false, edible: false, electronic: false, hasWheels: false }}
];

// Game state
let gameState = {
    currentObject: null,
    questionsAsked: [],
    questionsCount: 0,
    gameOver: false,
    won: false,
    sessionId: null,
    useAPI: false
};

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);

// Get daily seed
function getDailySeed() {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// Simple seeded random
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Initialize game
async function initGame() {
    // Load stats
    loadStats();
    
    // Get today's object
    const seed = getDailySeed();
    const objectIndex = Math.floor(seededRandom(seed) * OBJECTS_DATABASE.length);
    gameState.currentObject = OBJECTS_DATABASE[objectIndex];
    
    // Reset game state
    gameState.questionsAsked = [];
    gameState.questionsCount = 0;
    gameState.gameOver = false;
    gameState.won = false;
    
    // Update UI
    document.getElementById('categoryHint').textContent = gameState.currentObject.category;
    document.getElementById('questionsLeft').textContent = MAX_QUESTIONS;
    
    // Clear previous game
    document.getElementById('questionsList').innerHTML = '';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('guessSection').style.display = 'block';
    
    // Enable inputs
    document.getElementById('questionInput').disabled = false;
    document.getElementById('askButton').disabled = false;
    document.getElementById('guessInput').disabled = false;
    document.getElementById('guessButton').disabled = false;
    
    // Try to connect to Claude API
    try {
        const response = await fetch(`${CLAUDE_API_URL}/api/twenty/new-game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                object: gameState.currentObject.name,
                category: gameState.currentObject.category
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
        console.log('API not available, using simple responses');
        document.getElementById('apiStatus').textContent = '📝 Classic Mode';
    }
}

// Quick question helper
function quickQuestion(question) {
    document.getElementById('questionInput').value = question;
    askQuestion();
}

// Ask a question
async function askQuestion() {
    const input = document.getElementById('questionInput');
    const question = input.value.trim();
    
    if (!question || gameState.gameOver || gameState.questionsCount >= MAX_QUESTIONS) return;
    
    // Disable input during processing
    input.disabled = true;
    document.getElementById('askButton').disabled = true;
    
    // Get answer
    const answer = await getAnswer(question);
    
    // Record question
    gameState.questionsAsked.push({ question, answer });
    gameState.questionsCount++;
    
    // Display question and answer
    displayQuestionAnswer(question, answer);
    
    // Update counter
    document.getElementById('questionsLeft').textContent = MAX_QUESTIONS - gameState.questionsCount;
    
    // Check if out of questions
    if (gameState.questionsCount >= MAX_QUESTIONS) {
        endGame(false);
    } else {
        // Re-enable input
        input.value = '';
        input.disabled = false;
        document.getElementById('askButton').disabled = false;
        input.focus();
    }
}

// Get answer to question
async function getAnswer(question) {
    // Try API first
    if (gameState.useAPI && gameState.sessionId) {
        try {
            const response = await fetch(`${CLAUDE_API_URL}/api/twenty/ask-question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: gameState.sessionId,
                    question,
                    questionNumber: gameState.questionsCount + 1
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.answer;
            }
        } catch (error) {
            console.log('API error, using simple logic');
        }
    }
    
    // Fallback to simple logic
    return getSimpleAnswer(question);
}

// Simple answer logic
function getSimpleAnswer(question) {
    const q = question.toLowerCase();
    const props = gameState.currentObject.properties;
    
    // Basic property checks
    if (q.includes('alive') || q.includes('living')) {
        return { type: props.alive ? 'yes' : 'no', text: props.alive ? "Yes, it's alive!" : "No, it's not alive." };
    }
    
    if (q.includes('man-made') || q.includes('manmade') || q.includes('artificial')) {
        return { type: props.manMade ? 'yes' : 'no', text: props.manMade ? "Yes, it's man-made." : "No, it's natural." };
    }
    
    if (q.includes('hold') || q.includes('carry') || q.includes('pick up')) {
        if (props.holdable === "sometimes") {
            return { type: 'maybe', text: "Sometimes, depending on the size." };
        }
        return { type: props.holdable ? 'yes' : 'no', text: props.holdable ? "Yes, you can hold it." : "No, it's too big to hold." };
    }
    
    if (q.includes('bigger') && q.includes('person')) {
        if (props.biggerThanPerson === "sometimes") {
            return { type: 'maybe', text: "Sometimes, they come in different sizes." };
        }
        return { type: props.biggerThanPerson ? 'yes' : 'no', text: props.biggerThanPerson ? "Yes, it's bigger than a person." : "No, it's smaller than a person." };
    }
    
    if (q.includes('indoor') || q.includes('inside') || q.includes('house')) {
        if (props.foundIndoors === "sometimes") {
            return { type: 'maybe', text: "Sometimes found indoors, sometimes outdoors." };
        }
        return { type: props.foundIndoors ? 'yes' : 'no', text: props.foundIndoors ? "Yes, typically found indoors." : "No, usually found outdoors." };
    }
    
    if (q.includes('eat') || q.includes('edible') || q.includes('food')) {
        if (props.edible === "sometimes") {
            return { type: 'maybe', text: "Some types are edible, others aren't." };
        }
        return { type: props.edible ? 'yes' : 'no', text: props.edible ? "Yes, it's edible!" : "No, you can't eat it." };
    }
    
    if (q.includes('electronic') || q.includes('electric') || q.includes('powered')) {
        if (props.electronic === "partially") {
            return { type: 'maybe', text: "It has some electronic components." };
        }
        return { type: props.electronic ? 'yes' : 'no', text: props.electronic ? "Yes, it's electronic." : "No, it's not electronic." };
    }
    
    if (q.includes('wheel')) {
        if (props.hasWheels === "sometimes") {
            return { type: 'maybe', text: "Some versions have wheels, others don't." };
        }
        return { type: props.hasWheels ? 'yes' : 'no', text: props.hasWheels ? "Yes, it has wheels." : "No, it doesn't have wheels." };
    }
    
    if (q.includes('fur') || q.includes('furry') || q.includes('hair')) {
        return { type: props.hasFur ? 'yes' : 'no', text: props.hasFur ? "Yes, it has fur." : "No, it doesn't have fur." };
    }
    
    // Category checks
    if (q.includes('animal')) {
        return { type: gameState.currentObject.category === 'Animal' ? 'yes' : 'no', text: gameState.currentObject.category === 'Animal' ? "Yes, it's an animal." : "No, it's not an animal." };
    }
    
    if (q.includes('technology') || q.includes('tech') || q.includes('device')) {
        return { type: gameState.currentObject.category === 'Technology' ? 'yes' : 'no', text: gameState.currentObject.category === 'Technology' ? "Yes, it's technology." : "No, it's not technology." };
    }
    
    if (q.includes('furniture')) {
        return { type: gameState.currentObject.category === 'Furniture' ? 'yes' : 'no', text: gameState.currentObject.category === 'Furniture' ? "Yes, it's furniture." : "No, it's not furniture." };
    }
    
    if (q.includes('transport') || q.includes('vehicle')) {
        return { type: gameState.currentObject.category === 'Transportation' ? 'yes' : 'no', text: gameState.currentObject.category === 'Transportation' ? "Yes, it's transportation." : "No, it's not transportation." };
    }
    
    // Default uncertain response
    return { type: 'maybe', text: "I'm not sure about that. Try asking in a different way." };
}

// Display question and answer
function displayQuestionAnswer(question, answer) {
    const list = document.getElementById('questionsList');
    const item = document.createElement('div');
    item.className = 'question-item';
    
    const indicatorClass = answer.type === 'yes' ? 'answer-yes' : answer.type === 'no' ? 'answer-no' : 'answer-maybe';
    const indicatorSymbol = answer.type === 'yes' ? '✓' : answer.type === 'no' ? '✗' : '?';
    
    item.innerHTML = `
        <div class="question-text">Q${gameState.questionsCount}: ${question}</div>
        <div class="answer-container">
            <div class="answer-indicator ${indicatorClass}">${indicatorSymbol}</div>
            <div class="answer-text">${answer.text}</div>
        </div>
    `;
    
    list.insertBefore(item, list.firstChild);
}

// Make a guess
async function makeGuess() {
    const input = document.getElementById('guessInput');
    const guess = input.value.trim();
    
    if (!guess || gameState.gameOver) return;
    
    const correct = guess.toLowerCase() === gameState.currentObject.name.toLowerCase();
    
    if (correct) {
        endGame(true);
    } else {
        // Wrong guess feedback
        input.value = '';
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
        
        // Optionally count wrong guesses as questions
        gameState.questionsCount++;
        document.getElementById('questionsLeft').textContent = MAX_QUESTIONS - gameState.questionsCount;
        
        if (gameState.questionsCount >= MAX_QUESTIONS) {
            endGame(false);
        }
    }
}

// End the game
function endGame(won) {
    gameState.gameOver = true;
    gameState.won = won;
    
    // Update stats
    updateStats(won);
    
    // Disable inputs
    document.getElementById('questionInput').disabled = true;
    document.getElementById('askButton').disabled = true;
    document.getElementById('guessInput').disabled = true;
    document.getElementById('guessButton').disabled = true;
    
    // Show game over
    const gameOverDiv = document.getElementById('gameOver');
    const titleElement = document.getElementById('gameOverTitle');
    const messageElement = document.getElementById('gameOverMessage');
    const revealElement = document.getElementById('revealAnswer');
    
    if (won) {
        gameOverDiv.className = 'game-over won';
        titleElement.textContent = 'CORRECT!';
        messageElement.textContent = `You got it in ${gameState.questionsCount} questions!`;
        revealElement.textContent = `The answer was: ${gameState.currentObject.name}`;
    } else {
        gameOverDiv.className = 'game-over lost';
        titleElement.textContent = 'OUT OF QUESTIONS!';
        messageElement.textContent = `Better luck tomorrow!`;
        revealElement.textContent = `The answer was: ${gameState.currentObject.name}`;
    }
    
    gameOverDiv.style.display = 'block';
    
    // Hide question area
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('guessSection').style.display = 'none';
}

// Share results
function shareResults() {
    let shareText = `TWENTY ${getDailySeed()}\n\n`;
    
    if (gameState.won) {
        shareText += `Got it in ${gameState.questionsCount} questions! 🎉\n\n`;
    } else {
        shareText += `Failed after ${MAX_QUESTIONS} questions 😔\n\n`;
    }
    
    // Add visual representation
    gameState.questionsAsked.slice(-5).reverse().forEach(qa => {
        const emoji = qa.answer.type === 'yes' ? '🟢' : qa.answer.type === 'no' ? '🔴' : '🟡';
        shareText += emoji + ' ';
    });
    
    shareText += '\n\nPlay at: ' + window.location.href;
    
    navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
    });
}

// Stats management
let playerStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalQuestions: 0,
    currentStreak: 0,
    maxStreak: 0,
    averageQuestions: 0
};

function loadStats() {
    const saved = localStorage.getItem('twentyStats');
    if (saved) {
        playerStats = JSON.parse(saved);
    }
}

function saveStats() {
    localStorage.setItem('twentyStats', JSON.stringify(playerStats));
}

function updateStats(won) {
    playerStats.gamesPlayed++;
    playerStats.totalQuestions += gameState.questionsCount;
    
    if (won) {
        playerStats.gamesWon++;
        playerStats.currentStreak++;
        
        if (playerStats.currentStreak > playerStats.maxStreak) {
            playerStats.maxStreak = playerStats.currentStreak;
        }
    } else {
        playerStats.currentStreak = 0;
    }
    
    playerStats.averageQuestions = Math.round(playerStats.totalQuestions / playerStats.gamesPlayed * 10) / 10;
    
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
            <span class="stat-label">Average Questions</span>
            <span class="stat-value">${playerStats.averageQuestions}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Current Streak</span>
            <span class="stat-value">${playerStats.currentStreak}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Best Streak</span>
            <span class="stat-value">${playerStats.maxStreak}</span>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function hideStats(event) {
    if (!event || event.target.id === 'statsModal') {
        document.getElementById('statsModal').style.display = 'none';
    }
}

// Handle Enter key
document.getElementById('questionInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !document.getElementById('askButton').disabled) {
        askQuestion();
    }
});

document.getElementById('guessInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !document.getElementById('guessButton').disabled) {
        makeGuess();
    }
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style); 