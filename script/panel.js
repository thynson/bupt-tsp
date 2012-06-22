/*
 * Panel logic
 */

(function($){

    var enableClass = function(type) {
        $("."+type).removeClass("hide");
    }


	var onErrorLogout = function() {
		// Error occured, so clear the cookie and redirect to login.html

		$.cookie("username");
		$.cookie("identity");

		location.href = "/login.html";
	}

	// Check cookie to confirm user session

	if (!$.cookie("username") && !$.cookie("identity")) {
		onErrorLogout();
	} else {
        var identity = $.cookie("identity");
        if (identity == "student"
            || identity == "professor"
            || identity == "admin") {
            enableClass(identity);
        } else {
            onErrorLogout();
        }
    }

	getJson({
		url : "/profile",
		error : onErrorLogout,
		callback : function(obj){

			if (obj.err) {
				alert(obj.err);
				onErrorLogout();
			}

			// TODO: Display personal infomation

		}
	});

})($);
