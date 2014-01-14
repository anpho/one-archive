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

            if (id === 'menu') {
                loadContent(element, id);
            }
        };

        // 在DOM显示之后的配置
        config.ondomready = function(element, id, params) {
            if (id === 'showCalendar') {
                loadAvailableMags(element, id);
            }
            if (id === 'menu') {
                cache.get(imgurl, currentdisplaydate, function(u) {
                    console.log("设置图片：" + u);
                    g('hppic').src = u;
                });
            }
        };

        bb.init(config);

        // 因为BBUI 0.9.6本身没有对黑暗主题的支持，这里需要手动将背景设置为黑色。
        if (darkColoring) {
            document.body.style['background-color'] = darkScreenColor;
            document.body.style['color'] = 'white';
        }
        bb.pushScreen('main.html', 'menu');
    }
};

function loadSettings(element, id) {
    // 读取配置数据
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
     * 本地存储数据格式： 2014-01-08ask / 2014-01-18one / 2014-01-18home / 2014-01-18pic / 2014-01-18title
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
        Toast.regular("网络不可用，请重试", 1000);
        console.log(e);
        return null;
    }
}

function loadContent(element, id) {
    //载入内容，strdate是要显示的日期，此处显示当前日期。
    if (!currentdisplaydate) {
        var d = new Date();
        currentdisplaydate = d.format('yyyy-MM-dd');
    }


    loadAll(element, currentdisplaydate);

    //定位到HOME处。
    //showTab('home');
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
    /*
     * <div data-bb-type="panel-header" id="home-title"></div>
     
     <div style="width:100%;text-align: center;">
     <img id="home-img" style="width:100%">
     <div style="clear:both"></div>
     <br/>
     <div style="float:left;font-size: 120%;" id="home-vol"></div>
     <div style="float:right;text-align: right" id="home-img-by"></div>
     <div style="clear:both"></div>
     <br/>
     </div>
     <div style="width:100%;text-align: right;" id="home-content"></div>
     */
    //载入封面
    var data;
    if (localStorage[strdate + 'home']) {
        //如果已经缓存，就从缓存中读取
        data = JSON.parse(localStorage[strdate + 'home']);
    } else {
        //否则就要访问官方API获取
        try {
            data = one.getHomePage(strdate)["hpEntity"];
        } catch (e) {
            return;
        }
        setTimeout(function() {
            //1000MS后存入缓存，这里避免内容太大，导致存入缓存的时候时间太长，产生延迟。
            localStorage[strdate + 'home'] = JSON.stringify(data);
            localStorage[strdate + 'title'] = data['strHpTitle'];
        }, 1000);
    }
    removeChildNodes(gg(element, "home"));
    var ofragment = document.createDocumentFragment();
    var home_title = document.createElement("div");
    home_title.setAttribute("data-bb-type", "panel-header");
    home_title.appendChild(document.createTextNode(strdate));
    ofragment.appendChild(home_title);

    var picdiv = document.createElement("div");
    picdiv.style.width = "100%";
    picdiv.style.textAlign = "center";
    var pic = document.createElement("img");
    pic.style.width = "100%";
    pic.id = 'hppic';
    picdiv.appendChild(pic);
    imgurl = data['strOriginalImgUrl'];
    var clearnode = document.createElement("div");
    clearnode.style.clear = "both";
    clearnode.style.height = "20px";
    picdiv.appendChild(clearnode);
    var home_vol = document.createElement("div");
    home_vol.style["float"] = "left";
    home_vol.style["fontSize"] = "120%";
    home_vol.appendChild(document.createTextNode(data['strHpTitle']));
    picdiv.appendChild(home_vol);
    var home_imgby = document.createElement("div");
    home_imgby.style["float"] = "right";
    home_imgby.style["textAlign"] = "right";
    home_imgby.innerHTML = data['strAuthor'].replace(/&/g, '<br/>');
    picdiv.appendChild(home_imgby);
    var clearnode2 = clearnode.cloneNode();
    picdiv.appendChild(clearnode2);
    ofragment.appendChild(picdiv);
    var home_content = document.createElement("div");
    home_content.style["width"] = "100%";
    home_content.style["textAlign"] = "right";
    home_content.innerHTML = data['strContent'];
    ofragment.appendChild(home_content);
    gg(element, "home").appendChild(ofragment);
    console.log('主页已载入。');
    homeloaded = true;
}
var homeloaded, oneloaded, qloaded, imgurl;
function removeChildNodes(node) {
    var children = node.childNodes;
    for (i = 0; i < children.length; i++) {
        node.removeChild(children[i]);
    }
}
function loadOne(e, strdate) {
    /*
     * <div data-bb-type="panel-header" style="font-size: 120%;" id="c-title">请稍候</div>
     <div style="clear:both"></div>
     <div style="font-size:100%;float:left" id="c-author"></div>
     <div style="font-size:80%;font-style: italic; float:right;" id="c-author-intro"></div>
     <div style="clear:both"></div>
     <br/>
     <div style="font-size:80%" id="c-brief"></div>
     <hr/>
     <div style='text-indent:2em' id="c-content"></div>
     */
    var content;
    if (localStorage[strdate + 'one']) {
        content = JSON.parse(localStorage[strdate + 'one']);
    } else {
        try {
            content = one.getOneContentInfo(strdate)["contentEntity"];
        } catch (e) {
            return;
        }
        setTimeout(function() {
            localStorage[strdate + 'one'] = JSON.stringify(content);
        }, 1000);
    }
    removeChildNodes(gg(e, "content"));

    var ofr = document.createDocumentFragment();
    var title = document.createElement("div");
    title.setAttribute("data-bb-type", "panel-header");
    title.style["fontSize"] = "120%";
    title.appendChild(document.createTextNode(content['strContTitle']));
    ofr.appendChild(title);
    var clearnode = document.createElement("div");
    clearnode.style.clear = "both";
    clearnode.style.height = "20px";
    ofr.appendChild(clearnode);
    var author = document.createElement("div");
    author.style["float"] = "left";
    author.appendChild(document.createTextNode(content['strContAuthor']));
    ofr.appendChild(author);
    var intro = document.createElement("div");
    intro.style["fontSize"] = "80%";
    intro.style["fontStyle"] = "italic";
    intro.style["float"] = "right";
    intro.appendChild(document.createTextNode(content['strContAuthorIntroduce']));
    ofr.appendChild(intro);
    ofr.appendChild(clearnode.cloneNode());
    var brief = document.createElement("div");
    brief.style["fontSize"] = "80%";
    brief.appendChild(document.createTextNode(content['sGW']));
    ofr.appendChild(brief);
    ofr.appendChild(document.createElement("hr"));
    var ct = document.createElement("div");
    ct.style["textIndent"] = "2em";
    ct.innerHTML = "<p>" + content['strContent'].replace(/<br>/g, "</p><p>") + "</p>";
    ofr.appendChild(ct);
    gg(e, "content").appendChild(ofr);
    console.log('标题页已载入。');
    oneloaded = true;
}

