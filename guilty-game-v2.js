// GUILTY v2 - Improved Logic and Difficulty Settings

// Difficulty settings
const DIFFICULTY_SETTINGS = {
    easy: {
        maxGuesses: 8,
        name: 'Easy'
    },
    medium: {
        maxGuesses: 6,
        name: 'Medium'
    },
    hard: {
        maxGuesses: 4,
        name: 'Hard'
    }
};

// Fixed crime template
const CRIME_TEMPLATE = {
    title: "The Museum Diamond Heist",
    description: "The priceless 'Star of Mumbai' diamond was stolen from the Natural History Museum last night. Security footage shows the thief knew the guard rotation perfectly. The crime occurred between 2-3 AM."
};

// Multiple crime scenarios that rotate daily
const CRIME_SCENARIOS = [
    {
        id: 'museum_heist',
        title: "The Museum Diamond Heist",
        description: "The priceless 'Star of Mumbai' diamond was stolen from the Natural History Museum last night. Security footage shows the thief knew the guard rotation perfectly. The crime occurred between 2-3 AM.",
        setting: 'museum',
        traits: {
            access: ['Staff', 'Visitor', 'VIP', 'Contractor', 'None'],
            timing: ['Working', 'Home', 'Out', 'Verified', 'Asleep'],
            knowledge: ['Expert', 'Familiar', 'Basic', 'Limited', 'None'],
            motive: ['Desperate', 'Greedy', 'Vengeful', 'Curious', 'None'],
            behavior: ['Suspicious', 'Nervous', 'Changed', 'Normal', 'Helpful'],
            physical: ['Matches', 'Similar', 'Different', 'Partial', 'Excluded'],
            tools: ['Has All', 'Has Some', 'Could Get', 'Limited', 'No Access'],
            alibi: ['None', 'Weak', 'Partial', 'Strong', 'Verified'],
            finances: ['Desperate', 'Struggling', 'Stable', 'Comfortable', 'Wealthy'],
            technical: ['Expert', 'Skilled', 'Basic', 'Limited', 'None']
        },
        suspectJobs: [
            { title: "Security Guard", access: "Staff", knowledge: "Expert" },
            { title: "Janitor", access: "Staff", knowledge: "Familiar" },
            { title: "Curator", access: "Staff", knowledge: "Basic" },
            { title: "Tour Guide", access: "Staff", knowledge: "Basic" },
            { title: "Wealthy Donor", access: "VIP", knowledge: "None" },
            { title: "Maintenance Worker", access: "Contractor", knowledge: "Familiar" },
            { title: "Art Student", access: "Visitor", knowledge: "None" },
            { title: "Security Consultant", access: "Contractor", knowledge: "Expert" },
            { title: "Night Watchman", access: "Staff", knowledge: "Expert" },
            { title: "Private Collector", access: "VIP", knowledge: "Basic" }
        ]
    },
    {
        id: 'tech_breach',
        title: "The Research Lab Data Theft",
        description: "Someone copied confidential research data from TechCorp's environmental science lab last night. The breach occurred at 11:47 PM using valid credentials.",
        setting: 'tech_company',
        traits: {
            access: ['Admin', 'Developer', 'Employee', 'Contractor', 'None'],
            timing: ['Online', 'Office', 'Home', 'Logged', 'Offline'],
            knowledge: ['Expert', 'Advanced', 'Basic', 'Limited', 'None'],
            motive: ['Profit', 'Competition', 'Whistleblowing', 'Curiosity', 'None'],
            behavior: ['Paranoid', 'Defensive', 'Evasive', 'Normal', 'Cooperative'],
            tools: ['Has All', 'Has Some', 'Could Get', 'Limited', 'No Access'],
            history: ['Suspicious', 'Disgruntled', 'Clean', 'Loyal', 'New'],
            alibi: ['None', 'Weak', 'Partial', 'Strong', 'Verified'],
            technical: ['Elite', 'Expert', 'Skilled', 'Basic', 'Novice'],
            opportunity: ['Perfect', 'Good', 'Possible', 'Limited', 'None']
        },
        suspectJobs: [
            { title: "System Admin", access: "Admin", knowledge: "Expert" },
            { title: "Senior Developer", access: "Developer", knowledge: "Expert" },
            { title: "Junior Developer", access: "Developer", knowledge: "Advanced" },
            { title: "Project Manager", access: "Employee", knowledge: "Basic" },
            { title: "Security Analyst", access: "Admin", knowledge: "Expert" },
            { title: "IT Contractor", access: "Contractor", knowledge: "Advanced" },
            { title: "Intern", access: "Developer", knowledge: "Basic" },
            { title: "Former Employee", access: "Employee", knowledge: "Expert" },
            { title: "Database Admin", access: "Admin", knowledge: "Advanced" },
            { title: "QA Tester", access: "Developer", knowledge: "Basic" }
        ],
        easyHint: "Check for someone with admin access and technical expertise..."
    },
    {
        id: 'recipe_theft',
        title: "The Secret Recipe Theft",
        description: "The famous secret recipe for Grandma's Cookies was stolen from the company vault. The thief struck during the evening shift change at 7:45 PM.",
        setting: 'bakery',
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
        },
        suspectJobs: [
            { title: "Head Baker", access: "Kitchen", knowledge: "Expert" },
            { title: "Assistant Baker", access: "Kitchen", knowledge: "Professional" },
            { title: "Pastry Chef", access: "Kitchen", knowledge: "Professional" },
            { title: "Store Manager", access: "Office", knowledge: "Amateur" },
            { title: "Cashier", access: "Limited", knowledge: "None" },
            { title: "Competitor's Spy", access: "None", knowledge: "None" },
            { title: "Business Partner", access: "Office", knowledge: "Basic" },
            { title: "Delivery Driver", access: "Delivery", knowledge: "None" },
            { title: "Recipe Developer", access: "Kitchen", knowledge: "Expert" },
            { title: "Marketing Director", access: "Office", knowledge: "Basic" }
        ],
        easyHint: "Someone with kitchen access and baking knowledge is suspicious..."
    }
];

