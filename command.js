const prompt = require('prompt');
//const colors = require("colors");
const chalk = require("chalk");
const program = require('commander');

const execSync = require('child_process').execSync

const highlightBG = chalk.bgBlue;
const highlight = chalk.bold.blue;

//import mortgage from './js/mortgage';
const mortgage = require('./js/mortgage');

prompt.message = '';
prompt.delimiter = highlight(prompt.delimiter);

const run_command = function(command) {
    let result;
    try {
        result = execSync(command);
    } catch (ex) {
        result = '';
    }
    return result.toString().trim();
}

//获取输入内容
async function getInput(tip) {
    let schema = {
        properties: {
            name: {
                description: highlightBG(tip),
                required: true
            }
        }
    }

    let result = await new Promise(function(resolve, reject) {
        prompt.start();
        prompt.get(schema, (error, result) => {
            if (!error) {
                resolve(result.name);
            } else {
                reject(error);
            }
        });
    });

    return result;
}

/**
 * 根据匹配端口号 kill相应进程
 */
async function doKillByPort(_port) {
    //lsof -i -n -P | grep :80
    let command = 'lsof -i tcp';
    if (_port) {
        command = command + ':' + _port
    }

    let result = run_command(command);
    if (!result) {
        console.log(highlightBG('没有查到匹配的进程 执行命令:' + command));
        return;
    }

    let results = result.split('\n');

    results.forEach((item, index) => {
        if (index > 0) {
            console.log(highlight(index) + '  :  ' + item);
        }
    })
    let index = await getInput('请输入你要关闭的进程编号');
    let reg = /\S+/g; //匹配非空白符
    let port = results[parseInt(index)].match(reg)[1]

    run_command('kill -9 ' + port)
    console.log('finish');
}

function doMortgage() {
    let m = new mortgage();

    let result = m.print();
    // console.log(result);
    console.log(`第${highlight(result.month)}期应还款: ${highlight(result.dyyh)} 元

剩余本金: ${highlight(result.sybj)} 元
待还款: ${highlight(result.dh)} 元

坚持一下你还有 ${highlight(result.year)} 年就能还完啦~`);
    //run_command('say ' + result.replace(/\n/g, '') + '    啦啦啦啦啦啦啦');
}

function doTest() {
    console.log('test');
}

program
    .version(require('./package.json').version)
    .option('-t, --test', '测试', doTest)
    .option('-p, --port <port>', 'kill相应进程', doKillByPort)
    .option('-f, --fangdai', '房贷计算器', doMortgage)
    .parse(process.argv);

if (program.rawArgs.length <= 2) {
    program.help();
}