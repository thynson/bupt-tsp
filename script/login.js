
;(function($){
	ajaxSubmit($("#loginForm"), function(){
		postJson({
			url : "/login",
			data : $("#loginForm").serialize(),
			callback : function(obj){
				if (obj.err) {
					$("#alertText").text(obj.err);
				} else {
					location.href = "/panel.html";
				}
			},
			error : function() {
				$("#alertText").text("系统异常");
			}
		});
	});

})($);
