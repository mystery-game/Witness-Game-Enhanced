// Three carefully balanced mysteries
const mysteries = {
    // EASY MYSTERY - Clear evidence, helpful witness
    easy: {
        id: 'art_heist',
        title: 'The Gallery Gambit',
        difficulty: 'easy',
        dayOfWeek: 'Friday', // Always available for testing
        scene: "The Whitmore Gallery's prize painting, 'Midnight Reverie,' has vanished. The security system was mysteriously offline from 2-3 AM. A single black glove was found near the empty frame. The night guard swears he saw nothing unusual, but he's sweating profusely.",
        
        sceneType: 'gallery',
        
        witnessType: "The Nervous Night Guard",
        witnessDescription: "Eddie Molina, jumpy and defensive about his shift",
        witnessHint: "The guard is nervous - be gentle to get information. Ask about specific people or the security system.",
        
        suspects: [
            { name: "Victoria Chen", description: "Gallery curator, recently passed over for promotion" },
            { name: "Jake Thompson", description: "Security installer, deep in gambling debt" },
            { name: "Isabella Romano", description: "Rival gallery owner, tried to buy the painting last month" },
            { name: "Marcus King", description: "Art student, obsessed with the painting's technique" },
            { name: "Dr. Sarah Webb", description: "Art historian, claims the painting is a forgery" }
        ],
        
        culprit: "Jake Thompson",
        
        // Evidence is easier to unlock in easy mode
        evidence: [
            {
                id: 'security_logs',
                name: 'Security System Log',
                icon: '📹',
                locked: true,
                unlockKeywords: ['security', 'system', 'camera', 'jake', 'offline'],
                description: 'System was disabled using Jake\'s maintenance code at 1:55 AM. He claimed he was home sleeping.',
                importance: 'critical'
            },
            {
                id: 'glove_analysis',
                name: 'Work Glove',
                icon: '🧤',
                locked: true,
                unlockKeywords: ['glove', 'black', 'found'],
                description: 'Industrial work glove, size L, matches the type Jake wears. Has paint residue from gallery maintenance.',
                importance: 'high'
            },
            {
                id: 'debt_info',
                name: 'Financial Troubles',
                icon: '💰',
                locked: true,
                unlockKeywords: ['jake', 'debt', 'money', 'why'],
                description: 'Guard overheard Jake on phone with loan shark. His debt is over $50,000.',
                importance: 'medium'
            }
        ],
        
        // Clear witness responses for easy mode
        witnessResponses: {
            security: "Oh god, the security system... *sweating* It went down at 2 AM. Jake installed it, said only he and Victoria have the codes. But... but Jake called me yesterday, asked about my shift times. Made me nervous.",
            jake: "*Fidgets nervously* Jake? He... he's been acting strange. Saw him near the loading dock last week at night. Wasn't supposed to be here. And those phone calls... always arguing about money.",
            glove: "The glove? Yeah, I saw it. Looks like the work gloves Jake wears when he's fixing things. Size large, I think. He left a pair in the security office once.",
            general: "I didn't see anything, I swear! I was doing my rounds like always. But... but I heard Jake's in trouble. Big trouble. Gambling debts. He kept asking about the painting's value."
        },
        
        solutionPoints: [
            "Jake used his maintenance code to disable security at 1:55 AM",
            "The black work glove matches his size and type",
            "He's deeply in debt to dangerous people ($50,000+)",
            "He had intimate knowledge of the security system",
            "The guard noticed Jake asking suspicious questions"
        ]
    },
    
    // MEDIUM MYSTERY - Original, well-balanced
    medium: {
        id: 'lab_accident',
        title: 'The Laboratory Accident',
        difficulty: 'medium',
        dayOfWeek: 'Monday',
        scene: "The university research lab is in chaos. Professor Elena Vasquez lies unconscious next to a shattered beaker of experimental compounds. The fume hood is still running, but someone disabled its alarm system. A handwritten note on her desk reads 'THEY KNOW' in shaky handwriting. The lab's keycard log shows seven people accessed the room between 6 PM and the discovery at 8 PM.",
        
        sceneType: 'lab',
        
        witnessType: "The Paranoid Postdoc",
        witnessDescription: "Dr. James Wright, convinced everyone's trying to steal his research",
        witnessHint: "Paranoid witnesses respond better to kindness. Ask about the fume hood, chemicals, or specific people.",
        
        suspects: [
            { name: "Dr. Kevin Liu", description: "Rival professor, competing for the same grant money" },
            { name: "Marcus Webb", description: "PhD student, Elena rejected his thesis proposal yesterday" },
            { name: "Dr. Priya Patel", description: "Department chair, pressuring Elena to share her breakthrough" },
            { name: "Sophie Zhang", description: "Lab technician, caught falsifying data last month" },
            { name: "Dr. Alan Morrison", description: "Former partner, co-author on disputed patent" },
            { name: "Rachel Torres", description: "Industrial spy posing as visiting researcher" },
            { name: "Ben Crawford", description: "Janitor, son failed Elena's chemistry class" }
        ],
        
        culprit: "Dr. Priya Patel",
        
        evidence: [
            {
                id: 'hood_alarm',
                name: 'Alarm Override Log',
                icon: '🚨',
                locked: true,
                unlockKeywords: ['alarm', 'hood', 'fume', 'override', 'disabled'],
                description: 'Digital log shows the fume hood alarm was disabled at 7:15 PM using chair-level override code. Only department chairs have this access.',
                importance: 'critical'
            },
            {
                id: 'chemical_log',
                name: 'Chemical Sign-Out',
                icon: '🧪',
                locked: true,
                unlockKeywords: ['chemical', 'compound', 'cabinet', 'priya'],
                description: 'Sign-out log shows Dr. Patel removed dangerous compounds at 7:00 PM for "routine inspection" - highly unusual timing.',
                importance: 'high'
            },
            {
                id: 'note_analysis',
                name: 'The Note',
                icon: '📝',
                locked: true,
                unlockKeywords: ['note', 'they know', 'handwriting'],
                description: 'Elena\'s note reveals she was leaving for private industry. Priya would lose control of the research.',
                importance: 'medium'
            }
        ],
        
        witnessResponses: {
            kind_specific: "You actually believe me? *relaxes slightly* The fume hood alarm... it was disabled at exactly 7:15 PM. I heard the override beep - that's chair-level access only! Dr. Patel is the only chair here...",
            kind_general: "Thank you for listening! Everyone's been after Elena's research. The department chair especially. She signed out chemicals at 7 PM - 'for inspection' she said. Who inspects at night?",
            neutral_specific: "The alarm system was compromised. 7:15 PM. Emergency override used. Draw your own conclusions about who has that access level.",
            neutral_general: "People were here. Things happened. The timeline matters - 7 to 7:45 PM. That's when everything went wrong.",
            rude: "Why should I tell you anything?! You're probably working with THEM! Leave me alone!"
        },
        
        solutionPoints: [
            "Only the department chair could disable the fume hood's emergency alarm",
            "Priya signed out dangerous chemicals at 7 PM",
            "Her keycard shows she was there during the sabotage window",
            "Elena's note revealed she was leaving, threatening Priya's control",
            "Priya had both means and motive"
        ]
    },
    
    // HARD MYSTERY - Complex with misdirection
    hard: {
        id: 'mansion_murder',
        title: 'Inheritance of Lies',
        difficulty: 'hard',
        dayOfWeek: 'Saturday',
        scene: "Billionaire Marcus Rothschild found dead in his locked study. A hidden camera was destroyed, but fragments show multiple people entering. The window is open despite the storm. Six family members were staying for the will reading. A bloody letter opener bears no fingerprints. The new will is missing.",
        
        sceneType: 'mansion',
        
        witnessType: "The Bitter Butler",
        witnessDescription: "Reginald Hayes, served the family for 30 years and despises them all",
        witnessHint: "The butler hates the whole family. Ask about their secrets and flaws - he loves revealing dirt on everyone.",
        
        suspects: [
            { name: "David Rothschild", description: "Son: Gambling addict, cut off financially last month" },
            { name: "Victoria Rothschild", description: "Daughter: Marcus discovered her embezzling from company" },
            { name: "Catherine Rothschild", description: "Wife: Having affair, Marcus filed for divorce" },
            { name: "James Rothschild", description: "Brother: Business partner, Marcus was forcing him out" },
            { name: "Tyler Rothschild", description: "Nephew: Marcus's protégé, named CEO yesterday" },
            { name: "Sarah Mitchell", description: "Lawyer: Drew up new will, knows all family secrets" }
        ],
        
        culprit: "Tyler Rothschild",
        
        evidence: [
            {
                id: 'camera_footage',
                name: 'Camera Fragments',
                icon: '📹',
                locked: true,
                unlockKeywords: ['camera', 'video', 'tyler', 'nephew', 'destroyed'],
                description: 'Partial footage shows Tyler entering at 9:45 PM. Camera destroyed at 9:47 PM - his college ring visible in final frame.',
                importance: 'critical'
            },
            {
                id: 'window_evidence',
                name: 'Window Analysis',
                icon: '🪟',
                locked: true,
                unlockKeywords: ['window', 'storm', 'escape', 'staged'],
                description: 'Window forced from INSIDE. Tyler\'s muddy footprint on sill - he staged a fake escape route.',
                importance: 'critical'
            },
            {
                id: 'will_contents',
                name: 'Will Draft',
                icon: '📜',
                locked: true,
                unlockKeywords: ['will', 'tyler', 'ceo', 'secret'],
                description: 'Lawyer\'s copy reveals Marcus was removing Tyler as CEO for selling company secrets.',
                importance: 'high'
            }
        ],
        
        // Hard mode: witness gives lots of misdirection
        witnessResponses: {
            family_general: "They're all vultures! David gambles away fortunes, Victoria steals from the company, Catherine cheats with the tennis instructor. Any of them could have done it!",
            tyler_specific: "*Pause* Tyler? The golden boy? Ha! Marcus doted on him... until last week. Found something out. Tyler was in the study right before... but so was David! And Victoria!",
            camera: "That camera system? Marcus was paranoid. Had it installed last month. Funny how it broke right when we needed it. I saw Tyler near it earlier... adjusting his college ring. Always wearing that gaudy thing.",
            window: "The window? During a storm? Ridiculous! I've worked here 30 years - nobody opens windows in storms. Found mud on the sill this morning. Inside AND outside. Make of that what you will.",
            misdirection: "You want to know who I think did it? David was desperate for money. Victoria was about to be arrested. Catherine inherits everything if there's no will. Take your pick!",
            will: "The new will? *Bitter laugh* Changed everything. Marcus was cutting people out left and right. Even his precious Tyler wasn't safe. Something about 'corporate betrayal.'",
            vague: "After 30 years, I've seen enough. This family deserves each other. Marcus got what was coming to him."
        },
        
        solutionPoints: [
            "Camera footage shows Tyler entering just before it was destroyed",
            "His distinctive college ring was used to smash the camera",
            "Window was staged from inside to fake an escape - Tyler's footprint proves it",
            "New will removed Tyler as CEO for corporate espionage",
            "Tyler destroyed the will and killed Marcus to keep his position"
        ]
    }
};

