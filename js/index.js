(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
var eomsGlobal = {};
(function () {
	var baseUrl = '/haeoms';
	var envir = 'production';  // 生产环境
	// 请求接口
	function ajaxFn (url,fn,type,data,contentType) {
		var token = $.cookie('sessionUserToken');
		var tokenFlag = $.cookie('LtpaToken2');
		if (!tokenFlag || !token) {
			// 解决点击浏览器后退按钮，回到登录页问题
			window.location.replace('/haeoms/toLogin');
			return;
		}
		var request = $.ajax({
			url: url+'?v='+(Math.random()+'').substr(2),
			type: type?type:'get',
			data: data?data:null,
			dataType: 'json',
			headers: {
				'sessionUserToken':token
			},
			contentType: contentType?contentType:'application/json;charset=UTF-8',
			success: function (res,status,jqXHR) {
				if (jqXHR.getResponseHeader('redirect')==='REDIRECT') {
					// 解决点击浏览器后退按钮，回到登录页问题
					window.location.replace('/haeoms/toLogin');
					return;
				}
				fn(res);
			},
			error: function (jqXHR,textStatus,errorThrown) {
				if (jqXHR.getResponseHeader('redirect')==='REDIRECT') {
					// 解决点击浏览器后退按钮，回到登录页问题
					window.location.replace('/haeoms/toLogin');
					return;
				}
				// alert('接口调取失败');
			},
		});
	}
	function closeGif () {
		$("#Loading").show("normal",function(){
			$(this).remove();
		});
	}
	// 加载动图
	function completeGif () {
		var clearTime;
		$.parser.onComplete = function(){
			if(clearTime) clearTimeout(clearTime);
			clearTime = setTimeout(closeGif, 100);
		};
	}
	function loadPagination (opts) {
		opts = $.extend({
			showPageList: false,
			pageList: [10,20,30,50],
			pageSize: 10,
			total: 0
		}, opts);
		var ye = opts.total%opts.pageSize==0?parseInt(opts.total/opts.pageSize):parseInt(opts.total/opts.pageSize)+1;
		opts.$page.pagination({
			showPageList: opts.showPageList,
			pageList: opts.pageList,
			showRefresh: false,
			pageNumber: 1,
			total: opts.total,
			pageSize: opts.pageSize,
			layout:['first','prev','next','last','sep','links','sep','manual','info'],
			beforePageText:'第',
			afterPageText:'页',
			displayMsg: '共'+ye+'页',
			onSelectPage: function (currentPage) {
				opts.callBackFn(currentPage);
			}
		});
		var node = document.querySelector('.pagination-links'),
			nodeParent = node.parentNode;
		nodeParent.children[0].title = '第一页';
		nodeParent.children[1].title = '上一页';
		nodeParent.children[2].title = '下一页';
		nodeParent.children[3].title = '最后一页';
		nodeParent.insertBefore(node,nodeParent.children[2]);
		setTimeout(function () {
			$('.pagination-num').blur(function () {
				opts.$page.pagination('select', parseInt($('.pagination-num').val()));
			});
		},0)
		indexVariable.isPage = true;
	}
	// 给全局变量赋值
	eomsGlobal = {
		ajaxFn: ajaxFn,
		completeGif: completeGif,
		loadPagination: loadPagination,
	};
})()
var indexVariable = {
	userName: '',
	userNameCn: '',
	isClickTodo: false,
	isMenu: false,
	operSheetType: '',
	todoText: '',
	todoType: '',
	tabTitle: '',
	timer: null,
	isPage: false,
	addTab: function (title, url) {
		/**
		 * 为主tab添加一个项
		 */
		if ($('#tabs').tabs('exists', title)){
			$('#tabs').tabs('select', title);//选中并刷新
			var currTab = $('#tabs').tabs('getSelected');
			if(url != undefined && currTab.panel('options').title != '首页') {
				$('#tabs').tabs('update',{
					tab:currTab,
					options:{
						content:this.createFrame(url)
					}
				})
			}
			// $('#tabs').tabs('disableTab', title);
		} else {
			var content = this.createFrame(url);
			$('#tabs').tabs('add',{
				title:title,
				content:content,
				closable:true
			});
			// $('#tabs').tabs('disableTab', title);
		}
		this.tabClose();
	},
	createFrame: function (url) { //scrolling="auto"
		/**
		 * 创建iframe标签，根据主菜单data-src的不同，跳转不同的url
		 */
	   if (typeof url == 'string' && url.indexOf('.html')>-1) {
		   // 跳转至新框架
		   var s = '<iframe frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';
	   } else {
		   // 跳转至老框架
		   var s = '<iframe frameborder="0"  src="./static/jsp/secframe.html?type='+url+'" style="width:100%;height:100%;"></iframe>';
	   }
		return s;
	},
	objIterator: function (obj,key) {
		if (!obj) {
			return undefined;
		}
		var result = obj;
		key = key.split('.');
		for (var i=0,len=key.length;i<len;i++) {
			if (result[key[i]] !== undefined) {
				result = result[key[i]];
			} else {
				return undefined;
			}
		}
		return result;
	},
	tabCloseEven: function () {
		var _this = this;
		//刷新
		$('#mm-tabupdate').click(function(){
			var currTab = $('#tabs').tabs('getSelected');
			var url = $(currTab.panel('options').content).attr('src');
			if(url != undefined && currTab.panel('options').title != '首页') {
				$('#tabs').tabs('update',{
					tab:currTab,
					options:{
						content:_this.createFrame(url)
					}
				})
			}
		});
		//关闭当前
		$('#mm-tabclose').click(function(){
			var currtab_title = $('#mm').data("currtab");
			$('#tabs').tabs('close',currtab_title);
		});
		//全部关闭
		$('#mm-tabcloseall').click(function(){
			$('.tabs-inner span').each(function(i,n){
				var t = $(n).text();
				if(t != '首页') {
					$('#tabs').tabs('close',t);
				}
			});
			document.getElementById('iframeNewTop').className = 'iframeindex0';
		});
		//关闭除当前之外的TAB
		$('#mm-tabcloseother').click(function(){
			var prevall = $('.tabs-selected').prevAll();
			var nextall = $('.tabs-selected').nextAll();
			if(prevall.length>0){
				prevall.each(function(i,n){
					var t=$('a:eq(0) span',$(n)).text();
					if(t != '首页') {
						$('#tabs').tabs('close',t);
					}
				});
			}
			if(nextall.length>0) {
				nextall.each(function(i,n){
					var t=$('a:eq(0) span',$(n)).text();
					if(t != '首页') {
						$('#tabs').tabs('close',t);
					}
				});
			}
			document.getElementById('iframeNewTop').className = 'iframeindex0';
			return false;
		});
	},
	tabClose: function () {
		/*双击关闭TAB选项卡*/
		// $(".tabs-inner").dblclick(function(){
		// 	var subtitle = $(this).children(".tabs-closable").text();
		// 	$('#tabs').tabs('close',subtitle);
		// })
		//鼠标移入事件
		$(".tabs>li").hover(function(){
			$(this).addClass('tabs_hover');
		},function () {
			$(this).removeClass('tabs_hover');
		});
		// 先把之前绑定的事件解绑
		$('.tabs-close').unbind('click').bind('click',function () {
			if ($(this).parent().hasClass('tabs-selected')) {
				return;
			}
			if (indexVariable.timer) {
				clearTimeout(indexVariable.timer)
			}
			indexVariable.timer =  setTimeout(function () {
				var index = $('#tabs').tabs('getTabIndex', $('#tabs').tabs('getSelected'));
				var i = parseInt(index)-1<0?0:parseInt(index)-1;
				document.getElementById('iframeNewTop').className = 'iframeindex' + i;
			},100)
		});
		/*为选项卡绑定右键*/
		$(".tabs-inner").on('contextmenu',function(e){
			$('#mm').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
			var subtitle =$(this).children(".tabs-closable").text();
			$('#mm').data("currtab",subtitle);
			$('#tabs').tabs('select',subtitle);
			return false;
		});
	},
	getArr: function (arr) {
		var html = '';
		for (var i=0;i<arr.length;i++) {
			html += '<div class="jumptomaintab" data-menuid="1'+arr[i].id+'" data-namecn="'+arr[i].nameCn+'" data-menulocation="'+arr[i].location+'" data-menutype="1'+arr[i].menuType+'" data-flag="'+arr[i].menuFlag+'">'+arr[i].name+'</div>';
		}
		return html;
	},
	fulData: function (arr) {
		var s1 = '';
		for (var i=0;i<arr.length;i++) {
			if (arr[i].children && arr[i].children.length>0) {
				s1 += '<div><span>'+arr[i].name+'</span><div>'+this.getArr(arr[i].children)+'</div></div>';
			} else {
				s1 += '<div class="jumptomaintab" data-menuid="1'+arr[i].id+'" data-namecn="'+arr[i].nameCn+'" data-menulocation="'+arr[i].location+'" data-menutype="1'+arr[i].menuType+'" data-flag="'+arr[i].menuFlag+'">'+arr[i].name+'</div>';
			}
		}
		return s1;
	},
	loadMenu: function () {
		// sessionStorage.setItem('operSheetType','');// 刷新页面时，把operSheetType清空
		var navTree = sessionStorage.getItem('findNavTree'),
		    navArr = [],
			_this = this;
		if (navTree) {
			navArr = JSON.parse(navTree).data;
			this.formatMenu(navArr);
			var agent = navigator.userAgent;
			if (agent.indexOf("MSIE 8.0") > -1 || agent.indexOf("MSIE 9.0") > -1) {
				setTimeout(function () {
					indexVariable.loadWidth(navArr.length);
				},100);
			}
		} else {
			_this.isMenu = true;
			eomsGlobal.ajaxFn('/haeoms/menu/findNavTree',function (res) {
				sessionStorage.setItem('findNavTree',JSON.stringify(res));
				location.reload();
			});
		}
	},
	loadOther: function () {
		// 最新公告
		this.loadLastsNews();
		// 留言板
		this.loadMessage();
		// 专家值班
		this.loadDutyList();
		// 获取用户信息
		this.loadUserInfo();
		// 获取运维待办和需求待办信息
		this.loadOperation();
		// 值班作业信息
		this.loadDutySchedule();
		// 获取3个职位列表
		this.loadJobList();
		// 加载待办列表
		this.loadUpcomList(1);
	},
	loadUpcomList: function (currentPage) {
		var sheetType = indexVariable.operSheetType || '';
		var jsonObj = {
			currentPage: currentPage,
			sheetType: sheetType
		};
		var jsonStr = JSON.stringify(jsonObj);
		eomsGlobal.ajaxFn('/haeoms/home/getUpComList',function (res) {
			var resT = res.total;
			indexVariable.loadTable(res.data);
			var str = indexVariable.todoText?indexVariable.todoText+':':'';
			if (resT == 0) {
				document.querySelector('.no-data-gongdan').innerHTML = str+'暂无待办工单';
				$('.no-data-gongdan').show();
			} else {
				$('.no-data-gongdan').hide();
			}
			if (!indexVariable.isPage) {
				eomsGlobal.loadPagination({
					$page: $('#pppp'),
					total: resT,
					pageSize: 6,
					callBackFn: indexVariable.loadUpcomList
				});
			}
		},'post',jsonStr);
	},
	loadTable: function (upcomlistData) {//onClickRow: indexVariable.clickTableRow,
		$('#dg').datagrid({
			data: upcomlistData,
			fit: true,
			fitColumns: true,
			singleSelect: true,
			border: false,
			columns:[[
				{field:'sheetid',title:'工单流水号',width:60,align:'center'},
				{field:'sheetname',title:'工单类型',width:50,align:'center'},
				{field:'title',title:'工单主题',width:120,align:'center'},
				{field:'statename',title:'工单状态',width:30,align:'center'}
			]]
		});
	},
	clickTableRow: function (index,row) {// 模拟个人投诉-已接工单
	    var sheetname = row.sheetname;
		var title = indexVariable.todoText || row.MAINMENU;//主tab显示的标题
		var type = indexVariable.todoType || row.type;//左菜单请求的参数
		var url = '';// 加载已接工单内容的url
		var urlName = row.sheetid;// 子tab显示的标题
		var urlCode = 'sheet-list';// 子tab标题的id
		var external = false;// 是否以iframe形式加载内容。false为不以iframe形式
		var hashVal = '';
		var allUrlIframe = '';
		if (sheetname == '投诉处理工单') { // 已接工单
			title = '个人投诉';
			type = '050101';
			url = '/eomscch/wffrom/inst/edit?_rel=sheet-manage%26overtimeflag=0%26processDefName=bps.cch.P_CCH%26sheetType=HA-052%26baseSheetId=126328156%26activeDefId=P_CCH_T1%26activeInsId=1273948101%26workItemId=779180301%26workItemState=10%26processInsId=12429212';
		    hashVal = '#HA-700';
		} else if (sheetname == '仪器仪表使用管理工单') { // 查询 执行openInParentTab2()
			title = '仪器仪表使用管理';
			type = '70001';
			url = '/wffrom/inst/edit?_rel=%26processDefName=bps.ia.P_IA%26sheetType=%26baseSheetId=78389251%26activeDefId=%26activeInsId=%26workItemId=%26workItemState=%26processInsId=5775726%26callPage=query';
			context = 'eomscch';
			url = indexVariable.formatInstrument(url,context);
		} else if (sheetname == '集客故障工单') { // 未接工单测试环境是a标签，生产环境是openTab()
			title = '集客故障';
			type = '020102';
			url = '/groupfault/jkwffrom/inst/edit?specId=1%26processDefName=bps.jkfault.P_JKGZ&sheetType=HA-063%26baseSheetId=121416550%26activeDefId=P_JKGZ_T1%26activeInsId=1273879173%26workItemId=779138057%26workItemState=4%26processInsId=12393757%26_rel=sheet-listUndo';
		    url = indexVariable.formatRealTime(url);
		} else if (sheetname == '实时性能管理工单') {// 以a标签的形式，跳转
			title = '实时性能管理';
			type = '020201';
			url = '/eomsnewsheet/wffrom/inst/edit?_rel=demo_page1%26processDefName=%26sheetType=HA-055%26baseSheetId=253966954%26activeDefId=%26activeInsId=%26workItemId=%26workItemState=%26processInsId=27255281%26callPage=query';
		    external = false;
			url = indexVariable.formatRealTime(url);
		}
		allUrlIframe = type+
					   '&url='+url+
					   '&urlName='+urlName+
					   '&urlCode='+urlCode+
					   '&external='+external+
					   hashVal;
		indexVariable.addTab(title, allUrlIframe);
	},
	formatRealTime: function (url) {
		url = unescape(url);
		url = this.replaceTmById(url);//$(event.target).parents(".unitBox:first")
		return url;
	},
	replaceTmById: function (url,_box) {
		var $parent = _box || $(document);
		return url.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function($1) {
			var $input = $parent.find("#" + $1.replace(/[{}]+/g, ""));
			return $input.val() ? $input.val() : $1;
		});
	},
	formatInstrument: function (url,context) {
		var target = win.location.href;
		var target2 = target;
		var idx = 0;
		var count = 0;
		var tindex = 0;
		while (count != 3 && idx != -1){
			idx = target2.indexOf("/");
			target2 = target2.substring(idx+1);
			count++;
			if (count != 1){
				idx += 1;
			}
			if (idx != -1){
				tindex = tindex + idx;
			}
		}
		target = target.substr(0,tindex);
		return target+"/"+context+url;
	},
	loadHeaderMenu: function () {
		eomsGlobal.ajaxFn('/haeoms/menu/findNavTree',function (res) {
			sessionStorage.setItem('findNavTree',JSON.stringify(res));
			location.reload();
		});
	},
	loadJobList: function () {
		eomsGlobal.ajaxFn('/haeoms/home/findJobList',function (res) {
			var operProTempArr = [],
			    publicServiceTempArr = [],
				operProValue = '',
				publicServiceValue = '',
				arr = [],
				item = {};
			if (indexVariable.objIterator(res,'responseBody.data')) {
				arr = res.responseBody.data.concat();
				for (var j=0,len=arr.length;j<len;j++) {
					item = arr[j];
				 if (item.TYPE == '0') {
				   if (item.FLAG == '1') {
				     operProValue = item.ID;
				   }
				   operProTempArr.push(item)
				 } else if (item.TYPE == '1') {
				   if (item.FLAG == '1') {
				     publicServiceValue = item.ID;
				   }
				   publicServiceTempArr.push(item)
				 }
				}
			}
			function reloadOperList (arr,val) {
				var type ='';
				for (var i=0;i<arr.length;i++) {
				  if (arr[i].ID == val) {
				    type = arr[i].TYPE;
				    break;
				  }
				}
				var jsonObj = {
				  type: type,
				  jobid: val
				};
				var jsonStr = JSON.stringify(jsonObj);
				eomsGlobal.ajaxFn('/haeoms/home/changeJob',function (res) {
					if (res.responseBody && parseInt(res.responseBody.data) == 0) {
						indexVariable.loadHeaderMenu();
					} else {
						alert('切换失败');
					}
				},'post',jsonStr);
			}
			var len0 = operProTempArr.length;
			if (len0==1) {
				document.querySelector('.left-item-div-p0').innerHTML = operProTempArr[0].SHORTNAME;
				$('.left-item-div-p0').show();
				$('#cc1').hide();
			} else if (len0>1) {
				$('#cc1').combobox({
				    data:operProTempArr,
				    valueField:'ID',
				    textField:'SHORTNAME',
					panelHeight: 'auto',
					value: operProValue,
					onChange: function (val) {
						reloadOperList(operProTempArr,val);
					}
				});
			} else if (len0==0) {
				document.querySelector('.left-item-div-p0').innerHTML = '暂无该职位';
				$('.left-item-div-p0').show();
				$('#cc1').hide();
			}
			var len1 = publicServiceTempArr.length;
			if (len1==1) {
				document.querySelector('.left-item-div-p1').innerHTML = publicServiceTempArr[0].SHORTNAME;
				document.querySelector('.left-item-div-p2').innerHTML = publicServiceTempArr[0].SHORTNAME;
				$('.left-item-div-p1').show();
				$('.left-item-div-p2').show();
				$('#cc2').hide();
				$('#cc3').hide();
			} else if (len1>1) {
				$('#cc2').combobox({
				    data:publicServiceTempArr,
				    valueField:'ID',
				    textField:'SHORTNAME',
					panelHeight: 'auto',
					value: publicServiceValue,
					onChange: function (val) {
						reloadOperList(publicServiceTempArr,val);
					}
				});
				$('#cc3').combobox({
				    data:publicServiceTempArr,
				    valueField:'ID',
				    textField:'SHORTNAME',
					panelHeight: 'auto',
					value: publicServiceValue,
					onChange: function (val) {
						reloadOperList(publicServiceTempArr,val);
					}
				});
			} else if (len1==0) {
				document.querySelector('.left-item-div-p1').innerHTML = '暂无该职位';
				document.querySelector('.left-item-div-p2').innerHTML = '暂无该职位';
				$('.left-item-div-p1').show();
				$('.left-item-div-p2').show();
				$('#cc2').hide();
				$('#cc3').hide();
			}
		});
	},
	loadDutySchedule: function () { // 首页--我的待办--值班作业
		eomsGlobal.ajaxFn('/haeoms/home/findDutySchedule',function (dutyRes) {
			if (indexVariable.objIterator(dutyRes,'data')) {
				var len = dutyRes.data.length;
				document.querySelector('.todo-itemvalue1').innerHTML = len;
			   document.querySelector('.todo-content10').innerHTML = len;
			  $('.todo-dayWork').addClass('show-dayWork').removeClass('hidden-dayWork');
			} else {
			  document.querySelector('.todo-content10').innerHTML = 0;
			  $('.todo-dayWork').addClass('hidden-dayWork').removeClass('show-dayWork');
			}
		});
	},
	loadOperation: function () {
		// 运维待办和需求待办信息
		eomsGlobal.ajaxFn('/haeoms/home/findOperation',function (res) {
			var operValue = 0,//运维待办的总值
			    needValue = 0,// 需求待办的总值
				operHtml = '';
			if (indexVariable.objIterator(res,'data')) {
			  for (var i=0,data=res.data,len=data.length;i<len;i++) {
				  switch(data[i].SHEETTYPE){
					case 'HA-001':
					    needValue += parseInt(data[i].C);
						document.querySelector('.todo-content20').innerHTML = data[i].C;
						break;
					case 'HA-002':
					    needValue += parseInt(data[i].C);
					    document.querySelector('.todo-content21').innerHTML = data[i].C;
					    break;
					case 'HA-003':
					    needValue += parseInt(data[i].C);
					    document.querySelector('.todo-content22').innerHTML = data[i].C;
					    break;
					case 'HA-008':
					    needValue += parseInt(data[i].C);
					    document.querySelector('.todo-content23').innerHTML = data[i].C;
					    break;
					default:
					    operValue += parseInt(data[i].C);
						operHtml += '<p onclick="indexVariable.clickOper(\''+data[i].SHEETTYPE+'\')" class="todo-sublist">'+
										'<span class="todo-listtext">'+data[i].N+'</span>'+
										'<span class="todo-listvalue">'+data[i].C+'</span>'+
									'</p>';
				  }
			  }
			}
			document.querySelector('.todo-itemvalue0').innerHTML = operValue;
			document.querySelector('.todo-itemvalue2').innerHTML = needValue;
			document.querySelector('.todo-bottom-content0').innerHTML = operHtml;
			$('.todo-bottom-content0 .todo-sublist:nth-child(2n)').addClass('todo-sublisteven');
		});
	},
	loadTube: function (userName,tel) {
		eomsGlobal.ajaxFn('/haeoms/home/fastPass',function (turbeRes) {
			var dataImg = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAOa0lEQVR4Xu2d629cxRmHZ84560s2JgFD03CHcqfcCRQKhc+l/CcFpH5HmKqqVNHGzu461GorJD5aaqm93rUDSOkVeqH3Nr1AoS0tTTC+7B57Y6/3zFttEqQqEmTeA+9ods4vXxIn75nL85tn37GzcbTCDxAAgQ8koMEGBEDggwlAEJwOEPgQAhAExwMEIAjOAAjkI4AOko8bnioIAQhSkKCxzXwEIEg+bniqIAQgSEGCxjbzEYAg+bjhqYIQgCAFCRrbzEcAguTjhqcKQqCwghyqtyYKkvHHss0nHt1TSF6FFiSK9FMfy+kJfBBj6GkIEnjIZ2+v30EgiF3oEMSOU1BVEMQ+TghizyqYSghiHyUEsWcVTCUEsY8SgtizCqYSgthHCUHsWQVTWW2kTylFhfzSJT9EPfHYI2NP858b/CfwZd7Bz1B8B+gg4oj9mwAdhJMJOgiHVhC1+BzEPkZ0EHtWwVSig3CiRAfh0AqiFoJwYoQgHFrs2mqjTeyHPHzgsUfOC+KLGsjD/nDJB06kq83U2C/J30oI4lc2LvIQF4SIdA2CeHWy0EHs4xAXZGJiIho/8KXMfkn+Vrp4xXKxewhiT9mBIBSNH0ghiH0m4pUQxB6xvCBE0XgTgthHIl8JQewZiwsyO0vxiXLas1+Sv5W4YvmVjYs8IAgjcxeBMJaTuxQdxB6duCATE0eT8QN37dgvyd9KCOJXNi7ykBfkKCXjnRSCeHS20EHsw4Ag9qyUi1csxnJyl0IQe3TigszMvFbqXnpd135J/lZCEL+ycZGHvCCvUal7ImUJ0n97dRRFp96/ZYz5wDXa1HxYpNxv+9Nfl19HJN9q8uzbhrVNzceZR6EFkf5GZfj3IPZyufj3IHnyCEKQiVkaGi+n2/Zx9LuG/HfyyxMIZw8h1fqaRxCCzM7S0AkIMtC+QBDB+CrN14c17dviTOFrIJw9hFTrax5BdJBKk4Y1pRBkgI2BIILhQRBBuI6GhiCCoJ87+tbIRmf8JGcKXwPh7CGkWl/zCOKK9dxRGtnopBBkgI2BIILhHZx9e7RU3tPhTOFrIJw9hFTrax5BdJCDszRaKqcQZICNgSCC4R18hUZLaxBEELH40BBEEPFM/Z1d3Wj3JmcKXwPh7CGkWl/zCOKKNVOnXd0o9U6QkA5wCHvJ89afIAR55vnj5ZHxXRucEF28YnHWg1p5AsUV5Mjx8kgPgsgfscGeobCCPH+Eyq1eig4y2OdXfPWFFWR69t3dpjyScgjjisWhFUZtcQU5+u5u04EgYRxjuV0UWBDabTopOojc2Qpi5MIK8rW55bFdyXCbkyKuWBxaYdQWVpDvzNFYJ0khSBjnWGwXhRWk0lw5T1OpxSGLDsKhFUYtBGHkCEEYsAIpLbAgdJ6mFB0kkIMstY3CCjLz0uqebjdZ54BFB+HQCqMWgjByhCAMWIGUFlaQyRfW9iZD8RonRwjCoRVGLQRh5AhBGLACKS2uIEdpb9JJ0UECOchS2yisIIcX1s/PdLTKAYsOwqEVRi0EYeQIQRiwAiktrCAHZ1sXlMp6hZMjBOHQCqO2uIIstS4oZRAkjGMst4vCCvLtpdYFJyGI3MkKZOTCClL7XnuchtV7nBxxxeLQCqO2uIK83B6nbQgSxjGW20VhBfl6vX3hcKSWOWjRQTi0wqiFIIwcXQiSJxDGFoIq9TWPIL5x3Ey9fWHXww4CQewdhiD2rNiVlWZ6kSZ6l/Ogr4Fw9hBSra95BNFBIMjgqwJBBDOEIIJwHQ0NQQRBP3sk/USvRyc4U/gaCGcPIdX6mkcQVywIMviqQBDBDKfmTuyLk9HjnCl8DYSzh5Bqfc0jiA4yNbexL04MBBlgYyCIYHjfenlj39Y2BBFELD40BBFEPN3Y+KRR5r+cKXwNhLOHkGp9zSOIKxYEGXxVIIhghpPfXd6fjAy/w5nCVSCcNRW99olH90xIMsjz1p8gOsjk0ub+JMu8E0QybIzNJ1BYQWaWNvd3IQj/xBTsicIKUp1bvlglw//h5O3iisVZD2rlCRRXkBc3L1Y7GQSRP2MDPUNhBTlYf++SUjT0b0566CAcWmHUFlaQZ+udS3pRD4KEcY7FdgFBGGjRQRiwAiktrCCV5sqlmkpvc3KEIBxaYdQWWJDOpZp6ECSMcyy2i8IK8o3vr1w2VCr9i0MWHYRDK4zawgoyfWTlMtODIGEcY7ldFFiQzmWm1/Ougxxupg8ZUmSISEfKREYRnflYDZVMTDtkDJGOS8YYRTF1KTOKdFTq/zbFRpFJFOmYzKlfG0XZqfphk5itU7W9EtGuZNj0+n+WKeplHSqXRk0vI9rpKRru/zyyQdFQ2XR7RCM9ou0donh4rynvvEdb20SdPYbisX3m/G1F6ck3aHWjSw9ddJNZXlZ07JiiiQlFSmmSO7puRi6sIFPzq5fHcfJPDmYXV6w8gXD24KrWBSsXe8mTRxBvVpya71wexz0IInTKIIgQ2DPDatnhlZp5qXN5twtBpDhDECmyp8cVF6TWWLuCVPwPzjZchJ6npXP24KrWBSsXe8mTRxBXrFrj5BWkdiCI0CmDIEJgXV2xJl9YuzIZit/ibMNF6HlesTh7cFXrgpWLveTJI4gOMrm4dmViIIjUIYMgUmQdfQ7y7OLJK3tmBx1EKEcIIgTW1RWrOr9+lYqjNznbcBF6npbO2YOrWhesXOwlTx5BXLGqR05epXo7EETolEEQIbCuOsjkwvrViY7+ztmGi9DzvGJx9uCq1gUrF3vJk0cQHeTwwvrVGQQRO2MQRAytm78oPLywdXWmu152EFm07kaX/qZuLnbS7yDceVzsW/xv0ivN9U9pit7gbD6UV0XOnlHrJwEI4mcuWJUnBMQFOTjXuqaU6Nc5+0UH4dBCrSQBcUGml1rXmAyCSIaIseUIQBA5thg5AALighyqt66NIv03DitcsTi0UCtJAIJI0sXYA09AXJBvvrh17c5OFx1k4I9KMTcgLkit0b6OlPorBy+uWBxaqJUkAEEk6WLsgScgLsjUXPv6OFF/4ZBCB+HQQq0kAXFBDi+2r8+Mf4I8c+R4+YrWvq1jFym9f0zp899U+vhupcdGlV4bVrq8ovTokNLpkNIjbaU3S0oPl5QeSpReW25HQ4nWW/2PY623t5QuxVqXEqW7sdbJdkfvRFonsdaPf36c9V8/SIaNsfkECitIdaH1pNL6y3xk9k9opb/yxUfGnrR/ws9KX9+K7oKWuCDVevsGFak/czbj4ooFQewTgSD2rNiV1SPtG1QPgrDBefQABBEMY3IhvTHRdIwzBToIh5Z8LQQRZDy9kN5oIIggYfmhIYggYwiCT9IFj5f40OKfpFea6U2a6E+cneCKxaElX4sOIsgYgqCDCB4v8aHFO0htfuVmikt/5OwEHYRDS74WHUSQcW0+vZligiCCjKWHhiCChGtL6c2UQRBBxOJDQxBBxIcW0k9Hmv7AmQJXLA4t+VoIIsjYc0HuVEoZImV0pDPV/5mUMdqYSOlMaWXMmd9TmoxWUUZamX6dUsYoffqZ/hj95+isMRSRefwLe78qiNfJ0BBEEHO1sXqLUsnvOVO46CCc9RS9FoIInoBqY+MWpQwEEWQsPTQEESQMQQThOhoaggiCnppbvTVOkt9xpsAVi0NLvhaCCDI+vLhxa2YMBBFkLD00BBEkDEEE4ToaGoIIgq7U127TUfxbzhS4YnFoyddCEEHGlaWN23RmIIggY+mhIYgg4cnG2u2Jin/DmQIdhENLvhaCCDKebmzcbpSBIIKMpYeGIIKEIYggXEdDQxBB0JXm2h2a4l9zpsAVi0NLvhaCCDKuNDfv0JRBECHGeQ6v0FKcDxvE/5Neq6/fSVH0Kw49dBB7WhDEnlWeSvl/cgtB8uRi/QwEsUaVq1BekKXNOynL0EFyxXPuhyDIuRl9lApxQQ4trN8V6eg1ziJxxbKnBUHsWeWpdCDI5l2RziBInnQsnoEgFpA+Qom4INXG+t1KRb/krBEdxJ4WBLFnlacSguSh5tEzEEQ2DAeCbN6tVIYOIpQjBBECe2ZYcUGm5lsH4lj/grMNXLHsaUEQe1Z5KsUFmV5sHTAGguQJx+YZCGJDKX+NA0E2DxiToYPkz+hDn4QgQmBdXbEq9dY9OtI/52wDVyx7WtVG+lS/2hhz6sUuiiL6/4/P/r3+n79faz9Lf1x9ah7bH/0M35/77PnOXkPeNT3x6J4J2/XkrRPvIJWlzj0660GQvAl58FyeLuXijYQu0IgLUmu07iWlf8bZDDoIh5Z8LQQRZAxBBOE6GhqCCIKuNTr3kuqhgwgylh4agggSrjRbn9GkX+VMgSsWh5Z8LQQRZAxBBOE6GhqCCIKu1dv3UaRe4UyBDsKhJV8LQQQZQxBBuI6GhiCCoGuL7fvIoIMIIhYfGoIIIj600L4/0uqnnClwxeLQkq+FIIKMpxfa9xsIIkhYfmgIIsi42mx/VpH6CWcKdBAOLflaCCLIOI8ggstxOnQoop9+QySx3hiI92JZHjUIIv+OU8socpehg+RGd+4Hp+bbD8Sx+vG5K8OrQAcZ/EzF3807vdh+wBgIMshHBVcswfQqC6sPap38SHAKb4cOpYPgiiV4xCoL7Qe1VhBEkLH00BBEkHBlqf2gziCIIGLxoSGIIOJaI/0cKfqh4BTeDh3KFQufgwgeMQgy+F/mhSAQRIRAKB0EVyyR43F60EozfUgT/UBwCm+HhiDeRmO9MPG/B4EguGJZn0YPC8UFqdbXHjYqetjDvTtZkotvbia9kf4ViztHCPvu71lcEC5Y1IOATwQgiE9pYC3eEYAg3kWCBflEAIL4lAbW4h0BCOJdJFiQTwQgiE9pYC3eEYAg3kWCBflEAIL4lAbW4h0BCOJdJFiQTwQgiE9pYC3eEYAg3kWCBflEAIL4lAbW4h2B/wEvPehfr6yB7AAAAABJRU5ErkJggg==','data:image/png;base64,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','data:image/png;base64,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','data:image/png;base64,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','data:image/png;base64,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','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAOSklEQVR4Xu2da29cxRnHZ+acXWfjhEAgBCh3COF+K5eYa17CCyqgOt5dQyrUF7zrR0CYquo3qdT6A1TilYHY6931NjSAE9tnbYdCKZACTUPi2zkz1QaQUCpgniOe0eycf6TISvycufz+89tnHG1sKfALBEDgBwlIsAEBEPhhAhAEpwMEfoQABMHxAAEIgjMAAsUIoIMU44anSkIAgpQkaGyzGAEIUowbnioJAQhSkqCxzWIEIEgxbniqJAQgSEmCxjaLEYAgxbjhqZIQKK0gS3PjkyXJ+GfZ5sGxqVLyKrUgSsrXf5bTE/gg2pg3IEjgIV+8vUEHgSB2oUMQO05BVUEQ+zghiD2rYCohiH2UEMSeVTCVEMQ+SghizyqYSghiHyUEsWcVTGXaGX9dGFnKf7okhyjN5IFHp94gPxfAA/hn3gBC5N4COgg3YQ/HRwchhIIOQoAVSCm+BrEPEh3EnlUwlegghCjRQQiwAimFIIQgIQgBVoHStF03BR7z7pEDh/4SxD9qIA/7o8UeuDFC9jt1bb8kfyshiF/ZuMgDghAydxEIYTmFS9FB7NGxCzI5OaleeuZkbr8kfyshiF/ZuMiDXRBjJlW/A0F8OlroIPZpQBB7VsLFKxZhOYVLIYg9OnZBpqaS6IHrVWa/JH8rIYhf2bjIg10QM5VEfQji1clCB7GPg12Q6enD8bW1/dv2S/K30sUrlovdQxB7yhDEnhW+BiGwclHq4gWLXRAzfTjuo4O4OC/Wc6CDWKMS7IL0eq9W9mRntuyX5G+li1csF7uHIPaUvRRk8PZqpcSF929p/cMS29T8GArqt/0ZrMserb+VRfZtw9qm5ufMw8ULFrsgpvdqpU/sIC7+/wH+P4i9wL7mEYQgCwtJtXpWbdrHIYSvgVD2EFKtr3lAEMZThg5iDxeC2LMiV6Z/fXZE7L1kg/Kgr4FQ9hBSra95BNFB0vTZEfEFBBlmYSAIY3pp+rsR8cXn6CCMjLmHhiCMhNemX9mR1dbXKVP4GghlDyHV+ppHEFcsCDL8qkAQxgxbraS2T6nzlCl8DYSyh5Bqfc0jiA7yUSupbUCQofYFgjDGB0EY4ToaGoIwgu71ntu5J9t5jjKFr4FQ9hBSra95BHHF+qT33M5zHgoS0gEOYS9F3tkQhCDH3zwyunPP1teUEF28YlHWg1p+AuUV5PiR0Z3rEIT/iA33DKUV5NPjR0bPQpDhPr0OVl9aQRamk13VmjpLYYwrFoVWGLUQhJAjBCHACqS0tIJ8vpDsOnMWHSSQc8y2jdIKsjjzq91RXPsvhSw6CIVWGLUlFuS3u6P4HAQJ4xyz7aK0gqTtly4RIjtDIYsOQqEVRi0EIeQIQQiwAimFIIQgIQgBViClpRVkpZfs0Zn6DyVHCEKhFUYtBCHkCEEIsAIpLa0g704/f+mu2shXlBwhCIVWGLWlFWTt3ecvzTYhSBjHmG8XJRbklUuzzXV0EL6zFcTIpRXkvaMTl9Uq+ZeUFHHFotAKo7a0gnx4dOKyLQgSxilm3EVpBVloJXurSn1BYYsOQqEVRi0EIeQIQQiwAiktrSAftZK9G+gggRxjvm2UVpCTnRcuj0313xS06CAUWmHUlliQ31wem00IEsY5ZttFaQVZmm5eoWr6NIUsOgiFVhi15RWk17xCZf4JUiSQMI4ifRcuXrCK5BHEN45bgiD0E+nZExCEMZD0nWSfqKrPKVP4GghlDyHV+ppHEB0kPZbsE1sQZJiFgSCM6UEQRriOhoYgjKD7sy9caaLqZ5QpfA2EsoeQan3NI4grVn/2yJUm2oIgQ2wMBGEM7/12c/8OoT+lTOFrIJQ9hFTrax5BdJDVdnN/DkGG2hcIwhgfBGGE62hoCMIIeqGbXFXV6l+UKXwNhLKHkGp9zSOIK9ZaN7kqgyBD7QsEYYzvxDsvXl2pVj6hTOEqEMqayl57cGxqkpNBad+LdaL38tWVbNs7QTjDxth0AqUV5FTv5au3IQj9xJTsidIKsjjTuCaKzT8pebu4YlHWg1p+AuUV5FjjmmgLgvAfseGeobSCLLWSXyilPqbEhw5CoRVGLQQh5AhBCLACKYUghCAhCAFWIKWlFSRtv3itEJWPKDlCEAqtMGpLLMhL1wqRQZAwzjHbLkoryPtvN67bMWL+QSGLDkKhFUZtaQXpdxvXGQ1BwjjGfLuAIAS2LjpI2m0+bURujFEmUloLo4wxuRl8jKJIb5vB56SJIqOFkRc+N6iNI60HHwe/hc5MHMfamMwYrYwwkdFxrs3go942RkemWsn14OPgt9ZbZqQ6oo3eNEbHRucbxuSxqY3U9Jl83eR5xeTZebOrNqrz7KzJt0dMtrXD7N29obPNUZOtf2a2vt5l7tx3WovT+4w4cZcRk5NGCmEIeL0sLa0gHxxNrh+pqA8pqbgQpEgglD24qnXBysVeiuQRxNvdV3rJ9TqDIFyHDIJwkf1mXMk7vBAQhJcwBOHlyy7IidmJGypRfoqyDRehF2nplD24qnXBysVeiuQRxBVr9djEDfkWBOE6ZBCEi6yjK9bJucaNsTRrlG24CL3IKxZlD65qXbBysZcieQTRQdbmGjdmEITtjEEQNrRuvkiHILwBQhBevuxfpC92kpsio1Yp23ARepGWTtmDq1oXrFzspUgeQVyxTnWSm7YhCNsZgyBsaN1csZaP/vpmWYlXKNtwEXqRVyzKHlzVumDlYi9F8giigyzPT9ws8xyCMJ0yCMIE9tth2b8G+XB+4uYtTwXhRetudO5v6uZiJ4MOQp3Hxb7ZBUln67eISPQpmw/lVZGyZ9T6SYBfkF79FpFBED/jx6p+igC7IP1WcqtRKv2phXz/8+ggFFqo5SQAQTjpYuyhJwBBhj5CbICTALsgK+2JA1rky5RN4IpFoYVaTgIQhJMuxh56AhBk6CPEBjgJ8AvSqd+mjViibAJXLAot1HISgCCcdDH20BNgF2RxJjkYxWqRQgodhEILtZwE2AVZnU8O5rl/ghx/88jovWc2Nt7ad1ru3n2brNW+ktXq1zL+eL+MR87JqHqZVJV1qeIN+eVXu2UUb0oVb0kVjcrz6+eUijKpzu+Qg48yyuR6tEMqlUm5kUulqlKqbz4eOPQn0s9G4QwbY9MJlFaQ5fb4a1LI39OR2T8hhfzDrYf+/Jr9E35W+vpWdBe02AVZajVvV0qfpGzGxRULgtgnAkHsWZEr13rN27MMgpDBefQABGEMY3mufoeU4gRlCnQQCi3+WgjCyBiC4GsQxuPFPjT71yCn5up3bKODsAfJOQE6CCPdtJ3cKYRaoEyBKxaFFn8tBGFkDEFwxWI8XuxDs1+x0pnmXSLWH1B2gg5CocVfiw7CyDjtNu8SGoIwImYfGoIwIoYguGIxHi/2odmvWP3Z+t0mEu9TdoIrFoUWfy06CCPj/nz9bpN7K8iDRggthdFSyFwIqY0c/FTbwd+J3AiphTTaGKGFMXrwDsTB5wc/39Z8++f///w3tYPPD8Y+ODb1R0a8ToaGIIyYT7aSe2Kl3qNM4aKDUNZT9loIwngCVlrJPRqCMBLmHxqCMDJe6SX36AwdhBEx+9AQhBHxYrt5byT0ccoUuGJRaPHXQhBGxqvt5r05BGEkzD80BGFkDEEY4ToaGoIwgl7q1O9TRvydMgWuWBRa/LUQhJHxaqd+Xw5BGAnzDw1BGBkvzyb3y0i9S5kCHYRCi78WgjAyXu4m90sNQRgRsw8NQRgRr3Un7s90jg7CyJh7aAjCSDhtNR4QyhyjTIErFoUWfy0EYWSczjceEDkE4UJc5PByrcX1uEH8nPR0rv6gkOJvFHjoIPa0IIg9qyKV7P8fBIIUicX+GQhiz6pIJb8gvfqDIkMHKRKOzTMQxIZS8Rp2Qfrt5JdGqB5libhi2dOCIPasilRCkCLUPHoGgvCGwS7I4kzjoSg285RtoIPY04Ig9qyKVLILstJpPKQNBCkSjs0zEMSGUvEaCFKcnRdPQhDeGNgFWZqtP6wi0aVsA1cse1oQxJ5VkUp2QVa69Ye1hiBFwrF5BoLYUCpeA0GKs/PiSQjCGwO7IEut5BGlVIeyDVyx7GmlnfHXB9VaiwtZKiXM9/988d8NPv9drf0sQigpL8xj+2uQ4XdzXzzfxWsouqaDY1OTtuspWscuyOr8xCN5nkOQogl58FyRLuXijYQu0LALsjzXeFRK06ZsBh2EQou/FoIwMoYgjHAdDQ1BGEGvzTUezdBBGAnzDw1BGBmn7fohIcQcZQpcsSi0+GshCCNjCMII19HQEIQRdDqbjIlItShToINQaPHXQhBGxmknGRMGgjAiZh8agjAiTjvNMWE0OggjY+6hIQgj4X6r8ZhRZpYyBa5YFFr8tRCEkXG/23jMaAjCiJh9aAjCiHhxbvzxSMoZyhToIBRa/LUQhJFxf278cUMUhHE5TocORfQLb4g0kvTGQLwXy/Ko9efHHzc5rYNYDu19WSiCoIMwHrWldvKEEuoo4xTeDh2KIOggjEdspd18QgsNQRgZcw8NQRgJL800nlSxeYdxCm+HDqWD4IrFeMSWOo0nlYEgjIjZh4YgjIhXO40ncwjCSJh/aAjCyHh5dvwpGcm3GafwduhQrlj4GoTxiC13x5+SGoIwImYfGoIwIl7tjj+VQxBGwvxD44rFyDhtJU8Lpd5inMLboUO5YkEQxiOWdptPC60hCCNj7qFxxWIknM41DmuhDzNO4fXQLr65GTeAQQehzhHCvgd7Zv++WFSwqAcBnwhAEJ/SwFq8IwBBvIsEC/KJAATxKQ2sxTsCEMS7SLAgnwhAEJ/SwFq8IwBBvIsEC/KJAATxKQ2sxTsCEMS7SLAgnwhAEJ/SwFq8IwBBvIsEC/KJAATxKQ2sxTsC/wOhV+5fU5nOzQAAAABJRU5ErkJggg=='];
			var arr = [],
				preUrl = '',
				urlIndexOf = '',
				listData = [],
				html = '';
			if (indexVariable.objIterator(turbeRes,'data')) {
				if (turbeRes.data.length<=6) {
					arr = turbeRes.data.concat();
				} else if (turbeRes.data.length>6) {
					arr = turbeRes.data.slice(0,6);
				}
			  $('.fast-nodata').addClass('hidden-fast').removeClass('show-fast');
			} else {
			  $('.fast-nodata').addClass('show-fast').removeClass('hidden-fast');
			  channelList = [];
			  return;
			}
			for (var i=0,len=arr.length;i<len;i++) {
			  urlIndexOf = '';
			  listData = turbeRes.data[i];
			  if (listData.URL.indexOf('../') == 0) {
			    urlIndexOf = listData.URL.replace('../','/workbench/');
			  } else if (listData.URL.indexOf('./') == 0) {
			    urlIndexOf = listData.URL.replace('./','/workbench/jsp/');
			  } else {
			    urlIndexOf = listData.URL;
			  }
			  if (listData.SUBSYSTEMID==1) { // 新emos+'&_='+this.$store.state.menu.phone
			    if (listData.URL.indexOf('?')>-1) {
			        preUrl = urlIndexOf+'&phoneUser='+userName+'&_='+tel;
			    } else {
			        preUrl = urlIndexOf+'?phoneUser='+userName+'&_='+tel;
			    }
			    arr[i].iframeLocation = listData.MTYPE+'&url='+preUrl.replace(/&/g, '%26')+'&urlName='+encodeURI(listData.NAME)+'&urlCode='+listData.CODE+'&external=false';
			  } else {
			    if (location.host == '10.87.61.43') {
			      if (listData.SUBSYSTEMID==2) { // gpm
			        preUrl = 'http://10.87.61.43/gpm/IntoGpm.gpm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==3) { // 值班作业
			        preUrl = 'http://10.87.61.43/ess/IntoEss.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==4) { // 公共服务
			         preUrl = 'http://10.87.61.43/wrm/Login.do?userName='+userName+'&myaction='+urlIndexOf+'&pass=&flag=portal';
			      } else if (listData.SUBSYSTEMID==5) { // 专家值班
			        preUrl = 'http://10.87.61.43/edm/IntoEdm.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==6) { // 需求管理
			        preUrl = 'http://10.87.61.43/wsc/IntoWsc.wsm?userName='+userName+'&url='+urlIndexOf;
			      }
			    } else {
			      if (listData.SUBSYSTEMID==2) { // gpm
			        preUrl = 'http://10.97.87.8/gpm/IntoGpm.gpm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==3) { // 值班作业
			        preUrl = 'http://192.168.7.39:9080/ess/IntoEss.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==4) { // 公共服务
			         preUrl = 'http://192.168.7.39:9080/wrm/Login.do?userName='+userName+'&myaction='+urlIndexOf+'&pass=&flag=portal';
			      } else if (listData.SUBSYSTEMID==5) { // 专家值班
			        preUrl = 'http://192.168.7.39:9080/edm/IntoEdm.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==6) { // 需求管理
			        preUrl = 'http://10.217.1.33:9083/wsc/IntoWsc.wsm?userName='+userName+'&url='+urlIndexOf;
			      }
			    }
			    arr[i].iframeLocation = listData.MTYPE+'&'+'url='+preUrl.replace(/&/g, '%26')+'&urlName='+encodeURI(listData.NAME)+'&urlCode='+listData.CODE+'&external=true';
			  }
			  html += '<div onclick="indexVariable.clickFastItem(\''+listData.MAINMENU+'\',\''+listData.iframeLocation+'\')" class="fast-item fast-item'+i+'"  title="'+listData.NAME+'">'+
						  '<p class="fast-item-icon"><img class="fast-img" src="'+dataImg[i]+'" alt=""></p>'+
						  '<p class="fast-item-text">'+
							  '<span class="fast-text-new"></span>'+
							  '<span class="fast-text-name">'+listData.NAME+'</span>'+
						  '</p>'+
					  '</div>'
			}
			// ./images/fast/gongdan'+i+'.png
			document.querySelector('.fast-container').innerHTML = html;
		});
	},
	loadSysCus: function (userName) {
		var faultSheet = [],
		    html = '';
		var dataImg = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAdCAYAAADCdc79AAAEsUlEQVRYhbVXXWwUVRg9M7tdW2hLAS0YNbRiTK0gVrSCodKh+qAmMiLG0J9o0gfjg9JRQB/Min3QlEIHePDBpP5gsCYSGH0x0dKRFEuUorThNxGFKFYpRSht127bHfO1Z5vbzraWwp5kcr/v/pzvzJ2597tXu1hchWuBadgpAJ7g8zCAhQAySdEN4AyAHwB8LY/jWgOT0c917TH+lAWZhj0DwKsAXgdws69DYlwEsA3ATse1+hL1mJYg07BXAvgYQM7oQHgRzfNaMgd6T6bEBjsjwZui/XpozpCmL/Y0bYUHLV2hOAvgRce1DkxZkGnYjwG4HUDUca3PFDHrAdRp8HR4gA6vTfO82syBnn0ftmxO+NZvPLA+rWPGLau7U2ZuALCU1TEArzmutUPhLgUQAvBHcxiNUqezIQPAXgAfAVimDNgIYLv0yxjoi+T2/vnmss72pXsObNg9kRhBzU87IrsOvvU5gEIALwHoY6zt5IxjOWPuLarGzFFBAMoAZPAt6ihmLYAtbO+YF+kqqTu8tWbj8U+GfAomgONaMce1PmDgDvbaQm7w/4oxdpkqqJRlo+NaZ03Dvg1APesuAVhVe8Q+lDgsigH5mMNPsa91RFi7cJBLUC8xJBaAb1lXMSzINOwsAI+wcl/8LZSlXOG41ilflGsEOSo4KlOZfYfl8qJqZGkr3vFk+r5g5TwAcwCcGF5IQIPjWqX/E1pmxaVtAPjO10OBadiyYNZxRvM5a38x3rPyyR5k9zOOa10AUMlG+bZhH+P1I0xuiVHZHMYFbqaCQp0qBT+zfI5lk+Nav9xoNeTcPy7WUZb5IiiPTrtp2HcAWED/yxstRsFXNBcUVUNittHPE0Fz6ZwHsEgZdDiJgn5U7EWMLcjWldV0iT91HL8mUdBvij0fwD+000VQUGnMUuxJs/R1QuWepdgBEaTuvJcVW44ZyYLKfUWxB0XQVTqy//ytNN6ZPD3IVWzZg2bT7hZBnXQkXRxTOj6UREGFin2MsQVdIiieFpY4rvU7gHP0V0+RvBVAAZ9WX2tiPM3ac81hSMz76J/SmSYE97OMp5FVpmHflZBuLHq4sR2lPSnIWTIuVgHLE7qyJyw0DTubWd7jSaB6MnJCTpGb+eT4Wv2oJrfEqC+qRjbP5YJWndt4fKWtYVZuoL/ONOwnfZR+QW/zmVTQmuJtTzGxgolbYj3DvCYaGnXHtWTZtcTHsNzEG4TgU9Ow83zsxJVQeihuR/Wg7utArF259Z6Ypu+i280YoCDBoeYwLscJ4h1LTMPOdVzrPLM+uB00mYa9xBdFdrVozzd8Qy0UG2zydQDw/KM1BYN6YD+5BJUSwzRsmdHHWbcbyomxgfuR+HIwl6y8R3mLW2UWTcN+2TTsCWdhPGrvfSFQVvTuK/2B0EFyCDaRW2Ax5tUxghzX6gVQzg7H47yOa9UCqOL5Re5l7wM4IrcF07DTfAoIO788873FldbpWTltfYHUnRwrHFXkjOM0Y5Y3h0c26GnfywBEAHyfOtR/cn6kqzcUGwhE9ZTZvcG0uwf1YGFUD6b+GwhhSAtgWveyKYia8OYa8GIjp3xNgzf8O40iOTfXccKSd7cH8B/MlJkHGUdZXgAAAABJRU5ErkJggg==','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAkCAYAAABxE+FXAAADQUlEQVRYhcWYTWgTQRTHf7Npa+sX1opU0UNRRPHj5EldMOAnCEYEbx48KOJFc1BQIdo9iYirJ/Ei4gd+XYqIqC0uEg+CHkQQ8QO8iAWrUlGxaZsdmWSSbneSzSZa/cOymffezH/fm/fe7EZ8XnuAElJJdy7QwsRiMJthUDE0USRdBNwCVkwwsYK0Ha4Au8WabmkBL4HFwCjwA8gBI4DQkagZDYFEFswjoQyma4MTTZpUXb9a/JFFNx8d+hA1O4wOzy3Tx4HtsAu4AGyzSl4J5Lt6iRvEez2t1SqHTcpf/4B4HJoCgwK5L6ydlvS7AcuwroAvyXRQ6APHOzz3kmlpoik0UYV/NdBlWMbHKqA+cilEM8Xwq8K/CiQM69rIA0/jGgc9l/o+BPQDUw3ryvjU4bkfK2pqIEiu6lrt+Q5L+jeip43D6JdkemmH574xNDUQzPaEdn9AN5m4+FZK1oY9l0K0qXtC+p6qQcOyCsaaTP0IlpPf8Cp/Si4RPylGYK/u8TLiehU3OrbDZNthQUBUdjLoebHJILpilNk8YJIhNYlnAE+At7bDHi0eLenLey6QBU8S0j+q6zyqw/XrRKuFTmChPnXO2Q69uheMJw94q57sRY1FI7H9yNfOgdb28yDOAluAO0CbPsTKx99YtiNGA7L9wPwQgdpr9eR3o4jXH8vNzrW290rEMjXU5BvUetkMr22H1QZ5KRHywlqXkP4pY9Ui9moPKsJ2mEJiUh+wTOuV7W1gZjbD4zCnEfZhq/lZWz53D5gTJpBC3BdShsUF2E5h/nVgeUh1MJthODA2w1763ZbPfQY2G6sXu6AhCxB3V5i3L5vhnDEhTC6Q8d6DTGK1xmm9JcESjSQm5HndSCVdVesXgR2h0qxJ/EfkqaSrGsgDYGXo7TEWMaFSM5TVkEq66qzPBrK6bmJCofpuaKtjawXidD3EYfK8oa2OVEhzOJvhTFXrKqh7z1NJt1mXlOqID1XCZTNcMwxjIOrwqIgeLz2iPZ/V46U3NkpMo9ne46X7DGEDqNvzv4Cyw1bprVX15FTSnTaRrLaDypdNejikPpGF/kReYlhPLE5aPV5anRYqgZ7/I1LFdxnI/L+/RYDfi+LnxNiiZ5oAAAAASUVORK5CYII=','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAkCAYAAAAHKVPcAAADeUlEQVRYhb2YSWgUQRSGv+6JW0DjhgfBXUQD7nqIa1pcQD00EiRuiAcFBcFBEE+CggsqtMvFiIog6sGFEclBQVrUgwruigoucQFB44ZrlJmSMm+cTqo7MxNn8sMw1VWvX/396m3dVn3lGlzH6w1sAUbRNvgM7En48VM9fA9r0kZlA7eAEW1EIIjplzdwoQQYGiDwEdgFvDTEW4CtUlbKshUytlAqacX0taWv9bysdwCqgUrRNh8aSbQPqJ+d8ONXo7f7f7iOdwC4BEwQUtgBra+LTUAj4ceTwOngXJBE0rijAPhlt5t4v+vgkmaamuxlF3LDEKxqn/p9pfzzsyMhRNqExGb5v26rVPXAr6+XGxKCSHb/iW3AGGA9sBp4aCt1MkplMUhoAsOB0WLpFcDYjsmGSJ8rNIltknPGAz2B+8CMbE5fSBKawFLZvEQITAPeGZJ5krgLdBGTzgSqDInGDPgNqBAr1AKdciWQC4m+QBlQKk/Yz5CAjsBPYIouSoDKh0AuJFZJWr8J1AMXDQl4pHMSsEyua3MgoPIhcSww1kXtiiGRwWFjJkcUO2OGIqaSTfYteu3IBcHjsELkV0q5PQsMAsoNiezQ5+9LpP2F9Br/kI3EVomOOt0KSB7IFdpZnyvL2neje/mnce8fRN6WjcQ9oLP0hNox7xgS4fiZtOwz53tX7K0ZUvVNrDhSR1LCjzcIwVASYZgcmNMm3RAiE4qYSlEzpGqetIt9ROaT63hbZO6f7mJVUd3G6dK9v9l0V2A70EPySpxihajrePoIdxgLGawT6+wpGgmpI2XGbAba/+Ym/Lj2l6zHUScmXATMARYaEk3x42yfqRVSa1SEs6fRLT3IRqJMfu1EcUtPp1Fa9uuLPu/nxoqJJ7mSWCwErkmIJgyJZoip1AfghfQTww2BRtQH2/5sJGoD4zdSTVvExLe3//5cx6uWsO7VTP6HPtaEH/+anihmASuVF+zdgE6Xj4FD0nvWu44XSwsWPE+I8sNylBdl44NSIHXntVNHBnDOdbx5l+F7kEQnQ2PrsFUIIC++lRFaZgm5BcHj6OU63iJDND8rDAPWGgvRqJ68iUr9faJ/IKSUOOPT4G2WylReZUWG/kGxwDpjpWUcT3+p0W3cglY9fgYDgKPyyp8PXqV9Yol2FPHc1iCZ8ON1ruPVACfyUgANfwA65eV35zH3HgAAAABJRU5ErkJggg==','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAFEklEQVRYhdWYT2zUVRDHP12WVrMRCHjSAsaDqTZagxEEbdLFQ+Fi1sYEhYOlhgOQELfEk9qG2h5hFQMeCFgTIWIi7I1ikIVU/jQGQmNoiAeIgJ6slpqGf23XvPJ97ez7/Vpb0ajfZPP7vXkzb2bnzbyZ9yv7pe5tZoJMOlcNrAZeBKqAhUBKSwwB14BLwCngSL6QvTjV8gsKuZLxtAzKpHPlQCOwCaiJMEyNXmA30JkvZO/ct0GZdK4B2AEsNuRB4ARwAbgM3BB9LvA48CxQB8wxMj8CzflC9tBUBiUjFkwY8hCwB1hjyEeBXUBXvpC9GxEqlZ8NrAI2A/X6Q19l0rmDwIZ8Ift7RGgyD2XSuUopf0qkc8DGfCH7XYR5Gsikc88DnwDPibvPGZkvZK+HHkpMYsxpY0wHsOyvGuMg2WVlxWKHSG7t09JVghIPaZvOSuBu+ehw05cn3/k8ouE+0FC3fd1oWeJTYLY89UJ3C+PbF3poj/FMY4wxLmgfAyqmYVKFeOda4qETW/cniqPrjaf22Plxg5RNPoA78oXsAcPnBI8BvwFXgAFgLzAvYsY92l7xXJHMMfNHx4wy27emto2GEoN0zuwQzQVwq1HwJHAGeNltsWgPAE1K/ZThTYnWJB4k42TPDCdmVXvGYllZq3Q57Khto9x6qNGcMy6bRoySj3WeDIrPZUq75twhmTW8WXNwtou3UbJzkqMjH3lG6dio4WLxjRu0Sc+jQTa5/V+p9y3AZ8B54H138or+quH3753iOS+ZLaKvtDElXUetDQnVJv+vdlGK+Wabvg/mzuq5yNAe1rM34PWybq0FwZzXWVPbRnVChRK5tStg/hm4FeMJh9t6zja0IvHwsm6tnwKOLul2WJ1U1XY4EVMOnNIDCtL3gEp5xtFfilV9D0sVEy5Ql/v40Fq3LWN3C3dr28YS4RVnS1ItBCqUcdiq4KzRwo0xPCHe0M+iV2vF4YIMqkqqn0FVOw4D8mJWrl8UbNMN8z4YjJ3HrwKHgZz6pTh43QuT5hy5EcPoMaQ0bo/MlOKZCGV68LpTkeL6byOpf58Ka06AlNmyMG0HjWe+VeBb9E9jy7zuoaR64Cp1enGYp3IwWetqt7oy6CzReAnwmrrIgcgKE7qvJdWQV6ntjMN2Y0ynOfSWxmSSRx44qXefnTVa660I94TuSwndDhzq1HZauBZircYuoF3b8KF+X0eWncBJw7feJMPasHWpbRvL2DoNTzmDjmgwRz2wxSOmah8O5sr1nLK3DmTdWo8Gc6vMZeBIQvcmvw2bA+ZfTTl4OphbrudVQ+vXM4w3L1s0PB5eZ293Cxd92u/Ws14NuYcL2ON63wm8qQD9wJzY1nP+vVE8SySzU/TjNgmkq97aMNZTq0H7QRlxTk39WE/kmqrk6Mjp4I7l0atT3KdzSjEZl5GD8mqfjJkF9KgsuTvbE90t3BnzkG6UzRJ0DNv8KsnRkYu3ZlU4pd+Y7XNVe5+C0Z4tQ6LtM11CUbLjxgjbzLWo2RlDzK3jC9NXrwv6aoaSD85LDd+crxaipGrHoEIB3B+WpUw657Jtv4YHu1t43c+FpWOD+RedEhxHavjmgArhnxmDeC5PYozvNvukcxyRm6u5KPouwN0OWoM+e8ZQzLhteleyrkKs6G7hul0rUlzd9dYxGk+5BXqC7JsRJNtjjHFrr5CuEkQ8ZDz1d39s8Cj52PCf/xzz//tgFWPcP/dJD/gDiPK4DSRoHLUAAAAASUVORK5CYII=','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAhCAYAAACxzQkrAAADZ0lEQVRYhdWXSWgUQRSGv0pPEhdIlCC44ooXt4AiBlzSgoIg2ioeXQ4qnsQR8aQRzx765FlBvEiQFoKIB1uNCx7E9SBxBT0oKmgkxpjMlNSkWidd1T3Tjgv+ECbz16vqb169Wlq8b99PrfJcfy7wOgjzX7IO1RL6I77XGREZ5bn+auAe0OW5/phax6sJSMN0AaMBV0M1G4F/AygGE0lBXaoF6peALDBvy5qX1gKVGcgC8wxYAmwHimVQ1zzXn2AMUEGZgBJg2oMwr1bYaWArMKjbFgKXs0JVDWSDaSgOugomignC/DlgA9CvrflA6Ln+VGPABFUFlARz9uqhV/HYIMxfBNYBvdqaB1ypFqoikA1GTZMNpgzqKrAWeK+t2RpqmhGcBSitZoxgE+o2oPq/KYO65bn+HCO4GiAbTLxmqoB6CKxQx4q2puhMJUJZgZJg0qYpSUGYfwq06exGUGpLWGDrYgDZYCrVTBVQr5sG+1YK5CNtTdJbggE14rS3wWTIzBXDAaQQT4WUu9T/e9qOTHw3anyXRCzWzaro13Z3cNcA+g3TJA1nWPeB1ujL7raO8R8amy8URd0ybfVqqNs/gGwwCatpJzDDeOSwjhqOBYjhHz9GP8+NQ4nlx2SWpa2mZZXh/hx0uuHCeVsfC1Sf2uVVUR/+lX3GoibgpeWvyQwtFbq6Xa5XR4u2xgK7csBe4AbwKYLxXH8fMAu4ow/Nch0AXsS8M/pzZ8yfCeyIZWYboIr6ehDmOz3XV8fMCcXQ3cHJXBDmezzXX6MqviwzB3T6VbrjQCrFi2JePVCw1NdkIzWwBdgIjAM6uzsYUJmJGnM6ffeMbqrikbaVcxx4GPM2AaMsQJnvQznDqazPwMdYlNRXjvgrjFpdp7IMbuzU/1r/F5BE2Grojyq1hgRSGObwFbU15jUAQ5aitq2yVKUClZhG6gmw2YiCHv0ZxBskokckHnOmsq6y3YZTQVlgSAFS6Ve/rtlz/dbGwrc6RxZL+9JXp6FYXyxIkOodrDgkclLXohiqc6KMqlehodGFgZwjC/X9TqNTEE40dvQC+c14agrQA30HbgfuDjgNIxoLjmN0sKjY7zQKy7RHumk4KavsIPC4mqemqJS1hPZOy5FUkjVDQZh/rq+X6i7cUiNYXM/05d8U8B1cyknZuS1/hwAAAABJRU5ErkJggg==','data:image/png;base64,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'];
		if (location.host == '10.87.61.43') { // 生产环境不带端口号
		  faultSheet = [{
		          id: 'mainmenu1',
		          name: '故障工单短信',
		          url: 'icon-zhidongxiguzhang',
		          type: '12',
		          iframeUrl: '12&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
		        },{
		          id: 'mainmenu2',
		          name: '非故障工单短信',
		          url: 'icon-tianxiegongdan-kuozhan-hebing',
		          type: '140',
		          iframeUrl: '14&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
		        },{
		          id: 'mainmenu3',
		          name: '公共服务短信',
		          url: 'icon-fabuxuqiu',
		          type: '10',
		          iframeUrl: '10&url=http://10.87.61.43/wrm/Login.do?user='+userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
		        },{
		          id: 'mainmenu4',
		          name: '需求工单短信',
		          url: 'icon-yingyongfuwu',
		          type: '141',
		          iframeUrl: '14&url=http://10.87.61.43/wsc/IntoWsc.wsm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
		        },{
		          id: 'mainmenu5',
		          name: '值班管理短信',
		          url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
		          type: '15',
		          iframeUrl: '15&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
		        },{
		          id: 'mainmenu6',
		          name: '机房管理短信',
		          url: 'icon-zhibanchaxun',
		          type: '700021',
		          iframeUrl: '700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
		        }]
		  } else {  // 测试环境带端口号
		    faultSheet = [{  //this.userName
		          id: 'mainmenu1',
		          name: '故障工单短信',
		          url: 'icon-zhidongxiguzhang',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
		          type: '12',
		          iframeUrl: '12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
		        },{
		          id: 'mainmenu2',
		          name: '非故障工单短信',
		          url: 'icon-tianxiegongdan-kuozhan-hebing',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
		          type: '140',
		          iframeUrl: '14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
		        },{
		          id: 'mainmenu3',
		          name: '公共服务短信',
		          url: 'icon-fabuxuqiu',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=10&url=http://10.87.61.48/wrm/Login.do?user='+userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
		          type: '10',
		          iframeUrl: '10&url=http://10.87.61.48/wrm/Login.do?user='+userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
		        },{
		          id: 'mainmenu4',
		          name: '需求工单短信',
		          url: 'icon-yingyongfuwu',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
		          type: '141',
		          iframeUrl: '14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
		        },{
		          id: 'mainmenu5',
		          name: '值班管理短信',
		          url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
		          type: '15',
		          iframeUrl: '15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
		        },{
		          id: 'mainmenu6',
		          name: '机房管理短信',
		          url: 'icon-zhibanchaxun',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
		          type: '700021',
		          iframeUrl: '700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
		        }]
		}
		for (var i=0,len=faultSheet.length;i<len;i++) {
			var sheet = faultSheet[i];
			html += '<div onclick="indexVariable.clickSms(\''+sheet.name+'\',\''+sheet.iframeUrl+'\')" class="sms-item sms-item'+i+'"  title="'+sheet.name+'">'+
						'<div class="sms-absoute">'+
							'<img src="'+dataImg[i]+'" class="sms-bg sms-bg'+i+'"/>'+
							'<p class="sms-text">'+sheet.name+'</p>'+
						'</div>'+
					'</div>';
		}
		// ./images/sms/faultList'+i+'_bg.png
		document.querySelector('.sms-container').innerHTML = html;
	},
	loadUserInfo: function () {
		var _this = this;
		eomsGlobal.ajaxFn('/haeoms/bsf/user/findByUserName',function (res) {
			if (indexVariable.objIterator(res,'data')) {
				var userName = res.data.account,
				    tel = res.data.phone;
				_this.userNameCn = res.data.name;
				_this.userName = userName;
				document.querySelector('.user-name').innerHTML = _this.userNameCn+',欢迎您';
				document.querySelector('.toto-username').innerHTML = '您好,'+_this.userNameCn;
				_this.loadSysCus(userName);
				_this.loadTube(userName,tel);
			}
		});
	},
	loadDutyList: function () {
		eomsGlobal.ajaxFn('/haeoms/home/getExpertDutyList',function (res) {
			var html = '',
			    specialty = '';
			if (indexVariable.objIterator(res,'data')) {
				for (var i=0,data=res.data,len=data.length;i<len;i++) {
					specialty = res.data[i].SPECIALTY;
					switch(specialty){
						case 1:
						    document.querySelector('.shiftBossName').innerHTML = data[i].NAME;
							document.querySelector('.shiftBossTel').innerHTML = data[i].MOBILE;
							break;
						case 2:
						    document.querySelector('.dutyAssistantName').innerHTML = data[i].NAME;
							document.querySelector('.dutyAssistantTel').innerHTML = data[i].MOBILE;
							break;
						case 3:
						    document.querySelector('.monitorName').innerHTML = data[i].NAME;
							document.querySelector('.monitorTel').innerHTML = data[i].MOBILE;
							break;
						case 5:
						    document.querySelector('.transportName').innerHTML = data[i].NAME;
							document.querySelector('.transportTel').innerHTML = data[i].MOBILE;
							break;
						case 6:
						    document.querySelector('.exchangeName').innerHTML = data[i].NAME;
							document.querySelector('.exchangeTel').innerHTML = data[i].MOBILE;
							break;
						case 8:
						    document.querySelector('.dataName').innerHTML = data[i].NAME;
							document.querySelector('.dataTel').innerHTML = data[i].MOBILE;
							break;
						case 7:
						    document.querySelector('.webmasterName').innerHTML = data[i].NAME;
							document.querySelector('.webmasterTel').innerHTML = data[i].MOBILE;
							break;
					}
				}
			}
		},'post');
	},
	loadMessage: function () {
		eomsGlobal.ajaxFn('/haeoms/home/getMessageData',function (res) {
			var html = '';
			if (indexVariable.objIterator(res,'data')) {
				for (var i=0,data=res.data,len=data.length;i<len;i++) {
					html += '<div class="message-item">'+
								'<p class="text-left" onclick="indexVariable.clickMessage(\''+data[i].ID+'\')">'+
									'<span class="text-name">'+data[i].NAME+'</span>'+
									'<span class="text-content"><i class="message-quot">“</i><i class="text-content-title" title="'+data[i].TITLE+'">'+data[i].TITLE+'</i><i class="message-quot">”</i></span>'+
								'</p>'+
								'<p class="text-right">'+data[i].MESSAGETIME+'</p>'+
							'</div>';
				}
				document.querySelector('.message-container').innerHTML = html;
			}
		},'post');
	},
	loadLastsNews: function () {
		eomsGlobal.ajaxFn('/haeoms/home/getLatestNews',function (res) {
			if (indexVariable.objIterator(res,'data')) {
				var data = res.data,
				    size = data.length,
					page = size/5,
					announceObj = {},
					html = '',
					arr = [],
					contentHtml = '';
				for (var i=0;i<page;i++) {
					arr = data.slice(i*5, (i+1)*5);
					contentHtml = '';
					html += '<div class="swiper-slide">';
					for (var j=0,len=arr.length;j<len;j++) {
						var sheet = arr[j];
						contentHtml += '<div class="lastest-item">'+
							  '<p class="text-left">'+
							    '<i class="iconfont icon-jiantoucu"></i>'+
							    '<span>网络变动</span>'+
							  '</p>'+
							  '<p onclick="indexVariable.clickLastest(\''+sheet.ID+'\',\''+sheet.FLAG+'\')" class="text-center lastest-center" title="'+sheet.TITLE+'">'+sheet.TITLE+'</p>'+
							  '<p class="text-right" title="'+sheet.NY+'">'+sheet.NY+'</p>'+
							'</div>';
					}
					html += contentHtml + '</div>';
				}
				document.querySelector('.swiper-wrapper').innerHTML = html;
				var mySwiper = new Swiper('.swiper-container',{
				  loop: true,
				  mode: 'vertical',
				  autoplay: 25000,
				  pagination: '.pagination',
				  paginationClickable: true
				});
				$(".swiper-pagination-switch").hover(function() {
					$(this).click(); //鼠标划上去之后，自动触发点击事件来模仿鼠标划上去的事件
				},function() {
					mySwiper.startAutoplay(); //鼠标移出之后，自动轮播开启
				})
			}
		},'post');
	},
	formatMenu: function (northData) {
		var headerArr = northData;
		var startHtml = '<div id="pp" class="easyui-panel" data-options="border:false" style="padding:5px;">';
		var contentHtml = '';
		var endHtml = '</div>';
		var headerHtml = '';
		var menuHtml = '';
		for (var j=0;j<headerArr.length;j++) {
			contentHtml += '<a href="#" onclick="indexVariable.clickNav(this)" class="easyui-menubutton" data-options="menu:\'#mm'+j+'\'">'+headerArr[j].name+'</a>';
			menuHtml += '<div id="mm'+j+'" data-options="noline:true">'+this.fulData(headerArr[j].children)+'</div>';
		}
		headerHtml = startHtml +  contentHtml + endHtml + menuHtml;
		document.querySelector('.navbar').innerHTML =headerHtml;
	},
	clickNav: function (item) {
		$(item).mouseenter();
	},
	clickLastest: function (id,flag) {
		var urlIframe = '';
		if (location.host == '10.87.61.43') {
		  if (flag == '1') {
		    urlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  } else {
		    urlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  }
		} else {
		  if (flag == '1') {
		    urlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  } else {
		    urlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  }
		}
		indexVariable.addTab('信息与公告类', urlIframe);
	},
	clickMessage: function (id) {
		var urlIframe = ''
		if (location.host == '10.87.61.43') {
		  urlIframe = '10&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';  //5344409
		} else {
		  urlIframe = '10&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';  //5344409
		}
		indexVariable.addTab('公共服务短信', urlIframe);
	},
	clickSms: function (name,iframeUrl) {
		indexVariable.addTab(name, iframeUrl);
	},
	clickFastItem: function (name,iframeUrl) {
		indexVariable.addTab(name, iframeUrl);
	},
	parmOperNeed: function (sheetType) {
		eomsGlobal.ajaxFn('/haeoms/home/findOperUrl/'+sheetType,function (res) {
		  var locationa = '',
		      data = res.data;
		  if (data.SURL.indexOf('../')==0) {
		    locationa = data.TYPE+'&url='+(data.FURL+data.SURL.substr(2)).replace(/&/g, '%26')+'&urlName='+encodeURI(data.NAME)+'&urlCode='+data.CODE+'&external=false#'+data.SHEETTYPE
		  } else {
		    locationa = data.TYPE+'&url='+data.SURL.replace(/&/g, '%26')+'&urlName='+encodeURI(data.NAME)+'&urlCode='+data.CODE+'&external=false#'+data.SHEETTYPE
		  }
		  indexVariable.todoText = data.MAINMENU;
		  indexVariable.todoType = data.TYPE;
		  indexVariable.addTab(data.MAINMENU, locationa);
		})
	},
	clickOper: function (sheetType) {
		this.isClickTodo = true;
		indexVariable.operSheetType = sheetType;
		this.parmOperNeed(sheetType);
	},
	clickNeedItem: function (sheetType) {
		this.isClickTodo = true;
		indexVariable.operSheetType = sheetType;
		this.parmOperNeed(sheetType);
	},
	clickDayWork: function () {
		var locationa = '';
		if (location.host == '10.87.61.43') {
		  locationa = '0401&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+this.userName+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName='+encodeURI('值班作业待办')+'&urlCode=xqdb&external=true';
		} else {
		  locationa = '0401&url=http://10.217.1.43:9084/ess/IntoEss.wsm?userName='+this.userName+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName='+encodeURI('值班作业待办')+'&urlCode=xqdb&external=true';
		}
		indexVariable.addTab('值班作业', locationa);
	},
	toggleTab: function (title,index) {
		var i = parseInt(index)-1<0?0:parseInt(index)-1;
		document.getElementById('iframeNewTop').className = 'iframeindex' + i;
		indexVariable.tabTitle = title;
		if (title == '首页' && indexVariable.isClickTodo) {
			indexVariable.isClickTodo = false;
			indexVariable.loadUpcomList(1);
			// indexVariable.loadOperation();
		}
	},
	loadWidth: function (num) {
		switch (num) {
			case 8:
			  $('.navbar .l-btn').width('12.4%');
			  break;
			case 7:
			  $('.navbar .l-btn').width('14.2%');
			  break;
			case 6:
			  $('.navbar .l-btn').width('16.6%');
			  break;
			case 5:
			  $('.navbar .l-btn').width('19.9%');
			  break;
			case 4:
			  $('.navbar .l-btn').width('24.9%');
			  break;
			case 3:
			  $('.navbar .l-btn').width('33.3%');
			  break;
			case 2:
			  $('.navbar .l-btn').width('49.9%');
			  break;
			case 1:
			  $('.navbar .l-btn').width('99.9%');
			  break;
		}
	},
};
// 本地环境
if (!$.cookie('LtpaToken2')) {
	// 解决点击浏览器后退按钮，回到登录页问题
	window.location.replace('/haeoms/toLogin');
}
indexVariable.tabCloseEven();
indexVariable.loadMenu();
eomsGlobal.completeGif();
$(function () {
	// var eContainer = document.querySelector('.upcomlist-online');
	// var myEcharts = document.querySelector('#main');
	// var myChart = echarts.init(myEcharts);
	// var timerE = null;
	// function chartssize (container,charts) {
	//   function getStyle(el, name) {
	// 	if (el.currentStyle) {
	// 		return el.currentStyle;
	// 	} else {
	// 	   return window.getComputedStyle(el, null);　
	// 	}　
	//   }
	//   var wi = getStyle(container, 'width').width;
	//   var hi = getStyle(container, 'height').height;
	//   charts.style.width = wi;
	//   charts.style.height = hi;
	//   myChart.resize();
	// }
	// // 基于准备好的dom，初始化echarts实例
	// $(window).resize(function(){
	// 	if (indexVariable.tabTitle == '首页') {
	// 		if (timerE) {
	// 			clearTimeout('timerE');
	// 		}
	// 		timerE = setTimeout(function () {
	// 			chartssize(eContainer,myEcharts);
	// 		},0)
	// 	}
	// });
	// var option = {
	// 		    title: {
	// 		        text: '在线用户'
	// 		    },
	// 		    tooltip: {
	// 		        trigger: 'axis'
	// 		    },
	// 		    legend: {
	// 		        data: ['eoms', '移动', '投诉', '值班', '运维']
	// 		    },
	// 		    grid: {
	// 		        left: '3%',
	// 		        right: '4%',
	// 		        bottom: '10%',
	// 		        containLabel: true
	// 		    },
	// 		    toolbox: {
	// 				show: true,
	// 				itemSize: 12,
	// 				left: 160,
	// 		        feature: {
	// 					restore: { //刷新
	// 						show: true,
	// 						title: '刷新'
	// 					}
	// 		        }
	// 		    },
	// 		    xAxis: {
	// 		        type: 'category',
	// 		        boundaryGap: true,
	// 		        data: ['eoms', '移动', '家客', '集客', '运维', '值班', '投诉']
	// 		    },
	// 		    yAxis: {
	// 		        type: 'value'
	// 		    },
	// 		    series: [
	// 		        {
	// 		            name: 'eoms',
	// 		            type: 'line',
	// 		            stack: '总量',
	// 		            data: [120, 132, 101, 134, 90, 230, 210]
	// 		        },
	// 		        {
	// 		            name: '移动',
	// 		            type: 'line',
	// 		            stack: '总量',
	// 		            data: [220, 182, 191, 234, 290, 330, 310]
	// 		        },
	// 		        {
	// 		            name: '投诉',
	// 		            type: 'line',
	// 		            stack: '总量',
	// 		            data: [150, 232, 201, 154, 190, 330, 410]
	// 		        },
	// 		        {
	// 		            name: '值班',
	// 		            type: 'line',
	// 		            stack: '总量',
	// 		            data: [320, 332, 301, 334, 390, 330, 320]
	// 		        },
	// 		        {
	// 		            name: '运维',
	// 		            type: 'line',
	// 		            stack: '总量',
	// 		            data: [820, 932, 901, 934, 1290, 1330, 2320]
	// 		        }
	// 		    ]
	// 		};
	// // 使用刚指定的配置项和数据显示图表。
	// myChart.setOption(option);
	// $('.upcomlist-online-btn').click(function () {
	// 	if (timerE) {
	// 		clearTimeout('timerE');
	// 	}
	// 	timerE = setTimeout(function () {
	// 		$(window).resize();
	// 	},0);
	// 	$(this).addClass('orange-color').removeClass('blue-color');
	// 	$('.upcomlist-table-btn').removeClass('orange-color').addClass('blue-color');
	// 	$('.upcomlist-table').removeClass('show-dayWork').addClass('hidden-dayWork');
	// 	$('.upcomlist-online').addClass('show-dayWork').removeClass('hidden-dayWork');
	// })
	// $('.upcomlist-table-btn').click(function () {
	// 	$(this).addClass('orange-color').removeClass('blue-color');
	// 	$('.upcomlist-online-btn').removeClass('orange-color').addClass('blue-color');
	// 	$('.upcomlist-table').addClass('show-dayWork').removeClass('hidden-dayWork');
	// 	$('.upcomlist-online').removeClass('show-dayWork').addClass('hidden-dayWork');
	// })
	indexVariable.loadOther();
	if (navigator.userAgent.indexOf("MSIE 8.0") > -1) {
		$('.header-bg-img').show();
	}
	$('.mobile-phone,.two-code').hover(function () {
		$('.two-code').show();
	},function () {
		$('.two-code').hide();
	});
	$('.two-code').click(function () {
		window.open("http://10.217.1.21:9084/eomsapp/Download","_self");
	})
	$('.old-rukou').click(function () {
		if (location.host == '10.87.61.43') {
		  window.location.href='http://10.87.61.43/workbench/';
		} else {
		  window.location.href='http://10.217.1.31:9082/workbench/jsp/frame/frame.jsp';
		}
	})
	$('.exit-home').click(function () {
		var _this = this;
		$.messager.confirm('提示', '确定要退出吗？', function(r){
			if (r) {
				if (document.cookie) {
				  var cookies = document.cookie.split(";");//将所有cookie键值对通过分号分割为数组
				  for (var i=0;i<cookies.length;i++) {
				    document.cookie = cookies[i] + ";path=/;expires=" + (new Date(0)).toUTCString();
				    document.cookie = cookies[i] + ";path=/haeoms/;expires=" + (new Date(0)).toUTCString();
				    document.cookie = cookies[i] + ";path=/;domain=" +document.domain+";expires=" + (new Date(0)).toUTCString();
				    document.cookie = cookies[i] + ";path=/haeoms/;domain=" +document.domain+";expires=" + (new Date(0)).toUTCString();
				  }
				}
				// 解决点击浏览器后退按钮，回到登录页问题
				window.location.replace('/haeoms/toLogin');
				eomsGlobal.ajaxFn('/haeoms/logout',function (res) {
					location.reload();
				})
			}
		});
		// $('.panel-tool-close').addClass('fa fa-close');
		var okSpans=$(".l-btn-text");
		var len=okSpans.length;
		for(var i=0;i<len;i++){
			var $okSpan=$(okSpans[i]);
			$okSpan.parent().parent().trigger("blur");
		}
	})
	$('.fast-config').click(function () {
		var allUrlIframe = '7&url=/workbench/kjdispose?type=1&urlName='+encodeURI('运维管理')+'&urlCode=demo_page7&external=false#demo_page7';
		indexVariable.addTab('快速通道', allUrlIframe);
	})
	$('.message-all').click(function () {
		var allUrlIframe = ''
		if (location.host == '10.87.61.43') {
		  allUrlIframe = '11&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';
		} else {
		  allUrlIframe = '11&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';
		}
		indexVariable.addTab('网管留言板全部', allUrlIframe);
	})
	$('.lastnew-all').click(function () {
		var allUrlIframe = '';
		if (location.host == '10.87.61.43') {
		  allUrlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		} else {
		  allUrlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		}
		indexVariable.addTab('信息与公告类', allUrlIframe);
	})
	$('.duty-all').click(function () {
		var allUrlIframe = '';
		if (location.host == '10.87.61.43') {
		  allUrlIframe = '110101&url=http://10.87.61.43/edm/IntoEdm.wsm?userName='+indexVariable.userName+'%26url=CurrentShift.do?option=contact&urlName='+encodeURI('专家值班')+'&urlCode=21203603&external=true';
		} else {
		  allUrlIframe = '110101&url=http://10.217.1.44:9085/edm/IntoEdm.wsm?userName='+indexVariable.userName+'%26url=CurrentShift.do?option=contact&urlName='+encodeURI('专家值班')+'&urlCode=21203603&external=true';
		}
		indexVariable.addTab('值班通讯录', allUrlIframe);
	})
	$('.newbuild-list-input').blur(function () {
		if ($('.newbuild-list-input').val() == '') {
			$('.import-newbuildtitle').addClass('show-dayWork').removeClass('hidden-dayWork');
		} else {
			$('.import-newbuildtitle').removeClass('show-dayWork').addClass('hidden-dayWork');
		}
	})
	$('.newbuild-list-area').blur(function () {
		if ($('.newbuild-list-area').val() == '') {
			$('.import-newbuildcontent').addClass('show-dayWork').removeClass('hidden-dayWork');
		} else {
			$('.import-newbuildcontent').removeClass('show-dayWork').addClass('hidden-dayWork');
		}
	})
	$('.newbuild-confirm-btn').click(function () {
		var newBuildObj = {};
		if ($('.newbuild-list-input').val() != '' && $('.newbuild-list-area').val() != '') {
			$('.import-newbuildtitle').removeClass('show-dayWork').addClass('hidden-dayWork');
			$('.import-newbuildcontent').removeClass('show-dayWork').addClass('hidden-dayWork');
			$.messager.confirm('提示', '确定要发布吗？', function(r){
				if (r) {
					newBuildObj = {
						name: indexVariable.userNameCn,
						title: $('.newbuild-list-input').val(),
						content: $('.newbuild-list-area').val(),
						messagetime: (new Date()).format('yyyy-MM-dd hh:mm:ss')
					};
					newBuildStr = JSON.stringify(newBuildObj);
					eomsGlobal.ajaxFn('/haeoms/bsf/messageboard/addMessage',function (res) {
						if (res.code == 0) {
							indexVariable.loadMessage();
							$.messager.alert('提示','发布成功','',function () {
								$('#w').window('close');
								$('.newbuild-list-input').val('');
								$('.newbuild-list-area').val('');
							});
						} else {
							$.messager.alert('提示','发布失败');
						}
					},'post',newBuildStr)
				}
			})
			var okSpans=$(".l-btn-text");
			var len=okSpans.length;
			for(var i=0;i<len;i++){
				var $okSpan=$(okSpans[i]);
				$okSpan.parent().parent().trigger("blur");
			}
		} else {
			if ($('.newbuild-list-input').val() == '' && $('.newbuild-list-area').val() == '') {
				$('.import-newbuildtitle').addClass('show-dayWork').removeClass('hidden-dayWork');
				$('.import-newbuildcontent').addClass('show-dayWork').removeClass('hidden-dayWork');
			} else if ($('.newbuild-list-input').val() == '') {
				$('.import-newbuildtitle').addClass('show-dayWork').removeClass('hidden-dayWork');
				$('.import-newbuildcontent').removeClass('show-dayWork').addClass('hidden-dayWork');
			} else if ($('.newbuild-list-area').val() == '') {
				$('.import-newbuildtitle').removeClass('show-dayWork').addClass('hidden-dayWork');
				$('.import-newbuildcontent').addClass('show-dayWork').removeClass('hidden-dayWork');
			}
		}
	})
	$('.newbuild-close-btn').click(function () {
		$('#w').window('close');
		$('.newbuild-list-input').val('');
		$('.newbuild-list-area').val('');
	})
	$('.message-color').on('click',function () {
		$('#w').window('open');
		$('#w').window('hcenter');
		$('#w').window('vcenter');
	})
	Date.prototype.format = function(fmt) {
	   var o = {
	      "M+" : this.getMonth()+1,                 //月份
	      "d+" : this.getDate(),                    //日
	      "h+" : this.getHours(),                   //小时
	      "m+" : this.getMinutes(),                 //分
	      "s+" : this.getSeconds(),                 //秒
	      "q+" : Math.floor((this.getMonth()+3)/3), //季度
	      "S"  : this.getMilliseconds()             //毫秒
	  };
	  if(/(y+)/.test(fmt)) {
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	  }
	   for(var k in o) {
	      if(new RegExp("("+ k +")").test(fmt)){
	           fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	       }
	   }
	  return fmt;
	}
	// function throttle(method, context) {
	// 	 clearTimeout(method.tId);
	// 		 method.tId= setTimeout(function(){
	// 		 method.call(context);
	// 	 }, 100);
	// }
	// function resizeWindow () {
	// 	$('#w').window('hcenter');
	// 	$('#w').window('vcenter');
	// }
	// window.onresize = function(){
	// 	throttle(resizeWindow,null);
	// }
	var easyuiPanelOnMove = function(left, top) {
	    var l = left;
	    var t = top;
	    if (l < 1) {
	        l = 1;
	    }
	    if (t < 1) {
	        t = 1;
	    }
	    var width = parseInt($(this).parent().css('width')) + 14;
	    var height = parseInt($(this).parent().css('height')) + 14;
	    var right = l + width;
	    var buttom = t + height;
	    var browserWidth = $(window).width();
	    var browserHeight = $(window).height();
	    if (right > browserWidth) {
	        l = browserWidth - width;
	    }
	    if (buttom > browserHeight) {
	        t = browserHeight - height;
	    }
	    $(this).parent().css({/* 修正面板位置 */
	        left : l,
	        top : t
	    });
	};
	$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
	$.fn.window.defaults.onMove = easyuiPanelOnMove;
	$.fn.panel.defaults.onMove = easyuiPanelOnMove;
	$('.todo-bottom-title').on('click',function () {
		var $this = $(this),
			$next = $this.next(),
			$parentSib = $this.parent().siblings();
		if ($next.css('display') == 'none') {
			$this.find('.fa-angle-right').hide();
			$this.find('.fa-angle-down').show();
		} else if ($next.css('display') == 'block') {
			$this.find('.fa-angle-right').show();
			$this.find('.fa-angle-down').hide();
		}
		$parentSib.find('.todo-bottom-content').hide();
		$parentSib.find('.fa-angle-right').show();
		$parentSib.find('.fa-angle-down').hide();
		$next.toggle();
	})
	/**
	 * 点击导航菜单中按钮，进行页面跳转
	 */
	function parmPath (type,location,flag) {
		// 根据flag,加载老框架还是展示新框架
		if (type || location) {
			if (flag == '1') {// 新框架
				return '../listPage.html';
			} else if (flag == '0') { // 老框架
				return type;
			}
		}
	}
	$('.jumptomaintab').click(function() {
		var $this = $(this),
			id = $this.data('menuid')+'',
			flag = $this.data('flag'),
			menuType = $this.data('menutype')+'',
			namecn = $this.data('namecn'),
			menuLocation = $this.data('menulocation'),
		    title = $this.text();
		menuType = menuType.substr(1);
		id = id.substr(1);
		if (menuType == '0702') {// 知识管理--运维知识
		  window.open(menuLocation+indexVariable.userName,'_blank');
		  return;
		} else if (menuType == '0807') {// 系统管理--集客投诉追踪
		  window.open(menuLocation+indexVariable.userName,'_blank');
		  return;
		}else if (menuType == '100010502'){// 运维管理--其他--传输门户
		  window.open(menuLocation+'?sessionUserToken='+$.cookie('sessionUserToken'),'_blank');
		  return;
		} else if (menuType == '0813') { // 系统管理--家客上报专题保障  zhaodanping_gpm_24088370
		  window.open('http://10.217.2.41:9081/jt/rd/gotojt?account='+indexVariable.userName,'_blank');
		  return;
		} else if (menuType == '0810') {// 系统管理--自定义故障管理
		  window.open('http://10.87.61.43/eoms_rp/','_blank');
		  return;
		}
		if (flag == '1') { // 跳转新框架，请求接口数据
		    indexVariable.addTab(title, './listPage.html?'+id);
		} else if (flag == '0') { // 跳转至嵌套框架
			if (menuType == '0808') { // 系统管理--系统公告
				menuType = '0808&url=/workbench/sysnotice?type=0808&urlName='+encodeURI('系统公告')+'&urlCode=demo_page9&external=false#demo_page9';
				indexVariable.addTab(title, menuType);
				return;
			}
			if (menuType) {
				indexVariable.addTab(title, menuType);
			}
		}
	});
	$('.m-btn-downarrow').each(function () {
		// $(this).addClass('fa fa-angle-down');
		$(this).parent().append('<img class="xia-icon" src="data:image/png;base64,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" alt="">');
	})
	$('.menu-rightarrow').each(function () {
		// $(this).addClass('fa fa-angle-right');
		$(this).parent().append('<img class="you-icon" src="data:image/png;base64,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" alt="">');
	})
})
