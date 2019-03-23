var express = require('express');
var webSocketServer = require('ws').Server;
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');
var router = express.Router();

// 服务地址
var FILE_SERVICE_ADD = "http://127.0.0.1:3000/";
// code
var CODE_SUCCESS = 0;
var CODE_NOTAUTH_LONGTIME = 997;
var CODE_HEARTBEAT_INTERRUPT = 998;
var CODE_FAILURE = 999;
// msg
var MSG_SUCCESS = "success";
var MSG_HEARTBEAT_INTERRUPT = "heart Beat Interrupt";
var MSG_NOTAUTH_LONGTIME = "not Auth For LongTime";
var MSG_FAILURE = "failure";
// command 服务回应码
var COMMAND_BROADCAST_USERON = "COMMAND_BROADCAST_USERON"; // 用户上线响应
var COMMAND_BROADCAST_USEROFF = "COMMAND_BROADCAST_USEROFF"; // 用户下线响应
var COMMAND_BROADCAST_NOTICE = "COMMAND_BROADCAST_NOTICE"; // 推送响应
var COMMAND_HEART_BEAT = "COMMAND_HEART_BEAT"; // 心跳响应
var COMMAND_HEART_BEAT_CHECK = "COMMAND_HEART_BEAT_CHECK"; // 心跳检测响应
var COMMAND_CHAT_RESP = "COMMAND_CHAT_RESP"; // 聊天响应
// cmd 客户请求码
var CMD_AUTH = 0; // 鉴权
var CMD_HEART_BEAT = 1; // 心跳命令
var CMD_PUSH = 2; // 推送命令
var CMD_CHAT = 3; // 聊天命令
var CMD_UPLOAD_MEDIA = 4;
var CMD_UPLOAD_FILE = 5;