// Day mapping - now just 3 days
const dayMysteryMap = {
    'friday': 'easy',    // Easy mystery
    'monday': 'medium',  // Medium mystery  
    'saturday': 'hard',  // Hard mystery
    // Other days default to cycling through
    'sunday': 'easy',
    'tuesday': 'medium',
    'wednesday': 'hard',
    'thursday': 'easy'
};

// Improved Claude API configuration
const CLAUDE_API_URL = 'http://localhost:3000';
let useClaudeAPI = false;
let sessionId = null;

// Game state
let currentMystery = null;
let selectedSuspect = null;
let questionsAsked = 0;
let maxQuestions = 2;
let receivedClues = [];
let unlockedEvidence = [];
let playerStats = null;

// Get mystery for current day
function getTodaysMystery() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const dayName = days[today];
    const mysteryKey = dayMysteryMap[dayName];
    return mysteries[mysteryKey];
}

// Load player stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('witnessGameStats');
    if (saved) {
        playerStats = JSON.parse(saved);
    } else {
        playerStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalQuestionsUsed: 0,
            mysteriesSolved: {},
            currentStreak: 0,
            bestStreak: 0,
            lastPlayed: null,
            difficultyScores: {
                easy: { played: 0, won: 0 },
                medium: { played: 0, won: 0 },
                hard: { played: 0, won: 0 }
            }
        };
    }
}

