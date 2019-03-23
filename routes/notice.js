var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');

var FILE_SERVICE_ADD = "http://127.0.0.1:3000/";
var CODE_SUCCESS = 0;
var CODE_FAILURE = 999;

var CMD_UPLOAD_MEDIA = 4;
var CMD_UPLOAD_FILE = 5;

app.get('/notice.html', function (req, res) {
    res.render('notice');
});

var userIndex = 0;
io.on('connection', function (socket) {
    socket["userIndex"] = ++userIndex;
    socket["nickname"] = socket["userIndex"] + "号";
    socket.on('notification', function (msg) { // 用户消息
        io.emit('notification', socket["nickname"] + ":[" + msg + "]");
        console.log("notification: " + msg);
    });
    socket.on('setNickname', function (msg) {
        io.emit('notification', "System:[注意:用户 '" + socket["nickname"] + "' 昵称已更改,更改后昵称为 '" + msg + "', 历史消息请留意原昵称!]");
        socket["nickname"] = msg;
        console.log("setNickname: " + msg);
    });
    socket.on('disconnect', function () {
        io.emit('notification', "System:[注意:用户 '" + socket["nickname"] + "' 已下线!]");
        console.log('user disconnected');
    });
    io.emit('notification', "System:[注意:新用户上线请留意! 该聊天室为临时热聊;聊天记录请自行保存;服务器不提供聊天记录服务!]");
    io.emit('notification', "System:[注意:用户 '" + socket["nickname"] + "' 已上线,发送 ':setNickname=$nickname' 以设置昵称,昵称中禁止包含 '=' 符号!]");
    console.log('user connected');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).any());
app.post('/uploadFiles', function (req, res) {
    var file = req.files[0];
    var cmd = req.body["cmd"];
    console.log("file:" + file + " cmd:" + cmd); // 上传的文件信息
    var des_file = "";
    var url = FILE_SERVICE_ADD;
    if (cmd == CMD_UPLOAD_MEDIA) {
        des_file = __dirname.replace("routes", "public") + "/images/" + file.originalname;
        url += "images/" + file.originalname;
    } else if (cmd == CMD_UPLOAD_FILE) {
        des_file = __dirname.replace("routes", "public") + "/files/" + file.originalname;
        url += "files/" + file.originalname;
    } else {
        res.end(JSON.stringify({ code: CODE_FAILURE, message: "File uploaded for cmd error" }));
        return;
    }
    console.log("des_file:" + des_file);
    fs.readFile(file.path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            var response = {
                code: CODE_SUCCESS,
                message: 'File uploaded successfully',
                src: url
            };
            if (err) {
                response["code"] = CODE_FAILURE;
                response["message"] = "File uploaded failure";
                response["src"] = "";
                res.end(JSON.stringify(response));
                console.log("upload err:" + err);
                return;
            }
            res.end(JSON.stringify(response));
            console.log("upload succ:" + response);
        });
    });
});

http.listen(9080, function () {
    console.log('listening on port 9080');
});

module.exports = app;
