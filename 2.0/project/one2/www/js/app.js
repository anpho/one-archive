var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //window.addEventListener('oncontextmenu', app.onContextMenu);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.checkPlugin();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('收到事件: ' + id);
        app.bbuistart();
    },
    bbuistart: function() {

        // 确保只执行一次
        if (webworksreadyFired)
            return;
        webworksreadyFired = true;
        var config;

        // 主题配置
        if (darkColoring) {
            config = {
                controlsDark: true,
                listsDark: true
            };
        } else {
            config = {
                controlsDark: false,
                listsDark: false,
                coloredTitleBar: true
            };
        }

        // 在DOM显示之前的配置
        config.onscreenready = function(element, id) {
            console.log('载入页面: ' + id);
            if (darkColoring) {
                var screen = element.querySelector('[data-bb-type=screen]');
                if (screen) {
                    screen.style['background-color'] = darkScreenColor;
                }
            }
            if (id === 'settings') {
                loadSettings(element, id);
            }


        };

        // 在DOM显示之后的配置
        config.ondomready = function(element, id, params) {
            if (id === 'showCalendar') {
                loadAvailableMagsAsync(element);
                Hammer(gg(element, 'cal')).on('swiperight', function(ev) {
                    if (ev.gesture.distance > 200) {
                        bb.popScreen();
                    }
                });
            }
            if (id === 'menu') {
                loadContent(element, id);
                Hammer(gg(element, 'wrap')).on('swiperight', function(ev) {
                    if (ev.gesture.distance > 200) {
                        goNext();
                    }
                }).on('swipeleft', function(ev) {
                    if (ev.gesture.distance > 200) {
                        //Prev Day
                        goPrev();
                    }
                });
                shortcut.remove("T");
                shortcut.remove("B");
                shortcut.remove("0");
                shortcut.remove("P");
                shortcut.remove("N");
                shortcut.remove("space");

                shortcut.add("T", function() {
                    g('wrap').scrollTo(0, 0);
                });
                shortcut.add("B", function() {
                    g('wrap').scrollTo(g('ask').offsetTop + g('ask').scrollHeight, 0);
                });
                shortcut.add("0", function() {
                    g('wrap').scrollTo(g('home').parentNode.parentNode.scrollTop - 700, 0);
                });
                shortcut.add("P", function() {
                    //上一期
                    goPrev();
                });
                shortcut.add("N", function() {
                    //下一期
                    goNext();
                });
                shortcut.add("space", function() {
                    g('wrap').scrollTo(g('home').parentNode.parentNode.scrollTop + 700, 0);
                });



            }
            if (id === 'cached') {
                loadCachedMagsAsync(element);
                Hammer(gg(element, 'cca')).on('swiperight', function() {
                    bb.popScreen();
                })
            }

        };

        bb.init(config);

        // 因为BBUI 0.9.6本身没有对黑暗主题的支持，这里需要手动将背景设置为黑色。
        if (darkColoring) {
            document.body.style['background-color'] = darkScreenColor;
            document.body.style['color'] = '#E6E6E6';
        }
        bb.pushScreen('main.html', 'menu');
    }
};
function goNext() {
    //Next Day
    var d = new Date(currentdisplaydate);
    d.setDate(d.getDate() + 1);
    var today = new Date();
    if (today.format('yyyy-MM-dd') < d.format('yyyy-MM-dd')) {
        Toast.regular("没有之后的内容", 1000)
        return;
    } else {
        currentdisplaydate = d.format('yyyy-MM-dd');
        //Toast.regular("正在载入" + currentdisplaydate + "的内容", 1000);
        g('wrap').scrollTo(0, 0);
        loadContent(document, '');
    }
}
function goPrev() {
    var d = new Date(currentdisplaydate);
    d.setDate(d.getDate() - 1);
    var fday = new Date();
    fday.setDate(fday.getDate() - 10);
    if (fday.format('yyyy-MM-dd') >= d.format('yyyy-MM-dd')) {
        Toast.regular("没有之前的内容", 1000)
        return;
    } else {
        currentdisplaydate = d.format('yyyy-MM-dd');
        g('wrap').scrollTo(0, 0);
        loadContent(document, '');
    }
}
function loadSettings(element, id) {
    // 读取配置数据
    // 读取配置数据
    var fonts = element.getElementById('drop');
    var size = localStorage.getItem("fontsize");

    if (size == null) {
        fonts.options[2].setAttribute('selected', 'true');
    } else {
        for (var i = 0; i < 5; i++) {
            if (fonts.options[i].value == size) {
                fonts.options[i].setAttribute('selected', 'true');
                break;
            }
        }
    }

    var togglebutton = element.getElementById('themeToggle');
    var theme = localStorage.getItem("theme");

    if ('true' === theme) {
        usingDarkTheme = true;
        togglebutton.setAttribute('data-bb-checked', 'true');
    } else {
        usingDarkTheme = false;
        togglebutton.setAttribute('data-bb-checked', 'false');
    }
    bb.refresh();
}
;

