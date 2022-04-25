import { app, Menu } from 'electron';
import os from 'os';
import windowManager from './utils/windowManager';
import tray from './components/tray';
import ipcWindow from './ipc/window';

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.whenReady().then(async () => {
  tray.init();
  if (process.env.NODE_ENV !== 'development') {
    Menu.setApplicationMenu(null);
  }
  ipcWindow.register();
  const wallPaperWindow = windowManager.createWallpaperWindow();
  if (process.platform === 'win32') {
    const { default: setAsWallpaper } = await import('./utils/setAsWallpaper');
    setAsWallpaper(wallPaperWindow);
  }
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('second-instance', () => {
  // TODO: 通过第二个实例传递的参数打开相应的窗口，针对给功能窗口创建桌面快捷方式的情况（准备可以用过桌面快捷方式或者托盘菜单打开功能窗口）
});
