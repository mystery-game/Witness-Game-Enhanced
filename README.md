# 🔍 GUILTY - Daily Detective Mystery Game

A sophisticated daily detective mystery game where logic meets mystery. Inspired by Wordle, but instead of guessing words, you use logical deduction to identify the culprit from a set of suspects—using information theory, pattern recognition, and minimal clues.

---

## 🎮 Gameplay Overview
- **Daily Challenge:** New mystery every 12 hours.
- **Deduction, Not Luck:** Every puzzle is solvable by logic alone. No random guessing required.
- **Trait-Based Reasoning:** Each suspect has 5 traits (Access, Timing, Knowledge, Motive, Behavior). You must deduce the culprit by comparing trait patterns.
- **Limited Information:** Only 1–2 traits are revealed for the initial suspect; the rest are hidden, forcing you to use deduction.
- **Visual Feedback:**
  - 🟩 Green = Exact match
  - 🟨 Yellow = Adjacent/close
  - ⬜ Gray = Different
  - ❓ Unknown = Hidden trait
- **Difficulty Levels:**
  - Easy: 2 traits shown, up to 1 yellow clue, 8 guesses
  - Medium: 2 traits shown, no yellows, 6 guesses
  - Hard: 1 trait shown, no yellows, 4 guesses
- **Endgame Feedback:** See if you solved the case optimally, with feedback on minimum logical guesses (always 2–4).

---

## 🧠 Game Logic & Features
- **Information Theory:** Minimum guesses are calculated using entropy (log₂ of viable suspects), adjusted for missing info, and always between 2–4.
- **Trait Limiting:** Initial clues are strictly limited for challenge and fairness.
- **Pattern Matching:** Only suspects matching the initial pattern remain viable; each guess further narrows the field.
- **Robust JS Architecture:**
  - All game logic is modular and self-contained in a single IIFE (`GameManager`).
  - All helper functions are defined within the module for reliability.
- **Strict Security:**
  - No inline scripts; all JS is modular.
  - Content Security Policy (CSP) enforced via Express/Helmet.
- **Responsive UI:**
  - Modern glassmorphic design, fully responsive for desktop and mobile.
- **Developer Tools:**
  - Show culprit, run AI agent, analyze puzzle, show optimal guess.

---

## 🚀 Tech Stack
- **Frontend:** Vanilla HTML, CSS (glassmorphic, responsive), modular JavaScript
- **Backend:** Node.js, Express.js
- **Security:** Helmet (CSP), CORS, compression
- **Deployment:** Render Web Service (auto-deploy from GitHub)

---

## 🛠️ Local Development

### Prerequisites
- Node.js >= 14
- npm >= 6

### Setup
```bash
git clone https://github.com/mystery-game/Witness-Game-Enhanced.git
cd Witness-Game-Enhanced
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to play locally.

---

## 🧩 Project Structure
```
Witness-Game-Enhanced/
├── public/
│   ├── styles.css
│   └── guilty-game-js.js
├── index.html
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
└── .github/
```

---

## 🏆 Recent Improvements
- **Modularized all JS logic** (no inline handlers)
- **Strict CSP** (no inline scripts/styles)
- **Trait limiting** for initial clues (1–2 only)
- **Robust helper function scoping** (no more undefined errors)
- **Minimum guesses logic** always between 2–4
- **Comprehensive error handling**
- **Modern, accessible UI**

---

## 📄 License
MIT License. See [LICENSE](LICENSE).

---

## 🙏 Acknowledgments
- Inspired by Wordle and The Witness
- Built with Express.js and vanilla JavaScript
- Information theory concepts from Claude Shannon
- Community feedback and contributions

---

## 📞 Contact
- Issues: [GitHub Issues](https://github.com/mystery-game/Witness-Game-Enhanced/issues)
- Email: support@guiltygame.com
