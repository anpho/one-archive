var one = {
    getCopyRightInfo: function() {
        try {
            var cp = getJSON('http://211.152.49.184:7001/OneForWeb/onest/getCrInf');
            return cp["entCr"]["strCR"];
        } catch (e) {
            return null;
        }
    },
    getHpAdMultiInfoAsync: function(callback) {
        var datestr = new Date().toTimeString();
        this.getJSONAsync(datestr, 'hpmulti', 'http://211.152.49.184:7001/OneForWeb/one/getHpAdMultiinfo', function(u) {
            try {
                var cp = getJSON(u);
                if (cp['result'] === "SUCCESS") {
                    callback(cp);
                } else {
                    setTimeout(removeFile(datestr, 'hpmulti'), 0);
                    callback(null);
                }
            } catch (e) {
                console.log("[ONE]获取HPMULTI失败");
                console.log(e);
                setTimeout(removeFile(datestr, 'hpmulti'), 0);
                callback(null);
            }
        });
    },
    getHpAdMultiinfo: function() {
        //获取5天的广告与首页数据
        /*
         data:
         {
         "result": "SUCCESS/FAIL",
         "message": "Description",
         "hpAdMulitEntity": {
         "lstEntAd": [
         {
         "strAd1280720url": "http://pic.yupoo.com/hanapp/CWfa9OMH/w4NHA.jpg",
         "strAd480320url": "http://pic.yupoo.com/hanapp/CWfa9OMH/w4NHA.jpg",
         "strAd800480url": "http://pic.yupoo.com/hanapp/CWfa9OMH/w4NHA.jpg",
         "strAd960540url": "http://pic.yupoo.com/hanapp/CWfa9OMH/w4NHA.jpg",
         "strAdFutureurl": "http://pic.yupoo.com/hanapp/CWfa9OMH/w4NHA.jpg",
         "strAdId": "21",
         "strAdLinkUrl": "http://www.sportq.com/download/sportq.apk",
         "strAdOrder": "1",
         "strCloseTime": "2013-08-31",
         "strMarketTime": "2013-08-01",
         "strType": "2"
         }
         ],
         "lstEntHp": [
         {
         "sWebLk": "http://hanhan.qq.com/hanhan/one/one314m.htm",
         "strAuthor": "港湾&摄影/马德里小糖饼",
         "strContent": "浪荡天涯的孩子，忽晴忽雨的江湖，祝你有梦为马，永远随处可栖。by 大冰",
         "strDayDiffer": "1",
         "strHpId": "330",
         "strHpTitle": "VOL.314",
         "strLastUpdateDate": "2013-08-15 15:41:21",
         "strMarketTime": "2013-08-17",
         "strOriginalImgUrl": "http://pic.yupoo.com/hanapp/D5dAKZtU/oy6O7.jpg",
         "strThumbnailUrl": "http://pic.yupoo.com/hanapp/D5dAKZtU/oy6O7.jpg"
         }
         ]
         }
         }
         */
        var cp;
        try {
            cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getHpAdMultiinfo');
            if (cp["result"] === "SUCCESS") {
                return cp;
            }
        } catch (e) {
            return null;
        }
    },
    getLateds30dayPraiseNumber: function() {
        /*
         {
         "result":"SUCCESS",
         "lstContentPraise":[
         {"strContentId":"492",
         "strPraiseNumber":"6737"},
         {"strContentId":"491",
         "strPraiseNumber":"28389"},
         {"strContentId":"490",
         "strPraiseNumber":"22234"},
         {"strContentId":"487",
         "strPraiseNumber":"5037"},
         {"strContentId":"486",
         "strPraiseNumber":"9914"},
         {"strContentId":"485",
         "strPraiseNumber":"15558"},
         {"strContentId":"484",
         "strPraiseNumber":"14138"},
         {"strContentId":"483",
         "strPraiseNumber":"23276"},
         {"strContentId":"482",
         "strPraiseNumber":"13170"},
         {"strContentId":"480",
         "strPraiseNumber":"36382"}
         ]
         }
         */
        try {
            var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getLateds30dayPraiseNumber');
            return cp;
        } catch (e) {
            return null;
        }
    },
    getMobileDispDays: function() {
        /*
         {
         "result":"SUCCESS",
         "mobileDispCtrlDays":"10"
         }
         */
        try {
            var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getMobileDispDays');
            return cp;
        } catch (e) {
            return null;
        }
    },
    getTPage: function() {
        /*
         {
         "result":"SUCCESS",
         "entAPAndPos":
         {
         "lstConPos":["11"],
         "lstHpPos":["11"],
         "lstQuePos":["11"],
         "sConNum":"10",
         "sHpNum":"10",
         "sQNum":"10"
         }
         }
         */
        try {
            var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getTPage');
            return cp;
        } catch (e) {
            return null;
        }
    },
    getHomePageAsync: function(datestr, callback) {
        //    getJSONAsync: function(strdate, type, url, callback) 
        setTimeout(
                this.getJSONAsync(datestr, 'home', 'http://211.152.49.184:7001/OneForWeb/one/getHpinfo?strDate=' + datestr, function(u) {
                    try {
                        var cp = getJSON(u);
                        if (cp['result'] === "SUCCESS") {
                            callback(cp);
                        } else {
                            setTimeout(removeFile(datestr, 'home'), 0);
                            callback(null);
                        }
                    } catch (e) {
                        console.log("[ONE]获取首页数据出错" + e);
                        setTimeout(removeFile(datestr, 'home'), 0);
                        callback(null);
                    }
                }), 1);
    },
    getHomePage: function(datestr) {
        /*
         data:
         {
         "result": "SUCCESS/FAIL",
         "message": "Description",
         "hpEntity": {
         "sWebLk": "http://hanhan.qq.com/hanhan/one/one314m.htm",
         "strLastUpdateDate": "2013-08-15 15:41:21",
         "strMarketTime": "2013-08-17",
         "strDayDiffer": "1",
         "strHpId": "330",
         "strHpTitle": "VOL.314",
         "strAuthor": "港湾&摄影/马德里小糖饼",
         "strContent": "浪荡天涯的孩子，忽晴忽雨的江湖，祝你有梦为马，永远随处可栖。by 大冰",
         "strOriginalImgUrl": "http://pic.yupoo.com/hanapp/D5dAKZtU/oy6O7.jpg",
         "strThumbnailUrl": "http://pic.yupoo.com/hanapp/D5dAKZtU/oy6O7.jpg"
         }
         }
         */
        try {
            var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getHpinfo?strDate=' + datestr);
            return cp;
        } catch (e) {
            return null;
        }
    },
    getOneContentInfoAsync: function(datestr, callback) {
        //    getJSONAsync: function(strdate, type, url, callback) 
        setTimeout(
                this.getJSONAsync(datestr, 'content', 'http://211.152.49.184:7001/OneForWeb/one/getOneContentInfo?strDate=' + datestr, function(u) {
                    try {
                        var cp = getJSON(u);
                        if (cp['result'] === "SUCCESS") {
                            callback(cp);
                        } else {
                            setTimeout(removeFile(datestr, 'content'), 0);
                            callback(null);
                        }
                    } catch (e) {
                        console.log("[ONE]获取内容数据失败");
                        console.log(e);
                        setTimeout(removeFile(datestr, 'content'), 0);
                        callback(null);
                    }
                }), 1);
    },
    getOneContentInfo: function(datestr) {
        /*
         data:
         {
         "result": "SUCCESS/FAIL",
         "message": "Description",
         "contentEntity": {
         "sGW": "财色名食睡...",
         "sWebLk": "http://hanhan.qq.com/hanhan/one/one314m.htm#page1",
         "strLastUpdateDate": "2013-08-16 23:07:26",
         "strPraiseNumber": "4463",
         "strContAuthor": "大冰",
         "strContAuthorIntroduce": "（责任编辑：赵西栋）",
         "strContDayDiffer": "1",
         "strContMarketTime": "2013-08-17",
         "strContentId": "344",
         "strContTitle": "他们最幸福",
         "strContent": "
         这是篇演讲稿...
         \r\n
         大冰，主持人、民谣歌手；微博ID：@大冰<\/b><\/div>"
         }
         }
         */
        try {
            var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getOneContentInfo?strDate=' + datestr);
            return cp;
        } catch (e) {
            return null;
        }
    },
    getOneQuestionInfoAsync: function(datestr, callback) {
        //    getJSONAsync: function(strdate, type, url, callback) 
        setTimeout(
                this.getJSONAsync(datestr, 'question', 'http://211.152.49.184:7001/OneForWeb/one/getOneQuestionInfo?strDate=' + datestr, function(u) {
                    try {
                        var cp = getJSON(u);
                        if (cp['result'] === "SUCCESS") {
                            callback(cp);
                        } else {
                            console.log('[ONE]获取问题的API返回了FAIL，删除下载错误的文件。');
                            setTimeout(removeFile(datestr, 'question'), 0);
                            callback(null);
                        }
                    } catch (e) {
                        setTimeout(removeFile(datestr, 'question'), 0);
                        console.log("[ONE]API超时或数据错误。" + e);
                        callback(null);
                    }
                }), 1);
    },
    getOneQuestionInfo: function(datestr) {
        /*
         data:
         {
         "result": "SUCCESS/FAIL",
         "message": "Description",
         "questionAdEntity": {
         "sWebLk": "http://hanhan.qq.com/hanhan/one/one314m.htm#page2",
         "strDayDiffer": "1",
         "strLastUpdateDate": "2013-08-17 09:30:10",
         "strPraiseNumber": "2074",
         "strQuestionId": "325",
         "strQuestionMarketTime": "2013-08-17",
         "strQuestionTitle": "你想象中的天堂是什么样子的？"
         "strQuestionContent": "「一个」工作室问微信网友：有人把天堂想象成是一座图书馆...",
         "strAnswerTitle": "微信网友答「一个」工作室：",
         "strAnswerContent": "
         Ym：雨从云里落下来...
         \r\n...
         （责任编辑：赵西栋）
         ",
         }
         }
         */
        try {
            var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getOneQuestionInfo?strDate=' + datestr);
            return cp;
        } catch (e) {
            return null;
        }
    },
    isCached: function(strdate, type) {
        /*
         * 确定是否已缓存
         */
        var url = this.buildfileurl(strdate, type);
        console.log("检查是否已缓存 : " + url);
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send(null);
        console.log("状态码为 : " + http.status);
        if (http.status == 0)
            return false;
        return true;
    },
    buildfileurl: function(d, t) {
        return "file://" + this.buildurl(d, t);
    },
    buildurl: function(d, t) {
        return blackberry.io.home + "/" + d + t + ".json";
    },
    getJSONAsync: function(strdate, type, url, callback) {

        if (this.isCached(strdate, type)) {
            callback(this.buildfileurl(strdate, type));
        } else {
            console.log('正在下载 : ' + strdate + type);
            setTimeout(
                    this.geturlAsync(url, this.buildurl(strdate, type), callback), 1);
        }

    },
    geturlAsync: function(url, path, callback) {
        /*
         * 下载远程内容到本地
         * 如果成功，返回本地PATH
         * 如果不成功，返回URL自身
         */
        try {
            blackberry.io.filetransfer.download(
                    url,
                    path,
                    function(result) {
                        console.log("下载成功: " + result.fullPath);
                        callback("file://" + result.fullPath);
                    },
                    function(result) {
                        console.log("下载失败。");
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
    }
};

function removeFile(datestr, type) {
    /*
     * 删除下载到错误数据的文件。
     * 解释：
     * 由于使用的是filetransfer api，该API会直接将数据写入存储，有时会将RESULT=FAIL的也一起写进去。
     * 所以，在回调后，进行检测，如果发现存下了FAIL的数据或者其他错误数据，就把这种数据删除。
     */
    var path = blackberry.io.home + "/" + datestr + type + ".json";
    console.log('删除文件 >> ' + path);
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function(fs) {
        fs.root.getFile(path, {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log('文件已删除。');
            }, function(ex) {
                console.log(ex);
            });
        }, function(ex) {
            console.log(ex);
        });
    }, function(f) {
        console.log(f);
    });

}

function removeByDate(datestr) {
    var path = blackberry.io.home + "/" + datestr;
    console.log('删除文件 >> ' + path);
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function(fs) {
        fs.root.getFile(path + "home.json", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'home.json文件已删除。');
            }, function(ex) {
                console.log(ex);
            });
        }, function(ex) {
            console.log(ex);
        });
        fs.root.getFile(path + "content.json", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'content.json文件已删除。');
            }, function(ex) {
                console.log(ex);
            });
        }, function(ex) {
            console.log(ex);
        });
        fs.root.getFile(path + "question.json", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'question.json文件已删除。');
            }, function(ex) {
                console.log(ex);
            });
        }, function(ex) {
            console.log(ex);
        });
        fs.root.getFile(path + ".jpg", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + '.jpg 文件已删除。');
            }, function(ex) {
                console.log(ex);
            });
        }, function(ex) {
            console.log(ex);
        });
    }, function(f) {
        console.log(f);
    });
}