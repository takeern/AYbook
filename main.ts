const shell = require('shelljs');
const net = require('net')
function log(str: string, color = 'FgRed') {
    const colorMap = {
        FgRed: '\x1b[31m',
        FgGreen: '\x1b[32m',
        FgYellow: '\x1b[33m',
        FgBlue: '\x1b[34m',
        FgMagenta: '\x1b[35m',
        FgCyan: '\x1b[36m',
    };
    return console.log(colorMap[color], `\n \t\t${str} \n`);
}

const development = process.argv[2];

shell.cd('spiderServices')
shell.exec('ts-node ./src/main.ts', async (code: number) => {
    if (code !== 0) {
        log('启动spider service 失败');
        return;
    } else {
        log('启动spider service 成功', 'FgGreen');
    }
});
const server = net.createServer().listen(4000);

server.on('listening', function () { // 执行这块代码说明端口未被占用
    server.close() // 关闭服务
    setTimeout(() => {
        shell.cd('../servicesController');
        shell.exec('ts-node ./src/main.ts', async(code: number) => {
            if (code !== 0) {
                log('启动service Controller 失败');
                return;
            } else {
                log('启动service Controller 成功', 'FgGreen');
            }
        });
    }, 500)
});

server.on('error', function (err) {
    shell.cd('../servicesController');
    shell.exec('ts-node ./src/main.ts', async(code: number) => {
        if (code !== 0) {
            log('启动service Controller 失败');
            return;
        } else {
            log('启动service Controller 成功', 'FgGreen');
        }
    });
});


shell.cd('../dakeBook');
shell.exec('npm run start', async(code: number) => {
    if (code !== 0) {
        log('启动dakeBook 失败');
        return;
    } else {
        log('启动dakeBook 成功', 'FgGreen');
    }
});