<!-- 
  * 
  * Date: 2008-07-01
-->
<%@ page contentType="text/html; charset=GBK" language="java"%>
<%@ taglib uri="/tags/struts-tiles" prefix="tiles"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-logic" prefix="logic"%>
<%
	String rootPath = request.getContextPath();
%>
<script src='<%=request.getContextPath()%>/dwr/engine.js'></script>
<script src='<%=request.getContextPath()%>/dwr/util.js'></script>
<script src='<%=request.getContextPath()%>/etc/css/easyui/js/jquery.1.7.2.min.js'></script>
<script src='<%=request.getContextPath()%>/etc/css/easyui/js/jquery.easyui.min.js'></script>
<script src='<%=request.getContextPath()%>/etc/css/easyui/js/easyui-lang-zh_CN.js'></script>
<script src='<%=request.getContextPath()%>/etc/css/easyui/js/jquery.cookie.js'></script>
<script src='<%=request.getContextPath()%>/etc/css/easyui/js/global.js'></script>
<script src='<%=request.getContextPath()%>/dwr/interface/SmsMessageDWR.js'></script>
<link rel="stylesheet" href="<%=request.getContextPath()%>/etc/css/easyui/css/easyui.min.css">
<link rel="stylesheet" href="<%=request.getContextPath()%>/etc/css/easyui/css/icon.css">
<link rel="stylesheet" href="<%=request.getContextPath()%>/etc/css/easyui/css/modifyStyle.css">
<style>
	.myt table tr td a:link {color: blue; text-decoration:none;font-size:110%;}		/* 未访问的链接 */
	.myt table tr td a:visited {color:purple;text-decoration:none;font-size:110%; }	/* 已访问的链接 */
	.myt table tr td a:hover {color: blue; text-decoration:underline;font-size:110%;}	/* 鼠标移动到链接上 */
	.myt table tr td a:active {color: blue;font-size:130%;font-weight: bolder;}	/* 选定的链接 */
	.pagin-pp{
		padding: 0 10px;
	}
	.left-item-label{
		width: 45px;
		text-align: center;
	}
	.left-item-div{
		padding-left: 45px;
	}
	.dishi-items{
		overflow: hidden;
		margin-top: 15px;
	}
	.select-item{
		float: left;
		width: 50%;
	}
	#reloadGroup{
		width: 0;
		height: 0;
		opacity: 0;
		filter: alpha(opacity=0);
		position: absolute;
		left: 0 ;
		top: 0;
	}
	#container{
		position: relative;
	}
</style>
<a id="reloadGroup" href="###"></a>
<table class="table-form">
<tr>
	<logic:equal name="canEdit" value="1">
		<td colspan="4" class="table-title">修改短彩信群组</td>
	</logic:equal>
	<logic:equal name="canEdit" value="0">
		<td colspan="4" class="table-title">短彩信群组查看</td>
	</logic:equal>
</tr>
<tr>
	<td>组名称</td>
	<td class="four-content">
		<bean:write name="scgDTO" property="name"/>
	</td>
</tr>
<tr>
	<td>组说明</td>
	<td class="four-content"><bean:write name="scgDTO" property="description"/></td>
</tr>
</table>

<logic:equal name="canEdit" value="1">
<form name="editMemberForm" action="<%=rootPath %>/AddGroupMember.do" method="post" >
<table class="table-form">
	<tr>
		<input type="hidden" name="id" value=""/>
		<input type="hidden" name="name"  value="" maxlength="15"/>
		<input type="hidden" name="groupId" id="groupId" value="<bean:write name="id"/>" />
		<!-- <td>姓名</td><td><input type="hidden" name="name"  value="" maxlength="15"/></td> -->
		<td>手机号码 *</td><td class="four-content"><input type="text" name="phoneNo"  value="" maxlength="11" style="width:50%"/></td>
	</tr>
	<tr>
		<td>备注（姓名）</td><td class="four-content"><input type="text" name="remarkName"  value="" maxlength="11" style="width:50%"/></td>
	</tr>
	<tr>
		<td>备注（地市）</td><td class="four-content"><input type="text" name="remarkCity"  value="" maxlength="11" style="width:50%"/></td>
	</tr>
