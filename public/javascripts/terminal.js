$(function() {
	$table = $('#table');
	queryAll();
	check();
	var index1;
})
function openTerminalDialog(){
	BootstrapDialog.show({
		title : "添加终端",
		draggable: true,
		message : function(dialog) {
			var $message = $('<div></div>');
			var pageToLoad = dialog.getData('pageToLoad');
			$message.load(pageToLoad);
			return $message;
		},
		data : {
			'pageToLoad' : 'addTerminal.html'
		},
	});
}
// 终端修改
function editTerminal(row,index) {
	index1=index;
	$('#editTerminalModal').on('show.bs.modal',function(event) {
		var button = $(event.relatedTarget);
		var recipient = button.data('whatever');
		var modal = $(this);
		modal.find('.modal-title').text(recipient);
		modal.find('#tid').val(row.tid);
		modal.find('#type').val(row.type);
		modal.find('#cid').val(row.cid);
		modal.find('#uid').val(row.uid);
		modal.find('#date').val(row.date);
	})
}
function edit(form) {
	var tid = $('#tid').val();
	var cid = $('#cid').val();
	var uid = $('#uid').val();
	var type = $('#type').val();
	var date = $('#date').val();
	$table.bootstrapTable('updateRow', {
		index : index1,
		row : {
			tid : tid,
			cid : cid,
			uid : uid,
			date : date,
			type : type,
		}
	});
	$.ajax({
		type : "post",
		url : "updateTerminalAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			$('#editTerminalModal').modal('hide');
			if (result.terminalObject.isSuccess) {
				alertView("修改成功！！");
			} else {
				alertView("修改失败！");
			}
		},
	});
}
// 删除终端
function deleteTerminal() {
	var ids = $.map($table.bootstrapTable('getSelections'), function(row) {
		return row.tid;
	});
	$table.bootstrapTable('remove', {
		field : "tid",
		values : ids
	});
//		alert(ids.length);
	delTerminal(ids);
}
//单独删除操作
function deleteOneTerminal(ids) {
	$table.bootstrapTable('remove', {
		field : "tid",
		values : ids
	});
	delTerminal(ids);
}
function delTerminal(ids) {
	$.ajax({
		url : "delTerminalAction.action",
		type : "post",
		async : false,
		traditional : true,// 这样就能正常发送数组参数了
//		dataType : "json",
		data : {
			"ids" : ids,
		},
		success : function() {
			alertView('删除成功!');
		},
		error : function() {
			alertView("删除失败！！");
		}
	});
}
//添加终端
function addTerminal(form) {
	$.ajax({
		type : "post",
		url : "insertTerminalAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			$('#addTerminalModal').modal('hide');
			if (result.terminalObject.isSuccess) {
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
				alertView("添加失败！");
			}
		},
	});
}
// 查询所有
function queryAll() {
	$.ajax({
		type : "post",
		url : "queryAllTerminalAction.action",
		dataType : 'json',
		success : function(data) {
			if (data != null) {
				userName(data.terminalJSONList);
			/*	$('#table').bootstrapTable({
					data : data.terminalJSONList
				});*/
			}
		}
	});
}
//责任人id到name转换
function userName(list){
	$.getJSON("queryAllAction.action", function(data){
//		console.dir(data);
		for(var i=0; i<list.length; i++){
			var flag = 0;
			for(var j=0; j<data.userJSONList2.length; j++){
				
				if(list[i].uid == data.userJSONList2[j].uid){
					list[i].uid = data.userJSONList2[j].uname;
					flag = 1;
				}
			}
			if(flag==0){
				list[i].uid = "查无此人";
			}
		}
		$('#table').bootstrapTable({
			data : list
		});
	});
}

//操作
function operateFormatter(value, row, index) {
	return [
			/*
			 * '<a class="like" href="javascript:void(0)" title="Like">', '<i
			 * class="icon-heart"></i>', '</a>',
			 */
			'<a class="edit ml10" id="edit" href="javascript:void(0)" data-toggle="modal" data-target="#editTerminalModal" title="Edit" data-whatever="修改终端">',
			'<i class="glyphicon glyphicon-edit"></i>',
			'</a>&nbsp; &nbsp; &nbsp; ',
			'<a class="remove ml10" href="javascript:void(0)" title="Remove" id="remove">',
			'<i class="glyphicon glyphicon-trash"></i>', '</a>' ].join('');
}

window.operateEvents = {
	/*
	 * 'click .like' : function(e, value, row, index) { alert('You click like
	 * icon, row: ' + JSON.stringify(row)); console.log(value, row, index); },
	 */
	'click .edit' : function(e, value, row, index) {
		//		 alert('You click edit icon, row: ' + JSON.stringify(row));
		// console.log(value, row, index);
		editTerminal(row,index);
	},
	'click .remove' : function(e, value, row, index) {
		deleteOneTerminal(row.tid);
	}
}
function check() {
	$('#editTerminalForm').bootstrapValidator({
		//          live: 'disabled',
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
			tid : {
				validators : {
					notEmpty : {
						message : '不能为空'
					}
				}
			},
			type : {
				validators : {
					notEmpty : {
						message : '终端类型不能为空'
					},
					regexp : {
						regexp : /^[a-zA-Z0-9_\.]+$/,
						message : '用户名只能由字母，数字，圆点和下划线组成'
					}
				}
			},
			cid : {
				validators : {
					notEmpty : {
						message : '北斗卡ID不能为空'
					}
				}
			},
			uid : {
				validators : {
					notEmpty : {
						message : '责任人ID不能为空'
					}
				}
			},
			date : {
				validators : {
					date : {
						format : 'YYYY-MM-DD HH:mm:ss'
					},
					notEmpty : {
						message : '购买时间不能为空'
					}
				}
			},
		}
	});
	
	$('#resetBtn').click(function() {
		$('#editTerminalForm').data('bootstrapValidator').resetForm(true);
	});
}