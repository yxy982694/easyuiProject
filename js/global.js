var eomsGlobal = {};
(function () {
	var baseUrl = '/haeoms';
	// 请求接口
	function ajaxFn (url,fn,type,data,contentType) {
		var token = $.cookie('sessionUserToken');
		var tokenFlag = $.cookie('LtpaToken2');
		if (!tokenFlag || !token) {
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
					window.location.replace('/haeoms/toLogin');
					return;
				}
				fn(res);
			},
			error: function (jqXHR,textStatus,errorThrown) {
				if (jqXHR.getResponseHeader('redirect')==='REDIRECT') {
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
	// 修改easyui框架按钮样式
	function modifyBtn (arr,location) {
		var item;
		for (var i=0,len=arr.length;i<len;i++) {
			item = arr[i];
			$('.'+item).append('<img class="a-btn-icon" src="'+location+'images/easyui_icon/'+item+'.png" alt="">');
		}
		if (navigator.userAgent.indexOf('WebKit') > -1) {
			$('.eoms-btns .l-btn-icon').css('top','-11px');
		}
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
			total: opts.total,
			pageSize: opts.pageSize,
			pageNumber: 1,
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
		},0);
		var isPage = opts.id?opts.id:'isPage';
		loadPagination[isPage] = true;
	}
	function formDate () {
		var now = new Date(),
		    year = now.getFullYear(),
		    mouth =addZero(now.getMonth()+1),
		    day =addZero(now.getDate());
		return year+'-'+mouth+'-'+day;
	}
	function addZero(str) {
		return (str+'').length == 1?'0'+str : str;
	}
	// 校验input，策略模式
	var check = (function  () {
		var state = {
			phone: function (str) { // 校验手机号
				var phoneReg = /^1[0-9]{10}$/;
				return phoneReg.test(str);
			},
			email: function (str) { // 校验邮箱
				var emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
				return emailReg.test(str);
			}
		};
		return function (key,val) {
			return state[key] && state[key](val);
		}
	})();
	// 中介者模式  发布--订阅模式
	var Mediator = (function () {
		var _msg = {};
		return {
			/**
			 * 通过register注册函数，把函数放到一个数组中
			 * 通过send来执行全部注册的函数
			*/
			register: function (type,action) {
				if (_msg[type]) {
					_msg[type].push(action);
				} else {
					_msg[type] = [];
					_msg[type].push(action);
				}
			},
			send: function (type) {
				if (_msg[type]) {
					for (var i=0,len=_msg[type].length;i<len;i++) {
						_msg[type][i] && _msg[type][i]();
					}
				}
			}
		}
	})();
	// 对象迭代器,检查某个对象是否有某个属性
	var objIterator = function (obj,key) {
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
	}
	// 给全局变量赋值
	eomsGlobal = {
		ajaxFn: ajaxFn,
		completeGif: completeGif,
		modifyBtn: modifyBtn,
		loadPagination: loadPagination,
		formDate: formDate,
		check: check,
		Mediator: Mediator,
		objIterator: objIterator
	};
})()