</table>
</logic:equal>
<table class="table-button">
<tr>
	<a>
		<logic:equal name="canEdit" value="1">
			<input type="button" name="Submit2" class="clsbtn2" value="重置" onClick="goMember()">
		    <input type="submit" class="clsbtn2" name="Submit2" value="保存" onClick="return addMember()" />
	    </logic:equal>
	    <input type="button" class="clsbtn2" name="list2" value="返回" onClick="return backMessage()" />
	    <input type="button" class="clsbtn2" name="list2" value="导出" onClick="location.href('<%=rootPath %>/OutGruopMessage.do?groupId=${id }&name=${scgDTO.name }&description=<bean:write name="scgDTO" property="description"/>')" />
		<input type="button" class="clsbtn2" name="list2" value="选择(地市群组矩阵表)" onClick="clickGroup()" />
<%--		<a href="http://10.89.138.133/wrm/Login.do?user=zhaodanping&myaction=ToMsgManage.do?op=gotoMsgManage&pass=&flag=portal">133</a>--%>
	</td>
</tr>
</table>
</form>
<form name="editMemberForm2"  method="post" >
<div class="myt" >
<table width="80%"  >
<tr>
	<td><a href="LookGroupMessage.do?methd=&id=${id }" >全部</a></td>
	<td><a href="LookGroupMessage.do?methd=a&id=${id }">A</a></td>
	<td><a href="LookGroupMessage.do?methd=b&id=${id }">B</a></td>
	<td><a href="LookGroupMessage.do?methd=c&id=${id }">C</a></td>
	<td><a href="LookGroupMessage.do?methd=d&id=${id }">D</a></td>
	<td><a href="LookGroupMessage.do?methd=e&id=${id }">E</a></td>
	<td><a href="LookGroupMessage.do?methd=f&id=${id }">F</a></td>
	<td><a href="LookGroupMessage.do?methd=g&id=${id }">G</a></td>
	<td><a href="LookGroupMessage.do?methd=h&id=${id }">H</a></td>
	<td><a href="LookGroupMessage.do?methd=i&id=${id }">I</a></td>
	<td><a href="LookGroupMessage.do?methd=j&id=${id }">J</a></td>
	<td><a href="LookGroupMessage.do?methd=k&id=${id }">K</a></td>
	<td><a href="LookGroupMessage.do?methd=l&id=${id }">L</a></td>
	<td><a href="LookGroupMessage.do?methd=m&id=${id }">M</a></td>
	<td><a href="LookGroupMessage.do?methd=n&id=${id }">N</a></td>
	<td><a href="LookGroupMessage.do?methd=o&id=${id }">O</a></td>
	<td><a href="LookGroupMessage.do?methd=p&id=${id }">P</a></td>
	<td><a href="LookGroupMessage.do?methd=q&id=${id }">Q</a></td>
	<td><a href="LookGroupMessage.do?methd=r&id=${id }">R</a></td>
	<td><a href="LookGroupMessage.do?methd=s&id=${id }">S</a></td>
	<td><a href="LookGroupMessage.do?methd=t&id=${id }">T</a></td>
	<td><a href="LookGroupMessage.do?methd=u&id=${id }">U</a></td>
	<td><a href="LookGroupMessage.do?methd=v&id=${id }">V</a></td>
	<td><a href="LookGroupMessage.do?methd=w&id=${id }">W</a></td>
	<td><a href="LookGroupMessage.do?methd=x&id=${id }">X</a></td>
	<td><a href="LookGroupMessage.do?methd=y&id=${id }">Y</a></td>
	<td><a href="LookGroupMessage.do?methd=z&id=${id }">Z</a></td>
