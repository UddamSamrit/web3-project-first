// Example of proper JSON-RPC request format
// This demonstrates how to make valid JSON-RPC calls to Hardhat node

const http = require('http');

function makeJsonRpcRequest(method, params = []) {
  return JSON.stringify({
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: 1  // IMPORTANT: id must be a number, not null
  });
}

function sendRequest(data) {
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
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Parse error: ${error.message}\nResponse: ${responseData}`));
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
  console.log("Testing JSON-RPC requests to Hardhat node...\n");

  try {
    // Example 1: Get block number
    console.log("1. Getting block number...");
    const blockNumberReq = makeJsonRpcRequest("eth_blockNumber", []);
    const blockNumberRes = await sendRequest(blockNumberReq);
    console.log("   Response:", JSON.stringify(blockNumberRes, null, 2));
    console.log("   Block number:", parseInt(blockNumberRes.result, 16), "\n");

    // Example 2: Get accounts
    console.log("2. Getting accounts...");
    const accountsReq = makeJsonRpcRequest("eth_accounts", []);
    const accountsRes = await sendRequest(accountsReq);
    console.log("   Response:", JSON.stringify(accountsRes, null, 2));
    console.log("   First account:", accountsRes.result[0], "\n");

    // Example 3: Get balance
    console.log("3. Getting balance...");
    const balanceReq = makeJsonRpcRequest("eth_getBalance", [
      accountsRes.result[0],
      "latest"
    ]);
    const balanceRes = await sendRequest(balanceReq);
    console.log("   Response:", JSON.stringify(balanceRes, null, 2));
    const balance = BigInt(balanceRes.result);
    console.log("   Balance:", balance.toString(), "wei\n");

    console.log("✓ All JSON-RPC requests successful!");
    console.log("\nCommon mistakes that cause 'Parse error':");
    console.log("  - Missing or null 'id' field (must be a number)");
    console.log("  - Missing 'jsonrpc' field");
    console.log("  - Invalid JSON format");
    console.log("  - Incomplete request body");

  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

