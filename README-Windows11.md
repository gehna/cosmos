# Cosmos Multiplayer Game - Windows 11 Edition

A real-time multiplayer space game where two players can play together across different computers and browsers. Optimized for Windows 11 with PowerShell commands and Windows-specific troubleshooting.

## Features

- **Real-time Communication**: Players see each other's moves instantly
- **Cross-Platform**: Works on any computer with a web browser
- **Fuel Management**: Select and consume fuel cards to fly
- **Live Updates**: Exchange buttons show the other player's current state
- **Server-Based**: Reliable communication through a Node.js server
- **Windows 11 Optimized**: Tested and optimized for Windows 11

## Prerequisites for Windows 11

### Required Software
- **Node.js** (v16.0 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **Windows Terminal** (recommended) or PowerShell
- **Modern Web Browser** (Chrome, Edge, Firefox, or Safari)

### Windows 11 Specific Requirements
- Windows 11 (Build 22000 or later)
- PowerShell 5.1 or PowerShell 7+ (recommended)
- Windows Defender or compatible antivirus
- Network access for multiplayer communication

## Setup Instructions for Windows 11

### 1. Install Node.js

**Option A: Using Windows Package Manager (winget)**
```powershell
# Open PowerShell as Administrator
winget install OpenJS.NodeJS
```

**Option B: Download from Official Website**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the Windows Installer (.msi)
3. Run the installer with default settings
4. Restart your terminal

**Verify Installation:**
```powershell
node --version
npm --version
```

### 2. Clone or Download the Project

**Using Git (if available):**
```powershell
git clone <repository-url>
cd cosmos
```

**Manual Download:**
1. Download the project files
2. Extract to a folder (e.g., `C:\Users\YourName\Desktop\cosmos`)
3. Open PowerShell in the project directory

### 3. Install Dependencies

```powershell
# Navigate to project directory
cd C:\path\to\cosmos

# Install dependencies
npm install
```

### 4. Configure Windows Firewall (if needed)

```powershell
# Allow Node.js through Windows Firewall (run as Administrator)
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

### 5. Start the Server

```powershell
# Start the server
npm start
```

The server will start on `http://localhost:8080`

### 6. Open the Game

**Player 1 (Host Computer):**
- Open Microsoft Edge or your preferred browser
- Navigate to: `http://localhost:8080/player1`
- Or: `http://YOUR_SERVER_IP:8080/player1`

**Player 2 (Client Computer):**
- Open Microsoft Edge or your preferred browser
- Navigate to: `http://YOUR_SERVER_IP:8080/player2`
- Replace `YOUR_SERVER_IP` with the actual IP address of the host computer

## Finding Your Server IP Address (Windows 11)

### Method 1: Using PowerShell
```powershell
# Get your local IP address
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"}
```

### Method 2: Using Command Prompt
```cmd
ipconfig | findstr "IPv4"
```

### Method 3: Using Windows Settings
1. Open Settings (Win + I)
2. Go to Network & Internet
3. Click on your connection (Wi-Fi or Ethernet)
4. Scroll down to find your IP address

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

## Windows 11 Specific Troubleshooting

### PowerShell Execution Policy Issues
```powershell
# If you get execution policy errors, run this (as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node.js Not Found Error
```powershell
# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Port 8080 Already in Use
```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Windows Defender Blocking Connection
1. Open Windows Security (Win + I → Privacy & Security → Windows Security)
2. Go to Firewall & Network Protection
3. Click "Allow an app through firewall"
4. Add Node.js or allow port 8080

### Network Discovery Issues
```powershell
# Enable network discovery (run as Administrator)
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes
```

### Browser Compatibility Issues
- **Microsoft Edge**: Recommended for best performance
- **Chrome**: Full compatibility
- **Firefox**: Full compatibility
- **Safari**: May require additional CORS settings

## Development Mode (Windows 11)

### Using Windows Terminal (Recommended)
```powershell
# Install nodemon globally
npm install -g nodemon

# Run in development mode
npm run dev
```

### Using Visual Studio Code
1. Open the project folder in VS Code
2. Open integrated terminal (Ctrl + `)
3. Run `npm run dev`

### Hot Reload Setup
```powershell
# Install nodemon as dev dependency
npm install --save-dev nodemon

# The package.json already includes the dev script
npm run dev
```

## Performance Optimization for Windows 11

### Windows Terminal Settings
1. Open Windows Terminal
2. Go to Settings (Ctrl + ,)
3. Enable GPU acceleration
4. Set font to "Cascadia Code" or "JetBrains Mono"

### Browser Optimization
- Enable hardware acceleration
- Disable unnecessary extensions
- Clear browser cache if experiencing issues

### Network Optimization
```powershell
# Optimize network settings for gaming
netsh int tcp set global autotuninglevel=normal
netsh int tcp set global chimney=enabled
```

## File Structure

```
cosmos-multiplayer/
├── server.js                    # Main server file
├── package.json                 # Dependencies and scripts
├── player1.json                 # Player 1 game state
├── player2.json                 # Player 2 game state
├── player1-multiplayer.html     # Player 1 interface
├── player2-multiplayer.html     # Player 2 interface
├── cosmos-layout.html           # Main layout file
├── buttons.html                 # Button components
├── index.html                   # Entry point
├── firsts-screen.png            # Game assets
├── README-Windows11.md          # This file
└── README-multiplayer.md        # Original README
```

## Advanced Configuration

### Custom Port Configuration
```powershell
# Set custom port (modify server.js)
$env:PORT = "8080"
npm start
```

### SSL/HTTPS Setup (Optional)
```powershell
# Install SSL certificate (for production)
# This requires additional setup with certificates
```

### Windows Service Installation (Advanced)
```powershell
# Install as Windows service using PM2
npm install -g pm2
pm2 start server.js --name "cosmos-game"
pm2 startup
pm2 save
```

## Support and Resources

### Windows 11 Specific Resources
- [Windows 11 Developer Documentation](https://docs.microsoft.com/en-us/windows/dev-environment/)
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [Node.js on Windows](https://nodejs.org/en/download/package-manager/#windows)

### Common Issues and Solutions
- **Antivirus blocking**: Add Node.js to exclusions
- **Windows Update issues**: Ensure Windows is up to date
- **Network adapter problems**: Update network drivers
- **PowerShell issues**: Update to PowerShell 7+

## License

MIT License - See LICENSE file for details

---

**Note**: This README is specifically optimized for Windows 11. For other operating systems, refer to the original README-multiplayer.md file.