</tr>
</table>
</div>
</form>
<div id="container" class="grid" style="height:380px">
<div id="body" class="grid-body">
<table cellspacing="0" cellpadding="0">
	<thead>
		<tr>
			<td width="17%">姓名</td>
			<td width="17%">备注（姓名）</td>
			<td width="17%">手机号码</td>
			<td width="17%">备注（地市）</td>
			<logic:equal name="canEdit" value="1">
				<td width="14%">操作</td>	
			</logic:equal>		
		</tr>
	</thead>
	<tbody>
<logic:iterate id="dto" name="groupMemberList">
<tr>
	<td align="center"><bean:write name="dto" property="name"/></td>
	<td align="center"><bean:write name="dto" property="remarkName"/></td>
	<td align="center"><bean:write name="dto" property="phoneNo"/></td>
	<td align="center"><bean:write name="dto" property="remarkCity"/></td>
	<logic:equal name="canEdit" value="1">
		<td align="center">
			<a href="#" onClick="return delMember(${dto.id},<bean:write name="id"/>)"> 删除</a>&nbsp;	
			<logic:notEqual name="dto" property="optlock" value="0">
				<a href="#" onclick="editInfo('${dto.id}','${dto.name}','${dto.phoneNo}','${dto.groupId}','${dto.remarkName}','${dto.remarkCity}')">编辑</a>
			</logic:notEqual>
		</td>
	</logic:equal>
