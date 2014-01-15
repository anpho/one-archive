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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.checkPlugin();
        navigator.splashscreen.show();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
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
            console.log('Pushing: ' + id);
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
                loadAvailableMags(element, id);
            }
            if (id === 'menu') {
                loadContent(element, id);


            }
        };

        bb.init(config);

        // 因为BBUI 0.9.6本身没有对黑暗主题的支持，这里需要手动将背景设置为黑色。
        if (darkColoring) {
            document.body.style['background-color'] = darkScreenColor;
            document.body.style['color'] = '#E6E6E6';
        }
        navigator.splashscreen.hide();
        bb.pushScreen('main.html', 'menu');
    }
};

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
    console.log(theme + " vs. " + usingDarkTheme);
    if (theme === usingDarkTheme) {
        return;
    } else {
        window.location.reload();
    }
}
;

function loadAvailableMags(element, id) {
    /*
     * 显示所有可看的杂志，包括缓存的和可下载的。
     */
    var historylist = gg(element, "historyList");

    var cached = findCachedMags();
    var available = findAvailableMags();
    /*
     * 数据格式： {title:328,strdate:2013-01-01}
     */
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
        item.setAttribute('data-bb-title', data[i]["strdate"] + " : " + data[i]["title"]);
        item.setAttribute('data-mrk-date', data[i]["strdate"]);
        item.innerHTML = data[i]["status"];
        item.onclick = function() {
            displaySelected();
        };
        items.push(item);
    }
    historylist.refresh(items);
}
;

function findCachedMags() {
    /*
     * 查找已缓存的杂志，根据本地存储中的2222-22-22title判断。
     * 返回数据格式： {title:328,strdate:2013-01-01}
     * 本地存储数据格式： 2014-01-08ask / 2014-01-18one / 2014-01-18home
     */

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
    return data;
}

function findAvailableMags() {
    /*
     * 查找可下载的杂志
     */
    var result = [];

    var data = one.getHpAdMultiinfo();
    if (data && (data["result"] === "SUCCESS")) {
        var hplist = data["hpAdMulitEntity"]["lstEntHp"];
        for (var i = 0; i < hplist.length; i++) {
            var dataitem = {};
            dataitem["title"] = hplist[i]["strHpTitle"];
            dataitem["strdate"] = hplist[i]["strMarketTime"];
            dataitem["status"] = "可下载";
            result.push(dataitem);
        }
    }
    return result;
}

function displaySelected() {
    /*
     * 往期刊物栏目中，单个元素被点击后的处理。
     */
    var selected = g('historyList').selected;
    console.log(selected.getAttribute("data-mrk-date"));
    currentdisplaydate = selected.getAttribute("data-mrk-date");
    localStorage.setItem('show', currentdisplaydate);
    oneloaded = false;
    homeloaded = false;
    qloaded = false;
    bb.popScreen();
}
var removeDuplicatesInPlace = function(arr) {
    /*
     * 删除数组中的重复元素
     */
    console.log("RemoveDuplicates in : " + arr);
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
        console.log(e);
        return null;
    }
}

function loadContent(element, id) {
    //载入内容，strdate是要显示的日期，此处显示当前日期。
    if (!currentdisplaydate) {
        if (localStorage.getItem('show')) {
            currentdisplaydate = localStorage.getItem('show');
        } else {
            var d = new Date();
            currentdisplaydate = d.format('yyyy-MM-dd');
            localStorage.setItem('show', currentdisplaydate);
        }
    }


    loadAll(element, currentdisplaydate);
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
        if (data === null)
            return;
        var data = da["hpEntity"];
        localStorage.setItem(strdate + 'title', data['strHpTitle']);
        gg(element, 'home-title').innerHTML = strdate;
        gg(element, 'home-vol').innerHTML = data['strHpTitle'];
        gg(element, 'home-img-by').innerHTML = data['strAuthor'].replace(/&/g, '<br/>');
        gg(element, 'home-content').innerHTML = data['strContent'];
        gg(element, 'home-content').style['fontSize'] = localStorage.getItem('fontsize');
        imgurl = data['strOriginalImgUrl'];
        console.log('主页已载入。');
        homeloaded = true;
        gg(element, 'spinner-1').hide();
        cache.get(imgurl, currentdisplaydate, function(u) {
            console.log("设置图片：" + u);
            g('home-img').src = u;
        });
    })
}
var homeloaded, oneloaded, qloaded, imgurl;
function removeChildNodes(node) {
    var children = node.childNodes;
    for (i = 0; i < children.length; i++) {
        node.removeChild(children[i]);
    }
}
function loadOne(e, strdate) {
    gg(e, 'spinner-2').show();
    //removeChildNodes(gg(e, "content"));
    one.getOneContentInfoAsync(strdate, function(c) {

        if (c === null)
            return;
        var content = c["contentEntity"];
        gg(e, 'c-brief').innerHTML = content['sGW'];
        gg(e, 'c-title').innerHTML = content['strContTitle'];
        gg(e, 'c-author-intro').innerHTML = content['strContAuthorIntroduce'];
        gg(e, 'c-author').innerHTML = content['strContAuthor'];
        gg(e, 'c-content').innerHTML = "<p>" + content['strContent'].replace(/<br>/g, "</p><p>") + "</p>";
        gg(e, 'c-content').style['fontSize'] = localStorage.getItem('fontsize');
        console.log('标题页已载入。');
        gg(e, 'spinner-2').hide();
        oneloaded = true;
    });

}

function loadQuestion(e, strdate) {
    gg(e, 'spinner-3').show();
    //removeChildNodes(gg(e, "ask"));
    one.getOneQuestionInfoAsync(strdate, function(a) {
        if (a === null)
            return;
        var ask = a['questionAdEntity'];
        gg(e, 'q-title').innerHTML = ask['strQuestionTitle'];
        gg(e, 'q-content').innerHTML = ask['strQuestionContent'];
        gg(e, 'q-content').style['fontSize'] = localStorage.getItem('fontsize');
        gg(e, 'a-title').innerHTML = ask['strAnswerTitle'];
        gg(e, 'a-content').innerHTML = ask['strAnswerContent'];
        gg(e, 'a-content').style['fontSize'] = localStorage.getItem('fontsize');
        console.log('问题已载入。');
        qloaded = true;
        gg(e, 'spinner-3').hide();
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
;

function goTo(e) {
    var cx = g(e).offsetTop;
    g('wrap').scrollTo(cx, 0);
}

var currentdisplaydate; //正在显示的《一个》的发布日期。

function clearCache() {
    var _theme = localStorage.getItem("theme");
    localStorage.clear();
    localStorage.setItem("theme", _theme);
    Toast.regular("缓存已清除", 1000);
    loadAvailableMags(document, 'reload');
}

function saveFont(f) {
    //字体大小
    var size = f.value;
    localStorage.setItem("fontsize", size);
}

