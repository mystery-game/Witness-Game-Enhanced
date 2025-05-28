// GUILTY v6 - Enhanced Security, Difficulty, and Performance

// Game manager using closure to hide sensitive data
const GameManager = (function() {
    // Private game state - not accessible from console
    let privateState = {
        culprit: null,
        suspects: [],
        initialSuspect: null,
        gameSecret: 'guilty-' + Math.random().toString(36).substring(7), // Random secret per session
        sessionId: null
    };
    
    // Public game state
    let publicState = {
        difficulty: 'medium',
        guesses: [],
        currentGuess: 0,
        gameOver: false,
        won: false,
        devMode: false,
        currentScenarioIndex: 0,
        isProcessingGuess: false,
        startTime: null,
        timerInterval: null,
        elapsedTime: 0,
        eliminatedSuspects: new Set(),
        betaMode: false,
        viableSuspectsCount: 16,
        confidenceLevel: 0
    };
    
    // Enhanced difficulty settings with better balance
    const DIFFICULTY_SETTINGS = {
        easy: {
            maxGuesses: 8,
            name: 'Easy',
            minViableSuspects: 10,
            minSecondGuessViable: 5,
            yellowTraits: 3, // More yellow traits for easier deduction
            missingTraitChance: 0.15, // Less missing info
            distributionStrategy: {
                matchInitialYellow: 45,  // More suspects match initial
                otherYellow: 25,
                matchCulprit: 20,
                farValue: 10
            }
        },
        medium: {
            maxGuesses: 6,
            name: 'Medium',
            minViableSuspects: 12,
            minSecondGuessViable: 7,
            yellowTraits: 2,
            missingTraitChance: 0.25,
            distributionStrategy: {
                matchInitialYellow: 40,
                otherYellow: 20,
                matchCulprit: 25,
                farValue: 15
            }
        },
        hard: {
            maxGuesses: 4,
            name: 'Hard',
            minViableSuspects: 14,
            minSecondGuessViable: 9,
            yellowTraits: 1,
            missingTraitChance: 0.35,
            distributionStrategy: {
                matchInitialYellow: 35,
                otherYellow: 15,
                matchCulprit: 30,
                farValue: 20
            }
        }
    };
    
    // Crime scenarios with enhanced themes
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
                behavior: ['Suspicious', 'Nervous', 'Changed', 'Normal', 'Helpful']
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
                { title: "Private Collector", access: "VIP", knowledge: "Basic" },
                { title: "Museum Administrator", access: "Staff", knowledge: "Basic" },
                { title: "Restoration Expert", access: "Contractor", knowledge: "Limited" },
                { title: "Insurance Investigator", access: "VIP", knowledge: "Familiar" },
                { title: "Archaeologist", access: "VIP", knowledge: "None" },
                { title: "Gift Shop Employee", access: "Staff", knowledge: "Limited" },
                { title: "Delivery Driver", access: "Contractor", knowledge: "None" }
            ]
        },
        {
            id: 'tech_breach',
            title: "The Research Lab Data Theft",
            description: "Someone copied confidential AI research data from TechCorp's lab. The breach occurred at 11:47 PM using valid credentials. The stolen data could be worth millions.",
            setting: 'tech_company',
            traits: {
                access: ['Admin', 'Developer', 'Employee', 'Contractor', 'None'],
                timing: ['Online', 'Office', 'Home', 'Logged', 'Offline'],
                knowledge: ['Expert', 'Advanced', 'Basic', 'Limited', 'None'],
                motive: ['Profit', 'Competition', 'Whistleblowing', 'Curiosity', 'None'],
                behavior: ['Paranoid', 'Defensive', 'Evasive', 'Normal', 'Cooperative']
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
                { title: "QA Tester", access: "Developer", knowledge: "Basic" },
                { title: "Network Engineer", access: "Admin", knowledge: "Expert" },
                { title: "DevOps Engineer", access: "Developer", knowledge: "Advanced" },
                { title: "Technical Writer", access: "Employee", knowledge: "Limited" },
                { title: "Compliance Officer", access: "Employee", knowledge: "Basic" },
                { title: "Remote Contractor", access: "Contractor", knowledge: "Advanced" },
                { title: "UI Designer", access: "Developer", knowledge: "Limited" }
            ]
        },
        {
            id: 'recipe_theft',
            title: "The Secret Recipe Theft",
            description: "The famous century-old recipe for 'Grandma's Miracle Cookies' was stolen from the company vault. The thief struck during the evening shift change at 7:45 PM. Competitors would pay handsomely for this formula.",
            setting: 'bakery',
            traits: {
                access: ['Kitchen', 'Office', 'Delivery', 'Limited', 'None'],
                timing: ['Working', 'Break', 'Meeting', 'Documented', 'Absent'],
                knowledge: ['Expert', 'Professional', 'Amateur', 'Basic', 'None'],
                motive: ['Competition', 'Money', 'Recognition', 'Curiosity', 'None'],
                behavior: ['Agitated', 'Guilty', 'Shocked', 'Helpful', 'Calm']
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
                { title: "Marketing Director", access: "Office", knowledge: "Basic" },
                { title: "Night Baker", access: "Kitchen", knowledge: "Professional" },
                { title: "Kitchen Assistant", access: "Kitchen", knowledge: "Amateur" },
                { title: "Food Blogger", access: "Limited", knowledge: "Amateur" },
                { title: "Supply Manager", access: "Delivery", knowledge: "Basic" },
                { title: "Franchise Owner", access: "Office", knowledge: "Basic" },
                { title: "Evening Supervisor", access: "Kitchen", knowledge: "Professional" }
            ]
        },
        {
            id: 'restaurant_poisoning',
            title: "The Five-Star Poisoning",
            description: "Celebrity chef Marcus Beaumont collapsed during dinner service at Le Jardin. A rare poison was found in his wine glass. Only those with kitchen access between 7-8 PM could have done it.",
            setting: 'restaurant',
            traits: {
                access: ['Kitchen', 'Service', 'VIP', 'Limited', 'None'],
                timing: ['Working', 'Break', 'Dining', 'Documented', 'Absent'],
                knowledge: ['Expert', 'Professional', 'Amateur', 'Basic', 'None'],
                motive: ['Jealousy', 'Revenge', 'Inheritance', 'Competition', 'None'],
                behavior: ['Agitated', 'Guilty', 'Shocked', 'Helpful', 'Calm']
            },
            suspectJobs: [
                { title: "Sous Chef", access: "Kitchen", knowledge: "Expert" },
                { title: "Line Cook", access: "Kitchen", knowledge: "Professional" },
                { title: "Sommelier", access: "Service", knowledge: "Professional" },
                { title: "Restaurant Owner", access: "Kitchen", knowledge: "Amateur" },
                { title: "Food Critic", access: "VIP", knowledge: "Amateur" },
                { title: "Ex-Business Partner", access: "Limited", knowledge: "Basic" },
                { title: "Apprentice Chef", access: "Kitchen", knowledge: "Professional" },
                { title: "Head Waiter", access: "Service", knowledge: "Basic" },
                { title: "Celebrity Guest", access: "VIP", knowledge: "None" },
                { title: "Rival Chef", access: "None", knowledge: "Expert" },
                { title: "Prep Cook", access: "Kitchen", knowledge: "Amateur" },
                { title: "Bartender", access: "Service", knowledge: "Basic" },
                { title: "Kitchen Manager", access: "Kitchen", knowledge: "Professional" },
                { title: "Wine Supplier", access: "Limited", knowledge: "None" },
                { title: "Health Inspector", access: "VIP", knowledge: "Basic" },
                { title: "Pastry Chef", access: "Kitchen", knowledge: "Amateur" }
            ]
        },
        {
            id: 'underwater_mystery',
            title: "The Sunken Treasure Sabotage",
            description: "A priceless artifact vanished from the deep-sea research base. Only those with access to the submersible bay could have done it. The theft occurred during a bioluminescent blackout.",
            setting: 'underwater',
            traits: {
                access: ['Diver', 'Scientist', 'Technician', 'Visitor', 'None'],
                timing: ['On Duty', 'Resting', 'Exploring', 'Logged', 'Missing'],
                knowledge: ['Marine Expert', 'Engineer', 'Biologist', 'Basic', 'None'],
                motive: ['Discovery', 'Profit', 'Sabotage', 'Curiosity', 'None'],
                behavior: ['Secretive', 'Nervous', 'Calm', 'Helpful', 'Absent']
            },
            suspectJobs: [
                { title: "Lead Diver", access: "Diver", knowledge: "Marine Expert" },
                { title: "Marine Biologist", access: "Scientist", knowledge: "Biologist" },
                { title: "Sub Technician", access: "Technician", knowledge: "Engineer" },
                { title: "Tourist", access: "Visitor", knowledge: "None" },
                { title: "Research Director", access: "Scientist", knowledge: "Marine Expert" },
                { title: "Maintenance Crew", access: "Technician", knowledge: "Basic" },
                { title: "Documentarian", access: "Visitor", knowledge: "Basic" },
                { title: "Security Officer", access: "Diver", knowledge: "Engineer" }
            ]
        },
        {
            id: 'animal_escape',
            title: "The Zoo Animal Escape",
            description: "A rare animal has mysteriously escaped from the city zoo. Only those with access to the enclosures could have orchestrated it. The incident happened during the morning feeding.",
            setting: 'zoo',
            traits: {
                access: ['Keeper', 'Vet', 'Volunteer', 'Visitor', 'None'],
                timing: ['Feeding', 'Cleaning', 'Tour', 'Break', 'Absent'],
                knowledge: ['Animal Expert', 'Medical', 'Basic', 'Limited', 'None'],
                motive: ['Activism', 'Negligence', 'Profit', 'Curiosity', 'None'],
                behavior: ['Nervous', 'Calm', 'Excited', 'Helpful', 'Missing']
            },
            suspectJobs: [
                { title: "Head Keeper", access: "Keeper", knowledge: "Animal Expert" },
                { title: "Veterinarian", access: "Vet", knowledge: "Medical" },
                { title: "Volunteer", access: "Volunteer", knowledge: "Basic" },
                { title: "Tourist", access: "Visitor", knowledge: "None" },
                { title: "Animal Trainer", access: "Keeper", knowledge: "Animal Expert" },
                { title: "Janitor", access: "Volunteer", knowledge: "Limited" },
                { title: "Photographer", access: "Visitor", knowledge: "Basic" },
                { title: "Security Guard", access: "Keeper", knowledge: "Basic" }
            ]
        },
        {
            id: 'space_station',
            title: "The Space Station Sabotage",
            description: "Critical systems were tampered with aboard the international space station. Only crew with access to engineering modules could have done it. The sabotage occurred during a solar storm blackout.",
            setting: 'space',
            traits: {
                access: ['Commander', 'Engineer', 'Scientist', 'Visitor', 'None'],
                timing: ['On Shift', 'Sleeping', 'Experiment', 'Logged', 'Missing'],
                knowledge: ['Astro Expert', 'Engineer', 'Biologist', 'Basic', 'None'],
                motive: ['Sabotage', 'Experiment', 'Profit', 'Curiosity', 'None'],
                behavior: ['Secretive', 'Nervous', 'Calm', 'Helpful', 'Absent']
            },
            suspectJobs: [
                { title: "Commander", access: "Commander", knowledge: "Astro Expert" },
                { title: "Flight Engineer", access: "Engineer", knowledge: "Engineer" },
                { title: "Mission Scientist", access: "Scientist", knowledge: "Biologist" },
                { title: "Space Tourist", access: "Visitor", knowledge: "None" },
                { title: "Payload Specialist", access: "Scientist", knowledge: "Engineer" },
                { title: "Medical Officer", access: "Engineer", knowledge: "Basic" },
                { title: "Communications Officer", access: "Commander", knowledge: "Basic" },
                { title: "Security Officer", access: "Engineer", knowledge: "Engineer" }
            ]
        },
        {
            id: 'school_cheating',
            title: "The School Exam Scandal",
            description: "The answers to the final exam were leaked at the prestigious academy. Only those with access to the teacher's lounge could have done it. The leak happened during lunch break.",
            setting: 'school',
            traits: {
                access: ['Teacher', 'Student', 'Staff', 'Visitor', 'None'],
                timing: ['Class', 'Break', 'Lunch', 'Absent', 'Excused'],
                knowledge: ['Subject Expert', 'Tutor', 'Basic', 'Limited', 'None'],
                motive: ['Grades', 'Revenge', 'Money', 'Curiosity', 'None'],
                behavior: ['Nervous', 'Calm', 'Excited', 'Helpful', 'Missing']
            },
            suspectJobs: [
                { title: "Math Teacher", access: "Teacher", knowledge: "Subject Expert" },
                { title: "Student Council", access: "Student", knowledge: "Tutor" },
                { title: "Janitor", access: "Staff", knowledge: "Limited" },
                { title: "Parent Visitor", access: "Visitor", knowledge: "None" },
                { title: "Principal", access: "Staff", knowledge: "Subject Expert" },
                { title: "Tutor", access: "Staff", knowledge: "Tutor" },
                { title: "Exchange Student", access: "Student", knowledge: "Basic" },
                { title: "Security Officer", access: "Staff", knowledge: "Basic" }
            ]
        }
    ];
    
    // Enhanced visual themes using CSS variables
    const CRIME_THEMES = {
        museum_heist: {
            name: 'Classical Museum',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #8B4513 0%, #D2B48C 50%, #F5DEB3 100%)',
                '--primary': '#8B4513',
                '--secondary': '#D2B48C',
                '--accent': '#DAA520',
                '--text': '#2F1B14',
                '--card-bg': 'rgba(245, 222, 179, 0.9)',
                '--button-gradient': 'linear-gradient(145deg, #DAA520, #B8860B)',
                '--font-family': 'Georgia, serif'
            },
            icon: '🏛️'
        },
        tech_breach: {
            name: 'Cyber Tech',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #0F0F23 0%, #1a1a2e 50%, #16213e 100%)',
                '--primary': '#00ff41',
                '--secondary': '#0066cc',
                '--accent': '#00ccff',
                '--text': '#00ff41',
                '--card-bg': 'rgba(15, 15, 35, 0.9)',
                '--button-gradient': 'linear-gradient(145deg, #00ccff, #0066cc)',
                '--font-family': '"Courier New", monospace'
            },
            icon: '💻'
        },
        recipe_theft: {
            name: 'Warm Bakery',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)',
                '--primary': '#8B4513',
                '--secondary': '#D2691E',
                '--accent': '#FF6B35',
                '--text': '#4A2C2A',
                '--card-bg': 'rgba(255, 210, 63, 0.9)',
                '--button-gradient': 'linear-gradient(145deg, #FF6B35, #D2691E)',
                '--font-family': '"Comic Sans MS", cursive'
            },
            icon: '🍞'
        },
        restaurant_poisoning: {
            name: 'Elegant Restaurant',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #2C1810 0%, #8B0000 50%, #4A0E0E 100%)',
                '--primary': '#FFD700',
                '--secondary': '#8B0000',
                '--accent': '#DC143C',
                '--text': '#FFD700',
                '--card-bg': 'rgba(139, 0, 0, 0.9)',
                '--button-gradient': 'linear-gradient(145deg, #FFD700, #DAA520)',
                '--font-family': '"Times New Roman", serif'
            },
            icon: '🍷'
        },
        underwater_mystery: {
            name: 'Underwater Base',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
                '--scenario-bg-img': 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80)',
                '--card-border-radius': '30px',
                '--primary': '#00bcd4',
                '--secondary': '#009688',
                '--accent': '#00e5ff',
                '--text': '#e0f7fa',
                '--card-bg': 'rgba(0, 188, 212, 0.15)',
                '--button-gradient': 'linear-gradient(145deg, #00e5ff, #009688)',
                '--font-family': 'Trebuchet MS, sans-serif',
                '--scenario-icon': '"\\1F30A"', // 🌊 Unicode
                '--card-border': '#00bcd4',
                '--header-bg': 'rgba(0, 188, 212, 0.2)'
            },
            icon: '🌊'
        },
        animal_escape: {
            name: 'City Zoo',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)',
                '--primary': '#8d5524',
                '--secondary': '#c68642',
                '--accent': '#e0ac69',
                '--text': '#4e342e',
                '--card-bg': 'rgba(247, 183, 51, 0.15)',
                '--button-gradient': 'linear-gradient(145deg, #fc4a1a, #f7b733)',
                '--font-family': 'Verdana, sans-serif'
            },
            icon: '🦁'
        },
        space_station: {
            name: 'Space Station',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                '--primary': '#ffffff',
                '--secondary': '#00bcd4',
                '--accent': '#ffeb3b',
                '--text': '#e1f5fe',
                '--card-bg': 'rgba(33, 150, 243, 0.15)',
                '--button-gradient': 'linear-gradient(145deg, #00bcd4, #ffeb3b)',
                '--font-family': 'Orbitron, sans-serif'
            },
            icon: '🚀'
        },
        school_cheating: {
            name: 'Academy',
            cssVars: {
                '--bg-gradient': 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
                '--primary': '#283e51',
                '--secondary': '#485563',
                '--accent': '#ffd200',
                '--text': '#212121',
                '--card-bg': 'rgba(255, 210, 0, 0.15)',
                '--button-gradient': 'linear-gradient(145deg, #ffd200, #f7971e)',
                '--font-family': 'Arial, sans-serif'
            },
            icon: '🏫'
        }
    };
    
    // Current crime scenario
    let currentCrime = null;
    
    // Utility functions
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    // Enhanced hash function for unpredictable seeds
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    // Get secure daily seed
    function getDailySeed() {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        let estTime = new Date(utcTime + (3600000 * -5)); // EST is UTC-5
        
        if (publicState.betaMode) {
            estTime = new Date(estTime.getTime() + (5 * 3600000)); // Add 5 hours for beta
        }
        
        const isPM = estTime.getHours() >= 12;
        const dateStr = estTime.toISOString().split('T')[0];
        const period = isPM ? 'PM' : 'AM';
        
        // Use hash for unpredictable seed
        const seedString = `${dateStr}-${period}-${privateState.gameSecret}`;
        return hashCode(seedString);
    }
    
    // Get current time in EST
    function getESTTime() {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utcTime + (3600000 * -5));
    }
    
    // Get puzzle period
    function getPuzzlePeriod() {
        const estTime = getESTTime();
        return estTime.getHours() >= 12 ? 'PM' : 'AM';
    }
    
    // Apply visual theme with CSS variables
    function applyTheme(crimeId) {
        const theme = CRIME_THEMES[crimeId];
        if (!theme) return;
        const root = document.documentElement;
        root.style.transition = 'all 0.3s ease-in-out';
        Object.entries(theme.cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        document.body.className = `theme-${crimeId}`;
        // Update header icon
        const header = document.querySelector('h1');
        if (header) {
            header.innerHTML = `${theme.icon} GUILTY ${theme.icon}`;
        }
        // Add scenario icon to suspect cards (example for underwater)
        if (crimeId === 'underwater_mystery') {
            document.querySelectorAll('.suspect-card').forEach(card => {
                if (!card.querySelector('.scenario-icon')) {
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'scenario-icon';
                    iconDiv.textContent = theme.icon;
                    card.prepend(iconDiv);
                }
            });
        }
        requestAnimationFrame(() => {
            document.querySelectorAll('.needs-theme').forEach(el => {
                el.classList.add('themed');
            });
        });
    }
    
    // Get trait categories for current crime
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
                        'Normal': 'Nothing unusual',
                        'Helpful': 'Cooperating fully'
                    }
                }
            }
        };
        
        return baseCategories[crime.id] || baseCategories.museum_heist;
    }
    
    // Enhanced feedback system with caching
    const feedbackCache = new Map();
    
    function getFeedbackForTrait(guessValue, culpritValue, traitCategory) {
        const cacheKey = `${guessValue}-${culpritValue}-${traitCategory}`;
        
        if (feedbackCache.has(cacheKey)) {
            return feedbackCache.get(cacheKey);
        }
        
        let result;
        
        if (guessValue === undefined) {
            result = 'unknown';
        } else if (culpritValue === undefined) {
            result = 'wrong';
        } else if (guessValue === culpritValue) {
            result = 'correct';
        } else {
            const traitArray = currentCrime.traits[traitCategory];
            if (!traitArray) {
                result = 'wrong';
            } else {
                const guessPosition = traitArray.indexOf(guessValue);
                const culpritPosition = traitArray.indexOf(culpritValue);
                
                if (Math.abs(guessPosition - culpritPosition) <= 1) {
                    result = 'close';
                } else {
                    result = 'wrong';
                }
            }
        }
        
        feedbackCache.set(cacheKey, result);
        return result;
    }

    // Initialize the game
    function initGame() {
        const seed = getDailySeed();
        const crime = CRIME_SCENARIOS[Math.floor(seededRandom(seed) * CRIME_SCENARIOS.length)];
        currentCrime = crime;
        
        // Generate suspects
        const suspects = generateSuspects(seed, crime);
        
        // Select culprit
        const culpritIndex = Math.floor(seededRandom(seed * 2) * suspects.length);
        const culprit = suspects[culpritIndex];
        
        // Generate initial suspect
        const initialSuspect = generateInitialSuspect(culprit, publicState.difficulty, seed);
        
        // Distribute traits for puzzle balance
        const balancedSuspects = distributeSuspectTraits(suspects, culprit, initialSuspect, seed);
        
        // Update game state
        publicState.suspects = balancedSuspects;
        publicState.culprit = culprit;
        publicState.initialSuspect = initialSuspect;
        
        // Apply theme
        applyTheme(crime.id);
        
        // Display initial state
        displaySuspects(balancedSuspects);
        updateFeedbackDisplay();
    }

    // Start the game
    function startGame() {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        // Generate suspects and display initial suspect
        generateSuspects();
        displayInitialSuspect();
        displaySuspects();
        startTimer();
    }

    // Display the initial suspect
    function displayInitialSuspect() {
        const suspectsSection = document.getElementById('suspectsSection');
        const oldSection = suspectsSection.querySelector('.initial-suspect-section');
        if (oldSection) oldSection.remove();
        
        const theme = gameState.currentTheme;
        const container = document.createElement('div');
        container.className = 'initial-suspect-section';
        
        let html = '<h3>Initial Suspect Profile</h3>';
        html += '<p>This person is NOT guilty. Find who shares these patterns:</p>';
        html += '<div class="initial-suspect-traits">';
        
        Object.keys(theme.traits).forEach(trait => {
            const initialValue = gameState.initialSuspect[trait];
            const suspectValue = gameState.culprit[trait];
            
            if (initialValue !== undefined && suspectValue !== undefined) {
                const colorClass = initialValue === suspectValue ? 'green' : 
                                 initialValue === undefined ? 'gray' : 'yellow';
                html += `<div class="initial-trait ${colorClass}">
                            <span class="trait-label">${trait}:</span>
                            <span class="trait-value">${initialValue}</span>
                        </div>`;
            }
        });
        
        html += '</div>';
        html += '<div class="color-legend">';
        html += '<span class="legend-item"><span class="color-box green"></span> = Exact match with culprit</span>';
        html += '<span class="legend-item"><span class="color-box yellow"></span> = Close to culprit</span>';
        html += '<span class="legend-item"><span class="color-box gray"></span> = Different from culprit</span>';
        html += '</div>';
        
        container.innerHTML = html;
        suspectsSection.appendChild(container);
    }

    function loadTheme() {
        // Set a default theme object
        gameState.currentTheme = {
            name: "Classic Mystery",
            description: "A mysterious crime has occurred. Can you solve it?",
            icon: "🕵️‍♂️",
            traits: {
                role: ['Detective', 'Suspect', 'Witness'],
                alibi: ['Home', 'Work', 'Unknown'],
                motive: ['Revenge', 'Greed', 'Jealousy']
            }
        };
        // Update the DOM
        document.getElementById('dailyTheme').textContent = gameState.currentTheme.icon + ' ' + gameState.currentTheme.name;
        document.getElementById('themeDescription').textContent = gameState.currentTheme.description;
    }

    function generateSuspects() {
        // Example: create a more complete suspects array
        gameState.suspects = [
            { role: 'Suspect', alibi: 'Home', motive: 'Greed' },
            { role: 'Witness', alibi: 'Work', motive: 'Revenge' },
            { role: 'Detective', alibi: 'Unknown', motive: 'Jealousy' },
            { role: 'Suspect', alibi: 'Work', motive: 'Revenge' },
            { role: 'Witness', alibi: 'Home', motive: 'Jealousy' },
            { role: 'Detective', alibi: 'Work', motive: 'Greed' }
        ];
        // Set a default culprit and initial suspect for demo purposes
        gameState.culprit = gameState.suspects[0];
        gameState.initialSuspect = gameState.suspects[1];
    }

    function startNextPuzzleTimer() {
        // Placeholder: does nothing for now
    }

    function displaySuspects(suspects) {
        const grid = document.getElementById('suspect-grid');
        grid.innerHTML = '';
        
        suspects.forEach((suspect, index) => {
            const card = document.createElement('div');
            card.className = 'suspect-card';
            card.dataset.index = index;
            
            const nameEl = document.createElement('h3');
            nameEl.textContent = suspect.name;
            
            const jobEl = document.createElement('p');
            jobEl.textContent = suspect.job;
            
            card.appendChild(nameEl);
            card.appendChild(jobEl);
            
            // Add trait elements
            Object.entries(suspect).forEach(([key, value]) => {
                if (!['name', 'job'].includes(key)) {
                    const traitEl = document.createElement('p');
                    traitEl.className = 'trait';
                    traitEl.dataset.trait = key;
                    traitEl.textContent = `${key}: ${value}`;
                    card.appendChild(traitEl);
                }
            });
            
            card.addEventListener('click', () => selectSuspect(index));
            grid.appendChild(card);
        });
    }

    function selectSuspect(index) {
        if (publicState.gameOver) return;
        
        const suspect = publicState.suspects[index];
        const feedback = getFeedback(suspect);
        
        // Add to guesses
        publicState.guesses.push({
            suspect: suspect,
            feedback: feedback
        });
        
        // Update display
        updateFeedbackDisplay();
        updateSuspectDisplay();
        
        // Check for game over
        if (suspect.name === publicState.culprit.name) {
            endGame(true);
        } else if (publicState.guesses.length >= DIFFICULTY_SETTINGS[publicState.difficulty].maxGuesses) {
            endGame(false);
        }
    }
    
    function getFeedback(suspect) {
        const feedback = {};
        const traitKeys = Object.keys(getTraitCategories(currentCrime));
        
        traitKeys.forEach(trait => {
            if (suspect[trait] !== undefined && publicState.culprit[trait] !== undefined) {
                feedback[trait] = getFeedbackForTrait(suspect[trait], publicState.culprit[trait], trait);
            }
        });
        
        return feedback;
    }
    
    function updateFeedbackDisplay() {
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = '';
        
        publicState.guesses.forEach((guess, index) => {
            const feedbackEl = document.createElement('div');
            feedbackEl.className = 'feedback-item';
            
            const suspectName = document.createElement('h4');
            suspectName.textContent = guess.suspect.name;
            
            const feedbackList = document.createElement('ul');
            Object.entries(guess.feedback).forEach(([trait, value]) => {
                const li = document.createElement('li');
                li.className = `feedback-${value}`;
                li.textContent = `${trait}: ${value}`;
                feedbackList.appendChild(li);
            });
            
            feedbackEl.appendChild(suspectName);
            feedbackEl.appendChild(feedbackList);
            feedbackContainer.appendChild(feedbackEl);
        });
    }
    
    function updateSuspectDisplay() {
        const suspects = publicState.suspects;
        const grid = document.getElementById('suspect-grid');
        
        suspects.forEach((suspect, index) => {
            const card = grid.children[index];
            if (!card) return;
            
            // Update trait colors based on feedback
            const feedback = getFeedback(suspect);
            Object.entries(feedback).forEach(([trait, value]) => {
                const traitEl = card.querySelector(`[data-trait="${trait}"]`);
                if (traitEl) {
                    traitEl.className = `trait feedback-${value}`;
                }
            });
        });
    }
    
    function endGame(won) {
        publicState.gameOver = true;
        
        const message = won ? 
            `Congratulations! You found the culprit in ${publicState.guesses.length} guesses!` :
            `Game Over! The culprit was ${publicState.culprit.name}.`;
        
        const endGameEl = document.createElement('div');
        endGameEl.className = 'end-game';
        endGameEl.innerHTML = `
            <h2>${message}</h2>
            <p>Puzzle Balance: ${publicState.viableSuspectsCount} viable suspects</p>
            <p>Confidence Level: ${publicState.confidenceLevel}%</p>
            <button onclick="location.reload()">Play Again</button>
        `;
        
        document.body.appendChild(endGameEl);
    }

    // Enhanced suspect generation with better distribution
    function generateSuspects(seed, crime) {
        const names = [
            "Anne Chen", "Ted Santos", "Henry Wilson", "Abby Thompson", "Joney Davis",
            "Sarah Martin", "Roy Lee", "Hannah Anderson", "Lex Brown", "Aaron Johnson",
            "Neve Williams", "Cal Miller", "Faye Garcia", "David Rodriguez", "Elle Martinez",
            "Jonathan Smith", "Emily Taylor", "Charles Jones", "Ben Thomas", "Will Jackson",
            "Sam White", "Juliette Harris", "Mike Chen", "Lisa Park", "Ryan Kumar",
            "Nina Patel", "Oscar Blake", "Maya Singh", "Felix Wong", "Grace Kim",
            "Victor Cruz", "Zoe Thompson", "Ian Foster", "Rita Sharma", "Noah Clark",
            "Luna Martinez", "Ethan Scott", "Aria Nguyen", "Jake Rivera", "Chloe Adams"
        ];
        
        const shuffledNames = [...names].sort(() => seededRandom(seed * 7) - 0.5);
        const selectedNames = shuffledNames.slice(0, 16);
        
        const jobs = [...crime.suspectJobs];
        while (jobs.length < 16) {
            const baseJob = jobs[jobs.length % crime.suspectJobs.length];
            jobs.push({
                ...baseJob,
                title: baseJob.title + " (Night)"
            });
        }
        
        const traitCategories = getTraitCategories(crime);
        const suspects = [];
        
        for (let i = 0; i < 16; i++) {
            const job = jobs[i % jobs.length];
            const suspect = {
                name: selectedNames[i],
                job: job.title,
                access: job.access,
                knowledge: job.knowledge
            };
            
            // Assign other traits with balanced distribution
            const traitKeys = Object.keys(crime.traits).filter(key => 
                !['access', 'knowledge'].includes(key)
            );
            
            traitKeys.forEach(key => {
                const traitValues = crime.traits[key];
                
                // Use difficulty-based missing trait chance
                const missingChance = DIFFICULTY_SETTINGS[publicState.difficulty].missingTraitChance;
                if (seededRandom(seed + i * 20 + key.charCodeAt(0)) < missingChance) {
                    // Don't assign this trait
                    return;
                }
                
                // Assign trait value with some logic
                suspect[key] = traitValues[Math.floor(seededRandom(seed + i * 21 + key.charCodeAt(0)) * traitValues.length)];
            });
            
            suspects.push(suspect);
        }
        
        return suspects;
    }
    
    // Enhanced initial suspect generation
    function generateInitialSuspect(culprit, difficulty, seed) {
        const difficultySettings = DIFFICULTY_SETTINGS[difficulty];
        const traitCategories = getTraitCategories(currentCrime);
        const traitKeys = Object.keys(traitCategories);
        
        const initialSuspect = {
            name: "Initial Suspect",
            job: "Unknown"
        };
        
        // Ensure ALL traits are included for initial suspect
        const shuffledTraits = [...traitKeys].sort(() => seededRandom(seed + 2000) - 0.5);
        const yellowCount = difficultySettings.yellowTraits;
        let yellowTraitsAssigned = 0;
        
        // Pre-determine which traits will be yellow
        const yellowTraitIndices = new Set();
        while (yellowTraitIndices.size < yellowCount) {
            const index = Math.floor(seededRandom(seed + 3000 + yellowTraitIndices.size) * shuffledTraits.length);
            yellowTraitIndices.add(index);
        }
        
        shuffledTraits.forEach((trait, index) => {
            const culpritValue = culprit[trait];
            if (!culpritValue) return;
            
            if (yellowTraitIndices.has(index)) {
                // Make it yellow (adjacent)
                initialSuspect[trait] = generateAdjacentValue(culpritValue, trait, seed + index * 500);
            } else {
                // Make it gray (distant) - but strategically
                initialSuspect[trait] = generateStrategicDistantValue(culpritValue, trait, seed + index * 600);
            }
        });
        
        return initialSuspect;
    }
    
    // Generate adjacent value for yellow matches
    function generateAdjacentValue(culpritValue, trait, seed) {
        const traitArray = currentCrime.traits[trait];
        const culpritPos = traitArray.indexOf(culpritValue);
        
        const adjacentPositions = [];
        if (culpritPos > 0) adjacentPositions.push(culpritPos - 1);
        if (culpritPos < traitArray.length - 1) adjacentPositions.push(culpritPos + 1);
        
        if (adjacentPositions.length === 0) return culpritValue;
        
        const chosenPos = adjacentPositions[Math.floor(seededRandom(seed) * adjacentPositions.length)];
        return traitArray[chosenPos];
    }
    
    // Generate strategically distant value (2+ steps away)
    function generateStrategicDistantValue(culpritValue, trait, seed) {
        const traitArray = currentCrime.traits[trait];
        const culpritPos = traitArray.indexOf(culpritValue);
        
        // Find positions that are exactly 2 steps away (not too far)
        const strategicPositions = [];
        for (let i = 0; i < traitArray.length; i++) {
            const distance = Math.abs(i - culpritPos);
            if (distance === 2) {
                strategicPositions.push(i);
            }
        }
        
        // If no 2-step positions, use any distant position
        if (strategicPositions.length === 0) {
            for (let i = 0; i < traitArray.length; i++) {
                if (Math.abs(i - culpritPos) > 2) {
                    strategicPositions.push(i);
                }
            }
        }
        
        if (strategicPositions.length === 0) {
            // Fallback
            return traitArray[0] === culpritValue ? traitArray[traitArray.length - 1] : traitArray[0];
        }
        
        const chosenPos = strategicPositions[Math.floor(seededRandom(seed) * strategicPositions.length)];
        return traitArray[chosenPos];
    }
    
    // Check if suspect produces similar feedback pattern
    function wouldProduceSimilarFeedback(suspect, culprit, targetFeedback, threshold = 0.75) {
        const traitKeys = Object.keys(targetFeedback);
        let matches = 0;
        let total = 0;
        
        traitKeys.forEach(trait => {
            if (suspect[trait] !== undefined && targetFeedback[trait] !== undefined) {
                const suspectFeedback = getFeedbackForTrait(suspect[trait], culprit[trait], trait);
                if (suspectFeedback === targetFeedback[trait]) {
                    matches++;
                }
                total++;
            }
        });
        
        return total > 0 && (matches / total) >= threshold;
    }
    
    // Enhanced suspect distribution for puzzle balance
    function distributeSuspectTraits(suspects, culprit, initialSuspect, seed) {
        const difficultySettings = DIFFICULTY_SETTINGS[publicState.difficulty];
        const distributionStrategy = difficultySettings.distributionStrategy;
        const traitKeys = Object.keys(getTraitCategories(currentCrime));
        
        // Calculate initial feedback pattern
        const initialFeedback = {};
        traitKeys.forEach(trait => {
            if (initialSuspect[trait] !== undefined && culprit[trait] !== undefined) {
                initialFeedback[trait] = getFeedbackForTrait(initialSuspect[trait], culprit[trait], trait);
            }
        });
        
        // Find the culprit index
        const culpritIndex = suspects.findIndex(s => s.name === culprit.name);
        
        // Distribute traits for non-culprit suspects
        suspects.forEach((suspect, index) => {
            if (index === culpritIndex) return; // Skip culprit
            
            traitKeys.forEach(trait => {
                if (suspect[trait] === undefined) return; // Skip missing traits
                
                const initialValue = initialSuspect[trait];
                const culpritValue = culprit[trait];
                
                if (!initialValue || !culpritValue) return;
                
                const initialFeedbackForTrait = initialFeedback[trait];
                const roll = seededRandom(seed + index * 1000 + trait.charCodeAt(0)) * 100;
                
                let cumulativeChance = 0;
                
                if (initialFeedbackForTrait === 'close') {
                    // For yellow traits in initial suspect
                    if (roll < (cumulativeChance += distributionStrategy.matchInitialYellow)) {
                        // Match initial suspect's value
                        suspect[trait] = initialValue;
                    } else if (roll < (cumulativeChance += distributionStrategy.otherYellow)) {
                        // Different yellow value
                        const otherYellow = generateAdjacentValue(culpritValue, trait, seed + index * 2000);
                        if (otherYellow !== initialValue) {
                            suspect[trait] = otherYellow;
                        } else {
                            suspect[trait] = culpritValue; // Fallback to green
                        }
                    } else if (roll < (cumulativeChance += distributionStrategy.matchCulprit)) {
                        // Match culprit (green)
                        suspect[trait] = culpritValue;
                    } else {
                        // Far value (gray)
                        suspect[trait] = generateStrategicDistantValue(culpritValue, trait, seed + index * 3000);
                    }
                } else if (initialFeedbackForTrait === 'wrong') {
                    // For gray traits in initial suspect
                    // More variety to prevent easy elimination
                    const grayRoll = seededRandom(seed + index * 4000) * 100;
                    
                    if (grayRoll < 30) {
                        // Keep same as initial
                        suspect[trait] = initialValue;
                    } else if (grayRoll < 50) {
                        // Match culprit
                        suspect[trait] = culpritValue;
                    } else if (grayRoll < 75) {
                        // Yellow value
                        suspect[trait] = generateAdjacentValue(culpritValue, trait, seed + index * 5000);
                    } else {
                        // Different gray value
                        const traitArray = currentCrime.traits[trait];
                        const availableValues = traitArray.filter(val => 
                            val !== initialValue && Math.abs(traitArray.indexOf(val) - traitArray.indexOf(culpritValue)) >= 2
                        );
                        if (availableValues.length > 0) {
                            suspect[trait] = availableValues[Math.floor(seededRandom(seed + index * 6000) * availableValues.length)];
                        }
                    }
                }
            });
        });
        
        // Verify puzzle difficulty
        const viableSuspects = suspects.filter(suspect => 
            wouldProduceSimilarFeedback(suspect, culprit, initialFeedback, 0.7)
        );
        
        publicState.viableSuspectsCount = viableSuspects.length;
        publicState.confidenceLevel = Math.round((1 - viableSuspects.length / 16) * 100);
        
        console.log(`Puzzle balance: ${viableSuspects.length} viable suspects (target: ${difficultySettings.minViableSuspects}+)`);
        
        return suspects;
    }

    // At the end of the IIFE, before the closing })();
    return {
        initGame: initGame
        // Add other public methods here if needed
    };
})();

window.GameManager = GameManager;
console.log('GameManager exported:', window.GameManager);

// document.addEventListener('DOMContentLoaded', function() {
//     if (typeof GameManager.initGame === 'function') {
//         GameManager.initGame();
//     }
// });