// Save stats
function saveStats() {
    localStorage.setItem('witnessGameStats', JSON.stringify(playerStats));
}

// Update stats after game
function updateStats(won, questionsUsed, mysteryId, difficulty) {
    playerStats.gamesPlayed++;
    playerStats.totalQuestionsUsed += questionsUsed;
    playerStats.difficultyScores[difficulty].played++;
    
    if (won) {
        playerStats.gamesWon++;
        playerStats.difficultyScores[difficulty].won++;
        
        // Update streak
        const today = new Date().toDateString();
        const lastPlayed = playerStats.lastPlayed ? new Date(playerStats.lastPlayed).toDateString() : null;
        
        if (lastPlayed !== today) {
            playerStats.currentStreak++;
            if (playerStats.currentStreak > playerStats.bestStreak) {
                playerStats.bestStreak = playerStats.currentStreak;
            }
        }
    } else {
        playerStats.currentStreak = 0;
    }
    
    playerStats.lastPlayed = new Date().toISOString();
    
    // Track this specific mystery
    if (!playerStats.mysteriesSolved[mysteryId]) {
        playerStats.mysteriesSolved[mysteryId] = {
            attempts: 0,
            solved: false,
            bestQuestions: null
        };
    }
    
    playerStats.mysteriesSolved[mysteryId].attempts++;
    if (won) {
        playerStats.mysteriesSolved[mysteryId].solved = true;
        if (!playerStats.mysteriesSolved[mysteryId].bestQuestions || 
            questionsUsed < playerStats.mysteriesSolved[mysteryId].bestQuestions) {
            playerStats.mysteriesSolved[mysteryId].bestQuestions = questionsUsed;
        }
    }
    
    saveStats();
}

