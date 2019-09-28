/* const mortgage = require('./js/mortgage');

let m = new mortgage();
console.log(m.print());
console.log(m.print().replace(/\n/g,'') + '啦啦啦啦啦啦啦'); */


const dayjs = require('dayjs');

let input = '23:55';
const SEPARATOR = ':';

let values = input.split(SEPARATOR);
if (values.length === 0) {
    //输入格式异常
} else if (values.length === 2) {
    let current = dayjs();
    let h = current.get('hour');
    let m = current.get('minute');

    let total = (values[0] - h) * 3600 + (values[1] - m) * 60

    console.log(total);


} else {
    //未处理
}
