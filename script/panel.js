/*
 * Panel logic
 */

(function($){

    var phaseText = function(num) {
    }

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


    // Setup logout button
    $("#logout").click(logout);

    var alertInternalError = function(alertElement, alertTextElement) {
        alertFailure(alertElement, alertTextElement, "系统或网络异常");
    }

    var alertSuccess = function(alertElement, alertTextElement, text) {
        alertElement.removeClass("alert-error");
        alertTextElement.text(text);
        alertElement.show("fast");
    }

    var alertFailure = function(alertElement, alertTextElement, text) {
        alertElement.addClass("alert-error");
        alertTextElement.text(text);
        alertElement.show("fast");
    }

    // professor add subject
    ajaxSubmit($("#addSubjectForm"), function() {
        postJson({
            url : "/add",
            data : $("#addSubjectForm").serialize(),
            callback : function(obj) {
                if (obj.err) {
                    alertFailure($("#addSubjectAlert"), $("#addSubjectAlertText"), obj.err);
                } else {
                    alertSuccess($("#addSubjectAlert"), $("#addSubjectAlertText"), "成功添加课题");
                }
            },
            error : function() {
                alertInternalError($("#addSubjectAlert"), $("#addSubjectAlertText"));
            }
        });
    });


    ajaxSubmit($("#phaseControl"), function() {
        postJson({
            url : "/phase",
            data : "",
            callback : function(obj) {
            },
            error : function(obj) {
            }
        });
    });


})($);
