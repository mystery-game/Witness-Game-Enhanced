# 🔍 GUILTY - Comprehensive Technical Documentation

## Table of Contents
1. [Game Overview](#game-overview)
2. [Game Mechanics Deep Dive](#game-mechanics-deep-dive)
3. [Complete File Structure](#complete-file-structure)
4. [Code Architecture Walkthrough](#code-architecture-walkthrough)
5. [Dependencies & Technologies](#dependencies--technologies)
6. [Local Development Setup](#local-development-setup)
7. [Deployment on Render](#deployment-on-render)
8. [Game State Management](#game-state-management)
9. [Scoring Algorithm](#scoring-algorithm)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Game Overview

**GUILTY** is a single-player, browser-based deduction puzzle game where players race against time to identify a culprit through logical elimination. The game presents an initial "alibied suspect" whose traits provide clues about the real culprit, and players must progressively eliminate impossible suspects until only the guilty party remains.

### Core Concept
- **Genre**: Logic puzzle / Deduction game
- **Platform**: Web browser (HTML5)
- **Architecture**: Client-side game logic with Node.js/Express server
- **Deployment**: Render.com
- **Time to Play**: 3-10 minutes per game

### Victory Condition
The game is won when:
1. Only one suspect remains (the culprit)
2. The minimum required number of clues has been given (3-6 depending on difficulty)
3. All impossible suspects have been correctly exonerated

---

## Game Mechanics Deep Dive

### The Crime Scenario
Currently features "The Museum Diamond Heist":
- The 'Star of Mumbai' diamond was stolen
- Crime occurred between 2-3 AM
- Thief knew guard rotations perfectly

### Trait System
Each suspect has 5 traits with ordinal values:

1. **Museum Access**: None → Visitor → Contractor → Staff → VIP
2. **Alibi Time**: Asleep → Working → Home → Out → Verified
3. **Security Knowledge**: None → Basic → Limited → Familiar → Expert
4. **Motive Strength**: None → Curious → Vengeful → Greedy → Desperate
5. **Recent Behavior**: Helpful → Normal → Changed → Nervous → Suspicious

### Clue Feedback System
When comparing a clue suspect's trait to the culprit's:
- **Green (Correct)**: Exact match with culprit
- **Yellow (Close)**: Adjacent value (±1 position in sequence)
- **Gray (Wrong)**: Two or more steps away

### Game Flow
1. **Initial Setup**: 
   - Generate 16 suspects with partially visible traits
   - Randomly select one as the culprit (has all traits)
   - Generate initial "alibied suspect" clue
   - Calculate required clues (3-6 based on difficulty)

2. **Elimination Rounds**:
   - Player studies clue suspect's trait feedback
   - Exonerates all suspects who can't match the pattern
   - Clicks "Check Exonerations" to verify
   - Correct elimination unlocks new clue
   - Process repeats until only culprit remains

3. **Scoring**:
   - Base: 10,000 points
   - Time penalty: -50 points/second
   - Perfect deduction bonus: +2,000 (using minimum clues)
   - Difficulty multiplier: Easy (0.8x), Medium (1.0x), Hard (1.5x)

---

## Complete File Structure

```
Witness-Game-Enhanced/
├── index.html          # Main game file (47KB) - Complete game UI and logic
├── server.js           # Express server (2KB) - Serves game and handles security
├── package.json        # Dependencies and scripts
├── package-lock.json   # Locked dependency versions (auto-generated)
├── .env               # Environment variables (PORT, NODE_ENV)
├── .env.example       # Template for environment variables
├── .gitignore         # Git ignore rules
├── LICENSE            # MIT License
├── README.md          # This comprehensive documentation
├── SETUP_GUIDE.md     # Detailed setup instructions
├── FILES_SUMMARY.md   # File reference guide
├── quick-start.sh     # Mac/Linux setup script
├── quick-start.bat    # Windows setup script
├── node_modules/      # NPM packages (auto-generated)
└── public/            # Static assets folder (if used)
```

---

## Code Architecture Walkthrough

### index.html Structure

#### 1. **HTML Head Section**
- Meta tags for responsive design
- Title: "GUILTY - Daily Detective Mystery"
- Google Fonts import (Inter font family)
- Embedded CSS (no external stylesheets)

#### 2. **CSS Architecture** (lines ~7-618)
```css
/* CSS Variables in :root */
--primary: #6366f1;          /* Purple theme color */
--primary-dark: #4f46e5;     /* Darker purple */
--success: #22c55e;          /* Green for correct */
--warning: #f59e0b;          /* Orange for close */
--danger: #ef4444;           /* Red for errors */
--bg-dark: #0f172a;          /* Dark background */
--glass: rgba(255,255,255,0.05);  /* Glassmorphism effect */
```

**Key CSS Classes**:
- `.header`: Glassmorphism header with blur effect
- `.phase-indicator`: Shows current game phase
- `.exoneration-tracker`: Displays elimination progress
- `.suspect-card`: Individual suspect display
- `.clue-row`: Clue display with feedback
- `.hint-reveal`: Animated clue reveal box
- `.trait-reference-minimal`: Compact trait reference

#### 3. **JavaScript Game Manager** (lines ~623-1498)

**Module Pattern Implementation**:
```javascript
const GameManager = (function() {
    // Private state encapsulation
    let privateState = {
        culprit: null,
        suspects: [],
        cluesSuspects: [],
        logicallyImpossible: new Set(),
        cluesRequired: 0,
        gameSecret: 'guilty-' + Math.random()
    };
    
    // Public state
    let publicState = {
        difficulty: 'medium',
        gameOver: false,
        won: false,
        exoneratedSuspects: new Set(),
        incorrectlyExonerated: new Set(),
        viableSuspectsCount: 16,
        startTime: null,
        timerInterval: null,
        eliminationRounds: 0,
        cluesGiven: 0
    };
    
    // Return public API
    return {
        init: function() {},
        toggleElimination: function(name) {},
        setDifficulty: function(difficulty) {}
    };
})();
```

**Core Functions Explained**:

1. **`seededRandom(seed)`** (line ~807)
   - Generates deterministic random numbers
   - Used for consistent suspect generation
   - Formula: `Math.sin(seed) * 10000 - Math.floor(...)`

2. **`getFeedbackForTrait(guessValue, culpritValue, traitCategory)`** (line ~812)
   - Compares trait values and returns feedback type
   - Returns: 'correct', 'close', or 'wrong'
   - Handles edge cases for undefined values

3. **`calculateLogicallyImpossible()`** (line ~835)
   - Determines which suspects can't be culprit
   - Compares each suspect against all given clues
   - Updates UI highlighting for impossible suspects

4. **`checkExonerations()`** (line ~917)
   - Validates player's elimination choices
   - Provides specific feedback ("Close!" with counts)
   - Triggers victory or new clue generation

5. **`generateSuspects()`** (line ~1157)
   - Creates 16 suspects with names and jobs
   - Assigns traits based on difficulty visibility
   - Selects random culprit with all traits visible

6. **`displayClue(suspect, isInitial)`** (line ~1034)
   - Renders clue UI with trait feedback
   - Shows hint reveal animation
   - Different messaging for initial vs subsequent clues

### server.js Architecture

```javascript
const express = require('express');
const helmet = require('helmet');       // Security headers
const compression = require('compression');  // Gzip compression
const rateLimit = require('express-rate-limit');  // API rate limiting

// Security configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
```

---

## Dependencies & Technologies

### Production Dependencies (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",         // Web framework
    "helmet": "^7.0.0",           // Security headers
    "compression": "^1.7.4",      // Response compression
    "express-rate-limit": "^6.10.0",  // Rate limiting
    "dotenv": "^16.3.1"           // Environment variables
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "nodemon": "^3.0.1"  // Auto-restart on file changes
  }
}
```

### Frontend Technologies
- **No frameworks**: Pure vanilla JavaScript
- **CSS**: Custom properties, flexbox, grid, animations
- **Fonts**: Google Fonts (Inter)
- **Icons**: Unicode emojis for UI elements

---

## Local Development Setup

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0
- Git (optional)

### Step-by-Step Setup

1. **Clone or Download Files**
```bash
git clone https://github.com/yourusername/guilty-game.git
cd guilty-game
# OR manually create folder and add all files
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create Environment File**
```bash
cp .env.example .env
# Edit .env to set PORT=3000 and NODE_ENV=development
```

4. **Run Development Server**
```bash
npm run dev  # Uses nodemon for auto-restart
# OR
npm start    # Standard node execution
```

5. **Access Game**
```
http://localhost:3000
```

### Quick Start Scripts
- **Mac/Linux**: `chmod +x quick-start.sh && ./quick-start.sh`
- **Windows**: Double-click `quick-start.bat`

---

## Deployment on Render

### Prerequisites
- GitHub account with repository
- Render.com account (free tier works)

### Step 1: Prepare Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. **Log into Render.com**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub repository**
4. **Configure build settings**:
   ```yaml
   Name: guilty-game
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

### Step 3: Environment Variables
In Render dashboard → Environment:
```
PORT=10000  (Render usually auto-sets this)
NODE_ENV=production
```

### Step 4: Deploy Settings
- **Auto-Deploy**: Enable for automatic updates
- **Branch**: Set to `main` or `master`
- **Build Cache**: Can speed up deploys

### Step 5: Custom Domain (Optional)
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed

### Deployment Troubleshooting

**Build Cache Issues**:
- Click "Manual Deploy" → "Clear build cache & deploy"

**Environment Variables Not Loading**:
- Check Render logs for dotenv errors
- Ensure .env is NOT in repository (security)

**Port Binding Errors**:
- Let Render set PORT automatically
- Use `process.env.PORT || 3000`

**Memory Issues**:
- Free tier has 512MB limit
- Game is lightweight, shouldn't be issue

---

## Game State Management

### Private State Object
```javascript
privateState = {
    culprit: {name, job, all traits},  // The guilty suspect
    suspects: [{...}],                  // All 16 suspects
    cluesSuspects: [{...}],            // Given clue suspects
    logicallyImpossible: Set(),        // Suspects that can't be culprit
    cluesRequired: 3-6,                // Minimum clues to solve
    gameSecret: string                 // Unique game identifier
}
```

### Public State Object
```javascript
publicState = {
    difficulty: 'easy'|'medium'|'hard',
    gameOver: boolean,
    won: boolean,
    exoneratedSuspects: Set(),         // Player's eliminations
    incorrectlyExonerated: Set(),      // Wrong eliminations
    viableSuspectsCount: number,       // Remaining possible culprits
    startTime: Date,
    timerInterval: number,
    eliminationRounds: number,         // Successful rounds
    cluesGiven: number                 // Total clues shown
}
```

### State Flow
1. **Init**: Generate suspects, select culprit, create first clue
2. **Playing**: Track eliminations, validate on check
3. **Round Success**: Generate new clue, update counts
4. **Victory**: Stop timer, calculate score, show results

---

## Scoring Algorithm

```javascript
// Base scoring calculation
const baseScore = 10000;
const timeElapsed = Date.now() - publicState.startTime;
const timeBonus = Math.max(0, baseScore - (timeElapsed / 1000) * 50);

// Difficulty multipliers
const difficultyMultiplier = {
    'hard': 1.5,
    'medium': 1.0,
    'easy': 0.8
}[publicState.difficulty];

// Perfect deduction bonus
const clueBonus = (publicState.cluesGiven === privateState.cluesRequired) ? 2000 : 0;

// Final score
const finalScore = Math.round((timeBonus + clueBonus) * difficultyMultiplier);
```

### Score Factors
- **Speed**: Primary factor (-50 points/second)
- **Efficiency**: +2000 for using minimum clues
- **Difficulty**: Multiplier affects final score
- **No penalties**: Wrong guesses only waste time

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Game Won't Load
```bash
# Check Node.js installation
node --version  # Should be >= 14.0.0

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

#### Render Deployment Issues

**Build Failures**:
```bash
# Check package.json syntax
npm run test

# Ensure all dependencies are in package.json
npm install --save [missing-package]
```

**Old Version Showing**:
1. Clear Render build cache
2. Force rebuild with timestamp:
```bash
echo "<!-- Rebuild $(date) -->" >> index.html
git add . && git commit -m "Force rebuild" && git push
```

**Environment Variables**:
- Never commit .env file
- Set all variables in Render dashboard
- Use fallbacks: `process.env.PORT || 3000`

#### Browser Compatibility
Requires modern browser with:
- ES6 JavaScript support
- CSS Grid and Flexbox
- CSS Custom Properties
- No IE11 support

### Performance Optimization
- All game logic is client-side (no server calls during play)
- CSS animations use transform/opacity (GPU accelerated)
- Minimal DOM manipulation (update only changed elements)
- No external API calls or large assets

---

## Future Enhancement Considerations

### Planned Features (Not Implemented)
1. Multiple crime scenarios beyond museum heist
2. Daily challenge mode with seed-based puzzles
3. Leaderboard system (requires backend)
4. Achievement system
5. Sound effects and music
6. Tutorial mode for new players
7. Colorblind accessibility modes

### Code Extension Points
- Crime scenarios: Add to `currentCrime` object
- New traits: Extend trait arrays and categories
- Difficulty modes: Adjust `DIFFICULTY_SETTINGS`
- Scoring: Modify algorithm in `endGame()`
- UI themes: Update CSS variables

---

## Security Considerations

### Current Implementation
- Helmet.js for security headers
- Rate limiting on API endpoints
- CSP headers prevent XSS
- No user data storage
- No authentication required

### Recommendations
- Use HTTPS in production (Render provides)
- Keep dependencies updated
- Monitor for vulnerabilities: `npm audit`
- No sensitive data in client-side code

---

## Conclusion

GUILTY is a complete, production-ready web game built with modern JavaScript and a focus on logical deduction gameplay. The modular architecture allows for easy extension while maintaining clean separation between game logic and presentation. The deployment on Render provides reliable hosting with automatic SSL and scaling capabilities.

For questions or contributions, refer to the existing codebase patterns and maintain the established coding style. The game is designed to be lightweight, accessible, and enjoyable for players who love logic puzzles and deduction challenges.