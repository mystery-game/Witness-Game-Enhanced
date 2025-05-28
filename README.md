# GUILTY - Daily Detective Mystery Game

<div align="center">
  
  ![GUILTY Logo](https://img.shields.io/badge/GUILTY-Detective%20Game-blue?style=for-the-badge)
  ![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
  ![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)
  ![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen?style=flat-square)
  
  **A sophisticated deduction game where logic meets mystery**
  
  [Play Now](https://witness-game-enhanced.onrender.com) | [Report Bug](https://github.com/mystery-game/Witness-Game-Enhanced/issues) | [Request Feature](https://github.com/mystery-game/Witness-Game-Enhanced/issues)

</div>

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [How to Play](#-how-to-play)
- [Installation](#-installation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Game Theory](#-game-theory)
- [Developer Tools](#-developer-tools)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## 🎮 About

GUILTY is a daily detective mystery game inspired by Wordle, but instead of guessing words, you're using logical deduction to identify criminals. Using information theory and pattern recognition, players analyze suspect traits to find the culprit before they escape.

### Why GUILTY?

- **Pure Logic**: Every puzzle can be solved through deduction alone
- **No Luck Required**: Information theory ensures optimal play is rewarded
- **Daily Challenge**: New mysteries every 12 hours (AM/PM EST)
- **Skill-Based**: Track whether you won through luck or perfect deduction

## ✨ Features

### Core Gameplay
- **🔍 Pattern-Based Deduction**: Analyze trait patterns across 16 suspects
- **🎨 Visual Feedback System**: 
  - 🟩 Green = Exact trait match
  - 🟨 Yellow = Adjacent trait value
  - ⬜ Gray = Different trait value
  - ❓ Unknown = Missing information
- **📊 Trait Spectrum Guide**: Visual representation of trait relationships
- **💪 Three Difficulty Levels**:
  - Easy (8 guesses, 3 yellow clues, 15% missing info)
  - Medium (6 guesses, 2 yellow clues, 25% missing info)
  - Hard (4 guesses, 1 yellow clue, 35% missing info)

### Advanced Features
- **🧠 Information Theory**: Calculates minimum guesses needed
- **📈 Confidence Meter**: Real-time tracking of deduction progress
- **⏱️ Speed Timer**: Track your solving speed
- **🎯 Elimination System**: Mark suspects as innocent
- **📱 Fully Responsive**: Works on all devices

### Crime Scenarios
- The Museum Diamond Heist
- The Research Lab Data Theft
- The Secret Recipe Theft
- The Five-Star Poisoning
- More scenarios coming soon!

## 🎯 How to Play

1. **Study the Initial Profile**
   - You're shown an innocent suspect's traits
   - Note which traits are green (match), yellow (close), or gray (different)

2. **Find the Pattern**
   - Look for other suspects who would produce the same color pattern
   - Multiple suspects will match initially

3. **Make Strategic Accusations**
   - Choose suspects that will eliminate the most possibilities
   - Use feedback to narrow down options

4. **Deduce the Culprit**
   - Find the guilty party before running out of guesses
   - Optimal play averages 3.5 guesses

### Strategy Tips
- Start with suspects having complete information
- Focus on yellow traits - they're your best clues
- Use the trait spectrum to understand relationships
- Eliminate suspects who can't match the pattern

## 💻 Installation

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0

### Local Setup

```bash
# Clone the repository
git clone https://github.com/mystery-game/Witness-Game-Enhanced.git
cd Witness-Game-Enhanced

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Or start production server
npm start
```

Visit `http://localhost:3000` to play locally.

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with hot reload
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run validate   # Run linting and formatting
npm run clean      # Clean install dependencies
```

### Project Structure

```
guilty-game/
├── index.html          # Complete game (HTML, CSS, JS)
├── server.js           # Express server with security
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── LICENSE            # MIT license
```

### Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Security
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Future Features
DATABASE_URL=postgresql://user:password@localhost:5432/guilty
SESSION_SECRET=your-secret-key-here
ANALYTICS_ID=your-analytics-id
```

## 🚀 Deployment

### Deploy to Render

1. Fork this repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables if needed
6. Deploy!

### Deploy to Heroku

```bash
# Create Heroku app
heroku create your-guilty-game

# Deploy
git push heroku main

# Open game
heroku open
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### Deploy to Railway

1. Connect GitHub repository to Railway
2. Add environment variables
3. Deploy automatically on push

## 🧮 Game Theory

GUILTY uses information theory to ensure puzzles require genuine deduction:

### Entropy Calculation
- Each guess reduces uncertainty about the culprit
- Optimal guesses maximize information gain
- AI agent validates puzzle difficulty

### Minimum Guesses Formula
```
Theoretical Minimum = log₂(viable suspects)
Adjusted Minimum = Theoretical + (Missing Info Penalty)
```

### Difficulty Calibration
- Target: 3.5 average guesses for optimal play
- Win rate: >95% with perfect strategy
- Lucky wins: <10% of victories

## 🔧 Developer Tools

Access developer mode from the main menu:

### Available Tools
1. **Show Culprit**: Reveals current puzzle solution
2. **Run AI Test**: Simulates 100 games with optimal play
3. **Analyze Puzzle**: Shows entropy and viable suspects
4. **Show Optimal Guess**: Recommends best next move

### AI Agent Metrics
```javascript
// Example output
AI Agent Results (100 games):
- Win rate: 96.0%
- Average guesses: 3.48
- Lucky wins: 8%
- Optimal wins: 42%
- Distribution: 1:2%, 2:12%, 3:28%, 4:34%, 5:20%
```

## 🔌 API Reference

### Health Check
```http
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.56,
  "environment": "production"
}
```

### Game Stats (Coming Soon)
```http
GET /api/stats
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write descriptive commit messages
- Update documentation for new features
- Add comments for complex logic
- Test on multiple browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Wordle and The Witness
- Built with Express.js and vanilla JavaScript
- Information theory concepts from Claude Shannon
- Community feedback and contributions

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/mystery-game/Witness-Game-Enhanced/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mystery-game/Witness-Game-Enhanced/discussions)
- **Email**: support@guiltygame.com

---

<div align="center">
  Made with ❤️ by mystery game enthusiasts
  
  ⭐ Star us on GitHub!
</div>
