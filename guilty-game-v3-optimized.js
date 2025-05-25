// GUILTY v3 - Fixed Logic to Prevent Early Deduction

// Enhanced difficulty settings with logical constraints
const DIFFICULTY_SETTINGS = {
    easy: {
        maxGuesses: 8,
        name: 'Easy',
        minViableSuspects: 12, // At least 12 suspects must remain viable after guess 1
        minSecondGuessViable: 6,  // At least 6 suspects must remain viable after guess 2
        yellowTraits: 2 // Number of "close" traits in initial suspect
    },
    medium: {
        maxGuesses: 6,
        name: 'Medium',
        minViableSuspects: 14, // Harder - more suspects remain viable
        minSecondGuessViable: 8,
        yellowTraits: 1
    },
    hard: {
        maxGuesses: 4,
        name: 'Hard',
        minViableSuspects: 15, // Nearly all suspects remain viable
        minSecondGuessViable: 10,
        yellowTraits: 1
    }
}; 