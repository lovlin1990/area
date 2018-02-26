/* author：lovlin
 * 省市联动多选
 * data-inputName表示隐藏的input框的name值
 * data-default表示默认数据，以object数组形式展现[{"type":"hot","code":"3","name":"天津"},{"type":"slices","code":"2","name":"江浙沪"}]
 * area_hot热门城市初始化
 * area_slices区域初始化
 * addAreaBox加载模板
 */
var province = {};
$(function(){
	var area = $(".area-pc");
	if(area != undefined){
		var inputName = area.attr("data-inputName");
		var checkedVal = area.attr("data-default");
		
//		var checkedVal = '[{"type":"hot","code":"3","name":"天津"},{"type":"slices","code":"2","name":"江浙沪"},{"type":"pc","code":"c160000-c160900","name":"福建-宁德市"},{"type":"pc","code":"c160000-c160700","name":"福建-南平市"},{"type":"pc","code":"c050000-c050900","name":"河北-沧州市"}]';
		if(checkedVal != undefined && checkedVal != ""){
			var valJson = $.parseJSON(checkedVal);
			if(valJson.length != 0){
				for(var m = 0;m < valJson.length;m++){
					var type = valJson[m].type;
					var cn = valJson[m].name;
					var cv = valJson[m].code;
					addAreaCheck(cv,cn,type);
				}
				
			}
			area.after('<input type="hidden" id="'+inputName+'" name="'+inputName+'" value=\''+checkedVal+'\'/>');
		} else {
			area.after('<input type="hidden" id="'+inputName+'" name="'+inputName+'" value=""/>');
		}
		
		
	}
	//selectProvince("c150000");
	//点击省
	$("body").on("click",".area-p-c .area-p .area-li",function(){
		$(".area-p-c .area-p .area-li:not([class*='default'])").removeClass("active");
		var val = $(this).attr("data-value");
		var defaultVal = $(this).attr("data-default");
		var name = $(this).text();
		$(this).addClass("active");
		selectProvince(val,name,defaultVal);
	});
	//初始化
	$('body').on('click','.area-pc',function(e){
		var nochange = $(this).attr("data-nochange");
		if(nochange !== undefined && nochange === "true"){
			return;
		}
		$(this).parent().find(".area-pc-box").remove();
		var checkedVal = $(this).attr("data-default");
//		var checkedVal = '[{"type":"hot","code":"3","name":"天津"},{"type":"slices","code":"2","name":"江浙沪"},{"type":"pc","code":"c160000-c160900","name":"福建-宁德市"},{"type":"pc","code":"c160000-c160700","name":"福建-南平市"},{"type":"pc","code":"c050000-c050900","name":"河北-沧州市"}]';
		
		var valJson = new Array();
		
		if(checkedVal != undefined && checkedVal != ""){
			valJson = $.parseJSON(checkedVal);
		}
		
		stopPropagation(e);
		addAreaBox(inputName);
		initAreaHotCity(valJson);
		initAreaSlices(valJson);
		initAreaProvince(valJson);
		$(this).addClass("active");
	});
	//点击热门
	$('body').on('click','.area-hot .area-li',function(e){
		if($(this).hasClass("active")){
			return;
		}
		var val = $(this).attr("data-value");
		var name = $(this).text();
		addAreaCheck(val,name,"hot");
		resetDefault(val,name,"hot","add");
		$(this).addClass("active");
		//加载省市
		var pli = $(".area-p .area-li");
		var cli = $(".area-c .area-li");
		var pVal = val.split("-")[0];
		var cVal = val.split("-")[1];
		for(var j = 0;j < pli.length;j++){
			var v = $(pli[j]).attr("data-value");
			var cityString = $(pli[j]).attr("data-default");
			if(v == pVal){
				$(pli[j]).addClass("active");
				var citys = new Array();
				if(cityString != ""){
					citys = cityString.split(",");
				}
				citys.splice(citys.length,0,cVal);
				
				if(citys.length == 0){
					$(pli[j]).removeClass("active");
					$(pli[j]).removeClass("default");
				}
				$(pli[j]).attr("data-default",citys);
			}
		}
		
		for(var k = 0;k < cli.length;k++){
			var v = $(cli[k]).attr("data-value");
			if(v == cVal){
				$(cli[k]).addClass("active");
			}
		}
		
	});
	//点击区域
	$('body').on('click','.area-slices .area-li',function(e){
		if($(this).hasClass("active")){
			return;
		}
		var val = $(this).attr("data-value");
		var name = $(this).text();
		addAreaCheck(val,name,"slices");
		resetDefault(val,name,"slices","add");
		$(this).addClass("active");
	});
	//点击市
	$('body').on('click','.area-c .area-li',function(e){
		if($(this).hasClass("active")){
			return;
		}
		var val = $(this).attr("data-value");
		var pCode = $(this).attr("data-parentCode");
		var pName = $(this).attr("data-parentName");
		var name = $(this).text();
		addAreaCheck(pCode+"-"+val,pName+"-"+name,"pc");
		resetDefault(pCode+"-"+val,pName+"-"+name,"pc","add");
		$(this).addClass("active");
		
		//给省增加default
		var pli = $(".area-p .area-li");
		for(var j = 0;j < pli.length;j++){
			var v = $(pli[j]).attr("data-value");
			var cityString = $(pli[j]).attr("data-default");
			if(v == pCode){
				var citys = new Array();
				if(cityString != ""){
					citys = cityString.split(",");
				}
				citys.splice(citys.length,0,val);
				
				if(citys.length == 0){
					$(pli[j]).removeClass("active");
					$(pli[j]).removeClass("default");
				}
				$(pli[j]).attr("data-default",citys);
			}
		}
		
		//选中热门城市
		var hotli = $(".area-hot .area-li");
		for(var k = 0;k < hotli.length;k++){
			var v = $(hotli[k]).attr("data-value");
			var cval = v.split("-")[1];
			if(cval == val){
				$(hotli[k]).addClass("active");
			}
		}
		
	});
	//阻止事件冒泡
	$('body').on('click','.area-pc-box .area-li',function(e){
		stopPropagation(e);
	});
	$('body').on('click','.area-pc .area-pc-check',function(e){
		stopPropagation(e);
	});
	$('body').on('click','.area-pc-box',function(e){
		stopPropagation(e);
//		$(".area-pc").removeClass("active");
	});
	
	//阻止事件冒泡
    $(document).bind('click',function(){
    	$(".area-pc").empty();
    	var checkedVal = $(".area-pc").parent().find("input").val();
		var valJson = new Array();
		
		if(checkedVal != ""){
			valJson = $.parseJSON(checkedVal);
		}
		if(valJson.length != 0){
			for(var m = 0;m < valJson.length;m++){
				var type = valJson[m].type;
				var cn = valJson[m].name;
				var cv = valJson[m].code;
				addAreaCheck(cv,cn,type);
			}
			
		}
		
		$(".area-pc").attr("data-default",checkedVal);
     	$(".area-pc-box").remove();
     	$(".area-pc").removeClass("active");
    });
    
    //删除选中
    $('body').on('click','.area-pc .area-close',function(e){
    	var nochange = $(this).parents(".area-pc").attr("data-nochange");
		if(nochange !== undefined && nochange === "true"){
			return;
		}
    	var val = $(this).attr("data-value");
    	var type = $(this).attr("data-type");
    	if("slices" == type){
    		removeLiClass($(".area-slices"),val);
    	} else if("pc" == type || "hot" == type){
			removeLiClass($(".area-hot"),val);
    		removePCLiClass(val);
    	}
    	
    	resetDefault(val,"","","subtract");
    	
    	var checkedVal = $(".area-pc").attr("data-default");
    	$(".area-pc").parent().find("input").val(checkedVal);
		
    	$(this).parents(".area-pc-check").remove();
    });
    
    //取消
    $('body').on('click','.area-pc-box .area-cancel',function(e){
    	$(".area-pc").empty();
    	var checkedVal = $(".area-pc").parent().find("input").val();
		var valJson = new Array();
		
		if(checkedVal != ""){
			valJson = $.parseJSON(checkedVal);
		}
		
		if(valJson.length != 0){
			for(var m = 0;m < valJson.length;m++){
				var type = valJson[m].type;
				var cn = valJson[m].name;
				var cv = valJson[m].code;
				addAreaCheck(cv,cn,type);
			}
			
		}
    	$(".area-pc").attr("data-default",checkedVal);
    	$(this).parents(".area-pc-box").remove();
	});
    
    //确定
    $('body').on('click','.area-pc-box .area-sure',function(e){
    	var checkedVal = $(".area-pc").attr("data-default");
    	$(".area-pc").parent().find("input").val(checkedVal);
    	$(this).parents(".area-pc-box").remove();
    });
});
/*加载省*/
function initAreaProvince(valJson){
	if(province.length == undefined){
		/*$.ajax({
			type : "GET",
			url : "/ajax/area/district/list/",
			dataType : "json",
			async: false,
			success : function(json) {
				// 加入缓存
				province = json;
			},
			error : function(){
				console.log("加载区域信息出错");
			}
		});
		*/
		province = areaData
	}
	for(var i in province){
		var code = i;
		var p = province[i].n;
		var clas = "";
		var def = "";
		var defaultCitys = new Array();
		if(valJson.length != 0){
			for(var m = 0;m < valJson.length;m++){
				var type = valJson[m].type;
				var cv = valJson[m].code;
				var codePC = cv.split("-");
				if(("pc" == type || "hot" == type)&& codePC[0] == code){
					clas = "active";
					def = "default";
					defaultCitys.push(codePC[1]);
				}
			}
		}
		
		var html = '<span class="area-li '+clas+' '+def+'" data-value="'+code+'" data-default="'+defaultCitys+'">'+p+'</span>';
		$(".area-p-c .area-p").append(html);
	}
}
/*选择省加载市*/
function selectProvince(code,name,defaultVal){
	initAreaCity(code,name,defaultVal);
}
/*加载市*/
function initAreaCity(pCode,pName,defaultVal){
	$(".area-p-c .area-c").html("");
	// 加入缓存
	var citys;
	for(var p in areaData){
		if(p === pCode){
			citys = areaData[p]
			break;
		}
	}
	var allCityFlag="";
	
	for(var i in citys){
		if(i === 'n'){
			continue;
		}
		var code = i;
		var c = citys[i].n;
		var clas = "";
		if(defaultVal != ""){
			var defaultValJson = defaultVal.split(",");
			for(var m = 0;m < defaultValJson.length;m++){
				var cv = defaultValJson[m];
				if(cv == "0"){
					allCityFlag = "active";
				}
				if(cv == code){
					clas = "active";
				}
			}
		}
		
		var html = '<span class="area-li '+clas+'" data-value="'+code+'" data-parentCode="'+ pCode +'" data-parentName="'+ pName +'">'+c+'</span>';
		$(".area-p-c .area-c").append(html);
	}
	//判断要不要加全省
	if($.inArray(pCode, del_AllProvince) < 0){
		$(".area-p-c .area-c").prepend('<span class="area-li '+allCityFlag+'" data-value="0" data-parentCode="'+ pCode +'" data-parentName="'+ pName +'">全省</span>');
	}
	/*$.ajax({
		type : "GET",
		url : "/ajax/area/district/list/"+pCode,
		dataType : "json",
		async: true,
		success : function(json) {
			// 加入缓存
			var citys = json;
			var allCityFlag="";
			
			for(var i = 0;i < citys.length;i++){
				var code = citys[i].code;
				var c = citys[i].name;
				var clas = "";
				if(defaultVal != ""){
					var defaultValJson = defaultVal.split(",");
					for(var m = 0;m < defaultValJson.length;m++){
						var cv = defaultValJson[m];
						if(cv == "0"){
							allCityFlag = "active";
						}
						if(cv == code){
							clas = "active";
						}
					}
				}
				
				var html = '<span class="area-li '+clas+'" data-value="'+code+'" data-parentCode="'+ pCode +'" data-parentName="'+ pName +'">'+c+'</span>';
				$(".area-p-c .area-c").append(html);
			}
			//判断要不要加全省
			if($.inArray(pCode, del_AllProvince) < 0){
				$(".area-p-c .area-c").prepend('<span class="area-li '+allCityFlag+'" data-value="0" data-parentCode="'+ pCode +'" data-parentName="'+ pName +'">全省</span>');
			}
			
		},
		error : function(){
			console.log("加载区域信息出错");
		}
	});*/
	
}
/*加载热门*/
function initAreaHotCity(valJson){
	for(var i = 0;i < area_hot.length;i++){
		var code = area_hot[i].code;
		var c = area_hot[i].name;
		var clas = "";
		if(valJson.length != 0){
			for(var m = 0;m < valJson.length;m++){
				var type = valJson[m].type;
				var cv = valJson[m].code;
				if(("hot" == type || "pc" == type) && cv == code){
					clas = "active";
					break
				}
			}
		}
		
		var html = '<span class="area-li '+clas+'" data-value="'+code+'">'+c+'</span>';
		$(".area-hot .area-pc-content").append(html);
	}
}
/*加载区域*/
function initAreaSlices(valJson){
	for(var i = 0;i < area_slices.length;i++){
		var code = area_slices[i].code;
		var c = area_slices[i].name;
		var clas = "";
		if(valJson.length != 0){
			for(var m = 0;m < valJson.length;m++){
				var type = valJson[m].type;
				var cv = valJson[m].code;
				if("slices" == type && cv == code){
					clas = "active";
					break;
				}
			}
		}
		var html = '<span class="area-li '+clas+'" data-value="'+code+'">'+c+'</span>';
		$(".area-slices .area-pc-content").append(html);
	}
}
/*加载box*/
function addAreaBox(){
	var html = '<div class="area-pc-box"><div class="area-hot"><div class="area-title">热门：</div><div class="area-pc-content"></div></div><div class="area-slices"><div class="area-title">区域：</div><div class="area-pc-content"></div></div><div class="area-p-c clearfix"><div class="area-title">省市：</div><div class="area-pc-content"><div class="area-p"></div><div class="area-c"></div></div></div><div class="area-btn"><button type="button" class="button button-primary button-tiny area-sure">确定</button><button type="button" class="button button-default button-tiny area-cancel" style="margin-left:40px;">取消</button></div></div>';
	$(".area-pc").after(html);
}
/*加载选中标签*/
function addAreaCheck(code,name,type){
	var html = '<span class="area-pc-check">'+ name +'<i class="fa fa-close area-close" data-value="'+code+'" data-type="'+type+'"></i></span>';
	$(".area-pc").append(html);
}

