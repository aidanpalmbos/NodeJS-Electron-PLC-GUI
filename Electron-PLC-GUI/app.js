const { app, BrowserWindow, ipcMain } = require('electron');
const { Controller, Tag } = require('st-ethernet-ip');
const path = require('node:path');
const { send } = require('node:process');

function sleep(milisecondsToSleep) {
    return new Promise(resolve => setTimeout(resolve, milisecondsToSleep));
}

var ipAddress = "192.168.0.0"; //Example IP Address, use your own.
var plc = new Controller();
//var tagDictionary = {};

async function plcInitialize() {
    plc = new Controller();
    plc.timeout_sp = 2000;
    try {
        await plc.connect(ipAddress, 0);
        return true;
    }
    catch (error) {
        return error;
    }
}
/*function plcAddTagDictionary(tagString) {
    tagDictionary[tagString] = new Tag(tagString, null, null, 1, 0, 1);
}*/

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1400,
        height: 800,
        title: "PLC Electron Controller",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    window.loadFile('client/index.html');
};

app.whenReady().then(() => {
    ipcMain.handle('SetIpAddress', async (event, newIpAddress) => {
        ipAddress = newIpAddress;
    });

    ipcMain.handle('StartPlc', async (event) => {
        try {
            let send = await plcInitialize();
            while (send == null) { await sleep(50); }
            return send;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });

    ipcMain.handle('ReadPlc', async (event, tag) => {
        try {
            await plc.readTag(tagDictionary[tag]).then(() => {
                return tagDictionary[tag].value;
            });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });

    ipcMain.handle('WritePlc', async (event, tag, val) => {
        try {
            tagDictionary[tag].value = val;
            await plc.writeTag(tagDictionary[tag]).then(() => {
                return tagDictionary[tag].value;
            });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });

    createWindow();
});

