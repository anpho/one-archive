var one = {
	getCopyRightInfo: function() {
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/onest/getCrInf');
		return cp["entCr"]["strCR"];
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
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getHpAdMultiinfo');
		return cp;
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
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getLateds30dayPraiseNumber');
		return cp;
	},
	getMobileDispDays: function() {
		/*
		{
			"result":"SUCCESS",
			"mobileDispCtrlDays":"10"
		}
		*/
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getMobileDispDays');
		return cp;
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
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getTPage');
		return cp;
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
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getHpinfo?strDate=' + datestr)
		return cp;
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
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getOneContentInfo?strDate=' + datestr);
		return cp;
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
		var cp = getJSON('http://211.152.49.184:7001/OneForWeb/one/getOneQuestionInfo?strDate=' + datestr);
		return cp;
	}
};