// Show stats modal
function showStats() {
    const modal = document.getElementById('statsModal');
    const display = document.getElementById('statsDisplay');
    
    const winRate = playerStats.gamesPlayed > 0 
        ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) 
        : 0;
    
    const avgQuestions = playerStats.gamesPlayed > 0
        ? (playerStats.totalQuestionsUsed / playerStats.gamesPlayed).toFixed(1)
        : 0;
    
    // Calculate win rates by difficulty
    const easyWinRate = playerStats.difficultyScores.easy.played > 0
        ? Math.round((playerStats.difficultyScores.easy.won / playerStats.difficultyScores.easy.played) * 100)
        : 0;
    const mediumWinRate = playerStats.difficultyScores.medium.played > 0
        ? Math.round((playerStats.difficultyScores.medium.won / playerStats.difficultyScores.medium.played) * 100)
        : 0;
    const hardWinRate = playerStats.difficultyScores.hard.played > 0
        ? Math.round((playerStats.difficultyScores.hard.won / playerStats.difficultyScores.hard.played) * 100)
        : 0;
    
    display.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Games Played</span>
            <span class="stat-value">${playerStats.gamesPlayed}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Overall Win Rate</span>
            <span class="stat-value">${winRate}%</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Easy Win Rate</span>
            <span class="stat-value">${easyWinRate}% (${playerStats.difficultyScores.easy.played} played)</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Medium Win Rate</span>
            <span class="stat-value">${mediumWinRate}% (${playerStats.difficultyScores.medium.played} played)</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Hard Win Rate</span>
            <span class="stat-value">${hardWinRate}% (${playerStats.difficultyScores.hard.played} played)</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Current Streak</span>
            <span class="stat-value">${playerStats.currentStreak} 🔥</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Best Streak</span>
            <span class="stat-value">${playerStats.bestStreak} ⭐</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Avg Questions Used</span>
            <span class="stat-value">${avgQuestions}</span>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Hide stats modal
function hideStats() {
    document.getElementById('statsModal').style.display = 'none';
}

// Evidence handling
function setupEvidence() {
    const photosGrid = document.getElementById('photosGrid');
    photosGrid.innerHTML = '';
    
    currentMystery.evidence.forEach(evidence => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'evidence-photo';
        photoDiv.onclick = () => viewEvidence(evidence.id);
        
        if (unlockedEvidence.includes(evidence.id)) {
            photoDiv.innerHTML = `
                <div class="evidence-icon">${evidence.icon}</div>
                <div class="evidence-label">${evidence.name}</div>
            `;
        } else {
            photoDiv.innerHTML = `
                <div class="evidence-locked">
                    <div class="evidence-icon">${evidence.icon}</div>
                    <div class="evidence-label">${evidence.name}</div>
                </div>
                <div class="lock-icon">🔒</div>
            `;
        }
        
        photosGrid.appendChild(photoDiv);
    });
    
    // Show evidence section if any evidence is unlocked
    if (unlockedEvidence.length > 0) {
        document.getElementById('evidencePhotos').style.display = 'block';
    }
}

