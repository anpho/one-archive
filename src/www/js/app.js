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
			console.log('Pushing: '+id);
			if (darkColoring) {
				var screen = element.querySelector('[data-bb-type=screen]');
				if (screen) {
					screen.style['background-color'] = darkScreenColor;
				}
			}
			if (id == 'menu') {
				loadContent(element, id);
			}
		};

		// Handle styling of the screen after it is displayed
		config.ondomready = function(element, id, params) {

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
	loadAll(element,strdate);

}
function g(id){
	return document.getElementById(id);
}
function gg(doc,id){
	return doc.getElementById(id);
}

function loadAll(element,strdate){
	loadhome(element,strdate);
	loadOne(element,strdate);
	loadQuestion(element,strdate);
}

function loadhome(element,strdate){
	var data=one.getHomePage(strdate)["hpEntity"];
	gg(element,'home-title').innerHTML=strdate;
	gg(element,'home-img').innerHTML=data['strOriginalImgUrl'];
	gg(element,'home-vol').innerHTML=data['strHpTitle'];
	gg(element,'home-img-by').innerHTML=data['strAuthor'];
	gg(element,'home-content').innerHTML=data['strContent'];
}
function loadOne(e,strdate){
	var content=one.getOneContentInfo(strdate)["contentEntity"];
	gg(e,'c-brief').innerHTML=content['sGW'];
	gg(e,'c-title').innerHTML=content['strContTitle'];
	gg(e,'c-author-intro').innerHTML=content['strContAuthorIntroduce'];
	gg(e,'c-author').innerHTML=content['strContAuthor'];
	gg(e,'c-content').innerHTML=content['strContent'];
}
function loadQuestion(e,strdate){
	var ask=one.getOneQuestionInfo(strdate)['questionAdEntity'];
	gg(e,'q-title').innerHTML=ask['strQuestionTitle'];
	gg(e,'q-content').innerHTML=ask['strQuestionContent'];
	gg(e,'a-title').innerHTML=ask['strAnswerTitle'];
	gg(e,'a-content').innerHTML=ask['strAnswerContent'];
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
	if (id == 'home') {
		g('home').style.display="block";
		g('content').style.display="none";
		g('ask').style.display="none";
		document.location.hash="#h-top";
	} else if (id == 'content') {
		g('home').style.display="none";
		g('content').style.display="block";
		g('ask').style.display="none";
		document.location.hash="#c-top";
	} else {
		g('home').style.display="none";
		g('content').style.display="none";
		g('ask').style.display="block";
		document.location.hash="#q-top";
	}
}