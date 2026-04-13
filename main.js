import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

import { app, BrowserWindow } from 'electron'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let nuxtPath;
let nuxtProcess;

function createWindow() {

    const mainWindow = new BrowserWindow({

        width: 1000,

        height: 600,

        webPreferences: {
            nodeIntegration: false,

            contextIsolation: false,
        },
    });

    if (app.isPackaged) {
        nuxtPath = path.join(__dirname, '..', '..', '.output', 'public', 'index.html');
        mainWindow.loadFile(nuxtPath);
    } else {
        nuxtProcess = spawn('pnpm', ['nuxt', 'dev'], {
            detached: true,
            stdio: 'inherit',
            shell: true
        });
        mainWindow.loadURL('http://localhost:3000');
    }
}

// Creates the window when electron app is ready
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});

// Terminates the electron app when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Terminates the Nuxt dev server before closing.
app.on('before-quit', () => {
    if (nuxtProcess) {
        nuxtProcess.kill();
    }
});
