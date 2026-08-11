import readline from "readline/promises";
import { getAuthClient, getAuthUrl } from "./auth.js";

async function run() {
  const authUrl = getAuthUrl();
  console.log("Authorize this app by visiting this url:\n", authUrl);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question("Enter the code from that page here: ");
  rl.close();

  const client = getAuthClient();
  try {
    const { tokens } = await client.getToken(code);
    console.log("\nSuccess! Token received.");
    
    // Write tokens to tokens.json
    const fs = await import("fs/promises");
    await fs.writeFile("tokens.json", JSON.stringify(tokens, null, 2));
    console.log("Tokens saved to tokens.json");
    
    console.log("\nAdd this to your .env file:");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (err) {
    console.error("Error retrieving access token", err);
  }
}

run().catch(console.error);
