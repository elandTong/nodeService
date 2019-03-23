var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/chat";
var dbase = null;
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log("connect db err:" + err);
        return;
    }
    console.log("chat 数据库已创建!");
    dbase = db;
    var chatDb = dbase.db("chat");
    chatDb.createCollection('user_info', function (err, res) {
        if (err) {
            console.log("create user_info err:" + err);
            return;
        }
        console.log("创建 用户信息 集合!");
    });
    chatDb.createCollection('session', function (err, res) {
        if (err) {
            console.log("create session err:" + err);
            return;
        }
        console.log("创建 会话 集合!");
    });
    chatDb.createCollection('group_info', function (err, res) {
        if (err) {
            console.log("create group_info err:" + err);
            return;
        }
        console.log("创建 群聊信息 集合!");
    });
    chatDb.createCollection('group_member', function (err, res) {
        if (err) {
            console.log("create group_member err:" + err);
            return;
        }
        console.log("创建 群成员 集合!");
    });
    chatDb.createCollection('private_chat_record', function (err, res) {
        if (err) {
            console.log("create private_chat_record err:" + err);
            return;
        }
        console.log("创建 私聊记录 集合!");
    });
    chatDb.createCollection('group_chat_record', function (err, res) {
        if (err) {
            console.log("create group_chat_record err:" + err);
            return;
        }
        console.log("创建 群聊记录 集合!");
    });
    chatDb.createCollection('user_to_user_remake', function (err, res) {
        if (err) {
            console.log("create user_to_user_remake err:" + err);
            return;
        }
        console.log("创建 用户对用户备注 集合!");
    });
});
// 聊天数据库对象
function DB_CHAT() {
    this.insert = insert;
    this.update = update;
    this.delet = delet;
    this.find = find;
    this.findPage = findPage;
    this.connect = connect;
    this.closeDb = closeDb;
    this.isConnect = isConnect;
    this.insertFromUserTable = function (objOrList, handel) {
        var tableName = "user_info";
        insert(tableName, objOrList, handel);
    }
    this.updateFromUserTable = function (whereObj, obj, isOneOrMany, handel) {
        var tableName = "user_info";
        update(tableName, whereObj, obj, isOneOrMany, handel);
    }
    this.deleteFromUserTable = function (whereObj, isOneOrMany, handel) {
        var tableName = "user_info";
        delet(tableName, whereObj, isOneOrMany, handel);
    }
    this.findFromUserTable = function (whereObj, sortObj, size, pageIndex, handel) {
        var tableName = "user_info";
        if (size == null || size <= 0) {
            find(tableName, whereObj, sortObj, handel);
        } else {
            findPage(tableName, whereObj, sortObj, size, pageIndex, handel);
        }
    }
    function connect(handel) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("connect db err:" + err);
                if (handel != null) {
                    handel(false);
                }
                return;
            }
            dbase = db;
            if (handel != null) {
                handel(true);
            }
        });
    }
    function isConnect() {
        if (dbase == null) return false;
        return dbase.isConnected();
    }
    function insert(tableName, objOrList, handel) { // 插入
        if (!isConnect()) {
            if (handel != null) {
                handel({ status: 999, message: "not connect db" });
            }
            return;
        }
        var chatDb = dbase.db("chat");
        if (objOrList instanceof Array) { // 插入多条
            chatDb.collection(tableName).insertMany(objOrList, function (err, res) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                if (handel != null) {
                    handel({ status: 0, message: "insert success" });
                }
                console.log("插入的文档数量为: " + res.insertedCount);
            });
        } else { // 单条插入
            chatDb.collection(tableName).insertOne(objOrList, function (err, res) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                if (handel != null) {
                    handel({ status: 0, message: "insert success" });
                }
                console.log("文档插入成功");
            });
        }
    }
    function update(tableName, whereObj, obj, isOneOrMany, handel) { // 更新
        if (!isConnect()) {
            if (handel != null) {
                handel({ status: 999, message: "not connect db" });
            }
            return;
        }
        var chatDb = dbase.db("chat");
        if (isOneOrMany) {
            chatDb.collection(tableName).updateOne(whereObj, obj, function (err, res) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                if (handel != null) {
                    handel({ status: 0, message: "update success" });
                }
                console.log("文档更新成功");
            });
        } else {
            chatDb.collection(tableName).updateMany(whereObj, obj, function (err, res) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                if (handel != null) {
                    handel({ status: 0, message: "update success" });
                }
                console.log(res.result.nModified + " 条文档被更新");
            });
        }
    }
    function delet(tableName, whereObj, isOneOrMany, handel) { // 删除
        if (!isConnect()) {
            if (handel != null) {
                handel({ status: 999, message: "not connect db" });
            }
            return;
        }
        var chatDb = dbase.db("chat");
        if (isOneOrMany) {
            chatDb.collection(tableName).deleteOne(whereObj, function (err, obj) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                if (handel != null) {
                    handel({ status: 0, message: "delete success" });
                }
                console.log("文档删除成功");
            });
        } else {
            chatDb.collection(tableName).deleteMany(whereObj, function (err, obj) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                if (handel != null) {
                    handel({ status: 0, message: "delete success" });
                }
                console.log(obj.result.n + " 条文档被删除");
            });
        }
    }
    function find(tableName, whereObj, sortObj, handel) { // 查询
        if (!isConnect()) {
            if (handel != null) {
                handel({ status: 999, message: "not connect db" });
            }
            return;
        }
        var chatDb = dbase.db("chat");
        if (sortObj != null) { // 自定义排序
            chatDb.collection(tableName).find(whereObj).sort(sortObj).toArray(function (err, result) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                var obj = new Object();
                obj["status"] = 0;
                obj["message"] = "find success";
                obj["result"] = result;
                if (handel != null) {
                    handel(obj);
                }
                console.log("find:" + result);
            });
        } else { // 不排序
            chatDb.collection(tableName).find(whereObj).toArray(function (err, result) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                var obj = new Object();
                obj["status"] = 0;
                obj["message"] = "find success";
                obj["result"] = result;
                if (handel != null) {
                    handel(obj);
                }
                console.log("find:" + result);
            });
        }
    }
    function findPage(tableName, whereObj, sortObj, size, pageIndex, handel) { // 查询
        if (!isConnect()) {
            if (handel != null) {
                handel({ status: 999, message: "not connect db" });
            }
            return;
        }
        var skipSize = pageIndex * size - size;
        var chatDb = dbase.db("chat");
        if (sortObj != null) {
            chatDb.collection(tableName).find(whereObj).sort(sortObj).skip(skipSize).limit(size).toArray(function (err, result) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                var obj = new Object();
                obj["status"] = 0;
                obj["message"] = "findPage success";
                obj["result"] = result;
                if (handel != null) {
                    handel(obj);
                }
                console.log("findPage:" + result);
            });
        } else {
            chatDb.collection(tableName).find(whereObj).skip(skipSize).limit(size).toArray(function (err, result) {
                if (err) {
                    if (handel != null) {
                        handel({ status: 999, message: err });
                    }
                    return;
                }
                var obj = new Object();
                obj["status"] = 0;
                obj["message"] = "findPage success";
                obj["result"] = result;
                if (handel != null) {
                    handel(obj);
                }
                console.log("findPage:" + result);
            });
        }
    }
    function closeDb() {
        dbase.close();
    }
}
var db_chat = new DB_CHAT();
module.exports = db_chat;