function loadQuestion(e, strdate) {
    /*
     <div data-bb-type="panel-header" style="font-size: 120%;" id="q-title">请稍候</div>
     <br/>
     <div id="q-content"></div>
     <br/>
     <div data-bb-type="panel-header" id="a-title"></div>
     <br/>
     <div id="a-content"></div>
     */
    removeChildNodes(gg(e, "ask"));
    var ask;
    if (localStorage[strdate + 'ask']) {
        ask = JSON.parse(localStorage[strdate + 'ask']);
    } else {
        try {
            ask = one.getOneQuestionInfo(strdate)['questionAdEntity'];
        } catch (e) {
            return;
        }
        setTimeout(function() {
            localStorage[strdate + 'ask'] = JSON.stringify(ask);
        }, 1000);
    }
    var ofr = document.createDocumentFragment();
    var title = document.createElement("div");
    title.setAttribute("data-bb-type", "panel-header");
    title.style["fontSize"] = "120%";
    title.appendChild(document.createTextNode(ask['strQuestionTitle']));
    ofr.appendChild(title);
    ofr.appendChild(document.createElement("br"));
    var content = document.createElement("div");
    content.innerHTML = ask['strQuestionContent'];
    ofr.appendChild(content);
    ofr.appendChild(document.createElement("br"));
    var atitle = document.createElement("div");
    atitle.setAttribute("data-bb-type", "panel-header");
    atitle.appendChild(document.createTextNode(ask['strAnswerTitle']));
    ofr.appendChild(atitle);
    ofr.appendChild(document.createElement("br"));
    var acontent = document.createElement("div");
    acontent.innerHTML = ask['strAnswerContent'];
    ofr.appendChild(acontent);
    gg(e, "ask").appendChild(ofr);
    console.log('问题已载入。');
    qloaded = true;
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

        g('wrap').scrollTo(0, 0);
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
}