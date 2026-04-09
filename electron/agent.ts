import puppeteer from 'puppeteer-core';
import { getRunningProfile } from './db';
import http from 'http';

// Helper to fetch the websocket endpoint from the browser's debug API
function getWebSocketDebuggerUrl(port: number): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const info = JSON.parse(data);
          resolve(info.webSocketDebuggerUrl);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

export async function runAgentTask(profileId: number, taskDescription: string): Promise<string> {
  const profileInfo = getRunningProfile(profileId);
  if (!profileInfo) {
    throw new Error(`Profile ${profileId} is not running. Please launch it first.`);
  }

  try {
    console.log(`[Agent] Connecting to profile ${profileId} on port ${profileInfo.port}...`);
    const wsUrl = await getWebSocketDebuggerUrl(profileInfo.port);
    
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null,
    });

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    console.log(`[Agent] Task received: ${taskDescription}`);
    console.log(`[Agent] Navigating to Google...`);
    
    // Simulate Agent execution (Hardcoded for Phase 3 prototype)
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    
    // Type in search box (assuming standard google search box name='q')
    await page.waitForSelector('textarea[name="q"]', { timeout: 5000 }).catch(() => 
      page.waitForSelector('input[name="q"]')
    );
    await page.type('textarea[name="q"]', taskDescription);
    await page.keyboard.press('Enter');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    console.log(`[Agent] Task completed.`);
    
    // We do NOT close the browser because it's a persistent profile
    browser.disconnect();
    
    return `Agent successfully executed: Searched for "${taskDescription}"`;
  } catch (error: any) {
    console.error(`[Agent Error]`, error);
    throw new Error(`Agent execution failed: ${error.message}`);
  }
}