// View evidence details
function viewEvidence(evidenceId) {
    if (!unlockedEvidence.includes(evidenceId)) return;
    
    const evidence = currentMystery.evidence.find(e => e.id === evidenceId);
    if (!evidence) return;
    
    document.getElementById('evidenceModalIcon').textContent = evidence.icon;
    document.getElementById('evidenceDescription').textContent = evidence.description;
    document.getElementById('evidenceModal').style.display = 'flex';
}

// Hide evidence modal
function hideEvidence() {
    document.getElementById('evidenceModal').style.display = 'none';
}

// Check if question unlocks evidence
function checkEvidenceUnlock(question) {
    const q = question.toLowerCase();
    
    currentMystery.evidence.forEach(evidence => {
        if (evidence.locked && !unlockedEvidence.includes(evidence.id)) {
            const unlocked = evidence.unlockKeywords.some(keyword => q.includes(keyword));
            if (unlocked) {
                unlockedEvidence.push(evidence.id);
                evidence.locked = false;
                
                // Show notification
                setTimeout(() => {
                    setupEvidence();
                }, 500);
            }
        }
    });
}

// Create visual scene based on mystery type
function createSceneVisual() {
    const sceneVisual = document.getElementById('sceneVisual');
    sceneVisual.innerHTML = '';
    sceneVisual.className = 'scene-visual';
    
    // Add scene-specific classes and elements based on the mystery
    switch(currentMystery.sceneType) {
        case 'lab':
            createLabScene(sceneVisual);
            break;
        case 'gallery':
            createGalleryScene(sceneVisual);
            break;
        case 'mansion':
            createMansionScene(sceneVisual);
            break;
        default:
            createLabScene(sceneVisual); // fallback
    }
}

// Scene creators (keeping only the 3 we need)
function createLabScene(container) {
    container.innerHTML = `
        <div class="lab-floor" style="position: absolute; bottom: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, #2a2a2a 0%, #1f1f1f 100%);">
            <div style="position: absolute; width: 100%; height: 100%; background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px); background-size: 30px 30px; opacity: 0.1;"></div>
        </div>
        <div style="position: absolute; top: 20px; right: 50px; width: 120px; height: 100px; background: #444; border: 3px solid #555; border-radius: 5px 5px 0 0;">
            <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #888;">FUME HOOD</div>
            <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 9px; color: #ff6b6b; animation: blink 2s infinite;">⚠️ ALARM DISABLED</div>
        </div>
        <div style="position: absolute; bottom: 40px; left: 280px; width: 80px; height: 120px; border: 2px dashed #ff6b6b; border-radius: 40px 40px 10px 10px; opacity: 0.6;">
            <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #ff6b6b; white-space: nowrap;">Prof. Vasquez</div>
        </div>
    `;
}

function createGalleryScene(container) {
    container.innerHTML = `
        <div style="position: absolute; bottom: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, #3a3030 0%, #2f2525 100%);">
            <div style="position: absolute; width: 100%; height: 100%; background-image: linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%); background-size: 20px 20px; opacity: 0.05;"></div>
        </div>
        <div style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 200px; height: 150px; border: 8px solid #DAA520; background: #1a1a1a;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; color: #666;">EMPTY FRAME</div>
        </div>
        <div style="position: absolute; bottom: 60px; right: 80px; width: 40px; height: 30px; background: #111; transform: rotate(15deg); border-radius: 5px;">
            <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #aaa;">🧤</div>
        </div>
        <div style="position: absolute; top: 40px; right: 40px; font-size: 30px; opacity: 0.3;">📹</div>
        <div style="position: absolute; top: 80px; right: 45px; font-size: 10px; color: #ff6b6b;">OFFLINE</div>
    `;
}

