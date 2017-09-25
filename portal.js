module.exports = function(config, argv){
    const {app} = require('electron')
    const {BrowserWindow} = require('electron')
    let mainWindow
    let dev = argv.includes("d")

    var windowOptions = { 
        width: 800, 
        height: 600,
        kiosk: !dev,
        autoHideMenuBar: true,
        darkTheme: true
    };

    app.on('ready', function() {
        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL('http://localhost:'+config.server.port);
        if(dev) {
            mainWindow.webContents.openDevTools();
        }
        mainWindow.on('closed', function () {
            mainWindow = null;
        })
    })

    app.on('window-all-closed', function () {
        app.quit();
    })
}