function saveSettings(e) {
    if (e.checked) {
        console.log(">>使用黑色主题.");
        localStorage.setItem("theme", "true");
    } else {
        console.log(">>使用亮色主题.");
        localStorage.setItem("theme", "false");
    }
}
;

function refreshTheme() {
    var theme = localStorage.getItem("theme");
    if (theme === usingDarkTheme) {
        return;
    } else {
        window.location.reload();
    }
}


function loadAvailableMagsAsync(element) {
    findCachedMagsAsync(function(cached) {
        findAvailableMagsAsync(function(available) {
            gg(element, 'spinner-4').hide();
            var historylist = gg(element, "historyList");
            var data;
            if (available) {
                data = removeDuplicatesInPlace(cached.concat(available)).sort(function(a, b) {
                    if (a["strdate"] > b["strdate"]) {
                        return -1;
                    } else if (a["strdate"] === b["strdate"]) {
                        return 0;
                    } else {
                        return 1;
                    }
                });
            } else {
                data = cached;
            }
            var items = [];
            var item;
            for (var i = 0; i < data.length; i++) {
                item = document.createElement('div');
                item.setAttribute('data-bb-type', 'item');
                item.setAttribute('data-bb-title', data[i]["strdate"] + "  " + data[i]["title"]);
                item.setAttribute('data-mrk-date', data[i]["strdate"]);
                item.innerHTML = data[i]["status"];
                item.onclick = function() {
                    displaySelected();
                };
                items.push(item);
            }
            historylist.refresh(items);
        });
    });

}
function loadCachedMagsAsync(element) {
    /*
     * 查找并显示已缓存的内容
     * @param {type} cached
     */
    setTimeout(
            findCachedMagsAsync(function(data) {
                data = data.sort(function(a, b) {
                    if (a["strdate"] > b["strdate"]) {
                        return -1;
                    } else if (a["strdate"] === b["strdate"]) {
                        return 0;
                    } else {
                        return 1;
                    }
                });
                var cachedmags = gg(element, "cachedmags");
                cachedmags.clear();
                var items = [];
                var item;
                for (var i = 0; i < data.length; i++) {
                    item = document.createElement('div');
                    item.setAttribute('data-bb-type', 'item');
                    item.setAttribute('data-bb-title', data[i]["strdate"]);
                    item.setAttribute('data-mrk-date', data[i]["strdate"]);
                    item.innerHTML = data[i]["status"];
                    item.onbtnclick = function() {
                        deleteSelected();
                    };
                    items.push(item);
                }
                cachedmags.refresh(items);
            }), 0);
}
function deleteSelected() {
    var selected = g('cachedmags').selected;
    console.log('[ONE]删除已缓存的内容 : ' + selected.getAttribute("data-mrk-date"));
    var d = selected.getAttribute("data-mrk-date");
    try {
        localStorage.removeItem(d.concat('title'));
        removeByDate(d);
    } catch (e) {
        console.log(e);
    }
    loadCachedMagsAsync(document);
}
function findCachedMagsAsync(callback) {
    /*
     * 查找已缓存的杂志，根据本地存储中的2222-22-22title判断。
     * 返回数据格式： {title:328,strdate:2013-01-01}
     * 本地存储数据格式： 2014-01-08ask / 2014-01-18one / 2014-01-18home
     */
    setTimeout(function() {

        var data = [];
        var itemkey;
        var reg = /^\d{4}-\d{2}-\d{2}title$/i;


        for (var i = 0; i < localStorage.length; i++) {
            itemkey = localStorage.key(i);
            if (reg.test(itemkey)) {
                var itemdata = {};
                itemdata["title"] = localStorage.getItem(itemkey);
                itemdata["strdate"] = itemkey.substr(0, 10);
                itemdata["status"] = "已缓存";
                data.push(itemdata);
            }
        }
        callback(data);
    }, 0);

}

