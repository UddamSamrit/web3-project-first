// Web3 Transaction App - Real Wallet Experience
// This mimics real MetaMask/wallet interactions

let provider;
let signer;
let userAddress;
let isConnected = false;
let storageContract = null;

// Store seen transaction hashes to avoid duplicates
const seenTransactions = new Set();

// SimpleStorage Contract ABI
const SIMPLE_STORAGE_ABI = [
    "function getValue() view returns (uint256)",
    "function setValue(uint256 _value)",
    "function getOwner() view returns (address)",
    "function owner() view returns (address)",
    "event ValueChanged(uint256 newValue, address indexed changedBy)"
];

// Hardhat local network configuration
const HARDHAT_NETWORK = {
    chainId: '0x539', // 1337 in hex
    chainName: 'Hardhat Local',
    rpcUrls: ['http://127.0.0.1:8545'],
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
    }
};

// Initialize on page load
window.addEventListener('load', async () => {
    console.log('🌐 Web3 App Initialized');
    checkConnection();
});

// Check if already connected
async function checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
        // Real MetaMask detected
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectToMetaMask();
            }
        } catch (error) {
            console.log('No MetaMask connection');
        }
    }
    
    // Always allow connection to Hardhat via Ethers.js
    updateUI();
}

// Connect Wallet Function
async function connectWallet() {
    const statusEl = document.getElementById('status');
    
    try {
        // Try MetaMask first (real wallet)
        if (typeof window.ethereum !== 'undefined') {
            await connectToMetaMask();
        } else {
            // Fallback to direct Hardhat connection (for testing)
            await connectToHardhat();
        }
    } catch (error) {
        showStatus('error', `Connection failed: ${error.message}`);
        console.error('Connection error:', error);
    }
}

// Connect to MetaMask (Real Wallet)
async function connectToMetaMask() {
    console.log('🔗 Connecting to MetaMask...');
    
    // Request account access
    const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
    });
    
    // Check if we need to switch network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (chainId !== HARDHAT_NETWORK.chainId) {
        try {
            // Try to switch to Hardhat network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: HARDHAT_NETWORK.chainId }],
            });
        } catch (switchError) {
            // Network doesn't exist, add it
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [HARDHAT_NETWORK],
                });
            } else {
                throw switchError;
            }
        }
    }
    
    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    
    isConnected = true;
    showStatus('success', '✅ Connected to MetaMask!');
    updateUI();
    
    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
}

// Connect directly to Hardhat (Testing without MetaMask)
async function connectToHardhat() {
    console.log('🔗 Connecting to Hardhat...');
    
    // Connect to Hardhat node
    provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    
    // Get accounts using RPC call (ethers v6 compatible)
    const accounts = await provider.send('eth_accounts', []);
    if (!accounts || accounts.length === 0) {
        throw new Error('No accounts available. Make sure Hardhat node is running!');
    }
    
    // Get the first account address (ensure it's a string)
    const firstAccount = Array.isArray(accounts) ? accounts[0] : (accounts.address || accounts);
    const accountAddress = typeof firstAccount === 'string' ? firstAccount : firstAccount.address;
    
    // Use first account as signer
    signer = await provider.getSigner(accountAddress);
    userAddress = accountAddress;
    
    isConnected = true;
    showStatus('success', '✅ Connected to Hardhat Local Network!');
    updateUI();
}

// Handle account changes (MetaMask)
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        connectToMetaMask();
    }
}

// Handle chain changes (MetaMask)
function handleChainChanged(chainId) {
    window.location.reload();
}

// Disconnect Wallet
function disconnectWallet() {
    provider = null;
    signer = null;
    userAddress = null;
    isConnected = false;
    
    showStatus('info', 'Disconnected from wallet');
    updateUI();
}

// Send Transaction
async function sendTransaction() {
    const recipientAddress = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('amount').value;
    const sendBtn = document.getElementById('sendBtn');
    const statusEl = document.getElementById('status');
    
    // Validation
    if (!isConnected) {
        showStatus('error', 'Please connect your wallet first!');
        return;
    }
    
    if (!recipientAddress || !ethers.isAddress(recipientAddress)) {
        showStatus('error', 'Invalid recipient address!');
        return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
        showStatus('error', 'Please enter a valid amount!');
        return;
    }
    
    try {
        // Disable button and show loading
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading"></span> Sending...';
        showStatus('info', '⏳ Transaction pending...');
        
        // Convert ETH to wei
        const amountWei = ethers.parseEther(amount);
        
        // Get current balance to verify
        const balance = await provider.getBalance(userAddress);
        if (balance < amountWei) {
            throw new Error('Insufficient balance!');
        }
        
        // Send transaction
        console.log(`📤 Sending ${amount} ETH to ${recipientAddress}...`);
        const tx = await signer.sendTransaction({
            to: recipientAddress,
            value: amountWei
        });
        
        showStatus('info', `⏳ Transaction sent! Hash: ${tx.hash}\nWaiting for confirmation...`);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        // Success!
        showStatus('success', `✅ Transaction confirmed!\nBlock: ${receipt.blockNumber}\nGas Used: ${receipt.gasUsed.toString()}`);
        
        // Add to transaction history
        addToHistory(tx.hash, amount, recipientAddress, receipt.blockNumber, false);
        
        // Clear form
        document.getElementById('recipientAddress').value = '';
        document.getElementById('amount').value = '';
        
        // Update balance
        await updateBalance();
        
    } catch (error) {
        console.error('Transaction error:', error);
        showStatus('error', `Transaction failed: ${error.message}`);
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = 'Send Transaction';
    }
}

