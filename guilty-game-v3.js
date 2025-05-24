// Crime scenarios with AM/PM puzzles
const CRIME_SCENARIOS = [
    {
        id: 'museum_heist',
        title: 'The Gallery Gambit',
        description: 'The famous "Heart of Cairo" diamond was stolen from the Metropolitan Museum last night. Security footage shows the thief wore size 10 boots and appears to be 5\'8" to 5\'10" tall. The theft occurred between 9-11 PM.',
        suspectJobs: [
            { title: 'Security Guard', access: 'Staff', knowledge: 'Expert' },
            { title: 'Art Student', access: 'Visitor', knowledge: 'Basic' },
            { title: 'Wealthy Collector', access: 'VIP', knowledge: 'Limited' },
            { title: 'Museum Curator', access: 'Staff', knowledge: 'Familiar' },
            { title: 'Maintenance Worker', access: 'Contractor', knowledge: 'Familiar' },
            { title: 'Tour Guide', access: 'Staff', knowledge: 'Basic' },
            { title: 'Delivery Driver', access: 'Contractor', knowledge: 'Limited' },
            { title: 'Accountant', access: 'Visitor', knowledge: 'None' },
            { title: 'Board Member', access: 'VIP', knowledge: 'Basic' },
            { title: 'Local Resident', access: 'None', knowledge: 'None' }
        ],
        traits: {
            access: ['Staff', 'Visitor', 'VIP', 'Contractor', 'None'],
            timing: ['Working', 'Home', 'Out', 'Verified', 'Asleep'],
            knowledge: ['Expert', 'Familiar', 'Basic', 'Limited', 'None'],
            motive: ['Desperate', 'Greedy', 'Vengeful', 'Curious', 'None'],
            behavior: ['Suspicious', 'Nervous', 'Changed', 'Helpful', 'Normal'],
            physical: ['Matches', 'Similar', 'Partial', 'Different', 'Excluded'],
            tools: ['Has All', 'Has Some', 'Could Get', 'Limited', 'No Access'],
            alibi: ['None', 'Weak', 'Partial', 'Strong', 'Verified'],
            finances: ['Desperate', 'Struggling', 'Stable', 'Comfortable', 'Wealthy'],
            technical: ['Expert', 'Skilled', 'Basic', 'Limited', 'None']
        }
    },
    {
        id: 'tech_breach',
        title: 'TechCorp Data Breach',
        description: 'Someone hacked into TechCorp\'s servers and stole the source code for their new AI project. The breach occurred between 2-4 AM from inside the network. Digital forensics show advanced technical skills were required.',
        suspectJobs: [
            { title: 'Lead Developer', access: 'Admin', knowledge: 'Expert' },
            { title: 'Junior Developer', access: 'Developer', knowledge: 'Advanced' },
            { title: 'IT Support', access: 'Admin', knowledge: 'Expert' },
            { title: 'Project Manager', access: 'Employee', knowledge: 'Basic' },
            { title: 'Security Contractor', access: 'Contractor', knowledge: 'Expert' },
            { title: 'QA Tester', access: 'Developer', knowledge: 'Advanced' },
            { title: 'Data Analyst', access: 'Employee', knowledge: 'Basic' },
            { title: 'Marketing Director', access: 'Employee', knowledge: 'Limited' },
            { title: 'CEO Assistant', access: 'Employee', knowledge: 'None' },
            { title: 'Night Janitor', access: 'None', knowledge: 'None' }
        ],
        traits: {
            access: ['Admin', 'Developer', 'Employee', 'Contractor', 'None'],
            timing: ['Online', 'Office', 'Home', 'Logged', 'Offline'],
            knowledge: ['Expert', 'Advanced', 'Basic', 'Limited', 'None'],
            motive: ['Profit', 'Revenge', 'Espionage', 'Curiosity', 'None'],
            behavior: ['Paranoid', 'Defensive', 'Evasive', 'Cooperative', 'Normal'],
            tools: ['Has All', 'Has Some', 'Could Get', 'Limited', 'No Access'],
            history: ['Suspicious', 'Disgruntled', 'Clean', 'Loyal', 'New'],
            alibi: ['None', 'Weak', 'Partial', 'Strong', 'Verified'],
            technical: ['Elite', 'Expert', 'Skilled', 'Basic', 'Novice'],
            opportunity: ['Perfect', 'Good', 'Possible', 'Limited', 'None']
        }
    },
    {
        id: 'restaurant_poisoning',
        title: 'Five-Star Poisoning',
        description: 'Celebrity chef Marcus Delacroix was poisoned at Le Bernardin restaurant during the 7 PM dinner service. The poison (tetrodotoxin from fugu fish) was administered in his private office between 7-8 PM. Someone matching the perpetrator was seen near the office - medium build, 5\'6" to 5\'9".',
        suspectJobs: [
            { title: 'Sous Chef', access: 'Kitchen', knowledge: 'Expert' },
            { title: 'Line Cook', access: 'Kitchen', knowledge: 'Professional' },
            { title: 'Pastry Chef', access: 'Kitchen', knowledge: 'Professional' },
            { title: 'Head Waiter', access: 'Service', knowledge: 'Basic' },
            { title: 'Sommelier', access: 'Service', knowledge: 'Amateur' },
            { title: 'Restaurant Critic', access: 'VIP', knowledge: 'Amateur' },
            { title: 'Delivery Person', access: 'Limited', knowledge: 'None' },
            { title: 'Rival Chef', access: 'None', knowledge: 'Expert' },
            { title: 'Business Partner', access: 'VIP', knowledge: 'None' },
            { title: 'Apprentice Chef', access: 'Kitchen', knowledge: 'Basic' }
        ],
        traits: {
            access: ['Kitchen', 'Service', 'VIP', 'Limited', 'None'],
            timing: ['Working', 'Break', 'Dining', 'Documented', 'Absent'],
            knowledge: ['Expert', 'Professional', 'Amateur', 'Basic', 'None'],
            motive: ['Jealousy', 'Revenge', 'Inheritance', 'Competition', 'None'],
            behavior: ['Agitated', 'Guilty', 'Shocked', 'Helpful', 'Calm'],
            physical: ['Matches', 'Similar', 'Partial', 'Different', 'Excluded'],
            tools: ['Has All', 'Has Some', 'Could Get', 'Limited', 'No Access'],
            alibi: ['None', 'Weak', 'Partial', 'Strong', 'Verified'],
            relationships: ['Hostile', 'Strained', 'Neutral', 'Friendly', 'Excellent'],
            opportunity: ['Perfect', 'Good', 'Possible', 'Limited', 'None']
        }
    },
    {
        id: 'recipe_theft',
        title: 'The Secret Recipe Heist',
        description: 'The legendary secret recipe for "Grandma Chen\'s Moonlight Cookies" was stolen from the company vault. The theft occurred between 7-9 PM. The thief left flour footprints and appears to be 5\'5" to 5\'8" tall based on the vault camera angle.',
        suspectJobs: [
            { title: 'Head Baker', access: 'Kitchen', knowledge: 'Expert' },
            { title: 'Recipe Developer', access: 'Kitchen', knowledge: 'Professional' },
            { title: 'Quality Manager', access: 'Office', knowledge: 'Professional' },
            { title: 'Marketing Director', access: 'Office', knowledge: 'Amateur' },
            { title: 'Delivery Driver', access: 'Delivery', knowledge: 'None' },
            { title: 'Competitor Spy', access: 'None', knowledge: 'Professional' },
            { title: 'Night Cleaner', access: 'Limited', knowledge: 'None' },
            { title: 'Intern', access: 'Limited', knowledge: 'Basic' },
            { title: 'Security Guard', access: 'Office', knowledge: 'None' },
            { title: 'Franchise Owner', access: 'Limited', knowledge: 'Amateur' }
        ],
        traits: {
            access: ['Kitchen', 'Office', 'Delivery', 'Limited', 'None'],
            timing: ['Working', 'Break', 'Meeting', 'Documented', 'Absent'],
            knowledge: ['Expert', 'Professional', 'Amateur', 'Basic', 'None'],
            motive: ['Competition', 'Money', 'Recognition', 'Curiosity', 'None'],
            behavior: ['Agitated', 'Guilty', 'Shocked', 'Helpful', 'Calm'],
            physical: ['Matches', 'Similar', 'Different', 'Partial', 'Excluded'],
            tools: ['Has All', 'Has Some', 'Could Get', 'Limited', 'No Access'],
            alibi: ['None', 'Weak', 'Partial', 'Strong', 'Verified'],
            relationships: ['Hostile', 'Strained', 'Neutral', 'Friendly', 'Excellent'],
            opportunity: ['Perfect', 'Good', 'Possible', 'Limited', 'None']
        }
    }
];

