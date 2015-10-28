$(function() {
	queryAll();
	valiatorItem();
	var index1;
	var dialog;
	$table = $('#table');
	$("#addItem").click(function(){
		addItem();
	});
	$("#delItem").on("click",function(){
		deleteItem();
	})
});

function queryAll() {
	$.ajax({
		type : "post",
		url : "queryAllItemAction.action",
		dateType : "json",
		success : function(data) {
			if(data.itemJSONList!=null){
				console.dir(data);
				var list = transform(data.itemJSONList);
//				console.dir(list);
				$('#table').bootstrapTable({
					data : list
				});
			}
		},
	});
}

function transform(data) {
	var list = [];
	for ( var i = 0; i < data.length; i++) {
		var obj = {};
		obj["id"] = data[i].id;
		obj["name"] = data[i].name;
		obj["date"] = data[i].date;
		obj["uid"] = data[i].user.uname;
		list.push(obj);
	}
	return list;
}

//addOpen
function addItem() {
	dialog = new BootstrapDialog({
		title : "添加终端",
		draggable: true,
		message : function(dialog) {
			var $message = $('<div></div>');
			var pageToLoad = dialog.getData('pageToLoad');
			$message.load(pageToLoad);
			return $message;
		},
		data : {
			'pageToLoad' : 'addItem.html'
		},
	});
	dialog.open();
}

function add(form){
	$.ajax({
		url: "addItem.action",
		type: "post",
		dataType: "json",
		data : $(form).serializeArray(),
		success: function(data){
			if(data.itemObject.isSuccess==true){
				$.alert({
					animation : 'zoom',
					animationBounce : 2,
					keyboardEnabled : true,
					title : false,
					content : "添加成功！",
					theme : 'white',
					confirm: function(){
						dialog.close();
						location.reload();
					}
				});
			}
			else
				alertView("添加失败");
		}
	});
}

function deleteItem(){
	var ids = $.map($table.bootstrapTable('getSelections'), function(row) {
		return row.id;
	});
	$table.bootstrapTable('remove', {
		field : "id",
		values : ids
	});
	alert(ids);
	delItem(ids);
}

function delItem(ids) {
	$.ajax({
		url : "deleteItemAction.action",
		type : "post",
		async : false,
		traditional : true,// 这样就能正常发送数组参数了
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
// 操作
function operateFormatter(value, row, index) {
	return [
			'<a class="edit ml10" id="edit" href="javascript:void(0)" data-toggle="modal" data-target="#editItemModal" title="Edit">',
			'<i class="glyphicon glyphicon-edit"></i>', '</a>&nbsp;' ].join('');
}

window.operateEvents = {
	'click .edit' : function(e, value, row, index) {
		// alert('You click edit icon, row: ' + JSON.stringify(row));
		editItem(row, index);
	}
};
// 记录修改
function editItem(row, index) {
	index1 = index;
	$('#editItemModal').on('show.bs.modal', function(event) {
		var modal = $(this);
		modal.find('#id').val(row.id);
		modal.find('#name').val(row.name);
		modal.find('#date').val(row.date);
	});
}
function edit(form) {
	var id = $('#id').val();
	var name = $('#name').val();
	var date = $('#date').val();
	$table.bootstrapTable('updateRow', {
		index : index1,
		row : {
			id : id,
			name : name,
			date : date,
		}
	});
	$.ajax({
		type : "post",
		url : "updateItemAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			$('#editItemModal').modal('hide');
			if (result.itemObject.isSuccess) {
				alertView("修改成功！！");
			} else {
				alertView("修改失败！");
			}
		},
	});
}
function valiatorItem(){
	$('#editItemForm').bootstrapValidator({
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
			id : {
				validators : {
					notEmpty : {
						message : '不能为空'
					}
				}
			},
			name : {
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
}