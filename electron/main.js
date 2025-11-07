const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startServer } = require('../server/index');

let mainWindow;
let serverInstance;

const isDev = process.env.NODE_ENV === 'development';

// Definir o diretório de dados no userData do Electron
if (!isDev) {
  const userDataPath = app.getPath('userData');
  process.env.PORTABLE_EXECUTABLE_DIR = path.join(userDataPath, 'data');
  console.log('Diretório de dados:', process.env.PORTABLE_EXECUTABLE_DIR);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    titleBarStyle: 'default',
    autoHideMenuBar: true,
  });

  // Carrega a URL do Vite (dev) ou arquivo local (produção)
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
    mainWindow.webContents.openDevTools();
  } else {
    // Tentar diferentes caminhos possíveis
    const possiblePaths = [
      path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html'),
      path.join(process.resourcesPath, 'app', 'dist', 'index.html'),
      path.join(__dirname, '..', 'dist', 'index.html'),
      path.join(app.getAppPath(), 'dist', 'index.html')
    ];

    let indexPath = possiblePaths[0];
    const fs = require('fs');
    
    // Encontrar o caminho que existe
    for (const p of possiblePaths) {
      console.log('Tentando:', p);
      if (fs.existsSync(p)) {
        indexPath = p;
        console.log('✓ Encontrado:', p);
        break;
      }
    }

    console.log('Carregando index.html de:', indexPath);
    mainWindow.loadFile(indexPath);
    
    // Abrir DevTools para debug (temporário)
    mainWindow.webContents.openDevTools();
  }

  // Debug: mostrar erros de carregamento
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Falha ao carregar:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Iniciar servidor Express
  try {
    serverInstance = await startServer();
    console.log('✓ Servidor local iniciado na porta 3456');
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverInstance) {
    serverInstance.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverInstance) {
    serverInstance.close();
  }
});
