import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';

import { app, BrowserWindow, protocol } from 'electron'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let nuxtProcess;

const isPackaged = app.isPackaged;
const publicPath = path.join(process.resourcesPath, '.output', 'public');

console.log('Public path:', publicPath);
console.log('Is packaged:', isPackaged);
console.log('File exists:', fs.existsSync(path.join(publicPath, 'index.html')));

// This function is only for the dev enviroment
// It keeps checking if the server is up every one second.
// It resolves once it confirms the server is up
function waitForServer(maxAttempts = 300) {
    return new Promise((resolve, reject) => {
        let attempt = 0;
        const check = () => {
            attempt++;
            console.log(`Checking server... attempt ${attempt}`);
            const req = http.get('http://localhost:3000', (res) => {
                console.log(`Server responded: ${res.statusCode}`);
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    resolve();
                } else if (attempt >= maxAttempts) {
                    reject(new Error('Server failed to start'));
                } else {
                    setTimeout(check, 1000);
                }
            });
            req.on('error', (e) => {
                console.log(`Server check error: ${e.message}`);
                if (attempt >= maxAttempts) {
                    reject(new Error('Server failed to start'));
                } else {
                    setTimeout(check, 1000);
                }
            });
        };
        check();
    });
}

async function createWindow() {

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
        mainWindow.maximize();
    } else {
        nuxtProcess = spawn('pnpm', ['nuxt', 'dev'], {
            detached: true,
            stdio: 'inherit',
            shell: true
        });
        try {
            mainWindow.maximize();
            await waitForServer();
            mainWindow.loadURL('http://localhost:3000');
            mainWindow.maximize();
        } catch (e) {
            console.error('Server wait failed:', e.message);
        }
    }
}

// Creates the window when electron app is ready
app.whenReady().then(async () => {
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
    
    await createWindow()

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
