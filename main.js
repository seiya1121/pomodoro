const electron = require('electron');
const { BrowserWindow, app, Menu } = electron;
const loadDevtool = require('electron-load-devtool');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
  });
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // const appIcon = new Tray(`file://${__dirname}/app/images/pomo2.png`);
  const menu = Menu.buildFromTemplate([
    { label: '選択メニュー1', type: 'radio' },
    { label: '選択メニュー2', type: 'radio' },
    { type: 'separator' },
    { label: 'サブメニュー', submenu: [
      { label: 'サブメニュー1' },
      { label: 'サブメニュー2' },
    ] },
    { label: '終了', accelerator: 'Command+Q', click() { app.quit(); } },
  ]);
  Menu.setApplicationMenu(menu);
  // appIcon.setContextMenu(contextMenu);
  // // アイコンにマウスオーバーした時の説明
  // appIcon.setToolTip('This is sample.');

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
