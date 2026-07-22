import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import fs from 'fs';

const CREDENTIALS_PATH = path.resolve(__dirname, '../core/config/oauth-credentials.json');
const TOKEN_PATH = path.resolve(__dirname, '../core/config/token.json');
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

async function authorize() {
  console.log('--- Google Analytics Login Helper ---');
  
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ ERROR: oauth-credentials.json not found in src/core/config/');
    console.log('Please download it from Google Cloud Console first.');
    return;
  }

  try {
    const client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(client.credentials));
      console.log('✅ SUCCESS! Login successful.');
      console.log('Token saved to:', TOKEN_PATH);
      console.log('\nYou can now run the GA4 tests!');
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
  }
}

authorize();
