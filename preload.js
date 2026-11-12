const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  displays: () => ipcRenderer.invoke('displays'),
  enterShow: (displayId) => ipcRenderer.invoke('enter-show', displayId),
  exitShow: () => ipcRenderer.invoke('exit-show'),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  segments: (videoId, categories) => ipcRenderer.invoke('segments', videoId, categories),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (s) => ipcRenderer.invoke('save-settings', s),
  openLog: () => ipcRenderer.invoke('open-log'),
  edition: () => ipcRenderer.invoke('edition'),
  oembed: (url) => ipcRenderer.invoke('oembed', url),
  thumb: (id) => ipcRenderer.invoke('thumb', id),
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  songFacts: (info) => ipcRenderer.invoke('song-facts', info),
  tracklist: (videoId) => ipcRenderer.invoke('tracklist', videoId),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  authStatus: () => ipcRenderer.invoke('auth-status'),
  signIn: () => ipcRenderer.invoke('sign-in'),
  signOut: () => ipcRenderer.invoke('sign-out'),
  loopbackSupported: () => ipcRenderer.invoke('loopback-supported'),
  onDisplaysChanged: (fn) => ipcRenderer.on('displays-changed', fn),
  onCursorMoved: (fn) => ipcRenderer.on('cursor-moved', fn)
});
