#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Installing Chrome for Puppeteer...');

try {
  // Install Chrome browser for Puppeteer
  execSync('npx puppeteer browsers install chrome', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Chrome installed successfully for Puppeteer!');
  console.log('You can now use the PDF generation feature.');
} catch (error) {
  console.error('❌ Failed to install Chrome:', error.message);
  console.log('\nAlternative solutions:');
  console.log('1. Make sure you have Node.js and npm installed');
  console.log('2. Try running: npm install puppeteer');
  console.log('3. For production, consider using a Docker container with Chrome pre-installed');
  process.exit(1);
}

