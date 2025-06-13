# GUILTY - Detective Mystery Game

🎮 **A strategic detective mystery game requiring logical deduction over multiple rounds**

> **IMPORTANT FOR FUTURE AI DEVELOPMENT:** This README contains ALL necessary context for maintaining and enhancing this game. Read this document completely before making any changes to preserve the intended design philosophy and user experience.

## Design Philosophy & Core Requirements

### **PRIMARY GOAL: THINKING GAME, NOT GUESSING GAME**
GUILTY is designed as a **logic puzzle** that requires **systematic analysis** over **multiple elimination rounds**. Success must come from **careful deduction**, not lucky guesses.

### **MANDATORY DESIGN PRINCIPLES:**
1. **Minimal Starting Information** - Game MUST start with only 1 clue
2. **Progressive Revelation** - New clues earned ONLY through perfect elimination rounds
3. **3+ Round Minimum** - Game MUST require at least 3 rounds of logical deduction
4. **No Guessing Shortcuts** - Players cannot win by random suspect selection
5. **Mistake Recovery** - Players MUST be able to correct exoneration errors
6. **Visual Clarity** - Game state and next actions MUST be immediately clear

## Technical Architecture

### **File Structure:**
```
/
├── index.html          # Main UI - NO embedded CSS/JS allowed
├── guilty-game-js.js   # Complete game logic (18KB)
├── styles.css          # All styling (12KB) 
├── server.js           # Express server for deployment
├── package.json        # Node.js dependencies
├── .gitignore          # Excludes node_modules
└── README.md           # This comprehensive guide
```

### **Technology Stack:**
- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript (NO frameworks)
- **Backend:** Node.js + Express (minimal server for static hosting)
- **Deployment:** Static hosting compatible (Render, Netlify, Vercel, GitHub Pages)
- **Dependencies:** express@^4.18.2 ONLY

## Game Logic Implementation

### **Core Game State Structure:**
```javascript
gameState = {
    difficulty: 'easy|medium|hard',
    suspects: Array[16],           // Always exactly 16 suspects
    culprit: Object,              // One randomly selected suspect
    cluesRevealed: Array,         // Progressive clue accumulation
    startTime: Number,            // For timer functionality
    gameActive: Boolean,          // Game session control
    eliminationRound: Number,     // Current round (starts at 1)
    phase: 'elimination'          // Always elimination-based
}
```

### **Suspect Object Structure:**
```javascript
suspect = {
    id: Number,                   // 0-15 unique identifier
    name: String,                 // From SUSPECT_NAMES array
    job: String,                  // From JOBS array
    traits: {                     // 5 required trait categories
        access: String,           // 5-level progression
        timing: String,           // 5-level progression  
        knowledge: String,        // 5-level progression
        motive: String,           // 5-level progression
        behavior: String          // 5-level progression
    },
    exonerated: Boolean,          // Player action state
    shouldExonerate: Boolean      // Logic calculation result
}
```

### **Trait Progression System (IMMUTABLE):**
```javascript
TRAIT_PROGRESSIONS = {
    access: ['None', 'Visitor', 'Contractor', 'Staff', 'VIP'],
    timing: ['Asleep', 'Working', 'Home', 'Out', 'Verified'],
    knowledge: ['None', 'Basic', 'Limited', 'Familiar', 'Expert'],
    motive: ['None', 'Curious', 'Vengeful', 'Greedy', 'Desperate'],
    behavior: ['Helpful', 'Normal', 'Changed', 'Nervous', 'Suspicious']
}
```

### **Difficulty Logic (EXACT SPECIFICATIONS):**

#### **Initial Clues:**
- **ALL difficulties:** Start with exactly **1 clue** (NEVER more)
- **Rationale:** Forces strategic multi-round gameplay

#### **Trait Matching Rules:**
- **Easy:** Exact match OR ±1 position distance (yellow zone)
- **Medium:** Exact match OR ±1 position distance (yellow zone)  
- **Hard:** ONLY exact matches (no yellow zone)

#### **Edge Case Handling:**
- Traits at position 0 or 4 have limited yellow zones
- Yellow highlighting MUST respect progression boundaries
- Distance calculation: `Math.abs(index1 - index2)`

## UI/UX Requirements

### **Exoneration System (CRITICAL):**
- **NEVER hide exonerated suspects** - they must remain visible
- Exonerated suspects: 40% opacity, grayscale filter, muted colors
- **Green "Un-Exonerate" button** for mistake correction
- **Yellow highlighting** for suspects that should be exonerated
- **Smart feedback** on Check Exonerations button

### **Visual States:**
```css
.suspect-card.exonerated {
    opacity: 0.4;
    filter: grayscale(50%);
    border: 1px solid var(--text-muted);
}

.suspect-card.should-exonerate {
    border: 2px solid var(--warning);
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}
```

### **Responsive Design:**
- **Mobile-first approach** with grid layouts
- **Flexible trait reference** that collapses on small screens  
- **Touch-friendly buttons** (minimum 44px tap targets)
- **Readable typography** across all device sizes

