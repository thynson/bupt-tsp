/*
 * Panel logic
 */

(function($){

	var onErrorLogout = function() {
		// Error occured, so clear the cookie and redirect to login.html

		$.cookie("username");
		$.cookie("identity");

		location.href = "/login.html";
	}

	// Check cookie to confirm user session

	if (!$.cookie("username") && !$.cookie("identity")) {
		onErrorLogout();
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
