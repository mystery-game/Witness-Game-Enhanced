# 🔍 GUILTY - Daily Detective Mystery Game

A time-based deduction puzzle game where players eliminate suspects through logical reasoning to identify the culprit.

## 🎮 Game Overview

GUILTY challenges players to solve mystery cases by:
- Analyzing clues about innocent suspects
- Using logical deduction to eliminate impossibilities
- Racing against time to identify the culprit
- Achieving high scores through efficient solving

### 🎯 Key Features

- **Pure Time Challenge**: No guess limits - it's all about speed and logic
- **Progressive Clue System**: Each successful elimination round reveals new information
- **Dynamic Difficulty**: Easy, Medium, and Hard modes with varying initial information
- **Color-Coded Feedback**:
  - 🟩 Green = Exact trait match
  - 🟨 Yellow = Adjacent trait (one step away)
  - ⬜ Gray = Different trait (2+ steps away)
- **Scoring System**: Time-based with bonuses for perfect deduction
- **Daily Mysteries**: New cases with different themes (currently featuring Museum Heist)

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/guilty-game.git
cd guilty-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

5. Open your browser to `http://localhost:3000`

## 🎲 How to Play

### Phase 1: Initial Clue
- You're given information about an innocent suspect who had an alibi
- Use their trait feedback to start eliminating other suspects

### Phase 2: Elimination Rounds
1. **Analyze**: Compare suspect traits against known clues
2. **Exonerate**: Mark suspects who can't match the pattern
3. **Check**: Click "Check Exonerations" to verify your logic
4. **Progress**: Each correct round reveals a new innocent suspect

### Phase 3: Victory
- Continue until only one suspect remains - that's your culprit!
- Faster solutions earn higher scores

## 🧩 Game Mechanics

### Trait System
The game uses 5 trait categories, each with 5 possible values:

1. **Access Level**: None → Visitor → Contractor → Staff → VIP
2. **Alibi Timing**: Asleep → Working → Home → Out → Verified
3. **Knowledge**: None → Basic → Limited → Familiar → Expert
4. **Motive**: None → Curious → Vengeful → Greedy → Desperate
5. **Behavior**: Helpful → Normal → Changed → Nervous → Suspicious

### Feedback Colors
- **Green (Correct)**: Exact match with culprit's trait
- **Yellow (Close)**: Adjacent value in the trait sequence
- **Gray (Wrong)**: Two or more steps away

### Scoring
- Base score starts at 10,000 points
- Points decrease over time (50 points per second)
- Difficulty multipliers: Easy (0.8x), Medium (1.0x), Hard (1.5x)
- Perfect deduction bonus: +2,000 points for using minimum clues

## 🛠️ Technical Details

### Frontend
- Pure HTML5, CSS3, and JavaScript
- No external framework dependencies
- Responsive design for all devices
- Modern glass-morphism UI aesthetic

### Backend
- Node.js with Express.js
- Security headers with Helmet
- Rate limiting for API protection
- Compression for performance

### Architecture
- Client-side game logic for zero-latency gameplay
- Server handles static file serving
- Environment-based configuration
- Modular code structure

## 📁 Project Structure

```
guilty-game/
├── index.html          # Main game file
├── server.js           # Express server
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore         # Git ignore rules
├── LICENSE            # MIT License
├── README.md          # This file
├── SETUP_GUIDE.md     # Detailed setup instructions
├── FILES_SUMMARY.md   # Complete file reference
├── quick-start.sh     # Mac/Linux setup script
└── quick-start.bat    # Windows setup script
```

## 🔧 Configuration

Environment variables (`.env` file):
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## 📊 Difficulty Levels

### Easy Mode
- 2 initial trait reveals
- 85% trait visibility on suspects
- Lower score multiplier (0.8x)

### Medium Mode
- 2 initial trait reveals
- 80% trait visibility on suspects
- Standard score multiplier (1.0x)

### Hard Mode
- 1 initial trait reveal
- 75% trait visibility on suspects
- Higher score multiplier (1.5x)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic deduction games like Clue and Guess Who
- UI design influenced by modern glass-morphism trends
- Game logic based on constraint satisfaction principles

## 🐛 Known Issues

- None currently reported

## 🚀 Future Enhancements

- Multiple crime scenarios
- Daily challenge mode with leaderboards
- Multiplayer competitive mode
- Achievement system
- More trait categories and complexity levels

---

**Enjoy solving mysteries!** 🕵️‍♂️
