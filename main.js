import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

import { app, BrowserWindow, protocol } from 'electron'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let nuxtProcess;

const isPackaged = app.isPackaged;
const publicPath = path.join(process.resourcesPath, '.output', 'public');

console.log('Public path:', publicPath);
console.log('Is packaged:', isPackaged);
console.log('File exists:', fs.existsSync(path.join(publicPath, 'index.html')));

function createWindow() {

    const mainWindow = new BrowserWindow({

        width: 1000,

        height: 600,

        webPreferences: {
            nodeIntegration: false,

            contextIsolation: false,

            webSecurity: false,
        },
    });
    // Make a dev server to run it in dev mode. Makes development MUCH easier
    if (isPackaged) {
        mainWindow.loadURL('file:///');
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
    if (isPackaged) {
        // We are doing some link interception BS since nuxt likes making its path start at root.
        // This cannot work with file links, since it starts trying to fetch with from the root directory
        // Instead we replace it with a file link to a proper path
        protocol.interceptFileProtocol('file', (request, callback) => {
            let urlPath = request.url.replace('file://', '');
            urlPath = decodeURIComponent(urlPath);
            
            if (urlPath.startsWith('/_nuxt/') || urlPath.startsWith('/_payload') || urlPath.startsWith('/_fonts') || urlPath.startsWith('/favicon')) {
                const filePath = path.join(publicPath, urlPath);
                callback({ path: filePath });
            } else if (urlPath.startsWith(publicPath)) {
                callback({ path: urlPath });
            } else if (urlPath === '/' || urlPath === '/index.html') {
                callback({ path: path.join(publicPath, 'index.html') });
            } else if (!urlPath.includes('.')) {
                callback({ path: path.join(publicPath, 'index.html') });
            } else {
                const filePath = path.join(publicPath, urlPath);
                callback({ path: filePath });
            }
        });
    }
    
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
