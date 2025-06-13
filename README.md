# GUILTY - Detective Mystery Game (Frontend)

🎮 **A strategic detective mystery game requiring logical deduction over multiple rounds**

## About This Version

This directory contains the **clean, debugged frontend** of the GUILTY detective mystery game. This version features:

✅ **Strategic gameplay** - Minimal starting information forces logical deduction  
✅ **No backend dependencies** - Pure HTML/CSS/JavaScript  
✅ **Fixed all bugs** - Removed incomplete code and duplicates  
✅ **Ready to deploy** - Can be hosted on any static hosting service  

## Files

- `index.html` - Main game interface
- `guilty-game-js.js` - Complete game logic and mechanics  
- `styles.css` - All styling and responsive design
- `README.md` - This file

## Game Logic & Strategy

### **Core Mechanics:**
- **Minimal Starting Clues:** Game begins with only **1 clue** regardless of difficulty
- **Elimination Rounds:** Players must strategically exonerate suspects who don't match ALL revealed clues
- **Progressive Revelation:** Completing elimination rounds correctly reveals new clues
- **3+ Round Requirement:** Designed to require **at least 3 elimination rounds** to solve logically

### **Exoneration System:**
- **Visual Feedback:** Suspects who should be exonerated are highlighted in **yellow**
- **Reversible Actions:** Exonerated suspects become **grayed out** but remain visible
- **Un-Exonerate Option:** Green "Un-Exonerate" button allows correcting mistakes
- **Smart Validation:** "Check Exonerations" provides specific feedback on progress

### **Difficulty Levels:**
- **Easy:** Forgiving trait matching (±1 position on trait scales)
- **Medium:** Balanced challenge with strict trait matching  
- **Hard:** Only exact trait matches count - no proximity allowed

### **Trait Matching Logic:**
- **Green (Exact):** Suspect trait matches culprit trait exactly
- **Yellow (Close):** Suspect trait is 1 step away on trait progression (Easy/Medium only)
- **Gray (Wrong):** Suspect trait doesn't match criteria
- **Edge Case Handling:** Proper logic for traits at extreme ends of progressions

## How to Play

1. **Start with 1 Clue:** Analyze the single revealed trait of the culprit
2. **Strategic Elimination:** Exonerate ALL suspects who don't match the clue(s)
3. **Perfect Rounds:** Complete elimination rounds with 100% accuracy to reveal new clues
4. **Logical Deduction:** Use multiple clues to narrow down suspects systematically
5. **Find the Culprit:** Win when only the guilty party remains un-exonerated

## Deployment

This is a static web application that can be deployed to:
- GitHub Pages
- Netlify  
- Vercel
- Render (with included Express server)
- Any static hosting service

Simply upload these files to your hosting provider.

## Game Features

- 🕵️ **16 unique suspects** with randomized traits across 5 categories
- 🎭 **3 crime scenarios** (Museum Heist, Data Breach, Restaurant Poisoning)  
- ⚡ **Real-time timer** and comprehensive statistics tracking
- 📱 **Fully responsive** design optimized for all devices
- 🎚️ **3 difficulty levels** with distinct trait matching rules
- 🧠 **Strategic depth** requiring logical analysis over multiple rounds
- 🔄 **Mistake recovery** with visual feedback and un-exonerate functionality

## Design Philosophy

**GUILTY** is designed as a **thinking game**, not a guessing game. The minimal starting information and progressive clue system forces players to:

- **Analyze patterns** across suspect traits systematically
- **Make strategic decisions** about which suspects to eliminate
- **Learn from feedback** and adjust their deduction process
- **Build logical chains** of reasoning over multiple rounds

This creates a satisfying puzzle experience where success comes from **careful analysis** rather than lucky guesses.

---

**Latest Update**: Strategic gameplay overhaul with minimal clues and logical progression - January 2024 