function createMansionScene(container) {
    container.innerHTML = `
        <div style="position: absolute; bottom: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, #3a3a4a 0%, #2a2a3a 100%);">
            <div style="position: absolute; width: 100%; height: 100%; background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px); opacity: 0.3;"></div>
        </div>
        <div style="position: absolute; top: 40px; left: 30px; width: 100px; height: 140px; background: #5a5a6a; border: 4px solid #777;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 30px;">🪟</div>
            <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #aaa;">OPEN</div>
        </div>
        <div style="position: absolute; bottom: 50px; right: 100px; font-size: 40px; transform: rotate(-20deg);">📜</div>
        <div style="position: absolute; top: 30px; right: 40px; font-size: 25px;">📹</div>
        <div style="position: absolute; top: 35px; right: 70px; font-size: 16px; color: #ff6b6b;">❌</div>
        <div style="position: absolute; bottom: 80px; left: 150px; width: 60px; height: 3px; background: #8B0000; transform: rotate(25deg);"></div>
        <div style="position: absolute; bottom: 85px; left: 145px; font-size: 12px; color: #888;">Letter Opener</div>
    `;
}

// Improved witness response generation
function generateWitnessResponse(question, questionNumber) {
    const q = question.toLowerCase();
    const responses = currentMystery.witnessResponses;
    
    // For easy mystery - more helpful
    if (currentMystery.difficulty === 'easy') {
        if (q.includes('security') || q.includes('system')) {
            return responses.security;
        } else if (q.includes('jake')) {
            return responses.jake;
        } else if (q.includes('glove')) {
            return responses.glove;
        } else {
            return responses.general;
        }
    }
    
    // For medium mystery - tone matters
    if (currentMystery.difficulty === 'medium') {
        const tone = analyzeQuestionTone(question);
        const isSpecific = q.includes('hood') || q.includes('alarm') || q.includes('chemical') || q.includes('priya');
        
        if (tone === 'kind' && isSpecific) {
            return responses.kind_specific;
        } else if (tone === 'kind') {
            return responses.kind_general;
        } else if (tone === 'rude' || tone === 'aggressive') {
            return responses.rude;
        } else if (isSpecific) {
            return responses.neutral_specific;
        } else {
            return responses.neutral_general;
        }
    }
    
    // For hard mystery - lots of misdirection
    if (currentMystery.difficulty === 'hard') {
        if (q.includes('tyler') && (q.includes('camera') || q.includes('video'))) {
            return responses.tyler_specific;
        } else if (q.includes('camera')) {
            return responses.camera;
        } else if (q.includes('window')) {
            return responses.window;
        } else if (q.includes('will')) {
            return responses.will;
        } else if (q.includes('family') || q.includes('everyone')) {
            return responses.family_general;
        } else if (questionNumber === 1) {
            return responses.misdirection;
        } else {
            return responses.vague;
        }
    }
    
    return "I don't know anything about that.";
}

// Simple tone analyzer
function analyzeQuestionTone(question) {
    const q = question.toLowerCase();
    
    const kindPhrases = ['please', 'thank you', 'help', 'could you', 'would you'];
    const rudePhrases = ['tell me', 'just', 'hurry', 'come on', 'stop'];
    
    if (kindPhrases.some(phrase => q.includes(phrase))) return 'kind';
    if (rudePhrases.some(phrase => q.includes(phrase))) return 'rude';
    return 'neutral';
}

