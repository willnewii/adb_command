const prompt = require('prompt');
const colors = require("colors");
const program = require('commander');

const execSync = require('child_process').execSync

prompt.message = '';
prompt.delimiter = colors.green(prompt.delimiter);

const run_command = function (command) {
  let result = execSync(command);
  return result.toString().trim();
}

//获取输入内容
async function getInput(tip) {
  let schema = {
    properties: {
      name: {
        description: colors.bgBlue(tip),
        required: true
      }
    }
  }

  let result = await new Promise(function (resolve, reject) {
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
  let command = 'lsof -i tcp';
  if (_port) {
    command = command + ':' + _port
  }

  let result = run_command(command);
  let results = result.split('\n');

  results.forEach((item, index) => {
    if (index > 0) {
      console.log(colors.bold.blue(index) + '  :  ' + item);
    }
  })
  let index = await getInput('请输入你要关闭的进程编号');
  let reg = /\S+/g; //匹配非空白符
  let port = results[parseInt(index)].match(reg)[1]

  run_command('kill ' + port)
  console.log('finish');
}

function doTest() {
  console.log('test');
}

program
  .version(require('./package.json').version)
  .option('-t, --test', '测试', doTest)
  .option('-p, --port <port>', 'kill相应进程', doKillByPort)
  .parse(process.argv);

if (program.rawArgs.length <= 2) {
  program.help();
}
