// Comprehensive diagnostic tool for JSON-RPC errors
const http = require('http');

console.log("🔍 Diagnosing 'Unexpected end of JSON input' Error\n");
console.log("This error means your JSON request is INCOMPLETE or TRUNCATED.\n");

// Common causes and solutions
console.log("📋 Common Causes:\n");

console.log("1. ❌ Missing Content-Length header");
console.log("   Problem: Server doesn't know when request ends");
console.log("   Fix: Always include Content-Length header\n");

console.log("2. ❌ Connection closing before request completes");
console.log("   Problem: Network timeout or connection issue");
console.log("   Fix: Check network connection, increase timeout\n");

console.log("3. ❌ Incomplete JSON string");
console.log("   Problem: JSON is cut off (missing closing brace, etc.)");
console.log("   Fix: Ensure JSON is complete and valid\n");

console.log("4. ❌ Request body not fully sent");
console.log("   Problem: Using streams or async operations incorrectly");
console.log("   Fix: Wait for request to complete before closing\n");

console.log("5. ❌ Using GET instead of POST");
console.log("   Problem: JSON-RPC requires POST method");
console.log("   Fix: Use POST method\n");

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Test with proper implementation
function makeProperRequest(method, params = []) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1
    });

    const options = {
      hostname: '127.0.0.1',
      port: 3045,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody) // CRITICAL!
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ success: true, response: parsed });
        } catch (error) {
          resolve({ success: false, error: error.message, raw: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    // CRITICAL: Write the full body
    req.write(requestBody);
    req.end(); // Don't close until body is written
  });
}

// Test common mistakes
async function testMistakes() {
  console.log("🧪 Testing Common Mistakes:\n");

  // Test 1: Missing Content-Length
  console.log("1. Testing WITHOUT Content-Length header (WRONG):");
  try {
    const requestBody = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1
    });

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3045,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Missing Content-Length!
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            console.log("   ❌ Got error:", parsed.error.message);
          } else {
            console.log("   ⚠️  Might work but unreliable without Content-Length");
          }
        } catch (e) {
          console.log("   ❌ Parse error:", e.message);
        }
      });
    });

    req.on('error', (err) => {
      console.log("   ❌ Connection error:", err.message);
    });

    req.write(requestBody);
    req.end();
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log();

  // Test 2: Incomplete JSON
  console.log("2. Testing with INCOMPLETE JSON (WRONG):");
  try {
    const incompleteJson = '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1'; // Missing }
    
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3045,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(incompleteJson)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            console.log("   ❌ Got error:", parsed.error.message);
            console.log("   💡 This is your error! JSON is incomplete.");
          }
        } catch (e) {
          console.log("   ❌ Parse error:", e.message);
        }
      });
    });

    req.on('error', (err) => {
      console.log("   ❌ Connection error:", err.message);
    });

    req.write(incompleteJson);
    req.end();
    
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log();

  // Test 3: Correct implementation
  console.log("3. Testing CORRECT implementation:");
  try {
    const result = await makeProperRequest("eth_blockNumber", []);
    if (result.success && result.response.result) {
      console.log("   ✅ SUCCESS! Block number:", parseInt(result.response.result, 16));
      console.log("   ✅ This is how you should make requests!");
    }
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log();
}

// Show correct code example
function showCorrectExample() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("✅ CORRECT Implementation Example:\n");
  console.log(`
const http = require('http');

const requestBody = JSON.stringify({
  jsonrpc: "2.0",
  method: "eth_blockNumber",
  params: [],
  id: 1  // Must be a number!
});

const options = {
  hostname: '127.0.0.1',
  port: 8545,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestBody)  // CRITICAL!
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const response = JSON.parse(data);
    console.log(response);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(requestBody);  // Write the body
req.end();  // Close after writing
`);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("💡 Better Solution: Use Ethers.js instead!\n");
  console.log(`
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const blockNumber = await provider.getBlockNumber();
console.log("Block number:", blockNumber);
`);
  console.log("\nThis handles all the JSON-RPC details for you automatically!\n");
}

async function main() {
  await testMistakes();
  showCorrectExample();
}

main()
  .then(() => {
    console.log("💡 Check your code for:");
    console.log("   - Missing Content-Length header");
    console.log("   - Incomplete JSON strings");
    console.log("   - Connection closing too early");
    console.log("   - Using GET instead of POST");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

