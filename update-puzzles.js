#!/usr/bin/env node

// Script to update puzzles twice daily
// Run this at 12:00 AM EST and 12:00 PM EST

const { execSync } = require('child_process');
const fs = require('fs');

// Get current time in EST
function getESTTime() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const estTime = new Date(utcTime + (3600000 * -5)); // EST is UTC-5
    return estTime;
}

// Get puzzle period
function getPuzzlePeriod() {
    const estTime = getESTTime();
    return estTime.getHours() >= 12 ? 'PM' : 'AM';
}

// Main update function
function updatePuzzles() {
    try {
        console.log('Starting puzzle update...');
        
        const estTime = getESTTime();
        const dateStr = estTime.toISOString().split('T')[0];
        const period = getPuzzlePeriod();
        
        console.log(`Updating puzzles for ${dateStr} ${period} EST`);
        
        // Git pull to ensure we have latest changes
        console.log('Pulling latest changes from git...');
        execSync('git pull origin main', { stdio: 'inherit' });
        
        // Create a timestamp file to track updates
        const updateInfo = {
            lastUpdate: new Date().toISOString(),
            period: period,
            date: dateStr,
            estTime: estTime.toISOString()
        };
        
        fs.writeFileSync('last-update.json', JSON.stringify(updateInfo, null, 2));
        
        // Add and commit the update
        console.log('Committing update...');
        execSync('git add last-update.json', { stdio: 'inherit' });
        execSync(`git commit -m "Puzzle update for ${dateStr} ${period} EST"`, { stdio: 'inherit' });
        
        // Push to GitHub
        console.log('Pushing to GitHub...');
        execSync('git push origin main', { stdio: 'inherit' });
        
        console.log(`✅ Successfully updated puzzles for ${dateStr} ${period} EST`);
        
    } catch (error) {
        console.error('❌ Error updating puzzles:', error.message);
        process.exit(1);
    }
}

// Run the update
updatePuzzles(); 