# The Witness - A Daily Mystery Game

A sophisticated daily mystery game where players interrogate witnesses to solve crimes. Features dynamic AI-powered responses and adaptive difficulty.

## Overview

The Witness presents players with a new mystery each day. You must:
1. Examine the crime scene
2. Question a unique witness with their own personality
3. Unlock evidence through smart questioning
4. Make your accusation

## Features

### 3 Balanced Mysteries
- **Easy (Friday)**: The Gallery Gambit - Art heist with a nervous witness
- **Medium (Monday)**: The Laboratory Accident - Your original paranoid witness mystery
- **Hard (Saturday)**: Inheritance of Lies - Complex mansion murder with misdirection

### Dynamic Gameplay
- Evidence photos unlock based on your questions
- Witness responses vary by tone and specificity
- Adaptive difficulty based on your performance
- Daily challenges with different witness personalities

### Player Progression
- Track your solve rate and streaks
- Performance statistics by difficulty level
- Adaptive question allowance for struggling players

## Setup

### Prerequisites
- Node.js installed on your system
- Claude API key (optional - game works without it)

### Installation

1. Navigate to the project directory:
```bash
cd /Users/HenryAppel/witness-game-enhanced
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add your Claude API key:
```
ANTHROPIC_API_KEY=your-api-key-here
```

4. Start the game:
```bash
npm start
```

5. Open your browser to `http://localhost:3000`

## How to Play

### Examining the Scene
- Read the crime scene description carefully
- Look for clues about timing, location, and evidence
- Visual scenes provide additional context

### Questioning Strategy
- **Easy Mode**: Be gentle with the nervous witness - they'll reveal more
- **Medium Mode**: Your tone matters! Kind questions get better responses
- **Hard Mode**: Expect misdirection - cross-reference everything

### Evidence System
- Evidence photos are locked initially
- Ask questions with specific keywords to unlock them
- Each piece of evidence has different importance levels

### Making Your Accusation
- You get 2-3 questions depending on difficulty and performance
- Choose your suspect carefully after questioning
- Connect the evidence to identify the culprit

## Technical Details

### Without Claude API
- Uses sophisticated scripted responses
- Still provides full gameplay experience
- Responses are tailored to each mystery and witness type

### With Claude API
- Dynamic, contextual responses
- Witnesses remember previous questions
- More natural conversation flow

## Game Design Philosophy

Originally featuring 7 mysteries, the game was refactored to 3 well-balanced experiences. This change ensures:
- Consistent difficulty progression
- Clear information delivery
- Balanced evidence systems
- Satisfying player experience

Each mystery is carefully crafted with:
- Unique witness personality
- Specific evidence unlocking keywords
- Appropriate red herrings
- Clear solution path

## Credits

Created by a beginner programmer with the assistance of Claude Opus, demonstrating how AI can empower non-programmers to create sophisticated games. 