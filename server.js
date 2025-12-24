// Simple HTTP server to serve the web app
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Remove query string and decode URI
    let urlPath = req.url.split('?')[0];
    
    // Serve files from public directory
    let filePath = path.join(__dirname, 'public', urlPath === '/' ? 'index.html' : urlPath);
    
    // Security: prevent directory traversal
    const publicDir = path.join(__dirname, 'public');
    if (!filePath.startsWith(publicDir)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 - Forbidden</h1>', 'utf-8');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🌐 Web3 Transaction App Server');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log('\n📋 Instructions:');
    console.log('  1. Make sure Hardhat node is running: npm run node');
    console.log('  2. Open http://localhost:3000 in your browser');
    console.log('  3. Click "Connect Wallet" to connect');
    console.log('  4. Send transactions like a real dApp!\n');
    console.log('💡 Tip: You can use MetaMask or connect directly to Hardhat');
    console.log('═══════════════════════════════════════════════════════════\n');
});

