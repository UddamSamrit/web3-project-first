// Debug script to test JSON-RPC requests and identify common errors

const http = require('http');

function testRequest(data, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3045,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
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
          resolve({ success: true, response: parsed, raw: responseData });
        } catch (error) {
          resolve({ success: false, error: error.message, raw: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log("🔍 JSON-RPC Request Debugger\n");
  console.log("Testing common error scenarios...\n");

  // Test 1: Correct format
  console.log("1️⃣  Testing CORRECT format (should work):");
  const correct = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1
  });
  console.log("   Request:", correct);
  try {
    const result1 = await testRequest(correct, "Correct format");
    if (result1.success && result1.response.result) {
      console.log("   ✅ SUCCESS - Block number:", parseInt(result1.response.result, 16));
    } else {
      console.log("   ❌ FAILED:", JSON.stringify(result1.response, null, 2));
    }
  } catch (error) {
    console.log("   ❌ ERROR:", error.message);
  }
  console.log();

  // Test 2: NULL id (the error you're seeing)
  console.log("2️⃣  Testing NULL id (your error):");
  const nullId = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: null
  });
  console.log("   Request:", nullId);
  try {
    const result2 = await testRequest(nullId, "Null id");
    if (result2.success && result2.response.error) {
      console.log("   ❌ ERROR (as expected):", result2.response.error.message);
      console.log("   💡 Fix: Change 'id: null' to 'id: 1' (or any number)");
    }
  } catch (error) {
    console.log("   ❌ ERROR:", error.message);
  }
  console.log();

  // Test 3: Missing id
  console.log("3️⃣  Testing MISSING id:");
  const missingId = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: []
  });
  console.log("   Request:", missingId);
  try {
    const result3 = await testRequest(missingId, "Missing id");
    if (result3.success && result3.response.error) {
      console.log("   ❌ ERROR:", result3.response.error.message);
    }
  } catch (error) {
    console.log("   ❌ ERROR:", error.message);
  }
  console.log();

  // Test 4: Missing jsonrpc
  console.log("4️⃣  Testing MISSING jsonrpc field:");
  const missingJsonrpc = JSON.stringify({
    method: "eth_blockNumber",
    params: [],
    id: 1
  });
  console.log("   Request:", missingJsonrpc);
  try {
    const result4 = await testRequest(missingJsonrpc, "Missing jsonrpc");
    if (result4.success && result4.response.error) {
      console.log("   ❌ ERROR:", result4.response.error.message);
    }
  } catch (error) {
    console.log("   ❌ ERROR:", error.message);
  }
  console.log();

  // Test 5: Invalid JSON
  console.log("5️⃣  Testing INVALID JSON:");
  const invalidJson = '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1';
  console.log("   Request (incomplete):", invalidJson);
  try {
    const result5 = await testRequest(invalidJson, "Invalid JSON");
    if (!result5.success) {
      console.log("   ❌ PARSE ERROR:", result5.error);
      console.log("   💡 Fix: Ensure your JSON is complete and valid");
    }
  } catch (error) {
    console.log("   ❌ ERROR:", error.message);
  }
  console.log();

  console.log("📋 Summary of Common Fixes:");
  console.log("   ✅ id must be a NUMBER: id: 1 (not null, not string)");
  console.log("   ✅ jsonrpc must be '2.0'");
  console.log("   ✅ method must be a valid RPC method");
  console.log("   ✅ params must be an array (can be empty [])");
  console.log("   ✅ JSON must be complete and valid");
  console.log();
  console.log("💡 If you're using a library (ethers.js, web3.js), use the library methods");
  console.log("   instead of raw JSON-RPC requests to avoid these errors.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

