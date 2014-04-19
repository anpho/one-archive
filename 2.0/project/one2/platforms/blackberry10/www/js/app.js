var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        console.log('收到事件: ' + id);
        app.bbuistart();
    },
    lang: "zh-CN",
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
                coloredTitleBar: false
            };
        }

        // 在DOM显示之前的配置
        config.onscreenready = function(element, id) {
            app.lang = blackberry.system.language;
            i18n.process(element, app.lang);
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
            if (id === 'menu') {

            }
            if (id === 'about') {
                if (darkColoring) {
                    gg(element, 'bfb').src = 'img/BFB2.png';
                } else {
                    gg(element, 'bfb').src = 'img/BFB1.png';
                }

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
                });
            }

        };

        bb.init(config);
        if (darkColoring) {
            document.body.style['background-color'] = darkScreenColor;
            document.body.style['color'] = '#E6E6E6';
        }
        //$.ajaxSettings.timeOut=1;
        bb.pushScreen('main.html', 'menu');
        navigator.splashscreen.hide();
    }
};
function fillAvailableMags(callback) {
    console.log('获取可用期数');
    findCachedMagsAsync(function(cached) {
        findAvailableMagsAsync(function(available) {
            if (available) {
                availableMags = removeDuplicatesInPlace(cached.concat(available)).sort(function(a, b) {
                    if (a["strdate"] > b["strdate"]) {
                        return -1;
                    } else if (a["strdate"] === b["strdate"]) {
                        return 0;
                    } else {
                        return 1;
                    }
                });
            } else {
                availableMags = cached;
            }
            console.log(availableMags);
            callback();
        });
    });
}
var availableMags = [];
function goNext() {
    if (availableMags.length === 0) {
        fillAvailableMags(function(data) {
            goPrevEx();
        });
    } else {
        goPrevEx();
    }
}
function goNextEx() {
    for (var i = 0; i < availableMags.length; i++) {
        if (availableMags[i]['strdate'] === currentdisplaydate) {
            if ((i + 1) >= availableMags.length) {
                Toast.regular(trans("没有之后的内容"), 1000);
                break;
            } else {
                currentdisplaydate = availableMags[i + 1]['strdate'];
                Toast.regular(trans("正在载入") + currentdisplaydate + trans("的内容"), 1000);
                g('wrap').scrollTo(0, 0);
                loadContent(document, '');
                break;
            }
        }
    }
}
function goPrev() {
    if (availableMags.length === 0) {
        fillAvailableMags(function(data) {
            goNextEx();
        });
    } else {
        goNextEx();
    }
}
function goPrevEx() {
    for (var i = 0; i < availableMags.length; i++) {
        if (availableMags[i]['strdate'] === currentdisplaydate) {
            if ((i - 1) < 0) {
                Toast.regular(trans("没有之前的内容"), 1000);
                break;
            } else {
                currentdisplaydate = availableMags[i - 1]['strdate'];
                Toast.regular(trans("正在载入") + currentdisplaydate + trans("的内容"), 1000);
                g('wrap').scrollTo(0, 0);
                loadContent(document, '');
                break;
            }
        }
    }
}
function loadSettings(element, id) {
    // 读取配置数据
    var fonts = element.getElementById('drop');
    var size = localStorage.getItem("fontsize");

    if (size === null) {
        fonts.options[2].setAttribute('selected', 'true');
    } else {
        for (var i = 0; i < 5; i++) {
            if (fonts.options[i].value === size) {
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

var listenerAdded = false;
var token;

function loadAvailableMagsAsync(element) {
    gg(element, 'spinner-4').show();
    fillAvailableMags(function() {
        //new
        var wrapper = gg(element, 'newList');
        wrapper.style.display = 'none';

        for (var i = 0; i < availableMags.length; i++) {
            console.log(availableMags[i]);
            var sd = availableMags[i]['strdate'].concat("");
            var mag = document.createElement('div');
            mag.className = 'item';
            var label = document.createElement('div');
            label.className = 'label';
            label.innerHTML = sd + " " + availableMags[i]["status"];
            var img = new Image();

            img.id = 'i' + sd;
            img.src = 'img/welcome.png';
            getTitleImg(img.id, sd);
            mag.appendChild(img);
            mag.appendChild(label);
            mag.setAttribute('strdate', sd);
            mag.onclick = function() {
                currentdisplaydate = this.getAttribute("strdate");
                sessionStorage.setItem('show', currentdisplaydate);
                oneloaded = false;
                homeloaded = false;
                qloaded = false;
                bb.pushScreen('main.html', 'menu');
            }
            wrapper.appendChild(mag);
        }
        //end new
        gg(element, 'spinner-4').hide();
        wrapper.style.display = 'block';
    });
}
function getTitleImg(obj, strdate) {
    one.getHomePageAsync(strdate, function(da) {
        if (da) {
            var d = da['hpEntity'];
            if (d) {
                cache.get(d['strOriginalImgUrl'], strdate, obj, function(u, id) {
                    console.log("设置图片：" + u);
                    var o = document.getElementById(id);
                    if (o)
                        o.src = u;
                });
            } else {
                console.error(d);
            }
        } else {
            console.error(da);
        }
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
    try {
        blackberry.ui.dialog.standardAskAsync(i18n.get('sure2del', app.lang), blackberry.ui.dialog.D_OK_CANCEL, function(selection) {
            if (selection.return === 'Ok') {
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
        }, {
            title: i18n.get('deldialog', app.lang)
        });
    } catch (e) {
        alert("Exception in standardDialog: " + e);
    }
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
    $.getJSON('http://211.152.49.184:7001/OneForWeb/one/getMobileDispDays').done(function(c) {
        var days = parseInt(c.mobileDispCtrlDays);
        var result = [];
        for (var i = 0; i < days; i++) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            var dataitem = {};
            dataitem['title'] = "";
            dataitem['strdate'] = d.format('yyyy-MM-dd');
            dataitem['status'] = "可下载";
            result.push(dataitem);
        }
        callback(result);
    }).fail(function(c) {
        callback([]);
    })

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
    var i,
            j,
            cur;
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

function loadContent(element, id) {
    cleanContent(element);
    //载入内容，strdate是要显示的日期，此处显示当前日期。
    if (!currentdisplaydate) {
        if (sessionStorage.getItem('show')) {
            currentdisplaydate = sessionStorage.getItem('show');
            loadAll(element, currentdisplaydate);
        } else {
            fillAvailableMags(function() {
                currentdisplaydate = availableMags[0]['strdate'];
                sessionStorage.setItem('show', currentdisplaydate);
                loadAll(element, currentdisplaydate);
            });
        }
    } else {
        sessionStorage.setItem('show', currentdisplaydate);
        loadAll(element, currentdisplaydate);
    }


}
function cleanContent(element) {
    gg(element, 'home').style.display = 'none';
    gg(element, 'home-img').style.display = 'none';
    gg(element, 'home-vol').innerHTML = "";
    gg(element, 'home-pbdate').innerHTML = "";
    gg(element, 'home-title').innerHTML = '';
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
    loadhome(element, strdate, function() {
        loadOne(element, strdate, function() {
            loadQuestion(element, strdate, function() {
                tabswitcher();
            });
        });
    });



}
function trans(text) {
    if (app.lang === 'zh-TW') {
        return Traditionalized(text);
    } else {
        return text;
    }
}

function loadhome(element, strdate, signal) {
    //载入封面
    //removeChildNodes(gg(element, "home"));
    gg(element, 'spinner-1').show();

    one.getHomePageAsync(strdate, function(da) {
        if (data === null) {
            Toast.regular(trans("载入首页数据失败，请检查网络连接后重试。"), 1000);
            gg(element, 'home-img').style.display = "block";
            gg(element, 'spinner-1').hide();
            return;
        }
        var data = da["hpEntity"];
        localStorage.setItem(strdate + 'title', data['strHpTitle']);
        gg(element, 'openinbrowser').onclick = function() {
            blackberry.ui.dialog.standardAskAsync(trans('在浏览器中打开本期杂志？'), blackberry.ui.dialog.D_OK_CANCEL, function(selection) {
                if (selection.return === 'Ok') {
                    openInBrowser(data['sWebLk']);
                }
            }, {
                title: trans('确认')
            });
        };
        gg(element, 'home-title').innerHTML = strdate.substr(0, 7);
        gg(element, 'home-pbdate').innerHTML = strdate.substr(8, 2);
        gg(element, 'home-vol').innerHTML = data['strHpTitle'];
        gg(element, 'home-img-by').innerHTML = trans(data['strAuthor'].replace(/&/g, ' '));
        gg(element, 'home-content').innerHTML = trans(data['strContent']);
        //gg(element, 'home-content').style['fontSize'] = localStorage.getItem('fontsize');

        imgurl = data['strOriginalImgUrl'];
        console.log('主页已载入。');
        gg(element, 'home').style.display = 'block';
        homeloaded = true;
        if (signal) {
            signal();
        }

        if (window.innerHeight < 800) {
            gg(element, 'ab').hide();
        }
        cache.get(imgurl, currentdisplaydate, 'home-img', function(u, id) {
            console.log("设置图片：" + u);
            if (g(id)) {
                g(id).src = u;
                g(id).style.display = "block";
                gg(element, 'spinner-1').hide();
            }
        });
    });
}
var homeloaded,
        oneloaded,
        qloaded,
        imgurl;
function openInBrowser(url) {
    blackberry.invoke.invoke({
        uri: url
    },
    function() {
        console.log('Browser Opened: ' + url);
    }, function() {
        console.error('Browser Not Opened: ' + url);
    });
}
function removeChildNodes(node) {
    var children = node.childNodes;
    for (i = 0; i < children.length; i++) {
        node.removeChild(children[i]);
    }
}
function loadOne(e, strdate, signal) {
    //gg(e, 'spinner-2').show();
    //removeChildNodes(gg(e, "content"));
    one.getOneContentInfoAsync(strdate, function(c) {

        if (c === null) {
            Toast.regular(trans("载入文章内容失败，请检查网络连接后重试。"), 1000);
            //gg(element, 'spinner-2').hide();
            return;
        }
        var content = c["contentEntity"];
        gg(e, 'c-brief').innerHTML = trans(content['sGW']);
        gg(e, 'c-title').innerHTML = trans(content['strContTitle']);
        gg(e, 'c-author-intro').innerHTML = trans(content['strContAuthorIntroduce']);
        gg(e, 'c-author').innerHTML = trans(content['strContAuthor']);
        gg(e, 'c-content').innerHTML = trans("<p>" + content['strContent'].replace(/<br>/g, "</p><p>") + "</p>");
        gg(e, 'c-content').style['fontSize'] = localStorage.getItem('fontsize');
        console.log('内容已载入。');
        gg(e, 'content').style.display = 'block';
        //gg(e, 'spinner-2').hide();
        oneloaded = true;
        if (signal) {
            signal();
        }
    });

}

function loadQuestion(e, strdate, signal) {
    //gg(e, 'spinner-3').show();
    //removeChildNodes(gg(e, "ask"));
    one.getOneQuestionInfoAsync(strdate, function(a) {
        if (a === null) {
            Toast.regular(trans("载入问题内容失败，请检查网络连接后重试。"), 1000);
            //gg(element, 'spinner-3').hide();
            return;
        }
        var ask = a['questionAdEntity'];
        gg(e, 'q-title').innerHTML = trans(ask['strQuestionTitle']);
        gg(e, 'q-content').innerHTML = trans(ask['strQuestionContent']);
        gg(e, 'q-content').style['fontSize'] = localStorage.getItem('fontsize');
        gg(e, 'a-title').innerHTML = trans(ask['strAnswerTitle']);
        gg(e, 'a-content').innerHTML = trans(ask['strAnswerContent']);
        gg(e, 'a-content').style['fontSize'] = localStorage.getItem('fontsize');
        console.log('问题已载入。');
        gg(e, 'ask').style.display = 'block';
        qloaded = true;
        if (signal) {
            signal();
        }
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
    Toast.regular(trans("缓存已清除"), 1000);
    loadAvailableMags(document, 'reload');
}

function saveFont(f) {
    //字体大小
    var size = f.value;
    localStorage.setItem("fontsize", size);
}
function saveLang(f) {
    var lang = f.value;
    localStorage.setItem("lang", lang);
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
    if (window.innerHeight < 800) {
        if (ruler.scrollTop < 5) {
            showActionBar = false;
            setTimeout(function() {
                if (!showActionBar)
                    g('ab').hide();
            }, 333);
        } else if (ruler.scrollTop > lastpos) {
            showActionBar = false;
            setTimeout(function() {
                if (!showActionBar)
                    g('ab').hide();
            }, 333);
        } else {
            showActionBar = true;
            setTimeout(function() {
                if (showActionBar)
                    g('ab').show();
            }, 333);

        }
    } else {
        showActionBar = true;
        setTimeout(function() {
            if (showActionBar)
                g('ab').show();
        }, 333);
    }
    lastpos = ruler.scrollTop;
}