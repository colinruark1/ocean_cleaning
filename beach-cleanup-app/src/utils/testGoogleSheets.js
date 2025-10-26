/**
 * Test Google Sheets Connection
 * Run this to diagnose connection issues
 */

export const testGoogleSheetsConnection = async () => {
  console.log('🧪 === TESTING GOOGLE SHEETS CONNECTION ===');

  const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
  const SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEETS_SHEET_NAME || 'Posts';

  // Test 1: Check environment variables
  console.log('\n📋 Test 1: Environment Variables');
  console.log('VITE_GOOGLE_SHEETS_API_KEY:', API_KEY ? '✅ Set' : '❌ Missing');
  console.log('VITE_GOOGLE_SHEETS_SPREADSHEET_ID:', SPREADSHEET_ID ? '✅ Set' : '❌ Missing');
  console.log('VITE_GOOGLE_SHEETS_SHEET_NAME:', SHEET_NAME);

  if (!API_KEY || !SPREADSHEET_ID) {
    console.error('❌ Missing required environment variables. Check your .env file.');
    return;
  }

  // Test 2: Test API endpoint
  console.log('\n🔗 Test 2: Testing API Endpoint');
  const range = `${SHEET_NAME}!A1:I2`; // Get header + first data row
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

  console.log('Testing URL:', url.replace(API_KEY, 'API_KEY_HIDDEN'));

  try {
    const response = await fetch(url);
    console.log('Response Status:', response.status, response.statusText);

    if (response.status === 200) {
      console.log('✅ API connection successful!');
      const data = await response.json();
      console.log('Data received:', data);

      if (data.values && data.values.length > 0) {
        console.log('\n📊 Sheet Structure:');
        console.log('Headers:', data.values[0]);
        if (data.values.length > 1) {
          console.log('First row:', data.values[1]);
          console.log('✅ Data found in sheet!');
        } else {
          console.log('⚠️ Headers found but no data rows');
        }
      } else {
        console.log('⚠️ No data in the specified range');
      }
    } else if (response.status === 403) {
      console.error('❌ 403 Forbidden - Possible issues:');
      console.error('   1. API key not enabled for Google Sheets API');
      console.error('   2. API key restrictions blocking the request');
      const errorData = await response.json();
      console.error('Error details:', errorData);
    } else if (response.status === 404) {
      console.error('❌ 404 Not Found - Possible issues:');
      console.error('   1. Spreadsheet ID is incorrect');
      console.error('   2. Sheet is not shared publicly (must be "Anyone with link can view")');
      const errorData = await response.json();
      console.error('Error details:', errorData);
    } else {
      console.error(`❌ ${response.status} ${response.statusText}`);
      const errorData = await response.json();
      console.error('Error details:', errorData);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }

  console.log('\n🧪 === TEST COMPLETE ===\n');
};

// Auto-run in development
if (import.meta.env.DEV) {
  // Delay to let the app initialize
  setTimeout(() => {
    testGoogleSheetsConnection();
  }, 2000);
}
