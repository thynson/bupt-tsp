/*
 * Panel logic
 */

(function($){

    var enableClass = function(type) {
        $("."+type).removeClass("hide");
    }


	var logout = function() {
		// Error occured, so clear the cookie and redirect to login.html

		$.cookie("username");
		$.cookie("identity");

		location.href = "/login.html";
	}

	// Check cookie to confirm user session

	if (!$.cookie("username") && !$.cookie("identity")) {
		logout();
	} else {
        var identity = $.cookie("identity");
        if (identity == "student"
            || identity == "professor"
            || identity == "admin") {
            enableClass(identity);
        } else {
            logout();
        }
    }

	getJson({
		url : "/profile",
		error : logout,
		callback : function(obj){

			if (obj.err) {
				alert(obj.err);
				logout();
			}

            for (var attr in obj) {
                $(".profile-" + attr).text(obj[attr]);
            }

		}
	});

})($);
