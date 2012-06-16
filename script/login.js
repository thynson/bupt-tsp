
;(function(){
	$("#loginForm").submit(function(e){
		$.post("/login", $("#loginForm").serialize(), function(obj) {
			obj = obj || {};
			if (obj.err) {
				$("#info").text(obj.err);
			} else if (obj.type == "student") {
			} else if (obj.type == "professor") {
			} else if (obj.type == "admin") {
			} else {
				$("#info").text("系统异常");
			}
		}, "json");
		e.preventDefault();
	});

})();
