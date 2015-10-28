$(function() {
	//页面自适应
	$(window).resize(function() {
		$('#table').bootstrapTable('resetView');
	});
});

function changePasswd(){
	 BootstrapDialog.show({
		 title : "修改密码",
		 draggable: true,
         message: function(dialog) {
             var $message = $('<div></div>');
             var pageToLoad = dialog.getData('pageToLoad');
             $message.load(pageToLoad);
     
             return $message;
         },
         data: {
             'pageToLoad': 'changePasswd.html'
         },
     });
}

function change(){
//	valiator();
	$.ajax({
		type : "post",
		url : "updateAction.action",
		cache : false,
		dataType : 'json',
		data : $("#changeForm").serializeArray(),
		success : function(result) {
			if (result.userObject.isSuccess == 0) {
				alertView('修改失败!');
			}
			else{
				alertView("修改成功！");
			}
		},
	});
}
//弹出alert框
function alertView(str){
	$.alert({
		animation : 'zoom',
		animationBounce : 2,
		keyboardEnabled : true,
		title : false,
		content : str,
		confirmButton: '确定',
		theme : 'white',
	});
}

//用户退出登录
function logout() {
	$.confirm({
		title: '退出系统登陆吗？', 
		content : false,
		// autoClose: 'confirm|10000',
		confirmButton: '确定',
		cancelButton: '取消',
		confirmButtonClass : 'btn-info',
		cancelButtonClass : 'btn-danger',
		confirm : function() {
			$.ajax({
				type : "post",
				url : "logoutAction.action",
				async: false,
				success :function(){
					location.href = "../login.jsp";
				}
			});
		},
	});
}

function rowStyle(row, index) {
    /*var classes = ['active', 'success', 'info', 'warning', 'danger'];*/
	var classes = ['success', 'info', 'warning', 'danger'];
    
    /*if (index % 2 === 0 && index / 2 < classes.length) {
        return {
            classes: classes[index / 2]
        };
    }*/
    if(index % 2 ===0){
    	return {
    		classes:classes[index%3]
    	};
    }
    return {};
}

function runningFormatter(value, row, index) {
    return index+1;
}

function valiator(){
	$('#changeForm').bootstrapValidator({
		message : '无效值',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		submitHandler : function(validator, form, submitButton) {
			change(form);
		},
		fields : {
			username : {
				validators : {
					notEmpty : {
						message : '用户名不能为空'
					}/* ,
					regexp : {
						regexp : /^[a-zA-Z0-9_\.]+$/,
						message : '用户名只能由字母，数字，圆点和下划线组成'
					} */
				}
			},
			passwordOld : {
				validators : {
					notEmpty : {
						message : '旧密码不能为空'
					}
				}
			},
			passwordNew : {
				validators : {
					notEmpty : {
						message : '新密码不能为空'
					},
					stringLength : {
						min : 1,
						max : 30,
						message : '密码长度为1到30位'
					},
					identical : {
						field : 'passwordNew2',
						message : '密码与确认密码不一致'
					},
				}
			},
			passwordNew2 : {
				validators : {
					notEmpty : {
						message : '确认密码不能为空'
					},
					stringLength : {
						min : 1,
						max : 30,
						message : '密码长度为1到30位'
					},
					identical : {
						field : 'passwordNew',
						message : '密码与确认密码不一致'
					}
				}
			},
		}
	});
}