function findAvailableMagsAsync(callback) {
    var result = [];
    for (var i = 0; i < 10; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        var dataitem = {};
        dataitem['title'] = "";
        dataitem['strdate'] = d.format('yyyy-MM-dd');
        dataitem['status'] = "可下载";
        result.push(dataitem)
    }
    callback(result);
    /*
     one.getHpAdMultiInfoAsync(function(data) {
     var result = [];
     if (data && (data["result"] === "SUCCESS")) {
     var hplist = data["hpAdMulitEntity"]["lstEntHp"];
     for (var i = 0; i < hplist.length; i++) {
     var dataitem = {};
     dataitem["title"] = hplist[i]["strHpTitle"];
     dataitem["strdate"] = hplist[i]["strMarketTime"];
     dataitem["status"] = "可下载";
     result.push(dataitem);
     }
     callback(result);
     }
     })
     */
}

function displaySelected() {
    /*
     * 往期刊物栏目中，单个元素被点击后的处理。
     */
    var selected = g('historyList').selected;
    console.log(selected.getAttribute("data-mrk-date") + " 被点击，准备显示。");
    currentdisplaydate = selected.getAttribute("data-mrk-date");
    sessionStorage.setItem('show', currentdisplaydate);
    oneloaded = false;
    homeloaded = false;
    qloaded = false;
    bb.pushScreen('main.html', 'menu');
}
var removeDuplicatesInPlace = function(arr) {
    /*
     * 删除数组中的重复元素
     */
    var i, j, cur;
    for (i = arr.length - 1; i >= 0; i--) {
        cur = arr[i];
        for (j = i - 1; j >= 0; j--) {
            if (cur["strdate"] === arr[j]["strdate"]) {
                if (i !== j) {
                    arr.splice(i, 1);
                }
            }
        }
    }
    return arr;
};

function getJSON(URL) {
    //URL 参数要以 "http://" 开始。
    try {
        var result = community.curl.get(URL);
        return JSON.parse(result);
    } catch (e) {
        console.log('获取数据出错，将返回NULL并删除下载错误的文件。');
        return null;
    }
}

