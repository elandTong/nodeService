function ChatService() {
    var wsocke = null;
    var address = null;
    var onMessageHandel = null;
    var onOpenHandel = null;
    var onCloseHandel = null;
    var onErrorHandel = null;
    this.connection = connection;
    this.reConnection = reConnection;
    this.send = send;
    this.close = close;
    this.setOnMessageHandel = setOnMessageHandel;
    this.setOnOpenHandel = setOnOpenHandel;
    this.setOnCloseHandel = setOnCloseHandel;
    this.setOnErrorHandel = setOnErrorHandel;
    function connection(add) {
        address = add;
        var wsocke = new WebSocket(address);
        wsocke.onopen = function () {
            if (onOpenHandel != null) {
                onOpenHandel();
            }
            console.log("webSocket Connect success");
        };
        wsocke.onmessage = function (obj) {
            var msg = obj.data;
            if (onMessageHandel != null) {
                onMessageHandel(obj);
            }
            console.log("webSocket onMessage:" + msg);
        };
        wsocke.onclose = function () {
            if (onCloseHandel != null) {
                onCloseHandel();
            }
            if (reConnectionHandel != null) {
                reConnectionHandel();
                reConnectionHandel = null;
            }
            console.log("webSocket Connect close");
        };
        wsocke.onerror = function (e) {
            if (onErrorHandel != null) {
                onErrorHandel(e);
            }
            console.log("webSocket error:" + e);
        };
    }
    function send(data) {
        if (wsocke == null) return;
        wsocke.send(data);
    }
    function close() {
        if (wsocke == null) return;
        wsocke.close();
    }
    var reConnectionHandel = null;
    function reConnection() {
        if (wsocke == null || address == null) return;
        reConnectionHandel = function () {
            connection();
        }
        close();
    }
    function setOnMessageHandel(handel) {
        onMessageHandel = handel;
    }
    function setOnOpenHandel(handel) {
        onOpenHandel = handel;
    }
    function setOnCloseHandel(handel) {
        onCloseHandel = handel;
    }
    function setOnErrorHandel(handel) {
        onErrorHandel = handel;
    }
}
