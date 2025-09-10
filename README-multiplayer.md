# Cosmos Multiplayer Game

A real-time multiplayer space game where two players can play together across different computers and browsers.

## Features

- **Real-time Communication**: Players see each other's moves instantly
- **Cross-Platform**: Works on any computer with a web browser
- **Fuel Management**: Select and consume fuel cards to fly
- **Live Updates**: Exchange buttons show the other player's current state
- **Server-Based**: Reliable communication through a Node.js server

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on `http://localhost:8080`

### 3. Open the Game

**Player 1 (Computer 1):**
- Open browser and go to: `http://localhost:8080/player1`
- Or: `http://YOUR_SERVER_IP:8080/player1`

**Player 2 (Computer 2):**
- Open browser and go to: `http://YOUR_SERVER_IP:8080/player2`
- Replace `YOUR_SERVER_IP` with the actual IP address of Computer 1

## How to Play

### Player 1 (Green Theme)
1. Select fuel cards by clicking them (they turn gold when selected)
2. Click "FLY" to consume the selected fuel
3. Watch Player 2's exchange buttons to see their fuel/cards
4. Use "🔄 REGENERATE" to get new random cards and fuel

### Player 2 (Red Theme)
1. Select fuel cards by clicking them (they turn gold when selected)
2. Click "FLY" to consume the selected fuel
3. Watch Player 1's exchange buttons to see their fuel/cards
4. Use "🔄 REGENERATE" to get new random cards and fuel

### Real-Time Features
- When Player 1 flies, Player 2 sees the change within 1 second
- When Player 2 flies, Player 1 sees the change within 1 second
- Exchange buttons always show the other player's current state
- Connection status shows if you're connected to the server

## Technical Details

- **Server**: Node.js with Express
- **Communication**: REST API with polling
- **Data Storage**: JSON file on server
- **Update Frequency**: 1 second polling
- **Cross-Origin**: CORS enabled for cross-browser support

## Troubleshooting

### Connection Issues
- Make sure the server is running on Computer 1
- Check that both computers can reach the server IP
- Verify firewall settings allow port 8080

### Game Not Updating
- Check browser console for errors
- Verify connection status indicator
- Try refreshing the page

### Server Errors
- Check server console for error messages
- Ensure port 8080 is not in use by another application
- Verify all dependencies are installed

## File Structure

```
cosmos-multiplayer/
├── server.js              # Main server file
├── package.json           # Dependencies
├── game-data.json         # Game state (auto-created)
├── player1-multiplayer.html  # Player 1 interface
├── player2-multiplayer.html  # Player 2 interface
└── README-multiplayer.md  # This file
```

## Development

To run in development mode with auto-restart:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.
