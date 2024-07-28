import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  login: (user: any) => ipcRenderer.invoke('login', user),
});