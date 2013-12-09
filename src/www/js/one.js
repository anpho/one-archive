var one={
	
};

function getJSON(URL,callback){
	$.ajax({
		url:URL,
    	type:'GET',
    	callback: 'CALLBACK',
		dataType:"JSON",
		data:{},
		success:function(resp){
			console.log(resp);
		}
	})
}
one.getCopyRightInfo=function(){
	getJSON('http://211.152.49.184:7001/OneForWeb/onest/getCrInf',function(data){
	})
}
