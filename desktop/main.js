const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backend;

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {

   backend = spawn("node", ["server.js"], {
    cwd: path.join(__dirname, "../backend"),
    stdio: "inherit"
});

    // Wait for backend to start
    setTimeout(() => {
        createWindow();
    }, 3000);

});

app.on("window-all-closed", () => {

    if (backend) {
        backend.kill();
    }

    app.quit();

});