// Get trait categories with hints but no suspicion scores
function getTraitCategories(crime) {
    const baseCategories = {
        museum_heist: {
            access: {
                name: 'Museum Access',
                hints: {
                    'Staff': 'Has keys and knows security',
                    'Visitor': 'Limited access',
                    'VIP': 'Special access privileges',
                    'Contractor': 'Temporary access',
                    'None': 'No legitimate access'
                }
            },
            timing: {
                name: 'Alibi Time',
                hints: {
                    'Working': 'Was at museum during crime',
                    'Home': 'Claims to be home',
                    'Out': 'Was out somewhere',
                    'Verified': 'Has witness confirmation',
                    'Asleep': 'Claims to be sleeping'
                }
            },
            knowledge: {
                name: 'Security Knowledge',
                hints: {
                    'Expert': 'Knows all security systems',
                    'Familiar': 'Some security knowledge',
                    'Basic': 'General awareness only',
                    'Limited': 'Minimal knowledge',
                    'None': 'No security knowledge'
                }
            },
            motive: {
                name: 'Motive Strength',
                hints: {
                    'Desperate': 'Urgent need for money',
                    'Greedy': 'Wants more wealth',
                    'Vengeful': 'Has grudge against museum',
                    'Curious': 'Fascinated by diamond',
                    'None': 'No clear motive'
                }
            },
            behavior: {
                name: 'Recent Behavior',
                hints: {
                    'Suspicious': 'Acting very strangely',
                    'Nervous': 'Seems anxious lately',
                    'Changed': 'Different than usual',
                    'Helpful': 'Cooperating fully',
                    'Normal': 'Nothing unusual'
                }
            },
            physical: {
                name: 'Physical Evidence',
                hints: {
                    'Matches': 'Size 10 boot, 5\'8"-5\'10"',
                    'Similar': 'Close to description',
                    'Partial': 'Some matches',
                    'Different': 'Doesn\'t match evidence',
                    'Excluded': 'Definitely not them'
                }
            },
            tools: {
                name: 'Tool Access',
                hints: {
                    'Has All': 'Has lockpicks and equipment',
                    'Has Some': 'Has some needed tools',
                    'Could Get': 'Could obtain tools',
                    'Limited': 'Minimal tool access',
                    'No Access': 'No access to tools'
                }
            },
            alibi: {
                name: 'Alibi Strength',
                hints: {
                    'None': 'No alibi at all',
                    'Weak': 'Unconvincing story',
                    'Partial': 'Some gaps in alibi',
                    'Strong': 'Good alibi',
                    'Verified': 'Confirmed by witnesses'
                }
            },
            finances: {
                name: 'Financial Status',
                hints: {
                    'Desperate': 'Facing bankruptcy',
                    'Struggling': 'Mounting debts',
                    'Stable': 'Financially secure',
                    'Comfortable': 'Well off',
                    'Wealthy': 'No financial motive'
                }
            },
            technical: {
                name: 'Technical Skills',
                hints: {
                    'Expert': 'Can disable alarms',
                    'Skilled': 'Good with electronics',
                    'Basic': 'Some technical ability',
                    'Limited': 'Minimal skills',
                    'None': 'No technical skills'
                }
            }
        },
        tech_breach: {
            access: {
                name: 'System Access',
                hints: {
                    'Admin': 'Full system privileges',
                    'Developer': 'Code repository access',
                    'Employee': 'Basic network access',
                    'Contractor': 'Temporary credentials',
                    'None': 'Access level unclear'
                }
            },
            timing: {
                name: 'Activity Log',
                hints: {
                    'Online': 'Active during breach',
                    'Office': 'In building after hours',
                    'Home': 'Claims remote location',
                    'Logged': 'Verified elsewhere online',
                    'Offline': 'No digital activity'
                }
            },
            knowledge: {
                name: 'Technical Skills',
                hints: {
                    'Expert': 'Could bypass all security',
                    'Advanced': 'Knows system architecture',
                    'Basic': 'General IT knowledge',
                    'Limited': 'Minimal tech skills',
                    'None': 'No programming skills'
                }
            },
            motive: {
                name: 'Potential Motive',
                hints: {
                    'Profit': 'Needs money urgently',
                    'Revenge': 'Angry at company',
                    'Espionage': 'Suspected foreign ties',
                    'Curiosity': 'Intellectual interest',
                    'None': 'No apparent motive'
                }
            },
            behavior: {
                name: 'Post-Breach Behavior',
                hints: {
                    'Paranoid': 'Extremely nervous',
                    'Defensive': 'Quick to blame others',
                    'Evasive': 'Avoiding questions',
                    'Cooperative': 'Helping investigation',
                    'Normal': 'Business as usual'
                }
            },
            tools: {
                name: 'Hacking Tools',
                hints: {
                    'Has All': 'Custom pen-test tools',
                    'Has Some': 'Basic hacking software',
                    'Could Get': 'Access to tools',
                    'Limited': 'Minimal tools',
                    'No Access': 'No hacking tools'
                }
            },
            history: {
                name: 'Employment History',
                hints: {
                    'Suspicious': 'Multiple terminations',
                    'Disgruntled': 'Recent conflicts',
                    'Clean': 'Good track record',
                    'Loyal': 'Long-term employee',
                    'New': 'Recently hired'
                }
            },
            alibi: {
                name: 'Digital Alibi',
                hints: {
                    'None': 'No digital trail',
                    'Weak': 'Could be spoofed',
                    'Partial': 'Some gaps',
                    'Strong': 'Multiple logins elsewhere',
                    'Verified': 'Confirmed activity'
                }
            },
            technical: {
                name: 'Coding Ability',
                hints: {
                    'Elite': 'Can code in sleep',
                    'Expert': 'Senior level skills',
                    'Skilled': 'Competent developer',
                    'Basic': 'Script kiddie level',
                    'Novice': 'Learning to code'
                }
            },
            opportunity: {
                name: 'Breach Window',
                hints: {
                    'Perfect': 'Alone in office',
                    'Good': 'Had time and access',
                    'Possible': 'Could have done it',
                    'Limited': 'Small window',
                    'None': 'Proven elsewhere'
                }
            }
        },
        restaurant_poisoning: {
            access: {
                name: 'Kitchen Access',
                hints: {
                    'Kitchen': 'Full kitchen privileges',
                    'Service': 'Limited kitchen entry',
                    'VIP': 'Guest with special access',
                    'Limited': 'Occasional access only',
                    'None': 'No legitimate access'
                }
            },
            timing: {
                name: 'Location at 7-8 PM',
                hints: {
                    'Working': 'On shift in kitchen',
                    'Break': 'On break but present',
                    'Dining': 'Eating in restaurant',
                    'Documented': 'Confirmed elsewhere',
                    'Absent': 'Not in restaurant'
                }
            },
            knowledge: {
                name: 'Culinary Expertise',
                hints: {
                    'Expert': 'Knows rare poisons',
                    'Professional': 'Trained chef',
                    'Amateur': 'Cooking enthusiast',
                    'Basic': 'Basic cooking skills',
                    'None': 'No cooking skills'
                }
            },
            motive: {
                name: 'Relationship to Victim',
                hints: {
                    'Jealousy': 'Envious of success',
                    'Revenge': 'Past grievance',
                    'Inheritance': 'Financial beneficiary',
                    'Competition': 'Business rivalry',
                    'None': 'No known conflict'
                }
            },
            behavior: {
                name: 'Reaction to Incident',
                hints: {
                    'Agitated': 'Overly emotional',
                    'Guilty': 'Shows signs of guilt',
                    'Shocked': 'Genuinely surprised',
                    'Helpful': 'Actively assisting',
                    'Calm': 'Unusually composed'
                }
            },
            physical: {
                name: 'Physical Evidence',
                hints: {
                    'Matches': 'Seen near office',
                    'Similar': 'Right build',
                    'Partial': 'Some similarities',
                    'Different': 'Wrong description',
                    'Excluded': 'Too tall/short'
                }
            },
            tools: {
                name: 'Poison Access',
                hints: {
                    'Has All': 'Access to fugu',
                    'Has Some': 'Kitchen chemicals',
                    'Could Get': 'Knows suppliers',
                    'Limited': 'Minimal access',
                    'No Access': 'No poison access'
                }
            },
            alibi: {
                name: 'Alibi Quality',
                hints: {
                    'None': 'Can\'t explain whereabouts',
                    'Weak': 'Story doesn\'t add up',
                    'Partial': 'Some gaps',
                    'Strong': 'Multiple witnesses',
                    'Verified': 'Camera footage confirms'
                }
            },
            relationships: {
                name: 'Victim Relations',
                hints: {
                    'Hostile': 'Public confrontations',
                    'Strained': 'Recent arguments',
                    'Neutral': 'Professional only',
                    'Friendly': 'Good colleagues',
                    'Excellent': 'Close friends'
                }
            },
            opportunity: {
                name: 'Office Access Window',
                hints: {
                    'Perfect': 'Alone near office',
                    'Good': 'Had opportunity',
                    'Possible': 'Could have done it',
                    'Limited': 'Brief window only',
                    'None': 'Never near office'
                }
            }
        },
        recipe_theft: {
            access: {
                name: 'Building Access',
                hints: {
                    'Kitchen': 'Full kitchen and vault access',
                    'Office': 'Office and vault access',
                    'Delivery': 'Limited building access',
                    'Limited': 'Occasional access only',
                    'None': 'No legitimate access'
                }
            },
            timing: {
                name: 'Location at 7-8 PM',
                hints: {
                    'Working': 'On shift during theft',
                    'Break': 'On break but present',
                    'Meeting': 'In meeting nearby',
                    'Documented': 'Confirmed elsewhere',
                    'Absent': 'Not in building'
                }
            },
            knowledge: {
                name: 'Baking Expertise',
                hints: {
                    'Expert': 'Master baker level',
                    'Professional': 'Trained baker',
                    'Amateur': 'Hobby baker',
                    'Basic': 'Basic baking skills',
                    'None': 'No baking skills'
                }
            },
            motive: {
                name: 'Potential Motive',
                hints: {
                    'Competition': 'Rival bakery owner',
                    'Money': 'Financial gain',
                    'Recognition': 'Wants fame',
                    'Curiosity': 'Just curious',
                    'None': 'No clear motive'
                }
            },
            behavior: {
                name: 'Reaction to Theft',
                hints: {
                    'Agitated': 'Overly emotional',
                    'Guilty': 'Shows signs of guilt',
                    'Shocked': 'Genuinely surprised',
                    'Helpful': 'Actively helping',
                    'Calm': 'Unusually composed'
                }
            },
            physical: {
                name: 'Physical Evidence',
                hints: {
                    'Matches': 'Flour on clothes, right height',
                    'Similar': 'Some matches',
                    'Different': 'Doesn\'t match',
                    'Partial': 'Some similarities',
                    'Excluded': 'Definitely not them'
                }
            },
            tools: {
                name: 'Vault Access',
                hints: {
                    'Has All': 'Has vault key/code',
                    'Has Some': 'Partial access',
                    'Could Get': 'Could obtain access',
                    'Limited': 'Minimal access',
                    'No Access': 'No vault access'
                }
            },
            alibi: {
                name: 'Alibi Quality',
                hints: {
                    'None': 'Can\'t explain whereabouts',
                    'Weak': 'Story doesn\'t add up',
                    'Partial': 'Some gaps',
                    'Strong': 'Multiple witnesses',
                    'Verified': 'Camera footage confirms'
                }
            },
            relationships: {
                name: 'Company Relations',
                hints: {
                    'Hostile': 'Known conflicts',
                    'Strained': 'Recent tensions',
                    'Neutral': 'Professional only',
                    'Friendly': 'Good colleague',
                    'Excellent': 'Trusted employee'
                }
            },
            opportunity: {
                name: 'Vault Access Window',
                hints: {
                    'Perfect': 'Alone near vault',
                    'Good': 'Had opportunity',
                    'Possible': 'Could have done it',
                    'Limited': 'Brief window only',
                    'None': 'Never near vault'
                }
            }
        }
    };
    
    return baseCategories[crime.id] || baseCategories.museum_heist;
}

