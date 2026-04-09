import { contextBridge, ipcRenderer } from 'electron';
import type { Profile } from './db';

contextBridge.exposeInMainWorld('api', {
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  createProfile: (profile: Profile) => ipcRenderer.invoke('create-profile', profile),
  launchProfile: (id: number) => ipcRenderer.invoke('launch-profile', id)
});