// Update UI
async function updateUI() {
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const sendBtn = document.getElementById('sendBtn');
    const addressEl = document.getElementById('userAddress');
    const balanceEl = document.getElementById('userBalance');
    const statusEl = document.getElementById('connectionStatus');
    const receiveAddressEl = document.getElementById('receiveAddress');
    
    if (isConnected && signer) {
        connectBtn.style.display = 'none';
        disconnectBtn.style.display = 'block';
        sendBtn.disabled = false;
        addressEl.textContent = userAddress;
        receiveAddressEl.textContent = userAddress;
        statusEl.textContent = '✅ Connected';
        statusEl.style.color = '#28a745';
        
        await updateBalance();
    } else {
        connectBtn.style.display = 'block';
        disconnectBtn.style.display = 'none';
        sendBtn.disabled = true;
        addressEl.textContent = '-';
        receiveAddressEl.textContent = 'Connect wallet to see your address';
        balanceEl.textContent = '0 ETH';
        statusEl.textContent = 'Not Connected';
        statusEl.style.color = '#dc3545';
    }
}

// Copy Address Function
function copyAddress() {
    if (!userAddress) {
        showStatus('error', 'Please connect wallet first!');
        return;
    }
    
    navigator.clipboard.writeText(userAddress).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
        showStatus('success', 'Address copied to clipboard! Share this with the sender.');
    }).catch(err => {
        showStatus('error', 'Failed to copy address');
    });
}

