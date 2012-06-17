
;(function(){
	ajaxSubmit($("#loginForm"), function(){
		postJson({
			url : "/login",
			data : $("#loginForm").serialize(),
			callback : function(obj){
				if (obj.err) {
					$("#infoDiv").text(obj.err);
				} else {
					location.href = "/panel.html";
				}
			},
			error : function() {
				$("#infoDiv").text("系统异常");
			}
		});
	}));

})();