function removeLiClass(obj,val){
	var li = obj.find(".area-li");
	for(var j = 0;j < li.length;j++){
		var v = $(li[j]).attr("data-value");
		if(v == val){
			$(li[j]).removeClass("active");
			break;
		}
	}
}
function removePCLiClass(val){
	var pcVal = val.split("-");
	var pVal = pcVal[0];
	var cVal = pcVal[1];
	var pli = $(".area-p .area-li");
	var cli = $(".area-c .area-li");
	//删除省
	for(var j = 0;j < pli.length;j++){
		var v = $(pli[j]).attr("data-value");
		var cityString = $(pli[j]).attr("data-default");
		if(v == pVal){
			var citys = cityString.split(",");
			citys.forEach(function(item,index,array){
				if(cVal == item){
					citys.splice(index,1);
				}
			});
			if(citys.length == 0){
				$(pli[j]).removeClass("active");
				$(pli[j]).removeClass("default");
			}
			$(pli[j]).attr("data-default",citys);
		}
	}
	//删除市
	for(var j = 0;j < cli.length;j++){
		var v = $(cli[j]).attr("data-value");
		if(v == cVal){
			$(cli[j]).removeClass("active");
		}
	}
}
//重置默认值
function resetDefault(val,name,type,resetType){
	var checkedVal = $(".area-pc").attr("data-default");
	var valJson = new Array();
	
	if(checkedVal != undefined && checkedVal != ""){
		valJson = $.parseJSON(checkedVal);
	}
	
	if("add" == resetType){
		//增
		var obj = new Object();
		obj.name = name;
		obj.code = val;
		obj.type = type;
		valJson.splice(valJson.length,0,obj);
	} else if("subtract" == resetType){
		//减
		valJson.forEach(function(item,index,array){
			if(val == item.code){
				valJson.splice(index,1);
			}
		});
		
	}
	
	$(".area-pc").attr("data-default",valJson.length == 0 ? "" : JSON.stringify(valJson));
}

/*阻止事件冒泡*/
function stopPropagation(e) {
    if (e.stopPropagation) 
        e.stopPropagation();
    else 
        e.cancelBubble = true;
}