'use strict'
const fs = require('fs');
const path = require('path');
const program = require('commander');

const co = require('co')
const prompt = require('co-prompt')

const exec = require('child_process').exec
const spawn = require('child_process').spawn
const execSync = require('child_process').execSync

require('./base');
let YELLOW = '\x1b[33m'
let BLUE = '\x1b[34m'
let END = '\x1b[0m'

const AS = 'adb shell '

const run_as = function (command) {
    return run_command(AS + command);
}

const run_command = function (command) {
    let result = execSync(command);
    return result.toString().trim();
    //let rs = result.toString().replace('\r\n', '');
}

const run_commandA = function (command, callback) {
    let child = exec(command, function (error, stdout, stderr) {
        // console.log(error, stdout, stderr);
        if (!error) {
            if (callback)
                callback();
        }
    });
    child.on('exit', function (code) {
        if (code != 0) {
            console.log('Failed: ' + code);
        }
    });
}

const print_deviceinfo = function () {
    let brand = run_as('getprop ro.product.brand');
    let model = run_as('getprop ro.product.model');
    let name = run_as('getprop ro.product.name');
    console.log('品牌：' + run_as('getprop ro.product.brand'));
    console.log('型号：' + run_as('getprop ro.product.model'));
    console.log('代号：' + run_as('getprop ro.product.name'));
    console.log('系统版本：' + run_as('getprop ro.build.version.release') + ',' + run_as('getprop ro.build.version.sdk'));

    let pd = run_as('wm density');
    console.log('屏幕密度：' + pd.substring(pd.indexOf(':') + 1));

    let ps = run_as('wm size');
    console.log('屏幕分辨率：' + ps.substring(ps.indexOf(': ' + 1)));
}

const print_IP = function () {
    console.log(run_as('ifconfig | grep Mask'));
}

const select_packages = function (packagename, tip, callback) {
    if (packagename) {
        let rs = run_as(`pm list packages ${packagename} | awk -F ':' '{print $2}'`)
        let length = rs.split('\n').length;

        if (length === 0) {
            console.log(`抱歉,没有找个${packagename} 相关应用`);
        } else if (length === 1) {
            if (callback)
                callback(rs.split('\n')[0]);
        } else {
            rs.split('\n').forEach((item, index, array) => {
                console.log(index + ':' + item);
            });
            co(function *() {
                let line = yield prompt(tip)
                if (callback)
                    callback(rs.split('\n')[parseInt(line)]);
                process.stdin.pause();
            })
        }
        console.log();
    } else {
        console.log('抱歉 输入错误 -h 查看帮助');
    }
}

const print_packages = function (packagename) {
    select_packages(packagename, '请选择要查看的应用编号:', (name) => {
        doPpackageInfo(name);
    })
}

const doPpackageInfo = function (packagename) {
    console.log(packagename);
    //console.log(run_as(`dumpsys package ${packagename} `));
    console.log(run_as(`dumpsys package ${packagename} | grep -n 'version\\|firstInstallTime'`));
}

const cleanApk = function (packagename) {
    select_packages(packagename, '请选择要清除数据的应用编号:', (name) => {
        doCleanApk(name);
    })
}

const doCleanApk = function (packagename) {
    co(function *() {
        let conf = yield prompt.confirm('确定要清除<' + packagename + '>的数据?(y/n)')
        if (conf) {
            run_as('pm clear ' + packagename);
        }
        process.stdin.pause();
    })
}

const stopApk = function (packagename) {
    select_packages(packagename, '请选择要停止的应用编号:', (name) => {
        doStopApk(name);
    })
}

const doStopApk = function (packagename) {
    run_as('am force-stop ' + packagename);
}

const print_Log = function (tag) {
    let filename = 'log/' + new Date().format("yyyy-MM-dd-hh") + '.txt'
    fs.appendFile(filename, '##### 记录日志:' + new Date().format("yyyy-MM-dd hh:mm:ss") + '\n');

    let log = spawn('adb', ['logcat', `${tag}:v`, '*:S']);
    log.stdout.on('data', function (data) {
        console.log(data.toString());
        fs.appendFile(filename, data.toString());
    });
    // 添加一个end监听器来关闭文件流
    log.stdout.on('end', function (data) {
        console.log(' downloaded to ');
    });
}

const screencap = function () {
    let filename = new Date().format("yyyy_MM_dd_hh_mm_ss") + '.png';

    run_commandA(AS + 'screencap -p /sdcard/' + filename, () => {
        run_commandA('adb pull /sdcard/' + filename + ' record/', () => {
            run_commandA('adb shell rm /sdcard/' + filename, () => {
            });
        });
    });
}

const screenrecord = function () {
    console.log(process.platform);

    console.log('屏幕录制中...需要停止时按ctrl+c');
    let filename = new Date().format("yyyy_MM_dd_hh_mm_ss") + '.mp4';
    let log = spawn('adb', ['shell', 'screenrecord', '/sdcard/' + filename]);
    co(function *() {
        let conf = yield prompt.confirm('停止录制?(y/n)')
        if (conf) {
            log.kill();
            setTimeout(() => {
                run_commandA('adb pull /sdcard/' + filename + ' record/', () => {
                    run_commandA('adb shell rm /sdcard/' + filename, () => {
                    });
                });
            }, 1000);
        }
        process.stdin.pause();
    })
}

const setInput = function (content) {
    run_as('input text ' + content);
}

const _mkdir = function (dir) {
    fs.exists(dir, function (exists) {
        !exists && fs.mkdir(dir);
    });
}

_mkdir('log');
_mkdir('record');


program
    .version(require('./package.json').version)
    .option('-i, --info', '显示设备信息', print_deviceinfo)
    .option('-l, --log <tag>', '打印log(log/) <tag>', print_Log)
    .option('-p, --package <package>', '查看apk信息 <包名>', print_packages)
    .option('--clean <package>', '双清(缓存/数据)应用 <包名>', cleanApk)
    .option('--stop <package>', '杀死应用应用 <包名>', stopApk)
    .option('--input <content>', '将内容输入到edittext(不支持中文)', setInput)
    .option('-c --cap', '截屏并保存的电脑(record/)', screencap)
    .option('-s --screenrecord', '录制并保存的电脑(record/)', screenrecord)
    .option('--ip', '显示设备ip地址', print_IP)
    .parse(process.argv);

if (program.rawArgs.length <= 2) {
    console.error(0);
    program.help();
}