import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import { initDB, getProfiles, createProfile, Profile } from './db';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Load from vite dev server or built files
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  initDB();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-profiles', () => {
  return getProfiles();
});

ipcMain.handle('create-profile', (event, profile: Profile) => {
  return createProfile(profile);
});

ipcMain.handle('launch-profile', (event, id: number) => {
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === id);
  if (!profile) return false;

  // Isolate data directory per profile
  const userDataDir = path.join(app.getPath('userData'), `profiles_data`, `profile_${id}`);
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  // Define browser executable (fallback to OS default Chrome for prototype)
  let execPath = '';
  if (process.platform === 'win32') {
    execPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (process.platform === 'darwin') {
    execPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    execPath = '/usr/bin/google-chrome'; // Linux
  }

  const args = [
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    // Custom CLI switches for our Phase 2 C++ Patches:
    `--canvas-noise-seed=${profile.canvasSeed}`,
  ];

  if (profile.proxy) {
    args.push(`--proxy-server=${profile.proxy}`);
  }

  try {
    const child = spawn(execPath, args, {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    console.log(`Launched profile ${id} with PID ${child.pid}`);
    return true;
  } catch (error) {
    console.error('Failed to launch browser:', error);
    return false;
  }
});
