$(function() {
	queryAll();
	deleteUser();
	$table = $('#table');
	valiatorUser();
});

function openDialog() {
	BootstrapDialog.show({
		title : "添加用户 ",
		draggable : true,
		message : function(dialog) {
			var $message = $('<div></div>');
			var pageToLoad = dialog.getData('pageToLoad');
			$message.load(pageToLoad);
			return $message;
		},
		data : {
			'pageToLoad' : 'addUser.html'
		},
	});
}
function organList() {
	$.ajax({
		url : "getGroupAction.action",
		type : "post",
		dataType : "json",
		success : function(result) {
			if (result != null) {
				var data = [];
				if (result.organJSONList) {
					for ( var i = 0; i < result.organJSONList.length; i++) {
						var tmp = {};
						tmp["id"] = result.organJSONList[i].oid;
						tmp["val"] = result.organJSONList[i].oname;
						tmp["text"] = result.organJSONList[i].oname;
						data.push(tmp);
					}
					$(".js-example-basic-single").select2({
						data : data,
						minimumResultsForSearch : -1,// 禁用搜索
						placeholder : "部门",
						allowClear : true
					});
				}
			}
		},
		error : function(result) {
			alert("查无此记录");
		}
	});
}

function addUser(form) {
	// alert("55");
	$.ajax({
		type : "post",
		url : "insertAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			$('#adduserModal').modal('hide');
			if (result.userObject.isSuccess) {
				$.alert({
					animation : 'zoom',
					animationBounce : 2,
					keyboardEnabled : true,
					title : false,
					content : '添加成功!',
					theme : 'white',
					confirm : function() {
						location.reload();
					}
				});
			} else {
				alertView("添加失败！！");
			}
		},
	});
}

// 删除用户
function deleteUser() {
	$('#deluser').click(function() {
		var ids = $.map($table.bootstrapTable('getSelections'), function(row) {
			return row.id;
		});
		if (ids == "") {
			alertView("请选择删除项");
			return;
		}
		$table.bootstrapTable('remove', {
			field : "id",
			values : ids
		});
		delUser(ids);
	});
}
// 单独删除操作
function deleteOneUser(ids) {
	$table.bootstrapTable('remove', {
		field : "id",
		values : ids
	});
	delUser(ids);
}
function delUser(ids) {
	$.ajax({
		type : "post",
		async : false,
		traditional : true,// 这样就能正常发送数组参数了
		url : "deletMultipleAction.action",
		// dataType : 'json',
		data : {
			"ids" : ids,
		},
		success : function() {
			alertView("删除成功！！");
		},
		error : function() {
			alertView("删除失败！！");
		}
	});
}

// 查询所有用户
function queryAll() {
	$.ajax({
		type : "post",
		url : "queryAllAction.action",
		dataType : 'json',
		success : function(data) {
			if (data.userJSONList2 != null) {
				OwnerName(data.userJSONList2);
			}
		}
	});
}
// 部门id到name转换
function OwnerName(list) {
	$.getJSON("getGroupAction.action", function(data) {
		var arraylist=[];
		for ( var i = 0; i < list.length; i++) {
			var obj={};
			obj["uid"] = list[i].id;
			obj["uname"] = list[i].uname;
			obj["uphone"] = list[i].uphone;
			obj["upassword"] = list[i].upassword;
			obj["uduty"] = list[i].uduty;
			obj["oid"] = list[i].oid;
			for ( var j = 0; j < data.organJSONList.length; j++) {
				if (list[i].oid == data.organJSONList[j].oid)
					obj["oname"]= data.organJSONList[j].oname;
			}
			arraylist.push(obj);
		}
		$('#table').bootstrapTable({
			data : arraylist
		});
	});
}
// 记录修改
function editGroup(row, index) {
	// console.dir(row);
	index1 = index;
	organList();
	$('#editUserModal').on('show.bs.modal', function(event) {
		var modal = $(this);
		modal.find('#uid').val(row.id);
		modal.find('#uname').val(row.uname);
		modal.find('#oid').val(row.oid);
		modal.find('#oname').val(row.oname);
		modal.find('#upassword').val(row.upassword);
		modal.find('#uphone').val(row.uphone);
		modal.find('#uduty').val(row.uduty);
	});
}

function edit(form) {
	var uid = $('#uid').val();
	var uname = $('#uname').val();
	var upassword = $('#upassword').val();
	var oid = $('#oid').val();
	var oname = $('#oname').val();
	var uphone = $('#uphone').val();
	var uduty = $('#uduty').val();
	$table.bootstrapTable('updateRow', {
		index : index1,
		row : {
			uname : uname,
			upassword : upassword,
			oid : oid,
			uphone : uphone,
			uduty : uduty,
		}
	});
	$.ajax({
		type : "post",
		url : "updateUserAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			$('#editUserModal').modal('hide');
			if (result.userObject.isSuccess) {
				alertView("修改成功！！");
			} else {
				alertView("修改失败！");
			}
		},
		error: function(){
			$('#editUserModal').modal('hide');
			alertView("修改失败！");
		} 
	});
}
// 操作
function operateFormatter(value, row, index) {
	return [
			'<a class="edit ml10" id="edit" href="javascript:void(0)" data-toggle="modal" data-target="#editUserModal" title="Edit" data-whatever="修改终端">',
			'<i class="glyphicon glyphicon-edit"></i>', '</a>&nbsp;' ].join('');
}

window.operateEvents = {
	'click .edit' : function(e, value, row, index) {
		// alert('You click edit icon, row: ' + JSON.stringify(row));
		editGroup(row, index);
	},
	'click .remove' : function(e, value, row, index) {
		deleteOneGroup(row.id);
	}
};
function valiatorUser() {
	$('#editUserForm').bootstrapValidator({
		message : '无效值',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		submitHandler : function(validator, form, submitButton) {
			edit(form);
		},
		fields : {
			uname : {
				validators : {
					notEmpty : {
						message : '用户名不能为空'
					},
					regexp : {
						regexp : /^[a-zA-Z0-9_\.]+$/,
						message : '用户名只能由字母，数字，圆点和下划线组成'
					}
				}
			},
			upassword : {
				validators : {
					notEmpty : {
						message : '密码不能为空'
					},
					stringLength : {
						min : 1,
						max : 30,
						message : '密码长度为1到30位'
					}
				}
			},
			uphone : {
				validators : {
					notEmpty : {
						message : '电话不能为空'
					},
					regexp : {
						regexp : /^[0-9]+$/,
						message : '格式不正确'
					}
				}
			},
		}
	});
}