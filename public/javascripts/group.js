$(function() {
	$table = $('#table');
	getOrgan();
	valiatorGroup();
	var index1;
});

function deleteGroup(){
	var ids = $.map($table.bootstrapTable('getSelections'), function(row) {
		return row.oname;
	});
	if(ids==""){
		alertView("请选择删除项");
		return;
	}
	$table.bootstrapTable('remove', {
		field : "oname",
		values : ids
	});
	$.ajax({
		type : "post",
		url : "deleteOrganAction.action",
		cache : false,
		traditional : true,// 这样就能正常发送数组参数了
		data : {
			"ids" : ids,
		},
		success : function(result) {
			if (result.organObject.isSuccess == 0) {
				alertView('删除失败!');
			} else {
				alertView("删除成功！");
				
			}
		}
	});
}
function getOrgan() {
	$.ajax({
		type : "post",
		url : "getGroupAction.action",
		cache : false,
		dataType : 'json',
		success : function(data) {
			if(data.organJSONList!=null){
				var list = data.organJSONList;
				$('#table').bootstrapTable({
					data : list
				});
			}
		}
	});
}

function addGroup() {
	BootstrapDialog.show({
		title : "添加部门",
		draggable: true,
		message : function(dialog) {
			var $message = $('<div></div>');
			var pageToLoad = dialog.getData('pageToLoad');
			$message.load(pageToLoad);
			return $message;
		},
		data : {
			'pageToLoad' : 'addGroup.html'
		},
	});
}

function addForm(form) {
	$.ajax({
		type : "post",
		url : "addOrganAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			if (result.organObject.isSuccess == 0) {
				alertView('添加失败!');
			} else {
				$.alert({
					animation : 'zoom',
					animationBounce : 2,
					keyboardEnabled : true,
					title : false,
					content : "添加成功！",
					theme : 'white',
					confirm: function(){
						$('.modal-dialog').modal('hide');
						location.reload();
					}
				});
			}
		},
	});
}

//操作
function operateFormatter(value, row, index) {
	return [
			'<a class="edit ml10" id="edit" href="javascript:void(0)" data-toggle="modal" data-target="#editGroupModal" title="Edit" data-whatever="修改终端">',
			'<i class="glyphicon glyphicon-edit"></i>', '</a>&nbsp;' ].join('');
}

window.operateEvents = {
	'click .edit' : function(e, value, row, index) {
		// alert('You click edit icon, row: ' + JSON.stringify(row));
		editGroup(row, index);
	}
};

//记录修改
function editGroup(row, index) {
	index1 = index;
	$('#editGroupModal').on('show.bs.modal', function(event) {
		var modal = $(this);
		modal.find('#oid').val(row.oid);
		modal.find('#oname').val(row.oname);
		modal.find('#oaddress').val(row.oaddress);
		modal.find('#ophone').val(row.ophone);
	});
}
//修改保存
function edit(form) {
	var oid = $('#oid').val();
	var oname = $('#oname').val();
	var oaddress = $('#oaddress').val();
	var ophone = $('#ophone').val();
	$table.bootstrapTable('updateRow', {
		index : index1,
		row : {
			oname : oname,
			oaddress : oaddress,
			ophone : ophone,
		}
	});
	$.ajax({
		type : "post",
		url : "updateGroupAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			$('#editGroupModal').modal('hide');
			if (result.organObject.isSuccess) {
				alertView("修改成功！！");
			} else {
				alertView("修改失败！");
			}
		},
		error: function(){
			$('#editGroupModal').modal('hide');
			alertView("修改失败！");
		} 
	});
}
function valiatorGroup() {
	$('#editGroupForm').bootstrapValidator({
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
			oname : {
				validators : {
					notEmpty : {
						message : '部门名称不能为空'
					}
				}
			},
			oaddress : {
				validators : {
					notEmpty : {
						message : '地址不能为空'
					}
				}
			},
			ophone : {
				validators : {
					notEmpty : {
						message : '联系电话不能为空'
					} ,
					 regexp: {
                        regexp: /^[0-9]+$/,
                        message: '电话号码格式不正确'
                    } 
				}
			}
		}
	});
}
