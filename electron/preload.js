const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Aqui você pode expor funções específicas do Electron para o frontend
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  selectFile: () => ipcRenderer.invoke('dialog:selectFile'),
  saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),
});