function loadContent(element, id) {
    //载入内容，strdate是要显示的日期，此处显示当前日期。
    if (!currentdisplaydate) {
        if (sessionStorage.getItem('show')) {
            currentdisplaydate = sessionStorage.getItem('show');
        } else {
            var d = new Date();
            currentdisplaydate = d.format('yyyy-MM-dd');
            sessionStorage.setItem('show', currentdisplaydate);
        }
    }
    cleanContent(element);
    loadAll(element, currentdisplaydate);
}
function cleanContent(element) {
    gg(element, 'home-img').style.display = 'none';
    gg(element, 'home-vol').innerHTML = "";
    gg(element,'home-pbdate').innerHTML="";
    gg(element,'home-title').innerHTML='';
    gg(element, 'home-img-by').innerHTML = "";
    gg(element, 'home-content').innerHTML = "";
    gg(element, 'content').style.display = 'none';
    gg(element, 'ask').style.display = 'none';
    gg(element, 'c-title').innerHTML = "";
    gg(element, 'c-author').innerHTML = "";
    gg(element, 'c-author-intro').innerHTML = "";
    gg(element, 'c-brief').innerHTML = "";
    gg(element, 'c-content').innerHTML = "";
    gg(element, 'q-title').innerHTML = "";
    gg(element, 'q-content').innerHTML = "";
    gg(element, 'a-title').innerHTML = "";
    gg(element, 'a-content').innerHTML = "";
}


function g(id) {
    //因为没在用jQuery，这里简化了两个方法。
    return gg(document, id);
}

function gg(doc, id) {
    return doc.getElementById(id);
}

function loadAll(element, strdate) {
    //载入所有内容

    //载入封面
    loadhome(element, strdate);
    loadOne(element, strdate);
    loadQuestion(element, strdate);

}

function loadhome(element, strdate) {
    //载入封面
    //removeChildNodes(gg(element, "home"));
    gg(element, 'spinner-1').show();
    one.getHomePageAsync(strdate, function(da) {
        if (data === null) {
            Toast.regular("载入首页数据失败，请检查网络连接后重试。", 1000);
            gg(element, 'home-img').style.display = "block";
            gg(element, 'spinner-1').hide();
            return;
        }
        var data = da["hpEntity"];
        localStorage.setItem(strdate + 'title', data['strHpTitle']);
        gg(element, 'home-title').innerHTML = strdate.substr(0,7);
        gg(element, 'home-pbdate').innerHTML = strdate.substr(8,2);
        gg(element, 'home-vol').innerHTML = data['strHpTitle'];
        gg(element, 'home-img-by').innerHTML = data['strAuthor'].replace(/&/g, ' ');
        gg(element, 'home-content').innerHTML = data['strContent'];
        gg(element, 'home-content').style['fontSize'] = localStorage.getItem('fontsize');
        imgurl = data['strOriginalImgUrl'];
        console.log('主页已载入。');
        homeloaded = true;
        gg(element,'ab').hide();
        cache.get(imgurl, currentdisplaydate, function(u) {
            console.log("设置图片：" + u);
            g('home-img').src = u;
            g('home-img').style.display = "block";
            gg(element, 'spinner-1').hide();
        });
    });
}
var homeloaded, oneloaded, qloaded, imgurl;
function removeChildNodes(node) {
    var children = node.childNodes;
    for (i = 0; i < children.length; i++) {
        node.removeChild(children[i]);
    }
}
function loadOne(e, strdate) {
    //gg(e, 'spinner-2').show();
    //removeChildNodes(gg(e, "content"));
    one.getOneContentInfoAsync(strdate, function(c) {

        if (c === null) {
            Toast.regular("载入文章内容失败，请检查网络连接后重试。", 1000);
            //gg(element, 'spinner-2').hide();
            return;
        }
        var content = c["contentEntity"];
        gg(e, 'c-brief').innerHTML = content['sGW'];
        gg(e, 'c-title').innerHTML = content['strContTitle'];
        gg(e, 'c-author-intro').innerHTML = content['strContAuthorIntroduce'];
        gg(e, 'c-author').innerHTML = content['strContAuthor'];
        gg(e, 'c-content').innerHTML = "<p>" + content['strContent'].replace(/<br>/g, "</p><p>") + "</p>";
        gg(e, 'c-content').style['fontSize'] = localStorage.getItem('fontsize');
        console.log('内容已载入。');
        gg(e, 'content').style.display = 'block';
        //gg(e, 'spinner-2').hide();
        oneloaded = true;
    });

}

