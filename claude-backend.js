// Backend for Claude API integration
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Main routes - serve HTML files
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'guilty-game-v2.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving guilty-game-v2.html:', err);
            res.status(404).send('GUILTY game not found');
        }
    });
});

// The Witness game route
app.get('/witness', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(404).send('The Witness game not found. Please make sure the game files are installed.');
        }
    });
});

app.get('/guilty', (req, res) => {
    const filePath = path.join(__dirname, 'guilty-game.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving guilty-game.html:', err);
            res.status(404).send('GUILTY game not found. Please make sure the game files are installed.');
        }
    });
});

app.get('/guilty-v2', (req, res) => {
    const filePath = path.join(__dirname, 'guilty-game-v2.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving guilty-game-v2.html:', err);
            res.status(404).send('GUILTY v2 game not found. Please make sure the game files are installed.');
        }
    });
});

app.get('/twenty', (req, res) => {
    const filePath = path.join(__dirname, 'twenty-game.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving twenty-game.html:', err);
            res.status(404).send('TWENTY game not found. Please make sure the game files are installed.');
        }
    });
});

// API Status endpoint
app.get('/api/status', (req, res) => {
    const apiConfigured = !!(process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY);
    res.json({ 
        apiConfigured,
        status: 'running',
        games: ['witness', 'guilty', 'guilty-v2', 'twenty']
    });
});

// Store game sessions
const sessions = new Map();

// Twenty Questions game sessions
const twentySessions = new Map();

// Initialize a new game session
app.post('/api/new-game', (req, res) => {
    const { mystery, witness } = req.body;
    const sessionId = Date.now().toString();
    
    sessions.set(sessionId, {
        mystery,
        witness,
        questionsAsked: 0,
        cluesRevealed: []
    });
    
    res.json({ sessionId });
});

// Ask witness a question
app.post('/api/ask-witness', async (req, res) => {
    const { sessionId, question, questionNumber, maxQuestions } = req.body;
    const session = sessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    try {
        const response = await generateClaudeResponse(
            session.witness,
            question,
            questionNumber,
            session.mystery
        );
        
        res.json({
            response: response.text,
            cluesRevealed: response.clues
        });
    } catch (error) {
        console.error('Claude API error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// Claude API integration
async function generateClaudeResponse(witness, question, questionNumber, mystery) {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    
    if (!CLAUDE_API_KEY) {
        throw new Error('Claude API key not configured');
    }
    
    // Create the prompt for Claude
    const prompt = `You are playing the role of ${witness} in a mystery game. You are the only witness to a crime.

Your personality: ${getWitnessPersonality(witness)}

The player is asking you questions to solve the mystery. This is question ${questionNumber} of their allowed questions.

Important rules:
1. Stay in character as the witness
2. Be helpful if the player is kind, be difficult if they are rude
3. Provide clues when asked good questions
4. Don't directly reveal the culprit
5. React emotionally according to your personality
6. Keep responses under 100 words

Player's question: "${question}"

Respond as the witness would:`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                max_tokens: 200,
                temperature: 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            text: data.content[0].text,
            clues: [] // You could analyze the response to extract clues
        };
    } catch (error) {
        console.error('Error calling Claude API:', error);
        throw error;
    }
}

// Get witness personality details
function getWitnessPersonality(witness) {
    const personalities = {
        "The Paranoid Postdoc": "You are Dr. James Wright, extremely paranoid and convinced everyone is trying to steal your research. You trust no one and see conspiracies everywhere. You respond better to kindness.",
        "The Nervous Night Guard": "You are Eddie Molina, very nervous and jumpy about your shift. You're defensive and sweating because you're worried about losing your job.",
        "The Ambitious Assistant": "You are Lisa Park, calculating and ambitious. You only share information if it benefits your career. You respect power and ambition.",
        "The Superstitious Stagehand": "You are Tommy Chen, deeply superstitious. You see omens and signs everywhere, especially about the 'cursed' play.",
        "The Gossipy Sommelier": "You are François Dubois, you love gossip and know everyone's secrets. You're eager to share juicy details about relationships and scandals.",
        "The Bitter Butler": "You are Reginald Hayes, you've served the family for 30 years and despise them all. You're bitter and enjoy revealing their flaws.",
        "The Paranoid Purser": "You are Janet Wu, convinced everyone on the ship is smuggling something. You're suspicious of everything and everyone."
    };
    
    return personalities[witness] || "You are a witness to a crime.";
}

// GUILTY game endpoints
app.post('/api/guilty/new-game', (req, res) => {
    const { crime, culprit } = req.body;
    const sessionId = 'guilty-' + Date.now().toString();
    
    sessions.set(sessionId, {
        game: 'guilty',
        crime,
        culprit,
        guesses: []
    });
    
    res.json({ sessionId });
});

// Get witness reaction for GUILTY game
app.post('/api/guilty/witness-reaction', async (req, res) => {
    const { sessionId, guess, guessNumber, culprit } = req.body;
    const session = sessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    try {
        const reaction = await generateGuiltyReaction(guess, culprit, guessNumber);
        res.json({ reaction });
    } catch (error) {
        console.error('Claude API error:', error);
        res.status(500).json({ error: 'Failed to generate reaction' });
    }
});

// Generate GUILTY witness reaction
async function generateGuiltyReaction(guess, culprit, guessNumber) {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!CLAUDE_API_KEY) {
        throw new Error('Claude API key not configured');
    }
    
    // Count matching traits
    let matchingTraits = 0;
    const traits = ['job', 'age', 'hair', 'motive', 'alibi'];
    traits.forEach(trait => {
        if (guess[trait] === culprit[trait]) matchingTraits++;
    });
    
    const isCorrect = guess.name === culprit.name;
    
    const prompt = `You are a witness to a museum diamond heist. The player just guessed a suspect.

Guess #${guessNumber} of 4
Suspect guessed: ${guess.name}
Matching traits: ${matchingTraits}/5
Correct culprit: ${isCorrect ? 'YES' : 'NO'}

Generate a brief (under 30 words) witness reaction that:
- If correct: Confirms excitedly
- If 3+ traits match: Indicates they're very close
- If 1-2 traits match: Suggests some details are right
- If 0 traits match: Indicates they're wrong

Keep it simple and don't reveal specific traits. React naturally as a nervous witness.`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                max_tokens: 100,
                temperature: 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        throw error;
    }
}