// Current crime for the game
let currentCrime = null;

// Generate suspects with logical consistency but no suspicion scores
function generateSuspects(seed, crime) {
    const names = [
        "Anne Chen", "Ted Santos", "Henry Wilson", "Abby Thompson", "Joney Davis",
        "Sarah Martin", "Roy Lee", "Hannah Anderson", "Lex Brown", "Aaron Johnson",
        "Neve Williams", "Cal Miller", "Faye Garcia", "David Rodriguez", "Elle Martinez",
        "Jonathan Smith", "Emily Taylor", "Charles Jones", "Ben Thomas", "Will Jackson",
        "Sam White", "Juliette Harris"
    ];
    
    // Shuffle names based on seed
    const shuffledNames = [...names].sort(() => seededRandom(seed * 7) - 0.5);
    const selectedNames = shuffledNames.slice(0, 10);
    
    const jobs = crime.suspectJobs;
    const suspects = [];
    const usedCombos = new Set();
    
    // Create diverse suspects
    for (let i = 0; i < 10; i++) {
        const job = jobs[i];
        let suspect;
        let combo;
        
        do {
            const access = job.access;
            const knowledge = job.knowledge;
            
            // Timing based on access
            let timing;
            const timingOptions = crime.traits.timing;
            if ((crime.id === 'museum_heist' && access === 'Staff') || 
                (crime.id === 'tech_breach' && access === 'Admin') ||
                (crime.id === 'restaurant_poisoning' && access === 'Kitchen')) {
                timing = seededRandom(seed + i * 11) > 0.7 ? timingOptions[0] : timingOptions[Math.floor(seededRandom(seed + i * 11.5) * timingOptions.length)];
            } else {
                timing = timingOptions[Math.floor(seededRandom(seed + i * 11) * timingOptions.length)];
            }
            
            // Random motive
            const motives = crime.traits.motive;
            const motive = motives[Math.floor(seededRandom(seed + i * 12) * motives.length)];
            
            // Random behavior
            const behaviors = crime.traits.behavior;
            const behavior = behaviors[Math.floor(seededRandom(seed + i * 13) * behaviors.length)];
            
            // Add remaining traits
            const traitKeys = Object.keys(crime.traits).filter(key => 
                !['access', 'timing', 'knowledge', 'motive', 'behavior'].includes(key)
            );
            
            combo = `${access}-${timing}-${knowledge}-${motive}-${behavior}`;
            
            const allTraits = { access, timing, knowledge, motive, behavior };
            
            // Assign remaining traits - 30% chance to omit (missing information)
            traitKeys.forEach(key => {
                const traitValues = crime.traits[key];
                if (seededRandom(seed + i * 20 + key.charCodeAt(0)) > 0.70) {
                    // Don't add this trait - information not available
                } else {
                    allTraits[key] = traitValues[Math.floor(seededRandom(seed + i * 21 + key.charCodeAt(0)) * traitValues.length)];
                }
            });
            
            suspect = {
                name: selectedNames[i],
                job: job.title,
                ...allTraits
            };
        } while (usedCombos.has(combo));
        
        usedCombos.add(combo);
        suspects.push(suspect);
    }
    
    return suspects;
}

// Improved feedback system without suspicion levels
function getFeedbackForTrait(guessValue, culpritValue, traitCategory) {
    if (guessValue === undefined) {
        return 'unknown';
    }
    
    if (culpritValue === undefined) {
        return 'wrong';
    }
    
    if (guessValue === culpritValue) {
        return 'correct';
    }
    
    // Get the trait array to check position-based adjacency
    const traitArray = currentCrime.traits[traitCategory];
    if (!traitArray) {
        return 'wrong';
    }
    
    // Find positions in the array
    const guessPosition = traitArray.indexOf(guessValue);
    const culpritPosition = traitArray.indexOf(culpritValue);
    
    // Check if positions are adjacent (within 1 position)
    if (Math.abs(guessPosition - culpritPosition) <= 1) {
        return 'close'; // Adjacent in the trait array
    }
    
    return 'wrong';
}

