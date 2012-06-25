
;(function($){
	ajaxSubmit($("#loginForm"), function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var hash = $.sha1(password+$.sha1(username));
        var postData = "username="
            + encodeURIComponent(username)
            + "&password="
            + encodeURIComponent(hash);

		postJson({
			url : "/login",
			data : postData,
			callback : function(obj){
				if (obj.err) {
					$("#alertText").text(obj.err);
				} else {
					location.href = "/panel.html";
				}
			},
			error : function() {
				$("#alertText").text("系统异常");
                $(".close").click(function(){
                    $(".alert").hide("fast");
                });
                $(".alert").show("fast");
			}
		});
	});

})($);