</tr>
</logic:iterate>
</tbody>
</table>
</div>
</div>
<div id="w" class="easyui-dialog"
	 title="选择(地市群组矩阵表)"
	 data-options="modal:true,
		closed:true,
		shadow:true,
		resizable:true,
		constrain:true,
		onClose: closeDialog
		"
	 style="width:800px;height:350px;">
	<div id="cc" class="easyui-layout" data-options="fit:true">
		<div data-options="region:'center'" class="win-center-container">
			<div class="easyui-layout" data-options="fit:true">
				<div data-options="region:'north'" style="height:50px;">
					<div class="dishi-items">
						<div class="select-item select-width98">
							<label class="left-item-label">地市:</label>
							<div class="left-item-div">
								<input id="cc1"  name="dept1" style="height:25px;">
							</div>
						</div>
						<div class="select-item select-width98">
							<label class="left-item-label">职位:</label>
							<div class="left-item-div">
								<input id="cc2" name="dept2" style="height:25px;">
							</div>
						</div>
					</div>
				</div>
				<div data-options="region:'center'" class="table-center-container" style="padding:5px 0;">
					<table id="dgdishi"></table>
				</div>
				<div data-options="region:'south'" style="height:75px;text-align: center;overflow: hidden;">
					<div id="pppp"></div>
					<div class="eoms-btn-container">
						<button class="eoms-btn">确定</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script language="javascript">
			$(function() {
				document.querySelector('#reloadGroup').href = '/wrm/LookGroupMessage.do?id='+$('#groupId').val();
			})
	       var jobname = '',
				cityname = '',
				isLoadTable = false,
				isLoadCity = false;
			$('.eoms-btn').click(function () {
				var val = $('#groupId').val();
		   var listArr = $('#dgdishi').datagrid('getSelections');
		   if (listArr.length == 0) {
			   $('#w').window('close');
		   	// $.messager.alert('提示','请至少选择一行数据');
		   	return;
		   }
		   var tempArr = [];
		   for (var i=0,len=listArr.length;i<len;i++) {
		   	  var item = listArr[i];
		   	  tempArr.push({
				  userid: item.userid,
				  treeid: item.treeid,
				  phone: item.phone,
				  username: item.username,
				  jobname: item.jobname,
				  cityname: item.cityname,
				  groupId: val
			  });
		   }
		   var jsonStr = JSON.stringify(tempArr);
		   eomsGlobal.ajaxFn('/haeoms/view/matrixLog/useMatrixUser',function (res) {
			   if (res.status == '200') {
				   $('#w').window('close');
				   document.querySelector('#reloadGroup').click();
			   }
		   },'post',jsonStr)
	   })
	   function closeDialog () {
		    $('#cc1').combobox('clear');
			$('#cc2').combobox('clear');
	   }
	   function  loadWin (listData) {
		   $('#dgdishi').datagrid({
			   data: listData,
			   rownumbers:true,
			   fit:true,
			   fitColumns:true,
			   inline:true,
			   border:true,
			   columns:[[
				   {field:'fc',title:'选择',checkbox:true},
				   {field:'username',title:'姓名',width:160,align:'center'},
				   {field:'phone',title:'手机号',width:160,align:'center'},
				   {field:'jobname',title:'职位',width:160,align:'center'},
				   {field:'cityname',title:'地市',width:160,align:'center'}
			   ]]
		   });
	   }
	   function loadTable (num) {
		   var jsonObj = {
			   current: num,
			   size: 10,
			   jobname: jobname,
			   cityname: cityname
		   };
		   var jsonStr = JSON.stringify(jsonObj);
		   eomsGlobal.ajaxFn('/haeoms/view/matrixUser/pageMatrixUser',function (res) {
			   if (res.status == '200') {
				   loadWin (res.data.userAndTrees);
				   var total = res.data.total;
				   eomsGlobal.loadPagination({
					   $page: $('#pppp'),
					   total: total,
					   pageSize: 10,
					   callBackFn: loadTable
				   });
				   isLoadTable = true;
				   setTimeout(function () {
					   var node = document.querySelector('#pppp tr');
					   node.children[7].innerHTML = '第';
					   node.children[9].innerHTML = '页';
					   var ye = total%10==0?parseInt(total/10):parseInt(total/10)+1;
					   document.querySelector('.pagination-info').innerHTML = '共'+ye+'页';
				   },100);
			   }
		   },'post',jsonStr)
	   }
	   function loadDishi() {
		   eomsGlobal.ajaxFn('/haeoms/view/findCity',function (res) {
			   if (res.status == '200') {
				   var city = res.data.city,
				       job = res.data.job,
				       dishi = [],
					   zhiwei = [];
				   for (var i=0,leni=city.length;i<leni;i++) {
					   dishi.push({
						   CITYNAME: city[i]
					   });
				   }
				   for (var j=0,lenj=job.length;j<lenj;j++) {
					   zhiwei.push({
						   JOBNAME: job[j]
					   });
				   }
				   $('#cc1').combobox({
					   data:dishi,
					   valueField:'CITYNAME',
					   textField:'CITYNAME',
					   panelHeight: '200',
					   icons:[{
						   iconCls:'icon-cut',
						   handler:function(){
							   $('#cc1').combobox('clear');
						   }
						}],
					   onChange: function (val) {
						   changeDishi(val);
					   }
				   });
				   $('#cc2').combobox({
					   data:zhiwei,
					   valueField:'JOBNAME',
					   textField:'JOBNAME',
					   panelHeight: 'auto',
					   icons:[{
						   iconCls:'icon-cut',
						   handler:function(){
							   $('#cc2').combobox('clear');
						   }
						}],
					   onChange: function (val) {
						   changeZhiwei(val);
					   }
				   });
				   isLoadCity = true;
			   }
		   })
	   }
		function clickGroup () {
			$('#w').window('open');
			$('#w').window('resize',{
				width: 810,
				height: 360
			});
			$('#w').window('hcenter');
			$('#w').window('vcenter');
			if (!isLoadTable) {
				loadTable(1);
			}
			if (!isLoadCity) {
				loadDishi();
			}
		}
		function changeDishi (value) {
			cityname = value;
			loadTable(1);
		}
		function changeZhiwei (value) {
			jobname = value;
			loadTable(1);
		}
		// 窗口缩小时做节流处理
		// function throttle(method, context) {
		// 	clearTimeout(method.tId);
		// 	method.tId= setTimeout(function(){
		// 		method.call(context);
		// 	}, 100);
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
		function delMember(id,groupId){
	  		var result = confirm("您确认删除吗？");
	  		
	  		if(result==true){
				location = "<%=rootPath %>/DelGroupMember.do?id="+id+"&groupId="+groupId;
	  		}
	  		
	  	}

		function editInfo(id,name,phoneNo,groupId,remarkName,remarkCity)
		{
			document.editMemberForm.id.value=id;
			document.editMemberForm.name.value=name;
			document.editMemberForm.phoneNo.value=phoneNo;
			document.editMemberForm.phoneNo.readOnly = true;
			document.editMemberForm.groupId.value=groupId;
			document.editMemberForm.remarkName.value=remarkName;
			document.editMemberForm.remarkCity.value=remarkCity;
				
		}
	function goMember(){
			document.editMemberForm.id.value="";
			document.editMemberForm.name.value="";
			document.editMemberForm.phoneNo.value="";
			document.editMemberForm.phoneNo.readOnly = false;
			document.editMemberForm.remarkName.value="";
			document.editMemberForm.remarkCity.value="";
			
	}

    function backMessage(){
     window.location="<%=rootPath %>/GroupMessageUI.do";
    }


    function initGrid() {
        var o = new Grid();
        var rc = o.bind(document.getElementById('container'), document.getElementById('body'));
    }
   if (window.attachEvent) {
   	 window.attachEvent('onload', initGrid);
   } else if (window.addEventListener) {
   	window.addEventListener('load', initGrid);
   }
    
   

   
  //验证电话号码手机号码，包含153，159号段
    function addMember(){
    
    /*
    if(document.editMemberForm.name.value.trim()==""){
    	alert("姓名不能为空！");
    	return false;
    }
    */
    if(document.editMemberForm.phoneNo.value.trim()==""){
    	alert("手机号码不能为空！");
    	return false;
    }
    if (document.editMemberForm.phoneNo.value != ""){
        var phone=document.editMemberForm.phoneNo.value;
        var reg0 = /^13\d{5,9}$/;
        var reg1 = /^15\d{5,9}$/;
        var reg2 = /^0\d{10,11}$/;
        var reg3 = /^18\d{5,9}$/;
        var reg4 = /^17\d{5,9}$/;
        var reg5 = /^14\d{5,9}$/;
        var reg6 = /^19\d{5,9}$/;
        var my = false;
        if (reg0.test(phone))my=true;
        if (reg1.test(phone))my=true;
        if (reg2.test(phone))my=true;
        if (reg3.test(phone))my=true;
        if (reg4.test(phone))my=true;
        if (reg5.test(phone))my=true;
        if (reg6.test(phone))my=true;
        if (!my){
            alert('请输入正确的手机号码！');
            return false;
        }
    }
   	var id = document.editMemberForm.id.value;
    
    //验证新增用户是否在该群组中有重复信息
	var inSameGroup=0;
	DWREngine.setAsync(false);
	if(id != ""){//当id不为空说明是在编辑，不需要判断用户是否存在
		return true;
	}else{
			SmsMessageDWR.getMemberInGroup(document.editMemberForm.groupId.value,
			document.editMemberForm.phoneNo.value,function(data){
			if(data==1){
				alert("该用户在群组中已存在，请勿重复添加！");
				inSameGroup=1;
				return false;
			}else{
				return true;
			}
		});
	}
	
    //验证新增用户是否在白名单中已存在
	var hasSameOne=1;
	DWREngine.setAsync(false);
	SmsMessageDWR.getSmsWhiteMember(document.editMemberForm.phoneNo.value,function(data){
		if(data==0){
			hasSameOne=0;
			alert("该人员未加入白名单，不能加入组管理！");
			return false;
		}else{
			return true;
		}
	});
	
	//验证通过保存新建信息
	if(hasSameOne==1 && inSameGroup==0){
		return true;
	}else{
		return false;
	}
}



</script>
