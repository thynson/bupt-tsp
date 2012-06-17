
;(function(){
	ajaxSubmit($("#loginForm"), function(){
		postJson({
			url : "/login",
			data : $("#loginForm").serialize(),
			callback : function(obj){
				if (obj.err) {
					$("#info").text(obj.err);
				} else if (obj.type == "student") {
				} else if (obj.type == "professor") {
				} else if (obj.type == "admin") {
				} else {
					$("#info").text("系统异常");
				}
			},
			error : function() {
				$("#info").text("系统异常");
			}
		});
	}));

})();