function loadQuestion(e, strdate) {
    //gg(e, 'spinner-3').show();
    //removeChildNodes(gg(e, "ask"));
    one.getOneQuestionInfoAsync(strdate, function(a) {
        if (a === null) {
            Toast.regular("载入文章内容失败，请检查网络连接后重试。", 1000);
            //gg(element, 'spinner-3').hide();
            return;
        }
        var ask = a['questionAdEntity'];
        gg(e, 'q-title').innerHTML = ask['strQuestionTitle'];
        gg(e, 'q-content').innerHTML = ask['strQuestionContent'];
        gg(e, 'q-content').style['fontSize'] = localStorage.getItem('fontsize');
        gg(e, 'a-title').innerHTML = ask['strAnswerTitle'];
        gg(e, 'a-content').innerHTML = ask['strAnswerContent'];
        gg(e, 'a-content').style['fontSize'] = localStorage.getItem('fontsize');
        console.log('问题已载入。');
        gg(e, 'ask').style.display = 'block';
        qloaded = true;
        //gg(e, 'spinner-3').hide();
    });

}

Date.prototype.format = function(format) {
    //对Date对象的扩展，实现日期格式化功能。
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

function showTab(id) {
    //显示到指定栏目 var homeloaded,oneloaded,qloaded;
    if (id === 'home') {
        goTo('home');
    } else if (id === 'content') {
        goTo('content');
    } else if (id === 'question') {
        goTo('ask');
    }
}

/*
 * 滚动到指定元素位置
 * @param {type} e
 * @returns {undefined}
 */
function goTo(e) {
    var cx = g(e).offsetTop;
    g('wrap').scrollTo(cx, 0);
}

var currentdisplaydate; //正在显示的《一个》的发布日期。
/*
 * 清空缓存内容
 */
function clearCache() {
    var _theme = localStorage.getItem("theme");
    var _fontsize = localStorage.getItem('fontsize');
    localStorage.clear();
    localStorage.setItem("theme", _theme);
    localStorage.setItem('fontsize', _fontsize);
    Toast.regular("缓存已清除", 1000);
    loadAvailableMags(document, 'reload');
}

function saveFont(f) {
    //字体大小
    var size = f.value;
    localStorage.setItem("fontsize", size);
}
var lastpos = 0;
var showActionBar = true;
function tabswitcher() {
    //滚动时自动激活对应的TAB
    var ruler = g('home').parentNode.parentNode;
    if (ruler.scrollTop < g('content').offsetTop) {
        bb.actionBar.highlightAction(g('a1'));
    } else if (ruler.scrollTop < g('ask').offsetTop)
    {
        bb.actionBar.highlightAction(g('a2'));
    } else {
        bb.actionBar.highlightAction(g('a3'));
    }

    //向下滚动时隐掉ACTIONBAR，向上滚动时显示
    if (ruler.scrollTop < 5) {
        setTimeout(function() {
            if (showActionBar)
                g('ab').hide();
        }, 300);
    } else if (ruler.scrollTop > lastpos) {
        showActionBar = false;
        setTimeout(function() {
            if (!showActionBar)
                g('ab').hide();
        }, 300);
    } else {
        showActionBar = true;
        setTimeout(function() {
            if (showActionBar)
                g('ab').show();
        }, 300);

    }
    lastpos = ruler.scrollTop;
}
///////////////////////////////////////////文字选择与共享////////////////////////////////////////////////



function shareText() {
    var selectedItem = getSelText();
    if (selectedItem) {
        Invoke.shareText(selectedItem);
    } else {
        Toast.regular("您未选择要分享的内容", 1000);
    }
}

function getSelText()
{
    if (window.getSelection)
    {
        return window.getSelection();
    }
    else if (document.getSelection)
    {
        return  document.getSelection();
    }
    else if (document.selection)
    {
        return  document.selection.createRange().text;
    }
    else
        return "";
}