const WebSocket = require('ws');
const { exec } = require('child_process');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('Клиент подключился');
    
    ws.on('message', (message) => {
        const cmd = message.toString();
        
        if (cmd === 'stop') {
            ws.send('🛑 Пинг остановлен');
            return;
        }
        
        // Выполняем ping команду (4 пакета)
        const pingCmd = `ping -c 4 ${cmd.split(' ')[1] || '8.8.8.8'} 2>&1`;
        
        exec(pingCmd, (error, stdout, stderr) => {
            if (error) {
                ws.send(`❌ Ошибка: ${stderr}`);
                return;
            }
            ws.send(stdout);
        });
    });
});

console.log('🚀 Сервер запущен на ws://localhost:3000');