## Critical Functions & Logic

### **Game Initialization:**
```javascript
function generateInitialClues() {
    const numClues = 1;  // NEVER change this value
    // Must randomly select 1 trait type
    // Must ensure logical consistency
}
```

### **Suspect Matching Logic:**
```javascript
function matchesCulpritClues(suspect) {
    // MUST check ALL revealed clues
    // MUST handle edge cases for trait progressions
    // MUST respect difficulty-specific matching rules
}
```

### **Exoneration Validation:**
```javascript
function checkExonerations() {
    // MUST provide specific feedback messages
    // MUST require 100% accuracy for new clues
    // MUST handle both correct and incorrect exonerations
}
```

## Performance & Deployment

### **Bundle Size Targets:**
- **Total:** <50KB uncompressed
- **JavaScript:** ~18KB
- **CSS:** ~12KB  
- **HTML:** ~8KB
- **Load Time:** <2 seconds on 3G

### **Browser Compatibility:**
- **Modern browsers:** Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **NO Internet Explorer support**
- **Progressive enhancement** for older browsers

### **Deployment Configuration:**
```json
// package.json requirements
{
  "name": "guilty-detective-game",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Specific Implementation Rules

### **NEVER DO:**
1. **Remove the un-exonerate functionality** - players must be able to reverse mistakes
2. **Hide exonerated suspects** - they must remain visible but grayed out
3. **Start with more than 1 clue** - this breaks the strategic progression
4. **Allow winning without 3+ rounds** - defeats the logic puzzle purpose
5. **Add timers or pressure mechanics** - this is a thinking game
6. **Change trait progressions** - they are carefully balanced
7. **Use frameworks** - keep it vanilla JavaScript for performance
8. **Embed CSS/JS in HTML** - maintain clean file separation

### **ALWAYS DO:**
1. **Validate perfect elimination rounds** before revealing new clues
2. **Provide specific feedback** on player actions and progress  
3. **Maintain responsive design** across all screen sizes
4. **Test edge cases** in trait matching logic
5. **Preserve game state consistency** throughout the session
6. **Follow the established visual hierarchy** and color system
7. **Keep performance optimized** for mobile devices

## Future Enhancement Guidelines

### **Acceptable Additions:**
- **Statistics tracking** (win rates, average time, rounds)
- **Achievement system** (perfect games, speed solving)
- **Accessibility improvements** (ARIA labels, keyboard navigation)
- **Animation polish** (smooth transitions, micro-interactions)
- **Additional crime scenarios** (following existing pattern)

### **Architecture Expansions:**
- **Save/load game state** (localStorage)
- **Daily challenge mode** (seeded random generation)
- **Hint system** (limited use, maintains difficulty)
- **Tutorial mode** (guided first game)

### **Performance Optimizations:**
- **Lazy loading** for non-critical elements
- **Service worker** for offline play
- **Image optimization** for crime scenario graphics
- **Bundle splitting** if complexity grows

## Debugging & Maintenance

### **Common Issues:**
1. **Exoneration button not working** → Check event delegation in renderSuspects()
2. **Trait matching errors** → Verify getTraitDistance() edge cases
3. **UI layout breaks** → Check CSS grid and flexbox fallbacks
4. **Game state corruption** → Validate suspect generation logic

### **Testing Checklist:**
- [ ] All 3 difficulty levels work correctly
- [ ] Exonerate/un-exonerate cycle functions properly  
- [ ] Check Exonerations provides accurate feedback
- [ ] Game requires minimum 3 elimination rounds
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Edge cases in trait matching handled correctly
- [ ] Performance acceptable on slower devices

## Version History & Evolution

### **v2.0 - Strategic Gameplay Overhaul (Current)**
- **Minimal clues:** Reduced to 1 starting clue
- **Exoneration system:** Visual feedback and mistake recovery
- **Logic fixes:** Proper trait matching and edge case handling  
- **UI improvements:** Grayed-out exonerated suspects, un-exonerate buttons
- **Performance:** Clean codebase, optimized for deployment

### **Design Evolution:**
- **v1.x:** Wordle-inspired with multiple starting clues (too easy)
- **v2.0:** Strategic logic puzzle requiring systematic analysis
- **Future:** Enhanced analytics and accessibility while preserving core logic

---

## For Future AI Developers

**This document represents the complete design intent and technical requirements for GUILTY.** Before making ANY changes:

1. **Read this entire README** to understand the design philosophy
2. **Test the current game** to experience the intended flow
3. **Respect the "NEVER DO" list** to avoid breaking core mechanics  
4. **Follow established patterns** for any new features
5. **Maintain the strategic, thinking-focused gameplay** above all else

The game is designed to be a **sophisticated logic puzzle**. Any changes must enhance rather than compromise this core experience.

**Contact:** Preserve this design philosophy in all future iterations.

**Latest Update:** Comprehensive documentation for AI-assisted development - January 2024 