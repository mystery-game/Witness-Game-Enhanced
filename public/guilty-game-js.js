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
    
    // Event handler reference for cleanup
    let boundHandleClick = null;
    
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
            missingTraitChance: 0.45,
            distributionStrategy: {
                matchInitialYellow: 10,
                otherYellow: 10,
                matchCulprit: 20,
                farValue: 60
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
    
    // Trait value definitions with indices
    const TRAIT_VALUES = {
        access: ['None', 'Visitor', 'Employee', 'Manager', 'Owner'],
        timing: ['Never There', 'After Crime', 'During Crime', 'Before Crime', 'Always There'],
        knowledge: ['Clueless', 'Basic', 'Intermediate', 'Expert', 'Mastermind'],
        motive: ['None', 'Weak', 'Moderate', 'Strong', 'Overwhelming'],
        behavior: ['Very Calm', 'Calm', 'Normal', 'Nervous', 'Very Nervous']
    };
    
    // Constants for game balance
    const MIN_VIABLE_SUSPECTS = 8; // Ensures 3+ guesses needed (log2(8) = 3)
    const MAX_INITIAL_VIABLE = 12; // Not too many to keep it reasonable
    const LUCK_THRESHOLD = 2; // Guesses 1-2 are considered lucky
    
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
    
    // Fixed trait comparison with proper gray exclusions
    function compareTraitsWithGrayLogic(suspectValue, culpritValue, traitType) {
        const values = TRAIT_VALUES[traitType];
        const suspectIndex = values.indexOf(suspectValue);
        const culpritIndex = values.indexOf(culpritValue);
        
        if (suspectIndex === -1 || culpritIndex === -1) return 'unknown';
        
        const diff = Math.abs(suspectIndex - culpritIndex);
        
        if (diff === 0) return 'green';
        if (diff === 1) return 'yellow';
        return 'gray'; // 2 or more steps away
    }

    // Get excluded values for gray feedback
    function getGrayExclusions(observedValue, traitType) {
        const values = TRAIT_VALUES[traitType];
        const index = values.indexOf(observedValue);
        const excluded = [];
        
        // Gray means culprit is 2+ steps away, so exclude:
        // 1. The exact value
        excluded.push(observedValue);
        
        // 2. Adjacent values (1 step away)
        if (index > 0) excluded.push(values[index - 1]);
        if (index < values.length - 1) excluded.push(values[index + 1]);
        
        return excluded;
    }

    // Get allowed values for yellow feedback  
    function getYellowAllowed(observedValue, traitType) {
        const values = TRAIT_VALUES[traitType];
        const index = values.indexOf(observedValue);
        const allowed = [];
        
        // Yellow means exactly 1 step away
        if (index > 0) allowed.push(values[index - 1]);
        if (index < values.length - 1) allowed.push(values[index + 1]);
        
        return allowed;
    }

    // Main viable suspect check with ALL constraints
    function isViableSuspectComplete(suspect, initialSuspect, initialFeedback) {
        // Build constraint sets
        const constraints = {
            green: {},    // Must match exactly
            yellow: {},   // Must be in allowed set
            gray: {}      // Must NOT be in excluded set
        };
        
        // Process each feedback
        for (const trait in initialFeedback) {
            const feedback = initialFeedback[trait];
            if (!feedback || feedback === 'unknown') continue;
            
            const observedValue = initialSuspect[trait];
            
            switch (feedback) {
                case 'green':
                    constraints.green[trait] = observedValue;
                    break;
                    
                case 'yellow':
                    constraints.yellow[trait] = getYellowAllowed(observedValue, trait);
                    break;
                    
                case 'gray':
                    constraints.gray[trait] = getGrayExclusions(observedValue, trait);
                    break;
            }
        }
        
        // Check all constraints
        // 1. Green constraints (exact match)
        for (const trait in constraints.green) {
            if (suspect[trait] !== constraints.green[trait]) {
                return false;
            }
        }
        
        // 2. Yellow constraints (must be in allowed set)
        for (const trait in constraints.yellow) {
            if (!constraints.yellow[trait].includes(suspect[trait])) {
                return false;
            }
        }
        
        // 3. Gray constraints (must NOT be in excluded set)
        for (const trait in constraints.gray) {
            if (constraints.gray[trait].includes(suspect[trait])) {
                return false;
            }
        }
        
        return true;
    }

    // Debug function to show constraint analysis
    function analyzeConstraints(initialSuspect, initialFeedback) {
        console.log("=== CONSTRAINT ANALYSIS ===");
        
        const analysis = {
            yellows: [],
            grays: [],
            totalPossibleCombinations: 1
        };
        
        for (const trait in initialFeedback) {
            const feedback = initialFeedback[trait];
            const value = initialSuspect[trait];
            
            if (feedback === 'yellow') {
                const allowed = getYellowAllowed(value, trait);
                analysis.yellows.push({
                    trait,
                    suspectHas: value,
                    culpritMustBe: allowed
                });
                analysis.totalPossibleCombinations *= allowed.length;
                
            } else if (feedback === 'gray') {
                const excluded = getGrayExclusions(value, trait);
                const allValues = TRAIT_VALUES[trait];
                const remaining = allValues.filter(v => !excluded.includes(v));
                
                analysis.grays.push({
                    trait,
                    suspectHas: value,
                    culpritCannotBe: excluded,
                    culpritCouldBe: remaining
                });
                
                // Update combination count
                analysis.totalPossibleCombinations *= remaining.length / allValues.length;
            }
        }
        
        console.log("Yellow constraints:", analysis.yellows);
        console.log("Gray constraints:", analysis.grays);
        console.log("Maximum possible combinations:", Math.floor(analysis.totalPossibleCombinations));
        
        return analysis;
    }

    // Fixed confidence calculation
    function calculateConfidence(totalSuspects, viableSuspects) {
        const eliminated = totalSuspects - viableSuspects;
        const confidence = Math.round((eliminated / totalSuspects) * 100);
        return confidence;
    }

    // Complete game update function
    function updateGameState() {
        // Get all suspects
        const allSuspects = this.suspects;
        const viableSuspects = [];
        
        // Check each suspect
        allSuspects.forEach(suspect => {
            if (isViableSuspectComplete(suspect, this.initialSuspect, this.initialFeedback)) {
                viableSuspects.push(suspect);
            }
        });
        
        // Update UI
        const viableCount = viableSuspects.length;
        const confidence = calculateConfidence(allSuspects.length, viableCount);
        
        const viableDisplay = document.getElementById('viableDisplay');
        if (viableDisplay) viableDisplay.textContent = viableCount;
        const confidenceFill = document.querySelector('.confidence-fill');
        if (confidenceFill) confidenceFill.style.width = `${confidence}%`;
        const confidenceText = document.querySelector('.confidence-text');
        if (confidenceText) confidenceText.textContent = 
            `Confidence: ${confidence}% (${viableCount} suspects remain viable)`;
        
        // Debug info
        if (this.devMode) {
            console.log(`Viable suspects (${viableCount}):`, viableSuspects.map(s => s.name));
            analyzeConstraints(this.initialSuspect, this.initialFeedback);
        }
        
        return viableSuspects;
    }

    // Initialize the game
    function initGame() {
        const crime = getDailyCrime();
        currentCrime = crime;
        
        // Generate suspects
        const suspects = generateSuspects(getDailySeed(), crime);
        
        // Select culprit
        const culpritIndex = Math.floor(seededRandom(getDailySeed() * 2) * suspects.length);
        const culprit = suspects[culpritIndex];
        
        // Initialize game state with new class
        const gameState = new GuiltyGameState(publicState.difficulty);
        gameState.initializeGame(suspects, culprit);
        
        // Update public state with game state values
        publicState.suspects = gameState.suspects;
        publicState.culprit = gameState.culprit;
        publicState.initialSuspect = gameState.initialSuspect;
        publicState.theoreticalMinGuesses = gameState.theoreticalMinGuesses;
        
        // Apply theme
        applyTheme(crime.id);
        
        // Display initial state
        displaySuspects(gameState.suspects);
        updateFeedbackDisplay();
        
        // Set crime title and description in the DOM
        document.getElementById('crimeTitle').textContent = crime.title;
        document.getElementById('crimeDescription').textContent = crime.description;
        if (typeof GameManager.displayInitialSuspect === 'function') {
            GameManager.displayInitialSuspect();
        }
        updateMainMenuTheme();
        startTimer();
        renderTraitGuide();
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
        if (!suspectsSection) return;
        // Remove old initial suspect section if present
        const oldSection = document.getElementById('initialSuspect');
        if (oldSection) oldSection.remove();
        const initialDiv = document.createElement('div');
        initialDiv.id = 'initialSuspect';
        initialDiv.className = 'initial-suspect-section';
        const traitCategories = getTraitCategories(currentCrime);
        const traitKeys = Object.keys(traitCategories);
        let traitHTML = '';
        traitKeys.forEach(trait => {
            if (publicState.initialSuspect[trait] !== undefined) {
                const feedback = getFeedbackForTrait(
                    publicState.initialSuspect[trait],
                    publicState.culprit[trait],
                    trait
                );
                const colorClass = feedback === 'correct' ? 'green' : feedback === 'close' ? 'yellow' : 'gray';
                traitHTML += `
                    <div class="initial-trait ${colorClass}">
                        <div class="initial-trait-label">${traitCategories[trait].name}</div>
                        <div class="initial-trait-value">${publicState.initialSuspect[trait]}</div>
                    </div>
                `;
            }
        });
        initialDiv.innerHTML = `
            <h3>Initial Suspect Profile</h3>
            <p>This person is NOT guilty. Find who shares these patterns:</p>
            <div class="initial-suspect-traits">${traitHTML}</div>
            <div class="color-legend">
                <span class="legend-item"><span class="color-box green"></span> = Exact match with culprit</span>
                <span class="legend-item"><span class="color-box yellow"></span> = Close to culprit</span>
                <span class="legend-item"><span class="color-box gray"></span> = Different from culprit</span>
            </div>
        `;
        suspectsSection.prepend(initialDiv);
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
            // Add Accuse and Exonerate buttons
            const btnDiv = document.createElement('div');
            btnDiv.className = 'suspect-actions';
            const accuseBtn = document.createElement('button');
            accuseBtn.className = 'suspect-button accuse-btn';
            accuseBtn.textContent = 'Accuse';
            accuseBtn.addEventListener('click', () => selectSuspect(index));
            const exonerateBtn = document.createElement('button');
            exonerateBtn.className = 'suspect-button exonerate-btn';
            exonerateBtn.textContent = publicState.eliminatedSuspects.has(suspect.name) ? 'Restore' : 'Exonerate';
            exonerateBtn.addEventListener('click', () => {
                if (publicState.eliminatedSuspects.has(suspect.name)) {
                    publicState.eliminatedSuspects.delete(suspect.name);
                } else {
                    publicState.eliminatedSuspects.add(suspect.name);
                }
                displaySuspects(suspects);
            });
            btnDiv.appendChild(accuseBtn);
            btnDiv.appendChild(exonerateBtn);
            card.appendChild(btnDiv);
            grid.appendChild(card);
        });
    }

    // Update selectSuspect function to use new game state
    function selectSuspect(index) {
        if (publicState.gameOver) return;
        
        const suspect = publicState.suspects[index];
        const feedback = gameState.makeGuess(suspect);
        
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
    
    // Update endGame function to use new game state
    function endGame(won) {
        publicState.gameOver = true;
        gameState.endGame(won);
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

    function updateMainMenuTheme() {
        const crime = getDailyCrime();
        const themeEl = document.getElementById('dailyTheme');
        const descEl = document.getElementById('themeDescription');
        if (themeEl) themeEl.textContent = crime.title || 'Today\'s Mystery';
        if (descEl) descEl.textContent = crime.description || 'Loading theme...';
    }

    function getDailyCrime() {
        const seed = getDailySeed();
        return CRIME_SCENARIOS[Math.floor(seededRandom(seed) * CRIME_SCENARIOS.length)];
    }

    function getNextPuzzleTime() {
        // Get current EST time
        const now = getESTTime();
        const next = new Date(now);
        if (now.getHours() < 12) {
            next.setHours(12, 0, 0, 0); // Next 12pm
        } else {
            next.setHours(24, 0, 0, 0); // Next 12am (midnight)
        }
        return next;
    }

    function showRules() {
        let modal = document.getElementById('rulesModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'rulesModal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.7)';
            modal.style.zIndex = '9999';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.innerHTML = `
                <div style="background: #1e293b; color: #fff; padding: 40px; border-radius: 20px; max-width: 600px; width: 90%; position: relative;">
                    <button id="closeRulesModal" style="position: absolute; top: 20px; right: 20px; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer;">Close</button>
                    <h2>How to Play</h2>
                    <ul style="margin-bottom: 20px;">
                        <li>Each day, a new mystery scenario is generated. Your goal: find the culprit!</li>
                        <li>Use the initial suspect profile as a reference. This person is NOT guilty, but their traits are clues.</li>
                        <li>Click "Accuse" on a suspect to see feedback for each trait (green = exact match, yellow = close, gray = different).</li>
                        <li>Use "Exonerate" to mark suspects you want to ignore.</li>
                        <li>You have a limited number of guesses. Good luck, detective!</li>
                    </ul>
                    <h3>Trait Guide</h3>
                    <div id="traitGuide"></div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById('closeRulesModal').onclick = function() {
                modal.remove();
            };
            // Render trait guide
            const guideDiv = document.getElementById('traitGuide');
            const traitCategories = getTraitCategories(getDailyCrime());
            let guideHTML = '';
            Object.keys(traitCategories).forEach(trait => {
                guideHTML += `<div style="margin-bottom: 10px;"><strong>${traitCategories[trait].name}:</strong> `;
                guideHTML += Object.entries(traitCategories[trait].values).map(([val, desc]) => `<span style="margin-left: 8px;"><em>${val}</em>: ${desc}</span>`).join('<br>');
                guideHTML += '</div>';
            });
            guideDiv.innerHTML = guideHTML;
        }
    }

    let timerInterval = null;
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        let start = Date.now();
        function update() {
            let elapsed = Math.floor((Date.now() - start) / 1000);
            let min = Math.floor(elapsed / 60);
            let sec = elapsed % 60;
            let display = min + ':' + (sec < 10 ? '0' : '') + sec;
            const timerEl = document.getElementById('timerDisplay');
            if (timerEl) timerEl.textContent = display;
        }
        update();
        timerInterval = setInterval(update, 1000);
    }
    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
    }
    function renderTraitGuide() {
        let guideDiv = document.getElementById('traitGuideBox');
        if (!guideDiv) {
            const suspectsSection = document.getElementById('suspectsSection');
            guideDiv = document.createElement('div');
            guideDiv.id = 'traitGuideBox';
            guideDiv.className = 'trait-reference-clean';
            suspectsSection.appendChild(guideDiv);
        }

        const traitCategories = getTraitCategories(currentCrime);
        let guideHTML = `
            <h4>🎯 How Traits Work</h4>
            <div class="trait-explanation">
                <div class="explanation-item">
                    <span class="color-indicator green"></span>
                    <span>Exact match</span>
                </div>
                <div class="explanation-item">
                    <span class="color-indicator yellow"></span>
                    <span>One step away (adjacent)</span>
                </div>
                <div class="explanation-item">
                    <span class="color-indicator gray"></span>
                    <span>Two or more steps away</span>
                </div>
            </div>
            
            <div class="trait-table">
                <div class="trait-header">Trait Spectrums (ordered left → right)</div>
        `;

        // Add each trait spectrum
        Object.entries(traitCategories).forEach(([trait, category]) => {
            const values = currentCrime.traits[trait];
            guideHTML += `
                <div class="trait-spectrum">
                    <div class="trait-label">${category.name}:</div>
                    <div class="trait-options">
            `;

            // Add each value with its position
            values.forEach((value, index) => {
                guideHTML += `
                    <span class="trait-option" data-position="${index + 1}">${value}</span>
                    ${index < values.length - 1 ? '<span class="trait-connector">↔</span>' : ''}
                `;
            });

            guideHTML += `
                    </div>
                </div>
            `;
        });

        guideHTML += `
            </div>
            
            <div class="trait-example">
                <strong>Example:</strong> If the culprit has "Staff" access and you guess "Manager", you'll see yellow (one step away).
            </div>
        `;

        guideDiv.innerHTML = guideHTML;
    }

    function toggleDevMode() {
        publicState.devMode = !publicState.devMode;
        const devTools = document.getElementById('devTools');
        if (devTools) devTools.style.display = publicState.devMode ? 'block' : 'none';
    }

    // Enhanced initial suspect selection
    function selectInitialSuspectNoEarlyWins(suspects, culprit, difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const candidateSuspects = suspects.filter(s => s !== culprit);
        
        // Find patterns that create 8-12 viable suspects
        const validPatterns = [];
        
        for (const suspect of candidateSuspects) {
            const feedback = {};
            let greenCount = 0;
            let yellowCount = 0;
            
            // Calculate feedback pattern
            for (const trait of Object.keys(TRAIT_VALUES)) {
                const result = compareTraitsFixed(suspect[trait], culprit[trait], trait);
                feedback[trait] = result;
                
                if (result === 'green') greenCount++;
                if (result === 'yellow' || result === 'yellow-edge') yellowCount++;
            }
            
            // Skip patterns with too many greens (too easy)
            if (greenCount > 1) continue;
            
            // Skip patterns with wrong yellow count
            if (yellowCount !== settings.yellowTraits) continue;
            
            // Count viable suspects
            const viableSuspects = suspects.filter(s => 
                wouldProduceSimilarFeedback(s, culprit, feedback, 0.7)
            );
            
            // Only accept patterns with 8-12 viable suspects
            if (viableSuspects.length >= MIN_VIABLE_SUSPECTS && 
                viableSuspects.length <= MAX_INITIAL_VIABLE) {
                validPatterns.push({
                    suspect,
                    feedback,
                    viableCount: viableSuspects.length,
                    theoreticalMinGuesses: Math.ceil(Math.log2(viableSuspects.length))
                });
            }
        }
        
        // If no valid patterns, relax constraints slightly
        if (validPatterns.length === 0) {
            // Try again with 6-14 viable suspects
            return selectInitialSuspectWithRange(suspects, culprit, difficulty, 6, 14);
        }
        
        // Select pattern closest to 10 viable suspects
        validPatterns.sort((a, b) => 
            Math.abs(10 - a.viableCount) - Math.abs(10 - b.viableCount)
        );
        
        return validPatterns[0];
    }

    // Helper function for relaxed constraints
    function selectInitialSuspectWithRange(suspects, culprit, difficulty, minViable, maxViable) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const candidateSuspects = suspects.filter(s => s !== culprit);
        const validPatterns = [];
        
        for (const suspect of candidateSuspects) {
            const feedback = {};
            let greenCount = 0;
            let yellowCount = 0;
            
            for (const trait of Object.keys(TRAIT_VALUES)) {
                const result = compareTraitsFixed(suspect[trait], culprit[trait], trait);
                feedback[trait] = result;
                
                if (result === 'green') greenCount++;
                if (result === 'yellow' || result === 'yellow-edge') yellowCount++;
            }
            
            if (greenCount > 1) continue;
            if (yellowCount !== settings.yellowTraits) continue;
            
            const viableSuspects = suspects.filter(s => 
                wouldProduceSimilarFeedback(s, culprit, feedback, 0.7)
            );
            
            if (viableSuspects.length >= minViable && viableSuspects.length <= maxViable) {
                validPatterns.push({
                    suspect,
                    feedback,
                    viableCount: viableSuspects.length,
                    theoreticalMinGuesses: Math.ceil(Math.log2(viableSuspects.length))
                });
            }
        }
        
        if (validPatterns.length === 0) {
            // Last resort: use any pattern with reasonable viable count
            return selectInitialSuspectWithRange(suspects, culprit, difficulty, 4, 16);
        }
        
        validPatterns.sort((a, b) => 
            Math.abs(10 - a.viableCount) - Math.abs(10 - b.viableCount)
        );
        
        return validPatterns[0];
    }

    // Game state with luck detection
    class GuiltyGameState {
        constructor(difficulty) {
            this.difficulty = difficulty;
            this.guesses = [];
            this.startTime = Date.now();
            this.theoreticalMinGuesses = 3; // Will be calculated
            this.wasLucky = false;
            this.viableSuspectsHistory = [];
            this.devMode = false;
        }
        
        initializeGame(suspects, culprit) {
            this.suspects = suspects;
            this.culprit = culprit;
            
            // Select initial suspect ensuring no early wins
            const pattern = selectInitialSuspectNoEarlyWins(suspects, culprit, this.difficulty);
            this.initialSuspect = pattern.suspect;
            this.initialFeedback = pattern.feedback;
            this.theoreticalMinGuesses = pattern.theoreticalMinGuesses;
            
            // Track initial viable suspects
            this.viableSuspectsHistory.push(pattern.viableCount);
            
            // Display message about minimum guesses
            this.displayMinGuessMessage();
            
            // Debug output if in dev mode
            if (this.devMode) {
                this.debugCurrentState();
            }
        }
        
        displayMinGuessMessage() {
            const minGuesses = Math.max(3, this.theoreticalMinGuesses);
            const message = `It is possible to solve this through logical deduction alone in ${minGuesses} guesses`;
            
            // Add to UI
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
            
            // Insert after game stats
            const gameStats = document.querySelector('.game-stats');
            if (gameStats) {
                gameStats.after(messageEl);
            }
        }
        
        makeGuess(suspect) {
            const guessNumber = this.guesses.length + 1;
            const feedback = this.calculateFeedback(suspect);
            
            this.guesses.push({
                suspect,
                feedback,
                guessNumber
            });
            
            // Check if this was the culprit
            if (suspect === this.culprit) {
                // Determine if they got lucky
                if (guessNumber <= LUCK_THRESHOLD) {
                    this.wasLucky = true;
                } else {
                    // Check if it was theoretically possible to get it this fast
                    const viableBeforeGuess = this.calculateViableSuspects();
                    const theoreticalMin = Math.ceil(Math.log2(viableBeforeGuess.length));
                    
                    if (guessNumber < theoreticalMin + 2) {
                        this.wasLucky = true;
                    }
                }
                
                return this.endGame(true);
            }
            
            // Update viable suspects
            const newViable = this.calculateViableSuspects();
            this.viableSuspectsHistory.push(newViable.length);
            
            return feedback;
        }
        
        calculateViableSuspects() {
            const viableSuspects = [];
            
            for (const suspect of this.suspects) {
                let isViable = true;
                
                // Check against initial feedback
                for (const trait of Object.keys(this.initialFeedback)) {
                    if (this.initialFeedback[trait] === 'unknown') continue;
                    
                    // What feedback would we see if this suspect was the culprit?
                    const hypotheticalFeedback = compareTraitsFixed(
                        this.initialSuspect[trait],
                        suspect[trait],
                        trait
                    );
                    
                    if (hypotheticalFeedback !== this.initialFeedback[trait]) {
                        isViable = false;
                        break;
                    }
                }
                
                // Check against guess history
                if (isViable) {
                    for (const guess of this.guesses) {
                        for (const trait of Object.keys(guess.feedback)) {
                            const expectedFeedback = compareTraitsFixed(
                                guess.suspect[trait],
                                suspect[trait],
                                trait
                            );
                            
                            if (expectedFeedback !== guess.feedback[trait]) {
                                isViable = false;
                                break;
                            }
                        }
                        if (!isViable) break;
                    }
                }
                
                if (isViable) {
                    viableSuspects.push(suspect);
                }
            }
            
            return viableSuspects;
        }
        
        debugCurrentState() {
            console.log("Current game state:");
            console.log("Initial suspect:", this.initialSuspect);
            console.log("Initial feedback:", this.initialFeedback);
            console.log("Guesses made:", this.guesses.length);
            
            const viable = this.calculateViableSuspects();
            console.log("Viable suspects:", viable.length);
            viable.forEach(s => console.log(" -", s.name));
            
            // If in dev mode, show the culprit
            if (this.devMode) {
                console.log("Actual culprit:", this.culprit.name);
            }
        }
        
        endGame(won) {
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
                message = `The culprit was ${this.culprit.name}. Better luck next time!`;
            }
            
            // Show game over screen
            this.showGameOver(won, title, message, guessCount, timeTaken);
        }
        
        showGameOver(won, title, message, guessCount, timeTaken) {
            const gameOverEl = document.getElementById('gameOver');
            const titleEl = document.getElementById('gameOverTitle');
            const messageEl = document.getElementById('gameOverMessage');
            
            if (!gameOverEl || !titleEl || !messageEl) return;
            
            gameOverEl.className = won ? 'game-over won' : 'game-over lost';
            titleEl.textContent = title;
            
            // Build detailed message
            const minutes = Math.floor(timeTaken / 60);
            const seconds = timeTaken % 60;
            const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            
            let detailsHtml = `
                <p>${message}</p>
                <div class="game-stats-final">
                    <div class="stat-final">
                        <span class="stat-label">Guesses:</span>
                        <span class="stat-value">${guessCount}/${DIFFICULTY_SETTINGS[this.difficulty].maxGuesses}</span>
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
        }
        
        getShareableResults() {
            const difficulty = this.difficulty.charAt(0).toUpperCase();
            const guessCount = this.guesses.length;
            const won = this.guesses[guessCount - 1]?.suspect === this.culprit;
            
            let result = `GUILTY ${this.getPuzzleNumber()} ${guessCount}/${DIFFICULTY_SETTINGS[this.difficulty].maxGuesses}`;
            if (this.wasLucky) result += ' 🍀';
            result += '\n\n';
            
            // Add guess pattern
            for (let i = 0; i < guessCount; i++) {
                if (i === guessCount - 1 && won) {
                    result += '🟩';
                } else {
                    result += '⬜';
                }
            }
            
            return result;
        }

        updateViableCount() {
            const viable = this.suspects.filter(suspect => {
                // Check ALL constraints
                for (const trait in this.initialFeedback) {
                    const feedback = this.initialFeedback[trait];
                    if (!feedback || feedback === 'unknown') continue;
                    
                    const hypothetical = compareTraitsFixed(
                        this.initialSuspect[trait],
                        suspect[trait],
                        trait
                    );
                    
                    if (hypothetical !== feedback) return false;
                }
                return true;
            });
            // Update displays
            const viableDisplay = document.getElementById('viableDisplay');
            if (viableDisplay) viableDisplay.textContent = viable.length;
            if (typeof this.updateConfidenceMeter === 'function') {
                this.updateConfidenceMeter(viable.length);
            }
            return viable;
        }
    }

    // Add game over styles
    const gameOverStyles = `
    <style>
    .game-stats-final {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin: 20px 0;
        flex-wrap: wrap;
    }

    .stat-final {
        background: var(--bg-medium);
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .stat-final.lucky {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(245, 158, 11, 0.2));
        border: 1px solid rgba(34, 197, 94, 0.4);
    }

    .stat-final .stat-label {
        font-size: 0.85em;
        color: var(--text-muted);
    }

    .stat-final .stat-value {
        font-size: 1.2em;
        font-weight: 600;
        color: var(--text-primary);
    }

    .min-guess-message {
        animation: slideDown 0.5s ease-out;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    </style>
    `;

    // Add styles to document
    document.head.insertAdjacentHTML('beforeend', gameOverStyles);

    // At the end of the IIFE, before the closing })();
    return {
        initGame: initGame,
        displayInitialSuspect: displayInitialSuspect,
        updateMainMenuTheme: updateMainMenuTheme,
        getNextPuzzleTime: getNextPuzzleTime,
        showRules: showRules,
        toggleDevMode: toggleDevMode
    };
})();

// Make GameManager available globally
if (typeof window !== 'undefined') {
    window.GameManager = GameManager;
    window.runAITests = function(n) { return GameManager.runAITests(n); };
    console.log('GameManager loaded and attached to window');
}