// Update Balance
async function updateBalance() {
    if (!signer) return;
    
    try {
        const balance = await provider.getBalance(userAddress);
        const balanceETH = ethers.formatEther(balance);
        document.getElementById('userBalance').textContent = `${parseFloat(balanceETH).toFixed(4)} ETH`;
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

// Show Status Message
function showStatus(type, message) {
    const statusEl = document.getElementById('status');
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
    statusEl.style.whiteSpace = 'pre-line';
}

// Add Transaction to History
function addToHistory(txHash, amount, to, blockNumber, isIncoming = false) {
    // Skip if we've already added this transaction
    if (seenTransactions.has(txHash)) {
        return;
    }
    seenTransactions.add(txHash);
    
    const historyEl = document.getElementById('txHistory');
    
    // Remove "no transactions" message if exists
    if (historyEl.querySelector('p')) {
        historyEl.innerHTML = '';
    }
    
    const txItem = document.createElement('div');
    txItem.className = 'transaction-item';
    txItem.id = `tx-${txHash}`;
    const direction = isIncoming ? '📥 Received' : '📤 Sent';
    const amountDisplay = isIncoming ? `+${amount} ETH` : `-${amount} ETH`;
    const amountColor = isIncoming ? '#28a745' : '#dc3545';
    
    txItem.innerHTML = `
        <div>
            <div style="font-size: 0.85em; color: #666; margin-bottom: 5px;">${direction}</div>
            <div class="tx-hash">${txHash}</div>
            <div style="font-size: 0.85em; color: #666; margin-top: 5px;">
                ${isIncoming ? 'From' : 'To'}: ${to.substring(0, 10)}...${to.substring(to.length - 8)} | Block: ${blockNumber}
            </div>
        </div>
        <div class="tx-amount" style="color: ${amountColor}">${amountDisplay}</div>
    `;
    
    historyEl.insertBefore(txItem, historyEl.firstChild);
}

// Check for incoming transactions
async function checkIncomingTransactions() {
    if (!isConnected || !userAddress || !provider) return;
    
    try {
        // Get current block
        const currentBlock = await provider.getBlockNumber();
        
        // Check last 50 blocks for transactions to this address (increased from 10)
        const blocksToCheck = Math.min(50, currentBlock + 1);
        let foundNew = false;
        
        for (let i = 0; i < blocksToCheck && currentBlock - i >= 0; i++) {
            const block = await provider.getBlock(currentBlock - i, true);
            if (block && block.transactions) {
                for (const tx of block.transactions) {
                    // Skip if we've already seen this transaction
                    if (seenTransactions.has(tx.hash)) continue;
                    
                    // Check if this is an incoming transaction
                    if (tx.to && 
                        tx.to.toLowerCase() === userAddress.toLowerCase() && 
                        tx.from.toLowerCase() !== userAddress.toLowerCase() &&
                        tx.value > 0) {
                        
                        // This is an incoming transaction
                        const receipt = await provider.getTransactionReceipt(tx.hash);
                        if (receipt) {
                            const amount = ethers.formatEther(tx.value);
                            addToHistory(tx.hash, amount, tx.from, receipt.blockNumber, true);
                            seenTransactions.add(tx.hash);
                            foundNew = true;
                            console.log('📥 Found incoming transaction:', tx.hash, amount, 'ETH');
                        }
                    }
                }
            }
        }
        
        if (foundNew) {
            // Update balance when new transaction found
            await updateBalance();
        }
    } catch (error) {
        console.error('Error checking incoming transactions:', error);
    }
}

// Manual refresh function
async function refreshTransactions() {
    if (!isConnected) {
        showStatus('error', 'Please connect your wallet first!');
        return;
    }
    
    showStatus('info', '🔄 Refreshing transactions...');
    await checkIncomingTransactions();
    await updateBalance();
    showStatus('success', '✅ Transactions refreshed!');
}

// Auto-update balance and check for incoming transactions every 5 seconds
setInterval(() => {
    if (isConnected) {
        updateBalance();
        checkIncomingTransactions();
    }
}, 5000);

// Check for incoming transactions when connected
if (isConnected) {
    setTimeout(() => checkIncomingTransactions(), 2000);
}

// Connect to SimpleStorage Contract
async function connectToContract() {
    const contractAddress = document.getElementById('contractAddress').value.trim();
    const statusEl = document.getElementById('storageStatus');
    const contractInfo = document.getElementById('contractInfo');
    
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
        showStorageStatus('error', 'Please enter a valid contract address!');
        return;
    }
    
    if (!isConnected || !signer) {
        showStorageStatus('error', 'Please connect your wallet first!');
        return;
    }
    
    try {
        showStorageStatus('info', 'Connecting to contract...');
        
        // Create contract instance
        storageContract = new ethers.Contract(contractAddress, SIMPLE_STORAGE_ABI, signer);
        
        // Test connection by reading owner
        const owner = await storageContract.getOwner();
        
        // Show contract info section
        contractInfo.style.display = 'block';
        document.getElementById('contractOwner').textContent = owner;
        
        // Refresh stored value
        await refreshStoredValue();
        
        showStorageStatus('success', '✅ Connected to SimpleStorage contract!');
        
        // Enable store button
        document.getElementById('storeBtn').disabled = false;
        
        // Listen for ValueChanged events
        storageContract.on('ValueChanged', (newValue, changedBy, event) => {
            console.log('ValueChanged event:', { newValue: newValue.toString(), changedBy, blockNumber: event.blockNumber });
            refreshStoredValue();
            showStorageStatus('success', `✅ Value updated to ${newValue.toString()} by ${changedBy}`);
        });
        
    } catch (error) {
        console.error('Contract connection error:', error);
        showStorageStatus('error', `Failed to connect: ${error.message}`);
        contractInfo.style.display = 'none';
    }
}

// Store value in contract
async function storeValue() {
    const valueInput = document.getElementById('storageValue').value;
    const storeBtn = document.getElementById('storeBtn');
    const statusEl = document.getElementById('storageStatus');
    
    if (!storageContract) {
        showStorageStatus('error', 'Please connect to contract first!');
        return;
    }
    
    if (!valueInput || isNaN(valueInput) || parseFloat(valueInput) < 0) {
        showStorageStatus('error', 'Please enter a valid number!');
        return;
    }
    
    try {
        storeBtn.disabled = true;
        storeBtn.innerHTML = '<span class="loading"></span> Storing...';
        showStorageStatus('info', '⏳ Storing value on blockchain...');
        
        const value = BigInt(valueInput);
        const tx = await storageContract.setValue(value);
        
        showStorageStatus('info', `⏳ Transaction sent! Hash: ${tx.hash}\nWaiting for confirmation...`);
        
        const receipt = await tx.wait();
        
        showStorageStatus('success', `✅ Value stored successfully!\nBlock: ${receipt.blockNumber}\nGas Used: ${receipt.gasUsed.toString()}`);
        
        // Clear input
        document.getElementById('storageValue').value = '';
        
        // Refresh stored value
        await refreshStoredValue();
        
        // Add to transaction history
        addToHistory(tx.hash, '0 ETH', storageContract.target, receipt.blockNumber, false);
        
    } catch (error) {
        console.error('Store value error:', error);
        showStorageStatus('error', `Failed to store value: ${error.message}`);
    } finally {
        storeBtn.disabled = false;
        storeBtn.innerHTML = 'Store Value';
    }
}

// Refresh stored value from contract
async function refreshStoredValue() {
    if (!storageContract) return;
    
    try {
        const value = await storageContract.getValue();
        document.getElementById('storedValue').textContent = value.toString();
    } catch (error) {
        console.error('Error refreshing value:', error);
        document.getElementById('storedValue').textContent = 'Error loading';
    }
}

// Show storage status message
function showStorageStatus(type, message) {
    const statusEl = document.getElementById('storageStatus');
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
    statusEl.style.whiteSpace = 'pre-line';
}