var wss = new webSocketServer({
    port: 3500, // 监听接口
    verifyClient: function (info) {// 连接验证
        // 传入的info参数会包括这个连接的很多信息
        console.log("info:" + info);
        console.log("origin:" + info.origin);
        console.log("req:" + info.req);
        console.log("secure:" + info.secure);
        return true;
    }
});
HeartBeat();
// 设置广播 0:广播有用户上线 1:广播有用户下线 2:推送
wss.broadcast = function (type, msg) {
    var len = wss.clients.length; // 在线人数
    wss.clients.forEach(function (client) {
        switch (type) {
            case 0: // 有用户上线
                var obj = new Object();
                obj["code"] = CODE_SUCCESS;
                obj["msg"] = MSG_SUCCESS;
                obj["command"] = COMMAND_BROADCAST_USERON;
                obj["data"] = msg;
                obj["onlineNumber"] = len;
                client.send(JSON.stringify(obj));
                console.log("userOn:" + JSON.stringify(msg));
                break;
            case 1: // 有用户下线
                var obj = new Object();
                obj["code"] = CODE_SUCCESS;
                obj["msg"] = MSG_SUCCESS;
                obj["command"] = COMMAND_BROADCAST_USEROFF;
                obj["data"] = msg;
                obj["onlineNumber"] = len;
                client.send(JSON.stringify(obj));
                console.log("userOff:" + JSON.stringify(msg));
                break;
            case 2: // 推送
                var obj = new Object();
                obj["code"] = CODE_SUCCESS;
                obj["msg"] = MSG_SUCCESS;
                obj["command"] = COMMAND_BROADCAST_NOTICE;
                obj["data"] = msg;
                client.send(JSON.stringify(obj));
                console.log("push:" + JSON.stringify(msg));
                break;
            default: break;
        }
    });
};
// 监听连接事件
wss.on('connection', function (ws) {
    // 连接时间
    ws["connectionTime"] = new Date().getTime();
    // 收到消息
    ws.on('message', function (json) {
        var obj = eval('(' + json + ')');
        CmdExecution(ws, obj);
    });
    // 连接关闭
    ws.on('close', function () {
        // 未鉴权通过不广播
        if (ws["chatUser"] == null) return;
        wss.broadcast(1, ws["chatUser"]); // 广播用户下线
    });
    console.log("connection...");
});
// 执行命令
function CmdExecution(ws, obj) {
    var chatUser = ws["chatUser"]; // 该属性存在则表示已鉴权 反之未鉴权
    var cmd = obj["cmd"];
    // 命令不能为空
    if (cmd == null || cmd == "") return;
    // 若不是鉴权命令且未鉴权则不处理该命令
    if (cmd != CMD_AUTH && chatUser == null) return;
    switch (cmd) {
        case CMD_AUTH: // 鉴权
            obj["cmd"] = null;
            Auth(ws, obj);
            break;
        case CMD_HEART_BEAT: // 心跳
            chatUser["heartBeatTime"] = new Date().getTime();
            ws["chatUser"] = chatUser;
            var ret = new Object();
            ret["code"] = CODE_SUCCESS;
            ret["msg"] = MSG_SUCCESS;
            ret["command"] = COMMAND_HEART_BEAT;
            ws.send(JSON.stringify(ret));
            break;
        case CMD_PUSH: // 推送
            obj["cmd"] = null;
            wss.broadcast(2, obj);
            break;
        case CMD_CHAT: // 聊天
            obj["cmd"] = null;
            Chat(ws, obj);
            break;
        default: break;
    }
}
// 鉴权
function Auth(ws, obj) {
    var t = obj["t"]; // token
    var p = obj["p"]; // 平台标识
    var l = obj["l"]; // 用户级别
    var n = obj["n"]; // 用户名
    verify(function (success) {
        if (success) { // 鉴权成功
            obj["heartBeatTime"] = new Date().getTime();
            obj["info"] = getInfo(n);
            ws["chatUser"] = obj;
            wss.broadcast(0, ws["chatUser"]); // 广播该用户上线
        } else { // 鉴权失败
            ws.close();
        }
    });
    function getInfo(name) {
        var obj = new Object();
        obj["avatar"] = "";
        obj["name"] = n;
        obj["nickName"] = "";
        obj["groupList"] = queryGroupList(name); // 该用户加入的群聊
    }
    function queryGroupList(name) {
        var list = new Array();
        var item = new Object();
        item["name"] = name + "_group"; // 群唯一标识
        item["nickName"] = ""; // 群名称
        item["notice"] = ""; // 群公告
        list.push(item);
        return list;
    }
    function verify(handel) {
        if (handel == null) return;
        var success = false;
        if (t == null || p == null || l == null || n == null) {
            success = false;
            handel(success);
        } else {
            success = true;
            handel(success);
        }
    }
}
// 聊天
function Chat(ws, obj) {
    var sessionType = obj["sessionType"];
    var fromName = obj["fromName"]; // 发送者
    var toName = obj["toName"]; // 接收者
    var bodyObj = obj["data"]; // 消息体
    var bodyType = obj["type"]; // 消息类型
    var sendTime = obj["sendTime"]; // 发送时间
    var fromAvatar = ws["chatUser"]["info"]["avatar"]; // 发送者头像
    var fromNname = ws["chatUser"]["info"]["nickName"]; // 发送者昵称
    if (sessionType == 1) {
        pushT1Use(toName); // 个人会话
    } else if (sessionType == 2) {
        pushT2Use(toName); // 群聊会话
    }
    function pushT1Use(toPenName) {
        var success = false;
        wss.clients.forEach(function (client) {
            if (success) return;
            var chatUser = client["chatUser"];
            var info = chatUser["info"]; // 用户信息
            var name = info["name"]; // 用户名
            if (name == toPenName) {
                var retObj = new Object();
                retObj["avatar"] = fromAvatar; // 必须是发送者的头像
                retObj["data"] = bodyObj;
                retObj["fromName"] = fromName;
                retObj["toName"] = toPenName;
                retObj["nickName"] = fromNname; // 必须是发送者的昵称
                retObj["sendTime"] = sendTime;
                retObj["type"] = bodyType;
                retObj["sessionType"] = 1;
                retObj["command"] = COMMAND_CHAT_RESP;
                client.send(JSON.stringify(retObj));
                success = true;
            }
        });
    }
    function pushT2Use(toGroupName) {
        wss.clients.forEach(function (client) {
            var success = false;
            var chatUser = client["chatUser"];
            var info = chatUser["info"];
            var groupList = info["groupList"]; // 用户加入的群聊
            if (groupList == null || groupList.length == 0) return;
            groupList.forEach(function (item) {
                if (success) return;
                var name = item["name"]; // 群聊用户名标识
                if (name == toGroupName) {
                    var retObj = new Object();
                    retObj["avatar"] = fromAvatar; // 必须是发送者的头像
                    retObj["data"] = bodyObj;
                    retObj["fromName"] = fromName;
                    retObj["toName"] = toGroupName;
                    retObj["nickName"] = fromNname; // 必须是发送者的昵称
                    retObj["sendTime"] = sendTime;
                    retObj["type"] = bodyType;
                    retObj["sessionType"] = 2;
                    retObj["command"] = COMMAND_CHAT_RESP;
                    client.send(JSON.stringify(retObj));
                    success = true;
                }
            });
        });
    }
}
// 心跳检测
var heartBeatInterval = null;
function HeartBeat() {
    if (heartBeatInterval != null) clearInterval(heartBeatInterval);
    heartBeatInterval = setInterval(function () {
        if (wss.clients.size == 0) return;
        wss.clients.forEach(function (client) {
            var nowTime = new Date().getTime();
            var connectionTime = client["connectionTime"];
            var chatUser = client["chatUser"];
            if (chatUser == null) {
                if (Math.abs(nowTime - connectionTime) > 10000) {
                    sendNotAuthCommand(client);
                    client.close();
                    console.log("Unauthenticated for a long time");
                }
                return;
            }
            var heartBeatTime = chatUser["heartBeatTime"];
            if (heartBeatTime == null) {
                if (Math.abs(nowTime - connectionTime) > 10000) {
                    sendNotAuthCommand(client);
                    client.close();
                    console.log("Unauthenticated for a long time");
                }
                return;
            }
            if (Math.abs(nowTime - heartBeatTime) > 10000) {
                sendHeartBeatCommand(client);
                client.close();
                console.log("heart Beat Interrupt");
            }
        });
    }, 5000);
    function sendHeartBeatCommand(ws) {
        var ret = new Object();
        ret["code"] = CODE_HEARTBEAT_INTERRUPT;
        ret["msg"] = MSG_HEARTBEAT_INTERRUPT;
        ret["command"] = COMMAND_HEART_BEAT_CHECK;
        ws.send(JSON.stringify(ret));
    }
    function sendNotAuthCommand(ws) {
        var ret = new Object();
        ret["code"] = CODE_NOTAUTH_LONGTIME;
        ret["msg"] = MSG_NOTAUTH_LONGTIME;
        ret["command"] = COMMAND_HEART_BEAT_CHECK;
        ws.send(JSON.stringify(ret));
    }
}
router["WebsocketService"] = wss;
router.get('/', function (req, res, next) {
    res.send('eland hole!');
});
router.get('/index.html', function (req, res) {
    res.render('index', { title: 'Express' });
});
router.get('/process_get', function (req, res) {
    var response = {
        "first_name": req.query.first_name,
        "last_name": req.query.last_name
    };
    res.send(JSON.stringify(response));
    console.log(response);
});
router.post('/process_post', function (req, res) {
    var response = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name
    };
    res.send(JSON.stringify(response));
    console.log(response);
});
router.use(bodyParser.urlencoded({ extended: false }));
router.use(multer({ dest: '/tmp/' }).array('image'));
router.post('/file_upload', function (req, res) {
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

module.exports = router;