// Timer functions
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    if (gameState.gameOver) return;
    
    const elapsed = Date.now() - gameState.startTime;
    gameState.elapsedTime = elapsed;
    
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    
    document.getElementById('timerDisplay').textContent = 
        `Time: ${minutes}:${displaySeconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Game state
let gameState = {
    difficulty: 'medium',
    suspects: [],
    culprit: null,
    initialSuspect: null,
    guesses: [],
    currentGuess: 0,
    gameOver: false,
    won: false,
    sessionId: null,
    devMode: false,
    currentScenarioIndex: 0,
    isProcessingGuess: false,
    startTime: null,
    timerInterval: null,
    elapsedTime: 0,
    eliminatedSuspects: new Set(),
    betaMode: false
};

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    setupDifficultyToggle();
    setupDevMode();
    initGame();
});

// Simple seeded random
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Get daily seed (supports AM/PM puzzles)
function getDailySeed() {
    const now = new Date();
    
    // Convert to EST
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    let estTime = new Date(utcTime + (3600000 * -5)); // EST is UTC-5
    
    // Check if we're in beta mode (preview 5 hours ahead)
    if (gameState.betaMode) {
        estTime = new Date(estTime.getTime() + (5 * 3600000)); // Add 5 hours
    }
    
    // Check if we're in AM (midnight to noon) or PM (noon to midnight)
    const isPM = estTime.getHours() >= 12;
    const dateString = estTime.toISOString().split('T')[0].replace(/-/g, '');
    
    // Create different seeds for AM and PM
    const periodMultiplier = isPM ? 2 : 1;
    const seed = parseInt(dateString) * periodMultiplier;
    
    return seed;
}

// Get current puzzle period for display
function getPuzzlePeriod() {
    const estTime = getESTTime();
    
    // In beta mode, show the period we're testing
    if (gameState.betaMode) {
        const betaTime = new Date(estTime.getTime() + (5 * 3600000));
        return betaTime.getHours() >= 12 ? 'PM' : 'AM';
    }
    
    return estTime.getHours() >= 12 ? 'PM' : 'AM';
}

// Setup difficulty toggle
function setupDifficultyToggle() {
    const header = document.querySelector('.header');
    const difficultyDiv = document.createElement('div');
    difficultyDiv.className = 'difficulty-selector';
    difficultyDiv.innerHTML = `
        <label>Difficulty:</label>
        <select id="difficultySelect" onchange="changeDifficulty(this.value)">
            <option value="easy">Easy (8 guesses)</option>
            <option value="medium" selected>Medium (6 guesses)</option>
            <option value="hard">Hard (4 guesses)</option>
        </select>
    `;
    header.appendChild(difficultyDiv);
}

// Change difficulty
window.changeDifficulty = function(newDifficulty) {
    if (gameState.currentGuess > 0) {
        if (!confirm('Changing difficulty will reset your current game. Continue?')) {
            document.getElementById('difficultySelect').value = gameState.difficulty;
            return;
        }
    }
    
    gameState.difficulty = newDifficulty;
    resetGame();
}

// Setup developer mode
function setupDevMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const isDevMode = urlParams.get('dev') === 'true' || localStorage.getItem('guiltyDevMode') === 'true';
    
    if (isDevMode) {
        gameState.devMode = true;
        localStorage.setItem('guiltyDevMode', 'true');
        
        // Add dev controls
        const devControls = document.createElement('div');
        devControls.className = 'dev-controls';
        devControls.innerHTML = `
            <div class="dev-header">🛠️ Developer Mode</div>
            <div class="dev-buttons">
                <button onclick="cycleScenario(-1)">← Previous Scenario</button>
                <button onclick="cycleScenario(1)">Next Scenario →</button>
                <button onclick="randomScenario()">Random Scenario</button>
                <button onclick="showAllSuspects()">Show All Info</button>
                <button onclick="toggleBetaMode()" id="betaModeBtn">🔮 Beta Mode: OFF</button>
                <button onclick="toggleDevMode()">Exit Dev Mode</button>
            </div>
            <div class="dev-info">
                <div>Current: <span id="currentScenarioName">${CRIME_SCENARIOS[0].title}</span></div>
                <div>Culprit: <span id="devCulpritInfo">-</span></div>
                <div id="betaInfo" style="display: none; color: #FFC107; margin-top: 8px;">
                    ⚠️ Beta Mode: Testing puzzle for <span id="betaTime"></span>
                </div>
            </div>
            <div class="dev-feedback">
                <textarea id="devNotes" placeholder="Enter feedback/notes about this scenario..." rows="3"></textarea>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <button onclick="saveDevNotes()" style="flex: 1;">Save Notes</button>
                    <button onclick="generateBetaReport()" id="betaReportBtn" style="flex: 1; display: none; background: #FF9800;">Generate Beta Report</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .dev-controls {
                position: fixed;
                top: 20px;
                left: 20px;
                background: #1a1a1a;
                border: 2px solid #ff6b6b;
                border-radius: 10px;
                padding: 15px;
                max-width: 300px;
                z-index: 1000;
            }
            
            .dev-header {
                font-size: 14px;
                font-weight: 600;
                color: #ff6b6b;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .dev-buttons {
                display: flex;
                flex-direction: column;
                gap: 5px;
                margin-bottom: 10px;
            }
            
            .dev-buttons button {
                background: #2a2a2a;
                border: 1px solid #444;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .dev-buttons button:hover {
                background: #333;
                border-color: #666;
            }
            
            #betaModeBtn {
                background: #2a2a2a;
                border-color: #666;
            }
            
            #betaModeBtn.active {
                background: #FFC107;
                color: #000;
                border-color: #FFC107;
            }
            
            .dev-info {
                font-size: 12px;
                color: #888;
                margin-bottom: 10px;
                line-height: 1.5;
            }
            
            .dev-info span {
                color: #ff6b6b;
                font-weight: 600;
            }
            
            .dev-feedback {
                margin-top: 10px;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .dev-feedback textarea {
                background: #0a0a0a;
                border: 1px solid #333;
                color: white;
                padding: 8px;
                border-radius: 5px;
                font-size: 12px;
                resize: vertical;
            }
            
            .dev-feedback button {
                background: #4CAF50;
                border: none;
                color: white;
                padding: 5px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .dev-feedback button:hover {
                background: #45a049;
            }
            
            @media (max-width: 768px) {
                .dev-controls {
                    position: static;
                    margin: 20px auto;
                    max-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(devControls);
    }
}

// Toggle beta mode
window.toggleBetaMode = function() {
    gameState.betaMode = !gameState.betaMode;
    
    const betaBtn = document.getElementById('betaModeBtn');
    const betaInfo = document.getElementById('betaInfo');
    const betaTime = document.getElementById('betaTime');
    const betaReportBtn = document.getElementById('betaReportBtn');
    
    if (gameState.betaMode) {
        betaBtn.textContent = '🔮 Beta Mode: ON';
        betaBtn.classList.add('active');
        betaInfo.style.display = 'block';
        if (betaReportBtn) betaReportBtn.style.display = 'block';
        
        // Calculate and display what time we're testing
        const estTime = getESTTime();
        const betaTestTime = new Date(estTime.getTime() + (5 * 3600000));
        const betaPeriod = betaTestTime.getHours() >= 12 ? 'PM' : 'AM';
        const betaDateStr = betaTestTime.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        betaTime.textContent = `${betaDateStr} EST (${betaPeriod} puzzle)`;
        
        // Show warning in main game area
        showBetaWarning();
    } else {
        betaBtn.textContent = '🔮 Beta Mode: OFF';
        betaBtn.classList.remove('active');
        betaInfo.style.display = 'none';
        if (betaReportBtn) betaReportBtn.style.display = 'none';
        
        // Remove beta warning
        removeBetaWarning();
    }
    
    // Reset game with new mode
    resetGame();
}

// Show beta warning
function showBetaWarning() {
    const existingWarning = document.getElementById('betaWarning');
    if (existingWarning) return;
    
    const warning = document.createElement('div');
    warning.id = 'betaWarning';
    warning.style.cssText = `
        background: #FFC107;
        color: #000;
        padding: 12px 20px;
        text-align: center;
        font-weight: 600;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    const estTime = getESTTime();
    const betaTestTime = new Date(estTime.getTime() + (5 * 3600000));
    const betaHour = betaTestTime.getHours();
    const nextRelease = betaHour >= 12 ? '12:00 AM' : '12:00 PM';
    
    warning.innerHTML = `⚠️ BETA TEST MODE - Testing puzzle that will be released at ${nextRelease} EST`;
    document.body.appendChild(warning);
}

// Remove beta warning
function removeBetaWarning() {
    const warning = document.getElementById('betaWarning');
    if (warning) {
        warning.remove();
    }
}

// Developer mode functions
window.cycleScenario = function(direction) {
    gameState.currentScenarioIndex = (gameState.currentScenarioIndex + direction + CRIME_SCENARIOS.length) % CRIME_SCENARIOS.length;
    currentCrime = CRIME_SCENARIOS[gameState.currentScenarioIndex];
    
    document.getElementById('currentScenarioName').textContent = currentCrime.title;
    resetGameForNewScenario();
}

window.randomScenario = function() {
    gameState.currentScenarioIndex = Math.floor(Math.random() * CRIME_SCENARIOS.length);
    currentCrime = CRIME_SCENARIOS[gameState.currentScenarioIndex];
    
    document.getElementById('currentScenarioName').textContent = currentCrime.title;
    resetGameForNewScenario();
}

window.showAllSuspects = function() {
    if (gameState.gameOver) return;
    
    alert(`Culprit: ${gameState.culprit.name} (${gameState.culprit.job})
Access: ${gameState.culprit.access}
Timing: ${gameState.culprit.timing}
Knowledge: ${gameState.culprit.knowledge}
Motive: ${gameState.culprit.motive}
Behavior: ${gameState.culprit.behavior}

All suspects:
${gameState.suspects.map(s => `${s.name}`).join('\n')}`);
}

window.toggleDevMode = function() {
    localStorage.removeItem('guiltyDevMode');
    window.location.href = window.location.pathname;
}

window.saveDevNotes = function() {
    const notes = document.getElementById('devNotes').value;
    const scenarioNotes = JSON.parse(localStorage.getItem('guiltyScenarioNotes') || '{}');
    
    // Create a unique key for this test
    let noteKey = currentCrime.id;
    if (gameState.betaMode) {
        const period = getPuzzlePeriod();
        const estTime = getESTTime();
        const betaTime = new Date(estTime.getTime() + (5 * 3600000));
        const betaDateStr = betaTime.toISOString().split('T')[0];
        noteKey = `beta_${betaDateStr}_${period}_${currentCrime.id}`;
    }
    
    scenarioNotes[noteKey] = {
        notes,
        timestamp: new Date().toISOString(),
        difficulty: gameState.difficulty,
        betaTest: gameState.betaMode,
        puzzleData: gameState.betaMode ? {
            culprit: gameState.culprit,
            initialSuspect: gameState.initialSuspect,
            seed: getDailySeed(),
            crime: currentCrime.id
        } : null
    };
    localStorage.setItem('guiltyScenarioNotes', JSON.stringify(scenarioNotes));
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Saved!';
    button.style.background = '#4CAF50';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Generate beta test report
window.generateBetaReport = function() {
    if (!gameState.betaMode) return;
    
    const report = {
        testTime: new Date().toISOString(),
        puzzleTime: new Date(getESTTime().getTime() + (5 * 3600000)).toISOString(),
        period: getPuzzlePeriod(),
        crime: currentCrime,
        culprit: gameState.culprit,
        initialSuspect: gameState.initialSuspect,
        seed: getDailySeed(),
        difficulty: gameState.difficulty,
        suspects: gameState.suspects,
        notes: document.getElementById('devNotes').value
    };
    
    // Check for logical consistency issues
    const issues = [];
    
    // Check if culprit has all traits
    const traitCategories = getTraitCategories(currentCrime);
    Object.keys(traitCategories).forEach(trait => {
        if (!gameState.culprit[trait]) {
            issues.push(`Culprit missing trait: ${trait}`);
        }
    });
    
    // Check if initial suspect feedback is correct
    Object.keys(traitCategories).forEach(trait => {
        if (gameState.initialSuspect[trait]) {
            const feedback = getFeedbackForTrait(
                gameState.initialSuspect[trait], 
                gameState.culprit[trait], 
                trait
            );
            const expectedGreen = gameState.difficulty === 'easy' ? 2 : 1;
            // Add more validation as needed
        }
    });
    
    // Check suspect diversity
    const traitCombos = new Set();
    gameState.suspects.forEach(suspect => {
        const combo = Object.keys(traitCategories)
            .map(trait => suspect[trait] || 'undefined')
            .join('-');
        if (traitCombos.has(combo)) {
            issues.push(`Duplicate suspect profile found`);
        }
        traitCombos.add(combo);
    });
    
    report.issues = issues;
    
    // Save report
    const betaReports = JSON.parse(localStorage.getItem('guiltyBetaReports') || '[]');
    betaReports.push(report);
    localStorage.setItem('guiltyBetaReports', JSON.stringify(betaReports));
    
    // Display report summary
    alert(`Beta Test Report Generated:
Crime: ${currentCrime.title}
Period: ${getPuzzlePeriod()}
Issues Found: ${issues.length}
${issues.length > 0 ? '\nIssues:\n' + issues.join('\n') : '\n✅ No issues detected'}

Report saved to localStorage.`);
    
    return report;
}

function resetGameForNewScenario() {
    // Reset game state
    gameState.guesses = [];
    gameState.currentGuess = 0;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.startTime = null;
    gameState.elapsedTime = 0;
    gameState.eliminatedSuspects = new Set();
    
    // Clear UI
    stopTimer();
    document.getElementById('timerDisplay').textContent = 'Time: 0:00';
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('suspectsSection').style.display = 'block';
    
    // Remove any hints
    const hint = document.querySelector('.crime-hint');
    if (hint) hint.remove();
    
    // Generate new suspects
    const seed = gameState.devMode ? Math.random() * 10000 : getDailySeed();
    const allSuspects = generateSuspects(seed, currentCrime);
    
    // Pick culprit
    const culpritIndex = Math.floor(seededRandom(seed) * allSuspects.length);
    gameState.culprit = allSuspects[culpritIndex];
    
    // Ensure culprit has ALL traits
    const allTraitKeys = Object.keys(getTraitCategories(currentCrime));
    allTraitKeys.forEach(key => {
        if (gameState.culprit[key] === undefined) {
            const traitValues = currentCrime.traits[key];
            gameState.culprit[key] = traitValues[Math.floor(seededRandom(seed + key.charCodeAt(0) * 100) * traitValues.length)];
        }
    });
    
    // Determine green traits for initial suspect
    const traitKeys = Object.keys(getTraitCategories(currentCrime));
    let greenCount = gameState.difficulty === 'easy' ? 2 : 1;
    
    const shuffledTraits = [...traitKeys].sort(() => seededRandom(seed + 1000) - 0.5);
    const greenTraits = shuffledTraits.slice(0, greenCount);
    
    // Ensure multiple suspects share green traits
    allSuspects.forEach((suspect, index) => {
        if (index !== culpritIndex) {
            if (seededRandom(seed + index * 100) > 0.6) {
                greenTraits.forEach(trait => {
                    suspect[trait] = gameState.culprit[trait];
                });
            }
        }
    });
    
    // Generate initial suspect
    gameState.initialSuspect = generateInitialSuspect(gameState.culprit, gameState.difficulty, seed, greenTraits);
    
    // Select all 10 suspects
    gameState.suspects = [...allSuspects];
    gameState.suspects.sort(() => seededRandom(seed + 100) - 0.5);
    
    if (gameState.devMode) {
        document.getElementById('devCulpritInfo').textContent = `${gameState.culprit.name} (${gameState.culprit.job})`;
        
        // Load appropriate notes
        const scenarioNotes = JSON.parse(localStorage.getItem('guiltyScenarioNotes') || '{}');
        let noteKey = currentCrime.id;
        
        if (gameState.betaMode) {
            const period = getPuzzlePeriod();
            const estTime = getESTTime();
            const betaTime = new Date(estTime.getTime() + (5 * 3600000));
            const betaDateStr = betaTime.toISOString().split('T')[0];
            noteKey = `beta_${betaDateStr}_${period}_${currentCrime.id}`;
        }
        
        if (scenarioNotes[noteKey]) {
            document.getElementById('devNotes').value = scenarioNotes[noteKey].notes;
        } else {
            document.getElementById('devNotes').value = '';
        }
    }
    
    displayInitialSuspect();
    displaySuspects();
    updateGuessCounter();
    
    if (!gameState.startTime) {
        startTimer();
    }
}

// Initialize the game
async function initGame() {
    const seed = getDailySeed();
    
    // Determine crime scenario
    let crimeIndex;
    if (gameState.devMode && !gameState.betaMode) {
        // In dev mode but not beta mode, use the selected scenario
        crimeIndex = gameState.currentScenarioIndex;
    } else {
        // In normal mode or beta mode, use date-based selection
        const estTime = getESTTime();
        let testTime = estTime;
        
        if (gameState.betaMode) {
            testTime = new Date(estTime.getTime() + (5 * 3600000)); // Add 5 hours for beta
        }
        
        const dayOfYear = Math.floor((testTime - new Date(testTime.getFullYear(), 0, 0)) / 86400000);
        crimeIndex = dayOfYear % CRIME_SCENARIOS.length;
    }
    currentCrime = CRIME_SCENARIOS[crimeIndex];
    
    // Display crime info
    const period = getPuzzlePeriod();
    const estTime = getESTTime();
    let displayTime = estTime;
    let displayLabel = '';
    
    if (gameState.betaMode) {
        displayTime = new Date(estTime.getTime() + (5 * 3600000));
        displayLabel = ' [BETA TEST]';
    }
    
    const dateStr = displayTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('crimeTitle').textContent = `${dateStr} ${period} Crime: ${currentCrime.title}${displayLabel}`;
    document.getElementById('crimeDescription').textContent = currentCrime.description;
    
    // Load stats
    loadStats();
    
    // Check for first-time player
    checkFirstTimePlayer();
    
    // Generate suspects
    const allSuspects = generateSuspects(seed, currentCrime);
    
    // Pick culprit
    const culpritIndex = Math.floor(seededRandom(seed) * allSuspects.length);
    gameState.culprit = allSuspects[culpritIndex];
    
    // Ensure culprit has ALL traits
    const allTraitKeys = Object.keys(getTraitCategories(currentCrime));
    allTraitKeys.forEach(key => {
        if (gameState.culprit[key] === undefined) {
            const traitValues = currentCrime.traits[key];
            gameState.culprit[key] = traitValues[Math.floor(seededRandom(seed + key.charCodeAt(0) * 100) * traitValues.length)];
        }
    });
    
    // Determine green traits
    const traitKeys = Object.keys(getTraitCategories(currentCrime));
    let greenCount = gameState.difficulty === 'easy' ? 2 : 1;
    
    const shuffledTraits = [...traitKeys].sort(() => seededRandom(seed + 1000) - 0.5);
    const greenTraits = shuffledTraits.slice(0, greenCount);
    
    // Ensure multiple suspects share green traits
    allSuspects.forEach((suspect, index) => {
        if (index !== culpritIndex) {
            if (seededRandom(seed + index * 100) > 0.6) {
                greenTraits.forEach(trait => {
                    suspect[trait] = gameState.culprit[trait];
                });
            }
        }
    });
    
    // Generate initial suspect
    gameState.initialSuspect = generateInitialSuspect(gameState.culprit, gameState.difficulty, seed, greenTraits);
    
    // Select all 10 suspects
    gameState.suspects = [...allSuspects];
    gameState.suspects.sort(() => seededRandom(seed + 100) - 0.5);
    
    if (gameState.devMode) {
        document.getElementById('devCulpritInfo').textContent = `${gameState.culprit.name} (${gameState.culprit.job})`;
        
        // Load appropriate notes
        const scenarioNotes = JSON.parse(localStorage.getItem('guiltyScenarioNotes') || '{}');
        let noteKey = currentCrime.id;
        
        if (gameState.betaMode) {
            const period = getPuzzlePeriod();
            const estTime = getESTTime();
            const betaTime = new Date(estTime.getTime() + (5 * 3600000));
            const betaDateStr = betaTime.toISOString().split('T')[0];
            noteKey = `beta_${betaDateStr}_${period}_${currentCrime.id}`;
        }
        
        if (scenarioNotes[noteKey]) {
            document.getElementById('devNotes').value = scenarioNotes[noteKey].notes;
        } else {
            document.getElementById('devNotes').value = '';
        }
    }
    
    displayInitialSuspect();
    displaySuspects();
    updateGuessCounter();
    
    // Don't start timer in dev/beta mode until first guess
    if (!gameState.devMode && !gameState.betaMode) {
        startTimer();
    }
}

// Display suspects
function displaySuspects() {
    const suspectsGrid = document.getElementById('suspectsGrid');
    suspectsGrid.innerHTML = '';
    
    gameState.suspects.forEach((suspect, index) => {
        const isEliminated = gameState.eliminatedSuspects.has(suspect.name);
        const suspectCard = document.createElement('div');
        suspectCard.className = `suspect-card ${isEliminated ? 'eliminated' : ''}`;
        suspectCard.onclick = () => makeGuess(index);
        
        const traitCategories = getTraitCategories(currentCrime);
        const traitInfo = Object.keys(traitCategories).map(key => {
            const value = suspect[key];
            const categoryInfo = traitCategories[key];
            const hint = categoryInfo.hints[value] || '';
            return value ? `<div class="trait-info">${categoryInfo.name}: ${value}</div>` : '';
        }).filter(info => info).join('');
        
        suspectCard.innerHTML = `
            <div class="suspect-header">
                <div class="suspect-name">${suspect.name}</div>
                <button class="eliminate-btn ${isEliminated ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleElimination('${suspect.name}')"
                        title="${isEliminated ? 'Restore suspect' : 'Eliminate suspect'}">
                    ❌
                </button>
            </div>
            <div class="suspect-job">${suspect.job}</div>
            <div class="suspect-traits">
                ${traitInfo}
            </div>
        `;
        
        suspectsGrid.appendChild(suspectCard);
    });
}

// Update guess counter
function updateGuessCounter() {
    const maxGuesses = gameState.difficulty === 'easy' ? 8 : (gameState.difficulty === 'medium' ? 6 : 4);
    const remaining = maxGuesses - gameState.currentGuess;
    
    document.getElementById('guessesRemaining').textContent = remaining;
    document.getElementById('guessCounter').textContent = `Guess ${gameState.currentGuess}/${maxGuesses}`;
}

// Make a guess
async function makeGuess(suspectIndex) {
    if (gameState.gameOver || gameState.isProcessingGuess) return;
    
    const suspect = gameState.suspects[suspectIndex];
    if (gameState.eliminatedSuspects.has(suspect.name)) {
        return; // Can't guess eliminated suspects
    }
    
    // Start timer on first guess
    if (gameState.currentGuess === 0 && !gameState.startTime) {
        startTimer();
    }
    
    gameState.isProcessingGuess = true;
    
    try {
        gameState.guesses.push(suspect);
        gameState.currentGuess++;
        
        displayGuess(suspect);
        
        const maxGuesses = gameState.difficulty === 'easy' ? 8 : (gameState.difficulty === 'medium' ? 6 : 4);
        
        if (suspect.name === gameState.culprit.name) {
            endGame(true);
        } else if (gameState.currentGuess >= maxGuesses) {
            endGame(false);
        }
        
        updateGuessCounter();
    } finally {
        gameState.isProcessingGuess = false;
    }
}

// Display a guess
function displayGuess(suspect) {
    const gameBoard = document.getElementById('gameBoard');
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';
    
    const traitCategories = getTraitCategories(currentCrime);
    
    // Name and job
    const nameDiv = document.createElement('div');
    nameDiv.className = 'guess-name';
    nameDiv.textContent = `${suspect.name} (${suspect.job})`;
    guessRow.appendChild(nameDiv);
    
    // Traits container
    const traitsDiv = document.createElement('div');
    traitsDiv.className = 'guess-traits';
    
    // Add each trait
    Object.keys(traitCategories).forEach(traitKey => {
        const feedback = createTraitFeedback(traitKey, suspect[traitKey]);
        if (feedback) {
            traitsDiv.appendChild(feedback);
        }
    });
    
    guessRow.appendChild(traitsDiv);
    
    // Add animation
    guessRow.style.opacity = '0';
    gameBoard.appendChild(guessRow);
    
    setTimeout(() => {
        guessRow.style.opacity = '1';
    }, 100);
}

// Create trait feedback element
function createTraitFeedback(traitKey, value) {
    if (!value) return null;
    
    const feedback = getFeedbackForTrait(value, gameState.culprit[traitKey], traitKey);
    if (feedback === 'unknown') return null;
    
    const traitDiv = document.createElement('div');
    traitDiv.className = `trait-box ${feedback}`;
    
    const traitCategories = getTraitCategories(currentCrime);
    const categoryInfo = traitCategories[traitKey];
    
    traitDiv.innerHTML = `
        <div class="trait-label">${categoryInfo.name}</div>
        <div class="trait-value">${value}</div>
        ${categoryInfo.hints[value] ? `<div class="trait-hint">${categoryInfo.hints[value]}</div>` : ''}
    `;
    
    if (feedback === 'close' && gameState.difficulty === 'easy') {
        const arrow = document.createElement('div');
        arrow.className = 'trait-arrow';
        
        const traitArray = currentCrime.traits[traitKey];
        const guessPos = traitArray.indexOf(value);
        const culpritPos = traitArray.indexOf(gameState.culprit[traitKey]);
        
        arrow.textContent = guessPos < culpritPos ? '→' : '←';
        traitDiv.appendChild(arrow);
    }
    
    return traitDiv;
}

// End the game
function endGame(won) {
    gameState.gameOver = true;
    gameState.won = won;
    stopTimer();
    
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('suspectsSection').style.display = 'none';
    
    const resultDiv = document.getElementById('gameResult');
    const finalTimeDiv = document.getElementById('finalTime');
    const culpritDiv = document.getElementById('culpritReveal');
    
    const minutes = Math.floor(gameState.elapsedTime / 60000);
    const seconds = Math.floor((gameState.elapsedTime % 60000) / 1000);
    
    if (won) {
        resultDiv.innerHTML = `<h2>🎉 Congratulations!</h2><p>You found the culprit in ${gameState.currentGuess} ${gameState.currentGuess === 1 ? 'guess' : 'guesses'}!</p>`;
    } else {
        resultDiv.innerHTML = `<h2>😔 Game Over</h2><p>You've run out of guesses!</p>`;
    }
    
    finalTimeDiv.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    culpritDiv.innerHTML = `<strong>The culprit was:</strong> ${gameState.culprit.name} (${gameState.culprit.job})`;
    
    updateStats(won);
}

// Reset the game
function resetGame() {
    gameState.guesses = [];
    gameState.currentGuess = 0;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.startTime = null;
    gameState.elapsedTime = 0;
    gameState.eliminatedSuspects = new Set();
    
    stopTimer();
    document.getElementById('timerDisplay').textContent = 'Time: 0:00';
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('suspectsSection').style.display = 'block';
    
    initGame();
}

// Share results
function shareResults() {
    const period = getPuzzlePeriod();
    const estTime = getESTTime();
    const dateStr = estTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    let shareText = `GUILTY ${dateStr} ${period}\n`;
    shareText += `${currentCrime.title}\n`;
    shareText += gameState.won ? `✅ Solved in ${gameState.currentGuess}/` : `❌ Failed `;
    
    const maxGuesses = gameState.difficulty === 'easy' ? 8 : (gameState.difficulty === 'medium' ? 6 : 4);
    shareText += `${maxGuesses} (${gameState.difficulty})\n\n`;
    
    gameState.guesses.forEach(guess => {
        const isCorrect = guess.name === gameState.culprit.name;
        shareText += isCorrect ? '🟩' : '🟥';
    });
    
    for (let i = gameState.guesses.length; i < maxGuesses; i++) {
        shareText += '⬜';
    }
    
    shareText += `\n\nPlay at: ${window.location.href}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        const btn = document.querySelector('button[onclick="shareResults()"]');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Stats management
function loadStats() {
    const stats = localStorage.getItem('guiltyStats');
    if (stats) {
        const parsed = JSON.parse(stats);
        updateStreakDisplay();
    }
}

function saveStats() {
    localStorage.setItem('guiltyStats', JSON.stringify(gameState.stats));
}

function updateStats(won) {
    if (!gameState.stats) {
        gameState.stats = {
            played: 0,
            won: 0,
            currentStreak: 0,
            maxStreak: 0,
            guessDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
            completionTimes: [],  // Array to store completion times
            bestTime: null,       // Best completion time in milliseconds
            averageTime: null,    // Average completion time
            puzzleCompletions: {} // Track which puzzles have been completed
        };
    }
    
    const stats = JSON.parse(localStorage.getItem('guiltyStats')) || gameState.stats;
    
    // Generate a unique puzzle ID based on date and period
    const period = getPuzzlePeriod();
    const estTime = getESTTime();
    const puzzleId = estTime.toISOString().split('T')[0] + '-' + period + '-' + currentCrime.id;
    
    stats.played++;
    if (won) {
        stats.won++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        stats.guessDistribution[gameState.currentGuess] = (stats.guessDistribution[gameState.currentGuess] || 0) + 1;
        
        // Track completion time only for first completion of this puzzle
        if (!stats.puzzleCompletions) {
            stats.puzzleCompletions = {};
        }
        
        if (!stats.puzzleCompletions[puzzleId]) {
            // First time completing this puzzle
            stats.puzzleCompletions[puzzleId] = true;
            
            // Initialize arrays if they don't exist
            if (!stats.completionTimes) stats.completionTimes = [];
            
            // Add the completion time
            stats.completionTimes.push(gameState.elapsedTime);
            
            // Update best time
            if (!stats.bestTime || gameState.elapsedTime < stats.bestTime) {
                stats.bestTime = gameState.elapsedTime;
            }
            
            // Calculate average time
            const totalTime = stats.completionTimes.reduce((sum, time) => sum + time, 0);
            stats.averageTime = Math.floor(totalTime / stats.completionTimes.length);
        }
    } else {
        stats.currentStreak = 0;
    }
    
    gameState.stats = stats;
    saveStats();
    updateStreakDisplay();
}

function updateStreakDisplay() {
    const stats = JSON.parse(localStorage.getItem('guiltyStats')) || gameState.stats;
    if (stats && stats.currentStreak > 0) {
        document.getElementById('streakDisplay').textContent = `🔥 ${stats.currentStreak}`;
    }
}

// Show stats modal
function showStats() {
    const stats = JSON.parse(localStorage.getItem('guiltyStats')) || {
        played: 0,
        won: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
        completionTimes: [],
        bestTime: null,
        averageTime: null,
        puzzleCompletions: {}
    };
    
    const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
    
    // Format time for display
    function formatTime(milliseconds) {
        if (milliseconds === null || milliseconds === undefined) return '--:--';
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        return `${minutes}:${displaySeconds.toString().padStart(2, '0')}`;
    }
    
    document.getElementById('gamesPlayed').textContent = stats.played;
    document.getElementById('winRate').textContent = `${winRate}%`;
    document.getElementById('currentStreak').textContent = stats.currentStreak;
    document.getElementById('maxStreak').textContent = stats.maxStreak;
    
    // Add time stats to the modal - we'll need to add these elements
    const statsGrid = document.querySelector('.stats-grid');
    
    // Check if time stat boxes already exist, if not create them
    if (!document.getElementById('avgTime')) {
        const avgTimeBox = document.createElement('div');
        avgTimeBox.className = 'stat-box';
        avgTimeBox.innerHTML = `
            <div class="stat-number" id="avgTime">--:--</div>
            <div class="stat-label">Average Time</div>
        `;
        statsGrid.appendChild(avgTimeBox);
        
        const bestTimeBox = document.createElement('div');
        bestTimeBox.className = 'stat-box';
        bestTimeBox.innerHTML = `
            <div class="stat-number" id="bestTime">--:--</div>
            <div class="stat-label">Best Time</div>
        `;
        statsGrid.appendChild(bestTimeBox);
    }
    
    // Update time displays
    document.getElementById('avgTime').textContent = formatTime(stats.averageTime);
    document.getElementById('bestTime').textContent = formatTime(stats.bestTime);
    
    // Update guess distribution
    const maxCount = Math.max(...Object.values(stats.guessDistribution), 1);
    const distributionDiv = document.getElementById('guessDistribution');
    distributionDiv.innerHTML = '';
    
    for (let i = 1; i <= 8; i++) {
        const count = stats.guessDistribution[i] || 0;
        const percentage = (count / maxCount) * 100;
        
        const row = document.createElement('div');
        row.className = 'distribution-row';
        row.innerHTML = `
            <span class="distribution-label">${i}</span>
            <div class="distribution-bar" style="width: ${percentage}%">
                <span class="distribution-count">${count}</span>
            </div>
        `;
        distributionDiv.appendChild(row);
    }
    
    document.getElementById('statsModal').style.display = 'flex';
}

// Hide stats modal
function hideStats() {
    document.getElementById('statsModal').style.display = 'none';
}

// Show reference modal
function showReference() {
    const modal = document.getElementById('referenceModal');
    const content = document.getElementById('referenceContent');
    
    const traitCategories = getTraitCategories(currentCrime);
    
    let html = `<h3>${currentCrime.title} - Trait Reference</h3>`;
    
    Object.entries(traitCategories).forEach(([key, category]) => {
        html += `<div class="reference-category">`;
        html += `<h4>${category.name}</h4>`;
        html += `<div class="reference-traits">`;
        
        currentCrime.traits[key].forEach(value => {
            const hint = category.hints[value];
            html += `
                <div class="reference-trait">
                    <span class="trait-name">${value}</span>
                    <span class="trait-description">${hint}</span>
                </div>
            `;
        });
        
        html += `</div></div>`;
    });
    
    content.innerHTML = html;
    modal.style.display = 'flex';
}

// Hide reference modal
function hideReference() {
    document.getElementById('referenceModal').style.display = 'none';
}

// Show tutorial
function showTutorial() {
    document.getElementById('tutorialModal').style.display = 'flex';
}

function hideTutorial() {
    document.getElementById('tutorialModal').style.display = 'none';
    localStorage.setItem('guiltyTutorialSeen', 'true');
}

// Check first time player
function checkFirstTimePlayer() {
    if (!localStorage.getItem('guiltyTutorialSeen')) {
        setTimeout(() => {
            showTutorial();
        }, 500);
    }
}

// Toggle suspect elimination
function toggleElimination(suspectName) {
    if (gameState.eliminatedSuspects.has(suspectName)) {
        gameState.eliminatedSuspects.delete(suspectName);
    } else {
        gameState.eliminatedSuspects.add(suspectName);
    }
    toggleEliminationButton(suspectName);
}

function toggleEliminationButton(suspectName) {
    const suspectCards = document.querySelectorAll('.suspect-card');
    suspectCards.forEach(card => {
        if (card.querySelector('.suspect-name').textContent === suspectName) {
            card.classList.toggle('eliminated');
            const btn = card.querySelector('.eliminate-btn');
            btn.classList.toggle('active');
            const isEliminated = card.classList.contains('eliminated');
            btn.title = isEliminated ? 'Restore suspect' : 'Eliminate suspect';
        }
    });
}

// Generate initial suspect
function generateInitialSuspect(culprit, difficulty, seed, predeterminedGreenTraits = null) {
    const traitCategories = getTraitCategories(currentCrime);
    const traitKeys = Object.keys(traitCategories);
    
    let greenTraits;
    if (predeterminedGreenTraits) {
        greenTraits = predeterminedGreenTraits;
    } else {
        let greenCount;
        if (difficulty === 'easy') {
            greenCount = 2;
        } else if (difficulty === 'medium') {
            greenCount = 1;
        } else {
            greenCount = 1;
        }
        
        const shuffledTraits = [...traitKeys].sort(() => seededRandom(seed + 500) - 0.5);
        greenTraits = shuffledTraits.slice(0, greenCount);
    }
    
    const initialSuspect = {
        name: "Initial Report",
        job: "Detective's Analysis"
    };
    
    traitKeys.forEach(key => {
        if (greenTraits.includes(key)) {
            initialSuspect[key] = culprit[key];
        } else {
            const traitValues = currentCrime.traits[key];
            const culpritIndex = traitValues.indexOf(culprit[key]);
            
            let selectedValue;
            if (difficulty === 'hard') {
                selectedValue = traitValues[Math.floor(seededRandom(seed + key.charCodeAt(0) * 50) * traitValues.length)];
            } else {
                const nearbyIndices = [];
                for (let i = Math.max(0, culpritIndex - 1); i <= Math.min(traitValues.length - 1, culpritIndex + 1); i++) {
                    if (i !== culpritIndex) nearbyIndices.push(i);
                }
                
                const randomIndex = nearbyIndices[Math.floor(seededRandom(seed + key.charCodeAt(0) * 60) * nearbyIndices.length)];
                selectedValue = traitValues[randomIndex];
            }
            
            initialSuspect[key] = selectedValue;
        }
    });
    
    return initialSuspect;
}

// Generate trait guide HTML
function generateTraitGuideHTML() {
    const traitCategories = getTraitCategories(currentCrime);
    let html = '<div class="trait-guide">';
    
    html += '<h3>Evidence Analysis</h3>';
    html += '<p>Based on our investigation, we have the following information about the suspect:</p>';
    html += '<div class="trait-list">';
    
    Object.entries(traitCategories).forEach(([key, category]) => {
        const value = gameState.initialSuspect[key];
        if (value) {
            const hint = category.hints[value];
            const feedback = getFeedbackForTrait(value, gameState.culprit[key], key);
            
            html += `
                <div class="trait-item ${feedback}">
                    <div class="trait-category">${category.name}:</div>
                    <div class="trait-value">${value}</div>
                    ${hint ? `<div class="trait-description">${hint}</div>` : ''}
                    ${feedback === 'close' && gameState.difficulty === 'easy' ? 
                        `<div class="trait-feedback">⚠️ Close but not exact</div>` : ''}
                    ${feedback === 'correct' ? 
                        `<div class="trait-feedback">✓ Confirmed accurate</div>` : ''}
                </div>
            `;
        }
    });
    
    html += '</div>';
    
    if (gameState.difficulty === 'easy') {
        html += '<p class="hint-text">💡 Green traits are confirmed accurate. Yellow traits are close (within 1 position).</p>';
    } else if (gameState.difficulty === 'medium') {
        html += '<p class="hint-text">💡 Green traits are confirmed accurate. Use these as anchor points for your investigation.</p>';
    } else {
        html += '<p class="hint-text">⚠️ Hard mode: Limited reliable information. Trust only green traits.</p>';
    }
    
    html += '</div>';
    return html;
}

// Display initial suspect
function displayInitialSuspect() {
    const crimeHeader = document.querySelector('.crime-header');
    const existingHint = document.querySelector('.crime-hint');
    
    if (existingHint) {
        existingHint.remove();
    }
    
    const hintDiv = document.createElement('div');
    hintDiv.className = 'crime-hint';
    hintDiv.innerHTML = generateTraitGuideHTML();
    
    crimeHeader.insertAdjacentElement('afterend', hintDiv);
}

// Get EST time
function getESTTime() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utcTime + (3600000 * -5)); // EST is UTC-5
}

// Export functions for global access
window.showStats = showStats;
window.hideStats = hideStats;
window.showReference = showReference;
window.hideReference = hideReference;
window.showTutorial = showTutorial;
window.hideTutorial = hideTutorial;
window.shareResults = shareResults;
window.resetGame = resetGame; 