// Initialize game
async function initGame() {
    // Load stats
    loadStats();
    
    // Get today's mystery
    currentMystery = getTodaysMystery();
    
    // Reset game state
    selectedSuspect = null;
    questionsAsked = 0;
    receivedClues = [];
    unlockedEvidence = [];
    
    // Set questions based on difficulty
    if (currentMystery.difficulty === 'easy') {
        maxQuestions = 3; // More chances for easy
    } else if (currentMystery.difficulty === 'medium') {
        maxQuestions = 2; // Standard
    } else {
        maxQuestions = 2; // Hard stays at 2
    }
    
    // Adjust based on player performance
    const difficultyStats = playerStats.difficultyScores[currentMystery.difficulty];
    if (difficultyStats.played > 3 && difficultyStats.won === 0) {
        maxQuestions++; // Give struggling players an extra question
    }
    
    // Set up UI
    const today = new Date();
    document.getElementById('dateDisplay').innerHTML = 
        `${currentMystery.title}
         <span class="difficulty-badge difficulty-${currentMystery.difficulty}">${currentMystery.difficulty.toUpperCase()}</span>`;
    
    // Create visual scene
    createSceneVisual();
    
    // Set scene description
    document.getElementById('sceneDescription').textContent = currentMystery.scene;
    
    // Set witness
    document.getElementById('witnessPersonality').innerHTML = 
        `<strong>Today's Witness:</strong> ${currentMystery.witnessType} - ${currentMystery.witnessDescription}`;
    
    // Create suspect cards
    const suspectsGrid = document.getElementById('suspectsGrid');
    suspectsGrid.innerHTML = '';
    currentMystery.suspects.forEach((suspect, index) => {
        const card = document.createElement('div');
        card.className = 'suspect-card';
        card.innerHTML = `
            <div class="suspect-name">${suspect.name}</div>
            <div class="suspect-description">${suspect.description}</div>
        `;
        card.addEventListener('click', () => selectSuspect(index));
        suspectsGrid.appendChild(card);
    });
    
    // Set up evidence
    setupEvidence();
    
    // Update question counter
    document.getElementById('questionCounter').textContent = `Questions remaining: ${maxQuestions - questionsAsked}`;
    
    // Update hint
    document.getElementById('hintText').textContent = currentMystery.witnessHint;
    
    // Try to initialize Claude API with better context
    try {
        const response = await fetch(`${CLAUDE_API_URL}/api/new-game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mystery: currentMystery,
                witness: currentMystery.witnessType,
                difficulty: currentMystery.difficulty
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            sessionId = data.sessionId;
            useClaudeAPI = true;
            
            document.getElementById('witnessPersonality').innerHTML += 
                `<div class="api-status active">🤖 Using Claude AI for dynamic responses</div>`;
        }
    } catch (error) {
        console.log('Claude API not available, using scripted responses');
        useClaudeAPI = false;
        
        document.getElementById('witnessPersonality').innerHTML += 
            `<div class="api-status inactive">📝 Using scripted responses</div>`;
    }
}

// Select suspect
function selectSuspect(index) {
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.suspect-card')[index].classList.add('selected');
    selectedSuspect = currentMystery.suspects[index];
    
    if (questionsAsked >= maxQuestions) {
        document.getElementById('accuseButton').disabled = false;
    }
}

// Ask question
document.getElementById('askButton').addEventListener('click', async () => {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim();
    if (!question) return;
    
    questionsAsked++;
    
    // Check for evidence unlock
    checkEvidenceUnlock(question);
    
    // Show loading state
    const askButton = document.getElementById('askButton');
    const originalText = askButton.textContent;
    askButton.textContent = 'Thinking...';
    askButton.disabled = true;
    
    let testimony = '';
    
    // Try Claude API first
    if (useClaudeAPI && sessionId) {
        try {
            const response = await fetch(`${CLAUDE_API_URL}/api/ask-witness`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    question,
                    questionNumber: questionsAsked,
                    maxQuestions,
                    difficulty: currentMystery.difficulty
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                testimony = data.response;
                receivedClues = data.cluesRevealed || [];
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            // Fall back to scripted response
            testimony = generateWitnessResponse(question, questionsAsked);
        }
    } else {
        // Use scripted response
        testimony = generateWitnessResponse(question, questionsAsked);
    }
    
    // Restore button
    askButton.textContent = originalText;
    
    // Show testimony
    const testimonyDiv = document.getElementById('testimony');
    testimonyDiv.innerHTML += `<div style="margin-bottom: 15px;"><strong>Q${questionsAsked}:</strong> "${question}"</div>`;
    testimonyDiv.innerHTML += `<div style="margin-bottom: 20px;"><strong>A${questionsAsked}:</strong> "${testimony}"</div>`;
    testimonyDiv.classList.remove('hidden');
    
    // Update witness state
    const witnessState = document.getElementById('witnessState');
    witnessState.textContent = questionsAsked === 1 ? 
        "*The witness shifts nervously*" : 
        "*The witness is becoming agitated*";
    witnessState.classList.remove('hidden');
    
    // Update UI
    document.getElementById('questionCounter').textContent = 
        `Questions remaining: ${maxQuestions - questionsAsked}`;
    
    if (questionsAsked >= maxQuestions) {
        // Disable further questions
        questionInput.disabled = true;
        document.getElementById('askButton').disabled = true;
        
        // Show accuse section
        document.getElementById('accuseSection').classList.remove('hidden');
        if (selectedSuspect) {
            document.getElementById('accuseButton').disabled = false;
        }
    } else {
        // Clear input for next question
        questionInput.value = '';
        questionInput.focus();
        askButton.disabled = false;
    }
});

// Make accusation
document.getElementById('accuseButton').addEventListener('click', () => {
    if (!selectedSuspect) return;
    
    const correct = selectedSuspect.name === currentMystery.culprit;
    const resultDiv = document.getElementById('result');
    
    // Update stats
    updateStats(correct, questionsAsked, currentMystery.id, currentMystery.difficulty);
    
    if (correct) {
        resultDiv.className = 'result correct';
        resultDiv.innerHTML = `
            <h2>🎉 Correct!</h2>
            <p>You've correctly identified ${currentMystery.culprit} as the culprit!</p>
            <p style="margin-top: 15px;"><strong>The solution:</strong></p>
            <ul>
                ${currentMystery.solutionPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
            <p style="margin-top: 15px;">Well done, detective! 🕵️</p>
        `;
    } else {
        resultDiv.className = 'result incorrect';
        
        // Provide helpful feedback based on what they missed
        let feedback = '';
        if (unlockedEvidence.length === 0) {
            feedback = "You didn't unlock any evidence. Try asking more specific questions next time.";
        } else if (unlockedEvidence.length < 2) {
            feedback = "You found some evidence but missed key clues. Look for connections between suspects and evidence.";
        } else {
            feedback = "You found good evidence but chose the wrong suspect. Remember to connect all the clues.";
        }
        
        resultDiv.innerHTML = `
            <h2>❌ Wrong!</h2>
            <p>You accused ${selectedSuspect.name}, but the real culprit was ${currentMystery.culprit}.</p>
            <p style="margin-top: 15px;"><strong>Evidence you found:</strong></p>
            <ul>
                ${unlockedEvidence.map(id => {
                    const evidence = currentMystery.evidence.find(e => e.id === id);
                    return `<li>${evidence.icon} ${evidence.name}</li>`;
                }).join('')}
                ${unlockedEvidence.length === 0 ? '<li>No evidence collected</li>' : ''}
            </ul>
            <p style="margin-top: 15px; font-style: italic;">${feedback}</p>
        `;
    }
    
    // Hide accuse section
    document.getElementById('accuseSection').classList.add('hidden');
    
    // Disable all interactions
    document.getElementById('accuseButton').disabled = true;
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.style.pointerEvents = 'none';
    });
});

// Reset game
function resetGame() {
    // Reset state
    selectedSuspect = null;
    questionsAsked = 0;
    receivedClues = [];
    unlockedEvidence = [];
    
    // Reset UI
    document.getElementById('questionInput').value = '';
    document.getElementById('questionInput').disabled = false;
    document.getElementById('askButton').disabled = false;
    document.getElementById('questionCounter').textContent = `Questions remaining: ${maxQuestions}`;
    
    // Clear testimony
    document.getElementById('testimony').innerHTML = '';
    document.getElementById('testimony').classList.add('hidden');
    
    // Clear witness state
    document.getElementById('witnessState').textContent = '';
    document.getElementById('witnessState').classList.add('hidden');
    
    // Reset suspect selection
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.classList.remove('selected');
        card.style.pointerEvents = 'auto';
    });
    
    // Hide evidence
    document.getElementById('evidencePhotos').style.display = 'none';
    
    // Hide accuse section
    document.getElementById('accuseSection').classList.add('hidden');
    document.getElementById('accuseButton').disabled = true;
    
    // Hide result
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').classList.add('hidden');
    document.getElementById('result').className = 'result hidden';
    
    // Reinitialize
    initGame();
}

// Make functions globally accessible
window.resetGame = resetGame;
window.showStats = showStats;
window.hideStats = hideStats;
window.viewEvidence = viewEvidence;
window.hideEvidence = hideEvidence;

// Handle Enter key in question input
document.getElementById('questionInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !document.getElementById('askButton').disabled) {
        document.getElementById('askButton').click();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame); 