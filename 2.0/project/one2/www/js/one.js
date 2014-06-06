var one = {
    getHpAdMultiInfoAsync: function(callback) {
        var datestr = new Date().toTimeString();
        this.getJSONAsync(datestr, 'hpmulti', 'http://bea.wufazhuce.com:7001/OneForWeb/one/getHpAdMultiinfo', function(u) {
            try {
                $.getJSON(u).done(function(cp) {
                    if (cp['result'] === "SUCCESS") {
                        callback(cp);
                    } else {
                        setTimeout(removeFile(datestr, 'hpmulti'), 0);
                        callback(null);
                    }
                }).fail(function(c) {
                    setTimeout(removeFile(datestr, 'hpmulti'), 0);
                    callback(null);
                })
            } catch (e) {
                console.error("[ONE]获取HPMULTI失败");
                console.error(e);
                setTimeout(removeFile(datestr, 'hpmulti'), 0);
                callback(null);
            }
        });
    },
    getHomePageAsync: function(datestr, callback) {
        this.getJSONAsync(datestr, 'home', 'http://bea.wufazhuce.com:7001/OneForWeb/one/getHpinfo?strDate=' + datestr, function(u) {
            try {
                $.getJSON(u).done(function(cp) {
                    if (cp['result'] === "SUCCESS") {
                        callback(cp);
                    } else {
                        setTimeout(removeFile(datestr, 'home'), 1);
                        callback(null);
                    }
                }).fail(function(c) {
                    setTimeout(removeFile(datestr, 'home'), 1);
                    callback(null);
                });
            } catch (e) {
                console.error("[ONE]获取首页数据出错" + e);
                setTimeout(removeFile(datestr, 'home'), 0);
                callback(null);
            }
        })
    },
    getOneContentInfoAsync: function(datestr, callback) {

        this.getJSONAsync(datestr, 'content', 'http://bea.wufazhuce.com:7001/OneForWeb/one/getOneContentInfo?strDate=' + datestr, function(u) {
            try {
                $.getJSON(u).done(function(cp) {
                    if (cp['result'] === "SUCCESS") {
                        callback(cp);
                    } else {
                        setTimeout(removeFile(datestr, 'content'), 0);
                        callback(null);
                    }
                }).fail(function(c) {
                    setTimeout(removeFile(datestr, 'content'), 0);
                    callback(null);
                });

            } catch (e) {
                console.error("[ONE]获取内容数据失败");
                console.error(e);
                setTimeout(removeFile(datestr, 'content'), 0);
                callback(null);
            }
        });
    },
    getOneThingAsync: function(datestr, callback) {
        var strRow=4;
        this.getJSONAsync(datestr, 'thing', 'http://bea.wufazhuce.com:7001/OneForWeb/one/o_f?strRow=5&strDate=' + datestr, function(u) {
            try {
                $.getJSON(u).done(function(cp) {
                    if (cp['rs'] === "SUCCESS") {
                        callback(cp);
                    } else {
                        setTimeout(removeFile(datestr, 'thing'), 0);
                        callback(null);
                    }
                }).fail(function(c) {
                    setTimeout(removeFile(datestr, 'thing'), 0);
                    callback(null);
                });

            } catch (e) {
                console.error("[ONE]获取东西数据失败");
                console.error(e);
                setTimeout(removeFile(datestr, 'thing'), 0);
                callback(null);
            }
        });
    },
    getOneQuestionInfoAsync: function(datestr, callback) {
        this.getJSONAsync(datestr, 'question', 'http://bea.wufazhuce.com:7001/OneForWeb/one/getOneQuestionInfo?strDate=' + datestr, function(u) {
            try {
                $.getJSON(u).done(function(cp) {
                    if (cp['result'] === "SUCCESS") {
                        callback(cp);
                    } else {
                        console.error('[ONE]获取问题的API返回了FAIL，删除下载错误的文件。');
                        setTimeout(removeFile(datestr, 'question'), 0);
                        callback(null);
                    }
                }).fail(function(c) {
                    console.error('[ONE]获取问题的API返回了FAIL，删除下载错误的文件。');
                    setTimeout(removeFile(datestr, 'question'), 0);
                    callback(null);
                });
            } catch (e) {
                setTimeout(removeFile(datestr, 'question'), 0);
                console.error("[ONE]API超时或数据错误。" + e);
                callback(null);
            }
        });
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
                    this.geturlAsync(url, this.buildurl(strdate, type), callback), 0)
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
                        console.error("下载失败。");
                        console.error("Error code: " + result.code);
                        console.error("HTTP status: " + result.http_status);
                        console.error("Source: " + result.source);
                        console.error("Target: " + result.target);
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
    if (global_fs) {
        global_fs.root.getFile(path, {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log('文件已删除。');
            }, function(ex) {
                console.error(ex);
            });
        }, function(ex) {
            console.error(ex);
        });
    } else {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function(fs) {
            global_fs = fs;
            global_fs.root.getFile(path, {
                create: false
            },
            function(fileEntry) {
                fileEntry.remove(function() {
                    console.log('文件已删除。');
                }, function(ex) {
                    console.error(ex);
                });
            }, function(ex) {
                console.error(ex);
            });
        }, function(f) {
            console.error(f);
        });
    }
    console.log('删除文件 >> ' + path);


}
var global_fs = null;
function removeByDate(datestr) {
    var path = blackberry.io.home + "/" + datestr;
    console.log('删除文件 >> ' + path);
    if (global_fs) {
        global_fs.root.getFile(path + "home.json", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'home.json文件已删除。');
            }, function(ex) {
                console.error(ex);
            });
        }, function(ex) {
            console.error(ex);
        });
        global_fs.root.getFile(path + "content.json", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'content.json文件已删除。');
            }, function(ex) {
                console.error(ex);
            });
        }, function(ex) {
            console.error(ex);
        });
        global_fs.root.getFile(path + "question.json", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'question.json文件已删除。');
            }, function(ex) {
                console.error(ex);
            });
        }, function(ex) {
            console.error(ex);
        });
        global_fs.root.getFile(path + "thing.json", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'thing.json文件已删除。');
            }, function(ex) {
                console.error(ex);
            });
        }, function(ex) {
            console.error(ex);
        });
        global_fs.root.getFile(path + ".jpg", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + '.jpg 文件已删除。');
            }, function(ex) {
                console.error(ex);
            });
        }, function(ex) {
            console.error(ex);
        });
        global_fs.root.getFile(path + "T.jpg", {
            create: false
        },
        function(fileEntry) {
            fileEntry.remove(function() {
                console.log(path + 'T.jpg 文件已删除。');
            }, function(ex) {
                console.error(ex);
            });
        }, function(ex) {
            console.error(ex);
        });
    } else {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function(fs) {
            global_fs = fs;
            global_fs.root.getFile(path + "home.json", {
                create: false
            },
            function(fileEntry) {
                fileEntry.remove(function() {
                    console.log(path + 'home.json文件已删除。');
                }, function(ex) {
                    console.error(ex);
                });
            }, function(ex) {
                console.error(ex);
            });
            global_fs.root.getFile(path + "content.json", {
                create: false
            },
            function(fileEntry) {
                fileEntry.remove(function() {
                    console.log(path + 'content.json文件已删除。');
                }, function(ex) {
                    console.error(ex);
                });
            }, function(ex) {
                console.error(ex);
            });
            global_fs.root.getFile(path + "question.json", {
                create: false
            },
            function(fileEntry) {
                fileEntry.remove(function() {
                    console.log(path + 'question.json文件已删除。');
                }, function(ex) {
                    console.error(ex);
                });
            }, function(ex) {
                console.error(ex);
            });
            global_fs.root.getFile(path + ".jpg", {
                create: false
            },
            function(fileEntry) {
                fileEntry.remove(function() {
                    console.log(path + '.jpg 文件已删除。');
                }, function(ex) {
                    console.error(ex);
                });
            }, function(ex) {
                console.error(ex);
            });
        }, function(f) {
            console.error(f);
        });
    }

}