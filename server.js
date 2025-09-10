const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = 8080;

// Enable CORS for cross-origin requests
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Game data file path
const GAME_DATA_FILE = 'game-data.json';

// Initialize game data if it doesn't exist
function initializeGameData() {
    if (!fs.existsSync(GAME_DATA_FILE)) {
        const initialData = {
            player1: {
                name: "Player 1",
                cards: [23, 7, 41, 15, 33, 2, 48, 19, 36, 5, 29, 44, 12, 38, 21],
                fuel: [23, 7, 41, 15, 33],
                lastUpdate: Date.now()
            },
            player2: {
                name: "Player 2", 
                cards: [14, 39, 6, 27, 45, 11, 34, 8, 47, 22, 16, 43, 3, 37, 26],
                fuel: [14, 39, 6, 27, 45],
                lastUpdate: Date.now()
            }
        };
        fs.writeFileSync(GAME_DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('Game data initialized');
    }
}

// Read game data
function readGameData() {
    try {
        const data = fs.readFileSync(GAME_DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading game data:', error);
        return null;
    }
}

// Write game data
function writeGameData(data) {
    try {
        fs.writeFileSync(GAME_DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing game data:', error);
        return false;
    }
}

// Routes
app.get('/api/game-data', (req, res) => {
    const timestamp = new Date().toISOString();
    const gameData = readGameData();
    
    if (gameData) {
        console.log(`📊 [${timestamp}] Game data requested - Player1 fuel: ${gameData.player1.fuel.length}, Player2 fuel: ${gameData.player2.fuel.length}`);
        res.json(gameData);
    } else {
        console.log(`❌ [${timestamp}] ERROR: Failed to read game data`);
        res.status(500).json({ error: 'Failed to read game data' });
    }
});

app.post('/api/update-player/:playerId', (req, res) => {
    const { playerId } = req.params;
    const { cards, fuel } = req.body;
    const timestamp = new Date().toISOString();
    
    console.log(`\n🚀 [${timestamp}] FLY BUTTON CLICKED!`);
    console.log(`   Player: ${playerId.toUpperCase()}`);
    console.log(`   Cards before: ${JSON.stringify(cards)}`);
    console.log(`   Fuel before: ${JSON.stringify(fuel)}`);
    console.log(`   Fuel count: ${fuel ? fuel.length : 'undefined'}`);
    
    if (!['player1', 'player2'].includes(playerId)) {
        console.log(`   ❌ ERROR: Invalid player ID: ${playerId}`);
        return res.status(400).json({ error: 'Invalid player ID' });
    }
    
    const gameData = readGameData();
    if (!gameData) {
        console.log(`   ❌ ERROR: Failed to read game data`);
        return res.status(500).json({ error: 'Failed to read game data' });
    }
    
    // Log previous state
    const previousCards = gameData[playerId].cards;
    const previousFuel = gameData[playerId].fuel;
    console.log(`   Previous cards: ${JSON.stringify(previousCards)}`);
    console.log(`   Previous fuel: ${JSON.stringify(previousFuel)}`);
    
    // Update player data
    gameData[playerId].cards = cards;
    gameData[playerId].fuel = fuel;
    gameData[playerId].lastUpdate = Date.now();
    
    console.log(`   Cards after: ${JSON.stringify(cards)}`);
    console.log(`   Fuel after: ${JSON.stringify(fuel)}`);
    console.log(`   Fuel consumed: ${previousFuel ? previousFuel.length - fuel.length : 'unknown'}`);
    console.log(`   ✅ Update successful for ${playerId}`);
    
    if (writeGameData(gameData)) {
        console.log(`   💾 Game data saved to file`);
        res.json({ success: true, data: gameData });
    } else {
        console.log(`   ❌ ERROR: Failed to save game data`);
        res.status(500).json({ error: 'Failed to update game data' });
    }
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Send current game data to newly connected client
    const gameData = readGameData();
    if (gameData) {
        socket.emit('gameData', gameData);
    }
    
    // Handle player data updates
    socket.on('updatePlayer', (data) => {
        const { playerId, cards, fuel } = data;
        const timestamp = new Date().toISOString();
        
        console.log(`\n🚀 [${timestamp}] PLAYER UPDATE!`);
        console.log(`   Player: ${playerId.toUpperCase()}`);
        console.log(`   Cards: ${JSON.stringify(cards)}`);
        console.log(`   Fuel: ${JSON.stringify(fuel)}`);
        
        if (!['player1', 'player2'].includes(playerId)) {
            console.log(`   ❌ ERROR: Invalid player ID: ${playerId}`);
            return;
        }
        
        const gameData = readGameData();
        if (!gameData) {
            console.log(`   ❌ ERROR: Failed to read game data`);
            return;
        }
        
        // Update player data
        gameData[playerId].cards = cards;
        gameData[playerId].fuel = fuel;
        gameData[playerId].lastUpdate = Date.now();
        
        if (writeGameData(gameData)) {
            console.log(`   ✅ Update successful for ${playerId}`);
            // Broadcast update to all connected clients
            io.emit('playerUpdated', { playerId, gameData });
        } else {
            console.log(`   ❌ ERROR: Failed to save game data`);
        }
    });
    
    // Handle fuel selection updates
    socket.on('fuelSelection', (data) => {
        const { playerId, selectedFuel } = data;
        console.log(`⛽ [${new Date().toISOString()}] Fuel selection update from ${playerId}: ${selectedFuel.length} cards selected`);
        
        // Broadcast fuel selection to all clients
        io.emit('fuelSelectionUpdate', { playerId, selectedFuel });
    });
    
    // Handle game actions
    socket.on('gameAction', (data) => {
        const { playerId, action, details } = data;
        const timestamp = new Date().toISOString();
        
        console.log(`🎮 [${timestamp}] Game action from ${playerId}: ${action}`);
        if (details) {
            console.log(`   Details: ${JSON.stringify(details)}`);
        }
        
        // Broadcast action to all clients
        io.emit('gameActionUpdate', { playerId, action, details });
    });
    
    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// Serve the HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/player1', (req, res) => {
    res.sendFile(path.join(__dirname, 'player1-enhanced.html'));
});

app.get('/player2', (req, res) => {
    res.sendFile(path.join(__dirname, 'player2-enhanced.html'));
});

// Initialize and start server
initializeGameData();
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎮 ==========================================`);
    console.log(`🚀 COSMOS MULTIPLAYER SERVER STARTED!`);
    console.log(`🌐 Server running on all network interfaces`);
    console.log(`🔌 WebSocket support enabled for real-time communication`);
    console.log(`👤 Player 1: http://localhost:${PORT}/player1`);
    console.log(`👤 Player 2: http://localhost:${PORT}/player2`);
    console.log(`🌍 Or use your IP address:`);
    console.log(`👤 Player 1: http://192.168.6.1:${PORT}/player1`);
    console.log(`👤 Player 2: http://192.168.6.1:${PORT}/player2`);
    console.log(`👤 Player 1: http://192.168.50.57:${PORT}/player1`);
    console.log(`👤 Player 2: http://192.168.50.57:${PORT}/player2`);
    console.log(`📝 Enhanced logging enabled for real-time updates`);
    console.log(`🎮 ==========================================\n`);
});
