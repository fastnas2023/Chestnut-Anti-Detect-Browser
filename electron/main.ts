import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
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
  // Placeholder: Launch logic will be added in Task 5
  console.log(`Launching profile ${id}`);
  return true;
});
