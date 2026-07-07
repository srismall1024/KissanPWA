import { app, BrowserWindow } from "electron";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {

    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        icon: join(__dirname, "../src/assets/logo.png"),

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);