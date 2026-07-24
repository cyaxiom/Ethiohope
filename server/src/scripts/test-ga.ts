
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load env vars with absolute path
const envPath = path.resolve(__dirname, '../../.env.development');
dotenv.config({ path: envPath });

async function testConnection() {
  const propertyId = process.env.GA_PROPERTY_ID;
  const credentialsPath = path.resolve(__dirname, '../core/config/oauth-credentials.json');
  const tokenPath = path.resolve(__dirname, '../core/config/token.json');

  console.log('--- GA4 OAuth Connection Diagnostic ---');
  console.log('Property ID:', propertyId);

  if (!propertyId) {
    console.error('❌ ERROR: GA_PROPERTY_ID not found in .env.development');
    return;
  }

  if (!fs.existsSync(credentialsPath) || !fs.existsSync(tokenPath)) {
    console.error('❌ ERROR: OAuth files missing!');
    return;
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));

    const creds = credentials.installed || credentials.web;

    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        refresh_token: token.refresh_token,
        type: 'authorized_user'
      },
    });

    console.log('Attempting to fetch data via OAuth...');

    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'date' }],
    });

    console.log('✅ SUCCESS!');
    if (response.rows && response.rows.length > 0) {
      console.log('Data received:');
      console.table(response.rows.map(row => ({
        Date: row.dimensionValues?.[0].value,
        Users: row.metricValues?.[0].value
      })));
    } else {
      console.log('✅ Connected, but no data found (0 users).');
    }
  } catch (error: any) {
    console.error('❌ FAILED!');
    console.error('Error Message:', error.message);
  }
}

testConnection();
