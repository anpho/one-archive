blackberry.io.sandbox = false;
var cache = {
    get: function(url, strdate, callback) {
        /*
         * url : 图片网址
         * strdate : 当前日期
         * callback(string) ：回调，返回本地地址或者网址。
         */
        if (this.isExisted(strdate)){
            callback(this.buildfileurl(strdate));
            return;
        }
        /*
         * 缓存中不存在，开始下载
         */
        console.log("downloading " + url);
        try {
            blackberry.io.filetransfer.download(
                    url,
                    this.buildurl(strdate),
                    function(result) {
                        console.log("file downloaded,fullPath: " + result.fullPath);
                        callback("file://" + result.fullPath);
                    },
                    function(result) {
                        console.log("Download failed");
                        console.log("Error code: " + result.code);
                        console.log("HTTP status: " + result.http_status);
                        console.log("Source: " + result.source);
                        console.log("Target: " + result.target);
                        callback(url);
                    });
        }
        catch (e) {
            console.log(e);
            callback(url);
        }
    },
    isExisted: function(strdate) {
        /*
         * 确定是否已缓存
         */
        var url = this.buildfileurl(strdate);
        console.log("Checking: " + url);
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send(null);
        console.log(http.status);
        if (http.status == 0) return false;
        return true;
    },
    buildurl: function(str) {
        return blackberry.io.home + "/" + str + ".jpg";
    },
    buildfileurl: function(str) {
        return "file://" + this.buildurl(str);
    }
};
