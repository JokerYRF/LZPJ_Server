const express = require('express')
const app = express()
const gas = require('./gas.js') //引入气体扩散模块

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
})); //解析字符
var allowCors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCors); //使用跨域中间件



app.get('/', (req, res) => {
    res.send('Hello World get!')
})


app.post('/', (req, res) => {
    let parm = req.body
    console.log(parm)
    let result = gas.gridValue(parm)
    console.log(result.length)
    res.send(result)
})


app.listen(3000, () => console.log('Example app listening on port 3000 hello!' +
    '  ' + gas.value(2) + ' ' + gas.pasStabClass(4.5, 'Day', 'overcast'), 2 ** 3 * 2))