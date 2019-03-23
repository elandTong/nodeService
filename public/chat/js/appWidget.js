// 点击处理事件
var startEvent;
var moveEvent;
var endEvent;
var cancelEvent;
// 输入法颜色
var inputLineColor = "#161616";
var inputFontColor = "#FFFFFF";
var inputSubFontColor = "#cca352";
var inputTouchColor = "#15171b";
var inputBgColor = "#2E333B";
// 时区
var timeZone = 8;
var zIndexMax = 1000;
var isTouchLockOK = false; // 手势密码是否锁定屏幕
var isAndroidFlag;
var isDisconnectService = false; // 服务连接是否中断(只能由原生刷新才能重置)
var disconnectServiceCount = 0;
var timeOutAjax = 2000;
var T0EventList = new Array();
var mEventBusObj = new AppEventBus(); mEventBusObj.init();
var backFunArr = new Array();
function TOP_BAR(topId, te) {
    var backHandel = null;
    var settingHandel = null;
    this.init = function () {
        var line = "<div style=\"width:3px\"></div>";
        var lineMax = "<div style=\"width:10px\"></div>";
        var left = "<div id=\"" + topId + "_left\">[content]</div>";
        var right = "<div id=\"" + topId + "_right\">[content]</div>";
        var back = "<div id=" + topId + "_back><img src=" + themPath + "back.png height='15px'/></div>";
        var title = "<div id=" + topId + "_title>" + te + "</div>";
        left = left.replace("[content]", line + back + line + title);
        var setting = "<div id=" + topId + "_setting><img src=" + themPath + "setting.png width='25px'/></div>";
        right = right.replace("[content]", lineMax + setting + lineMax);
        $("#" + topId).html(left + right);
        $("#" + topId).css({
            "background": "-webkit-linear-gradient(top, " + toolbarTopColor + " 0%," + toolbarTopColorDK + " 100%)",
            "width": screenW,
            "height": topH,
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $("#" + topId + "_left").css({
            "width": "50%",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center"
        });
        $("#" + topId + "_right").css({
            "width": "50%",
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center"
        });
        $("#" + topId + "_back").css({
            "width": "40px",
            "height": "40px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "border-radius": "50%"
        });
        $("#" + topId + "_title").css({
            "width": "auto",
            "color": toolbarFontColor,
            "font-size": "15px"
        });
        $("#" + topId + "_setting").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        setBtnOnTouchEvent($("#" + topId + "_back"), function () {
            if (backHandel != null) backHandel();
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#" + topId + "_setting"), function () {
            if (settingHandel != null) settingHandel();
        }, mainColorDeep, "", null);
    }
    this.setHandel = function (backFun, settingFun) {
        backHandel = backFun;
        settingHandel = settingFun;
    }
    this.clearHandel = function () {
        backHandel = null;
        settingHandel = null;
    }
    this.showTopBar = function () {
        $("#" + topId).css({ "display": "flex" });
    }
    this.hiddenTopBar = function () {
        $("#" + topId).css({ "display": "none" });
    }
    this.showBtn = function () {
        $("#" + topId + "_controls").css({ "display": "flex" });
    }
    this.hiddenBtn = function () {
        $("#" + topId + "_controls").css({ "display": "none" });
    }
    this.showSetting = function () {
        $("#" + topId + "_setting").css({ "display": "flex" });
    }
    this.hiddenSetting = function () {
        $("#" + topId + "_setting").css({ "display": "none" });
    }
    this.setTitle = function (ms) {
        $("#" + topId + "_title").html(ms);
    }
}
function PAGE(preFix, title) {
    var page = $("#" + preFix);
    var w = $(window).width();
    var h = $(window).height();
    var mTop;
    var backFun = null;
    var resumeFun = null;
    var pauseFun = null;
    var uniqueIdentifie = null; // 页面唯一标识
    var eventTheme = "PAGE_PUSH_THEME";
    var eventIndex = null; var isResume = false;
    this.init = function (back, settingFun) {
        if (back != null) {
            backFun = back;
        }
        page.css({
            "width": w,
            "height": h,
            "position": "absolute",
            "left": w,
            "display": "none"
        });
        mTop = new TOP_BAR(preFix + "_top", title);
        mTop.init();
        mTop.setHandel(function () {
            backClickFun();
            focusHiddenBox();
        }, settingFun);
        $("#" + preFix + "_content").css({
            "width": w,
            "height": h - topH,
            "background": pageBgColor
        });
        eventIndex = mEventBusObj.subscriptionForce(eventTheme, function (obj) {
            if (obj["theme"] != eventTheme) return;
            var unique = obj["TOP_LEVEL"];
            if (uniqueIdentifie == null) return;
            if (unique == uniqueIdentifie) {
                if (resumeFun != null && !isResume) {
                    resumeFun();
                }
                isResume = true;
            } else {
                if (pauseFun != null && isResume) {
                    pauseFun();
                }
                isResume = false;
            }
        });
    }
    this.show = function (pageExitFun) {
        addBackFunArr(function () {
            pageExit();
            if (backFun != null) {
                backFun();
            }
            if (pageExitFun != null) {
                pageExitFun();
            }
        }, function (unique) {
            uniqueIdentifie = unique;
        });
        focusHiddenBox();
        currentZIndex = currentZIndex + 1;
        page.css({ "display": "block", "z-index": currentZIndex });
        page.transition({ x: -w }, "fast");
    }
    this.onResume = function (handel) {
        resumeFun = handel;
    }
    this.onPause = function (handel) {
        pauseFun = handel;
    }
    this.showTop = function () {
        mTop.showTopBar();
    }
    this.hiddenTop = function () {
        mTop.hiddenTopBar();
    }
    this.showBtn = function () {
        mTop.showBtn();
    }
    this.hiddenBtn = function () {
        mTop.hiddenBtn();
    }
    this.showSetting = function () {
        mTop.showSetting();
    }
    this.hiddenSetting = function () {
        mTop.hiddenSetting();
    }
    this.setTitle = function (ms) {
        mTop.setTitle(ms);
    }
    function pageExit() {
        page.transition({ x: 0 }, "fast");
    }
}
function eTable(mTableId, mColumnDatas, mPageSize) {
    var tableId;
    var tableObj;
    var columnDatas;
    var progressRate;
    var requestUrl;
    var requestParame;
    var dataList = new Array();
    var itemClickFun = null;
    var parseDataFun = null;
    var loadOKFun = null;
    var pageSize = 20;
    var currentPage = 1;
    var outTime = 500;
    var isLoading = false;
    var isRefresh = true;
    var isLoadMore = false;
    this.init = function () {
        if (mTableId != null) {
            tableId = mTableId;
        }
        if (mColumnDatas != null) {
            columnDatas = mColumnDatas;
        }
        if (!isNaN(mPageSize) && mPageSize > 0) {
            pageSize = mPageSize;
        }
        tableObj = $("#" + tableId);
        progressRate = new Spinner({
            color: "#FFFFFF"
        });

        bindFrameView();
        bindHeadView();
    }
    this.hiddenHead = function () {
        $("#" + tableId + "_head").css({ "display": "none" });
    }
    this.itemClickFunction = function (fun) {
        itemClickFun = fun;
    }
    this.setParseFunction = function (fun) {
        parseDataFun = fun;
    }
    this.setLoadOKFunction = function (fun) {
        loadOKFun = fun;
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
    function bindFrameView() {
        var divs = "<div id=" + tableId + "_head style=\"width:100%\"></div>";
        divs = divs + "<div id=" + tableId + "_refreshProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items: center\"></div>";
        divs = divs + "<div id=" + tableId + "_content style=\"width:100%\"></div>";
        divs = divs + "<div id=" + tableId + "_moreProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items: center\"></div>";
        divs = divs + "<div id=" + tableId + "_lineBtm style=\"width:100%;height:20px\"></div>";
        tableObj.html(divs);
        BindT0UniqueEvent(tableId, "scroll", scrollHandel);
    }
    function bindHeadView() {
        var len = columnDatas.length;
        var line = "<table cellpadding=0 cellspacing=0 style=\"width:100%;background-color:#383838\"><tr>%content%</tr></table>";
        var column = "<td align=center class=" + tableId + "_itemtd  width=%width% style=\"color:" +
            mainFontColorDeep + ";font-size:12px\"><div style=\"text-align:%align%;width:100%\">%title%</div></td>";
        var content = "";
        for (var i = 0; i < len; i++) {
            var item = columnDatas[i];
            var align = item["align"];
            var width = item["width"];
            var title = item["title"];
            if (align == null) {
                align = "center";
            }
            content = content + column.replace("%width%", width).replace("%align%", align).replace("%title%", title);
        }
        line = line.replace("%content%", content);
        line = line + "<div style=\"width:100%;height:18px\"></div>";
        $("#" + tableId + "_head").html(line);
        $("." + tableId + "_itemtd").css({
            "word-wrap": "break-word", "word-break": "break-all",
            "text-align": "center", "height": 35,
            "box-sizing": "border-box"
        });
    }
    function getListHeight() {
        var headH = 0;
        var headObj = $("#" + tableId + "_head");
        if (headObj.css("display") != "none") {
            headH = headObj.height();
        }
        var contentH = 0;
        var contentObj = $("#" + tableId + "_content");
        if (contentObj.css("display") != "none") {
            contentH = contentObj.height();
        }
        return headH + contentH;
    }
    var loadTimeout = null;
    function refresh() {
        closeProgressView();
        isLoading = true;
        currentPage = 1;
        dataList = new Array();
        tableObj.scrollTop(0);
        showRefreshView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(true);
        }, outTime);
    }
    function more() {
        closeProgressView();
        isLoading = true;
        showMoreView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(false);
        }, outTime);
    }
    var scrollTopNum = 0;
    var scrollTopTimeout = null;
    function scrollHandel(e) {
        var scroll_top = tableObj.scrollTop(); // 滑动量
        var scroll_height = tableObj.height(); // div高度
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
        // 每一行
        for (var i = 0; i < len; i++) {
            var item = datas[i];
            // 行(item)布局
            var divsItemLayout = "<div class=" + tableId + "_item_layout id=" + tableId + "_item_" + i + ">%content%</div>";
            // 内容布局
            var divsContentLayout = "<div class=" + tableId + "_content_layout>%content%</div>";
            // 箭头图片
            var display = "none";
            var arrow = item["arrow"];// true显示,false不显示
            if (arrow == true) {
                display = "block";
            } else {
                display = "none";
            }
            var divsArrow = "<img src=\"" + themPath + "arrow.png\" style=\"display: " + display +
                ";height: 7px;width: 6px;margin-right: 5px\"/>";

            // item顶部布局
            var divsTopLayout = "<div class=" + tableId + "_top_layout>%content%</div>";
            var divsIndex = "<div class=" + tableId + "_index><font color=white>" + (len - i) + ".</font></div>";
            var order = item["order"];
            if (order == null) {
                order = "";
            }
            var divsOrder = "<div class=" + tableId + "_order>" + order + "</div>";
            divsTopLayout = divsTopLayout.replace("%content%", divsIndex + divsOrder);

            // item中间布局
            var divsMidLayout = "<div class=" + tableId + "_mid_layout>%content%</div>";
            var gameName = item["gameName"];
            var divsName = "<div class=" + tableId + "_name>" + gameName + "</div>";
            var period = item["period"];
            if (period == null) {
                period = "";
            }
            var divsPeriod = "<div class=" + tableId + "_period>" + period + "</div>";
            var date = item["date"];
            var divsDate = "<div class=" + tableId + "_date>" + date + "</div>";
            divsMidLayout = divsMidLayout.replace("%content%", divsName + divsPeriod + divsDate);

            // item底部布局
            var divsBottomLayout = "<div class=" + tableId + "_bottom_layout>%content%</div>";

            var msg = "";
            var lenColumn = columnDatas.length;
            // 每一列
            for (var j = 0; j < lenColumn; j++) {
                var code = columnDatas[j]["code"];
                var codevalue = item[code];
                msg += "<div class=" + tableId + "_info_" + j + ">" + codevalue + "</div>";
            }
            divsBottomLayout = divsBottomLayout.replace("%content%", msg);

            // betLiveList
            var betLiveList = item["betLiveList"];
            var divsBetLives = "";
            if (betLiveList != null && betLiveList.length != 0) {
                var betLiveLen = betLiveList.length;
                for (var p = 0; p < betLiveLen; p++) {
                    var betRootLayout = "<div class=" + tableId + "_bet_root_layout>%content%</div>";
                    var betLeftText = "<div class=" + tableId + "_bet_left_text>%content%</div>";
                    var betRightText = "<div class=" + tableId + "_bet_right_text>%content%</div>";
                    if (p < 2) {
                        var betLiveItem = betLiveList[p];
                        var leftTxt = betLiveItem["leftText"];
                        betLeftText = betLeftText.replace("%content%", leftTxt);
                        var rightTxt = betLiveItem["rightText"];
                        betRightText = betRightText.replace("%content%", rightTxt);
                        betRootLayout = betRootLayout.replace("%content%", betLeftText + betRightText);
                    } else {
                        var leftTxt = "<font color=white>...</font>";
                        betLeftText = betLeftText.replace("%content%", leftTxt);
                        var rightTxt = "<font color=#898989>...</font>";
                        betRightText = betRightText.replace("%content%", rightTxt);
                        betRootLayout = betRootLayout.replace("%content%", betLeftText + betRightText);
                        divsBetLives += betRootLayout;
                        break;
                    }
                    divsBetLives += betRootLayout;
                }
            }
            divsContentLayout = divsContentLayout.replace("%content%", divsTopLayout +
                divsMidLayout + divsBottomLayout + divsBetLives);
            divsItemLayout = divsItemLayout.replace("%content%", divsContentLayout + divsArrow);
            divs += divsItemLayout;
        }
        if (pageInfo != null) {
            var pages = "总页数:" + pageInfo["pages"];
            var pagec = "当前页:" + pageInfo["currentPage"];
            var totalRow = "总条数:" + pageInfo["totalRow"];
            var pagem = "每页数:" + pageInfo["pageCount"];
            var pinfo = "<div class=\"" + tableId + "_pageInfo\">%content%</div>";
            $("#" + tableId + "_content").html(divs + pinfo.replace("%content%", pages + "," + pagec + "," + totalRow + "," + pagem));
        } else {
            $("#" + tableId + "_content").html(divs);
        }
        setItemStyle();
    }
    function showEmpty() {
        var ms = "<div style=\"width:100%;text-align:center;font-size:12px;color:#999999\">没有读取到数据,请重试!</div>";
        $("#" + tableId + "_content").html(ms);
    }
    function setItemStyle() {
        // item根布局
        $("." + tableId + "_item_layout").css({
            "display": "flex", "justify-content": "center",
            "align-items": "center", "width": "auto",
            "height": "auto", "background": "#4c4c4c",
            "border-radius": "5px", "margin-left": "5px",
            "margin-right": "5px", "margin-bottom": "18px",
            "box-sizing": "border-box"
        });
        // 内容布局
        $("." + tableId + "_content_layout").css({
            "align-items": "center", "text-align": "center",
            "width": "100%", "height": "auto",
            "padding": "6px", "box-sizing": "border-box"
        });
        // TopLayout
        $("." + tableId + "_top_layout").css({
            "display": "flex", "justify-content": "center",
            "align-items": "center", "width": "100%"
        });
        $("." + tableId + "_index").css({
            "text-align": "left", "width": "50%",
            "font-size": "10px"
        });
        $("." + tableId + "_order").css({
            "text-align": "right", "width": "50%",
            "font-size": "10px"
        });
        // MidLayout
        $("." + tableId + "_mid_layout").css({
            "display": "flex", "justify-content": "center",
            "align-items": "center", "width": "100%",
            "margin-top": "0px", "box-sizing": "border-box"
        });
        $("." + tableId + "_name").css({
            "text-align": "left", "width": "33%",
            "font-size": "10px"
        });
        $("." + tableId + "_period").css({
            "text-align": "center", "width": "33%",
            "font-size": "10px"
        });
        $("." + tableId + "_date").css({
            "text-align": "right", "width": "33%",
            "font-size": "10px"
        });
        // BottomLayout
        $("." + tableId + "_bottom_layout").css({
            "display": "flex", "justify-content": "space-between",
            "align-items": "center", "margin-top": "3px",
            "width": "100%", "height": "auto",
            "box-sizing": "border-box"
        });
        // betLiveListLayout
        $("." + tableId + "_bet_root_layout").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "margin-top": "3px",
            "width": "100%",
            "height": "auto",
            "padding": "2px",
            "background": "#2E2E2E",
            "box-sizing": "border-box"
        });
        $("." + tableId + "_bet_left_text").css({
            "text-align": "left",
            "width": "50%",
            "height": "auto",
            "margin-left": "5px",
            "font-size": "10px"
        });
        $("." + tableId + "_bet_right_text").css({
            "text-align": "right",
            "width": "50%",
            "height": "auto",
            "margin-right": "5px",
            "font-size": "10px"
        });
        $("." + tableId + "_pageInfo").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "20px",
            "color": "#999999",
            "font-size": "12px"
        });
        var len = columnDatas.length;
        for (var i = 0; i < len; i++) {
            var item = columnDatas[i];
            var w = item["width"]; // 必选项(百分比)
            var h = item["height"]; // 可选项(px)
            var infoObj = $("." + tableId + "_info_" + i);
            if (h != null) { // 指定高度
                infoObj.css({
                    "text-align": "center", "align-items": "center",
                    "display": "flex", "justify-content": "center",
                    "font-size": "12px", "background": "#2E2E2E",
                    "width": w, "height": h
                });
            } else { // 未指定高度
                infoObj.css({
                    "text-align": "center", "align-items": "center",
                    "display": "flex", "justify-content": "center",
                    "font-size": "12px", "background": "#2E2E2E",
                    "padding-top": "2px", "padding-bottom": "2px",
                    "width": w, "height": "auto",
                    "box-sizing": "border-box"
                });
            }
        }
        if (itemClickFun != null) {
            $("." + tableId + "_item_layout").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var arr = mObj.id.split("_");
                    var len = arr.length;
                    var index = arr[len - 1];
                    itemClickFun(dataList[index], index);
                    console.log("item click index: " + mObj.id);
                }, mainColorDeep, "#4c4c4c", null);
            });
        }
    }
    function showRefreshView() {
        $("#" + tableId + "_refreshProgress").css({ "display": "block" });
        progressRate.spin(document.getElementById(tableId + "_refreshProgress"));
    }
    function showMoreView() {
        $("#" + tableId + "_moreProgress").css({ "display": "block" });
        $("#" + tableId + "_lineBtm").css({ "display": "block" });
        progressRate.spin(document.getElementById(tableId + "_moreProgress"));
    }
    function closeProgressView() {
        $("#" + tableId + "_refreshProgress").css({ "display": "none" });
        $("#" + tableId + "_moreProgress").css({ "display": "none" });
        $("#" + tableId + "_lineBtm").css({ "display": "none" });
        progressRate.spin();
    }
    var isLoadAjax = false;
    function loadAjax(mode) {
        if (isLoadAjax) return;
        isLoadAjax = true;
        var param = requestParame + "&pageCount=" + pageSize + "&currentPage=" + currentPage + "&rand=" + randomString();
        requestAjax(requestUrl, param, function (jsonObj) {
            isLoadAjax = false;
            isLoading = false;
            closeProgressView();
            if (jsonObj["code"] == 0) {
                var pageInfo = getListPageInfo(jsonObj);
                if (parseDataFun != null) {
                    jsonObj = parseDataFun(jsonObj, mode);
                }
                if (loadOKFun != null) {
                    loadOKFun();
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
                mToast.show("登录信息失效!", "1", "middle");
                appLogout();
            } else {
                mToast.show("读取信息出现错误!" + mLangObj.getZHByCode(jsonObj["tipMessage"]), "1", "middle");
            }
        }, function (error) {
            isLoadAjax = false;
            isLoading = false;
            closeProgressView();
            loadError();
        });
        function loadError() {
            isLoading = false;
            if (dataList.length == 0) showEmpty();
        }
    }
    function isReady() {
        if (requestUrl != null && requestUrl != "") {
            return true;
        }
        return false;
    }
}
function tTable(mTableId, mColumnDatas, mPageSize) {
    var tableId;
    var tableObj;
    var columnDatas;
    var progressRate;
    var requestUrl;
    var requestParame;
    var dataList = new Array();
    var itemBtnClickFun = null;
    var itemClickFun = null;
    var parseDataFun = null;
    var loadOKFun = null;
    var pageSize = 20;
    var currentPage = 1;
    var itemHeight = 50;
    var outTime = 500;
    var isLoading = false;
    var isRefresh = true;
    var isLoadMore = false;
    this.init = function () {
        if (mTableId != null) {
            tableId = mTableId;
        }
        if (mColumnDatas != null) {
            columnDatas = mColumnDatas;
        }
        if (!isNaN(mPageSize) && mPageSize > 0) {
            pageSize = mPageSize;
        }
        tableObj = $("#" + tableId);
        progressRate = new Spinner({
            color: "#FFFFFF"
        });

        bindFrameView();
        bindHeadView();
    }
    this.setItemHeight = function (height) {
        itemHeight = height;
    }
    this.hiddenHead = function () {
        $("#" + tableId + "_head").css({ "display": "none" });
    }
    this.itemBtnClickFunciton = function (fun) {
        itemBtnClickFun = fun;
    }
    this.itemClickFunction = function (fun) {
        itemClickFun = fun;
    }
    this.setParseFunction = function (fun) {
        parseDataFun = fun;
    }
    this.setLoadOKFunction = function (fun) {
        loadOKFun = fun;
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
    function bindFrameView() {
        var divs = "<div id=" + tableId + "_head style=\"width:100%\"></div>";
        divs = divs + "<div id=" + tableId + "_refreshProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items: center\"></div>";
        divs = divs + "<div id=" + tableId + "_content style=\"width:100%\"></div>";
        divs = divs + "<div id=" + tableId + "_lineTop style=\"width:100%;height:9px\"></div>";
        divs = divs + "<div id=" + tableId + "_moreProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items: center\"></div>";
        divs = divs + "<div id=" + tableId + "_lineBtm style=\"width:100%;height:10px\"></div>";
        tableObj.html(divs);
        BindT0UniqueEvent(tableId, "scroll", scrollHandel);
    }
    function bindHeadView() {
        var line = "<table cellpadding=0 cellspacing=0 style=\"width:100%;background-color:#383838\"><tr>%content%</tr></table>";
        var column = "<td align=center class=" + tableId + "_itemtd width=%width% style=\"color:" +
            mainFontColorDeep + ";font-size:12px\"><div style=\"text-align:%align%;width:100%\">%title%</div></td>";
        var content = "";
        var len = columnDatas.length;
        for (var i = 0; i < len; i++) {
            var item = columnDatas[i];
            var width = item["width"];
            var title = item["title"];
            var align = item["align"]; if (align == null) { align = "center"; }
            content = content + column.replace("%width%", width).replace("%align%", align).replace("%title%", title);
        }
        line = line.replace("%content%", content);
        line = line + "<div style=\"width:100%;height:10px\"></div>";
        $("#" + tableId + "_head").html(line);

        $("." + tableId + "_itemtd").css({
            "height": itemHeight,
            "word-wrap": "break-word",
            "word-break": "break-all",
            "text-align": "center",
            "box-sizing": "border-box"
        });
    }
    function getListHeight() {
        var headH = 0;
        var headObj = $("#" + tableId + "_head");
        if (headObj.css("display") != "none") {
            headH = headObj.height();
        }
        var contentH = 0;
        var contentObj = $("#" + tableId + "_content");
        if (contentObj.css("display") != "none") {
            contentH = contentObj.height();
        }
        var decH = 0;
        var decObj = $("#" + tableId + "_lineTop");
        if (decObj.css("display") != "none") {
            decH = decObj.height();
        }
        return headH + contentH + decH;
    }
    var loadTimeout = null;
    function refresh() {
        closeProgressView();
        isLoading = true;
        currentPage = 1;
        dataList = new Array();
        tableObj.scrollTop(0);
        showRefreshView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(true);
        }, outTime);
    }
    function more() {
        closeProgressView();
        isLoading = true;
        showMoreView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(false);
        }, outTime);
    }
    var scrollTopNum = 0;
    var scrollTopTimeout = null;
    function scrollHandel(e) {
        var scroll_top = tableObj.scrollTop(); // 滑动量
        var scroll_height = tableObj.height(); // div高度
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
        var lineDiv = "<div id=\"%id%\" class=\"" + tableId + "_item_line_div\">%content%</div>"; // 行div
        var columnDiv = "<div class=\"" + tableId + "_column_div\" style=\"width: %width%;display: flex;justify-content: center;align-items:center\">%content%</div>"; // 列div
        var textDiv = "<div style=\"width:100%;text-align:%align%;font-size:10px;color:#EEEEEE\">%content%</div>"; // 列中文字div
        var buttonDiv = "<div id=\"%id%\" class=\"" + tableId + "_column_btn_div\">%content%</div>"; // 列中按钮div
        var dev = "<div style=\"width:5px\"></div>";
        var divs = "";
        var len = datas.length;
        for (var i = 0; i < len; i++) { // 每一行
            var cns = "";
            var item = datas[i];
            var lenColumn = columnDatas.length;
            for (var p = 0; p < lenColumn; p++) { // 每一列
                var columnItem = columnDatas[p];
                var code = columnItem["code"];
                var align = columnItem["align"]; if (align == null) { align = "center"; }
                var width = columnItem["width"];
                var isTime = columnItem["time"];
                var isIndex = columnItem["index"];
                var btns = columnItem["btns"];
                if (btns == null) { // 非按钮列
                    var value = "";
                    if (isTime == "true") {
                        value = "<font color=#6E6E6E>" + new Date().format("yyyy-MM-dd hh:mm") + "</font>";
                    } else if (isIndex == "true") {
                        var numPx = "0"; if (i >= 9) { numPx = ""; }
                        value = "<font color=#6E6E6E>" + numPx + (i + 1) + ".</font>";
                    } else {
                        value = item[code]; if (value == null) { value = ""; }
                    }
                    var txt = textDiv.replace("%content%", value).replace("%align%", align);
                    cns += columnDiv.replace("%content%", txt).replace("%width%", width);
                } else { // 按钮列
                    var btnDivs = "";
                    var bLen = btns.length; // 按钮数量
                    for (var n = 0; n < bLen; n++) {
                        var bItem = btns[n];
                        var bcode = bItem["code"];
                        var btext = bItem["text"];
                        var btype = bItem["type"]; if (btype == null) { btype = "0" }
                        var bid = tableId + "_button_" + bcode + "_" + btype + "_" + i;
                        if (!isHidden(bcode, item["hiddenBtns"])) { // 按钮未隐藏
                            btnDivs += buttonDiv.replace("%id%", bid).replace("%content%", btext);
                            if (n != bLen - 1) {
                                btnDivs += dev;
                            }
                        } else { // 按钮被隐藏;显示对应code值
                            var ms = item[bcode];
                            if (ms == null) { ms = ""; }
                            var width = 100 / bLen;
                            btnDivs += textDiv.replace("100%", width + "%").replace("%align%", "center").replace("%content%", ms);
                        }
                    }
                    cns += columnDiv.replace("%content%", btnDivs).replace("%width%", width);
                }
            }
            var lineId = tableId + "_lineId_" + i;
            divs += lineDiv.replace("%content%", cns).replace("%id%", lineId);
        }
        if (pageInfo != null) {
            var pages = "总页数:" + pageInfo["pages"];
            var pagec = "当前页:" + pageInfo["currentPage"];
            var totalRow = "总条数:" + pageInfo["totalRow"];
            var pagem = "每页数:" + pageInfo["pageCount"];
            var pinfo = "<div class=\"" + tableId + "_pageInfo\">%content%</div>";
            $("#" + tableId + "_content").html(divs + pinfo.replace("%content%", pages + "," + pagec + "," + totalRow + "," + pagem));
        } else {
            $("#" + tableId + "_content").html(divs);
        }
        setListStyle();
    }
    function showEmpty() {
        var ms = "<div style=\"width:100%;text-align:center;font-size:12px;color:#999999\">没有读取到数据,请重试!</div>";
        $("#" + tableId + "_content").html(ms);
    }
    function isHidden(code, hiddenList) {
        var b = false;
        if (hiddenList != null) {
            var len = hiddenList.length;
            for (var i = 0; i < len; i++) {
                if (code == hiddenList[i]) {
                    b = true; break;
                }
            }
        }
        return b;
    }
    function setListStyle() {
        $("." + tableId + "_item_line_div").css({
            "width": "100%",
            "height": itemHeight,
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "background": "#383838",
            "margin-bottom": "1px",
            "padding": "3px",
            "box-sizing": "border-box"
        });
        $("." + tableId + "_column_div").css({
            "height": itemHeight,
            "box-sizing": "border-box"
        });
        $("." + tableId + "_pageInfo").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "20px",
            "color": "#999999",
            "font-size": "12px"
        });
        // 按钮样式设置:0(默认实心样式);1(默认空心样式);2(蓝色空心样式)
        $("." + tableId + "_column_btn_div").each(function () {
            var id = this.id;
            var obj = $("#" + id);
            var idList = id.split("_");
            var iLen = idList.length;
            var lineIndex = idList[iLen - 1];
            var type = idList[iLen - 2];
            var code = idList[iLen - 3];
            if (type == "0") {
                obj.css({
                    "width": "auto",
                    "height": "auto",
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    "border-radius": "5px",
                    "background-color": mainColor,
                    "padding-top": "5px",
                    "padding-bottom": "5px",
                    "padding-left": "5px",
                    "padding-right": "5px",
                    "color": mainFontColor,
                    "font-size": "10px",
                    "box-sizing": "border-box"
                });
                setBtnOnTouchEvent(obj, function () {
                    console.log("button click code:" + code + ";type:" + type + ";index:" + lineIndex);
                    if (itemBtnClickFun == null) { return; }
                    itemBtnClickFun(dataList[Number(lineIndex)], code, id);
                }, mainColorDeep, mainColor, null);
            } else {
                var color = mainColor;
                var colorDeep = mainColorDeep;
                if (type == "2") { color = "#3F80CC"; colorDeep = "#1F4066"; }
                obj.css({
                    "width": "auto",
                    "height": "auto",
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    "border-radius": "5px",
                    "background-color": "#2D2D2D",
                    "border": "1px solid " + color,
                    "padding-top": "5px",
                    "padding-bottom": "5px",
                    "padding-left": "5px",
                    "padding-right": "5px",
                    "color": color,
                    "font-size": "10px",
                    "box-sizing": "border-box"
                });
                setBtnOnTouchEvent(obj, function () {
                    console.log("button click code:" + code + ";type:" + type + ";index:" + lineIndex);
                    if (itemBtnClickFun == null) { return; }
                    itemBtnClickFun(dataList[Number(lineIndex)], code, id);
                }, colorDeep, "#2D2D2D", null);
            }
        });
        if (itemClickFun != null) {
            $("." + tableId + "_item_line_div").each(function () {
                setBtnOnTouchEvent($(this), function (obj) {
                    var id = obj.id;
                    var idList = id.split("_");
                    var len = idList.length;
                    var lineIndex = idList[len - 1];
                    itemClickFun(dataList[lineIndex], id);
                    console.log("line item click index:" + lineIndex);
                }, mainColorDeep, "#383838", null);
            });
        }
    }
    function showRefreshView() {
        $("#" + tableId + "_refreshProgress").css({ "display": "block" });
        progressRate.spin(document.getElementById(tableId + "_refreshProgress"));
    }
    function showMoreView() {
        $("#" + tableId + "_moreProgress").css({ "display": "block" });
        $("#" + tableId + "_lineBtm").css({ "display": "block" });
        progressRate.spin(document.getElementById(tableId + "_moreProgress"));
    }
    function closeProgressView() {
        $("#" + tableId + "_refreshProgress").css({ "display": "none" });
        $("#" + tableId + "_moreProgress").css({ "display": "none" });
        $("#" + tableId + "_lineBtm").css({ "display": "none" });
        progressRate.spin();
    }
    var isLoadAjax = false;
    function loadAjax(mode) {
        if (isLoadAjax) return;
        isLoadAjax = true;
        var param = requestParame + "&pageCount=" + pageSize + "&currentPage=" + currentPage + "&rand=" + randomString();
        requestAjax(requestUrl, param, function (jsonObj) {
            isLoadAjax = false;
            isLoading = false;
            closeProgressView();
            if (jsonObj["code"] == 0) {
                var pageInfo = getListPageInfo(jsonObj);
                if (parseDataFun != null) {
                    jsonObj = parseDataFun(jsonObj, mode);
                }
                if (loadOKFun != null) {
                    loadOKFun();
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
            closeProgressView();
            loadError();
        });
        function loadError() {
            isLoading = false;
            if (dataList.length == 0) showEmpty();
        }
    }
    function isReady() {
        if (requestUrl != null && requestUrl != "") {
            return true;
        }
        return false;
    }
}
function elandList(rootId, propertyList, size) {
    var rootViewId;
    var rootViewObj;
    var propertys;
    var progressRate = new Spinner({ color: "white" });
    var requestUrl;
    var requestParame;
    var dataList = new Array();
    var itemViewGetFun = null;
    var itemStyleSetFun = null;
    var parseDataFun = null;
    var loadOKFun = null;
    var pageSize = 20;
    var currentPage = 1;
    var outTime = 500;
    var isLoading = false;
    var isRefresh = true;
    var isLoadMore = false;
    this.init = function () {
        if (rootId != null) {
            rootViewId = rootId;
        }
        if (propertyList != null) {
            propertys = propertyList;
        }
        if (!isNaN(size) && size > 0) {
            pageSize = size;
        }
        rootViewObj = $("#" + rootViewId);
        bindFrameView();
    }
    this.setItemViewGetFunction = function (fun) {
        itemViewGetFun = fun;
    }
    this.setItemStyleSetFunction = function (fun) {
        itemStyleSetFun = fun;
    }
    this.setParseFunction = function (fun) {
        parseDataFun = fun;
    }
    this.setLoadOKFunction = function (fun) {
        loadOKFun = fun;
    }
    this.loadData = function (url, parame) {
        requestUrl = url;
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
    this.getItemData = function (index) {
        if (index >= 0 && index < dataList.length) {
            return dataList[index];
        }
    }
    function bindFrameView() {
        var divs = "";
        divs = divs + "<div id=" + rootViewId + "_refreshProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items: center\"></div>";
        divs = divs + "<div id=" + rootViewId + "_content style=\"width:100%\"></div>";
        divs = divs + "<div id=" + rootViewId + "_lineTop style=\"width:100%;height:9px\"></div>";
        divs = divs + "<div id=" + rootViewId + "_moreProgress style=\"width:100%;height:50px;display:flex;justify-content:center;align-items: center\"></div>";
        divs = divs + "<div id=" + rootViewId + "_lineBtm style=\"width:100%;height:10px\"></div>";
        rootViewObj.html(divs);
        BindT0UniqueEvent(rootViewId, "scroll", scrollHandel);
        $("#" + rootViewId + "_content").css({
            "background-color": pageBgColor,
            "padding-left": "5px",
            "padding-right": "5px",
            "box-sizing": "border-box"
        });
    }
    function getListHeight() {
        var contentH = 0;
        var contentObj = $("#" + rootViewId + "_content");
        if (contentObj.css("display") != "none") {
            contentH = contentObj.height();
        }
        var decH = 0;
        var decObj = $("#" + rootViewId + "_lineTop");
        if (decObj.css("display") != "none") {
            decH = decObj.height();
        }
        return contentH + decH;
    }
    var loadTimeout = null;
    function refresh() {
        closeProgressView();
        isLoading = true;
        currentPage = 1;
        dataList = new Array();
        rootViewObj.scrollTop(0);
        showRefreshView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(true);
        }, outTime);
    }
    function more() {
        closeProgressView();
        isLoading = true;
        showMoreView();
        if (loadTimeout != null) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(function () {
            loadAjax(false);
        }, outTime);
    }
    var scrollTopNum = 0;
    var scrollTopTimeout = null;
    function scrollHandel(e) {
        var scroll_top = rootViewObj.scrollTop();
        var scroll_height = rootViewObj.height();
        var doc_height = getListHeight();
        var scrollH = scroll_top + scroll_height;
        var docH = doc_height - 0;
        if (isLoadMore && !isLoading && (Math.abs(docH - scrollH) <= 10)) {
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
        var oLen = datas.length;
        var pLen = propertys.length;
        var views = "";
        for (var i = 0; i < oLen; i++) { // 每一行
            var item = datas[i];
            var newItemView = itemViewGetFun(item, i, rootViewId);
            for (var p = 0; p < pLen; p++) {
                var property = propertys[p];
                if (newItemView != null) {
                    newItemView = newItemView.replace(property, item[property]);
                }
            }
            views += newItemView;
        }
        if (pageInfo != null) {
            var pages = "总页数:" + pageInfo["pages"];
            var pagec = "当前页:" + pageInfo["currentPage"];
            var totalRow = "总条数:" + pageInfo["totalRow"];
            var pagem = "每页数:" + pageInfo["pageCount"];
            var pinfo = "<div class=\"" + rootViewId + "_pageInfo\">%content%</div>";
            $("#" + rootViewId + "_content").html(views + pinfo.replace("%content%", pages + "," + pagec + "," + totalRow + "," + pagem));
        } else {
            $("#" + rootViewId + "_content").html(views);
        }
        if (itemStyleSetFun != null) {
            itemStyleSetFun(rootViewId);
        }
        $("." + rootViewId + "_pageInfo").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "20px",
            "color": "#999999",
            "font-size": "12px"
        });
    }
    function showEmpty() {
        var ms = "<div style=\"width:100%;text-align:center;font-size:12px;color:#999999\">没有读取到数据,请重试!</div>";
        $("#" + rootViewId + "_content").html(ms);
    }
    function showRefreshView() {
        $("#" + rootViewId + "_refreshProgress").css({ "display": "block" });
        progressRate.spin(document.getElementById(rootViewId + "_refreshProgress"));
    }
    function showMoreView() {
        $("#" + rootViewId + "_moreProgress").css({ "display": "block" });
        $("#" + rootViewId + "_lineBtm").css({ "display": "block" });
        progressRate.spin(document.getElementById(rootViewId + "_moreProgress"));
    }
    function closeProgressView() {
        $("#" + rootViewId + "_refreshProgress").css({ "display": "none" });
        $("#" + rootViewId + "_moreProgress").css({ "display": "none" });
        $("#" + rootViewId + "_lineBtm").css({ "display": "none" });
        progressRate.spin();
    }
    var isLoadAjax = false;
    function loadAjax(mode) {
        if (isLoadAjax) return;
        isLoadAjax = true;
        var param = requestParame + "&pageCount=" + pageSize + "&currentPage=" + currentPage + "&rand=" + randomString();
        requestAjax(requestUrl, param, function (jsonObj) {
            isLoadAjax = false;
            isLoading = false;
            closeProgressView();
            if (jsonObj["code"] == 0) {
                var pageInfo = getListPageInfo(jsonObj);
                if (parseDataFun != null) {
                    jsonObj = parseDataFun(jsonObj, dataList["length"], rootViewId, mode);
                }
                if (loadOKFun != null) {
                    loadOKFun();
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
            closeProgressView();
            loadError();
        });
        function loadError() {
            isLoading = false;
            if (dataList["length"] == 0) showEmpty();
        }
    }
    function isReady() {
        if (requestUrl != null && requestUrl != "") {
            return true;
        }
        return false;
    }
}
function elandTab(rootId, list, opts) {
    var selectBackFun;
    var bindBackFun;
    var defTabIndex = 0;
    var conetntCount = 0;
    var selectIndex = 0;
    var hiddenList = new Array();
    var defOpts = {
        "tabH": "45px",
        "contentH": (screenH - topH) + "px",
        "tabBackground": "#2A2A2A",
        "tabTextColor": mainFontColorDeep,
        "tabSelectTextColor": mainColor,
        "lineH": "2px",
        "lineColor": mainColor,
        "lineNoneColor": "#000000"
    };
    this.init = init;
    this.backTabSelect = backTabSelect;
    this.backTabContentId = backTabContentId;
    this.defSelectTab = defaultSelectTab;
    this.selectTab = selectTab;
    this.showTab = showTab;
    this.hiddenTab = hiddenTab;
    function init() {
        if (list == null || list["length"] == 0) { return; }
        if (opts == null) { opts = defOpts; }
        conetntCount = list["length"];
        var tabRoot = '<div id="' + rootId + '_tab_root">[content]</div>';
        var tabTitle = '<div id="[id]" class="' + rootId + '_tab_menu">[content]</div>';
        var lineRoot = '<div id="' + rootId + '_line_root">[content]</div>';
        var line = '<div id="[id]" class="' + rootId + '_tab_line"></div>';
        var contentRoot = '<div id="' + rootId + '_content_root">[content]</div>';
        var content = '<div id="[id]" class="' + rootId + '_tab_content"></div>';
        var titleView = "";
        var lineView = "";
        var contentView = "";
        for (var i = 0; i < conetntCount; i++) {
            var item = list[i];
            titleView += tabTitle.replace("[id]", rootId + "_tabTitel_" + i).replace("[content]", item);
            lineView += line.replace("[id]", rootId + "_tabLine_" + i);
            contentView += content.replace("[id]", rootId + "_tabContent_" + i);
        }
        tabRoot = tabRoot.replace("[content]", titleView);
        lineRoot = lineRoot.replace("[content]", lineView);
        contentRoot = contentRoot.replace("[content]", contentView);
        $("#" + rootId).html(tabRoot + lineRoot + contentRoot);
        setStyle();
    }
    function backTabSelect(fun) {
        selectBackFun = fun;
    }
    function backTabContentId(fun) {
        bindBackFun = fun;
    }
    function defaultSelectTab(index) {
        if (list == null || list["length"] == 0) { return; }
        if (index < 0 || index >= list["length"]) { return; }
        defTabIndex = index; // 必须在init前调用有效
    }
    function selectTab(index) {
        if (index < 0 || index >= conetntCount) { return; }
        var colorText = opts["tabTextColor"];
        if (colorText == null) { colorText = defOpts["tabTextColor"]; }
        $("." + rootId + "_tab_menu").css({ "color": colorText });
        var lineNoneColor = opts["lineNoneColor"];
        if (lineNoneColor == null) { lineNoneColor = defOpts["lineNoneColor"]; }
        $("." + rootId + "_tab_line").css({ "background-color": lineNoneColor });
        $("." + rootId + "_tab_content").css({ "display": "none" });
        var colorSeText = opts["tabSelectTextColor"];
        if (colorSeText == null) { colorSeText = defOpts["tabSelectTextColor"]; }
        var colorLine = opts["lineColor"];
        if (colorLine == null) { colorLine = defOpts["lineColor"]; }
        $("#" + rootId + "_tabTitel_" + index).css({ "color": colorSeText });
        $("#" + rootId + "_tabLine_" + index).css({ "background-color": colorLine });
        $("#" + rootId + "_tabContent_" + index).css({ "display": "block" });
        if (selectBackFun != null) {
            selectBackFun(index, rootId + "_tabContent_" + index);
        }
        selectIndex = index;
    }
    function showTab(index) {
        if (!checkHidden(index)) { return; }
        if (index == selectIndex) { return; }
        if (index < 0 || index >= conetntCount) { return; }
        var i = getHiddenIndex(index);
        if (i == -1) { return; }
        hiddenList.splice(i, 1);
        var showLen = conetntCount - hiddenList["length"];
        $("." + rootId + "_tab_menu").css({
            "width": (100 / showLen) + "%",
        });
        $("." + rootId + "_tab_line").css({
            "width": (100 / showLen) + "%"
        });
        $("#" + rootId + "_tabTitel_" + index).css({ "display": "flex" });
        $("#" + rootId + "_tabLine_" + index).css({ "display": "block" });
        $("#" + rootId + "_tabContent_" + index).css({ "display": "none" });
    }
    function hiddenTab(index) {
        if (checkHidden(index)) { return; }
        if (index < 0 || index >= conetntCount) { return; }
        if (hiddenList["length"] >= (conetntCount - 1)) { return; }
        hiddenList.push(index);
        var showLen = conetntCount - hiddenList["length"];
        $("." + rootId + "_tab_menu").css({
            "width": (100 / showLen) + "%",
        });
        $("." + rootId + "_tab_line").css({
            "width": (100 / showLen) + "%"
        });
        $("#" + rootId + "_tabTitel_" + index).css({ "display": "none" });
        $("#" + rootId + "_tabLine_" + index).css({ "display": "none" });
        $("#" + rootId + "_tabContent_" + index).css({ "display": "none" });
        if (index == selectIndex) {
            selectTab(getTabIndexByShow());
        }
    }
    function setStyle() {
        var tabH = opts["tabH"];
        if (tabH == null) { tabH = defOpts["tabH"]; }
        var contentH = opts["contentH"];
        if (contentH == null) { contentH = defOpts["contentH"]; }
        var tabBackground = opts["tabBackground"];
        if (tabBackground == null) { tabBackground = defOpts["tabBackground"]; }
        var tabTextColor = opts["tabTextColor"];
        if (tabTextColor == null) { tabTextColor = defOpts["tabTextColor"]; }
        var lineNoneColor = opts["lineNoneColor"];
        if (lineNoneColor == null) { lineNoneColor = defOpts["lineNoneColor"]; }
        var lineH = opts["lineH"];
        if (lineH == null) { lineH = defOpts["lineH"]; }
        var fontSize = "14px";
        if (conetntCount > 6 && conetntCount <= 8) {
            fontSize = "12px";
        } else if (conetntCount > 8) {
            fontSize = "10px";
        }
        $("#" + rootId).css({ "display": "block" });
        $("#" + rootId + "_tab_root").css({
            "width": '100%',
            "height": tabH,
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "background-color": tabBackground
        });
        $("#" + rootId + "_line_root").css({
            "width": "100%",
            "height": lineH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#" + rootId + "_content_root").css({
            "width": "100%",
            "height": contentH,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "center"
        });
        $("." + rootId + "_tab_menu").css({
            "width": (100 / conetntCount) + "%",
            "height": tabH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": fontSize,
            "color": tabTextColor
        });
        $("." + rootId + "_tab_line").css({
            "width": (100 / conetntCount) + "%",
            "height": lineH,
            "background-color": lineNoneColor
        });
        $("." + rootId + "_tab_content").css({
            "width": "100%",
            "height": "100%",
            "display": "none",
            "background": pageBgColor
        });
        $("." + rootId + "_tab_menu").each(function () {
            setBtnOnTouchEventNoColor($(this), function (mObj) {
                var id = mObj.id;
                var idList = id.split("_");
                var idLen = idList["length"];
                var index = idList[idLen - 1];
                selectTab(index);
            }, null);
        });
        if (bindBackFun != null) {
            var listId = new Array();
            $("." + rootId + "_tab_content").each(function () { listId.push(this.id); });
            bindBackFun(listId);
        }
        selectTab(defTabIndex);
    }
    function checkHidden(index) {
        var i = hiddenList.indexOf(index);
        if (i >= 0) { return true; } else { return false; }
    }
    function getTabIndexByShow() {
        for (var i = 0; i < conetntCount; i++) {
            var index = hiddenList.indexOf(i);
            if (index < 0) { return i; }
        }
    }
    function getHiddenIndex(index) {
        var i = hiddenList.indexOf(index);
        if (i < 0) { return -1; } return i;
    }
}
function elandFloatTab(rootId, list, opts) {
    var selectBackFun;
    var bindBackFun;
    var defTabIndex = 0;
    var conetntCount = 0;
    var defOpts = {
        "tabH": "45px",
        "contentH": (screenH - topH) + "px",
        "colorMain": mainColor,
        "colorText": "white",
        "radius": "15px"
    };
    this.init = init;
    this.backTabSelect = backTabSelect;
    this.backTabContentId = backTabContentId;
    this.defSelectTab = defaultSelectTab;
    this.selectTab = selectTab;
    function init() {
        if (list == null || list["length"] == 0) { return; }
        if (opts == null) { opts = defOpts; }
        conetntCount = list["length"];
        var tabRoot = '<div id="' + rootId + '_tab_root">[content]</div>';
        var tabTitle = '<div id="[id]" class="' + rootId + '_tab_menu">[content]</div>';
        var contentRoot = '<div id="' + rootId + '_content_root">[content]</div>';
        var content = '<div id="[id]" class="' + rootId + '_tab_content"></div>';
        var titleView = "";
        var contentView = "";
        for (var i = 0; i < conetntCount; i++) {
            var item = list[i];
            titleView += tabTitle.replace("[id]", rootId + "_tabTitel_" + i).replace("[content]", item);
            contentView += content.replace("[id]", rootId + "_tabContent_" + i);
        }
        tabRoot = tabRoot.replace("[content]", titleView);
        contentRoot = contentRoot.replace("[content]", contentView);
        $("#" + rootId).html(tabRoot + contentRoot);
        setStyle();
    }
    function backTabSelect(fun) {
        selectBackFun = fun;
    }
    function backTabContentId(fun) {
        bindBackFun = fun;
    }
    function defaultSelectTab(index) {
        if (list == null || list["length"] == 0) { return; }
        if (index < 0 || index >= list["length"]) { return; }
        defTabIndex = index; // 必须在init前调用有效
    }
    function selectTab(index) {
        if (index < 0 || index >= conetntCount) { return; }
        var colorMain = opts["colorMain"];
        if (colorMain == null) { colorMain = defOpts["colorMain"]; }
        $("." + rootId + "_tab_menu").css({ "background-color": "", "color": colorMain });
        $("." + rootId + "_tab_content").css({ "display": "none" });
        var colorText = opts["colorText"];
        if (colorText == null) { colorText = defOpts["colorText"]; }
        $("#" + rootId + "_tabTitel_" + index).css({ "background-color": colorMain, "color": colorText });
        $("#" + rootId + "_tabContent_" + index).css({ "display": "block" });
        if (selectBackFun != null) {
            selectBackFun(index, rootId + "_tabContent_" + index);
        }
    }
    function setStyle() {
        var tabH = opts["tabH"];
        if (tabH == null) { tabH = defOpts["tabH"]; }
        var contentH = opts["contentH"];
        if (contentH == null) { contentH = defOpts["contentH"]; }
        var radius = opts["radius"];
        if (radius == null) { radius = defOpts["radius"]; }
        var colorMain = opts["colorMain"];
        if (colorMain == null) { colorMain = defOpts["colorMain"]; }
        var fontSize = "14px";
        if (conetntCount > 6 && conetntCount <= 8) {
            fontSize = "12px";
        } else if (conetntCount > 8) {
            fontSize = "10px";
        }
        $("#" + rootId).css({ "display": "block" });
        $("#" + rootId + "_tab_root").css({
            "width": "100%",
            "height": tabH,
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "padding-top": "8px",
            "padding-bottom": "8px",
            "padding-left": "15px",
            "padding-right": "15px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_content_root").css({
            "width": "100%",
            "height": contentH,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "center"
        });
        $("#" + rootId + "_tabTitel_0").css({
            "border-top-left-radius": radius,
            "border-bottom-left-radius": radius
        });
        $("#" + rootId + "_tabTitel_" + (conetntCount - 1)).css({
            "border-top-right-radius": radius,
            "border-bottom-right-radius": radius
        });
        $("." + rootId + "_tab_menu").css({
            "width": (100 / conetntCount) + "%",
            "height": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": fontSize,
            "color": colorMain,
            "background-color": "",
            "border": "1px solid " + colorMain
        });
        $("." + rootId + "_tab_content").css({
            "width": "100%",
            "height": "100%",
            "display": "none",
            "background-color": pageBgColor
        });
        $("." + rootId + "_tab_menu").each(function () {
            setBtnOnTouchEventNoColor($(this), function (mObj) {
                var id = mObj.id;
                var idList = id.split("_");
                var idLen = idList["length"];
                var index = idList[idLen - 1];
                selectTab(index);
            }, null);
        });
        if (bindBackFun != null) {
            var listId = new Array();
            $("." + rootId + "_tab_content").each(function () { listId.push(this.id); });
            bindBackFun(listId);
        }
        selectTab(defTabIndex);
    }
}
function getListPageInfo(jsonObj) {
    var pageInfo = new Object();
    var pages = jsonObj.result["pages"];
    var pagec = jsonObj.result["currentPage"];
    var totalRow = jsonObj.result["totalRow"];
    var pagem = jsonObj.result["pageCount"];
    if (pages != null) {
        pageInfo["pages"] = pages;
        pageInfo["currentPage"] = pagec;
        pageInfo["totalRow"] = totalRow;
        pageInfo["pageCount"] = pagem;
    } else {
        pageInfo = null;
    }
    return pageInfo;
}
function tPage(pageName, pageUrl, pageContentId, successFun, errorFun) {
    var pageObj = new Object();
    var pageId = pageName;
    var myLoadingSpinner;
    init();
    function init() {
        pageObj = $("#" + pageContentId);
        pageObj.html("");
        pageObj.append("<div id=" + pageId + "_loading style=\"padding-top:100px\"></div>");
        pageObj.append("<div id=" + pageId + "_content></div>");
        $("#" + pageId + "_content").css({ "display": "flex", "justify-content": "center", "width": "100%" });
        myLoadingSpinner = new Spinner({ color: '#FFFFFF' });
    }
    this.open = function () {
        pageShowLoading();
        setTimeout(loadPage, 500);
    }
    this.exit = function () {
    }
    function loadPage() {
        var mUrl = pageUrl + "?random=" + randomString();
        requestAjaxGet(mUrl, function (jsonObj) {
            pageUnShowLoading();
            $("#" + pageId + "_content").html(jsonObj);
            if (successFun != null) {
                successFun();
            }
        }, function (error) {
            showLoadErrorPage();
            pageUnShowLoading();
            if (errorFun != null) {
                errorFun();
            }
        });
    }
    function showLoadErrorPage() {
        $("#" + pageId + "_content").html("<div style=\"display:flex;justify-content:center;align-items: center;font-size:12px;width:100%;height:300px;color:#cccccc \">打开失败，请退出后重试！</div>");
    }
    function pageUnShowLoading() {
        myLoadingSpinner.spin();
        $("#" + pageId + "_loading").css({ "display": "none" });
    }
    function pageShowLoading() {
        $("#" + pageId + "_loading").css({ "display": "block" });
        myLoadingSpinner.spin(document.getElementById(pageId + "_loading"));
    }
}
function tSelect(objId, listParentObjId, w, h, datas, selectFun, startFun) {
    var mObj = $("#" + objId);
    var mListObj;
    var listObj;//数据
    var isShowListObj = false;
    var currentIndex = -1;

    this.setSelectValue = function (theValue) {
        var len = listObj.length;
        for (var i = 0; i < len; i++) {
            if (listObj[i].value == theValue) {
                setSelect(i, true);
                break;
            }
        }
    }
    this.unShowSelect = function () {
        unShowSelect();
    }

    mObj.html('<div style="width:10%"></div><div style="width:80%;color:#cccccc" id="' + objId + '_select_text" >最近7天</div>');
    var listTop = 0;
    var mListParentObj = $("#" + listParentObjId);
    listTop = mObj.offset().top + h + 2;
    mObj.css({
        "width": w,
        "height": h,
        "background-color": lighterBackColor,
        "font-size": "12px",
        "color": mainFontColor,
        "display": "flex",
        "justify-content": "space-between",
        "align-items": "center"
    });
    mObj.append('<div id=' + objId + '_arrow ><img src=' + themPath + 'arrow_down.png height=5px /></div><div style="width:10%"></div>');
    mListParentObj.remove("#" + objId + "_list");
    mListParentObj.append('<div id=' + objId + '_list_obj style="display:none;position:absolute;top:' + listTop + ';width:' + screenW + ';height:' + (screenH - listTop) + ';background-color:rgba(0,0,0,0.6)"></div>');
    $("#" + objId + "_list_obj").append('<div id=' + objId + '_list style="display:block;width:' + screenW + ';height:100;background-color:' + lighterBackColor + '"></div>');
    mListObj = $("#" + objId + "_list_obj");
    setBtnOnTouchEventNoColor(mObj, function () {
        if (isShowListObj) {
            unShowSelect();
        } else {
            showSelect();
        }
        if (startFun != null) {
            startFun();
        }
    }, null);
    setBtnOnTouchEventNoColor($("#" + objId + "_list_obj"), function () {
        unShowSelect();
    }, null);

    if (datas != null) {
        listObj = datas.list;
        var len = listObj.length;
        var mListObjList = $("#" + objId + "_list");
        for (var i = 0; i < len; i++) {
            mListObjList.append('<div id=' + objId + '_list_' + i + ' class=' + objId +
                '_listClass ><div style="display:flex"><div style="width:10px"></div><div>' + listObj[i].text +
                '</div></div><div style="display:flex"><img style="display:none" id=' + objId +
                '_list_img_' + i + ' src=' + themPath +
                'gou.png height=10px /><div style="width:10px"></div></div></div>');
            mListObjList.append('<div class=' + objId + '_list_split></div>');
        }
        $("." + objId + "_list_split").css({ "width": "100%", "height": "1px", "background-color": mainBackColor });
        $("." + objId + "_listClass").css({ "color": mainFontColorMore, "font-size": "12px", "display": "flex", "justify-content": "space-between", "align-items": "center", "width": "100%", "height": h });
        mListObjList.css({ "height": len * h + (len - 1) });

        $("." + objId + "_listClass").each(function () {
            setBtnOnTouchEventNoColor($(this), function (theObj) {
                var arr = theObj.id.split("_");
                var len = arr.length;
                setSelect(arr[len - 1], true);
            }, null);
        });
    }

    setSelect(0, false);

    function setSelect(selectIndex, isSelectFun) {
        if (selectIndex == currentIndex) {
        } else {
            if (currentIndex != -1) {
                $("#" + objId + "_list_" + currentIndex).css({ "color": mainFontColorMore });
                $("#" + objId + "_list_img_" + currentIndex).css({ "display": "none" });
            }

            $("#" + objId + "_list_" + selectIndex).css({ "color": mainColor });
            $("#" + objId + "_list_img_" + selectIndex).css({ "display": "block" });
            currentIndex = selectIndex;

            $("#" + objId + "_select_text").html(listObj[selectIndex].text);
        }

        if (isSelectFun) {
            if (selectFun != null) {
                selectFun(selectIndex);
            }
        }

        unShowSelect();
    }
    function showSelect() {
        isShowListObj = true;
        mListObj.css({ "display": "block" });
        $("#" + objId + "_arrow").css({ rotate: "180deg" });
    }
    function unShowSelect() {
        isShowListObj = false;
        mListObj.css({ "display": "none" });
        $("#" + objId + "_arrow").css({ rotate: "0deg" });
    }
}
function msgBox(prefix) {
    var msgBoxId = "msgBox";
    var w;
    var h;
    var mOkFun;
    var mCancelFun;
    var isClickBack = true;
    this.init = function () {
        w = $(window).width();
        h = $(window).height();
        msgBoxId = msgBoxId + prefix;
        $("#" + msgBoxId).css({
            "width": w,
            "height": h,
            "display": "block",
            "top": h,
            "z-index": zIndexMax - 4
        });
        $("#" + msgBoxId + "_background").css({
            "top": (-1) * h,
            "display": "none"
        });
        $("#" + msgBoxId + "_content_top").css({
            "background": mainColor,
            "font-size": "16px",
            "color": mainFontColor
        });
        $("#" + msgBoxId + "_content_content").css({
            "background": mainBackColor,
            "font-size": "14px",
            "color": mainFontColor
        });
        $("#" + msgBoxId + "_content_btns").css({
            "background": mainBackColor,
            "font-size": "14px",
            "color": mainFontColor
        });
        $("." + msgBoxId + "_content_btns_class").css({
            "border-radius": "20px",
            "background": mainColor,
            "font-size": "14px",
            "color": mainFontColor
        });
        setBtnOnTouchEvent($("#" + msgBoxId + "_content_top_back"), function () {
            if (mCancelFun != null) { mCancelFun(); }
            backClickFun();
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#" + msgBoxId + "_content_btns_sure"), function () {
            if (mOkFun != null) { mOkFun(); }
            backClickFun();
        }, mainColorDeep, mainColor, null);
        $("#" + msgBoxId + "_content").click(function () {
            if (isClickBack) { backClickFun(); }
        });
        $("#" + msgBoxId + "_content_btns").click(function () {
        });
        $("#" + msgBoxId + "_content_content").click(function () {
        });
        $("#" + msgBoxId + "_content_top").click(function () {
        });
        $("#" + msgBoxId + "_content_btns").on('click', function (event) {
            event.stopPropagation();
        });
        $("#" + msgBoxId + "_content_content").on('click', function (event) {
            event.stopPropagation();
        });
        $("#" + msgBoxId + "_content_top").on('click', function (event) {
            event.stopPropagation();
        });
    }
    this.show = function (mTitle, mContent, okFun, cancelFun) {
        if (isDisconnectService) { return; }
        isClickBack = true;
        addBackFunArr(function () { hideMsgBox(); });
        $("#" + msgBoxId + "_content_btns").css({ "display": "flex" });
        $("#" + msgBoxId + "_content_top_back").css({ "visibility": "visible" });
        $("#" + msgBoxId + "_content_content").css({ "height": "200px" });
        $("#" + msgBoxId + "_background").css({ "display": "block" });
        $("#" + msgBoxId + "_content").transition({ y: (-1) * h }, "fast");
        $("#" + msgBoxId + "_content_top_title").html(mTitle);
        $("#" + msgBoxId + "_content_content").html(mContent);
        mOkFun = okFun;
        mCancelFun = cancelFun;
        blurAnyone();
    }
    this.showImp = function (impObj) {
        if (isDisconnectService) { return; }
        if (impObj == null) { return; }
        var backIs = impObj["backIs"];
        if (backIs == false) { isClickBack = false; }
        else { isClickBack = true; }
        var viewFun = impObj["viewFun"];
        if (viewFun == null) { return; }
        var styleFun = impObj["styleFun"];
        if (styleFun == null) { return; }
        var title = impObj["title"];
        if (title == null) { title = "提示" }
        mOkFun = impObj["okFun"];
        mCancelFun = impObj["cancelFun"];
        addBackFunArr(function () { hideMsgBox(); });
        $("#" + msgBoxId + "_content_btns").css({ "display": "none" });
        if (isClickBack) {
            $("#" + msgBoxId + "_content_top_back").css({ "visibility": "visible" });
        } else {
            $("#" + msgBoxId + "_content_top_back").css({ "visibility": "hidden" });
        }
        $("#" + msgBoxId + "_content_content").css({ "height": "275px" });
        $("#" + msgBoxId + "_background").css({ "display": "block" });
        $("#" + msgBoxId + "_content").transition({ y: (-1) * h }, "fast");
        var views = viewFun(msgBoxId + "_content_content");
        $("#" + msgBoxId + "_content_top_title").html(title);
        $("#" + msgBoxId + "_content_content").html(views);
        styleFun(msgBoxId + "_content_content");
        blurAnyone();
    }
    this.showList = function (mTitle, msList, objName, selectIndex, clickFun, cancelFun) {
        if (isDisconnectService) { return; }
        isClickBack = true;
        addBackFunArr(function () { hideMsgBox(); });
        $("#" + msgBoxId + "_content_btns").css({ "display": "none" });
        $("#" + msgBoxId + "_content_top_back").css({ "visibility": "visible" });
        $("#" + msgBoxId + "_content_content").css({ "height": "275px" });
        $("#" + msgBoxId + "_background").css({ "display": "block" });
        $("#" + msgBoxId + "_content").transition({ y: (-1) * h }, "fast");
        $("#" + msgBoxId + "_content_top_title").html(mTitle);
        mOkFun = clickFun;
        mCancelFun = cancelFun;
        bindListView(msList, objName, selectIndex);
        blurAnyone();
    }
    this.hide = function () {
        hideMsgBox();
    }
    function bindListView(msList, objName, selectIndex) {
        var msRootDs = "<div class=\"" + msgBoxId + "_list_root_div\">%content%</div>";
        var msLineDs = "<div id=\"%idtag%\" class=\"" + msgBoxId + "_list_item_div\">%content%</div>";
        var msMs = "<div class=\"" + msgBoxId + "_list_item_name\">%content%</div>";
        var msImg = "<img style=\"width:15px;height:12px\" src=\"" + themPath + "gou.png\"/>";
        var mds = "";
        var msLen = msList.length;
        for (var i = 0; i < msLen; i++) {
            var item = msList[i];
            var id = msgBoxId + "_list_item_id_" + i;
            var ms = "";
            if (objName != null) {
                ms = item[objName];
            } else {
                ms = item;
            }
            if (selectIndex == i) {
                ms = "<font color=" + mainColor + ">" + ms + "</font>";
                mds += msLineDs
                    .replace("%content%", msMs.replace("%content%", ms) + msImg)
                    .replace("%idtag%", id);
            } else {
                ms = "<font color=#C7C7C7>" + ms + "</font>";
                mds += msLineDs
                    .replace("%content%", msMs.replace("%content%", ms))
                    .replace("%idtag%", id);
            }
        }
        $("#" + msgBoxId + "_content_content").html(msRootDs.replace("%content%", mds));
        setStyle();
        function setStyle() {
            $("." + msgBoxId + "_list_root_div").css({
                "align-items": "center",
                "text-align": "center",
                "width": "100%",
                "height": "275px",
                "overflow-x": "hidden",
                "overflow-y": "auto",
                "box-sizing": "border-box"
            });
            $("." + msgBoxId + "_list_item_div").css({
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "width": "100%",
                "height": "45px",
                "background": "#383838",
                "padding-top": "5px",
                "padding-bottom": "5px",
                "padding-left": "15px",
                "padding-right": "15px",
                "margin-bottom": "1px",
                "box-sizing": "border-box"
            });
            var nW = screenW - 30 - 16;
            $("." + msgBoxId + "_list_item_name").css({
                "text-align": "left",
                "width": nW,
                "height": "auto",
                "font-size": "14px"
            });
            $("." + msgBoxId + "_list_item_div").each(function () {
                var id = this.id;
                setBtnOnTouchEvent($(this), function () {
                    backClickFun();
                    var idList = id.split("_");
                    var iLen = idList.length;
                    var index = idList[iLen - 1];
                    if (mOkFun != null) {
                        mOkFun(index);
                    }
                }, "#1C1C1C", "#383838", null);
            });
        }
    }
    function hideMsgBox() {
        $("#" + msgBoxId + "_content").transition({
            y: 0
        }, "slow", unShowBg);
        function unShowBg() {
            $("#" + msgBoxId + "_background").css({ "display": "none" });
        }
    }
}
function toast() {
    this.init = function () {
        $("#toast").css({
            "z-index": zIndexMax - 2
        });
        setBtnOnTouchEventNoColor($("#toast_content"), function () {
            backClickFun();
        }, null);
    }
    this.show = function (msg, lineNum, position) {
        if (isDisconnectService) { return; }
        addBackFunArr(function () {
            hideToast();
        });
        var toastH = 25;
        if (lineNum != null) {
            toastH = toastH * lineNum + 10;
        }
        var positionValue = 4;
        if (position != null) {
            if (position == "middle") {
                positionValue = 2;
            }
        }
        var boxTop = (screenH - toastH) / positionValue;
        $("#toast").css({
            "display": "block"
        });
        $("#toast_content_msgbox").css({
            "display": "flex",
            "margin-top": boxTop,
            "height": toastH,
            "line-height": "150%"
        });
        $("#toast_content_msgbox").html(msg);
    }
    function hideToast() {
        $("#toast").css({
            "display": "none"
        });
    }
}
function loader() {
    var spinner;
    var tag;
    this.init = function () {
        spinner = new Spinner({ "color": "#FFFFFF" });
        $("#loadingDiv").css({
            "z-index": zIndexMax - 3,
            "display": "none"
        });
    }
    this.show = function (indexTag) {
        if (isDisconnectService) { return; }
        if (indexTag != null) {
            tag = indexTag;
        }
        isLoaderShow = true;
        blurAnyone();
        focusHiddenBox();
        $("#loadingDiv").css({ "display": "block" });
        spinner.spin(o('loadingView'));
    }
    this.unShow = function (indexTag) {
        if (!isLoaderShow) {
            return;
        }
        if (indexTag != null) {
            if (tag == indexTag) {
                unShowLoad();
                tag = null;
            } else if (tag == null) {
                unShowLoad();
            }
        } else {
            if (tag == null) {
                unShowLoad();
            }
        }
    }
    function unShowLoad() {
        isLoaderShow = false;
        blurAnyone();
        focusHiddenBox();
        spinner.spin();
        $("#loadingDiv").css({ "display": "none" });
    }
}
function popBox() {
    var lockTouchObj;
    var inputObj;
    var bulletinObj;
    var popwindwObj;
    var isAddBack = false;
    var isNotBack = false;
    var bindOKBackFun = null;
    var closeBackFun = null;
    var isBindOk = false;
    var competeList = new Array(); // 竞争队列
    this.init = function () {
        $("#indexPopupwindowBox").css({ "display": "none" });
        $("#indexPopupwindowBox_mask").css({
            "position": "fixed",
            "left": 0,
            "right": 0,
            "top": 0,
            "bottom": 0,
            "z-index": zIndexMax - 1,
            "opacity": 0.3,
            "background-color": "#000"
        });
        $("#indexPopupwindowBox_content").css({
            "position": "fixed",
            "left": "50%",
            "top": "100%",
            "transform": "translate(-50%,-100%)",
            "z-index": zIndexMax
        });
        $("#indexPopupwindowBox").click(function () {
            close();
        });
        $("#indexPopupwindowBox_content").on('click', function (event) {
            event.stopPropagation();
        });
    }
    this.show = function (index, tagObj, agn, tmd) {
        if (isDisconnectService) { return; }
        if (isBindOk && tagObj != null && tagObj["addCompete"]) {
            addCompeteList(index, tagObj, agn, tmd);
            return;
        }
        clearStyle();
        align(agn);
        setTransparent(tmd);
        if (tagObj != null) {
            var b = tagObj["isNotBack"];
            if (b != null && b == true) {
                isNotBack = true;
            } else {
                isNotBack = false;
            }
        } else {
            isNotBack = false;
        }
        switch (index) {
            case 1:
                showLockTouch("verifyPwd", tagObj);
                break;
            case 2:
                showInput("number", tagObj);
                break;
            case 3:
                showInput("eng", tagObj);
                break;
            case 4:
                showLockTouch("setPwd", tagObj);
                break;
            case 5:
                showIndexBulletin(tagObj);
                break;
            case 6:
                showPopWindow(tagObj);
                break;
            default: break;
        }
        function showLockTouch(type, obj) {
            if (lockTouchObj == null) {
                lockTouchObj = new touchLock("indexPopupwindowBox");
            }
            lockTouchObj.show(type, obj);
        }
        function showInput(type, obj) {
            if (inputObj == null) {
                inputObj = new InputObj("indexPopupwindowBox");
            }
            var isHighlight = obj["InputHighlightIs"]; if (isHighlight == null) { isHighlight = true; }
            if (isHighlight) {
                setBindOKBack(function () {
                    iobj = obj["inputObj"];
                    iobj.css({ "border": "1px solid " + mainColor });
                });
                setCloseBack(function () {
                    iobj = obj["inputObj"];
                    iobj.css({ "border": "0px" });
                });
            }
            setTransparent(0.2);
            inputObj.show(type, obj);
        }
        function showIndexBulletin(obj) {
            if (bulletinObj == null) {
                bulletinObj = new IndexBulletin("indexPopupwindowBox");
            }
            bulletinObj.show(obj);
        }
        function showPopWindow(obj) {
            if (popwindwObj == null) {
                popwindwObj = new popupWindow("indexPopupwindowBox");
            }
            popwindwObj.show(obj);
        }
    }
    this.align = align;
    this.setTransparent = setTransparent;
    this.bindOK = bindOK;
    this.close = close;
    this.setBindOKBack = setBindOKBack;
    this.setCloseBack = setCloseBack;
    function align(agn) {
        if (agn == null) {
            $("#indexPopupwindowBox_content").css({
                "left": "50%",
                "top": "100%",
                "transform": "translate(-50%,-100%)"
            });
            return;
        }
        console.log("popBox align :" + agn);
        switch (agn) {
            case "center":
                $("#indexPopupwindowBox_content").css({
                    "left": "50%",
                    "top": "50%",
                    "transform": "translate(-50%,-50%)"
                });
                break;
            case "bottom":
                $("#indexPopupwindowBox_content").css({
                    "left": "50%",
                    "top": "100%",
                    "transform": "translate(-50%,-100%)"
                });
                break;
            case "top":
                $("#indexPopupwindowBox_content").css({
                    "left": "50%",
                    "top": "0",
                    "transform": "translate(-50%,0)"
                });
                break;
            case "none":
                $("#indexPopupwindowBox_content").css({
                    "left": "0",
                    "top": "0",
                    "transform": ""
                });
                break;
            default: break;
        }
    }
    function setTransparent(tmd) {
        if (tmd == null || isNaN(tmd)) { tmd = 0.3; }
        $("#indexPopupwindowBox_mask").css({ "opacity": tmd, "background-color": "#000" });
    }
    function bindOK(isfadeIn) {
        if (isfadeIn) {
            $("#indexPopupwindowBox").fadeIn(500);
        } else {
            $("#indexPopupwindowBox").css({ "display": "block" });
        }
        if (!isNotBack) {
            addBackFunArr(function () {
                if (isfadeIn) {
                    $("#indexPopupwindowBox").fadeOut(500);
                } else {
                    $("#indexPopupwindowBox").css({ "display": "none" });
                }
            });
            isAddBack = true;
        }
        if (bindOKBackFun != null) {
            bindOKBackFun();
            bindOKBackFun = null;
        }
        isBindOk = true;
    }
    function close(isfadeOut) {
        if (isAddBack) {
            backClickFun();
            isAddBack = false;
        } else if (isNotBack) {
            isNotBack = false;
            if (isfadeOut) {
                $("#indexPopupwindowBox").fadeOut(500);
            } else {
                $("#indexPopupwindowBox").css({ "display": "none" });
            }
        }
        clearStyle();
        if (closeBackFun != null) {
            closeBackFun();
            closeBackFun = null;
        }
        nextCompete();
    }
    function clearStyle() {
        $("#indexPopupwindowBox_content").html("");
        $("#indexPopupwindowBox_content").css({
            "width": "",
            "height": "",
            "display": "",
            "justify-content": "",
            "align-items": "",
            "background": ""
        });
    }
    function setBindOKBack(back) {
        bindOKBackFun = back;
    }
    function setCloseBack(back) {
        closeBackFun = back;
    }
    function addCompeteList(index, tagObj, agn, tmd) {
        var obj = new Object();
        obj["index"] = index;
        obj["tagObj"] = tagObj;
        obj["agn"] = agn;
        obj["tmd"] = tmd;
        competeList.push(obj);
    }
    function nextCompete() {
        if (competeList.length == 0) {
            isBindOk = false;
            return;
        }
        var obj = competeList[0];
        competeList.splice(0, 1);
        setTimeout(function () {
            isBindOk = false;
            mIndexPopWindowObj.show(obj["index"], obj["tagObj"], obj["agn"], obj["tmd"]);
        }, 500);
    }
}
function InputObj(id) {
    var layoutId = id;
    var powContentObj = $("#" + layoutId + "_content");
    var iobj;
    var type = "number";
    var symbolList = [".", "/", "-", "+", ":", ";", "?", "!", "@", "#", "$", "%", "^", "*", "(", ")"];
    powContentObj.css({
        "width": "auto",
        "height": "auto",
        "background": pageBgColor
    });

    this.show = function (te, obj) {
        type = te;
        switch (type) {
            case "number":
                iobj = obj["inputObj"];
                bindNumberInputView(obj);
                break;
            case "eng":
                iobj = obj["inputObj"];
                bindEnglishInputView(obj);
                break;
            default: break;
        }
    }

    function bindNumberInputView(obj) {
        var enterFun = obj["enterFun"];
        var maxLen = obj["maxLen"];
        var showIs = obj["showIs"]; if (showIs == null) { showIs = true; }
        var danIs = obj["danIs"]; if (danIs == null) { danIs = true; }
        var isFunds = obj["isFunds"]; if (isFunds == null) { isFunds = false; }
        if (!isFunds) {
            danIs = false;
        }
        var floatLimit = obj["FloatLimit"];
        if (maxLen == null || Number(maxLen) <= 0 || Number(maxLen) > 16) {
            maxLen = 16;
        } else {
            maxLen = Number(maxLen);
        }
        var show = "<div id=\"" + layoutId + "_show\">[content]</div>";
        if (isFunds) {
            show = show.replace("[content]", "0");
        } else {
            show = show.replace("[content]", "");
        }
        var op = "<div id=\"" + layoutId + "_op\">%content%</div>";
        var column = "<div class=\"" + layoutId + "_column\">%content%</div>";
        var number = "<div id=\"" + layoutId + "_%idtag%\" class=\"" + layoutId + "_number\">%content%</div>";
        var close = "<div id=\"" + layoutId + "_close\" class=\"" + layoutId + "_close\">清空</div>";
        var clean = "<div id=\"" + layoutId + "_delete\" class=\"" + layoutId + "_number\"><img height=16px src=\"" + themPath + "inputBackspace.png\"/></div>";
        var ok = "<div id=\"" + layoutId + "_ok\" class=\"" + layoutId + "_number\"><img height=16px src=\"" + themPath + "inputEnter.png\"/></div>";
        var line = "<div style=\"width:" + (screenW / 5) + ";height:1px;background-color: " + inputLineColor + "\"></div>";
        var col = "<div style=\"width:1px;height:242px;background-color: " + inputLineColor + "\"></div>";
        var lineMax = "<div style=\"width:100%;height:1px;background-color: " + inputLineColor + "\"></div>";
        var i0, i1, i2, i3, i4, i5, i6, i7, i8, i9, iD;
        var c1, c2, c3, c4, c5;
        i0 = number.replace("%idtag%", "i0").replace("%content%", "0");
        i1 = number.replace("%idtag%", "i1").replace("%content%", "1");
        i2 = number.replace("%idtag%", "i2").replace("%content%", "2");
        i3 = number.replace("%idtag%", "i3").replace("%content%", "3");
        i4 = number.replace("%idtag%", "i4").replace("%content%", "4");
        i5 = number.replace("%idtag%", "i5").replace("%content%", "5");
        i6 = number.replace("%idtag%", "i6").replace("%content%", "6");
        i7 = number.replace("%idtag%", "i7").replace("%content%", "7");
        i8 = number.replace("%idtag%", "i8").replace("%content%", "8");
        i9 = number.replace("%idtag%", "i9").replace("%content%", "9");
        iD = number.replace("%idtag%", "iD").replace("%content%", ".");
        c1 = column.replace("%content%", close + line + iD);
        c2 = column.replace("%content%", i1 + line + i4 + line + i7);
        c3 = column.replace("%content%", i2 + line + i5 + line + i8);
        c4 = column.replace("%content%", i3 + line + i6 + line + i9);
        c5 = column.replace("%content%", clean + line + i0 + line + ok);
        op = op.replace("%content%", c1 + col + c2 + col + c3 + col + c4 + col + c5);
        if (showIs) {
            powContentObj.html(show + lineMax + op);
        } else {
            powContentObj.html(op);
        }
        setStyle();
        function setStyle() {
            var showObj = $("#" + layoutId + "_show");
            if (!showIs) {
                showObj = null;
            }
            $("#" + layoutId + "_op").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": "auto"
            });
            if (showObj != null) {
                showObj.css({
                    "display": "flex",
                    "justify-content": "flex-end",
                    "align-items": "center",
                    "width": "100%",
                    "height": "65px",
                    "background": inputBgColor,
                    "font-weight": "bold",
                    "font-size": "35px",
                    "padding-top": "10px",
                    "padding-bottom": "10px",
                    "padding-left": "15px",
                    "padding-right": "15px",
                    "color": "white",
                    "box-sizing": "border-box"
                });
            }
            $("." + layoutId + "_column").css({
                "text-align": "center",
                "width": (screenW / 5),
                "height": "auto"
            });
            $("." + layoutId + "_number").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": (screenW / 5),
                "height": "80px",
                "background": inputBgColor,
                "color": inputFontColor,
                "font-weight": "bold",
                "font-size": "22px"
            });
            $("." + layoutId + "_close").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": (screenW / 5),
                "height": "161px",
                "background": inputBgColor,
                "color": inputSubFontColor,
                "font-size": "16px"
            });
            $("." + layoutId + "_number").each(function () {
                if ((this.id == layoutId + "_iD") && !danIs) {
                    $("#" + layoutId + "_iD").css({
                        "color": mainFontColorDeep
                    });
                    return;
                }
                setBtnOnTouchEvent($(this), function (mObj) {
                    var id = mObj.id;
                    var idList = id.split("_");
                    var idLen = idList.length;
                    var idIndex = idList[idLen - 1];
                    switch (idIndex) {
                        case "delete":
                            delInput();
                            break;
                        case "ok":
                            enter();
                            break;
                        case "i0":
                            pushInput("0");
                            break;
                        case "i1":
                            pushInput("1");
                            break;
                        case "i2":
                            pushInput("2");
                            break;
                        case "i3":
                            pushInput("3");
                            break;
                        case "i4":
                            pushInput("4");
                            break;
                        case "i5":
                            pushInput("5");
                            break;
                        case "i6":
                            pushInput("6");
                            break;
                        case "i7":
                            pushInput("7");
                            break;
                        case "i8":
                            pushInput("8");
                            break;
                        case "i9":
                            pushInput("9");
                            break;
                        case "iD":
                            if (danIs) {
                                pushInput(".");
                            }
                            break;
                        default: break;
                    }
                }, inputTouchColor, inputBgColor, null);
            });
            $("." + layoutId + "_close").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    clean();
                }, inputTouchColor, inputBgColor, null);
            });
            show();
            function show() {
                var vue = iobj.val();
                if (vue.length != 0 && showObj != null) {
                    showObj.html(vue);
                }
                mIndexPopWindowObj.bindOK();
            }
            function delInput() {
                var vue = iobj.val();
                if (vue.length > 0) {
                    vue = vue.substr(0, vue.length - 1);
                    if (isFunds && vue == "0") {
                        iobj.val("");
                    } else {
                        iobj.val(vue);
                    }
                }
                iobj.change();
                if (showObj == null) { return; }
                var vueT = showObj.html();
                if (vueT.length > 0) {
                    showObj.html(vueT.substr(0, vueT.length - 1));
                    var vueTb = showObj.html();
                    if (isFunds && vueTb.length == 0) {
                        showObj.html("0");
                    }
                }
            }
            function pushInput(ms) {
                var vue = iobj.val();
                if (vue.length >= maxLen) {
                    return;
                }
                if (ms == "0" && isFunds) {
                    var outLimit = false;
                    if (vue.length > 0) {
                        if (floatLimit == null || isNaN(floatLimit)) {
                            iobj.val(vue + ms);
                        } else {
                            var vList = vue.split(".");
                            var vLen = vList.length;
                            if (vLen != 2 || vList[1].length < Number(floatLimit)) {
                                iobj.val(vue + ms);
                            } else {
                                outLimit = true;
                            }
                        }
                        iobj.change();
                    }
                    if (showObj == null) { return; }
                    var vueT = showObj.html();
                    if (vueT != "0" && !outLimit) { showObj.html(vueT + ms); }
                } else if (ms == ".") {
                    if (vue.indexOf(".") == -1) {
                        if (vue.length == 0) {
                            iobj.val("0.");
                        } else {
                            iobj.val(vue + ".");
                        }
                        iobj.change();
                    }
                    if (showObj == null) { return; }
                    var vueT = showObj.html();
                    if (vueT.indexOf(".") == -1) { showObj.html(vueT + "."); }
                } else {
                    var outLimit = false;
                    if (floatLimit == null || isNaN(floatLimit)) {
                        iobj.val(vue + ms);
                    } else {
                        var vList = vue.split(".");
                        var vLen = vList.length;
                        if (vLen != 2 || vList[1].length < Number(floatLimit)) {
                            iobj.val(vue + ms);
                        } else {
                            outLimit = true;
                        }
                    }
                    iobj.change();
                    if (showObj == null) { return; }
                    var vueT = showObj.html();
                    if (isFunds && vueT == "0") {
                        showObj.html(ms);
                    } else if (!outLimit) {
                        showObj.html(vueT + ms);
                    }
                }
            }
            function enter() {
                if (isFunds) {
                    var vue = iobj.val();
                    var end = vue.substr(vue.length - 1, 1);
                    if (end == ".") {
                        vue = vue.substr(0, vue.length - 1);
                    }
                    vue = Number(vue);
                    if (vue == 0) {
                        iobj.val("");
                    } else {
                        iobj.val(vue);
                    }
                }
                mIndexPopWindowObj.close();
                if (enterFun != null) {
                    enterFun();
                }
            }
            function clean() {
                iobj.val("");
                iobj.change();
                if (showObj == null) {
                    return;
                }
                if (isFunds) {
                    showObj.html("0");
                } else {
                    showObj.html("");
                }
            }
        }
    }

    function bindEnglishInputView(obj) {
        var enterFun = obj["enterFun"]; // 回车回调
        var showIs = obj["showIs"]; // 是否显示展示板
        var numberIs = obj["numberIs"]; // 是否可输入数字
        var symbolIs = obj["symbolIs"]; // 是否可输入符号
        var sList = obj["symbolList"]; // 自定义符号集
        var maxLen = obj["maxLen"]; // 最大输入长度
        var passIs = obj["passIs"]; // 是否以密码展示;在隐藏展示板时该属性无效
        var midW = (screenW - 9) / 10;
        var minW = midW / 2;
        var maxW = midW + minW + 1;
        var showW = screenW;
        var lineH = 43;
        if (sList != null && sList.length > 0) {
            for (var i = 0; i < sList.length; i++) {
                if (i < symbolList.length) {
                    symbolList[i] = sList[i];
                }
            }
        }
        if (maxLen == null || Number(maxLen) <= 0 || Number(maxLen) > 24) {
            maxLen = 24;
        } else {
            maxLen = Number(maxLen);
        }
        if (passIs == null) {
            passIs = false;
        }
        // 界面bind
        var showRoot = "<div id=\"" + layoutId + "_show_root\">[content]</div>";
        var passOpenClose = "<div id=\"" + layoutId + "_passOpenClose\"><Img id=\"" + layoutId + "_passOpenCloseImg\" src=\"" + themPath + "m_eye_open.png\" style=\"width:18px\" /></div>";
        var show = "<div id=\"" + layoutId + "_show\"></div>";
        var max = "<div id=\"[idTag]\" class=\"" + layoutId + "_max_root_view\">[content]</div>";
        var mid = "<div id=\"[idTag]\" class=\"" + layoutId + "_mid_root_view\">[content]</div>";
        var min = "<div class=\"" + layoutId + "_min_root_view\"></div>";
        var line = "<div class=\"" + layoutId + "_line_root_view\">[content]</div>";
        var closeTx = max.replace("[content]", "清空").replace("[idTag]", layoutId + "_max_clsoeTx");
        var delImg = max.replace("[content]", "<Img src=\"" + themPath + "inputBackspace.png\"  style=\"width:20px\" />").replace("[idTag]", layoutId + "_max_delImg");
        var shImg = max.replace("[content]", "<Img src=\"" + themPath + "inputShift.png\"  style=\"width:18px\" />").replace("[idTag]", layoutId + "_max_shImg");
        var enterImg = max.replace("[content]", "<Img src=\"" + themPath + "inputEnter.png\"  style=\"width:18px\" />").replace("[idTag]", layoutId + "_max_enterImg");
        var dianFH = mid.replace("[content]", symbolList[0]).replace("[idTag]", layoutId + "_mid_dianFH");
        var xieganFH = mid.replace("[content]", symbolList[1]).replace("[idTag]", layoutId + "_mid_xieganFH");
        var dganFH = mid.replace("[content]", symbolList[2]).replace("[idTag]", layoutId + "_mid_dganFH");
        var cganFH = mid.replace("[content]", symbolList[3]).replace("[idTag]", layoutId + "_mid_cganFH");
        var maohaoFH = mid.replace("[content]", symbolList[4]).replace("[idTag]", layoutId + "_mid_maohaoFH");
        var fenhaoFH = mid.replace("[content]", symbolList[5]).replace("[idTag]", layoutId + "_mid_fenhaoFH");
        var wenhaoFH = mid.replace("[content]", symbolList[6]).replace("[idTag]", layoutId + "_mid_wenhaoFH");
        var gantanFH = mid.replace("[content]", symbolList[7]).replace("[idTag]", layoutId + "_mid_gantanFH");
        var ateFH = mid.replace("[content]", symbolList[8]).replace("[idTag]", layoutId + "_mid_ateFH");
        var jinFH = mid.replace("[content]", symbolList[9]).replace("[idTag]", layoutId + "_mid_jinFH");
        var meiyuanFH = mid.replace("[content]", symbolList[10]).replace("[idTag]", layoutId + "_mid_meiyuanFH");
        var baifenFH = mid.replace("[content]", symbolList[11]).replace("[idTag]", layoutId + "_mid_baifenFH");
        var qieFH = mid.replace("[content]", symbolList[12]).replace("[idTag]", layoutId + "_mid_qieFH");
        var xingFH = mid.replace("[content]", symbolList[13]).replace("[idTag]", layoutId + "_mid_xingFH");
        var zuokuoFH = mid.replace("[content]", symbolList[14]).replace("[idTag]", layoutId + "_mid_zuokuoFH");
        var youkuoFH = mid.replace("[content]", symbolList[15]).replace("[idTag]", layoutId + "_mid_youkuoFH");
        var sz1 = mid.replace("[content]", "1").replace("[idTag]", layoutId + "_mid_sz1");
        var sz2 = mid.replace("[content]", "2").replace("[idTag]", layoutId + "_mid_sz2");
        var sz3 = mid.replace("[content]", "3").replace("[idTag]", layoutId + "_mid_sz3");
        var sz4 = mid.replace("[content]", "4").replace("[idTag]", layoutId + "_mid_sz4");
        var sz5 = mid.replace("[content]", "5").replace("[idTag]", layoutId + "_mid_sz5");
        var sz6 = mid.replace("[content]", "6").replace("[idTag]", layoutId + "_mid_sz6");
        var sz7 = mid.replace("[content]", "7").replace("[idTag]", layoutId + "_mid_sz7");
        var sz8 = mid.replace("[content]", "8").replace("[idTag]", layoutId + "_mid_sz8");
        var sz9 = mid.replace("[content]", "9").replace("[idTag]", layoutId + "_mid_sz9");
        var sz0 = mid.replace("[content]", "0").replace("[idTag]", layoutId + "_mid_sz0");
        var zmQ = mid.replace("[content]", "q").replace("[idTag]", layoutId + "_mid_zmQ");
        var zmW = mid.replace("[content]", "w").replace("[idTag]", layoutId + "_mid_zmW");
        var zmE = mid.replace("[content]", "e").replace("[idTag]", layoutId + "_mid_zmE");
        var zmR = mid.replace("[content]", "r").replace("[idTag]", layoutId + "_mid_zmR");
        var zmT = mid.replace("[content]", "t").replace("[idTag]", layoutId + "_mid_zmT");
        var zmY = mid.replace("[content]", "y").replace("[idTag]", layoutId + "_mid_zmY");
        var zmU = mid.replace("[content]", "u").replace("[idTag]", layoutId + "_mid_zmU");
        var zmI = mid.replace("[content]", "i").replace("[idTag]", layoutId + "_mid_zmI");
        var zmO = mid.replace("[content]", "o").replace("[idTag]", layoutId + "_mid_zmO");
        var zmP = mid.replace("[content]", "p").replace("[idTag]", layoutId + "_mid_zmP");
        var zmA = mid.replace("[content]", "a").replace("[idTag]", layoutId + "_mid_zmA");
        var zmS = mid.replace("[content]", "s").replace("[idTag]", layoutId + "_mid_zmS");
        var zmD = mid.replace("[content]", "d").replace("[idTag]", layoutId + "_mid_zmD");
        var zmF = mid.replace("[content]", "f").replace("[idTag]", layoutId + "_mid_zmF");
        var zmG = mid.replace("[content]", "g").replace("[idTag]", layoutId + "_mid_zmG");
        var zmH = mid.replace("[content]", "h").replace("[idTag]", layoutId + "_mid_zmH");
        var zmJ = mid.replace("[content]", "j").replace("[idTag]", layoutId + "_mid_zmJ");
        var zmK = mid.replace("[content]", "k").replace("[idTag]", layoutId + "_mid_zmK");
        var zmL = mid.replace("[content]", "l").replace("[idTag]", layoutId + "_mid_zmL");
        var zmZ = mid.replace("[content]", "z").replace("[idTag]", layoutId + "_mid_zmZ");
        var zmX = mid.replace("[content]", "x").replace("[idTag]", layoutId + "_mid_zmX");
        var zmC = mid.replace("[content]", "c").replace("[idTag]", layoutId + "_mid_zmC");
        var zmV = mid.replace("[content]", "v").replace("[idTag]", layoutId + "_mid_zmV");
        var zmB = mid.replace("[content]", "b").replace("[idTag]", layoutId + "_mid_zmB");
        var zmN = mid.replace("[content]", "n").replace("[idTag]", layoutId + "_mid_zmN");
        var zmM = mid.replace("[content]", "m").replace("[idTag]", layoutId + "_mid_zmM");
        var hanFG = "<div style=\"width:100%;height:1px;background-color:" + inputLineColor + "\"></div>";
        var lieFG = "<div style=\"width:1px;height:" + lineH + ";background-color:" + inputLineColor + "\"></div>";

        var l1 = line.replace("[content]", closeTx + lieFG + dianFH + lieFG + xieganFH + lieFG + dganFH + lieFG + cganFH + lieFG + maohaoFH + lieFG + fenhaoFH + lieFG + wenhaoFH + lieFG + delImg);
        var l2 = line.replace("[content]", min + lieFG + gantanFH + lieFG + ateFH + lieFG + jinFH + lieFG + meiyuanFH + lieFG + baifenFH + lieFG + qieFH + lieFG + xingFH + lieFG + zuokuoFH + lieFG + youkuoFH + lieFG + min);
        var l3 = line.replace("[content]", sz1 + lieFG + sz2 + lieFG + sz3 + lieFG + sz4 + lieFG + sz5 + lieFG + sz6 + lieFG + sz7 + lieFG + sz8 + lieFG + sz9 + lieFG + sz0);
        var l4 = line.replace("[content]", zmQ + lieFG + zmW + lieFG + zmE + lieFG + zmR + lieFG + zmT + lieFG + zmY + lieFG + zmU + lieFG + zmI + lieFG + zmO + lieFG + zmP);
        var l5 = line.replace("[content]", min + lieFG + zmA + lieFG + zmS + lieFG + zmD + lieFG + zmF + lieFG + zmG + lieFG + zmH + lieFG + zmJ + lieFG + zmK + lieFG + zmL + lieFG + min);
        var l6 = line.replace("[content]", shImg + lieFG + zmZ + lieFG + zmX + lieFG + zmC + lieFG + zmV + lieFG + zmB + lieFG + zmN + lieFG + zmM + lieFG + enterImg);
        if (showIs) {
            if (passIs) {
                showRoot = showRoot.replace("[content]", passOpenClose + lieFG + show);
            } else {
                showRoot = showRoot.replace("[content]", show);
            }
            powContentObj.html(showRoot + hanFG + l1 + hanFG + l2 + hanFG + l3 + hanFG + l4 + hanFG + l5 + hanFG + l6);
        } else {
            powContentObj.html(l1 + hanFG + l2 + hanFG + l3 + hanFG + l4 + hanFG + l5 + hanFG + l6);
        }
        setStyle();
        function setStyle() {
            var passNumber = iobj.val(); // 保存密码
            if (passIs) {
                showW = showW - maxW - 1;
            }
            $("#" + layoutId + "_show_root").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": lineH
            });
            $("#" + layoutId + "_passOpenClose").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": maxW - 1,
                "height": lineH,
                "background": inputBgColor
            });
            var showObj = $("#" + layoutId + "_show"); if (!showIs) { showObj = null; }
            if (showObj != null) {
                showObj.css({
                    "display": "flex",
                    "justify-content": "flex-end",
                    "align-items": "center",
                    "width": showW,
                    "height": lineH,
                    "background": inputBgColor,
                    "font-weight": "bold",
                    "font-size": "20px",
                    "padding-top": "10px",
                    "padding-bottom": "10px",
                    "padding-left": "15px",
                    "padding-right": "15px",
                    "color": "white",
                    "box-sizing": "border-box"
                });
            }
            $("." + layoutId + "_line_root_view").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": lineH
            });
            $("." + layoutId + "_max_root_view").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": maxW,
                "height": lineH,
                "background": inputBgColor,
                "font-size": "16px",
                "color": subColor,
                "box-sizing": "border-box"
            });
            $("." + layoutId + "_mid_root_view").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": midW,
                "height": lineH,
                "background": inputBgColor,
                "font-size": "20px",
                "color": "white",
                "box-sizing": "border-box"
            });
            $("." + layoutId + "_min_root_view").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": minW,
                "height": lineH,
                "background": inputBgColor
            });
            $("." + layoutId + "_mid_root_view").each(function () {
                var id = this.id;
                var idList = id.split("_");
                var idLen = idList.length;
                var idIndex = idList[idLen - 1];
                if (idIndex.indexOf("FH") >= 0) {
                    if (!symbolIs) {
                        $("#" + id).css({ "color": mainFontColorDeep });
                        return;
                    }
                } else if (idIndex.indexOf("sz") >= 0) {
                    if (!numberIs) {
                        $("#" + id).css({ "color": mainFontColorDeep });
                        return;
                    }
                }
                setBtnOnTouchEvent($(this), function (mObj) {
                    pushInput($("#" + mObj.id).html());
                }, inputTouchColor, inputBgColor, null);
            });
            $("." + layoutId + "_max_root_view").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var id = mObj.id;
                    var idList = id.split("_");
                    var dex = idList[idList.length - 1];
                    switch (dex) {
                        case "clsoeTx":
                            clean();
                            break;
                        case "delImg":
                            delInput();
                            break;
                        case "shImg":
                            capsEng();
                            break;
                        case "enterImg":
                            enter();
                            break;
                    }
                }, inputTouchColor, inputBgColor, null);
            });
            setBtnOnTouchEvent($("#" + layoutId + "_passOpenClose"), function (mObj) {
                if (showObj == null) {
                    return;
                }
                var imgObj = $("#" + layoutId + "_passOpenCloseImg");
                var src = imgObj.attr("src");
                if (src.indexOf("m_eye_open.png") >= 0) {
                    showObj.html(passNumber);
                    imgObj.attr("src", themPath + "m_eye_close.png");
                } else {
                    var ms = "";
                    for (var i = 0; i < passNumber.length; i++) {
                        ms += "*";
                    }
                    showObj.html(ms);
                    imgObj.attr("src", themPath + "m_eye_open.png");
                }
            }, inputTouchColor, inputBgColor, null);
            show();
            function show() {
                // 显示输入法
                mIndexPopWindowObj.bindOK();
                if (showObj == null) {
                    return;
                }
                var vue = iobj.val();
                if (vue.length != 0) {
                    if (passIs) {
                        var ms = "";
                        for (var i = 0; i < vue.length; i++) {
                            ms += "*";
                        }
                        showObj.html(ms);
                    } else {
                        showObj.html(vue);
                    }
                }
            }
            function pushInput(ms) {
                var vue = iobj.val();
                if (vue.length >= maxLen) {
                    return;
                }
                iobj.val(vue + ms);
                iobj.change();
                if (showObj == null) {
                    return;
                }
                if (passIs) {
                    passNumber += ms;
                    var imgObj = $("#" + layoutId + "_passOpenCloseImg");
                    var src = imgObj.attr("src");
                    if (src.indexOf("m_eye_open.png") >= 0) {
                        showObj.html(showObj.html() + "*");
                    } else {
                        showObj.html(showObj.html() + ms);
                    }
                } else {
                    showObj.html(showObj.html() + ms);
                }
            }
            function delInput() {
                var vue = iobj.val();
                if (vue.length > 0) {
                    vue = vue.substr(0, vue.length - 1);
                    iobj.val(vue);
                }
                iobj.change();
                if (showObj == null) {
                    return;
                }
                var vueT = showObj.html();
                if (vueT.length > 0) {
                    showObj.html(vueT.substr(0, vueT.length - 1));
                    passNumber = passNumber.substr(0, passNumber.length - 1);
                }
            }
            function capsEng() {
                $("." + layoutId + "_mid_root_view").each(function () {
                    var id = this.id;
                    var idList = id.split("_");
                    var idLen = idList.length;
                    var idIndex = idList[idLen - 1];
                    if (idIndex.indexOf("zm") >= 0) {
                        var zmObj = $("#" + id);
                        var zm = zmObj.html();
                        var zmMax = zm.toUpperCase();
                        if (zm == zmMax) {
                            zm = zm.toLowerCase();
                        } else {
                            zm = zm.toUpperCase();
                        }
                        zmObj.html(zm);
                    }
                });
            }
            function clean() {
                iobj.val("");
                iobj.change();
                if (showObj == null) {
                    return;
                }
                showObj.html("");
                passNumber = "";
            }
            function enter() {
                mIndexPopWindowObj.close();
                if (enterFun != null) {
                    enterFun();
                }
            }
        }
    }
}
function touchLock(id) {
    var layoutId = id;
    var powContentObj = $("#" + layoutId + "_content");
    var type = "setPwd";
    var tagObj = { "r": 25, "nR": 25 / 2, "wColr": pageBgColor, "nColor": "#ffffff", "touchColor": mainColor, "lineColor": mainColor, "backCallFun": null, "SwitchAccountFun": null };
    var canvasObj;
    var canvasWidth = screenW;
    var canvasHeight = 350;
    var canvasOffsetTop = 0;
    var offsetX = 50;
    var offsetY = 30;
    var r = 25;
    var nR = r / 2;
    var wColor = pageBgColor;
    var nColor = "#ffffff";
    var touchColor = "#7fffd4";
    var lineColor = "#7fffd4";
    var backCallFun = null;
    var PointsLocation = [];
    var hiddenLine = false;
    var isTwiceInput = false; // 是否第二次输入
    var tempLinePoint = []; // 记录首次绘制的密码
    var titleTopList = ["设置手势密码", "验证手势密码"];
    var titleBottomList = ["您需要连接至少5个点", "请重复一次输入的手势密码", "重复手势密码错误,请重新输入!", "手势密码太短,至少需要5个点", "密码设置成功"];
    this.show = function (te, obj) {
        backCallFun = null;
        tagObj = new Object();
        if (obj != null) {
            tagObj = obj;
        }
        if (te != null) {
            type = te;
        }
        if (type != "setPwd") {
            var password = window.localStorage ? localStorage.getItem("touchLockPassword") : Cookie.read("touchLockPassword");
            if (password == null) {
                return;
            }
        }
        powContentObj.css({
            "width": "100%",
            "height": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "background": pageBgColor
        });
        resetChange();
        bind();
        mIndexPopWindowObj.bindOK();
    }
    function bind() {
        var rTag = tagObj["r"]; if (rTag != null) { r = rTag }
        var nRTag = tagObj["nR"]; if (nRTag != null) { nR = nRTag }
        var wColorTag = tagObj["wColor"]; if (wColorTag != null) { wColor = wColorTag }
        var nColorTag = tagObj["nColor"]; if (nColorTag != null) { nColor = nColorTag }
        var touchColorTag = tagObj["touchColor"]; if (touchColorTag != null) { touchColor = touchColorTag }
        var lineColorTag = tagObj["lineColor"]; if (lineColorTag != null) { lineColor = lineColorTag }
        var callFunTag = tagObj["backCallFun"]; if (callFunTag != null) { backCallFun = callFunTag }
        var showBack = tagObj["showBack"]; if (showBack == null) { showBack = false }
        var titleMs = tagObj["titleMs"]; if (titleMs == null) { titleMs = ""; } else { titleMs += "‧"; }
        hiddenLine = tagObj["isHiddenLine"]; if (hiddenLine == null) { hiddenLine = false; }
        var txtTop = titleTopList[0];
        var txtBot = titleBottomList[0];
        if (type != "setPwd") {
            txtTop = titleTopList[1];
            if (!showBack) {
                isTouchLockOK = true; // 页面锁定,必须通过解锁解除
            }
        }
        var rootView = "<div id=\"" + layoutId + "_rootView\">[content]</div>";
        var topTitle = "<div id=\"" + layoutId + "_topTitle\">" + titleMs + txtTop + "</div>";
        var canvaView = "<canvas id=\"" + layoutId + "_touchLockCanvas\"></canvas>";
        var bottomTitle = "<div id=\"" + layoutId + "_bottomTitle\">" + txtBot + "</div>";
        var backBtn = "<div id=\"" + layoutId + "_backBtn\">返回</div>";
        var switchAccount = "<div id=\"" + layoutId + "_SwitchAccountRoot\"><div id=\"" + layoutId + "_SwitchAccount\">切换账号</div></div>";
        if (type == "setPwd" || showBack) {
            rootView = rootView.replace("[content]", topTitle + canvaView + bottomTitle + backBtn);
        } else {
            rootView = rootView.replace("[content]", topTitle + canvaView + bottomTitle + switchAccount);
        }
        powContentObj.html(rootView);
        setStyle();
        canvasObj = document.getElementById(layoutId + "_touchLockCanvas");
        canvasObj.width = canvasWidth;
        canvasObj.height = canvasHeight;
        var cxt = canvasObj.getContext("2d");
        var X = (canvasWidth - 2 * offsetX - r * 2 * 3) / 2;
        var Y = (canvasHeight - 2 * offsetY - r * 2 * 3) / 2;
        PointsLocation = caculateNineCenterLocation(X, Y);
        draw(cxt, PointsLocation, [], null);
        initTouchEvent(canvasObj, cxt);
    }
    function caculateNineCenterLocation(diffX, diffY) {
        var Re = [];
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                var Point = {
                    X: (offsetX + col * diffX + (col * 2 + 1) * r),
                    Y: (offsetY + row * diffY + (row * 2 + 1) * r)
                };
                Re.push(Point);
            }
        }
        return Re;
    }
    function initTouchEvent(_canva, cxt) {
        var LinePoint = []; // 绘制的密码
        _canva.addEventListener("touchstart", function (e) {
            requestAnimationFrame(function () {
                isPointTouched(e.touches[0], LinePoint);
            });
        }, false);
        var touchmoveIsDraw = false;
        _canva.addEventListener("touchmove", function (e) {
            if (touchmoveIsDraw) { return; }
            touchmoveIsDraw = true;
            e.preventDefault();
            requestAnimationFrame(function () {
                var touches = e.touches[0];
                isPointTouched(touches, LinePoint);
                cxt.clearRect(0, 0, canvasWidth, canvasHeight);
                draw(cxt, PointsLocation, LinePoint, { X: touches.pageX, Y: touches.pageY });
                touchmoveIsDraw = false;
            });
        }, false);
        _canva.addEventListener("touchend", function (e) {
            requestAnimationFrame(function () {
                cxt.clearRect(0, 0, canvasWidth, canvasHeight);
                draw(cxt, PointsLocation, LinePoint, null);
                if (LinePoint.length < 5) {
                    $("#" + layoutId + "_bottomTitle").html(titleBottomList[3]);
                } else {
                    if (type == "setPwd") {
                        setPassword(LinePoint);
                    } else {
                        verifyPassword(LinePoint);
                    }
                }
                cxt.clearRect(0, 0, canvasWidth, canvasHeight);
                draw(cxt, PointsLocation, [], null);
                LinePoint = [];
            });
        }, false);
    }
    function isPointTouched(touches, LinePoint) {
        if (canvasOffsetTop == 0) { canvasOffsetTop = canvasObj.offsetTop; }
        for (var i = 0; i < PointsLocation.length; i++) {
            if (LinePoint.indexOf(i) >= 0) { continue; }
            var currentPoint = PointsLocation[i];
            var xdiff = Math.abs(currentPoint.X - touches.pageX);
            var ydiff = Math.abs(currentPoint.Y - (touches.pageY - canvasOffsetTop));
            var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            if (dir <= r) {
                if (LinePoint["length"] > 0) {
                    var indexLast = LinePoint[LinePoint.length - 1] + 1;
                    var index = i + 1;
                    var pushIndex;
                    if ((indexLast + index) % 2 == 0) {
                        if ((indexLast % 2) == 0 && (index % 2) == 0) {
                            if ((indexLast + index) / 2 == 5) {
                                pushIndex = 4;
                                if (LinePoint.indexOf(pushIndex) < 0) {
                                    LinePoint.push(pushIndex);
                                }
                            }
                        } else {
                            if (indexLast != 5 && index != 5) {
                                pushIndex = (indexLast + index) / 2 - 1;
                                if (LinePoint.indexOf(pushIndex) < 0) {
                                    LinePoint.push(pushIndex);
                                }
                            }
                        }
                    }
                }
                LinePoint.push(i);
                break;
            }
        }
    }
    function draw(_cxt, _PointsLocation, _LinePointArr, touchPoint) {
        if (_LinePointArr.length > 0) {
            _cxt.beginPath();
            if (!hiddenLine) {
                for (var i = 0; i < _LinePointArr.length; i++) {
                    var pointIndex = _LinePointArr[i];
                    _cxt.lineTo(_PointsLocation[pointIndex].X, _PointsLocation[pointIndex].Y);
                }
            }
            _cxt.lineWidth = 2;
            _cxt.strokeStyle = lineColor;
            _cxt.stroke();
            _cxt.closePath();
            if (touchPoint != null && !hiddenLine) {
                if (canvasOffsetTop == 0) { canvasOffsetTop = canvasObj.offsetTop; }
                var lastPointIndex = _LinePointArr[_LinePointArr.length - 1];
                var lastPoint = _PointsLocation[lastPointIndex];
                _cxt.beginPath();
                _cxt.moveTo(lastPoint.X, lastPoint.Y);
                _cxt.lineTo(touchPoint.X, Math.abs(touchPoint.Y - canvasOffsetTop));
                _cxt.stroke();
                _cxt.closePath();
            }
        }
        for (var i = 0; i < _PointsLocation.length; i++) {
            var Point = _PointsLocation[i];
            _cxt.fillStyle = wColor;
            _cxt.beginPath();
            _cxt.arc(Point.X, Point.Y, r, 0, Math.PI * 2, true);
            _cxt.closePath();
            _cxt.fill();
            _cxt.fillStyle = nColor;
            _cxt.beginPath();
            _cxt.arc(Point.X, Point.Y, nR, 0, Math.PI * 2, true);
            _cxt.closePath();
            _cxt.fill();
            if (_LinePointArr.indexOf(i) >= 0) {
                _cxt.fillStyle = touchColor;
                _cxt.beginPath();
                _cxt.arc(Point.X, Point.Y, r, 0, Math.PI * 2, true);
                _cxt.closePath();
                _cxt.fill();
            }
        }
    }
    function resetChange() {
        isTwiceInput = false;
        tempLinePoint = [];
    }
    function setPassword(_LinePoint) {
        if (!isTwiceInput) { //首次绘制
            tempLinePoint = _LinePoint;
            isTwiceInput = true;
            $("#" + layoutId + "_bottomTitle").html(titleBottomList[1]);
        } else { //再次绘制
            if (tempLinePoint.join('') === _LinePoint.join('')) {
                saveLocalStorage("touchLockPassword", _LinePoint.join(''));
                saveLocalStorage("touchLockSaveDate", new Date().getTime());
                $("#" + layoutId + "_bottomTitle").html(titleBottomList[4]);
                isTwiceInput = false;
                tempLinePoint = [];
                outBack = true;
                setTimeout(function () {
                    mIndexPopWindowObj.close();
                    outBack = false;
                    if (backCallFun != null) {
                        backCallFun(_LinePoint.join(''));
                    }
                }, 1000);
            } else { // 重复绘制错误
                $("#" + layoutId + "_bottomTitle").html(titleBottomList[2]);
            }
        }
    }
    function verifyPassword(_LinePoint) {
        var password = getLocalStorage("touchLockPassword");
        if (password == null || password["length"] == 0) { // 未设置手势密码
            $("#" + layoutId + "_bottomTitle").html('您还没有设置手势密码,请先设置手势密码!');
            setTimeout(function () {
                mIndexPopWindowObj.close();
                if (backCallFun != null) {
                    backCallFun(null);
                }
            }, 1000);
        } else {
            if (password == _LinePoint.join('')) {
                $("#" + layoutId + "_bottomTitle").html('手势密码正确!');
                isTwiceInput = false;
                tempLinePoint = [];
                isTouchLockOK = false;
                setTimeout(function () {
                    mIndexPopWindowObj.close();
                    if (backCallFun != null) {
                        backCallFun(password);
                    }
                }, 1000);
            } else {
                $("#" + layoutId + "_bottomTitle").html('输入的手势密码不正确!');
            }
        }
    }
    var outBack = false;
    function setStyle() {
        $("#" + layoutId + "_rootView").css({
            "align-items": "center",
            "text-align": "center",
            "width": "100%",
            "height": "auto"
        });
        $("#" + layoutId + "_topTitle").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "text-align": "center",
            "font-size": "16px",
            "color": "white"
        });
        $("#" + layoutId + "_bottomTitle").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "text-align": "center",
            "font-size": "16px",
            "color": "white"
        });
        $("#" + layoutId + "_touchLockCanvas").css({
            "margin-top": "15px",
            "margin-bottom": "15px",
            "width": canvasWidth,
            "height": canvasHeight,
            "box-sizing": "border-box"
        });
        $("#" + layoutId + "_backBtn").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "auto",
            "height": "40px",
            "background": mainColor,
            "border-radius": "25px",
            "margin-top": "25px",
            "margin-bottom": "15px",
            "margin-left": "20px",
            "margin-right": "20px",
            "color": "white",
            "box-sizing": "border-box"
        });
        $("#" + layoutId + "_SwitchAccountRoot").css({
            "width": "100%",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "margin-top": "25px",
            "margin-bottom": "15px",
            "box-sizing": "border-box"
        });
        $("#" + layoutId + "_SwitchAccount").css({
            "width": "auto",
            "height": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "font-size": "14px",
            "color": mainColor
        });
        var backObj = $("#" + layoutId + "_backBtn");
        if (backObj != null) {
            setBtnOnTouchEvent(backObj, function (mObj) {
                if (outBack) {
                    return;
                }
                mIndexPopWindowObj.close();
            }, mainColorDeep, mainColor, null);
        }
        var switchAccountObj = $("#" + layoutId + "_SwitchAccount");
        if (switchAccountObj != null) {
            setBtnOnTouchEvent(switchAccountObj, function (mObj) {
                isTouchLockOK = false;
                mIndexPopWindowObj.close();
                var backFun = tagObj["SwitchAccountFun"];
                if (backFun != null) {
                    backFun();
                }
            }, mainColorDeep, "", null);
        }
    }
}
function IndexBulletin(id) {
    var layoutId = id + "_content";
    var powContentObj = $("#" + layoutId);
    var contentObj;
    powContentObj.css({
        "width": "auto",
        "height": "auto"
    });
    this.show = function (obj) {
        contentObj = obj;
        bindView();
    }
    function bindView() {
        var close = "<div id=\"" + layoutId + "_close\"><img id=\"" + layoutId + "_closeImg\" src=\"" +
            themPath + "xclose.png\" style=\"width:30px\" /></div>";
        var root = "<div id=\"" + layoutId + "_root\">[content]</div>";
        var rootSll = "<div id=\"" + layoutId + "_rootSll\">[content]</div>";
        var content = contentObj["content"];
        var isList = contentObj["isList"];
        var bindTime = contentObj["bindTime"];
        if (bindTime == null || isNaN(bindTime)) {
            bindTime = 1000;
        }
        if (isList) {
            rootSll = rootSll.replace("[content]", AppMakeObj.AeToCn(content, layoutId));
        } else {
            rootSll = rootSll.replace("[content]", content);
        }
        root = root.replace("[content]", rootSll);
        powContentObj.html(root + close);
        setStyle();
        setTimeout(function () {
            mIndexPopWindowObj.bindOK(true);
        }, bindTime);
    }
    function setStyle() {
        $("#" + layoutId + "_root").css({
            "width": screenW - 40,
            "height": screenH / 1.6,
            "opacity": 0.9,
            "background-color": "#000",
            "border-radius": "10px",
            "padding": "10px 0px 10px 0px",
            "margin-bottom": "10px",
            "border": "1px solid " + mainColor,
            "box-sizing": "border-box"
        });
        $("#" + layoutId + "_rootSll").css({
            "width": "100%",
            "height": "100%",
            "text-align": "center",
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "box-sizing": "border-box"
        });
        $("." + layoutId + "_img").css({
            "width": "100%",
            "padding": "10px 0px 10px 0px",
            "box-sizing": "border-box"
        });
        $("." + layoutId + "_text").css({
            "width": "100%",
            "padding": "5px 15px 5px 15px",
            "box-sizing": "border-box"
        });
        $("#" + layoutId + "_close").css({
            "width": screenW - 40,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + layoutId + "_closeImg").click(function () {
            mIndexPopWindowObj.close(true);
        });
    }
}
function popupWindow(id) {
    var powContentObj = $("#" + id + "_content");
    powContentObj.css({ "width": "auto", "height": "auto" });
    this.show = function (obj) {
        if (obj == null) { return; }
        var fie = obj["name"];
        var con = obj["content"];
        if (fie != null && fie.trim() != "") {
            requestAjaxGet(fie, function (data) {
                powContentObj.html(data);
                mIndexPopWindowObj.bindOK();
            });
        } else if (con != null && con.trim() != "") {
            powContentObj.html(con);
            mIndexPopWindowObj.bindOK();
        }
    }
}
function toastInApp(msg, timeLen) {
    if (msg == null || msg["length"] == 0) { return; }
    msg = msg.replace("<br>", "").replace("</br>", "").replace("<BR>", "").replace("</BR>", "");
    setTimeout(function () {
        window.location.assign("zy://app?command=toast&value=" + encodeURI(msg) + "&timeLen=" + timeLen);
    }, 0);
    console.log("toastInApp msg: " + msg);
}
function LoggerInApp(msg) {
    setTimeout(function () {
        window.location.assign("zy://app?command=logger&value=" + encodeURI(msg));
    }, 100);
}
function setLoggerInApp() {
    // 该重指向存在内存泄漏风险
    console.log = function (msg) { LoggerInApp(msg); };
}
function copyInApp(msg) {
    if (msg == null || msg["length"] == 0) { return; }
    if (isInApp()) {
        setTimeout(function () {
            window.location.assign("zy://app?command=copy&value=" + encodeURI(msg));
        }, 0);
        mToast.show("复制成功!");
    } else {
        var textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.left = '-10000px';
        textArea.style.top = '-10000px';
        document.body.appendChild(textArea);
        textArea.value = msg;
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        mToast.show("复制成功!");
    }
}
function getTimeFromMsec(fmt, isGetYear, isGetHMS) {
    if (isGetYear == null) {
        isGetYear = true;
    }

    if (isGetHMS == null) {
        isGetHMS = true;
    }

    var oDate = new Date(fmt);

    var s = "";

    if (isGetYear) {
        s = s + oDate.getFullYear() + "-";
    }
    s = s + getNumByZero(oDate.getMonth() + 1) + "-";
    s = s + getNumByZero(oDate.getDate());

    if (isGetHMS) {
        s = s + " ";
        s = s + getNumByZero(oDate.getHours()) + ":";
        s = s + getNumByZero(oDate.getMinutes()) + ":";
        s = s + getNumByZero(oDate.getSeconds()) + "";
    }
    return s;

    function getNumByZero(inStr) {
        if (inStr < 10) {
            return "0" + inStr;
        } else {
            return inStr;
        }
    }
}
function DateAdd(interval, number, date) {
    switch (interval) {
        case "y":
            date.setFullYear(date.getFullYear() + number);
            return date;
        case "q":
            date.setMonth(date.getMonth() + number * 3);
            return date;
        case "m":
            date.setMonth(date.getMonth() + number);
            return date;
        case "w":
            date.setDate(date.getDate() + number * 7);
            return date;
        case "d":
            date.setDate(date.getDate() + number);
            return date;
        case "h":
            date.setHours(date.getHours() + number);
            return date;
        case "s":
            date.setSeconds(date.getSeconds() + number);
            return date;
        default:
            date.setDate(d.getDate() + number);
            return date;
    }
}
function getTimeZoneE8(i, timeInt) {
    if (typeof i !== 'number') return;
    var d = new Date(timeInt);
    var len = d.getTime();
    var offset = d.getTimezoneOffset() * 60000;
    var utcTime = len + offset;
    return new Date(utcTime + 3600000 * i);
}
function blurAnyone() {
    var obj = $(":focus");
    obj.blur();
}
function focusHiddenBox() {
    document.activeElement.blur();
}
function langObj() {
    this.init = function () {
    }
    this.getZHByCode = function (code) {
        console.log("getZHByCode:" + code);
        var langListObj = lang["result"];
        if (langListObj == null) { return code; }
        var codeObj = langListObj[code];
        if (codeObj == null) { return code; }
        var zh = codeObj["zh"];
        if (zh == null) { return code; }
        return zh;
    }
}
function isRealNum(val) {
    var regPos = /^\d+(\.\d+)?$/;
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}
function inputOnlyNumber(obj) {
    obj.value = obj.value.replace(/[^\d]/g, '');
}
function secondToDate(result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    m = parseInt(m) + parseInt(h * 60);
    return result = m + ":" + s;
}
function checkEvent() {
    var hasTouch = 'ontouchstart' in window;
    startEvent = hasTouch ? "touchstart" : "mousedown";
    moveEvent = hasTouch ? "touchmove" : "mousemove";
    endEvent = hasTouch ? "touchend" : "mouseup";
    cancelEvent = hasTouch ? "touchcancel" : "mouseup";
}
function o(objId) {
    return document.getElementById(objId);
}
function goWebPage(pageUrl) {
    window.location.href = pageUrl;
}
function addImg(imgId, imgSrc, imgX, imgY, imgW, imgH, imgParent) {
    var zyImg = document.createElement("img");
    zyImg.id = imgId;
    zyImg.src = imgSrc;
    zyImg.style.width = imgW + "px";
    zyImg.style.height = imgH + "px";
    zyImg.style.position = "absolute";
    zyImg.style.left = imgX + "px";
    zyImg.style.top = imgY + "px";
    imgParent.appendChild(zyImg);
}
function addDiv(divId, divX, divY, divParent) {
    var zyDiv = document.createElement("div");
    zyDiv.id = divId;
    zyDiv.style.position = "absolute";
    zyDiv.style.left = divX + "px";
    zyDiv.style.top = divY + "px";
    divParent.appendChild(zyDiv);
}
function removeDiv(deleteDivObj) {
    if (deleteDivObj != null) {
        deleteDivObj.parentNode.removeChild(deleteDivObj);
    }
}
function getScale(appUIWidth, appUIHeight) {
    var appScale = 1.0;
    var screenWvar = document.body.clientWidth;
    var screenHvar = document.body.clientHeight;
    var theScaleW = screenWvar / appUIWidth;
    var theScaleH = screenHvar / appUIHeight;
    if (theScaleW >= theScaleH) {
        appScale = theScaleH;
    } else {
        appScale = theScaleW;
    }
    return appScale;
}
function getScaleByWidth(appUIWidth) {
    screenWvar = screenW;
    return screenWvar / appUIWidth;
}
function setObjCSS(obj, cssName) {
    obj.className = cssName;
}
function getWeekDay(day) {
    var mDate = new Date(day);
    var myddy = mDate.getDay();
    var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return weekday[myddy];
}
function setBtnOnTouchEventNoColor(obj, callbackFun, startFun) {
    obj.on(startEvent, function (e) {
        var x = Number(e.touches[0].clientX);
        var y = Number(e.touches[0].clientY);
        startX = x;
        startY = y;
        if (startFun != null) {
            startFun(this);
        }
        e.stopPropagation();
    });
    obj.on(endEvent, function (e) {
        var x = Number(e.changedTouches[0].clientX);
        var y = Number(e.changedTouches[0].clientY);
        if ((Math.abs(startX - x) < 10) && (Math.abs(startY - y) < 10)) {
            if (callbackFun != null) {
                callbackFun(this);
            }
        }
        e.stopPropagation();
        e.preventDefault();
        return true;
    });
    obj.on(moveEvent, function () {
    });
}
function setBtnOnTouchEvent(obj, callbackFun, onPressColor, onEndColor, startFun) {
    if (onPressColor == null) {
        onPressColor = "";
    }
    if (onEndColor == null) {
        onEndColor = "";
    }
    obj.on(startEvent, function (e) {
        var x = Number(e.touches[0].clientX);
        var y = Number(e.touches[0].clientY);
        startX = x;
        startY = y;
        obj.css('background', onPressColor);
        if (startFun != null) {
            startFun(this);
        }
        e.stopPropagation();
    });
    obj.on(endEvent, function (e) {
        obj.css('background', onEndColor);
        var x = Number(e.changedTouches[0].clientX);
        var y = Number(e.changedTouches[0].clientY);
        if ((Math.abs(startX - x) < 10) && (Math.abs(startY - y) < 10)) {
            if (callbackFun != null) {
                callbackFun(this);
            }
        }
        e.stopPropagation();
        e.preventDefault();
        return true;
    });
    obj.on(moveEvent, function () {
        obj.css('background', onEndColor);
    });
}
function setBtnOnTouchLongEvent(obj, backLongHandel, backHandel, onPressColor, onEndColor) {
    if (onPressColor == null) {
        onPressColor = "";
    }
    if (onEndColor == null) {
        onEndColor = "";
    }
    var isBack = false; // 是否已经回调
    var timeout = null; // 长按定时器
    var moveX = 0;
    var moveY = 0;
    var startX = 0;
    var startY = 0;
    // 开始
    obj.on(startEvent, function (e) {
        var x = Number(e.touches[0].clientX);
        var y = Number(e.touches[0].clientY);
        startX = x;
        startY = y;
        moveX = x;
        moveY = y;
        var slef = this;
        obj.css('background', onPressColor);
        if (timeout != null) clearTimeout(timeout);
        timeout = setTimeout(function () {
            if ((Math.abs(startX - moveX) < 10) && (Math.abs(startY - moveY) < 10)) {
                if (backLongHandel != null) {
                    backLongHandel(slef, x, y);
                    isBack = true;
                }
            }
            clearTimeout(timeout);
            timeout = null;
        }, 1000);
        e.stopPropagation();
    });
    // 结束
    obj.on(endEvent, function (e) {
        if (timeout != null) {
            clearTimeout(timeout);
            timeout = null;
        }
        obj.css('background', onEndColor);
        var x = Number(e.changedTouches[0].clientX);
        var y = Number(e.changedTouches[0].clientY);
        if ((Math.abs(startX - x) < 10) && (Math.abs(startY - y) < 10)) {
            if (backHandel != null && !isBack) {
                backHandel(this);
            }
        }
        e.stopPropagation();
        e.preventDefault();
        isBack = false;
        return true;
    });
    // 移动
    obj.on(moveEvent, function (e) {
        var x = Number(e.touches[0].clientX);
        var y = Number(e.touches[0].clientY);
        moveX = x;
        moveY = y;
        obj.css('background', onEndColor);
    });
}
function isMobile() {
    var isMobileVar = false;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        isMobileVar = true;
    } else {
        isMobileVar = false;
    }
    return isMobileVar;
}
function checkIsAndroid() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
        isAndroidFlag = true;
    }
}
function GetQueryString(name, url) {
    var searchIndex = 0;
    for (var i = 0; i < url.length; i++) { if (url[i] == "?") { searchIndex = i; break; } }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.substr(searchIndex).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function addBackFunArr(back, handel) {
    backFunArr.push(back);
    var obj = new Object();
    if (handel != null) { // 返回函数地址作为唯一标识
        handel(backFunArr[backFunArr.length - 1]);
    }
    obj["theme"] = "PAGE_PUSH_THEME";
    obj["TOP_LEVEL"] = backFunArr[backFunArr.length - 1];
    mEventBusObj.release(obj);
}
function backClickFun(callback) {
    if (isTouchLockOK) {
        sureCloseApp();
        return;
    }
    if (isDisconnectService) {
        return;
    }
    var len = backFunArr.length;
    if (len > 1) {
        var handel = backFunArr[len - 1];
        try { handel(); } catch (e) { }
        backFunArr.splice(len - 1, 1); // 移除顶层界面回退
        var obj = new Object();
        obj["theme"] = "PAGE_PUSH_THEME";
        obj["TOP_LEVEL"] = backFunArr[backFunArr.length - 1];
        mEventBusObj.release(obj);
    } else if (len == 1) {
        if (isInApp() && isAndroidFlag) {
            var handel = backFunArr[len - 1];
            try { handel(); } catch (e) { }
        }
    }
    if (callback != null) callback();
}
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
function checkISNumberAndLetter(ms) {
    var re = /^[0-9a-zA-Z]*$/g;
    if (!re.test(ms)) {
        return false;
    } else {
        return true;
    }
}
function checkISChinese(ms) {
    var regex = /^[\u4E00-\u9FA5]+$/;
    if (!regex.test(ms)) {
        return false;
    } else {
        return true;
    }
}
function checkEmail(email) {
    var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if (myReg.test(email)) {
        return true;
    } else {
        return false;
    }
}
function domainName(url) {
    var head = "";
    var domain = "";
    if (url.indexOf("://") >= 0) {
        var uList = url.split("://");
        head = uList[0];
        var last = uList[1];
        var dList = last.split("/");
        domain = dList[0];
        return head + "://" + domain;
    } else {
        var uList = url.split("/");
        return uList[0];
    }
}
function isInApp() {
    var url = location.href;
    if (url.indexOf("127.0.0.1") != -1) {
        return true;
    } else {
        return false;
    }
}
function iframeObj(iframeName) {
    return $(window.parent.document).contents().find("#" + iframeName)[0].contentWindow;
}
function AppEventBus() {
    var subList = new Array();
    this.init = function () { subList = new Array(); }
    this.release = EventDistributionBus;
    this.releaseList = EventDistributionBusList;
    this.subscription = EventSubscription;
    this.subscriptionForce = EventSubscriptionForce;
    this.unsubscribe = UnSubscribe;
    // 事件发布
    function EventDistributionBus(eventObj) {
        if (eventObj == null) { return false; }
        var tem = eventObj["theme"];
        if (tem == null || tem == "") {
            tem = "all";
        }
        console.log("release theme:" + tem);
        var isRelse = false; // 是否成功发布
        for (var i = 0; i < subList.length; i++) {
            var objItem = subList[i];
            if (objItem["theme"] == tem) {
                var func = objItem["callBack"];
                if (func != null) {
                    func(eventObj);
                    isRelse = true;
                }
            }
        }
        return isRelse;
    }
    // 事件组发布
    function EventDistributionBusList(eventList) {
        if (eventList == null || eventList.length == 0) { return; }
        for (var i = 0; i < eventList.length; i++) {
            EventDistributionBus(eventList[i]);
        }
    }
    // 事件订阅,index唯一标识
    function EventSubscription(theme, index, func) {
        if (func == null || index == null || index == "" || checkIndex(index) >= 0) { return false; }
        var tem = theme;
        if (tem == null || tem == "") {
            tem = "all";
        }
        console.log("sub theme:" + tem + ",index:" + index);
        var obj = new Object();
        obj["theme"] = tem;
        obj["index"] = index;
        obj["callBack"] = func;
        subList.push(obj);
        return true;
    }
    function EventSubscriptionForce(theme, func) {
        if (func == null) { return; }
        var index = uuid();
        var tem = theme;
        if (tem == null || tem == "") {
            tem = "all";
        }
        console.log("subForce theme:" + tem + ",index:" + index);
        var obj = new Object();
        obj["theme"] = tem;
        obj["index"] = index;
        obj["callBack"] = func;
        subList.push(obj);
        return index;
    }
    // 取消订阅
    function UnSubscribe(index) {
        if (subList.length == 0 || index == null || index == "") { return false; }
        var pos = checkIndex(index);
        if (pos >= 0) {
            subList.splice(pos, 1);
            console.log("unsub success index:" + index + ",pos:" + pos + ",subLen:" + subList.length);
            return true;
        } else {
            console.log("unsub failure index:" + index);
            return false;
        }
    }
    // 订阅标识检查
    function checkIndex(index) {
        if (index == null || index == "") { return -2; } // 无效标识
        for (var i = 0; i < subList.length; i++) {
            var objItem = subList[i];
            if (objItem["index"] == index) {
                return i; // 已存在的标识
            }
        }
        return -1; // 该标识不存在
    }
    function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }
}
function AppMake() {
    this.AeToCn = AeToCn;
    function AeToCn(cList, layoutId, back) { // 这是文章转内容接口
        if (cList == null || layoutId == null || cList["length"] == 0) { return ""; }
        var text = "<div class=\"" + layoutId + "_text\" style=\"text-align:[ta];color:[cr];font-weight:[fw];font-size:[se]\">[cn]</div>";
        var img = "<div class=\"" + layoutId + "_img\"><img src=\"[src]\" style=\"width:100%\" /></div>";
        var len = cList["length"];
        var divs = "";
        for (var i = 0; i < len; i++) {
            var item = cList[i];
            if (item["type"] == "text") {
                var size = item["size"];
                switch (size) {
                    case "1": size = "12px"; break;
                    case "2": size = "14px"; break;
                    case "3": size = "16px"; break;
                    case "4": size = "18px"; break;
                    case "5": size = "20px"; break;
                    case "6": size = "24px"; break;
                    default: break;
                }
                divs += text.replace("[ta]", item["align"])
                    .replace("[cr]", item["color"])
                    .replace("[se]", size)
                    .replace("[fw]", item["weight"])
                    .replace("[cn]", item["content"]);
            } else if (item["type"] == "img") {
                divs += img.replace("[src]", item["url"]);
            }
            if (back != null) {
                var ms = back(item);
                if (ms != null && ms.trim() != "") {
                    divs += ms;
                }
            }
        }
        return divs;
    }
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function requestAjax(url, params, callBack, errorCallBack, configObj) {
    // 支持请求配置
    var domain = SERVER_ADD;
    var asyn = true;
    var withCredenIs = true;
    var outTime = ORDER_TIMEOUT;
    var xhrField = { withCredentials: true };
    if (configObj != null) {
        asyn = configObj["asyn"];
        if (asyn == null) { asyn = true; }
        withCredenIs = configObj["withCredenIs"];
        if (withCredenIs == null) { withCredenIs = true; }
        outTime = configObj["outTime"];
        if (outTime == null || isNaN(outTime)) { outTime = ORDER_TIMEOUT; }
    }
    if (!withCredenIs) {
        xhrField = null;
        console.log("xhrField Null");
    }
    // 协议检查(带协议请求不属于app接口请求)
    if (url.indexOf("http") == 0 || url.indexOf("https") == 0) {
        domain = "";
    }
    setTimeout(Ajax, timeOutAjax);
    function Ajax() {
        $.ajax({
            type: "post",
            url: domain + url,
            data: params,
            async: asyn,
            xhrFields: xhrField,
            timeout: outTime,
            beforeSend: function (xmlhttprequest) {
            },
            success: function (data) {
                var returnObj;
                try {
                    returnObj = JSON.parse(data);
                } catch (e) {
                    returnObj = data;
                }
                if (callBack != null) {
                    callBack(returnObj);
                }
            },
            error: function (xmlhttprequest, error) {
                if (errorCallBack != null) {
                    errorCallBack(error);
                }
                var link = domain + url;
                if (link.indexOf(SERVER_ADD) == 0) {
                    APPServiceCheck();
                }
            },
            complete: function () {
                console.log("requestAjax complete");
            }
        });
        timeOutAjax = 0;
    }
    console.log("requestAjax url: " + (domain + url) + " xhrField:" + xhrField);
}
function requestAjaxGet(url, callBack, errorCallBack) {
    setTimeout(Ajax, timeOutAjax);
    function Ajax() {
        $.ajax({
            type: "get",
            url: url,
            async: true,
            timeout: ORDER_TIMEOUT,
            beforeSend: function (xmlhttprequest) {
            },
            success: function (data) {
                var returnObj;
                try {
                    returnObj = JSON.parse(data);
                } catch (e) {
                    returnObj = data;
                }
                if (callBack != null) {
                    callBack(returnObj);
                }
            },
            error: function (xmlhttprequest, error) {
                if (errorCallBack != null) {
                    errorCallBack(error);
                }
            },
            complete: function () {
                console.log("requestAjaxGet commplet");
            }
        });
        timeOutAjax = 0;
    }
    console.log("requestAjaxGet url:" + url);
}
function getDomainNameByURL(url) {
    var head = "";
    var domain = "";
    if (url.indexOf("://") >= 0) {
        var uList = url.split("://");
        head = uList[0];
        var last = uList[1];
        var dList = last.split("/");
        domain = dList[0];
        return head + "://" + domain;
    } else {
        var uList = url.split("/");
        return uList[0];
    }
}
function APPServiceCheck() {
    $.ajax({
        type: "get",
        url: SERVER_ADD + "logs/helloWorld?operatorId=2",
        async: true,
        xhrFields: {
            withCredentials: true
        },
        timeout: ORDER_TIMEOUT,
        beforeSend: function (xmlhttprequest) {
        },
        success: function (data) {
        },
        error: function (xmlhttprequest, error) {
            if (!isInApp()) { return; }
            disconnectServiceCount = disconnectServiceCount + 1;
            if (disconnectServiceCount < 10 || isDisconnectService || isTouchLockOK) { return; }
            disconnectServiceCount = 0;
            $("#indexPopupwindowBox").css({ "display": "none" });
            $("#loadingDiv").css({ "display": "none" });
            $("#toast").css({ "display": "none" });
            disconnect();
        },
        complete: function () {
        }
    });
    function disconnect() {
        var spinner = new Spinner({ "color": mainColor });
        var obj = new Object();
        obj["backIs"] = false;
        obj["title"] = "提示";
        obj["viewFun"] = function (id) {
            var root = "<div id=\"" + id + "_disconnectRoot\">[content]</div>";
            var loadIcon = "<div id=\"" + id + "_disconnectLoadIcon\">[content]</div>";
            var load = "<div id=\"" + id + "_disconnectLoad\">[content]</div>";
            var img = "<img id=\"" + id + "_disconnectImg\" src=\"" + themPath + "disconnect.png\" style=\"width:55px\"/>";
            loadIcon = loadIcon.replace("[content]", img + load);
            var txt = "<div id=\"" + id + "_disconnectTxt\">网络连接已经断开,请检查您的网络!</div>";
            var btnRe = "<div id=\"" + id + "_disconnectBtnReget\">重试</div>";
            var btnBack = "<div id=\"" + id + "_disconnectBtnBack\">退出APP</div>";
            if (isAndroidFlag) {
                return root.replace("[content]", loadIcon + txt + btnRe + btnBack);
            } else {
                return root.replace("[content]", loadIcon + txt + btnRe);
            }
        };
        obj["styleFun"] = function (id) {
            $("#" + id + "_disconnectRoot").css({
                "align-items": "center",
                "text-align": "center",
                "width": "100%",
                "height": "auto",
                "padding": "15px",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectLoadIcon").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": "auto",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectLoad").css({
                "display": "none",
                "justify-content": "center",
                "align-items": "center",
                "width": "auto",
                "height": "auto",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectTxt").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": "auto",
                "font-size": "14px",
                "color": "white",
                "margin-top": "15px",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectBtnReget").css({
                "border-radius": "20px",
                "color": mainFontColor,
                "font-size": "14px",
                "background-color": mainColor,
                "width": "100%",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "padding": "10px",
                "margin-top": "15px",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectBtnBack").css({
                "border-radius": "20px",
                "border": "1px solid " + mainColor,
                "color": mainColor,
                "font-size": "14px",
                "background-color": "",
                "width": "100%",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "padding": "10px",
                "margin-top": "15px",
                "box-sizing": "border-box"
            });
            var indexEvent;
            var themeEvent = "disconnectThemeEvent";
            var isReGet = false;
            setBtnOnTouchEvent($("#" + id + "_disconnectBtnReget"), function () {
                if (isReGet) { return; }
                $("#" + id + "_disconnectImg").css({ "display": "none" });
                $("#" + id + "_disconnectLoad").css({ "display": "flex" });
                $("#" + id + "_disconnectTxt").html("正在重新连接...");
                spinner.spin(o(id + "_disconnectLoad"));
                window.location.assign("zy://app?command=domainReGet");
                isReGet = true;
                $("#" + id + "_disconnectBtnReget").css({ "background-color": mainColorDeep });
            }, mainColorDeep, mainColor, null);
            setBtnOnTouchEvent($("#" + id + "_disconnectBtnBack"), function () {
                window.location.assign("zy://app?command=close&type=0");
            }, mainColorDeep, "", null);
            indexEvent = mEventBusObj.subscriptionForce(themeEvent, function (obj) {
                spinner.spin();
                $("#" + id + "_disconnectLoad").css({ "display": "none" });
                $("#" + id + "_disconnectImg").css({ "display": "block" });
                $("#" + id + "_disconnectTxt").html("服务连接失败!");
                isReGet = false;
                $("#" + id + "_disconnectBtnReget").css({ "background-color": mainColor });
            });
            console.log("subThemeIndex:" + indexEvent);
        };
        mMsgBox.showImp(obj);
        isDisconnectService = true;
    }
}
function AppReleaseEvent(theme, msObj) {
    var obj = new Object();
    obj["theme"] = theme;
    obj["source"] = "app";
    obj["message"] = msObj;
    mEventBusObj.release(obj);
}
function AppAddEvent(obj, type, backFun, tag) {
    if (tag == null) { tag = false; }
    obj.addEventListener(type, backFun, tag);
}
function AppRemoveEvent(obj, type, backFun, tag) {
    if (tag == null) { tag = false; }
    obj.removeEventListener(type, backFun, tag);
}
function APPLogging() {
    var opStartTime = null;
    var opEndTime = null;
    var accessAPI = new Array();
    var opType = "";
    var opResult = "";
    var tag = "";
    // 过滤操作类型,模糊过滤
    var opTypeFilter = new Array();
    opTypeFilter.push("cmd");
    opTypeFilter.push("ky");
    opTypeFilter.push("ig");
    opTypeFilter.push("login_lmg");
    opTypeFilter.push("lottery");
    this.setOpType = function (type) {
        opType = type;
    }
    this.setOpResult = function (result) {
        opResult = result;
    }
    this.markOpStartTime = function () {
        opStartTime = new Date().getTime();
    }
    this.markOpEndTime = function () {
        if (opStartTime == null) {
            return;
        }
        opEndTime = new Date().getTime();
    }
    this.addAccessAPI = function (api) {
        var aLen = accessAPI.length;
        for (var i = 0; i < aLen; i++) {
            var item = accessAPI[i];
            if (item == api) {
                return;
            }
        }
        accessAPI.push(api);
    }
    this.setTag = function (tg) {
        tag = tg;
    }
    this.getTag = function () {
        return tag;
    }
    this.clearAPIs = function () {
        accessAPI = new Array();
    }
    this.pushFilterOpType = pushFilterOpType;
    this.uploadLog = function () {
        if (opEndTime == null || opStartTime == null) {
            return;
        }
        var isF = false;
        var tempOpType = opType;
        tempOpType = tempOpType.toLowerCase();
        var len = opTypeFilter.length;
        for (var i = 0; i < len; i++) {
            var item = opTypeFilter[i];
            item = item.toLowerCase();
            if (tempOpType.indexOf(item) != -1) {
                console.log("filter game: " + tempOpType);
                isF = true;
            }
        }
        var timecom = opEndTime - opStartTime;
        if (timecom < 800) {
            isF = true;
        }
        var uid = "";
        if (userInfo != null) {
            uid = userInfo.id;
        }
        var data = "&ops=" + opStartTime +
            "&ope=" + opEndTime + "&apis=" + accessAPI.toString() +
            "&opt=" + opType + "&opr=" + opResult + "&uid=" + uid;
        console.log("appLog: " + data + "; isFilter: " + isF);
        if (isInApp() && !isF) {
            window.location.assign("zy://app?command=appLog" + data);
        } else {
        }
    }
    function pushFilterOpType(optype) {
        optype = optype.toLowerCase();
        var len = opTypeFilter.length;
        for (var i = 0; i < len; i++) {
            var item = opTypeFilter[i];
            if (item == optype) {
                return;
            }
        }
        opTypeFilter.push(optype);
    }
}
function isInIOS() {
    var u = navigator.userAgent;
    if (u.match(/(iPhone|iPod|iPad);?/i)) { return true; }
    return false;
}
function isInAndroid() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    return isAndroid;
}
function saveLocalStorage(key, val) {
    if (key == null || key == "") { return; }
    if (window.localStorage) {
        localStorage.setItem(key, val);
    } else {
        Cookie.write(key, val);
    }
}
function getLocalStorage(key) {
    if (key == null || key == "") { return; }
    return window.localStorage ? localStorage.getItem(key) : Cookie.read(key);
}
function checkPageBackFromHome() {
    if (backFunArr.length != 1) {
        backFunArr = new Array();
        addBackFunArr(function () {
            checkIsAndroid();
            mMsgBox.show("提示", "确定退出吗？", function () { sureCloseApp(); }, null);
        });
        console.log("checkBackFromHome exception");
    }
    console.log("checkBackFromHome:" + backFunArr.length);
}
function VisibleTime(time) {
    var nowDate = getTimeZoneE8(timeZone, new Date());
    var nowTime = nowDate.getTime(); // 时间戳
    var nowYear = nowDate.getFullYear(); // 年
    var nowMonte = nowDate.getMonth() + 1; // 月
    var nowDay = nowDate.getDate(); // 日
    console.log("nowYear:" + nowYear + " nowMonte:" + nowMonte + " nowDay:" + nowDay);
    var fromDate = getTimeZoneE8(timeZone, new Date(time));
    var fromTime = fromDate.getTime();
    var year = fromDate.getFullYear();
    var monte = fromDate.getMonth() + 1;
    var day = fromDate.getDate();
    if (nowYear == year) {
        if (nowMonte == monte && nowDay == day) {
            var timeDifference = Math.abs(nowTime - fromTime);
            console.log("timeDifference:" + timeDifference);
            if (timeDifference < (60 * 60 * 1000)) {
                var mm = parseInt(timeDifference / 1000 / 60);
                console.log("minuteDifference:" + mm);
                if (mm >= 1) { return mm + "分钟前"; } else { return "刚刚"; }
            } else {
                return fromDate.format("hh:mm");
            }
        } else if (nowMonte == monte) {
            return Math.abs(nowDay - day) + "天前 " + fromDate.format("hh:mm");
        } else {
            return fromDate.format("MM-dd hh:mm");
        }
    } else {
        return fromDate.format("yyyy-MM-dd hh:mm");
    }
}
function BindT0UniqueEvent(id, type, handel, tag) {
    if (tag == null) tag = false;
    RemoveT0UniqueEvent(id, type, tag);
    var obj = new Object();
    obj["id"] = id;
    obj["handel"] = handel;
    T0EventList.push(obj);
    AppAddEvent(o(obj["id"]), type, obj["handel"], tag);
}
function RemoveT0UniqueEvent(id, type, tag) {
    if (tag == null) tag = false;
    for (var i = 0; i < T0EventList.length; i++) {
        var itemObj = T0EventList[i];
        var formId = itemObj["id"];
        if (formId == id) {
            AppRemoveEvent(o(formId), type, itemObj["handel"], tag);
            T0EventList.splice(i, 1);
            return;
        }
    }
}
function uploadFile(url, formData, succHandel, errHandel) {
    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        beforeSend: function () {
            console.log("upload...");
        },
        success: function (response) {
            var obj;
            try {
                obj = JSON.parse(response);
            } catch (e) {
                obj = response;
            }
            if (succHandel != null) succHandel(obj);
            console.log("success:" + response);
        },
        error: function (response) {
            var obj;
            try {
                obj = JSON.parse(response);
            } catch (e) {
                obj = response;
            }
            if (errHandel != null) errHandel(obj);
            console.log("err:" + JSON.stringify(response));
        }
    });
}
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
$.date = function (dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return year + "-" + month + "-" + day;
};
var by = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        } else {
            throw ("error");
        }
    }
}
addBackFunArr(function () {
    checkIsAndroid();
    mMsgBox.show("提示", "确定退出吗？", function () {
        sureCloseApp();
    }, null);
});
