/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
        app.receivedEvent('deviceready');
        app.checkPlugin();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        app.bbuistart();
    },
    checkPlugin:function(){
	    if (community && community.curl){
		    console.log('community.curl loaded.');
	    }else{
		    console.log('community.curl not found.');
		    window.alert('community.curl not found.');
	    }
    },
    bbuistart:function(){
	    // This is code to ensure that if webworksready is fired multiple times we still only init() one time
		if (webworksreadyFired) return;
		webworksreadyFired = true;
		var config;

		// Toggle our coloring for testing 
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

		// Handle styling of the screen before it is displayed
		config.onscreenready = function(element, id) {
			if (darkColoring) {
				var screen = element.querySelector('[data-bb-type=screen]');
				if (screen) {
					screen.style['background-color'] = darkScreenColor;
				}
			}
		};

		// Handle styling of the screen after it is displayed
		config.ondomready = function(element, id, params) {
			if (id == 'menu') {
				loadContent(element, id);
			}
		};

		bb.init(config);
		if (darkColoring) {
			document.body.style['background-color'] = darkScreenColor;
			document.body.style['color'] = 'white';
		}
		bb.pushScreen('main.html', 'menu');
    }
};

function getJSON(URL){
	//URL should be started with "http://"
	return JSON.parse(community.curl.get(URL));
}
function loadContent(element, id){
	var d=new Date();
	var strdate=d.format('yyyy-MM-dd');

	setTimeout(loadpic(element,strdate),1);

}
var _pic,_one,_ask;
function loadpic(element,strdate){
	var data=one.getHomePage(strdate)["hpEntity"];
	_pic="<div><a name='pic'></a><img src='"+data['strOriginalImgUrl']+"' width=100% ><h3>"+data["strHpTitle"]+" -- "+data['strAuthor']+"</h3> <h3>"+data['strContent']+"</h3></div>";
	var content=one.getOneContentInfo(strdate)["contentEntity"];
	_one="<div><a name='one'></a><h3>"+content["strContTitle"]+"</h3><h3><i>"+content["strContAuthorIntroduce"]+"</i> "+content["strContAuthor"]+"</h3><div>"+content["strContent"]+"</div></div>";
	var ask=one.getOneQuestionInfo(strdate)['questionAdEntity'];
	_ask="<div><a name='ask'></a><h3>"+ask['strQuestionTitle']+"</h3><div>"+ask['strQuestionContent']+"</div><h3>"+ask['strAnswerTitle']+"</h3><div>"+ask["strAnswerContent"]+"</div></div>";
		
	element.getElementById('appcontent').innerHTML=_pic+_one+_ask;
}

Date.prototype.format = function(format)
{
 var o = {
 "M+" : this.getMonth()+1, //month
 "d+" : this.getDate(),    //day
 "h+" : this.getHours(),   //hour
 "m+" : this.getMinutes(), //minute
 "s+" : this.getSeconds(), //second
 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
 "S" : this.getMilliseconds() //millisecond
 }
 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
 (this.getFullYear()+"").substr(4 - RegExp.$1.length));
 for(var k in o)if(new RegExp("("+ k +")").test(format))
 format = format.replace(RegExp.$1,
 RegExp.$1.length==1 ? o[k] :
 ("00"+ o[k]).substr((""+ o[k]).length));
 return format;
}

function showTab(id) {
	// switch between tabs.
	if (id == 'tab_pic') {
		document.location.hash="#pic";
	} else if (id == 'tab_one') {
		document.location.hash="#one";
	} else {
		document.location.hash="#ask";
	}
}