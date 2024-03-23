const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setIpAddress: (ipAddress) => ipcRenderer.invoke('SetIpAddress', ipAddress),

    connectPlc: () => ipcRenderer.invoke('StartPlc'),
    readPlc: (tag) => ipcRenderer.invoke('ReadPlc', tag),
    writePlc: (tag, value) => ipcRenderer.invoke('WritePlc', tag, value),
});