// Dynamic trait categories based on current crime
function getTraitCategories(crime) {
    const baseCategories = {
        museum_heist: {
            access: {
                name: 'Museum Access',
                values: {
                    'Staff': 'Has keys and knows security',
                    'Visitor': 'Limited access',
                    'VIP': 'Special access privileges',
                    'Contractor': 'Temporary access',
                    'None': 'No legitimate access'
                }
            },
            timing: {
                name: 'Alibi Time',
                values: {
                    'Working': 'Was at museum during crime',
                    'Home': 'Claims to be home',
                    'Out': 'Was out somewhere',
                    'Verified': 'Has witness confirmation',
                    'Asleep': 'Claims to be sleeping'
                }
            },
            knowledge: {
                name: 'Security Knowledge',
                values: {
                    'Expert': 'Knows all security systems',
                    'Familiar': 'Some security knowledge',
                    'Basic': 'General awareness only',
                    'Limited': 'Minimal knowledge',
                    'None': 'No security knowledge'
                }
            },
            motive: {
                name: 'Motive Strength',
                values: {
                    'Desperate': 'Urgent need for money',
                    'Greedy': 'Wants more wealth',
                    'Vengeful': 'Has grudge against museum',
                    'Curious': 'Fascinated by diamond',
                    'None': 'No clear motive'
                }
            },
            behavior: {
                name: 'Recent Behavior',
                values: {
                    'Suspicious': 'Acting very strangely',
                    'Nervous': 'Seems anxious lately',
                    'Changed': 'Different than usual',
                    'Helpful': 'Cooperating fully',
                    'Normal': 'Nothing unusual'
                }
            },
            physical: {
                name: 'Physical Evidence',
                values: {
                    'Matches': 'Size 10 boot, 5\'8"-5\'10"',
                    'Similar': 'Close to description',
                    'Partial': 'Some matches',
                    'Different': 'Doesn\'t match evidence',
                    'Excluded': 'Definitely not them'
                }
            },
            tools: {
                name: 'Tool Access',
                values: {
                    'Has All': 'Has lockpicks and equipment',
                    'Has Some': 'Has some needed tools',
                    'Could Get': 'Could obtain tools',
                    'Limited': 'Minimal tool access',
                    'No Access': 'No access to tools'
                }
            },
            alibi: {
                name: 'Alibi Strength',
                values: {
                    'None': 'No alibi at all',
                    'Weak': 'Unconvincing story',
                    'Partial': 'Some gaps in alibi',
                    'Strong': 'Good alibi',
                    'Verified': 'Confirmed by witnesses'
                }
            },
            finances: {
                name: 'Financial Status',
                values: {
                    'Desperate': 'Facing bankruptcy',
                    'Struggling': 'Mounting debts',
                    'Stable': 'Financially secure',
                    'Comfortable': 'Well off',
                    'Wealthy': 'No financial motive'
                }
            },
            technical: {
                name: 'Technical Skills',
                values: {
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
                values: {
                    'Admin': 'Full system privileges',
                    'Developer': 'Code repository access',
                    'Employee': 'Basic network access',
                    'Contractor': 'Temporary credentials',
                    'None': 'Access level unclear'
                }
            },
            timing: {
                name: 'Activity Log',
                values: {
                    'Online': 'Active during breach',
                    'Office': 'In building after hours',
                    'Home': 'Claims remote location',
                    'Logged': 'Verified elsewhere online',
                    'Offline': 'No digital activity'
                }
            },
            knowledge: {
                name: 'Technical Skills',
                values: {
                    'Expert': 'Could bypass all security',
                    'Advanced': 'Knows system architecture',
                    'Basic': 'General IT knowledge',
                    'Limited': 'Minimal tech skills',
                    'None': 'No programming skills'
                }
            },
            motive: {
                name: 'Potential Motive',
                values: {
                    'Profit': 'Needs money urgently',
                    'Revenge': 'Angry at company',
                    'Espionage': 'Suspected foreign ties',
                    'Curiosity': 'Intellectual interest',
                    'None': 'No apparent motive'
                }
            },
            behavior: {
                name: 'Post-Breach Behavior',
                values: {
                    'Paranoid': 'Extremely nervous',
                    'Defensive': 'Quick to blame others',
                    'Evasive': 'Avoiding questions',
                    'Cooperative': 'Helping investigation',
                    'Normal': 'Business as usual'
                }
            },
            tools: {
                name: 'Hacking Tools',
                values: {
                    'Has All': 'Custom pen-test tools',
                    'Has Some': 'Basic hacking software',
                    'Could Get': 'Access to tools',
                    'Limited': 'Minimal tools',
                    'No Access': 'No hacking tools'
                }
            },
            history: {
                name: 'Employment History',
                values: {
                    'Suspicious': 'Multiple terminations',
                    'Disgruntled': 'Recent conflicts',
                    'Clean': 'Good track record',
                    'Loyal': 'Long-term employee',
                    'New': 'Recently hired'
                }
            },
            alibi: {
                name: 'Digital Alibi',
                values: {
                    'None': 'No digital trail',
                    'Weak': 'Could be spoofed',
                    'Partial': 'Some gaps',
                    'Strong': 'Multiple logins elsewhere',
                    'Verified': 'Confirmed activity'
                }
            },
            technical: {
                name: 'Coding Ability',
                values: {
                    'Elite': 'Can code in sleep',
                    'Expert': 'Senior level skills',
                    'Skilled': 'Competent developer',
                    'Basic': 'Script kiddie level',
                    'Novice': 'Learning to code'
                }
            },
            opportunity: {
                name: 'Breach Window',
                values: {
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
                values: {
                    'Kitchen': 'Full kitchen privileges',
                    'Service': 'Limited kitchen entry',
                    'VIP': 'Guest with special access',
                    'Limited': 'Occasional access only',
                    'None': 'No legitimate access'
                }
            },
            timing: {
                name: 'Location at 7-8 PM',
                values: {
                    'Working': 'On shift in kitchen',
                    'Break': 'On break but present',
                    'Dining': 'Eating in restaurant',
                    'Documented': 'Confirmed elsewhere',
                    'Absent': 'Not in restaurant'
                }
            },
            knowledge: {
                name: 'Culinary Expertise',
                values: {
                    'Expert': 'Knows rare poisons',
                    'Professional': 'Trained chef',
                    'Amateur': 'Cooking enthusiast',
                    'Basic': 'Basic cooking skills',
                    'None': 'No cooking skills'
                }
            },
            motive: {
                name: 'Relationship to Victim',
                values: {
                    'Jealousy': 'Envious of success',
                    'Revenge': 'Past grievance',
                    'Inheritance': 'Financial beneficiary',
                    'Competition': 'Business rivalry',
                    'None': 'No known conflict'
                }
            },
            behavior: {
                name: 'Reaction to Incident',
                values: {
                    'Agitated': 'Overly emotional',
                    'Guilty': 'Shows signs of guilt',
                    'Shocked': 'Genuinely surprised',
                    'Helpful': 'Actively assisting',
                    'Calm': 'Unusually composed'
                }
            },
            physical: {
                name: 'Physical Evidence',
                values: {
                    'Matches': 'Seen near office',
                    'Similar': 'Right build',
                    'Partial': 'Some similarities',
                    'Different': 'Wrong description',
                    'Excluded': 'Too tall/short'
                }
            },
            tools: {
                name: 'Poison Access',
                values: {
                    'Has All': 'Access to fugu',
                    'Has Some': 'Kitchen chemicals',
                    'Could Get': 'Knows suppliers',
                    'Limited': 'Minimal access',
                    'No Access': 'No poison access'
                }
            },
            alibi: {
                name: 'Alibi Quality',
                values: {
                    'None': 'Can\'t explain whereabouts',
                    'Weak': 'Story doesn\'t add up',
                    'Partial': 'Some gaps',
                    'Strong': 'Multiple witnesses',
                    'Verified': 'Camera footage confirms'
                }
            },
            relationships: {
                name: 'Victim Relations',
                values: {
                    'Hostile': 'Public confrontations',
                    'Strained': 'Recent arguments',
                    'Neutral': 'Professional only',
                    'Friendly': 'Good colleagues',
                    'Excellent': 'Close friends'
                }
            },
            opportunity: {
                name: 'Office Access Window',
                values: {
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
                values: {
                    'Kitchen': 'Full kitchen and vault access',
                    'Office': 'Office and vault access',
                    'Delivery': 'Limited building access',
                    'Limited': 'Occasional access only',
                    'None': 'No legitimate access'
                }
            },
            timing: {
                name: 'Location at 7-8 PM',
                values: {
                    'Working': 'On shift during theft',
                    'Break': 'On break but present',
                    'Meeting': 'In meeting nearby',
                    'Documented': 'Confirmed elsewhere',
                    'Absent': 'Not in building'
                }
            },
            knowledge: {
                name: 'Baking Expertise',
                values: {
                    'Expert': 'Master baker level',
                    'Professional': 'Trained baker',
                    'Amateur': 'Hobby baker',
                    'Basic': 'Basic baking skills',
                    'None': 'No baking skills'
                }
            },
            motive: {
                name: 'Potential Motive',
                values: {
                    'Competition': 'Rival bakery owner',
                    'Money': 'Financial gain',
                    'Recognition': 'Wants fame',
                    'Curiosity': 'Just curious',
                    'None': 'No clear motive'
                }
            },
            behavior: {
                name: 'Reaction to Theft',
                values: {
                    'Agitated': 'Overly emotional',
                    'Guilty': 'Shows signs of guilt',
                    'Shocked': 'Genuinely surprised',
                    'Helpful': 'Actively helping',
                    'Calm': 'Unusually composed'
                }
            },
            physical: {
                name: 'Physical Evidence',
                values: {
                    'Matches': 'Flour on clothes, right height',
                    'Similar': 'Some matches',
                    'Different': 'Doesn\'t match',
                    'Partial': 'Some similarities',
                    'Excluded': 'Definitely not them'
                }
            },
            tools: {
                name: 'Vault Access',
                values: {
                    'Has All': 'Has vault key/code',
                    'Has Some': 'Partial access',
                    'Could Get': 'Could obtain access',
                    'Limited': 'Minimal access',
                    'No Access': 'No vault access'
                }
            },
            alibi: {
                name: 'Alibi Quality',
                values: {
                    'None': 'Can\'t explain whereabouts',
                    'Weak': 'Story doesn\'t add up',
                    'Partial': 'Some gaps',
                    'Strong': 'Multiple witnesses',
                    'Verified': 'Camera footage confirms'
                }
            },
            relationships: {
                name: 'Company Relations',
                values: {
                    'Hostile': 'Known conflicts',
                    'Strained': 'Recent tensions',
                    'Neutral': 'Professional only',
                    'Friendly': 'Good colleague',
                    'Excellent': 'Trusted employee'
                }
            },
            opportunity: {
                name: 'Vault Access Window',
                values: {
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

// Improved trait system with logical relationships
const TRAIT_CATEGORIES = {
    access: {
        name: 'Museum Access',
        values: {
            'Staff': { suspicion: 5, hint: 'Has keys and knows security' },
            'Visitor': { suspicion: 2, hint: 'Limited access' },
            'VIP': { suspicion: 3, hint: 'Special access privileges' },
            'Contractor': { suspicion: 4, hint: 'Temporary access' },
            'None': { suspicion: 1, hint: 'No legitimate access' }
        }
    },
    timing: {
        name: 'Alibi Time',
        values: {
            'Working': { suspicion: 5, hint: 'Was at museum during crime' },
            'Home': { suspicion: 2, hint: 'Claims to be home' },
            'Out': { suspicion: 3, hint: 'Was out somewhere' },
            'Verified': { suspicion: 1, hint: 'Has witness confirmation' },
            'Asleep': { suspicion: 2, hint: 'Claims to be sleeping' }
        }
    },
    knowledge: {
        name: 'Security Knowledge',
        values: {
            'Expert': { suspicion: 5, hint: 'Knows all security systems' },
            'Familiar': { suspicion: 4, hint: 'Some security knowledge' },
            'Basic': { suspicion: 3, hint: 'General awareness only' },
            'Limited': { suspicion: 2, hint: 'Minimal knowledge' },
            'None': { suspicion: 1, hint: 'No security knowledge' }
        }
    },
    motive: {
        name: 'Motive Strength',
        values: {
            'Desperate': { suspicion: 5, hint: 'Urgent need for money' },
            'Greedy': { suspicion: 4, hint: 'Wants more wealth' },
            'Vengeful': { suspicion: 3, hint: 'Has grudge against museum' },
            'Curious': { suspicion: 2, hint: 'Fascinated by diamond' },
            'None': { suspicion: 1, hint: 'No clear motive' }
        }
    },
    behavior: {
        name: 'Recent Behavior',
        values: {
            'Suspicious': { suspicion: 5, hint: 'Acting very strangely' },
            'Nervous': { suspicion: 4, hint: 'Seems anxious lately' },
            'Changed': { suspicion: 3, hint: 'Different than usual' },
            'Helpful': { suspicion: 2, hint: 'Cooperating fully' },
            'Normal': { suspicion: 1, hint: 'Nothing unusual' }
        }
    }
};

// Update the global TRAIT_CATEGORIES when crime changes
let currentCrime = null;

// Generate suspects with logical consistency
function generateSuspects(seed, crime) {
    const names = [
        "Anne Chen", "Ted Santos", "Henry Wilson", "Abby Thompson", "Joney Davis",
        "Sarah Martin", "Roy Lee", "Hannah Anderson", "Lex Brown", "Aaron Johnson",
        "Neve Williams", "Cal Miller", "Faye Garcia", "David Rodriguez", "Elle Martinez",
        "Jonathan Smith", "Emily Taylor", "Charles Jones", "Ben Thomas", "Will Jackson",
        "Sam White", "Juliette Harris"
    ];
    
    // Shuffle names based on seed to get different combinations each day
    const shuffledNames = [...names].sort(() => seededRandom(seed * 7) - 0.5);
    
    // Take first 10 names for this puzzle
    const selectedNames = shuffledNames.slice(0, 10);
    
    const jobs = crime.suspectJobs;
    const traitCategories = getTraitCategories(crime);
    
    const suspects = [];
    const usedCombos = new Set();
    
    // Create diverse suspects with logical trait combinations
    for (let i = 0; i < 10; i++) {
        const job = jobs[i];
        let suspect;
        let combo;
        
        do {
            // Assign other traits with some logic
            const access = job.access;
            const knowledge = job.knowledge;
            
            // Timing based on access and crime type
            let timing;
            const timingOptions = crime.traits.timing;
            if ((crime.id === 'museum_heist' && access === 'Staff') || 
                (crime.id === 'tech_breach' && access === 'Admin') ||
                (crime.id === 'restaurant_poisoning' && access === 'Kitchen')) {
                timing = seededRandom(seed + i * 11) > 0.7 ? timingOptions[0] : timingOptions[Math.floor(seededRandom(seed + i * 11.5) * timingOptions.length)];
            } else {
                timing = timingOptions[Math.floor(seededRandom(seed + i * 11) * timingOptions.length)];
            }
            
            // Motive varies
            const motives = crime.traits.motive;
            const motive = motives[Math.floor(seededRandom(seed + i * 12) * motives.length)];
            
            // Behavior often correlates with guilt factors
            let behavior;
            const behaviors = crime.traits.behavior;
            const suspicionScore = 
                traitCategories.access.values[access].suspicion +
                traitCategories.knowledge.values[knowledge].suspicion +
                (traitCategories.motive.values[motive] ? traitCategories.motive.values[motive].suspicion : 3);
            
            if (suspicionScore > 12) {
                behavior = seededRandom(seed + i * 13.5) > 0.3 ? behaviors[0] : behaviors[1];
            } else if (suspicionScore > 8) {
                const midBehaviors = behaviors.filter(b => b !== 'None');
                behavior = midBehaviors[Math.floor(seededRandom(seed + i * 14) * midBehaviors.length)];
            } else {
                behavior = behaviors[Math.floor(seededRandom(seed + i * 15) * behaviors.length)];
            }
            
            // Add the remaining traits
            const traitKeys = Object.keys(crime.traits).filter(key => 
                !['access', 'timing', 'knowledge', 'motive', 'behavior'].includes(key)
            );
            
            combo = `${access}-${timing}-${knowledge}-${motive}-${behavior}`;
            
            // Calculate total suspicion score
            let totalSuspicion = 0;
            const allTraits = { access, timing, knowledge, motive, behavior };
            
            // Assign remaining traits - but sometimes omit them to represent missing information
            traitKeys.forEach(key => {
                const traitValues = crime.traits[key];
                // 30% chance to omit this trait (missing information)
                if (seededRandom(seed + i * 20 + key.charCodeAt(0)) > 0.70) {
                    // Don't add this trait - information not available
                } else {
                    allTraits[key] = traitValues[Math.floor(seededRandom(seed + i * 21 + key.charCodeAt(0)) * traitValues.length)];
                }
            });
            
            // Calculate suspicion only for traits we have
            Object.entries(allTraits).forEach(([key, value]) => {
                if (traitCategories[key] && traitCategories[key].values[value]) {
                    totalSuspicion += traitCategories[key].values[value].suspicion;
                }
            });
            
            suspect = {
                name: selectedNames[i],
                job: job.title,
                ...allTraits,
                suspicionScore: totalSuspicion
            };
        } while (usedCombos.has(combo));
        
        usedCombos.add(combo);
        suspects.push(suspect);
    }
    
    return suspects;
}

// Improved feedback system
function getFeedbackForTrait(guessValue, culpritValue, traitCategory) {
    // If the guess doesn't have this trait info, we can't compare
    if (guessValue === undefined) {
        return 'unknown';
    }
    
    // If culprit somehow doesn't have this trait (shouldn't happen), treat as wrong
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
    initialSuspect: null,  // Add initial suspect
    guesses: [],
    currentGuess: 0,
    gameOver: false,
    won: false,
    sessionId: null,
    devMode: false,
    currentScenarioIndex: 0,
    isProcessingGuess: false,  // Add flag to prevent double-clicks
    startTime: null,
    timerInterval: null,
    elapsedTime: 0,
    eliminatedSuspects: new Set()  // Track eliminated suspects
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

// Get daily seed (now supports AM/PM puzzles)
function getDailySeed() {
    const now = new Date();
    
    // Convert to EST
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const estTime = new Date(utcTime + (3600000 * -5)); // EST is UTC-5
    
    // Check if we're in AM (midnight to noon) or PM (noon to midnight)
    const isPM = estTime.getHours() >= 12;
    const dateString = estTime.toISOString().split('T')[0].replace(/-/g, '');
    
    // Create different seeds for AM and PM
    const periodMultiplier = isPM ? 2 : 1;
    const seed = parseInt(dateString) * periodMultiplier;
    
    return seed;
}

// Get current time in EST
function getESTTime() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const estTime = new Date(utcTime + (3600000 * -5)); // EST is UTC-5
    return estTime;
}

// Get current puzzle period for display
function getPuzzlePeriod() {
    const estTime = getESTTime();
    return estTime.getHours() >= 12 ? 'PM' : 'AM';
}

// Setup difficulty toggle
function setupDifficultyToggle() {
    // Add difficulty selector to header
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
    // Check for dev mode in URL params or localStorage
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
                <button onclick="toggleDevMode()">Exit Dev Mode</button>
            </div>
            <div class="dev-info">
                <div>Current: <span id="currentScenarioName">${CRIME_SCENARIOS[0].title}</span></div>
                <div>Culprit: <span id="devCulpritInfo">-</span></div>
            </div>
            <div class="dev-feedback">
                <textarea id="devNotes" placeholder="Enter feedback/notes about this scenario..." rows="3"></textarea>
                <button onclick="saveDevNotes()">Save Notes</button>
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

// Developer mode functions
window.cycleScenario = function(direction) {
    gameState.currentScenarioIndex = (gameState.currentScenarioIndex + direction + CRIME_SCENARIOS.length) % CRIME_SCENARIOS.length;
    currentCrime = CRIME_SCENARIOS[gameState.currentScenarioIndex];
    
    // Update display
    document.getElementById('currentScenarioName').textContent = currentCrime.title;
    
    // Reset and reinit with new scenario
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
${gameState.suspects.map(s => `${s.name} - Suspicion: ${s.suspicionScore}`).join('\n')}`);
}

window.toggleDevMode = function() {
    localStorage.removeItem('guiltyDevMode');
    window.location.href = window.location.pathname; // Reload without params
}

window.saveDevNotes = function() {
    const notes = document.getElementById('devNotes').value;
    const scenarioNotes = JSON.parse(localStorage.getItem('guiltyScenarioNotes') || '{}');
    scenarioNotes[currentCrime.id] = {
        notes,
        timestamp: new Date().toISOString(),
        difficulty: gameState.difficulty
    };
    localStorage.setItem('guiltyScenarioNotes', JSON.stringify(scenarioNotes));
    
    // Show saved indicator
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Saved!';
    button.style.background = '#4CAF50';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

function resetGameForNewScenario() {
    // Reset game state
    gameState.guesses = [];
    gameState.currentGuess = 0;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.startTime = null;
    gameState.elapsedTime = 0;
    gameState.eliminatedSuspects = new Set();  // Clear eliminations
    
    // Clear UI
    stopTimer();
    document.getElementById('timerDisplay').textContent = 'Time: 0:00';
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('suspectsSection').style.display = 'block';
    
    // Remove any hints
    const hint = document.querySelector('.crime-hint');
    if (hint) hint.remove();
    
    // Generate new suspects for this scenario
    const seed = gameState.devMode ? Math.random() * 10000 : getDailySeed();
    
    // Generate logical suspects
    const allSuspects = generateSuspects(seed, currentCrime);
    
    // Pick culprit from all suspects (random)
    const culpritIndex = Math.floor(seededRandom(seed) * allSuspects.length);
    gameState.culprit = allSuspects[culpritIndex];
    
    // Ensure culprit has ALL traits (no missing information)
    const allTraitKeys = Object.keys(getTraitCategories(currentCrime));
    allTraitKeys.forEach(key => {
        if (gameState.culprit[key] === undefined) {
            // Assign a trait value for the culprit
            const traitValues = currentCrime.traits[key];
            gameState.culprit[key] = traitValues[Math.floor(seededRandom(seed + key.charCodeAt(0) * 100) * traitValues.length)];
        }
    });
    
    // Determine which traits will be green for the initial suspect
    const traitKeys = Object.keys(getTraitCategories(currentCrime));
    let greenCount;
    if (gameState.difficulty === 'easy') {
        greenCount = 2;
    } else if (gameState.difficulty === 'medium') {
        greenCount = 1;
    } else {
        greenCount = 1;
    }
    
    // Randomly select which traits will be green
    const shuffledTraits = [...traitKeys].sort(() => seededRandom(seed + 1000) - 0.5);
    const greenTraits = shuffledTraits.slice(0, greenCount);
    
    // Ensure multiple suspects share the culprit's green traits
    allSuspects.forEach((suspect, index) => {
        if (index !== culpritIndex) {
            // 40% chance for other suspects to share green traits
            if (seededRandom(seed + index * 100) > 0.6) {
                greenTraits.forEach(trait => {
                    suspect[trait] = gameState.culprit[trait];
                });
            }
        }
    });
    
    // Generate initial suspect based on culprit
    gameState.initialSuspect = generateInitialSuspect(gameState.culprit, gameState.difficulty, seed, greenTraits);
    
    // Select all 10 suspects (including culprit)
    gameState.suspects = [...allSuspects];
    
    // Shuffle suspects
    gameState.suspects.sort(() => seededRandom(seed + 100) - 0.5);
    
    if (gameState.devMode) {
        document.getElementById('devCulpritInfo').textContent = `${gameState.culprit.name} (${gameState.culprit.job})`;
        
        // Load previous notes if any
        const scenarioNotes = JSON.parse(localStorage.getItem('guiltyScenarioNotes') || '{}');
        if (scenarioNotes[currentCrime.id]) {
            document.getElementById('devNotes').value = scenarioNotes[currentCrime.id].notes;
        } else {
            document.getElementById('devNotes').value = '';
        }
    }
    
    // Display initial suspect
    displayInitialSuspect();
    
    displaySuspects();
    updateGuessCounter();
    
    // Start timer on first load
    if (!gameState.startTime) {
        startTimer();
    }
}

// Initialize the game
async function initGame() {
    const seed = getDailySeed();
    
    // Determine which crime scenario to use
    let crimeIndex;
    if (gameState.devMode) {
        crimeIndex = gameState.currentScenarioIndex;
    } else {
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        crimeIndex = dayOfYear % CRIME_SCENARIOS.length;
    }
    currentCrime = CRIME_SCENARIOS[crimeIndex];
    
    // Display crime info
    const period = getPuzzlePeriod();
    const estTime = getESTTime();
    const dateStr = estTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('crimeTitle').textContent = `${dateStr} ${period} Crime: ${currentCrime.title}`;
    document.getElementById('crimeDescription').textContent = currentCrime.description;
    
    // Load stats
    loadStats();
    
    // Check for first-time player
    checkFirstTimePlayer();
    
    // Generate logical suspects
    const allSuspects = generateSuspects(seed, currentCrime);
    
    // Pick culprit from all suspects (random)
    const culpritIndex = Math.floor(seededRandom(seed) * allSuspects.length);
    gameState.culprit = allSuspects[culpritIndex];
    
    // Ensure culprit has ALL traits (no missing information)
    const allTraitKeys = Object.keys(getTraitCategories(currentCrime));
    allTraitKeys.forEach(key => {
        if (gameState.culprit[key] === undefined) {
            // Assign a trait value for the culprit
            const traitValues = currentCrime.traits[key];
            gameState.culprit[key] = traitValues[Math.floor(seededRandom(seed + key.charCodeAt(0) * 100) * traitValues.length)];
        }
    });
    
    // Determine which traits will be green for the initial suspect
    const traitKeys = Object.keys(getTraitCategories(currentCrime));
    let greenCount;
    if (gameState.difficulty === 'easy') {
        greenCount = 2;
    } else if (gameState.difficulty === 'medium') {
        greenCount = 1;
    } else {
        greenCount = 1;
    }
    
    // Randomly select which traits will be green
    const shuffledTraits = [...traitKeys].sort(() => seededRandom(seed + 1000) - 0.5);
    const greenTraits = shuffledTraits.slice(0, greenCount);
    
    // Ensure multiple suspects share the culprit's green traits
    allSuspects.forEach((suspect, index) => {
        if (index !== culpritIndex) {
            // 40% chance for other suspects to share green traits
            if (seededRandom(seed + index * 100) > 0.6) {
                greenTraits.forEach(trait => {
                    suspect[trait] = gameState.culprit[trait];
                });
            }
        }
    });
    
    // Generate initial suspect based on culprit
    gameState.initialSuspect = generateInitialSuspect(gameState.culprit, gameState.difficulty, seed, greenTraits);
    
    // Select all 10 suspects (including culprit)
    gameState.suspects = [...allSuspects];
    
    // Shuffle suspects
    gameState.suspects.sort(() => seededRandom(seed + 100) - 0.5);
    
    if (gameState.devMode) {
        document.getElementById('devCulpritInfo').textContent = `${gameState.culprit.name} (${gameState.culprit.job})`;
        
        // Load previous notes if any
        const scenarioNotes = JSON.parse(localStorage.getItem('guiltyScenarioNotes') || '{}');
        if (scenarioNotes[currentCrime.id]) {
            document.getElementById('devNotes').value = scenarioNotes[currentCrime.id].notes;
        } else {
            document.getElementById('devNotes').value = '';
        }
    }
    
    // Display initial suspect
    displayInitialSuspect();
    
    displaySuspects();
    updateGuessCounter();
    
    // Start timer on first load
    if (!gameState.startTime) {
        startTimer();
    }
}

// Display suspects with detailed info
function displaySuspects() {
    const grid = document.getElementById('suspectsGrid');
    grid.innerHTML = '';
    
    const traitCategories = getTraitCategories(currentCrime);
    const traitKeys = Object.keys(traitCategories);
    
    gameState.suspects.forEach((suspect, index) => {
        const card = document.createElement('div');
        card.className = 'suspect-card-v2';
        
        // Check if already guessed
        const isGuessed = gameState.guesses.some(g => g.name === suspect.name);
        const isEliminated = gameState.eliminatedSuspects.has(suspect.name);
        
        if (isGuessed) {
            card.classList.add('disabled');
        } else if (isEliminated) {
            card.classList.add('eliminated');
        }
        
        // Remove old click handlers
        card.onclick = null;
        card.oncontextmenu = null;
        
        // Add processing class if currently processing
        if (gameState.isProcessingGuess) {
            card.classList.add('processing');
        }
        
        // Build trait HTML dynamically
        let traitsHTML = '';
        traitKeys.forEach(key => {
            const traitValue = suspect[key];
            const displayValue = traitValue !== undefined ? traitValue : '?';
            const valueClass = traitValue === undefined ? 'unknown-value' : '';
            
            traitsHTML += `
                <div class="trait-item">
                    <span class="trait-label">${traitCategories[key].name}:</span>
                    <span class="trait-value ${valueClass}">${displayValue}</span>
                </div>
            `;
        });
        
        // Add elimination indicator
        const eliminationIndicator = isEliminated ? '<div class="elimination-mark">✕</div>' : '';
        
        // Create action buttons
        const accuseDisabled = isGuessed || gameState.isProcessingGuess || gameState.gameOver ? 'disabled' : '';
        const exonerateDisabled = isGuessed || gameState.gameOver ? 'disabled' : '';
        const exonerateText = isEliminated ? 'Restore' : 'Exonerate';
        
        card.innerHTML = `
            ${eliminationIndicator}
            <div class="suspect-header">
                <div class="suspect-name">${suspect.name}</div>
                <div class="suspect-job">${suspect.job}</div>
            </div>
            <div class="suspect-traits">
                ${traitsHTML}
            </div>
            <div class="suspect-actions">
                <button class="suspect-button accuse-button" ${accuseDisabled} onclick="makeGuess(${index})">
                    Accuse
                </button>
                <button class="suspect-button exonerate-button" ${exonerateDisabled} onclick="toggleEliminationButton('${suspect.name}')">
                    ${exonerateText}
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Update guess counter
function updateGuessCounter() {
    const maxGuesses = DIFFICULTY_SETTINGS[gameState.difficulty].maxGuesses;
    let counterDiv = document.getElementById('guessCounter');
    
    if (!counterDiv) {
        counterDiv = document.createElement('div');
        counterDiv.id = 'guessCounter';
        counterDiv.className = 'guess-counter';
        document.querySelector('.crime-box').after(counterDiv);
    }
    
    counterDiv.textContent = `Guesses: ${gameState.currentGuess}/${maxGuesses}`;
}

// Make a guess
async function makeGuess(suspectIndex) {
    const maxGuesses = DIFFICULTY_SETTINGS[gameState.difficulty].maxGuesses;
    if (gameState.gameOver || gameState.currentGuess >= maxGuesses || gameState.isProcessingGuess) return;
    
    // Prevent double-clicks
    gameState.isProcessingGuess = true;
    
    const suspect = gameState.suspects[suspectIndex];
    
    // Check if already guessed this suspect
    if (gameState.guesses.some(g => g.name === suspect.name)) {
        gameState.isProcessingGuess = false;
        return;
    }
    
    gameState.guesses.push(suspect);
    gameState.currentGuess++;
    
    // Add guess to board
    displayGuess(suspect);
    
    // Check if won
    if (suspect.name === gameState.culprit.name) {
        endGame(true);
    } else if (gameState.currentGuess >= maxGuesses) {
        endGame(false);
    }
    
    // Update displays
    displaySuspects();
    updateGuessCounter();
    
    // Re-enable clicking after a short delay
    setTimeout(() => {
        gameState.isProcessingGuess = false;
        displaySuspects(); // Redraw suspects to remove processing class
    }, 500);
}

// Display guess with improved feedback
function displayGuess(suspect) {
    const board = document.getElementById('gameBoard');
    const row = document.createElement('div');
    row.className = 'guess-row-v2';
    
    const traitCategories = getTraitCategories(currentCrime);
    const traitKeys = Object.keys(traitCategories);
    
    // Build feedback HTML dynamically - check ALL trait categories
    let feedbackHTML = '';
    traitKeys.forEach(key => {
        // Create feedback for this trait (even if suspect doesn't have it)
        feedbackHTML += createTraitFeedback(key, suspect[key]);
    });
    
    // Create the guess display
    const html = `
        <div class="guess-suspect">
            <div class="guess-name">${suspect.name}</div>
            <div class="guess-job">${suspect.job}</div>
        </div>
        <div class="guess-feedback">
            ${feedbackHTML}
        </div>
    `;
    
    row.innerHTML = html;
    board.appendChild(row);
    
    // Animate feedback
    setTimeout(() => {
        row.querySelectorAll('.trait-feedback').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, i * 100);
        });
    }, 100);
}

// Create trait feedback element
function createTraitFeedback(traitKey, value) {
    const currentTraitCategories = getTraitCategories(currentCrime);
    const category = currentTraitCategories[traitKey];
    
    // Handle missing information
    if (value === undefined) {
        return `
            <div class="trait-feedback unknown" title="${category.name}">
                <div class="trait-feedback-label">${category.name}</div>
                <div class="trait-feedback-value">?</div>
                <div class="trait-feedback-hint">No info</div>
            </div>
        `;
    }
    
    const feedback = getFeedbackForTrait(value, gameState.culprit[traitKey], traitKey);
    
    // Add arrows for close guesses in easy mode
    let arrow = '';
    if (gameState.difficulty === 'easy' && feedback === 'close') {
        const traitArray = currentCrime.traits[traitKey];
        if (traitArray) {
            const guessPosition = traitArray.indexOf(value);
            const culpritPosition = traitArray.indexOf(gameState.culprit[traitKey]);
            arrow = guessPosition < culpritPosition ? '→' : '←';
        }
    }
    
    return `
        <div class="trait-feedback ${feedback}" title="${category.name}">
            <div class="trait-feedback-label">${category.name}</div>
            <div class="trait-feedback-value">${value} ${arrow}</div>
            ${feedback === 'close' ? '<div class="trait-feedback-hint">Close!</div>' : ''}
        </div>
    `;
}

// End game
function endGame(won) {
    gameState.gameOver = true;
    gameState.won = won;
    
    stopTimer();
    updateStats(won);
    
    const gameOverDiv = document.getElementById('gameOver');
    const titleElement = document.getElementById('gameOverTitle');
    const messageElement = document.getElementById('gameOverMessage');
    
    const timeInSeconds = Math.floor(gameState.elapsedTime / 1000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (won) {
        gameOverDiv.className = 'game-over won';
        titleElement.textContent = 'GUILTY!';
        messageElement.textContent = `You found the culprit in ${gameState.currentGuess}/${DIFFICULTY_SETTINGS[gameState.difficulty].maxGuesses} guesses! Time: ${timeString}`;
    } else {
        gameOverDiv.className = 'game-over lost';
        titleElement.textContent = 'ESCAPED!';
        messageElement.innerHTML = `
            The culprit was <strong>${gameState.culprit.name}</strong> (${gameState.culprit.job})<br>
            <div class="culprit-reveal">
                Key traits: ${gameState.culprit.access} access, ${gameState.culprit.timing} alibi, ${gameState.culprit.knowledge} security knowledge
            </div>
            <div style="margin-top: 10px; color: #888;">Time: ${timeString}</div>
        `;
    }
    
    gameOverDiv.style.display = 'block';
    document.getElementById('suspectsSection').style.display = 'none';
}

// Reset game
function resetGame() {
    gameState.guesses = [];
    gameState.currentGuess = 0;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.startTime = null;
    gameState.elapsedTime = 0;
    gameState.initialSuspect = null;
    gameState.eliminatedSuspects = new Set();  // Clear eliminations
    
    stopTimer();
    document.getElementById('timerDisplay').textContent = 'Time: 0:00';
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('suspectsSection').style.display = 'block';
    
    // Remove initial suspect display
    const initialDiv = document.getElementById('initialSuspect');
    if (initialDiv) initialDiv.remove();
    
    initGame();
}

// Share results
function shareResults() {
    const difficulty = DIFFICULTY_SETTINGS[gameState.difficulty].name;
    let shareText = `GUILTY ${getDailySeed()} (${difficulty})\n\n`;
    
    if (gameState.won) {
        shareText += `Solved in ${gameState.currentGuess}/${DIFFICULTY_SETTINGS[gameState.difficulty].maxGuesses}!\n\n`;
    } else {
        shareText += `Failed ${gameState.currentGuess}/${DIFFICULTY_SETTINGS[gameState.difficulty].maxGuesses}\n\n`;
    }
    
    // Create visual grid
    const traitKeys = Object.keys(getTraitCategories(currentCrime));
    gameState.guesses.forEach(guess => {
        traitKeys.forEach(trait => {
            if (guess[trait] !== undefined && gameState.culprit[trait] !== undefined) {
                const feedback = getFeedbackForTrait(guess[trait], gameState.culprit[trait], trait);
                if (feedback === 'correct') shareText += '🟩';
                else if (feedback === 'close') shareText += '🟨';
                else shareText += '⬜';
            }
        });
        shareText += '\n';
    });
    
    shareText += '\nPlay at: ' + window.location.href;
    
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
    lastPlayDate: null,
    difficultyStats: {
        easy: { played: 0, won: 0 },
        medium: { played: 0, won: 0 },
        hard: { played: 0, won: 0 }
    }
};

function loadStats() {
    const saved = localStorage.getItem('guiltyStatsV2');
    if (saved) {
        playerStats = JSON.parse(saved);
    }
    updateStreakDisplay();
}

function saveStats() {
    localStorage.setItem('guiltyStatsV2', JSON.stringify(playerStats));
}

function updateStats(won) {
    const today = getDailySeed();
    
    // Check if this is a new day
    if (playerStats.lastPlayDate !== today) {
        playerStats.gamesPlayed++;
        playerStats.difficultyStats[gameState.difficulty].played++;
        
        // Check if streak should continue
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdaySeed = yesterday.toISOString().split('T')[0];
        
        if (won) {
            playerStats.gamesWon++;
            playerStats.difficultyStats[gameState.difficulty].won++;
            
            // Update streak
            if (playerStats.lastPlayDate === yesterdaySeed) {
                // Played yesterday, continue streak
                playerStats.currentStreak++;
            } else if (!playerStats.lastPlayDate) {
                // First time playing
                playerStats.currentStreak = 1;
            } else {
                // Missed a day, restart streak
                playerStats.currentStreak = 1;
            }
            
            if (playerStats.currentStreak > playerStats.maxStreak) {
                playerStats.maxStreak = playerStats.currentStreak;
            }
        } else {
            // Lost the game, break the streak
            playerStats.currentStreak = 0;
        }
        
        playerStats.lastPlayDate = today;
        saveStats();
        updateStreakDisplay();
    }
}

function updateStreakDisplay() {
    const streakDisplay = document.getElementById('streakDisplay');
    const streakNumber = document.getElementById('streakNumber');
    
    if (playerStats.currentStreak > 0) {
        streakDisplay.classList.remove('no-streak');
        streakNumber.textContent = playerStats.currentStreak;
    } else {
        streakDisplay.classList.add('no-streak');
        streakNumber.textContent = '0';
    }
}

function showStats() {
    const modal = document.getElementById('statsModal');
    const display = document.getElementById('statsDisplay');
    
    const overallWinRate = playerStats.gamesPlayed > 0 
        ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) 
        : 0;
    
    // Calculate difficulty-specific stats
    let difficultyHTML = '';
    ['easy', 'medium', 'hard'].forEach(diff => {
        const stats = playerStats.difficultyStats[diff];
        const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
        difficultyHTML += `
            <div class="stat-item">
                <span class="stat-label">${diff.charAt(0).toUpperCase() + diff.slice(1)} Win Rate</span>
                <span class="stat-value">${winRate}% (${stats.played} played)</span>
            </div>
        `;
    });
    
    display.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Games Played</span>
            <span class="stat-value">${playerStats.gamesPlayed}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Overall Win Rate</span>
            <span class="stat-value">${overallWinRate}%</span>
        </div>
        ${difficultyHTML}
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

function hideStats() {
    document.getElementById('statsModal').style.display = 'none';
}

// Show trait reference
function showReference() {
    const modal = document.getElementById('referenceModal');
    const display = document.getElementById('referenceDisplay');
    
    const traitCategories = getTraitCategories(currentCrime);
    
    let html = `
        <div class="reference-legend">
            <div class="reference-legend-title">Understanding Trait Relationships</div>
            <div class="reference-description">
                Each trait has 5 possible values arranged on a scale. Values that are next to each other 
                on the scale are considered "close" matches. The game will tell you if your guess is an 
                exact match, close (adjacent on the scale), or not close.
            </div>
        </div>
        <div class="reference-table">
    `;
    
    // For each trait category
    Object.entries(traitCategories).forEach(([key, category]) => {
        html += `
            <div class="reference-trait">
                <div class="reference-trait-title">${category.name}</div>
                <div class="reference-scale-container">
                    <div class="reference-scale-line"></div>
                    <div class="reference-scale-connector"></div>
                    <div class="reference-values-scale">
        `;
        
        // Get exactly 5 values in order from the trait array
        const traitArray = currentCrime.traits[key];
        if (!traitArray || traitArray.length !== 5) {
            console.warn(`Trait ${key} does not have exactly 5 values:`, traitArray);
        }
        
        // Map the trait array values to their data
        const allValues = traitArray.map(value => ({
            value,
            hint: category.values[value] ? category.values[value].hint : ''
        }));
        
        // Display exactly 5 values as a scale with dots
        allValues.forEach((item, index) => {
            const position = (index / 4) * 100; // Spread across 0-100%
            const isFirst = index === 0;
            const isLast = index === 4;
            
            html += `
                <div class="reference-scale-item" style="left: ${position}%;">
                    <div class="reference-scale-dot ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}"></div>
                    <div class="reference-scale-label" title="${item.hint}">${item.value}</div>
                </div>
            `;
            
            // Add proximity indicator between values (not on the last one)
            if (index < 4) {
                const nextPosition = ((index + 1) / 4) * 100;
                const midPosition = (position + nextPosition) / 2;
                html += `
                    <div class="reference-proximity-arrow" style="left: ${midPosition}%;">
                        ↔
                    </div>
                `;
            }
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    display.innerHTML = html;
    modal.style.display = 'flex';
}

function hideReference() {
    document.getElementById('referenceModal').style.display = 'none';
}

// Tutorial functions
function showTutorial() {
    document.getElementById('tutorialModal').style.display = 'flex';
}

function hideTutorial() {
    document.getElementById('tutorialModal').style.display = 'none';
    localStorage.setItem('guiltyTutorialSeen', 'true');
}

// Check if first time player
function checkFirstTimePlayer() {
    const tutorialSeen = localStorage.getItem('guiltyTutorialSeen');
    if (!tutorialSeen) {
        // Show tutorial for first-time players
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
}

// Toggle elimination with button (wrapper function for onclick)
function toggleEliminationButton(suspectName) {
    toggleElimination(suspectName);
    displaySuspects();
}

// Make functions global
window.shareResults = shareResults;
window.showStats = showStats;
window.hideStats = hideStats;
window.showReference = showReference;
window.hideReference = hideReference;
window.showTutorial = showTutorial;
window.hideTutorial = hideTutorial;
window.resetGame = resetGame;
window.getFeedbackForTrait = getFeedbackForTrait;
window.makeGuess = makeGuess;
window.toggleEliminationButton = toggleEliminationButton;

// Generate initial suspect based on culprit and difficulty
function generateInitialSuspect(culprit, difficulty, seed, predeterminedGreenTraits = null) {
    const traitKeys = Object.keys(getTraitCategories(currentCrime));
    
    // Determine how many traits should match (green), be close (yellow), or be wrong (gray)
    let greenCount, yellowCount;
    
    if (difficulty === 'easy') {
        greenCount = 2;  // 2 exact matches
        yellowCount = 3; // 3 close matches
        // 5 wrong - still challenging but more clues
    } else if (difficulty === 'medium') {
        greenCount = 1;  // 1 exact match
        yellowCount = 2; // 2 close matches
        // 7 wrong - harder to narrow down
    } else {
        greenCount = 1;  // 1 exact match
        yellowCount = 1; // 1 close match
        // 8 wrong - very difficult
    }
    
    // Use predetermined green traits or randomly decide
    let greenTraits, yellowTraits, grayTraits;
    if (predeterminedGreenTraits) {
        greenTraits = predeterminedGreenTraits;
        const remainingTraits = traitKeys.filter(t => !greenTraits.includes(t));
        const shuffledRemaining = [...remainingTraits].sort(() => seededRandom(seed + 1001) - 0.5);
        yellowTraits = shuffledRemaining.slice(0, yellowCount);
        grayTraits = shuffledRemaining.slice(yellowCount);
    } else {
        const shuffledTraits = [...traitKeys].sort(() => seededRandom(seed + 1000) - 0.5);
        greenTraits = shuffledTraits.slice(0, greenCount);
        yellowTraits = shuffledTraits.slice(greenCount, greenCount + yellowCount);
        grayTraits = shuffledTraits.slice(greenCount + yellowCount);
    }
    
    // Create the initial suspect
    const initialSuspect = {
        name: "Initial Suspect (Not Guilty)",
        job: "Reference Profile",
        suspicionScore: 0
    };
    
    // Get trait categories for current crime
    const traitCategories = getTraitCategories(currentCrime);
    
    // Assign traits
    traitKeys.forEach(trait => {
        if (greenTraits.includes(trait)) {
            // Exact match
            initialSuspect[trait] = culprit[trait];
        } else if (yellowTraits.includes(trait)) {
            // Close match - find a value within 1 suspicion level
            const culpritValue = culprit[trait];
            const category = traitCategories[trait];
            if (category && category.values[culpritValue]) {
                const culpritSuspicion = category.values[culpritValue].suspicion;
                const possibleValues = Object.entries(category.values)
                    .filter(([value, data]) => {
                        const diff = Math.abs(data.suspicion - culpritSuspicion);
                        return diff === 1 && value !== culpritValue;
                    })
                    .map(([value]) => value);
                
                if (possibleValues.length > 0) {
                    initialSuspect[trait] = possibleValues[Math.floor(seededRandom(seed + trait.charCodeAt(0)) * possibleValues.length)];
                } else {
                    // If no close values, pick a different value
                    const allValues = Object.keys(category.values).filter(v => v !== culpritValue);
                    initialSuspect[trait] = allValues[Math.floor(seededRandom(seed + trait.charCodeAt(0)) * allValues.length)];
                }
            } else {
                initialSuspect[trait] = culprit[trait];
            }
        } else {
            // Gray - wrong value (not close)
            const culpritValue = culprit[trait];
            const category = traitCategories[trait];
            if (category && category.values[culpritValue]) {
                const culpritSuspicion = category.values[culpritValue].suspicion;
                const possibleValues = Object.entries(category.values)
                    .filter(([value, data]) => {
                        const diff = Math.abs(data.suspicion - culpritSuspicion);
                        return diff > 1 && value !== culpritValue;
                    })
                    .map(([value]) => value);
                
                if (possibleValues.length > 0) {
                    initialSuspect[trait] = possibleValues[Math.floor(seededRandom(seed + trait.charCodeAt(0) * 2) * possibleValues.length)];
                } else {
                    // If no far values, pick any different value
                    const allValues = Object.keys(category.values).filter(v => v !== culpritValue);
                    initialSuspect[trait] = allValues[Math.floor(seededRandom(seed + trait.charCodeAt(0) * 2) * allValues.length)];
                }
            } else {
                initialSuspect[trait] = culprit[trait];
            }
        }
    });
    
    return initialSuspect;
}

// Generate trait guide HTML (reusable)
function generateTraitGuideHTML() {
    const traitCategories = getTraitCategories(currentCrime);
    
    let html = `
        <div class="trait-guide-section">
            <div class="trait-guide-header">
                <h4>Trait Value Reference</h4>
                <p class="trait-guide-note">Adjacent values (↔) are considered "close" matches</p>
            </div>
            <div class="trait-guide-content">
    `;
    
    // For each trait category
    Object.entries(traitCategories).forEach(([key, category]) => {
        html += `
            <div class="trait-guide-item">
                <div class="trait-guide-title">${category.name}</div>
                <div class="trait-scale-container">
                    <div class="trait-scale-line"></div>
                    <div class="trait-scale-connector"></div>
                    <div class="trait-values-scale">
        `;
        
        // Get exactly 5 values in order from the trait array
        const traitArray = currentCrime.traits[key];
        if (!traitArray || traitArray.length !== 5) {
            console.warn(`Trait ${key} does not have exactly 5 values:`, traitArray);
        }
        
        // Map the trait array values to their data
        const allValues = traitArray.map(value => ({
            value,
            hint: category.values[value] ? category.values[value].hint : ''
        }));
        
        // Display exactly 5 values as a scale with dots
        allValues.forEach((item, index) => {
            const position = (index / 4) * 100; // Spread across 0-100%
            const isFirst = index === 0;
            const isLast = index === 4;
            
            html += `
                <div class="trait-scale-item" style="left: ${position}%;">
                    <div class="trait-scale-dot ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}"></div>
                    <div class="trait-scale-label" title="${item.hint}">${item.value}</div>
                </div>
            `;
            
            // Add proximity indicator between values (not on the last one)
            if (index < 4) {
                const nextPosition = ((index + 1) / 4) * 100;
                const midPosition = (position + nextPosition) / 2;
                html += `
                    <div class="trait-proximity-arrow" style="left: ${midPosition}%;">
                        ↔
                    </div>
                `;
            }
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    return html;
}

// Display initial suspect with colored trait indicators
function displayInitialSuspect() {
    const existingDiv = document.getElementById('initialSuspect');
    if (existingDiv) existingDiv.remove();
    
    const initialDiv = document.createElement('div');
    initialDiv.id = 'initialSuspect';
    initialDiv.className = 'initial-suspect-section';
    
    const traitCategories = getTraitCategories(currentCrime);
    const traitKeys = Object.keys(traitCategories);
    
    // Compare initial suspect to culprit to show colors
    let traitHTML = '';
    traitKeys.forEach(trait => {
        if (gameState.initialSuspect[trait] !== undefined) {
            const feedback = getFeedbackForTrait(gameState.initialSuspect[trait], gameState.culprit[trait], trait);
            const colorClass = feedback === 'correct' ? 'green' : feedback === 'close' ? 'yellow' : 'gray';
            
            traitHTML += `
                <div class="initial-trait ${colorClass}">
                    <div class="initial-trait-label">${traitCategories[trait].name}</div>
                    <div class="initial-trait-value">${gameState.initialSuspect[trait]}</div>
                </div>
            `;
        }
    });
    
    initialDiv.innerHTML = `
        <div class="initial-suspect-header">
            <h3>Initial Suspect Profile</h3>
            <p class="initial-suspect-note">This person is NOT guilty. Find who shares these trait patterns:</p>
        </div>
        <div class="initial-suspect-traits">
            ${traitHTML}
        </div>
        <div class="color-legend">
            <span class="legend-item"><span class="color-box green"></span> = Exact match with culprit</span>
            <span class="legend-item"><span class="color-box yellow"></span> = Close to culprit</span>
            <span class="legend-item"><span class="color-box gray"></span> = Different from culprit</span>
        </div>
        ${generateTraitGuideHTML()}
    `;
    
    // Insert after crime box
    document.querySelector('.crime-box').after(initialDiv);
}
  