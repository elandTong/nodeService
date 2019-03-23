var screenW;
var screenH;
var topH = 45;
var currentZIndex = 100;
var mChatList = null;
var mChatMessageList = null;
var chatGroup = null;
var chatPersonal = null;
var chatPersonalOpt = null;
var chatRemakeEdit = null;
var chatDownRed = null;
var chatOpenRed = null;
var chatSendRed = null;
var chatImageLook = null;
var chatService = null;
function CHAT() {
    var w;
    var h;
    this.init = init;
    this.setAppStyle = setAppStyle;
    this.setTopTitle = setTopTitle;
    this.getRootNode = getRootNode;
    this.showAddOpt = showAddOpt;
    this.hideAddOpt = hideAddOpt;
    function init() {
        mChatApp.hideAddOpt();
        addPageToHtml("chatEditRemarkDiv");
        addPageToHtml("chatImageLookDiv");
        addWindowToHtml("chatDownRedDiv");
        startedService();
        mChatMessageList = new ChatMessageList();
        mChatMessageList.init();
        chatGroup = new ChatGroup();
        chatGroup.init();
        chatPersonal = new ChatPersonal();
        chatPersonal.init();
        chatPersonalOpt = new ChatPersonalOpt();
        chatPersonalOpt.init();
        chatRemakeEdit = new ChatEditRemake();
        chatRemakeEdit.init();
        chatDownRed = new ChatDownRed();
        chatDownRed.init();
        chatOpenRed = new ChatOpenRed();
        chatOpenRed.init();
        chatSendRed = new ChatSendRed();
        chatSendRed.init();
        chatImageLook = new ChatImageLook();
        chatImageLook.init();
        mChatList = new ChatList("chatListDiv_content", "chatListDiv_subMenu", 20);
        mChatList.init();
        mChatList.itemClickFunction(function (itemData, index) {
            mChatMessageList.show(itemData);
            console.log("click name:" + itemData["name"]);
        });
        mChatList.itemClickLongFunction(function (itemData, index) {
            console.log("click long btn1 name:" + itemData["name"]);
        }, function (itemData, objId) {
            console.log("click long btn2 name:" + itemData["name"]);
        });
        mChatList.setLoadOKFunction(function () {
        });
        mChatList.setParseFunction(function (datas, mode) {
            console.log(mode ? "刷新" : "加载更多");
            var list = new Array();
            for (var i = 0; i < 9; i++) {
                var item = new Object();
                item["notRead"] = i * i;
                item["isMute"] = ((i + 1) % 2 == 0 ? true : false);
                var avNum = i + 1;
                if (avNum < 10) avNum = "0" + avNum;
                item["avatar"] = "header/B_0" + avNum + ".jpg";
                item["name"] = "testun";
                item["nickName"] = "我是童星文" + i;
                item["sessionType"] = (i % 2 == 0 ? 1 : 2); // 1:为个人会话 2:为群聊会话
                item["people_number"] = 100 * (i + 1);
                item["sendTime"] = new Date().getTime() - ((i + 1) * 1000 * 60);
                if ((i + 1) % 2 == 0) {
                    item["type"] = "image";
                    var obj = new Object();
                    obj["id"] = i;
                    obj["url"] = "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg";
                    item["data"] = obj;
                } else {
                    if ((i + 1) % 5 == 0) {
                        item["type"] = "red";
                        var obj = new Object();
                        obj["id"] = i;
                        obj["text"] = "恭喜发财,大吉大利!";
                        obj["redType"] = "葡京娱乐红包";
                        obj["status"] = 1;
                        item["data"] = obj;
                    } else {
                        item["type"] = "text";
                        var obj = new Object();
                        obj["id"] = i;
                        obj["text"] = "哈哈哈哈哈哈哈哈哈";
                        item["data"] = obj;
                    }
                }
                console.log(item);
                list.push(item);
            }
            var returnObj = new Object();
            returnObj["result"] = new Object();
            returnObj["result"]["list"] = list;
            return returnObj;
        });
        mChatList.setIsLoadMore(false);
        mChatList.loadData(SERVER_ADD + "game/getGames", "");
    }
    function setAppStyle() {
        w = $(window).width();
        screenW = w;
        h = $(window).height();
        screenH = h;
        $("#bodyDiv").css({
            "width": w,
            "height": h
        });
        $("#top").css({
            "background": "-webkit-linear-gradient(top, " + toolbarTopColor + " 0%," + toolbarTopColorDK + " 100%)",
            "width": screenW,
            "height": topH,
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#topTitle").css({
            "width": "50%",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "padding": "0px 20px 0px 20px",
            "color": toolbarFontColor,
            "font-size": "18px",
            "box-sizing": "border-box"
        });
        $("#topOperating").css({
            "width": "50%",
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center",
            "padding": "0px 10px 0px 20px",
            "box-sizing": "border-box"
        });
        $("#topOperating_add").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#chatListDiv").css({
            "height": screenH - topH - 0.5,
            "background-color": pageBgColor
        });
        $("#chatListDiv_subMenu").css({
            "height": screenH - topH - 0.5,
            "display": "none"
        });
        $(".PJDCommBtn").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "border-radius": "20px",
            "background-color": mainColor,
            "color": " #FFFFFF",
            "height": "40px",
            "width": "auto",
            "margin-left": "15px",
            "margin-right": "15px",
            "font-size": "14px"
        });
        if (isInIOS()) {
            $("#bodyDiv").css({ "position": "static" });
            $("#mainDiv").css({ "position": "fixed" });
            $("#top").css({ "position": "static" });
            $("#toast").css({ "position": "fixed" });
            $("#loadingDiv").css({ "position": "fixed" });
        }
        setBtnOnTouchEvent($("#topOperating_add"), function () {
        }, mainColorDeep, "");
    }
    function setTopTitle(ms) {
        $("#topTitle").html(ms);
    }
    function getRootNode() {
        return $("#root_body");
    }
    function showAddOpt() {
        $("#topOperating_add").css({ "display": "flex" });
    }
    function hideAddOpt() {
        $("#topOperating_add").css({ "display": "none" });
    }
    function startedService() {
        chatService = new ChatService();
        chatService.setOnOpenHandel(function () {
        });
        chatService.setOnCloseHandel(function () {
        });
        chatService.setOnErrorHandel(function (e) {
        });
        chatService.setOnMessageHandel(function (obj) {
        });
        chatService.connection("ws://127.0.0.1:3500");
    }
}
function ChatSendZone(rootId) {
    var chatMsgZone = null;
    var swiper = null;
    var sessionItem = null;
    this.init = init;
    this.setChatMessageZone = setChatMessageZone;
    this.showOptEmoj = showOptEmoj;
    this.showOptMore = showOptMore;
    this.closeOpt = closeOpt;
    this.setSessionItem = function (im) {
        sessionItem = im;
    }
    function init(sendHandel) {
        var lineMin = "<div style=\"width:10px\"></div>";
        var lineMax = "<div style=\"width:" + ((screenW - 110) / 3) + "px\"></div>";
        var line = "<div style=\"width:100%;height:0.5px;background:#F0F0F0\"></div>";
        var edit = "<div id=\"" + rootId + "_edit\">[content]</div>";
        var input = "<input id=\"" + rootId + "_edit_input\" type=\"text\"/>";
        var emoj = "<div id=\"" + rootId + "_edit_emoj\"><img src=\"" + themPath + "emoj.png\" style=\"height:29px\"/></div>";
        var add = "<div id=\"" + rootId + "_edit_add\"><img src=\"" + themPath + "add.png\" style=\"height:29px\"/></div>";
        var sendBtn = "<div id=\"" + rootId + "_edit_send\">发送</div>";
        edit = edit.replace("[content]", input + lineMin + emoj + lineMin + add + lineMin + sendBtn);

        var optH = screenH / 3.5;
        var opt1 = "<div id=\"" + rootId + "_opt1\">[content]</div>";
        var opt1Root = "<div class=\"" + rootId + "_opt1_root\">[content]</div>";
        var xc = "<div id=\"" + rootId + "_xc\"><img src=\"" + themPath + "xc.png\" style=\"width:40px\"/></div>";
        var rd = "<div id=\"" + rootId + "_rd\"><img src=\"" + themPath + "rd.png\" style=\"width:35px\"/></div>";
        xc = opt1Root.replace("[content]", xc + "<div style=\"height:5px\"></div>" + "<div class=\"" + rootId + "_opt1_text\">相册</div>");
        rd = opt1Root.replace("[content]", rd + "<div style=\"height:5px\"></div>" + "<div class=\"" + rootId + "_opt1_text\">红包</div>");
        opt1 = opt1.replace("[content]", xc + lineMax + rd);

        var opt2 = "<div id=\"" + rootId + "_opt2\">[content]</div>";
        var ej = "<div id=\"[id]\" class=\"" + rootId + "_eoj\">[cne]</div>";
        var swp_rot = "<div class=\"swiper-container\" style=\"width:100%;height:" + optH + "px\">[content]</div>";
        var swp_wap = "<div class=\"swiper-wrapper\" style=\"width:100%;height:" + optH + "px\">[content]</div>";
        var swp_pag = "<div class=\"swiper-scrollbar\"></div>";
        var swp_wap_cn = "<div id=\"[id]\" class=\"swiper-slide\">[content]</div>";
        var del = "<img src=\"" + themPath + "del.png\" style=\"width:30px\"/>";
        var cn1 = ej.replace("[id]", rootId + "_eoj_1").replace("[cne]", "😀")
            + ej.replace("[id]", rootId + "_eoj_2").replace("[cne]", "😁")
            + ej.replace("[id]", rootId + "_eoj_3").replace("[cne]", "😂")
            + ej.replace("[id]", rootId + "_eoj_4").replace("[cne]", "😃")
            + ej.replace("[id]", rootId + "_eoj_5").replace("[cne]", "😄")
            + ej.replace("[id]", rootId + "_eoj_6").replace("[cne]", "😅")
            + ej.replace("[id]", rootId + "_eoj_7").replace("[cne]", "😆")
            + ej.replace("[id]", rootId + "_eoj_8").replace("[cne]", "😉")
            + ej.replace("[id]", rootId + "_eoj_9").replace("[cne]", "😊")
            + ej.replace("[id]", rootId + "_eoj_10").replace("[cne]", "😋")
            + ej.replace("[id]", rootId + "_eoj_11").replace("[cne]", "😎")
            + ej.replace("[id]", rootId + "_eoj_12").replace("[cne]", "😍")
            + ej.replace("[id]", rootId + "_eoj_13").replace("[cne]", "😘")
            + ej.replace("[id]", rootId + "_eoj_14").replace("[cne]", "😗")
            + ej.replace("[id]", rootId + "_eoj_15").replace("[cne]", "😙")
            + ej.replace("[id]", rootId + "_eoj_16").replace("[cne]", "😚")
            + ej.replace("[id]", rootId + "_eoj_17").replace("[cne]", "😇")
            + ej.replace("[id]", rootId + "_eoj_18").replace("[cne]", "😐")
            + ej.replace("[id]", rootId + "_eoj_19").replace("[cne]", "😑")
            + ej.replace("[id]", rootId + "_eoj_20").replace("[cne]", "😶")
            + ej.replace("[id]", rootId + "_eoj_21").replace("[cne]", del);
        var cn2 = ej.replace("[id]", rootId + "_eoj_22").replace("[cne]", "😏")
            + ej.replace("[id]", rootId + "_eoj_23").replace("[cne]", "😣")
            + ej.replace("[id]", rootId + "_eoj_24").replace("[cne]", "😥")
            + ej.replace("[id]", rootId + "_eoj_25").replace("[cne]", "😮")
            + ej.replace("[id]", rootId + "_eoj_26").replace("[cne]", "😯")
            + ej.replace("[id]", rootId + "_eoj_27").replace("[cne]", "😪")
            + ej.replace("[id]", rootId + "_eoj_28").replace("[cne]", "😫")
            + ej.replace("[id]", rootId + "_eoj_29").replace("[cne]", "😴")
            + ej.replace("[id]", rootId + "_eoj_30").replace("[cne]", "😌")
            + ej.replace("[id]", rootId + "_eoj_31").replace("[cne]", "😛")
            + ej.replace("[id]", rootId + "_eoj_32").replace("[cne]", "😜")
            + ej.replace("[id]", rootId + "_eoj_33").replace("[cne]", "😝")
            + ej.replace("[id]", rootId + "_eoj_34").replace("[cne]", "😒")
            + ej.replace("[id]", rootId + "_eoj_35").replace("[cne]", "😓")
            + ej.replace("[id]", rootId + "_eoj_36").replace("[cne]", "😔")
            + ej.replace("[id]", rootId + "_eoj_37").replace("[cne]", "😕")
            + ej.replace("[id]", rootId + "_eoj_38").replace("[cne]", "😲")
            + ej.replace("[id]", rootId + "_eoj_39").replace("[cne]", "😷")
            + ej.replace("[id]", rootId + "_eoj_40").replace("[cne]", "😖")
            + ej.replace("[id]", rootId + "_eoj_41").replace("[cne]", "😞")
            + ej.replace("[id]", rootId + "_eoj_42").replace("[cne]", del);
        var cn3 = ej.replace("[id]", rootId + "_eoj_43").replace("[cne]", "😟")
            + ej.replace("[id]", rootId + "_eoj_44").replace("[cne]", "😤")
            + ej.replace("[id]", rootId + "_eoj_45").replace("[cne]", "😢")
            + ej.replace("[id]", rootId + "_eoj_46").replace("[cne]", "😭")
            + ej.replace("[id]", rootId + "_eoj_47").replace("[cne]", "😦")
            + ej.replace("[id]", rootId + "_eoj_48").replace("[cne]", "😧")
            + ej.replace("[id]", rootId + "_eoj_49").replace("[cne]", "😨")
            + ej.replace("[id]", rootId + "_eoj_50").replace("[cne]", "😬")
            + ej.replace("[id]", rootId + "_eoj_51").replace("[cne]", "😰")
            + ej.replace("[id]", rootId + "_eoj_52").replace("[cne]", "😱")
            + ej.replace("[id]", rootId + "_eoj_53").replace("[cne]", "😳")
            + ej.replace("[id]", rootId + "_eoj_54").replace("[cne]", "😵")
            + ej.replace("[id]", rootId + "_eoj_55").replace("[cne]", "😡")
            + ej.replace("[id]", rootId + "_eoj_56").replace("[cne]", "😠")
            + ej.replace("[id]", rootId + "_eoj_57").replace("[cne]", "😈")
            + ej.replace("[id]", rootId + "_eoj_58").replace("[cne]", "👿")
            + ej.replace("[id]", rootId + "_eoj_59").replace("[cne]", "👹")
            + ej.replace("[id]", rootId + "_eoj_60").replace("[cne]", "👺")
            + ej.replace("[id]", rootId + "_eoj_61").replace("[cne]", "💀")
            + ej.replace("[id]", rootId + "_eoj_62").replace("[cne]", "☠")
            + ej.replace("[id]", rootId + "_eoj_63").replace("[cne]", del);
        var cn4 = ej.replace("[id]", rootId + "_eoj_64").replace("[cne]", "👻")
            + ej.replace("[id]", rootId + "_eoj_65").replace("[cne]", "👽")
            + ej.replace("[id]", rootId + "_eoj_66").replace("[cne]", del);
        var swp_cn1 = swp_wap_cn.replace("[id]", rootId + "_slide_1").replace("[content]", cn1);
        var swp_cn2 = swp_wap_cn.replace("[id]", rootId + "_slide_2").replace("[content]", cn2);
        var swp_cn3 = swp_wap_cn.replace("[id]", rootId + "_slide_3").replace("[content]", cn3);
        var swp_cn4 = swp_wap_cn.replace("[id]", rootId + "_slide_4").replace("[content]", cn4);
        swp_wap = swp_wap.replace("[content]", swp_cn1 + swp_cn2 + swp_cn3 + swp_cn4);
        swp_rot = swp_rot.replace("[content]", swp_wap + swp_pag);
        opt2 = opt2.replace("[content]", swp_rot);
        $("#" + rootId).html(edit + line + opt1 + opt2);
        setStyle(sendHandel);
    }
    function setChatMessageZone(msgZone) {
        chatMsgZone = msgZone;
    }
    function setStyle(sendHandel) {
        $("#" + rootId).css({
            "width": "100%",
            "height": "auto",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_edit").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "58px",
            "padding": "8px 12px 8px 12px",
            "background": "#F0F0F0",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_edit_input").css({
            "text-align": "left",
            "width": "100%",
            "height": "100%",
            "background-color": "#FFFFFF",
            "outline": "none",
            "border": "0px",
            "border-radius": "5px",
            "padding": "8px",
            "font-size": "14px",
            "color": mainColor,
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_edit_emoj").css({
            "width": "32px",
            "height": "32px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_edit_add").css({
            "width": "32px",
            "height": "32px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_edit_send").css({
            "border-radius": "5px",
            "color": mainFontColor,
            "font-size": "14px",
            "background-color": "#58BE6A",
            "width": "65px",
            "height": "32px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        var optH = screenH / 3.5;
        $("#" + rootId + "_opt1").css({
            "width": "100%",
            "height": optH,
            "background": "#F0F0F0",
            "display": "none",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_xc").css({
            "border-radius": "8px",
            "background": "#FFFFFF",
            "width": "65px",
            "height": "65px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_rd").css({
            "border-radius": "8px",
            "background": "#FFFFFF",
            "width": "65px",
            "height": "65px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_opt1_root").css({
            "text-align": "center",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_opt1_text").css({
            "color": "#939393",
            "font-size": "12px",
            "text-align": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_opt2").css({
            "width": "100%",
            "height": optH,
            "background": "#F0F0F0",
            "display": "none",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $(".swiper-slide").css({
            "width": "100%",
            "height": optH,
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "flex-wrap": "wrap",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_slide_1").css({
            "width": "100%",
            "height": optH
        });
        $("#" + rootId + "_slide_2").css({
            "width": "100%",
            "height": optH
        });
        $("#" + rootId + "_slide_3").css({
            "width": "100%",
            "height": optH
        });
        $("#" + rootId + "_slide_4").css({
            "width": "100%",
            "height": optH
        });
        $("." + rootId + "_eoj").css({
            "width": "13%",
            "font-size": "30px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "border-radius": "10px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_eoj_21").css({
            "border-radius": "6px"
        });
        $("#" + rootId + "_eoj_42").css({
            "border-radius": "6px"
        });
        $("#" + rootId + "_eoj_63").css({
            "border-radius": "6px"
        });
        $("#" + rootId + "_eoj_66").css({
            "border-radius": "6px"
        });
        swiper = new Swiper('.swiper-container', {
            autoplay: false,
            scrollbar: { el: '.swiper-scrollbar' }
        });
        setBtnOnTouchEvent($("#" + rootId + "_edit_add"), function () {
            var dis = $("#" + rootId + "_opt1").css("display");
            if (dis == "none") {
                showOptMore();
            } else { closeOpt(); }
            document.activeElement.blur();
        }, "#777777", "", null);
        setBtnOnTouchEvent($("#" + rootId + "_edit_emoj"), function () {
            var dis = $("#" + rootId + "_opt2").css("display");
            if (dis == "none") {
                showOptEmoj(); swiper.update();
            } else { closeOpt(); }
            document.activeElement.blur();
        }, "#777777", "", null);
        setBtnOnTouchEvent($("#" + rootId + "_xc"), function () {
            o("native_component_accpet_image").click();
        }, "#7F7F7F", "#FFFFFF", null);
        setBtnOnTouchEvent($("#" + rootId + "_rd"), function () {
            chatSendRed.show(sessionItem, function (obj) {
                if (obj == null) return;
                obj["type"] = "red";
                if (sendHandel != null) {
                    sendHandel(obj, function (result) {
                        var success = result["success"];
                        if (success) {
                            console.log("sendRedMsgSuccess");
                        }
                    });
                }
            });
            console.log("chatSendRed");
        }, "#7F7F7F", "#FFFFFF", null);
        setBtnOnTouchEvent($("#" + rootId + "_edit_send"), function () {
            closeOpt();
            document.activeElement.blur();
            var val = $("#" + rootId + "_edit_input").val();
            if (val == null || val == "") {
                mToast.show("请输入需要发送的信息!", "1", "middle");
                return;
            }
            var obj = new Object();
            obj["type"] = "text";
            obj["msg"] = val;
            if (sendHandel != null) {
                sendHandel(obj, function (result) {
                    var success = result["success"];
                    if (success) {
                        $("#" + rootId + "_edit_input").val("");
                        console.log("sendTextMsgSuccess");
                    }
                });
            }
        }, "#2C5035", "#58BE6A", null);
        $("." + rootId + "_eoj").each(function () {
            setBtnOnTouchEvent($(this), function (obj) {
                document.activeElement.blur();
                var id = obj.id;
                var iList = id.split("_");
                var iLen = iList.length;
                var index = iList[iLen - 1];
                if (index == 21 || index == 42 || index == 63 || index == 66) {
                    delInput();
                } else {
                    pushInput($("#" + id).html());
                }
            }, "#777777", "");
        });
        if (chatMsgZone != null) { // 设置列表点击关闭OPT
            chatMsgZone.getZone().click(function () {
                closeOpt();
                document.activeElement.blur();
            });
        }
        $("#native_component_accpet_image").change(function () {
            var slef = this;
            var files = slef["files"];
            if (files == null || files.length == 0) return;
            mLoader.show("upload");
            var formData = new FormData(o("native_component_accpet_form"));
            formData.append("cmd", 4);
            uploadFile(UPLOAD_FILE, formData, function (jsonObj) {
                var code = jsonObj["code"];
                if (code == 0) {
                    var obj = new Object();
                    obj["type"] = "image";
                    obj["src"] = jsonObj["src"];
                    if (sendHandel != null) {
                        sendHandel(obj, function (result) {
                            close();
                            var success = result["success"];
                            if (success) {
                                console.log("sendImageMsgSuccess");
                            }
                        });
                    } else { close(); }
                } else {
                    close();
                    mToast.show("图片上传失败,请稍后重试!", 1, "middle");
                }
                console.log("upload result:" + JSON.stringify(jsonObj));
            }, function (err) {
                close();
                mToast.show("图片上传失败,请稍后重试!", 1, "middle");
            });
            $(slef).val("");
            function close() {
                mLoader.unShow("upload");
                document.activeElement.blur();
                closeOpt();
            }
        });
        // 监听input获取焦点
        $("#" + rootId + "_edit_input").focus(function () {
            closeOpt();
            this.scrollIntoViewIfNeeded();
        });
    }
    function showOptMore() {
        var optH = screenH / 3.5;
        $("#" + rootId + "_opt1").css({ "display": "flex" });
        $("#" + rootId + "_opt2").css({ "display": "none" });
        if (chatMsgZone != null) chatMsgZone.updateFrame(optH);
    }
    function showOptEmoj() {
        var optH = screenH / 3.5;
        $("#" + rootId + "_opt1").css({ "display": "none" });
        $("#" + rootId + "_opt2").css({ "display": "flex" });
        if (chatMsgZone != null) chatMsgZone.updateFrame(optH);
    }
    function closeOpt() {
        $("#" + rootId + "_opt1").css({ "display": "none" });
        $("#" + rootId + "_opt2").css({ "display": "none" });
        if (chatMsgZone != null) chatMsgZone.updateFrame(0);
    }
    function delInput() {
        var val = $("#" + rootId + "_edit_input").val();
        if (val == null || val == "") return;
        var list = Array.from(val);
        var len = list.length;
        list.splice(len - 1, 1);
        $("#" + rootId + "_edit_input").val(list.join(""));
    }
    function pushInput(val) {
        var val_old = $("#" + rootId + "_edit_input").val();
        $("#" + rootId + "_edit_input").val(val_old + val);
    }
}
function ChatMessageZone(rootId, name, optDefH, size) {
    var listId;
    var fromName = name;
    var toName = null;
    var isGroup = false;
    var loading = new Spinner({ color: "#FFFFFF" });
    var requestUrl;
    var requestParame;
    var messageList = new Array();
    var MessageClickFun = null;
    var AvatarClickFun = null;
    var ParseDataFun = null;
    var LoadOKFun = null;
    var pageSize = 20;
    var currentPage = -1; // -1表示最新一页的消息
    var outTime = 500;
    var isLoading = false;
    var chatTopNoneList = null;
    this.init = init;
    this.getZone = getZone;
    this.pushMessage = pushMessage;
    this.setFromName = setFromName;
    this.setToName = setToName;
    this.setGroupIs = setGroupIs;
    this.updateFrame = updateFrame;
    this.setMessageClickFunction = function (fun) {
        MessageClickFun = fun;
    }
    this.setAvatarClickFunction = function (fun) {
        AvatarClickFun = fun;
    }
    this.setParseFunction = function (fun) {
        ParseDataFun = fun;
    }
    this.setLoadOKFunction = function (fun) {
        LoadOKFun = fun;
    }
    this.loadData = function (url, parame) {
        $("#" + listId + "_content").html("");
        requestUrl = url;
        requestParame = parame;
        refresh(true); // 初始化加载
    }
    this.reloadData = function (parame) {
        $("#" + listId + "_content").html("");
        requestParame = parame;
        refresh(true); // 初始化加载
    }
    this.setOutTime = function (time) {
        outTime = time;
    }
    this.getTopNone = function () {
        if (chatTopNoneList == null) {
            chatTopNoneList = new ChatTopNoneList(rootId + "_other_list");
            chatTopNoneList.init();
        }
        return chatTopNoneList;
    }
    function init() {
        $("#" + rootId).css({
            "width": "100%",
            "height": screenH - topH - optDefH,
            "position": "relative",
            "box-sizing": "border-box",
            "overflow": "hidden"
        });
        var list = "<div id=\"" + rootId + "_list\">[content]</div>";
        var other = "<div id=\"" + rootId + "_other\"><div id=\"" + rootId + "_other_list\"></div></div>";
        $("#" + rootId).html(list + other);
        setFrameStyle();
        listId = rootId + "_list";
        if (!isNaN(size) && size > 0) pageSize = size;
        bindFrameView();
    }
    function getZone() {
        return $("#" + rootId);
    }
    function setFrameStyle() {
        $("#" + rootId + "_list").css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "width": "100%",
            "height": screenH - topH - optDefH,
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
        $("#" + rootId + "_other").css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "width": screenW,
            "height": "55px",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "opacity": 0.8,
            "background-color": "#191919",
            "overflow-x": "auto",
            "overflow-y": "hidden",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_other_list").css({
            "width": "auto",
            "height": "100%",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "padding": "5px",
            "box-sizing": "border-box"
        });
    }
    function bindFrameView() {
        var re = "<div id=" + listId + "_refreshProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items:center\"></div>";
        var le = "<div id=" + listId + "_line style=\"width:100%;height:20px\"></div>";
        var ce = "<div id=" + listId + "_content style=\"width:100%\"></div>";
        $("#" + listId).html(re + le + ce);
        BindT0UniqueEvent(listId, "scroll", scrollHandel);
    }
    var loadTimeout = null;
    function refresh(isInit) { // 表示是否初始化加载
        closeLoading();
        isLoading = true;
        if (isInit) {
            currentPage = -1;
            messageList = new Array();
        }
        $("#" + listId).scrollTop(0);
        showLoading();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(isInit);
        }, outTime);
    }
    var scrollTopNum = 0;
    var scrollTopTimeout = null;
    function scrollHandel(e) {
        var stop = $("#" + listId).scrollTop(); // 滑动量
        if (isReady() && !isLoading && stop == 0) {
            if (scrollTopNum == 1) {
                if (scrollTopTimeout != null) clearTimeout(scrollTopTimeout);
                refresh(false);
                scrollTopNum = 0;
            } else {
                ++scrollTopNum;
                if (scrollTopTimeout != null) clearTimeout(scrollTopTimeout);
                scrollTopTimeout = setTimeout(function () { scrollTopNum = 0 }, 2500);
            }
        }
    }
    function showList(datas, isInit) {
        var msgLeftRot = "<div class=\"" + listId + "_msg_left_root\">[content]</div>";
        var msgRightRot = "<div class=\"" + listId + "_msg_right_root\">[content]</div>";
        var lineMin_X = "<div style=\"width:5px\"></div>";
        var lineMax_X = "<div style=\"width:15px\"></div>";
        var avatar = "<div id=\"[id]\" class=\"" + listId + "_avatar_root\"><img src=\"[src]\" class=\"" +
            listId + "_avatar\"/><div class=\"" + listId + "_nickName\">[name]</div></div>";
        // 箭头
        var leftA = "<div class=\"" + listId + "_leftA\"></div>";
        var rightA = "<div class=\"" + listId + "_rightA\"></div>";
        var leftRedA = "<div class=\"" + listId + "_leftRedA\"></div>";
        var rightRedA = "<div class=\"" + listId + "_rightRedA\"></div>";
        // 内容框架
        var leftTextFe = "<div id=\"[id]\" class=\"" + listId + "_leftTextFe\">[content]</div>";
        var rightTextFe = "<div id=\"[id]\" class=\"" + listId + "_rightTextFe\">[content]</div>";
        var leftImageFe = "<div id=\"[id]\" class=\"" + listId + "_leftImageFe\">[img]</div>";
        var rightImageFe = "<div id=\"[id]\" class=\"" + listId + "_rightImageFe\">[img]</div>";
        var frameImage = "<img class=\"" + listId + "_frameImage\" src=\"[src]\"/>";
        leftImageFe = leftImageFe.replace("[img]", frameImage);
        rightImageFe = rightImageFe.replace("[img]", frameImage);
        var redFe = "<div id=\"[id]\" class=\"" + listId + "_redFe\">[content]</div>";
        var redTop = "<div class=\"" + listId + "_redTop\">[content]</div>";
        var redTopImg = "<img class=\"" + listId + "_red_top_img\" src=\"" + themPath + "red.png\"/>";
        var redTopText = "<div class=\"" + listId + "_red_top_text\">[content]</div>";
        redTop = redTop.replace("[content]", redTopImg + redTopText);
        var redBot = "<div class=\"" + listId + "_redBot\">[redType]</div>";
        redFe = redFe.replace("[content]", redTop + redBot);
        // -----
        var time_div = "<div class=\"" + listId + "_send_time_root\"><div class=\"" + listId + "_send_time\">[time]</div></div>";
        var previousItem = null;
        var divs = "";
        var len = datas.length;
        for (var i = 0; i < len; i++) {
            var item = datas[i];
            var itemFromName = item["fromName"]; // 发送者
            var itemToName = item["toName"]; // 接收者
            if (itemToName != toName) continue; // 不是发送到该会话的消息
            var srcAvatar = item["avatar"];
            var type = item["type"];
            var sendTime = item["sendTime"];
            var view = "";
            var messageBody = "";
            var messageAvatar = "";
            var messageTime = "";
            if (isGroup && itemFromName != fromName) {
                messageAvatar = avatar.replace("[id]", listId + "_avatar_" + i).replace("[src]", srcAvatar).replace("[name]", item["nickName"]);
            } else {
                messageAvatar = avatar.replace("[id]", listId + "_avatar_" + i).replace("[src]", srcAvatar).replace("[name]", "");
            }
            switch (type) {
                case "image": // 图片
                    var srcImg = item["data"]["url"];
                    if (itemFromName == fromName) {
                        messageBody = rightImageFe.replace("[id]", listId + "_item_" + i).replace("[src]", srcImg);
                        view = msgRightRot.replace("[content]", messageBody + rightA + lineMin_X + messageAvatar);
                    } else {
                        messageBody = leftImageFe.replace("[id]", listId + "_item_" + i).replace("[src]", srcImg);
                        view = msgLeftRot.replace("[content]", messageAvatar + lineMin_X + leftA + messageBody);
                    }
                    break;
                case "text": // 文本
                    var txt = item["data"]["text"];
                    if (itemFromName == fromName) {
                        messageBody = rightTextFe.replace("[id]", listId + "_item_" + i).replace("[content]", txt);
                        view = msgRightRot.replace("[content]", messageBody + rightA + lineMin_X + messageAvatar);
                    } else {
                        messageBody = leftTextFe.replace("[id]", listId + "_item_" + i).replace("[content]", txt);
                        view = msgLeftRot.replace("[content]", messageAvatar + lineMin_X + leftA + messageBody);
                    }
                    break;
                case "red": // 红包
                    var redTxt = item["data"]["text"];
                    var redType = item["data"]["redType"];
                    var status = item["data"]["status"];
                    if (status == 0) {
                        status = "可打开";
                    } else if (status == 1) {
                        status = "已打开";
                    } else {
                        status = "已过期";
                    }
                    if (itemFromName == fromName) {
                        messageBody = redFe.replace("[id]", listId + "_item_" + i).replace("[content]", redTxt).replace("[redType]", redType + " " + status);
                        view = msgRightRot.replace("[content]", messageBody + rightRedA + lineMin_X + messageAvatar);
                    } else {
                        messageBody = redFe.replace("[id]", listId + "_item_" + i).replace("[content]", redTxt).replace("[redType]", redType + " " + status);
                        view = msgLeftRot.replace("[content]", messageAvatar + lineMin_X + leftRedA + messageBody);
                    }
                    break;
            }
            if (previousItem != null) {
                var preTime = previousItem["sendTime"];
                if (Math.abs(sendTime - preTime) > 120000) {
                    messageTime = time_div.replace("[time]", formatTime(sendTime));
                }
            } else {
                messageTime = time_div.replace("[time]", formatTime(sendTime));
            }
            previousItem = item;
            divs += messageTime + view;
        }
        $("#" + listId + "_content").html(divs);
        setItemStyle();
        if (isInit) {
            $("#" + listId).scrollTop(getListHeight());
        } else { $("#" + listId).scrollTop(0); }
    }
    function getListHeight() {
        return $("#" + listId + "_content").height() - 1;
    }
    function showEmpty() {
        var ms = "<div id=\"" + listId + "_content_empty\">没有读取到数据,请重试!</div>";
        $("#" + listId + "_content").html(ms);
        $("#" + listId + "_content_empty").css({
            "width": "100%",
            "text-align": "center",
            "padding": "10px",
            "font-size": "12px",
            "color": "#999999",
            "box-sizing": "border-box"
        })
    }
    function setItemStyle() {
        var spTxW = 8 + 45 + 5;
        $("." + listId + "_msg_left_root").css({
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "top",
            "width": "100%",
            "height": "auto",
            "padding": "9px " + spTxW + "px 9px 8px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_msg_right_root").css({
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "top",
            "width": "100%",
            "height": "auto",
            "padding": "9px 8px 9px " + spTxW + "px",
            "box-sizing": "border-box"
        });
        var maxFeW = screenW - 8 - 45 - 5 - 4 - 5 - 45 - 8;
        $("." + listId + "_avatar_root").css({
            "text-align": "center",
            "width": "45px",
            "height": "auto",
            "box-sizing": "border-box"
        });
        $("." + listId + "_avatar").css({
            "text-align": "center",
            "width": "45px",
            "height": "45px",
            "border-radius": "50%",
            "box-sizing": "border-box"
        });
        $("." + listId + "_nickName").css({
            "text-align": "center",
            "width": "auto",
            "height": "auto",
            "font-size": "10px",
            "color": "white",
            "overflow": "hidden",
            "margin-top": "5px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_leftA").css({
            "width": 0,
            "height": 0,
            "margin-top": "18.5px",
            "border-right": "8px solid white",
            "border-top": "4px solid transparent",
            "border-bottom": "4px solid transparent",
            "box-sizing": "border-box"
        });
        $("." + listId + "_rightA").css({
            "width": 0,
            "height": 0,
            "margin-top": "18.5px",
            "border-left": "8px solid #A9EA7A",
            "border-top": "4px solid transparent",
            "border-bottom": "4px solid transparent",
            "box-sizing": "border-box"
        });
        $("." + listId + "_leftRedA").css({
            "width": 0,
            "height": 0,
            "margin-top": "18.5px",
            "border-right": "8px solid #E6A059",
            "border-top": "4px solid transparent",
            "border-bottom": "4px solid transparent",
            "box-sizing": "border-box"
        });
        $("." + listId + "_rightRedA").css({
            "width": 0,
            "height": 0,
            "margin-top": "18.5px",
            "border-left": "8px solid #E6A059",
            "border-top": "4px solid transparent",
            "border-bottom": "4px solid transparent",
            "box-sizing": "border-box"
        });
        $("." + listId + "_leftTextFe").css({
            "width": "auto",
            "height": "auto",
            "max-width": maxFeW,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "5px",
            "font-size": "16px",
            "color": "#313131",
            "background": "white",
            "border-radius": "5px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_rightTextFe").css({
            "width": "auto",
            "height": "auto",
            "max-width": maxFeW,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "5px",
            "font-size": "16px",
            "color": "#313131",
            "background": "#A9EA7A",
            "border-radius": "5px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_leftImageFe").css({
            "width": "auto",
            "height": "auto",
            "max-width": maxFeW,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "1px",
            "background": "white",
            "border-radius": "5px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_rightImageFe").css({
            "width": "auto",
            "height": "auto",
            "max-width": maxFeW,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "1px",
            "background": "#A9EA7A",
            "border-radius": "5px",
            "box-sizing": "border-box"
        });
        var frameImageW = maxFeW - 2 - 5;
        $("." + listId + "_frameImage").css({
            "max-width": frameImageW,
            "border-radius": "5px",
            "box-sizing": "border-box"
        });
        var redFeW = maxFeW - 40;
        if (screenW <= 375) redFeW = maxFeW;
        $("." + listId + "_redFe").css({
            "width": redFeW,
            "height": "110px",
            "text-align": "center",
            "border-radius": "5px",
            "background": "#E6A059",
            "box-sizing": "border-box"
        });
        $("." + listId + "_redTop").css({
            "width": "100%",
            "height": "80px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "padding": "0px 20px 0px 20px",
            "border-top-left-radius": "5px",
            "border-top-right-radius": "5px",
            "border-bottom-right-radius": "0px",
            "border-bottom-left-radius": "0px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_redBot").css({
            "width": "100%",
            "height": "30px",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "background": "white",
            "padding": "0px 15px 0px 15px",
            "font-size": "12px",
            "color": "#9A9A9A",
            "border-top-left-radius": "0px",
            "border-top-right-radius": "0px",
            "border-bottom-right-radius": "5px",
            "border-bottom-left-radius": "5px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_red_top_img").css({
            "width": "40px"
        });
        $("." + listId + "_red_top_text").css({
            "text-align": "right",
            "width": redFeW - 20 - 40 - 20 - 20,
            "font-size": "16px",
            "color": "white",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        });
        $("." + listId + "_send_time_root").css({
            "width": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "9px 15px 9px 15px",
            "box-sizing": "border-box"
        });
        $("." + listId + "_send_time").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "background": "#A9A9A9",
            "padding": "5px",
            "font-size": "14px",
            "color": "#282828",
            "border-radius": "5px"
        });
        if (MessageClickFun != null) {
            // 文字
            $("." + listId + "_leftTextFe").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var arr = mObj.id.split("_");
                    var len = arr.length;
                    var index = arr[len - 1];
                    MessageClickFun(messageList[index], index);
                }, "#B1B1B1", "white", null);
            });
            $("." + listId + "_rightTextFe").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var arr = mObj.id.split("_");
                    var len = arr.length;
                    var index = arr[len - 1];
                    MessageClickFun(messageList[index], index);
                }, "#54753D", "#A9EA7A", null);
            });
            // 图片
            $("." + listId + "_leftImageFe").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var arr = mObj.id.split("_");
                    var len = arr.length;
                    var index = arr[len - 1];
                    MessageClickFun(messageList[index], index);
                }, "#B1B1B1", "white", null);
            });
            $("." + listId + "_rightImageFe").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var arr = mObj.id.split("_");
                    var len = arr.length;
                    var index = arr[len - 1];
                    MessageClickFun(messageList[index], index);
                }, "#54753D", "#A9EA7A", null);
            });
            // 红包
            $("." + listId + "_redFe").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var arr = mObj.id.split("_");
                    var len = arr.length;
                    var index = arr[len - 1];
                    MessageClickFun(messageList[index], index);
                }, "#73502D", "#E6A059", null);
            });
        }
        if (AvatarClickFun != null) {// 头像
            $("." + listId + "_avatar_root").each(function () {
                setBtnOnTouchEventNoColor($(this), function (mObj) {
                    var arr = mObj.id.split("_");
                    var len = arr.length;
                    var index = arr[len - 1];
                    AvatarClickFun(messageList[index], index);
                }, null);
            });
        }
    }
    function showLoading() {
        $("#" + listId + "_refreshProgress").css({ "display": "block" });
        $("#" + listId + "_line").css({ "display": "block" });
        loading.spin(o(listId + "_refreshProgress"));
    }
    function closeLoading() {
        $("#" + listId + "_refreshProgress").css({ "display": "none" });
        $("#" + listId + "_line").css({ "display": "none" });
        loading.spin();
    }
    var isLoadAjax = false;
    function loadAjax(isInit) {
        if (isLoadAjax) return;
        isLoadAjax = true;
        var param = requestParame + "&pageCount=" + pageSize + "&currentPage=" + currentPage + "&rand=" + randomString();
        requestAjax(requestUrl, param, function (jsonObj) {
            isLoadAjax = false;
            isLoading = false;
            closeLoading();
            if (jsonObj["code"] == 0) {
                if (ParseDataFun != null) {
                    jsonObj = ParseDataFun(jsonObj, isInit);
                }
                if (LoadOKFun != null) {
                    LoadOKFun();
                }
                var result = jsonObj["result"];
                var mList = result["list"];
                if (mList == null || mList["length"] == 0) {
                    loadError();
                    return;
                }
                currentPage = result["currentPage"];
                --currentPage;
                for (var i = 0; i < messageList["length"]; i++) {
                    mList.push(messageList[i]);
                }
                messageList = mList;
                showList(messageList, isInit);
            } else if (jsonObj["code"] == 100) {
                mToast.show("登录信息失效!", "1", "middle");
                appLogout();
            } else {
                mToast.show("读取信息出现错误!" + mLangObj.getZHByCode(jsonObj["tipMessage"]), "1", "middle");
            }
        }, function (error) {
            isLoadAjax = false;
            isLoading = false;
            closeLoading();
            loadError();
        });
        function loadError() {
            isLoading = false;
            if (messageList.length == 0) showEmpty();
        }
    }
    function isReady() {
        if (requestUrl != null && requestUrl != "") {
            return true;
        }
        return false;
    }
    function pushMessage(obj) {
    }
    function setFromName(name) {
        fromName = name;
    }
    function setToName(name) {
        toName = name;
    }
    function setGroupIs(is) {
        isGroup = is;
    }
    function formatTime(time) {
        var nowDate = getTimeZoneE8(timeZone, new Date());
        var nowYear = nowDate.getFullYear();
        var nowMonte = nowDate.getMonth() + 1;
        var nowDay = nowDate.getDate();
        var sendDate = getTimeZoneE8(timeZone, time);
        var year = sendDate.getFullYear();
        var monte = sendDate.getMonth() + 1;
        var day = sendDate.getDate();
        if (nowYear == year) {
            if (nowMonte == monte && nowDay == day) {
                return sendDate.format("hh:mm");
            } else {
                return sendDate.format("MM-dd hh:mm");
            }
        } else {
            return sendDate.format("yyyy-MM-dd hh:mm");
        }
    }
    function updateFrame(optH) {
        $("#" + rootId).css({ "height": screenH - topH - optDefH - optH });
        $("#" + rootId + "_list").css({ "height": screenH - topH - optDefH - optH });
    }
}
function ChatList(rootId, subMenuId, size) {
    var layoutObj;
    var loading = new Spinner({ color: "#FFFFFF" });
    var isLoading = false;

    var requestUrl;
    var requestParame;
    var dataList = new Array();

    var itemClickHandel = null;
    var itemClickLongBtn1Handel = null;
    var itemClickLongBtn2Handel = null;
    var parseHandel = null;
    var loadOKHandel = null;

    var isRefresh = true;
    var isLoadMore = false;
    var pageSize = 20;
    var currentPage = 1;
    var outTime = 500;
    this.init = function () {
        layoutObj = $("#" + rootId);
        if (isNaN(size) && size > 0) pageSize = size;
        bindFrameView();
    }
    this.itemClickFunction = function (fun) {
        itemClickHandel = fun;
    }
    this.itemClickLongFunction = function (fun1, fun2) {
        itemClickLongBtn1Handel = fun1;
        itemClickLongBtn2Handel = fun2;
    }
    this.setParseFunction = function (fun) {
        parseHandel = fun;
    }
    this.setLoadOKFunction = function (fun) {
        loadOKHandel = fun;
    }
    this.loadData = function (url, parame) {
        requestUrl = url;
        requestParame = parame;
        refresh();
    }
    this.reloadData = function (parame) {
        requestParame = parame;
        refresh();
    }
    this.setOutTime = function (time) {
        outTime = time;
    }
    this.setIsRefresh = function (isRe) {
        isRefresh = isRe;
    }
    this.setIsLoadMore = function (isMore) {
        isLoadMore = isMore;
    }
    this.silentRefresh = function () {
        if (isReady()) silentRefresh();
    }
    function bindFrameView() {
        var re = "<div id=" + rootId + "_refreshProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items:center\"></div>";
        var ce = "<div id=" + rootId + "_content style=\"width:100%\"></div>";
        var me = "<div id=" + rootId + "_moreProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items:center\"></div>";
        var le = "<div id=" + rootId + "_lineBtm style=\"width:100%;height:20px\"></div>";
        layoutObj.html(re + ce + me + le);
        BindT0UniqueEvent(rootId, "scroll", scrollHandel);
    }
    function getListHeight() {
        return $("#" + rootId + "_content").height() - 1;
    }
    var loadTimeout = null;
    function refresh() {
        closeLoading();
        isLoading = true;
        currentPage = 1;
        dataList = new Array();
        $("#" + rootId).scrollTop(0);
        showRefreshView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(true);
        }, outTime);
    }
    function more() {
        closeLoading();
        isLoading = true;
        showMoreView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(false);
        }, outTime);
    }
    function silentRefresh() {
        closeLoading();
        isLoading = true;
        currentPage = 1;
        dataList = new Array();
        $("#" + rootId).scrollTop(0);
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(true);
        }, outTime);
    }
    var scrollTopNum = 0;
    var scrollTopTimeout = null;
    function scrollHandel(e) {
        var scroll_top = layoutObj.scrollTop(); // 滑动量
        var scroll_height = layoutObj.height(); // div高度
        var doc_height = getListHeight(); // 内容文档高度
        var scrollLen = scroll_top + scroll_height;
        if (isLoadMore && !isLoading && (Math.abs(doc_height - scrollLen) <= 10)) {
            more();
        } else if (isRefresh && isReady() && !isLoading && scroll_top == 0) {
            if (scrollTopNum == 1) {
                if (scrollTopTimeout != null) clearTimeout(scrollTopTimeout);
                refresh();
                scrollTopNum = 0;
            } else {
                ++scrollTopNum;
                if (scrollTopTimeout != null) clearTimeout(scrollTopTimeout);
                scrollTopTimeout = setTimeout(function () { scrollTopNum = 0 }, 2500);
            }
        }
    }
    function showList(datas, pageInfo) {
        var len = datas.length;
        var divs = "";
        var itemLayout = "<div class=\"" + rootId + "_item_layout\" id=\"[id]\">[content]</div>";
        var line = "<div class=\"" + rootId + "_line_root\"><div class=\"" + rootId + "_line\"></div></div>";
        var lineNotMin_H = "<div style=\"height:3px\"></div>";
        var lineNotMax_H = "<div style=\"height:10px\"></div>";
        var lineNotMin_W = "<div style=\"width:10px\"></div>";
        var lineNotMax_W = "<div style=\"width:18px\"></div>";

        var avatarRoot = "<div class=\"" + rootId + "_avatar_root\">[content]</div>";
        var avatar = "<div class=\"" + rootId + "_avatar\"><img class=\"" + rootId + "_avatarImg\" src=\"[src]\"/></div>";
        var notRead = "<div class=\"" + rootId + "_notRead\">[content]</div>";
        var notReadMute = "<div class=\"" + rootId + "_notReadMute\"></div>";

        var txtRoot = "<div class=\"" + rootId + "_txt\">[content]</div>";
        var lineName = "<div class=\"" + rootId + "_lineName\">[content]</div>";
        var name = "<div class=\"" + rootId + "_name\">[name]</div>";
        var date = "<div class=\"" + rootId + "_date\">[date]</div>";

        var lineMsg = "<div class=\"" + rootId + "_lineMsg\">[content]</div>";
        var msg = "<div class=\"" + rootId + "_msg\">[msg]</div>";
        var mute = "<img src=\"" + themPath + "mute.png\" style=\"width:12px\"/>";

        for (var i = 0; i < len; i++) {
            var item = datas[i];
            var avaRot = "";
            var notReadSize = item["notRead"]; // 未读消息
            var isMute = item["isMute"]; // 是否静音
            var avatarSrc = item["avatar"]; // 头像
            var nickName = item["nickName"]; // 昵称 备注
            var sendTime = item["sendTime"]; // 消息发送时间
            var type = item["type"]; // 消息类型
            var msgObj = item["data"]; // 消息体
            if (notReadSize == 0) { avaRot = avatarRoot.replace("[content]", avatar.replace("[src]", avatarSrc)); } else {
                if (isMute) {
                    avaRot = avatarRoot.replace("[content]", avatar.replace("[src]", avatarSrc) + notReadMute);
                } else {
                    if (notReadSize > 99) notReadSize = "99+";
                    avaRot = avatarRoot.replace("[content]", avatar.replace("[src]", avatarSrc) + notRead.replace("[content]", notReadSize));
                }
            }
            var ln = lineName.replace("[content]", name.replace("[name]", nickName) + date.replace("[date]", VisibleTime(sendTime)));
            var lm = "";
            var newMsg = "";
            switch (type) {
                case "image":
                    newMsg = msg.replace("[msg]", "[图片]");
                    break;
                case "text":
                    newMsg = msg.replace("[msg]", msgObj["text"]);
                    break;
                case "red":
                    newMsg = msg.replace("[msg]", "[红包]");
                    break;
            }
            if (isMute) {
                lm = lineMsg.replace("[content]", newMsg + mute);
            } else {
                lm = lineMsg.replace("[content]", newMsg);
            }
            var tRot = txtRoot.replace("[content]", ln + lineNotMin_H + lm);

            var itemId = rootId + "_item_" + i;
            var content = lineNotMax_W + avaRot + lineNotMax_W + tRot + lineNotMin_W;
            divs += itemLayout.replace("[id]", itemId).replace("[content]", content) + line;
        }
        // 分页信息
        if (pageInfo != null) {
            var pages = "总页数:" + pageInfo["pages"];
            var pagec = "当前页:" + pageInfo["currentPage"];
            var totalRow = "总条数:" + pageInfo["totalRow"];
            var pagem = "每页数:" + pageInfo["pageCount"];
            var pinfo = "<div class=\"" + rootId + "_pageInfo\">[content]</div>";
            $("#" + rootId + "_content").html(divs + pinfo.replace("[content]", pages + "," + pagec + "," + totalRow + "," + pagem));
        } else {
            $("#" + rootId + "_content").html(divs);
        }
        setItemStyle();
    }
    function showEmpty() {
        var back = "<div id=\"" + rootId + "_failedBg\">[content]</div>";
        var view = "<div id=\"" + rootId + "_failedDiv\">[content]</div>";
        var img = "<div style=\"height:80px\"><img class=\"openGameFailureImg\" src=\"" + themPath + "sorry.png\"/></div>";
        var textBt = "<div style=\"font-size:16px;color:" + mainColor + "\">很抱歉</div>";
        var textTs = "<div style=\"font-size:14px;color:#999999\">没有读取到数据,请重试!</div>";
        var reLoadBtn = "<div id=\"" + rootId + "_reLoadBtn\">重新加载</div>";
        var lineMax = "<div style=\"height:6px\"></div>";
        var lineMin = "<div style=\"height:1px\"></div>";
        back = back.replace("[content]", view.replace("[content]", img + lineMax + textBt + lineMin + textTs + lineMax + reLoadBtn));
        $("#" + rootId + "_content").html(back);
        $("#" + rootId + "_content").css({
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_failedBg").css({
            "width": "100%",
            "height": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_failedDiv").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_reLoadBtn").css({
            "width": "45%",
            "height": "32px",
            "border-radius": "20px",
            "background": mainColor,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "0px 10px 0px 10px",
            "font-size": "12px",
            "color": mainFontColor,
            "box-sizing": "border-box"
        });
        setBtnOnTouchEvent($("#" + rootId + "_reLoadBtn"), function () {
            refresh();
        }, mainColorDeep, mainColor, null);
    }
    function setItemStyle() {
        $("." + rootId + "_item_layout").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "12px 0px 12px 0px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_avatar_root").css({
            "position": "relative",
            "width": "45px",
            "height": "45px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_avatar").css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "width": "45px",
            "height": "45px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_avatarImg").css({
            "width": "45px",
            "height": "45px",
            "border-radius": "50%",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_notRead").css({
            "position": "absolute",
            "top": "0px",
            "right": "0px",
            "width": "20px",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "3px 4px 3px 4px",
            "background": "red",
            "border-radius": "10px",
            "font-size": "10px",
            "color": "white",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_notReadMute").css({
            "position": "absolute",
            "top": "0px",
            "right": "0px",
            "width": "10px",
            "height": "10px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "background": "red",
            "border-radius": "50%",
            "box-sizing": "border-box"
        });
        var txtW = screenW - 18 - 45 - 18 - 10;
        $("." + rootId + "_txt").css({
            "text-align": "center",
            "width": txtW,
            "box-sizing": "border-box"
        });
        $("." + rootId + "_lineName").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "width": "100%",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_name").css({
            "width": "80%",
            "text-align": "left",
            "font-size": "16px",
            "color": "#F5F5F5",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        });
        $("." + rootId + "_date").css({
            "font-size": "10px",
            "color": "#A1A1A1",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        });
        $("." + rootId + "_lineMsg").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "width": "100%",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_msg").css({
            "width": "80%",
            "text-align": "left",
            "font-size": "10px",
            "color": "#A1A1A1",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        });
        $("." + rootId + "_line_root").css({
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center",
            "width": "100%",
            "height": "1px"
        });
        $("." + rootId + "_line").css({
            "width": screenW - 18 - 45 - 18,
            "height": "1px",
            "background": "#3D3D3D"
        });
        $("." + rootId + "_item_layout").each(function () {
            setBtnOnTouchLongEvent($(this), function (mObj, x, y) { // 长按事件
                var list = mObj.id.split("_");
                var len = list.length;
                var index = list[len - 1];
                bindSubMenu(index, x, y);
            }, function (mObj) { // 点击事件
                var list = mObj.id.split("_");
                var len = list.length;
                var index = list[len - 1];
                itemClickHandel(dataList[index], index);
            }, "#1D1D1D", pageBgColor);
        });
    }
    function bindSubMenu(index, x, y) {
        var item = dataList[index];
        var menuId = subMenuId + "_subMenu_" + index;
        var menu = "<div id=\"" + menuId + "\">[content]</div>";
        var btn1 = "<div id=\"" + menuId + "_btn1\">置顶聊天</div>";
        var btn2 = "<div id=\"" + menuId + "_btn2\">[text]</div>";
        if (item["notRead"] > 0) {
            btn2 = btn2.replace("[text]", "标记为已读");
        } else {
            btn2 = btn2.replace("[text]", "标记为未读");
        }
        menu = menu.replace("[content]", btn1 + btn2);
        $("#" + subMenuId).html(menu);
        $("#" + subMenuId).css({
            "display": "block"
        });
        var top = y - topH - 0.5;
        var left = x;
        if ((y + 120) > screenH) {
            top = top - 120;
        }
        if ((x + 120) > screenW) {
            left = left - 120;
        }
        if (Math.abs(screenW - (left + 120)) < 10) {
            left = left - 10;
        }
        if (left < 10) {
            left = 10;
        }
        $("#" + menuId).css({
            "position": "absolute",
            "top": top,
            "left": left,
            "width": "120px",
            "height": "120px",
            "box-shadow": "0px 0px 3px 3px #171717",
            "background": "#272727",
            "box-sizing": "border-box"
        });
        $("#" + menuId + "_btn1").css({
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "width": "120px",
            "height": "60px",
            "font-size": "14px",
            "color": "#F6F6F6",
            "padding": "0px 20px 0px 20px",
            "box-sizing": "border-box"
        });
        $("#" + menuId + "_btn2").css({
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "width": "120px",
            "height": "60px",
            "font-size": "14px",
            "color": "#F6F6F6",
            "padding": "0px 20px 0px 20px",
            "box-sizing": "border-box"
        });
        $("#" + subMenuId).click(function () {
            $("#" + subMenuId).css({ "display": "none" });
        });
        setBtnOnTouchEvent($("#" + menuId + "_btn1"), function (mObj) {
            $("#" + subMenuId).css({ "display": "none" });
            itemClickLongBtn1Handel(item, index);
        }, "#1D1D1D", "", null);
        setBtnOnTouchEvent($("#" + menuId + "_btn2"), function (mObj) {
            $("#" + subMenuId).css({ "display": "none" });
            itemClickLongBtn2Handel(item, index);
        }, "#1D1D1D", "", null);
    }
    function showRefreshView() {
        $("#" + rootId + "_refreshProgress").css({ "display": "block" });
        loading.spin(o(rootId + "_refreshProgress"));
    }
    function showMoreView() {
        $("#" + rootId + "_moreProgress").css({ "display": "block" });
        $("#" + rootId + "_lineBtm").css({ "display": "block" });
        loading.spin(o(rootId + "_moreProgress"));
    }
    function closeLoading() {
        $("#" + rootId + "_refreshProgress").css({ "display": "none" });
        $("#" + rootId + "_moreProgress").css({ "display": "none" });
        $("#" + rootId + "_lineBtm").css({ "display": "none" });
        loading.spin();
    }
    var isLoadAjax = false;
    function loadAjax(mode) {
        if (isLoadAjax) return;
        isLoadAjax = true;
        var param = requestParame + "&pageCount=" + pageSize + "&currentPage=" + currentPage + "&rand=" + randomString();
        requestAjax(requestUrl, param, function (jsonObj) {
            isLoadAjax = false;
            isLoading = false;
            closeLoading();
            if (jsonObj["code"] == 0) {
                var pageInfo = getListPageInfo(jsonObj);
                if (parseHandel != null) {
                    jsonObj = parseHandel(jsonObj, mode);
                }
                if (loadOKHandel != null) {
                    loadOKHandel();
                }
                var result = jsonObj["result"];
                var mList = result["list"];
                if (mList == null || mList["length"] == 0) {
                    loadError();
                    return;
                }
                currentPage++;
                for (var i = 0; i < mList["length"]; i++) {
                    dataList.push(mList[i]);
                }
                showList(dataList, pageInfo);
            } else if (jsonObj["code"] == 100) {
                mToast.show("登录信息失效！", "1", "middle");
                appLogout();
            } else {
                mToast.show("读取信息出现错误！" + mLangObj.getZHByCode(jsonObj["tipMessage"]), "1", "middle");
            }
        }, function (error) {
            isLoadAjax = false;
            isLoading = false;
            closeLoading();
            loadError();
        });
        function loadError() {
            isLoading = false;
            if (dataList["length"] == 0) {
                showEmpty();
            }
        }
    }
    function isReady() {
        if (requestUrl != null && requestUrl != "") {
            return true;
        }
        return false;
    }
}
function ChatTopNoneList(rootId) {
    var requestUrl;
    var requestParame;
    var dataList = new Array();
    var parseHandel = null;
    var loadOKHandel = null;
    var outTime = 500;
    this.init = function () {
        $("#" + rootId).css({
            "width": "auto",
            "height": "100%",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "padding": "5px",
            "box-sizing": "border-box"
        });
    }
    this.setParseFunction = function (fun) {
        parseHandel = fun;
    }
    this.setLoadOKFunction = function (fun) {
        loadOKHandel = fun;
    }
    this.loadData = function (url, parame) {
        requestUrl = url;
        requestParame = parame;
        refresh();
    }
    this.reloadData = function (parame) {
        requestParame = parame;
        refresh();
    }
    this.setOutTime = function (time) {
        outTime = time;
    }
    this.refresh = function () {
        if (isReady()) refresh();
    }
    var loadTimeout = null;
    function refresh() {
        dataList = new Array();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(loadAjax, outTime);
    }
    function showList(datas) {
        var len = datas.length;
        var divs = "";
        var itemLayout = "<div class=\"" + rootId + "_item_layout\" id=\"[id]\">[content]</div>";
        var lineNotMin_H = "<div style=\"height:3px\"></div>";
        var lineNotMax_H = "<div style=\"height:10px\"></div>";
        var lineNotMin_W = "<div style=\"width:5px\"></div>";
        var lineNotMax_W = "<div style=\"width:10px\"></div>";

        var avatarRoot = "<div class=\"" + rootId + "_avatar_root\">[content]</div>";
        var avatar = "<div class=\"" + rootId + "_avatar\"><img class=\"" + rootId + "_avatarImg\" src=\"[src]\"/></div>";
        var notRead = "<div class=\"" + rootId + "_notRead\">[content]</div>";
        var notReadMute = "<div class=\"" + rootId + "_notReadMute\"></div>";

        var txtRoot = "<div class=\"" + rootId + "_txt\">[content]</div>";
        var lineName = "<div class=\"" + rootId + "_lineName\">[content]</div>";
        var name = "<div class=\"" + rootId + "_name\">[name]</div>";
        var date = "<div class=\"" + rootId + "_date\">[date]</div>";

        var lineMsg = "<div class=\"" + rootId + "_lineMsg\">[content]</div>";
        var msg = "<div class=\"" + rootId + "_msg\">[msg]</div>";
        var mute = "<img src=\"" + themPath + "mute.png\" style=\"width:10px\"/>";

        for (var i = 0; i < len; i++) {
            var item = datas[i];
            var avaRot = "";
            var notReadSize = item["notRead"];
            var isMute = item["isMute"];
            var avatarSrc = item["avatar"];
            var nickName = item["nickName"];
            var sendTime = item["sendTime"];
            var type = item["type"];
            var msgObj = item["data"];
            if (notReadSize == 0) { avaRot = avatarRoot.replace("[content]", avatar.replace("[src]", avatarSrc)); } else {
                if (isMute) {
                    avaRot = avatarRoot.replace("[content]", avatar.replace("[src]", avatarSrc) + notReadMute);
                } else {
                    if (notReadSize > 99) notReadSize = "99+";
                    avaRot = avatarRoot.replace("[content]", avatar.replace("[src]", avatarSrc) + notRead.replace("[content]", notReadSize));
                }
            }
            var ln = lineName.replace("[content]", name.replace("[name]", nickName) + date.replace("[date]", VisibleTime(sendTime)));
            var lm = ""; var newMsg = "";
            switch (type) {
                case "image":
                    newMsg = msg.replace("[msg]", "[图片]");
                    break;
                case "text":
                    newMsg = msg.replace("[msg]", msgObj["text"]);
                    break;
                case "red":
                    newMsg = msg.replace("[msg]", "[红包]");
                    break;
            }
            if (isMute) {
                lm = lineMsg.replace("[content]", newMsg + mute);
            } else {
                lm = lineMsg.replace("[content]", newMsg);
            }
            var tRot = txtRoot.replace("[content]", ln + lineNotMin_H + lm);

            var itemId = rootId + "_item_" + i;
            var content = lineNotMin_W + avaRot + lineNotMin_W + tRot + lineNotMin_W;
            divs += itemLayout.replace("[id]", itemId).replace("[content]", content);
        }
        $("#" + rootId).html(divs);
        setItemStyle();
    }
    function setItemStyle() {
        var itemW = screenW / 2.5;
        $("." + rootId + "_item_layout").css({
            "width": itemW,
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "12px 0px 12px 0px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_avatar_root").css({
            "position": "relative",
            "width": "35px",
            "height": "35px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_avatar").css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "width": "35px",
            "height": "35px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_avatarImg").css({
            "width": "35px",
            "height": "35px",
            "border-radius": "50%",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_notRead").css({
            "position": "absolute",
            "top": "0px",
            "right": "0px",
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "3px",
            "background": "red",
            "border-radius": "10px",
            "font-size": "10px",
            "color": "white",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_notReadMute").css({
            "position": "absolute",
            "top": "0px",
            "right": "0px",
            "width": "10px",
            "height": "10px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "3px 4px 3px 4px",
            "background": "red",
            "border-radius": "50%",
            "box-sizing": "border-box"
        });
        var txtW = itemW - 5 - 35 - 5 - 5;
        $("." + rootId + "_txt").css({
            "text-align": "center",
            "width": txtW,
            "box-sizing": "border-box"
        });
        $("." + rootId + "_lineName").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "width": "100%",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_name").css({
            "width": "65%",
            "text-align": "left",
            "font-size": "12px",
            "color": "#F5F5F5",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        });
        $("." + rootId + "_date").css({
            "font-size": "10px",
            "color": "#A1A1A1",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        });
        $("." + rootId + "_lineMsg").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "width": "100%",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_msg").css({
            "width": "80%",
            "text-align": "left",
            "font-size": "10px",
            "color": "#A1A1A1",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        });
    }
    var isLoadAjax = false;
    function loadAjax() {
        if (isLoadAjax) return;
        isLoadAjax = true;
        var param = requestParame + "&pageCount=-1&currentPage=1&rand=" + randomString();
        requestAjax(requestUrl, param, function (jsonObj) {
            isLoadAjax = false;
            if (jsonObj["code"] == 0) {
                if (parseHandel != null) {
                    jsonObj = parseHandel(jsonObj);
                }
                if (loadOKHandel != null) {
                    loadOKHandel();
                }
                var result = jsonObj["result"];
                var mList = result["list"];
                if (mList == null || mList["length"] == 0) {
                    loadError();
                    return;
                }
                for (var i = 0; i < mList["length"]; i++) {
                    dataList.push(mList[i]);
                }
                showList(dataList);
            } else if (jsonObj["code"] == 100) {
                mToast.show("登录信息失效！", "1", "middle");
                appLogout();
            } else {
                mToast.show("读取信息出现错误！" + mLangObj.getZHByCode(jsonObj["tipMessage"]), "1", "middle");
            }
        }, function (error) {
            isLoadAjax = false;
            loadError();
        });
        function loadError() {
            if (dataList["length"] == 0) {
                showEmpty();
            }
        }
    }
    function isReady() {
        if (requestUrl != null && requestUrl != "") {
            return true;
        }
        return false;
    }
}
function ChatMessageList() {
    var mPage = new PAGE("chatContentDiv", "聊天");
    var chatSendZone = new ChatSendZone("chatContentDiv_content_send");
    var chatMsgZone = new ChatMessageZone("chatContentDiv_content_list", "testcn", 58.5, 30);
    var chatTopNoneList = null;
    var sessionItem = null;
    var isBack = false;
    this.init = function () {
        mPage.init(function () { // back
            isBack = true;
            console.log("back click");
        }, function () {// setting
            var type = sessionItem["sessionType"];
            switch (type) {
                case 1: chatPersonal.show(sessionItem); break;
                case 2: chatGroup.show(sessionItem); break;
                default: break;
            }
            console.log("setting click");
        });
        mPage.onResume(function () {
            mChatApp.getRootNode().css({ "position": "absolute" });
            console.log("ChatMessageList onResume");
        });
        mPage.onPause(function () {
            chatSendZone.closeOpt();
            mChatApp.getRootNode().css({ "position": "fixed" });
            console.log("ChatMessageList onPause");
        });
        chatMsgZone.init();
        chatMsgZone.setFromName("testcn"); // 自己
        chatMsgZone.setLoadOKFunction(function () {
        });
        chatMsgZone.setMessageClickFunction(function (item, index) {
            var type = item["type"];
            switch (type) {
                case "image": chatImageLook.show(item["data"]["url"]); break;
                case "text": break;
                case "red": chatDownRed.show(item); break;
            }
            console.log("MessageClickFunction :" + item["type"] + " index:" + index);
        });
        chatMsgZone.setAvatarClickFunction(function (item, index) {
            var obj = item;
            obj["name"] = item["fromName"];
            chatPersonalOpt.show(obj);
            console.log("AvatarClickFunction :" + item["type"] + " index:" + index);
        })
        chatMsgZone.setParseFunction(function (jsonObj, isInit) {
            console.log(isInit ? "初始化刷新" : "更多刷新");
            var list = new Array();
            for (var i = 0; i < 30; i++) {
                var item = new Object();
                item["fromName"] = (i % 2 == 0 ? "testcn" : "testcn_" + i);
                item["toName"] = "testun";
                var avNum = i + 1;
                if (avNum < 10) avNum = "0" + avNum;
                item["avatar"] = "header/B_0" + avNum + ".jpg";
                if ((i + 1) % 2 == 0) {
                    item["type"] = "image";
                    var obj = new Object();
                    obj["id"] = i;
                    obj["url"] = "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg";
                    item["data"] = obj;
                } else {
                    if ((i + 1) % 5 == 0) {
                        item["type"] = "red";
                        var obj = new Object();
                        obj["id"] = i;
                        obj["text"] = "恭喜发财,大吉大利!";
                        obj["redType"] = "葡京娱乐红包";
                        obj["status"] = 2;
                        item["data"] = obj;
                    } else {
                        item["type"] = "text";
                        var obj = new Object();
                        obj["id"] = i;
                        obj["text"] = "哈哈哈哈哈哈哈哈哈";
                        item["data"] = obj;
                    }
                }
                item["nickName"] = "我是你爸爸" + i;
                item["sendTime"] = new Date().getTime() - (120000 * (i + 1));
                console.log(item);
                list.push(item);
            }
            var returnObj = new Object();
            returnObj["result"] = new Object();
            returnObj["result"]["list"] = list;
            return returnObj;
        });
        if (chatTopNoneList == null) chatTopNoneList = chatMsgZone.getTopNone();
        chatTopNoneList.setParseFunction(function (jsonObj) {
            var list = new Array();
            for (var i = 0; i < 30; i++) {
                var item = new Object();
                item["notRead"] = i * i;
                item["isMute"] = ((i + 1) % 2 == 0 ? true : false);
                var avNum = i + 1;
                if (avNum < 10) avNum = "0" + avNum;
                item["avatar"] = "header/B_0" + avNum + ".jpg";
                item["name"] = "testun";
                item["nickName"] = "我是你爸爸" + i;
                item["sendTime"] = new Date().getTime();
                if ((i + 1) % 2 == 0) {
                    item["type"] = "image";
                    var obj = new Object();
                    obj["id"] = i;
                    obj["url"] = "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg";
                    item["data"] = obj;
                } else {
                    if ((i + 1) % 5 == 0) {
                        item["type"] = "red";
                        var obj = new Object();
                        obj["id"] = i;
                        obj["text"] = "恭喜发财,大吉大利!";
                        obj["redType"] = "葡京娱乐红包";
                        obj["status"] = 1;
                        item["data"] = obj;
                    } else {
                        item["type"] = "text";
                        var obj = new Object();
                        obj["id"] = i;
                        obj["text"] = "哈哈哈哈哈哈哈哈哈";
                        item["data"] = obj;
                    }
                }
                list.push(item);
            }
            var returnObj = new Object();
            returnObj["result"] = new Object();
            returnObj["result"]["list"] = list;
            return returnObj;
        });
        chatTopNoneList.setLoadOKFunction(function () {
        });
        chatSendZone.setChatMessageZone(chatMsgZone);
        chatSendZone.init(function (obj, resultBack) { // 消息发送回调
            var type = obj["type"];
            switch (type) {
                case "image":
                    if (resultBack != null) {
                        resultBack({ "success": true });
                    }
                    console.log("send:" + type + " content:" + obj["src"]);
                    break;
                case "red":
                    if (resultBack != null) {
                        resultBack({ "success": true });
                    }
                    console.log("send:" + type);
                    break;
                case "text":
                    if (resultBack != null) {
                        resultBack({ "success": true });
                    }
                    console.log("send:" + type + " content:" + obj["msg"]);
                    break;
                default:
                    break;
            }
        });
    }
    this.show = function (item) {
        mPage.show(); sessionItem = item;
        mPage.setTitle(sessionItem["nickName"]);
        isBack = false;
        chatSendZone.setSessionItem(sessionItem);
        switch (sessionItem["sessionType"]) {
            case 1:
                chatMsgZone.setGroupIs(false);
                break;
            case 2:
                chatMsgZone.setGroupIs(true);
                break;
        }
        chatMsgZone.setToName(sessionItem["name"]); // 接收者(发送给谁)
        chatMsgZone.loadData(SERVER_ADD + "game/getGames", "");
        chatTopNoneList.loadData(SERVER_ADD + "game/getGames", "");
    }
}
function ChatGroup() {
    var rootId = "chatGroupDiv";
    var cId = rootId + "_content";
    var mPage = new PAGE(rootId, "群聊信息");
    var item = null;
    var isBack = false;
    this.init = function () {
        mPage.init(function () { // back
            isBack = true;
            reSet();
            console.log("back click");
        });
        mPage.onResume(function () {
            console.log("chatGroup onResume");
        });
        mPage.onPause(function () {
            console.log("chatGroup onPause");
        });
        mPage.hiddenSetting();
        bindFrame();
    }
    this.show = function (im) {
        mPage.show();
        isBack = false;
        item = im;
        LoadGroup();
    }
    this.setSwichMute = setSwichMute;
    this.setSwichTopping = setSwichTopping;
    function LoadGroup() {
        var dataObj = new Object();
        dataObj["name"] = item["name"];
        mLoader.show("loadGroup");
        requestAjax("game/getGames", dataObj, function (jsonObj) {
            mLoader.unShow("loadGroup");
            if (jsonObj["code"] == 0) {
                var item_test = new Object();
                item_test["isEdit"] = false;
                item_test["isMute"] = true;
                item_test["isTopping"] = true;
                item_test["nickName"] = "";
                item_test["bulletin"] = "";
                item_test["users"] = new Array();
                for (var i = 0; i < 30; i++) {
                    var avNum = i + 1;
                    if (avNum < 10) avNum = "0" + avNum;
                    var user = new Object();
                    user["avatar"] = "header/B_0" + avNum + ".jpg";
                    user["name"] = "testun";
                    user["nickName"] = "我是你爸爸" + i;
                    item_test["users"].push(user);
                }
                jsonObj["result"] = item_test;
                bindContent(jsonObj["result"]);
            } else {
                LoadError(mLangObj.getZHByCode(jsonObj["tipMessage"]));
            }
        }, function (error) {
            mLoader.unShow("loadGroup");
            LoadError(error);
        });
        function LoadError(error) {
            if (error == null) {
                mToast.show("群聊信息获取失败,请重试!", 1, "middle");
            } else {
                mToast.show("群聊信息获取失败,请重试! <br>" + error, 2, "middle");
            }
        }
    }
    function bindFrame() {
        var edit_img = "<img src=\"" + themPath + "edit.png\" style=\"width:20px\"/>";
        var arrow_img = "<img src=\"" + themPath + "arrow.png\" style=\"width:8px\"/>";
        var lineMinY = "<div style=\"width:100%;height:1px;background:#3B3B3B\"></div>";
        var lineMaxY = "<div style=\"width:100%;height:10px;background:#3B3B3B\"></div>";
        var root = "<div id=\"" + cId + "_root\" >[content]</div>";
        var list = "<div id=\"" + cId + "_list\"><div id=\"" + cId + "_list_content\"></div></div>";
        var name_rot = "<div class=\"" + cId + "_item_rot\">[content]</div>";
        var name_bt = "<div class=\"" + cId + "_item_txt\">群聊名称</div>";
        var name_et = "<div id=\"" + cId + "_name_et\">[content]</div>";
        var name_et_input = "<input id=\"" + cId + "_name_input\" type=\"text\" maxlength=\"10\" />";
        var name_et_img = "<div id=\"" + cId + "_name_img\">" + edit_img + "</div>";
        name_et = name_et.replace("[content]", name_et_input + name_et_img);
        name_rot = name_rot.replace("[content]", name_bt + name_et);
        var notice_rot = "<div id=\"" + cId + "_notice_rot\">[content]</div>";
        var notice_top = "<div id=\"" + cId + "_notice_top\">[content]</div>";
        var notice_top_txt = "<div id=\"" + cId + "_notice_top_txt\">群公告</div>";
        var notice_top_edit = "<div id=\"" + cId + "_notice_top_edit\">" + edit_img + "</div>";
        notice_top = notice_top.replace("[content]", notice_top_txt + notice_top_edit);
        var notice_bot = "<textarea id=\"" + cId + "_notcie_input\" maxlength=\"150\"/>";
        notice_rot = notice_rot.replace("[content]", notice_top + notice_bot);
        var mute_rot = "<div class=\"" + cId + "_item_rot\">[content]</div>";
        var mute_left = "<div class=\"" + cId + "_item_txt\">消息免打扰</div>";
        var mute_right = "<div id=\"" + cId + "_mute_right\" class=\"" + cId + "_swich_rot\">[content]</div>";
        var mute_right_open = "<div id=\"" + cId + "_mute_right_open\" class=\"" + cId + "_swich_open\"></div>";
        var mute_right_close = "<div id=\"" + cId + "_mute_right_close\" class=\"" + cId + "_swich_close\"></div>";
        mute_right = mute_right.replace("[content]", mute_right_close + mute_right_open);
        mute_rot = mute_rot.replace("[content]", mute_left + mute_right);
        var topping_rot = "<div class=\"" + cId + "_item_rot\">[content]</div>";
        var topping_left = "<div class=\"" + cId + "_item_txt\">置顶聊天</div>";
        var topping_right = "<div id=\"" + cId + "_topping_right\" class=\"" + cId + "_swich_rot\">[content]</div>";
        var topping_right_open = "<div id=\"" + cId + "_topping_right_open\" class=\"" + cId + "_swich_open\"></div>";
        var topping_right_close = "<div id=\"" + cId + "_topping_right_close\" class=\"" + cId + "_swich_close\"></div>";
        topping_right = topping_right.replace("[content]", topping_right_close + topping_right_open);
        topping_rot = topping_rot.replace("[content]", topping_left + topping_right);
        var clear = "<div id=\"" + cId + "_clear_rot\" class=\"" + cId + "_item_rot\">[content]</div>";
        var clear_txt = "<div class=\"" + cId + "_item_txt\">清空聊天记录</div>";
        var clear_img = "<div id=\"" + cId + "_clear_img\">" + arrow_img + "</div>";
        clear = clear.replace("[content]", clear_txt + clear_img);
        root = root.replace("[content]", list + lineMaxY + name_rot + lineMinY + notice_rot + lineMaxY + mute_rot + lineMinY + topping_rot + lineMaxY + clear + lineMaxY);
        $("#" + cId).html(root);
        setFrameStyle();
    }
    function setFrameStyle() {
        $("#" + cId).css({
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
        $("#" + cId + "_root").css({
            "width": "100%",
            "height": "auto"
        });
        $("#" + cId + "_list").css({
            "width": "100%",
            "height": screenH / 3,
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
        $("#" + cId + "_list_content").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "flex-wrap": "wrap",
            "padding": "20px 18px 0px 18px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_rot").css({
            "width": screenW,
            "height": "60px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "padding": "20px 18px 20px 18px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_txt").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": "16px",
            "color": "#F5F5F5",
            "box-sizing": "border-box"
        });
        var nameEtW = screenW / 2;
        $("#" + cId + "_name_et").css({
            "width": nameEtW,
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_name_input").css({
            "width": nameEtW - 26,
            "height": "auto",
            "text-align": "right",
            "font-size": "16px",
            "color": "#9D9D9D",
            "outline": "medium",
            "border": "none",
            "padding": "0px",
            "background": "transparent",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_name_img").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "border-radius": "5px",
            "padding": "3px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_notice_rot").css({
            "width": "100%",
            "height": "auto",
            "padding": "20px 18px 20px 18px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_notice_top").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_notice_top_txt").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": "16px",
            "color": "#F5F5F5",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_notice_top_edit").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "3px",
            "border-radius": "5px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_notcie_input").css({
            "width": "100%",
            "height": "80px",
            "text-align": "left",
            "font-size": "14px",
            "color": "#9D9D9D",
            "outline": "medium",
            "border": "none",
            "padding": "0px",
            "background": "transparent",
            "box-sizing": "border-box"
        });
        $("." + cId + "_swich_rot").css({
            "width": "50px",
            "height": "25px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "background": "#666666",
            "border-radius": "25px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_swich_open").css({
            "background": "#CCCCCC",
            "border-radius": "50%",
            "width": "25px",
            "height": "25px",
            "visibility": "hidden",
            "box-sizing": "border-box"
        });
        $("." + cId + "_swich_close").css({
            "background": "#CCCCCC",
            "border-radius": "50%",
            "width": "25px",
            "height": "25px",
            "display": "block",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_clear_img").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_name_input").val("编辑群聊名称");
        $("#" + cId + "_notcie_input").val("编辑群聊公告");
        $("#" + cId + "_name_input").attr("disabled", "disabled");
        $("#" + cId + "_notcie_input").attr("disabled", "disabled");
        $("#" + cId + "_name_img").css({ "display": "none" });
        $("#" + cId + "_notice_top_edit").css({ "display": "none" });
        var edit = "<img src=\"" + themPath + "edit.png\" style=\"width:20px\"/>";
        var save = "<img src=\"" + themPath + "save.png\" style=\"width:20px\"/>";
        setBtnOnTouchEvent($("#" + cId + "_name_img"), function (mObj) {
            var dis = $("#" + cId + "_name_input").attr("disabled");
            if (dis == "disabled") {
                $("#" + cId + "_name_input").attr("disabled", false);
                $("#" + cId + "_name_img").html(save);
            } else {
                $("#" + cId + "_name_input").attr("disabled", "disabled");
                $("#" + cId + "_name_img").html(edit);
                saveName($("#" + cId + "_name_input").val());
            }
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#" + cId + "_notice_top_edit"), function (mObj) {
            var dis = $("#" + cId + "_notcie_input").attr("disabled");
            if (dis == "disabled") {
                $("#" + cId + "_notcie_input").attr("disabled", false);
                $("#" + cId + "_notice_top_edit").html(save);
            } else {
                $("#" + cId + "_notcie_input").attr("disabled", "disabled");
                $("#" + cId + "_notice_top_edit").html(edit);
                saveNotice($("#" + cId + "_notcie_input").val());
            }
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#" + cId + "_clear_rot"), function (mObj) {
            clearRecordHandel();
        }, "#141414", "", null);
        $("#" + cId + "_mute_right").click(function () {
            var dis = $("#" + cId + "_mute_right_open").css("visibility");
            if (dis == "hidden") {
                $("#" + cId + "_mute_right").css({ "background": "#CCA352" });
                $("#" + cId + "_mute_right_open").css({ "visibility": "visible" });
                $("#" + cId + "_mute_right_close").css({ "visibility": "hidden", });
                swichMuteHandel(true);
            } else {
                $("#" + cId + "_mute_right").css({ "background": "#666666" });
                $("#" + cId + "_mute_right_open").css({ "visibility": "hidden", });
                $("#" + cId + "_mute_right_close").css({ "visibility": "visible", });
                swichMuteHandel(false);
            }
        });
        $("#" + cId + "_topping_right").click(function () {
            var dis = $("#" + cId + "_topping_right_open").css("visibility");
            if (dis == "hidden") {
                $("#" + cId + "_topping_right").css({ "background": "#CCA352" });
                $("#" + cId + "_topping_right_open").css({ "visibility": "visible" });
                $("#" + cId + "_topping_right_close").css({ "visibility": "hidden" });
                swichToppingHandel(true);
            } else {
                $("#" + cId + "_topping_right").css({ "background": "#666666" });
                $("#" + cId + "_topping_right_open").css({ "visibility": "hidden" });
                $("#" + cId + "_topping_right_close").css({ "visibility": "visible" });
                swichToppingHandel(false);
            }
        });
    }
    function bindContent(result) {
        var userList = result["users"]; // 群聊用户信息
        var uLen = userList.length;
        var itemW = ((screenW - 36) / 5) * 0.9;
        var avatarW = itemW - 6;
        var uRot = "<div class=\"" + cId + "_user_rot\">[content]</div>";
        var uAvatar = "<img class=\"" + cId + "_user_img\" id=\"" + cId + "_user_img_[+id]\" src=\"[src]\"/>";
        var uNickName = "<div class=\"" + cId + "_user_name\">[content]</div>";
        var divs = "";
        for (var i = 0; i < uLen; i++) {
            var uItem = userList[i];
            var avatarSrc = uItem["avatar"];
            var unName = uItem["nickName"];
            var name = uItem["name"];
            var ava = uAvatar.replace("[+id]", i).replace("[src]", avatarSrc);
            var nick = uNickName.replace("[content]", unName);
            divs += uRot.replace("[content]", ava + nick);
        }
        $("#" + cId + "_list_content").html(divs);
        setStyle();
        var nNameGroup = result["nickName"]; // 群聊名称
        if (nNameGroup == null || nNameGroup == "") nNameGroup = "未命名的群聊";
        $("#" + cId + "_name_input").val(nNameGroup);
        var bulletin = result["bulletin"]; // 公告
        if (bulletin == null || bulletin == "") bulletin = "群主很懒什么都没有留下!";
        $("#" + cId + "_notcie_input").val(bulletin);
        var isEdit = result["isEdit"]; // 是否可以编辑群聊信息
        $("#" + cId + "_name_input").attr("disabled", "disabled");
        $("#" + cId + "_notcie_input").attr("disabled", "disabled");
        if (isEdit) {
            $("#" + cId + "_name_img").css({ "display": "flex" });
            $("#" + cId + "_notice_top_edit").css({ "display": "flex" });
        } else {
            $("#" + cId + "_name_img").css({ "display": "none" });
            $("#" + cId + "_notice_top_edit").css({ "display": "none" });
        }
        var isMute = result["isMute"]; // 是否静音
        if (isMute == null) isMute = false;
        setSwichMute(isMute);
        var isTopping = result["isTopping"]; // 是否置顶
        if (isTopping == null) isTopping = false;
        setSwichTopping(isTopping);

        function setStyle() {
            $("." + cId + "_user_rot").css({
                "width": itemW,
                "height": "auto",
                "display": "flex",
                "flex-direction": "column",
                "justify-content": "flex-start",
                "align-items": "center",
                "padding": "0px 3px 20px 3px",
                "box-sizing": "border-box"
            });
            $("." + cId + "_user_img").css({
                "width": avatarW,
                "height": avatarW,
                "border-radius": "50%",
                "box-sizing": "border-box"
            });
            $("." + cId + "_user_name").css({
                "width": itemW - 6,
                "height": "auto",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "font-size": "10px",
                "color": "#A1A1A1",
                "white-space": "nowrap",
                "text-overflow": "ellipsis",
                "text-overflow": "ellipsis",
                "overflow": "hidden",
                "margin-top": "2px",
                "box-sizing": "border-box"
            });
            $("." + cId + "_user_img").each(function () {
                setBtnOnTouchEventNoColor($(this), function (mObj) {
                    var list = mObj.id.split("_");
                    var len = list.length;
                    var index = list[len - 1];
                    goToPersonalOpt(userList[index], index);
                }, null);
            });
        }
    }
    function swichMuteHandel(mode) {
        console.log("swichMute mode:" + mode);
    }
    function setSwichMute(mode) {
        if (mode) {
            $("#" + cId + "_mute_right").css({ "background": "#CCA352" });
            $("#" + cId + "_mute_right_open").css({ "visibility": "visible" });
            $("#" + cId + "_mute_right_close").css({ "visibility": "hidden", });
        } else {
            $("#" + cId + "_mute_right").css({ "background": "#666666" });
            $("#" + cId + "_mute_right_open").css({ "visibility": "hidden", });
            $("#" + cId + "_mute_right_close").css({ "visibility": "visible", });
        }
    }
    function swichToppingHandel(mode) {
        console.log("swichTopping mode:" + mode);
    }
    function setSwichTopping(mode) {
        if (mode) {
            $("#" + cId + "_topping_right").css({ "background": "#CCA352" });
            $("#" + cId + "_topping_right_open").css({ "visibility": "visible" });
            $("#" + cId + "_topping_right_close").css({ "visibility": "hidden" });
        } else {
            $("#" + cId + "_topping_right").css({ "background": "#666666" });
            $("#" + cId + "_topping_right_open").css({ "visibility": "hidden" });
            $("#" + cId + "_topping_right_close").css({ "visibility": "visible" });
        }
    }
    function clearRecordHandel() {
        mMsgBox.show("提示", "确定清除聊天记录吗？", function () {
        }, null);
        console.log("clearRecord");
    }
    function saveName(val) {
        console.log("saveName val:" + val);
    }
    function saveNotice(val) {
        console.log("saveNotice val:" + val);
    }
    function goToPersonalOpt(userItem) {
        chatPersonalOpt.show(userItem);
        console.log("goToPersonal:" + userItem["name"]);
    }
    function reSet() {
        var edit = "<img src=\"" + themPath + "edit.png\" style=\"width:20px\"/>";
        $("#" + cId + "_name_input").attr("disabled", "disabled");
        $("#" + cId + "_notcie_input").attr("disabled", "disabled");
        $("#" + cId + "_name_img").html(edit);
        $("#" + cId + "_notice_top_edit").html(edit);
    }
}
function ChatPersonal() {
    var rootId = "chatPersonalDiv";
    var cId = rootId + "_content";
    var mPage = new PAGE(rootId, "聊天信息");
    var isBack = false;
    var item = null;
    this.init = function () {
        mPage.init(function () { // back
            isBack = true;
            console.log("back click");
        });
        mPage.onResume(function () {
            console.log("chatPersonal onResume");
        });
        mPage.onPause(function () {
            console.log("chatPersonal onPause");
        });
        mPage.hiddenSetting();
        bindFrame();
    }
    this.show = function (im) {
        mPage.show();
        isBack = false;
        item = im;
        LoadPersonal();
    }
    this.setSwichMute = setSwichMute;
    this.setSwichTopping = setSwichTopping;
    function LoadPersonal() {
        var dataObj = new Object();
        dataObj["name"] = item["name"];
        mLoader.show("loadPersonal");
        requestAjax("game/getGames", dataObj, function (jsonObj) {
            mLoader.unShow("loadPersonal");
            if (jsonObj["code"] == 0) {
                var item_test = new Object();
                item_test["isMute"] = true;
                item_test["isTopping"] = false;
                item_test["nickName"] = "我是你的";
                item_test["name"] = "textun";
                item_test["avatar"] = "header/B_002.jpg";
                jsonObj["result"] = item_test;
                bindContent(jsonObj["result"]);
            } else {
                LoadError(mLangObj.getZHByCode(jsonObj["tipMessage"]));
            }
        }, function (error) {
            mLoader.unShow("loadPersonal");
            LoadError(error);
        });
        function LoadError(error) {
            if (error == null) {
                mToast.show("个人信息获取失败,请重试!", 1, "middle");
            } else {
                mToast.show("个人信息获取失败,请重试! <br>" + error, 2, "middle");
            }
        }
    }
    function bindContent(result) {
        var avatar = result["avatar"];
        $("#" + cId + "_avatar_img").attr("src", avatar);
        var nickName = result["nickName"];
        $("#" + cId + "_nickName").html(nickName);
        var isMute = result["isMute"];
        if (isMute == null) isMute = false;
        setSwichMute(isMute);
        var isTopping = result["isTopping"];
        if (isTopping == null) isTopping = false;
        setSwichTopping(isTopping);
    }
    function bindFrame() {
        var arrow_img = "<img src=\"" + themPath + "arrow.png\" style=\"width:8px\"/>";
        var lineMinY = "<div style=\"width:100%;height:1px;background:#3B3B3B\"></div>";
        var lineMaxY = "<div style=\"width:100%;height:10px;background:#3B3B3B\"></div>";
        var root = "<div id=\"" + cId + "_root\" >[content]</div>";
        var head = "<div id=\"" + cId + "_head\">[content]</div>";
        var avatar = "<div id=\"" + cId + "_avatar_rot\">[content]</div>";
        var avatar_img = "<img id=\"" + cId + "_avatar_img\"/>";
        var avatar_txt = "<div id=\"" + cId + "_nickName\">昵称</div>";
        avatar = avatar.replace("[content]", avatar_img + avatar_txt);
        head = head.replace("[content]", avatar);
        var mute_rot = "<div class=\"" + cId + "_item_rot\">[content]</div>";
        var mute_left = "<div class=\"" + cId + "_item_txt\">消息免打扰</div>";
        var mute_right = "<div id=\"" + cId + "_mute_right\" class=\"" + cId + "_swich_rot\">[content]</div>";
        var mute_right_open = "<div id=\"" + cId + "_mute_right_open\" class=\"" + cId + "_swich_open\"></div>";
        var mute_right_close = "<div id=\"" + cId + "_mute_right_close\" class=\"" + cId + "_swich_close\"></div>";
        mute_right = mute_right.replace("[content]", mute_right_close + mute_right_open);
        mute_rot = mute_rot.replace("[content]", mute_left + mute_right);
        var topping_rot = "<div class=\"" + cId + "_item_rot\">[content]</div>";
        var topping_left = "<div class=\"" + cId + "_item_txt\">置顶聊天</div>";
        var topping_right = "<div id=\"" + cId + "_topping_right\" class=\"" + cId + "_swich_rot\">[content]</div>";
        var topping_right_open = "<div id=\"" + cId + "_topping_right_open\" class=\"" + cId + "_swich_open\"></div>";
        var topping_right_close = "<div id=\"" + cId + "_topping_right_close\" class=\"" + cId + "_swich_close\"></div>";
        topping_right = topping_right.replace("[content]", topping_right_close + topping_right_open);
        topping_rot = topping_rot.replace("[content]", topping_left + topping_right);
        var clear = "<div id=\"" + cId + "_clear_rot\" class=\"" + cId + "_item_rot\">[content]</div>";
        var clear_txt = "<div class=\"" + cId + "_item_txt\">清空聊天记录</div>";
        var clear_img = "<div id=\"" + cId + "_clear_img\">" + arrow_img + "</div>";
        clear = clear.replace("[content]", clear_txt + clear_img);
        root = root.replace("[content]", head + lineMaxY + mute_rot + lineMinY + topping_rot + lineMaxY + clear + lineMaxY);
        $("#" + cId).html(root);
        setFrameStyle();
    }
    function setFrameStyle() {
        $("#" + cId).css({
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
        $("#" + cId + "_root").css({
            "width": "100%",
            "height": "auto"
        });
        var headH = screenH / 5;
        $("#" + cId + "_head").css({
            "width": "100%",
            "height": headH,
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "padding": "0px 18px 0px 18px",
            "box-sizing": "border-box",
            "overflow": "hidden"
        });
        $("#" + cId + "_avatar_rot").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_avatar_img").css({
            "width": headH / 2.1,
            "height": headH / 2.1,
            "border-radius": "50%"
        });
        $("#" + cId + "_nickName").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": "14px",
            "color": "#9D9D9D",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "margin-top": "5px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_rot").css({
            "width": screenW,
            "height": "60px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "padding": "20px 18px 20px 18px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_txt").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": "16px",
            "color": "#F5F5F5",
            "box-sizing": "border-box"
        });
        $("." + cId + "_swich_rot").css({
            "width": "50px",
            "height": "25px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "background": "#666666",
            "border-radius": "25px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_swich_open").css({
            "background": "#CCCCCC",
            "border-radius": "50%",
            "width": "25px",
            "height": "25px",
            "visibility": "hidden",
            "box-sizing": "border-box"
        });
        $("." + cId + "_swich_close").css({
            "background": "#CCCCCC",
            "border-radius": "50%",
            "width": "25px",
            "height": "25px",
            "display": "block",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_clear_img").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        setBtnOnTouchEvent($("#" + cId + "_clear_rot"), function (mObj) {
            clearRecordHandel();
        }, "#141414", "", null);
        $("#" + cId + "_mute_right").click(function () {
            var dis = $("#" + cId + "_mute_right_open").css("visibility");
            if (dis == "hidden") {
                $("#" + cId + "_mute_right").css({ "background": "#CCA352" });
                $("#" + cId + "_mute_right_open").css({ "visibility": "visible" });
                $("#" + cId + "_mute_right_close").css({ "visibility": "hidden", });
                swichMuteHandel(true);
            } else {
                $("#" + cId + "_mute_right").css({ "background": "#666666" });
                $("#" + cId + "_mute_right_open").css({ "visibility": "hidden", });
                $("#" + cId + "_mute_right_close").css({ "visibility": "visible", });
                swichMuteHandel(false);
            }
        });
        $("#" + cId + "_topping_right").click(function () {
            var dis = $("#" + cId + "_topping_right_open").css("visibility");
            if (dis == "hidden") {
                $("#" + cId + "_topping_right").css({ "background": "#CCA352" });
                $("#" + cId + "_topping_right_open").css({ "visibility": "visible" });
                $("#" + cId + "_topping_right_close").css({ "visibility": "hidden" });
                swichToppingHandel(true);
            } else {
                $("#" + cId + "_topping_right").css({ "background": "#666666" });
                $("#" + cId + "_topping_right_open").css({ "visibility": "hidden" });
                $("#" + cId + "_topping_right_close").css({ "visibility": "visible" });
                swichToppingHandel(false);
            }
        });
        $("#" + cId + "_avatar_img").click(function () {
            goToPersonalOpt();
        });
    }
    function swichMuteHandel(mode) {
        console.log("swichMute mode:" + mode);
    }
    function setSwichMute(mode) {
        if (mode) {
            $("#" + cId + "_mute_right").css({ "background": "#CCA352" });
            $("#" + cId + "_mute_right_open").css({ "visibility": "visible" });
            $("#" + cId + "_mute_right_close").css({ "visibility": "hidden", });
        } else {
            $("#" + cId + "_mute_right").css({ "background": "#666666" });
            $("#" + cId + "_mute_right_open").css({ "visibility": "hidden", });
            $("#" + cId + "_mute_right_close").css({ "visibility": "visible", });
        }
    }
    function swichToppingHandel(mode) {
        console.log("swichTopping mode:" + mode);
    }
    function setSwichTopping(mode) {
        if (mode) {
            $("#" + cId + "_topping_right").css({ "background": "#CCA352" });
            $("#" + cId + "_topping_right_open").css({ "visibility": "visible" });
            $("#" + cId + "_topping_right_close").css({ "visibility": "hidden" });
        } else {
            $("#" + cId + "_topping_right").css({ "background": "#666666" });
            $("#" + cId + "_topping_right_open").css({ "visibility": "hidden" });
            $("#" + cId + "_topping_right_close").css({ "visibility": "visible" });
        }
    }
    function clearRecordHandel() {
        mMsgBox.show("提示", "确定清除聊天记录吗？", function () {
        }, null);
        console.log("clearRecord");
    }
    function goToPersonalOpt() {
        chatPersonalOpt.show(item);
    }
}
function ChatPersonalOpt() {
    var rootId = "chatPersonalOptDiv";
    var cId = rootId + "_content";
    var mPage = new PAGE(rootId, "个人信息");
    var isBack = false;
    var item = null;
    this.init = function () {
        mPage.init(function () { // back
            isBack = true;
            console.log("back click");
        });
        mPage.onResume(function () {
            console.log("chatPersonalOpt onResume");
        });
        mPage.onPause(function () {
            console.log("chatPersonalOpt onPause");
        });
        mPage.hiddenSetting();
        bindFrame();
    }
    this.show = function (im) {
        mPage.show();
        isBack = false;
        item = im;
        LoadPersonalOpt();
    }
    function LoadPersonalOpt() {
        var dataObj = new Object();
        dataObj["name"] = item["name"];
        mLoader.show("loadPersonalOpt");
        requestAjax("game/getGames", dataObj, function (jsonObj) {
            mLoader.unShow("loadPersonalOpt");
            if (jsonObj["code"] == 0) {
                var item_test = new Object();
                item_test["live"] = "钻石会员";
                item_test["nickName"] = "我是你的";
                item_test["name"] = "textun";
                item_test["avatar"] = "header/B_002.jpg";
                jsonObj["result"] = item_test;
                bindContent(jsonObj["result"]);
            } else {
                LoadError(mLangObj.getZHByCode(jsonObj["tipMessage"]));
            }
        }, function (error) {
            mLoader.unShow("loadPersonalOpt");
            LoadError(error);
        });
        function LoadError(error) {
            if (error == null) {
                mToast.show("个人信息获取失败,请重试!", 1, "middle");
            } else {
                mToast.show("个人信息获取失败,请重试! <br>" + error, 2, "middle");
            }
        }
    }
    function bindContent(result) {
        var avatar = result["avatar"];
        $("#" + cId + "_avatar").attr("src", avatar);
        var nickName = result["nickName"];
        $("#" + cId + "_nickName").html(nickName);
        var live = result["live"];
        $("#" + cId + "_userLive").html("会员等级: " + live);
    }
    function bindFrame() {
        var session_img = "<img src=\"" + themPath + "session.png\" style=\"width:20px\"/>";
        var arrow_img = "<img src=\"" + themPath + "arrow.png\" style=\"width:8px\"/>";
        var lineMinY = "<div style=\"width:100%;height:1px;background:#3B3B3B\"></div>";
        var lineMaxY = "<div style=\"width:100%;height:10px;background:#3B3B3B\"></div>";
        var lineNoneMinX = "<div style=\"width:5px\"></div>";
        var lineNoneMaxX = "<div style=\"width:20px\"></div>";
        var lineNoneMinY = "<div style=\"height:5px\"></div>";
        var root = "<div id=\"" + cId + "_root\" >[content]</div>";
        var head = "<div id=\"" + cId + "_head\">[content]</div>";
        var avatar = "<img id=\"" + cId + "_avatar\"/>";
        var user_rot = "<div id=\"" + cId + "_userRot\">[content]</div>";
        var user_name = "<div id=\"" + cId + "_nickName\">昵称</div>";
        var user_live = "<div id=\"" + cId + "_userLive\">会员等级</div>";
        user_rot = user_rot.replace("[content]", user_name + lineNoneMinY + user_live);
        head = head.replace("[content]", avatar + lineNoneMaxX + user_rot);
        var remake = "<div id=\"" + cId + "_remake_rot\" class=\"" + cId + "_item_rot\">[content]</div>";
        var remake_txt = "<div class=\"" + cId + "_item_txt\">设置备注</div>";
        var remake_img = "<div id=\"" + cId + "_remake_img\">" + arrow_img + "</div>";
        remake = remake.replace("[content]", remake_txt + remake_img);
        var sendMsg = "<div id=\"" + cId + "_create_session\">" + session_img + lineNoneMinX + "发送信息</div>";
        root = root.replace("[content]", head + lineMinY + remake + lineMaxY + sendMsg + lineMaxY);
        $("#" + cId).html(root);
        setFrameStyle();
    }
    function setFrameStyle() {
        $("#" + cId).css({
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
        $("#" + cId + "_root").css({
            "width": "100%",
            "height": "auto"
        });
        var headH = screenH / 5;
        $("#" + cId + "_head").css({
            "width": "100%",
            "height": headH,
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "padding": "0px 18px 0px 18px",
            "box-sizing": "border-box",
            "overflow": "hidden"
        });
        $("#" + cId + "_avatar").css({
            "width": headH / 2.1,
            "height": headH / 2.1,
            "border-radius": "50%"
        });
        $("#" + cId + "_userRot").css({
            "width": "auto",
            "height": "auto",
            "display": "block",
            "text-align": "left",
            "overflow": "hidden",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_nickName").css({
            "width": "auto",
            "height": "auto",
            "text-align": "left",
            "font-size": "18px",
            "color": "#F5F5F5",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_userLive").css({
            "width": "auto",
            "height": "auto",
            "text-align": "left",
            "font-size": "12px",
            "color": "#9D9D9D",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_rot").css({
            "width": screenW,
            "height": "60px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "padding": "20px 18px 20px 18px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_txt").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": "16px",
            "color": "#F5F5F5",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_remake_img").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_create_session").css({
            "width": screenW,
            "height": "60px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "20px 18px 20px 18px",
            "font-size": "16px",
            "color": "#6E87B2",
            "box-sizing": "border-box"
        });
        setBtnOnTouchEvent($("#" + cId + "_remake_rot"), function (mObj) {
            RemakeHandel();
        }, "#141414", "", null);
        setBtnOnTouchEvent($("#" + cId + "_create_session"), function (mObj) {
            createSessionHandel();
        }, "#141414", "", null);
    }
    function RemakeHandel() {
        chatRemakeEdit.show(item);
        console.log("RemakeHandel");
    }
    function createSessionHandel() {
        var len = backFunArr.length - 1;
        console.log("backFunListLen:" + len);
        for (var i = 0; i < len; i++) { backClickFun(); }
        item["sessionType"] = 1;
        mChatMessageList.show(item);
        console.log("creatSession");
    }
}
function ChatSendRed() {
    var rootId = "chatSendRedDiv";
    var cId = rootId + "_content";
    var mPage = new PAGE(rootId, "发送红包");
    var isBack = false;
    var item = null;
    var messageHandel = null;
    var redType = "random"; // personal 为个人红包 random 为拼手气红包 common 为普通红包
    var unit = "¥";
    var redMone = 0; // 红包总金额
    var redNum = 0; // 红包数量
    this.init = function () {
        mPage.init(function () { // back
            isBack = true;
            redMone = 0;
            redNum = 0;
            $("#" + cId + "_funds_input").val("");
            $("#" + cId + "_num_input").val("");
            $("#" + cId + "_mone").html(unit + " 0.00");
            console.log("back click");
        });
        mPage.hiddenSetting();
        bindFrame();
    }
    this.show = function (im, mHandel) {
        mPage.show();
        isBack = false;
        item = im;
        messageHandel = mHandel;
        redMone = 0;
        redNum = 0;
        $("#" + cId + "_funds_input").val("");
        $("#" + cId + "_num_input").val("");
        $("#" + cId + "_mone").html(unit + " 0.00");
        var type = item["sessionType"];
        switch (type) {
            case 1: // 个人会话
                $("#" + cId + "_funds_change").css({ "display": "none" });
                $("#" + cId + "_funds_prompt").html("当前为个人红包");
                $("#" + cId + "_num_rot").css({ "display": "none" });
                redType = "personal";
                redNum = 1;
                break;
            case 2: // 群聊会话
                $("#" + cId + "_funds_change").css({ "display": "flex" });
                $("#" + cId + "_funds_change").attr("redType", "random");
                $("#" + cId + "_funds_change").html("改为普通红包");
                $("#" + cId + "_funds_prompt").html("当前为拼手气红包");
                $("#" + cId + "_num_rot").css({ "display": "flex" });
                $("#" + cId + "_num_bot").html("本群共" + item["people_number"] + "人");
                redType = "random";
                break;
            default: backClickFun(); break;
        }
    }
    function bindFrame() {
        var lineMinH = "<div style=\"height:5px\"></div>";
        var item_rot = "<div id=\"[id]\" class=\"" + cId + "_item_rot\">[content]</div>";
        var funds_rot = "<div class=\"" + cId + "_item_con\">[content]</div>";
        var funds_left = "<div class=\"" + cId + "_item_left\">金额</div>";
        var funds_right = "<div class=\"" + cId + "_item_right\">元</div>";
        var funds_input = "<input id=\"" + cId + "_funds_input\" class=\"" + cId + "_item_input\" type=\"tel\" placeholder=\"0.00\"/>";
        var funds_bot = "<div id=\"" + cId + "_funds_bot\">[content]</div>";
        var funds_prompt = "<div id=\"" + cId + "_funds_prompt\">当前为拼手气红包,</div>";
        var funds_change = "<div id=\"" + cId + "_funds_change\" redType=\"random\">改为普通红包</div>";
        funds_rot = funds_rot.replace("[content]", funds_left + funds_input + funds_right);
        funds_bot = funds_bot.replace("[content]", funds_prompt + funds_change);
        var funds = item_rot.replace("[id]", cId + "_funds_rot").replace("[content]", funds_rot + funds_bot);
        var num_rot = "<div class=\"" + cId + "_item_con\">[content]</div>";
        var num_left = "<div class=\"" + cId + "_item_left\">数量</div>";
        var num_right = "<div class=\"" + cId + "_item_right\">个</div>";
        var num_input = "<input id=\"" + cId + "_num_input\" class=\"" + cId + "_item_input\" type=\"number\" placeholder=\"0\"/>";
        var num_bot = "<div id=\"" + cId + "_num_bot\">本群共300人</div>";
        num_rot = num_rot.replace("[content]", num_left + num_input + num_right);
        var num = item_rot.replace("[id]", cId + "_num_rot").replace("[content]", num_rot + num_bot);
        var remak_input = "<input id=\"" + cId + "_remak_input\" type=\"text\" placeholder=\"恭喜发财,大吉大利!\"/>";
        var mone = "<div id=\"" + cId + "_mone\">$ 200</div>";
        var btn = "<div id=\"" + cId + "_btn\">塞钱进红包</div>";
        var botTs = "<div id=\"" + cId + "_botTs\">未领取的红包,将于24小时后发起退款</div>";
        $("#" + cId).html(lineMinH + funds + num + remak_input + mone + btn + botTs);
        setFrameStyle();
    }
    function setFrameStyle() {
        $("#" + cId).css({
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_rot").css({
            "width": "88%",
            "height": "auto",
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "center",
            "margin-top": "20px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_con").css({
            "width": "100%",
            "height": "45px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "border-radius": "5px",
            "background": "white",
            "padding": "0px 10px 0px 10px",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_left").css({
            "width": "auto",
            "height": "auto",
            "font-size": "14px",
            "color": "#191919",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_right").css({
            "width": "auto",
            "height": "auto",
            "font-size": "14px",
            "color": "#191919",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("." + cId + "_item_input").css({
            "width": "80%",
            "height": "35px",
            "text-align": "right",
            "font-size": "14px",
            "color": "#191919",
            "outline": "medium",
            "border": "none",
            "padding": "0px 4px 0px 4px",
            "background": "transparent",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_funds_bot").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "margin-top": "2px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_funds_prompt").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "font-size": "12px",
            "color": "#7B7B7B",
            "padding": "2px",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_funds_change").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "font-size": "12px",
            "color": mainColor,
            "padding": "2px",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_num_bot").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "font-size": "12px",
            "color": "#7B7B7B",
            "margin-top": "2px",
            "padding": "2px",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_remak_input").css({
            "width": "88%",
            "height": "50px",
            "background": "white",
            "outline": "none",
            "border": "0px",
            "border-radius": "5px",
            "margin-top": "20px",
            "padding": "10px",
            "font-size": "16px",
            "color": "#191919",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_mone").css({
            "width": "auto",
            "height": "50px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-weight": "bold",
            "font-size": "42px",
            "color": mainColor,
            "margin-top": "50px",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_btn").css({
            "width": "55%",
            "height": "45px",
            "border-radius": "5px",
            "color": "white",
            "font-size": "14px",
            "background": "#FF5A46",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "margin-top": "20px",
            "padding": "0px 10px 0px 10px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_botTs").css({
            "width": "100%",
            "height": "auto",
            "color": "#7B7B7B",
            "font-size": "14px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "margin-top": "50px",
            "box-sizing": "border-box"
        });
        setBtnOnTouchEvent($("#" + cId + "_btn"), function () {
            pushFunds();
        }, "#7F2D23", "#FF5A46", null);
        setBtnOnTouchEvent($("#" + cId + "_funds_change"), function () {
            redTypeChange();
        }, mainColorDeep, "", null);
        $("#" + cId + "_funds_input").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#" + cId + "_funds_input");
            obj["maxLen"] = 6;
            obj["FloatLimit"] = 2;
            obj["showIs"] = true;
            obj["isFunds"] = true;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        $("#" + cId + "_num_input").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#" + cId + "_num_input");
            obj["maxLen"] = 4;
            obj["showIs"] = true;
            obj["danIs"] = false;
            obj["isFunds"] = true;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        // 金额监听
        $("#" + cId + "_funds_input").on("change", function () {
            var mone = $("#" + cId + "_funds_input").val();
            if (mone == "" || Number(mone) == 0) {
                redMone = 0;
                $("#" + cId + "_mone").html(unit + " 0.00");
                return;
            }
            mone = mone.toString();
            var last = mone.substr(mone.length - 1, 1);
            if (last == ".") {
                mone = mone.substr(0, mone.length - 1);
            }
            mone = Number(mone);
            if (redType == "random" || redType == "personal") {
                redMone = mone;
                $("#" + cId + "_mone").html(unit + " " + redMone);
            } else {
                if (redNum == 0) {
                    redMone = 0;
                    $("#" + cId + "_mone").html(unit + " 0.00");
                    return;
                }
                redMone = mone * redNum;
                $("#" + cId + "_mone").html(unit + " " + redMone);
            }
            console.log("input funds change: " + mone);
        });
        // 数量监听
        $("#" + cId + "_num_input").on("change", function () {
            if (redType == "personal") return; // 个人红包不处理数量
            var num = $("#" + cId + "_num_input").val();
            if (redType == "common" && (num == "" || Number(num) == 0)) {
                redMone = 0;
                redNum = 0;
                $("#" + cId + "_mone").html(unit + " 0.00");
                return;
            }
            redNum = Number(num);
            if (redType == "random") return; // 拼手气红包不处理总金额
            var mone = $("#" + cId + "_funds_input").val();
            if (mone == "" || Number(mone) == 0) {
                redMone = 0;
                $("#" + cId + "_mone").html(unit + " 0.00");
                return;
            }
            mone = mone.toString();
            var last = mone.substr(mone.length - 1, 1);
            if (last == ".") {
                mone = mone.substr(0, mone.length - 1);
            }
            mone = Number(mone);
            redMone = mone * redNum;
            $("#" + cId + "_mone").html(unit + " " + redMone);
            console.log("input num change: " + num);
        });
    }
    function pushFunds() {
        var remake = $("#" + cId + "_remak_input").html();
        if (remake == null || remake.trim() == "") remake = "恭喜发财,大吉大利!";
        console.log("redType:" + redType + " redMone:" + redMone + " redNum:" + redNum + " remake:" + remake);
        switch (redType) {
            case "personal":
                if (redMone <= 0) {
                    mToast.show("红包金额不能为零!", 1, null);
                    return;
                }
                var obj = new Object();
                obj["redMone"] = redMone;
                obj["redNum"] = 1;
                obj["redType"] = 0;
                obj["remake"] = remake;
                if (messageHandel != null) {
                    messageHandel(obj);
                }
                backClickFun();
                return;
            case "random":
                if (redMone <= 0 || redNum <= 0) {
                    mToast.show("红包金额与红包数量不能为零!", 1, null);
                    return;
                }
                var obj = new Object();
                obj["redMone"] = redMone;
                obj["redNum"] = redNum;
                obj["redType"] = 1;
                obj["remake"] = remake;
                if (messageHandel != null) {
                    messageHandel(obj);
                }
                backClickFun();
                return;
            case "common":
                if (redMone <= 0 || redNum <= 0) {
                    mToast.show("红包金额与红包数量不能为零!", 1, null);
                    return;
                }
                var obj = new Object();
                obj["redMone"] = redMone;
                obj["redNum"] = redNum;
                obj["redType"] = 2;
                obj["remake"] = remake;
                if (messageHandel != null) {
                    messageHandel(obj);
                }
                backClickFun();
                return;
        }
    }
    function redTypeChange() {
        var currentType = $("#" + cId + "_funds_change").attr("redType");
        if (currentType == "random") {
            $("#" + cId + "_funds_change").attr("redType", "common");
            redType = $("#" + cId + "_funds_change").attr("redType");
            $("#" + cId + "_funds_change").html("改为拼手气红包");
            $("#" + cId + "_funds_prompt").html("当前为普通红包");
            if (redNum > 0) {
                var singleMone = FloatToFixed(redMone / redNum);
                $("#" + cId + "_funds_input").val(singleMone);
                $("#" + cId + "_funds_input").change();
            } else {
                redMone = 0;
                redNum = 0;
                $("#" + cId + "_num_input").val("");
                $("#" + cId + "_num_input").change();
            }
        } else {
            $("#" + cId + "_funds_change").attr("redType", "random");
            redType = $("#" + cId + "_funds_change").attr("redType");
            $("#" + cId + "_funds_change").html("改为普通红包");
            $("#" + cId + "_funds_prompt").html("当前为拼手气红包");
            if (redMone == 0) {
                $("#" + cId + "_funds_input").val("");
            } else {
                $("#" + cId + "_funds_input").val(redMone);
            }
            $("#" + cId + "_funds_input").change();
        }
        console.log("current red type:" + redType);
    }
    function FloatToFixed(val) {
        if (val == null || isNaN(val)) { return parseFloat(0); }
        return parseFloat(parseFloat(val).toFixed(2));
    }
}
function ChatDownRed() {
    var rootId = "chatDownRedDiv";
    var cId = rootId + "_content";
    var item = null;
    this.init = function () {
        var rot = "<div id=\"" + cId + "_rot\">[content]</div>";
        var con_rot = "<div id=\"" + cId + "_con_rot\">[content]</div>";
        var con_back = "<div id=\"" + cId + "_con_back\"><div id=\"" + cId + "_con_curve\"></div></div>";
        var con_opt = "<div id=\"" + cId + "_con_opt\">[content]</div>";
        var avatar = "<div id=\"" + cId + "_avatar_rot\">[content]</div>";
        var avatar_img = "<img id=\"" + cId + "_avatar_img\" src=\"header/B_001.jpg\"/>";
        var avatar_name = "<div id=\"" + cId + "_avatar_name\">备注名称的红包</div>";
        avatar = avatar.replace("[content]", avatar_img + avatar_name);
        var text = "<div id=\"" + cId + "_text\">恭喜发财,大吉大利!</div>";
        var dowm = "<div id=\"" + cId + "_down\">開</div>";
        con_opt = con_opt.replace("[content]", avatar + text + dowm);
        con_rot = con_rot.replace("[content]", con_back + con_opt);
        var close = "<img id=\"" + cId + "_close\" src=\"" + themPath + "xclose.png\"/>";
        rot = rot.replace("[content]", con_rot + close);
        $("#" + cId).html(rot);
        $("#" + cId).css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        var RW = screenW * 0.8;
        var RH = screenH * 0.7;
        $("#" + cId + "_rot").css({
            "width": RW,
            "height": "auto",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "flex-direction": "column",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_con_rot").css({
            "position": "relative",
            "width": RW,
            "height": RH,
            "box-sizing": "border-box"
        });
        $("#" + cId + "_con_back").css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "width": RW,
            "height": RH,
            "background": "#F05A46",
            "border-radius": "10px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_con_curve").css({
            "width": RW,
            "height": RH * 0.8,
            "background": "#E26855",
            "border": "solid 1px #B44E3D",
            "border-color": "transparent transparent #B44E3D transparent",
            "border-top-left-radius": "10px",
            "border-top-right-radius": "10px",
            "border-bottom-right-radius": (RW / 2) + "px 50px",
            "border-bottom-left-radius": (RW / 2) + "px 50px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_con_opt").css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "width": RW,
            "height": RH,
            "text-align": "center",
            "border-radius": "10px",
            "padding": "15px",
            "box-sizing": "border-box"
        });
        var conMarginTop = RH / 6;
        $("#" + cId + "_avatar_rot").css({
            "width": "100%",
            "height": "55px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "margin-top": conMarginTop + "px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_avatar_img").css({
            "width": "55px",
            "height": "55px",
            "border-radius": "50%",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_avatar_name").css({
            "width": "auto",
            "height": "auto",
            "margin-left": "10px",
            "font-size": "14px",
            "color": "#E6CE9F",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_text").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": "20px",
            "color": "#E6CE9F",
            "margin-top": "10px",
            "box-sizing": "border-box"
        });
        var downW = RW / 3.3;
        $("#" + cId + "_down").css({
            "position": "absolute",
            "top": ((RH * 0.8) - (downW / 2)) + "px",
            "left": (RW / 2) - (downW / 2) + "px",
            "width": downW,
            "height": downW,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "background": "#E6CE9F",
            "font-size": "40px",
            "color": "#3B3B3B",
            "border-radius": "50%",
            "box-shadow": "0px 0px 1px 1px #A94C3B",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_close").css({
            "width": "35px",
            "height": "35px",
            "margin-top": "20px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_close").click(function () {
            closeWindow();
        });
        // 透明区域点击事件
        $("#" + rootId + "_con_rot").click(function () {
            closeWindow();
        });
        setBtnOnTouchEvent($("#" + cId + "_down"), function (mObj) {
            downRed();
        }, "#73674F", "#E6CE9F", null);
    }
    this.show = function (im) {
        item = im;
        $("#" + rootId).css({
            "display": "flex",
            "z-index": currentZIndex + 1
        });
    }
    this.closeWindow = closeWindow;
    function downRed() {
        closeWindow();
        chatOpenRed.show(item);
        console.log("downRed");
    }
    function closeWindow() {
        $("#" + rootId).css({ "display": "none" });
    }
}
function ChatOpenRed() {
    var rootId = "chatOpenRedDiv";
    var cId = rootId + "_content";
    var mPage = new PAGE(rootId, "红包详情");
    var isBack = false;
    var item = null;
    this.init = function () {
        mPage.init(function () { // back
            isBack = true;
            console.log("back click");
        });
        mPage.hiddenSetting();
        bindFrame();
    }
    this.show = function (im) {
        mPage.show();
        isBack = false;
        item = im;
        LoadContent();
    }
    function bindFrame() {
        var line = "<div style=\"width:100%;height:1px;background:#3C3C3C\"></div>";
        var curve = "<div id=\"" + cId + "_curve\">[content]</div>";
        var curve_con = "<div id=\"" + cId + "_curve_con\">[content]</div>";
        var avatar = "<div id=\"" + cId + "_avatar_rot\">[content]</div>";
        var avatar_img = "<img id=\"" + cId + "_avatar_img\" src=\"header/B_001.jpg\"/>";
        var avatar_name = "<div id=\"" + cId + "_avatar_name\">备注名称的红包</div>";
        avatar = avatar.replace("[content]", avatar_img + avatar_name);
        var text = "<div id=\"" + cId + "_text\">恭喜发财,大吉大利!</div>";
        var money = "<div id=\"" + cId + "_money\">$2.02</div>";
        var ts = "<div id=\"" + cId + "_money_ts\">已存入主钱包</div>";
        curve_con = curve_con.replace("[content]", avatar + text + money + ts);
        curve = curve.replace("[content]", curve_con);
        var list_top = "<div id=\"" + cId + "_list_top\">已领取 1/3 个,共 2.02元/10.01元</div>";
        var list_rot = "<div id=\"" + cId + "_list_rot\">[content]</div>";
        var list = "<div id=\"" + cId + "_list\"></div>";
        list_rot = list_rot.replace("[content]", list);
        $("#" + cId).html(curve + list_top + line + list_rot);
        $("#" + rootId + "_top").css({
            "background": "#F05A46"
        });
        $("#" + rootId + "_top_title").css({
            "color": "white"
        });
        $("#" + cId).css({
            "width": screenW,
            "height": screenH - topH,
            "box-sizing": "border-box"
        });
        var curveH = screenH * 0.4;
        $("#" + cId + "_curve").css({
            "width": screenW,
            "height": curveH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "background": "#F05A46",
            "border-top-left-radius": "0px",
            "border-top-right-radius": "0px",
            "border-bottom-right-radius": (screenW / 2) + "px 70px",
            "border-bottom-left-radius": (screenW / 2) + "px 70px",
            "padding": "0px 15px 0px 15px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_curve_con").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "flex-direction": "column",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_avatar_rot").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_avatar_img").css({
            "width": "55px",
            "height": "55px",
            "border-radius": "50%",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_avatar_name").css({
            "width": "auto",
            "height": "auto",
            "margin-left": "10px",
            "font-size": "16px",
            "font-weight": "bold",
            "color": "#E6CE9F",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_text").css({
            "width": "auto",
            "height": "auto",
            "margin-top": "15px",
            "font-size": "14px",
            "color": "#E6CE9F",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_money").css({
            "width": "auto",
            "height": "auto",
            "margin-top": "30px",
            "font-size": "50px",
            "color": "#E6CE9F",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_money_ts").css({
            "width": "auto",
            "height": "auto",
            "margin-top": "5px",
            "font-size": "14px",
            "color": "#E6CE9F",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_list_top").css({
            "width": "100%",
            "height": "50px",
            "margin-top": "20px",
            "font-size": "16px",
            "color": "#747474",
            "padding": "0px 15px 0px 15px",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_list_rot").css({
            "width": "100%",
            "height": screenH - topH - curveH - 20 - 50,
            "text-align": "center",
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_list").css({
            "width": "100%",
            "height": "auto",
            "text-align": "center",
            "box-sizing": "border-box"
        });
    }
    function LoadContent() {
        var dataObj = new Object();
        dataObj["name"] = item["name"];
        mLoader.show("LoadRedInfo");
        requestAjax("game/getGames", dataObj, function (jsonObj) {
            mLoader.unShow("LoadRedInfo");
            if (jsonObj["code"] == 0) {
                var item_test = new Object();
                item_test["fromName"] = "testun";
                item_test["nickName"] = "我是你的";
                item_test["money"] = 2.02;
                item_test["red_Remake"] = "恭喜发财大吉大利!";
                item_test["remake"] = "已存入主钱包";
                item_test["red_num"] = 10;
                item_test["received_num"] = 5;
                item_test["red_money"] = 10;
                item_test["received_money"] = 5;
                item_test["unit"] = "¥";
                item_test["avatar"] = "header/B_002.jpg";
                item_test["nice_user"] = "testun_1";
                item_test["received_list"] = new Array();
                for (var i = 0; i < 30; i++) {
                    var obj = new Object();
                    obj["name"] = "testun_" + i;
                    obj["nickName"] = "我是你的" + i;
                    obj["receivedTime"] = new Date().getTime();
                    obj["avatar"] = "header/B_002.jpg";
                    obj["money"] = 2.21;
                    item_test["received_list"].push(obj);
                }
                jsonObj["result"] = item_test;
                bindContent(jsonObj["result"]);
            } else {
                LoadError(mLangObj.getZHByCode(jsonObj["tipMessage"]));
            }
        }, function (error) {
            mLoader.unShow("LoadRedInfo");
            LoadError(error);
        });
        function LoadError(error) {
            if (error == null) {
                mToast.show("个人信息获取失败,请重试!", 1, "middle");
            } else {
                mToast.show("个人信息获取失败,请重试! <br>" + error, 2, "middle");
            }
        }
    }
    function bindContent(result) {
        var fromName = result["fromName"];
        var nickName = result["nickName"];
        var money = result["money"];
        var redRemake = result["red_Remake"];
        var remake = result["remake"];
        var redNum = result["red_num"];
        var receivedNum = result["received_num"];
        var redMoney = result["red_money"];
        var receivedMoney = result["received_money"];
        var unit = result["unit"];
        var avatarSrc = result["avatar"];
        var niceUser = result["nice_user"];
        var receivedList = result["received_list"];
        var rLen = receivedList["length"];

        $("#" + cId + "_avatar_img").attr("src", avatarSrc);
        $("#" + cId + "_avatar_name").html(nickName + "的红包");
        $("#" + cId + "_text").html(redRemake);
        $("#" + cId + "_money").html(unit + " " + money);
        $("#" + cId + "_money_ts").html(remake);
        $("#" + cId + "_list_top").html("已领取 " + receivedNum + "/" + redNum + " 个,共 " + receivedMoney + "元/" + redMoney + "元");

        var itemLayout = "<div class=\"" + cId + "_item_layout\" id=\"[id]\">[content]</div>";
        var line = "<div class=\"" + cId + "_line_root\"><div class=\"" + cId + "_line\"></div></div>";
        var lineNotMin_H = "<div style=\"height:3px\"></div>";
        var lineNotMax_H = "<div style=\"height:10px\"></div>";
        var lineNotMin_W = "<div style=\"width:15px\"></div>";
        var lineNotMax_W = "<div style=\"width:18px\"></div>";
        var avatar = "<img class=\"" + cId + "_avatarImg\" src=\"[src]\"/>";
        var txtRoot = "<div class=\"" + cId + "_txt\">[content]</div>";
        var lineName = "<div class=\"" + cId + "_lineName\">[content]</div>";
        var name = "<div class=\"" + cId + "_name\">[name]</div>";
        var mone = "<div class=\"" + cId + "_mone\">[mone]</div>";
        lineName = lineName.replace("[content]", name + mone);
        var lineTime = "<div class=\"" + cId + "_lineTime\">[content]</div>";
        var time = "<div class=\"" + cId + "_time\">[time]</div>";
        var nice = "<div class=\"" + cId + "_nice\"><img src=\"" + themPath + "nice.png\" style=\"width:18px\"/>手气最佳</div>";
        var divs = "";
        for (var i = 0; i < rLen; i++) {
            var itemObj = receivedList[i];
            var iname = itemObj["name"];
            var inickName = itemObj["nickName"];
            var imone = itemObj["money"];
            var iavatarSrc = itemObj["avatar"];
            var ireceivedTime = itemObj["receivedTime"];

            var _nameLine = lineName.replace("[name]", inickName).replace("[mone]", imone + "元");
            var _timeLine = "";
            var _time = time.replace("[time]", formatTime(ireceivedTime));
            if (iname == niceUser) {
                _timeLine = lineTime.replace("[content]", _time + nice);
            } else {
                _timeLine = lineTime.replace("[content]", _time);
            }
            var _rot = txtRoot.replace("[content]", _nameLine + lineNotMin_H + _timeLine);
            var _ava = avatar.replace("[src]", iavatarSrc);

            var itemId = cId + "_item_" + i;
            var content = lineNotMax_W + _ava + lineNotMax_W + _rot + lineNotMin_W;
            divs += itemLayout.replace("[id]", itemId).replace("[content]", content) + line;
        }
        $("#" + cId + "_list").html(divs);
        setItemStyle();
        function setItemStyle() {
            $("." + cId + "_item_layout").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": "auto",
                "padding": "12px 0px 12px 0px",
                "box-sizing": "border-box"
            });
            $("." + cId + "_avatarImg").css({
                "width": "50px",
                "height": "50px",
                "border-radius": "50%",
                "box-sizing": "border-box"
            });
            var txtW = screenW - 18 - 50 - 18 - 15;
            $("." + cId + "_txt").css({
                "text-align": "center",
                "width": txtW,
                "box-sizing": "border-box"
            });
            $("." + cId + "_lineName").css({
                "display": "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "width": "100%",
                "box-sizing": "border-box"
            });
            $("." + cId + "_name").css({
                "width": "80%",
                "text-align": "left",
                "font-size": "16px",
                "color": "#F5F5F5",
                "white-space": "nowrap",
                "text-overflow": "ellipsis",
                "text-overflow": "ellipsis",
                "overflow": "hidden"
            });
            $("." + cId + "_mone").css({
                "text-align": "right",
                "font-size": "16px",
                "color": "#F5F5F5",
                "white-space": "nowrap",
                "text-overflow": "ellipsis",
                "text-overflow": "ellipsis",
                "overflow": "hidden"
            });
            $("." + cId + "_lineTime").css({
                "display": "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "width": "100%",
                "box-sizing": "border-box"
            });
            $("." + cId + "_time").css({
                "width": "60%",
                "text-align": "left",
                "font-size": "14px",
                "color": "#A1A1A1",
                "white-space": "nowrap",
                "text-overflow": "ellipsis",
                "text-overflow": "ellipsis",
                "overflow": "hidden"
            });
            $("." + cId + "_nice").css({
                "width": "auto",
                "text-align": "right",
                "font-size": "14px",
                "color": "#D29C52",
                "white-space": "nowrap",
                "text-overflow": "ellipsis",
                "text-overflow": "ellipsis",
                "overflow": "hidden"
            });
            $("." + cId + "_line_root").css({
                "display": "flex",
                "justify-content": "flex-end",
                "align-items": "center",
                "width": "100%",
                "height": "1px"
            });
            $("." + cId + "_line").css({
                "width": screenW - 18 - 50 - 18,
                "height": "1px",
                "background": "#3D3D3D"
            });
        }
    }
    function formatTime(time) {
        var nowDate = getTimeZoneE8(timeZone, new Date());
        var nowYear = nowDate.getFullYear();
        var nowMonte = nowDate.getMonth() + 1;
        var nowDay = nowDate.getDate();
        var sendDate = getTimeZoneE8(timeZone, time);
        var year = sendDate.getFullYear();
        var monte = sendDate.getMonth() + 1;
        var day = sendDate.getDate();
        if (nowYear == year) {
            if (nowMonte == monte && nowDay == day) {
                return sendDate.format("hh:mm");
            } else {
                return sendDate.format("MM-dd hh:mm");
            }
        } else {
            return sendDate.format("yyyy-MM-dd hh:mm");
        }
    }
}
function ChatRedRecord() {
    var rootId = "chatRedRecordDiv";
    var cId = rootId + "_content";
    var mPage = new PAGE(rootId, "红包记录");
    var isBack = false;
    var item = null;
    this.init = function () {
        mPage.init(function () { // back
            isBack = true;
            console.log("back click");
        });
        mPage.hiddenSetting();
        bindFrame();
    }
    this.show = function (im) {
        mPage.show();
        isBack = false;
        item = im;
    }
    function bindFrame() {
    }
}
function ChatEditRemake() {
    var rootId = "chatEditRemarkDiv";
    var cId = rootId + "_content";
    var mPage = new PAGE(rootId, "修改备注");
    var isBack = false;
    var item = null;
    this.init = function () {
        mPage.init(function () {
            isBack = true;
            document.activeElement.blur();
        });
        mPage.hiddenSetting();
        $("#" + cId).css({
            "padding": "20px",
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "box-sizing": "border-box"
        });
        bindFrame();
    }
    this.show = function (im) {
        mPage.show();
        isBack = false;
        item = im;
        bindContent(item["nickName"]);
    }
    function bindFrame() {
        var line = "<div style=\"height:40px\"></div>";
        var input = "<input id=\"" + cId + "_input\" placeholder=\"请输入备注名\" maxlength=\"10\" type=\"text\"/>";
        var btn = "<div id=\"" + cId + "_btn\">确定</div>";
        $("#" + cId).html(input + line + btn);
        setFrameStyle();
    }
    function setFrameStyle() {
        $("#" + cId + "_input").css({
            "border-radius": "5px",
            "border": "0px",
            "background": "white",
            "width": "100%",
            "height": "40px",
            "font-size": "14px",
            "text-align": "left",
            "padding-left": "10px",
            "box-sizing": "border-box"
        });
        $("#" + cId + "_btn").css({
            "border-radius": "20px",
            "color": mainFontColor,
            "font-size": "14px",
            "background-color": mainColor,
            "width": "100%",
            "height": "40px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        setBtnOnTouchEvent($("#" + cId + "_btn"), function () {
            if (item == null) {
                backClickFun();
                return;
            }
            var val = $("#" + cId + "_input").val();
            if (val == "") {
                mToast.show("备注名称不能为空!", 1, null);
                return;
            }
            if (val == item["nickName"]) {
                mToast.show("请输入新的备注名!", 1, null);
                return;
            }
            updateRemake(val);
        }, mainColorDeep, mainColor);
    }
    function bindContent(oldRemake) {
        $("#" + cId + "_input").val(oldRemake);
        $("#" + cId + "_input").focus();
    }
    function updateRemake(remake) {
        var dataObj = new Object();
        dataObj["name"] = item["name"];
        dataObj["remake"] = remake;
        mLoader.show("updateRemake");
        requestAjax("", dataObj, function (jsonObj) {
            mLoader.unShow("updateRemake");
            if (jsonObj["code"] == 0) {
            } else {
                LoadError(mLangObj.getZHByCode(jsonObj["tipMessage"]));
            }
        }, function (error) {
            mLoader.unShow("updateRemake");
            LoadError(error);
        });
        function LoadError(error) {
            if (error == null) {
                mToast.show("修改备注失败,请重试!", 1, "middle");
            } else {
                mToast.show("修改备注失败,请重试! <br>" + error, 2, "middle");
            }
        }
    }
}
function ChatImageLook() {
    var rootId = "chatImageLookDiv";
    var cId = rootId + "_content";
    var imageId = cId + "_image_rot";
    var mPage = new PAGE(rootId, "图片查看");
    this.init = function () {
        mPage.init(function () {
            $("#" + imageId).html("");
        });
        mPage.hiddenSetting();
        $("#" + cId).css({
            "width": screenW,
            "height": screenH - topH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "box-sizing": "border-box"
        });
        $("#" + cId).html("<div id=\"" + imageId + "\"></div>");
        $("#" + imageId).css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + cId).click(function () {
            backClickFun();
        });
    }
    this.show = function (url) {
        mPage.show();
        var img = "<img src=\"" + url + "\" style=\"width:100%\"/>";
        $("#" + imageId).html(img);
    }
}
function addPageToHtml(id) {
    var rot = "<div id=\"" + id + "\" style=\"position:absolute;display:none\">[content]</div>";
    var top = "<div id=\"" + id + "_top\"></div>";
    var con = "<div id=\"" + id + "_content\"></div>";
    rot = rot.replace("[content]", top + con);
    $("#bodyDiv").append(rot);
}
function addWindowToHtml(id) {
    var rot = "<div id=\"" + id + "\">[content]</div>";
    var back = "<div id=\"" + id + "_back\"></div>";
    var con = "<div id=\"" + id + "_con_rot\"><div id=\"" + id + "_content\"></div></div>";
    rot = rot.replace("[content]", back + con);
    $("#bodyDiv").append(rot);
    $("#" + id).css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "display": "none"
    });
    $("#" + id + "_back").css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "width": screenW,
        "height": screenH,
        "background": "#000000",
        "opacity": "0.6",
        "box-sizing": "border-box"
    });
    $("#" + id + "_con_rot").css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "width": screenW,
        "height": screenH,
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "box-sizing": "border-box"
    });
}
function ChatBindFedView(rootId, msg, isReLoad, handel) {
    var obj = $("#" + rootId);
    var back = "<div id=\"" + rootId + "_failedBg\">[content]</div>";
    var view = "<div id=\"" + rootId + "_failedDiv\">[content]</div>";
    var img = "<div style=\"height:80px\"><img class=\"openGameFailureImg\" src=\"" + themPath + "sorry.png\"/></div>";
    var textBt = "<div style=\"font-size:16px;color:" + mainColor + "\">很抱歉</div>";
    var textTs = "<div style=\"font-size:14px;color:#999999\">" + msg + "</div>";
    var reLoadBtn = "<div id=\"" + rootId + "_reLoadBtn\">重新加载</div>";
    var lineMax = "<div style=\"height:6px\"></div>";
    var lineMin = "<div style=\"height:1px\"></div>";
    if (isReLoad) {
        back = back.replace("[content]", view.replace("[content]", img + lineMax + textBt + lineMin + textTs + lineMax + reLoadBtn));
    } else {
        back = back.replace("[content]", view.replace("[content]", img + lineMax + textBt + lineMin + textTs));
    }
    obj.html(back);
    obj.css({ "box-sizing": "border-box" });
    $("#" + rootId + "_failedBg").css({
        "width": "100%",
        "height": "100%",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "box-sizing": "border-box"
    });
    $("#" + rootId + "_failedDiv").css({
        "width": "100%",
        "height": "auto",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "flex-start",
        "align-items": "center",
        "box-sizing": "border-box"
    });
    $("#" + rootId + "_reLoadBtn").css({
        "width": "45%",
        "height": "32px",
        "border-radius": "20px",
        "background": mainColor,
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "padding": "0px 10px 0px 10px",
        "font-size": "12px",
        "color": mainFontColor,
        "box-sizing": "border-box"
    });
    setBtnOnTouchEvent($("#" + rootId + "_reLoadBtn"), function () {
        if (handel != null) handel();
    }, mainColorDeep, mainColor, null);
}
function appLogout() {
}
var toolbarTopColor = "#0f0f0f";
var toolbarTopColorDK = "#212121";
var toolbarIndexColor = "#cccccc";
var toolbarIndexColorTouch = "#cca352";
var toolbarBottomColor = "#0f0f0f";
var toolbarBottomColorDK = "#212121";
var toolbarFontColor = "#999999";
var toolbarFontColorTouch = "#cca352";
var mainColor = "#cca352";
var mainColorDeep = "#9a7d44";
var mainColorMore = "#212121";
var subColor = "#cca352";
var subColorDK = "#212121";
var mainBackColor = "#2A2A2A";
var lighterBackColor = "#383838";
var pageBgColor = "#272727";
var pageBgColorDK = "#272727";
// 分割块颜色
var splitLineColor = "#999999";
// 字体颜色
var mainFontColor = "#FFFFFF";
var mainFontColorMore = "#CCCCCC";
var mainFontColorDeep = "#999999";
// 主题路径
var themPath = "pic/themeMain/";
