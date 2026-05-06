const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        useContentSize: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false
        }
    });

    win.setBackgroundColor("#000000");
    win.loadFile(path.join(__dirname, 'index.html'));
    win.setFullScreen(true);
}

app.whenReady().then(createWindow);