// Twenty Questions - New Game
app.post('/api/twenty/new-game', async (req, res) => {
    try {
        const { object, category } = req.body;
        const sessionId = crypto.randomBytes(16).toString('hex');
        
        twentySessions.set(sessionId, {
            object,
            category,
            questionsAsked: [],
            startTime: Date.now()
        });
        
        res.json({ sessionId });
    } catch (error) {
        console.error('Error starting twenty questions game:', error);
        res.status(500).json({ error: 'Failed to start game' });
    }
});

// Twenty Questions - Ask Question
app.post('/api/twenty/ask-question', async (req, res) => {
    try {
        const { sessionId, question, questionNumber } = req.body;
        const session = twentySessions.get(sessionId);
        
        if (!session) {
            return res.status(400).json({ error: 'Invalid session' });
        }
        
        // Build context
        const previousQuestions = session.questionsAsked.map((qa, i) => 
            `Q${i + 1}: ${qa.question}\nA: ${qa.answer}`
        ).join('\n');
        
        const prompt = `You are playing 20 Questions. The secret object is: ${session.object} (Category: ${session.category})

The player has asked ${questionNumber} question(s) so far.

Previous questions and answers:
${previousQuestions}

Current question: ${question}

Rules:
1. Answer only with YES, NO, or SOMETIMES/IT DEPENDS
2. Be accurate but don't give away the answer directly
3. If the question is unclear, lean towards "It depends" or ask for clarification
4. Consider common interpretations of the object

Respond in JSON format:
{
    "type": "yes" | "no" | "maybe",
    "text": "Brief, natural response (max 50 characters)"
}`;

        const completion = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 100,
            messages: [{ 
                role: 'user', 
                content: prompt 
            }]
        });
        
        const responseText = completion.content[0].text;
        let answer;
        
        try {
            answer = JSON.parse(responseText);
        } catch (e) {
            // Fallback if JSON parsing fails
            const lower = responseText.toLowerCase();
            if (lower.includes('yes')) {
                answer = { type: 'yes', text: 'Yes!' };
            } else if (lower.includes('no')) {
                answer = { type: 'no', text: 'No.' };
            } else {
                answer = { type: 'maybe', text: 'It depends...' };
            }
        }
        
        // Store the Q&A
        session.questionsAsked.push({ question, answer: answer.text });
        
        res.json({ answer });
        
    } catch (error) {
        console.error('Error processing twenty questions:', error);
        res.status(500).json({ error: 'Failed to process question' });
    }
});

// Catch-all route for 404 errors - MUST BE LAST ROUTE
app.get('*', (req, res) => {
    console.log(`404 - Route not found: ${req.path}`);
    res.status(404).send(`
        <html>
            <head>
                <title>404 - Not Found</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background-color: #0f0f0f;
                        color: #fff;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                    }
                    h1 { font-size: 48px; margin-bottom: 20px; }
                    a { color: #4ecdc4; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>The page "${req.path}" doesn't exist.</p>
                <p><a href="/">← Back to Game Selection</a></p>
            </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Claude backend running on port ${PORT}`);
    console.log(`API Key configured: ${process.env.CLAUDE_API_KEY ? 'Yes' : 'No'}`);
}); 