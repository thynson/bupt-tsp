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
        if (identity) {
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


    // Close the subject detail form
    $('#subject-form button.close-form').click(function(){
        $('#subject-form').hide("fast");
    });

    $("#add-subject").click(function () {
        // professor add or modify subject
        $("#subject-form").show("fast");
        ajaxSubmit($("#subject-form"), function() {
            postJson({
                url : "/add",
                data : $("#subject-form").serialize(),
                callback : function(obj) {
                    if (obj.err) {
                        alertFailure("#subjectFormAlert", obj.err);
                    } else {
                        alertSuccess("#subjectFormAlert", "成功增加课题");
                    }
                },
                error : function() {
                    alertInternalError("#subjectFormAlert");
                }
            });
        });
    });

    // Get the subject detail
    getJson({
        url : "/subject",
        error : function(){},
        callback : function(obj) {
            if (obj.err) {
            } else {
                obj.subject.forEach(function(s){
                    var li = $("<li/>")

                    // Click to show subject form
                    $("<a/>").click(function(){
                        // Set title
                        $('#subject-form input[name="title"]').text();

                        // Set desc
                        $('#subject-form textarea[name="desc"]').text();

                        // TODO: type1 type2 source

                        $("#subject-form").show("fast");

                        var postdata = "id=" + s.id + "&" + $("#subject-form").serialize();

                        // professor add or modify subject
                        ajaxSubmit($("#subject-form"), function() {
                            postJson({
                                url : "/modify",
                                data : postdata,
                                callback : function(obj) {
                                    if (obj.err) {
                                        alertFailure("#subjectFormAlert", obj.err);
                                    } else {
                                        alertSuccess("#subjectFormAlert", "更新成功");
                                    }
                                },
                                error : function() {
                                    alertInternalError("#subjectFormAlert");
                                }
                            });
                        });
                    }).appendTo(li);
                });
            }
        }
    });




    var updatePhase = function(){
        getJson({
            url : "/phase",
            callback : function(obj) {
                $(".phase-prev").text(obj.phase-1);
                $(".phase-current").text(obj.phase);
                $(".phase-next").text(obj.phase+1);
            }
        });
    }

    updatePhase();

    // Setup logout button
    $("#logout").click(logout);

    // Change password logic
    ajaxSubmit($("#changePasswordForm"), function() {
        var username = $.cookie('username');
        var oldPassword = $("#oldPassword").val();
        var newPassword = $("#newPassword").val();
        var confirmPassword = $("#confirmPassword").val();

        if (newPassword != confirmPassword) {
            alertFailure("#changePasswordAlert", "两次输入密码不一致");
            return;
        }

        var oldHash = $.sha1(oldPassword + $.sha1(username));
        var newHash = $.sha1(newPassword = $.sha1(username));
        var postData = "password="
                    + encodeURIComponent(oldPassword)
                    + "&new_password="
                    + encodeURIComponent(newPassword);

        postJson({
            url : "/chpasswd",
            data : postData,
            callback : function(obj) {
                if (obj.err) {
                    alertFailure("#changePasswordAlert", obj.err);
                } else {
                    alertSuccess("#changePasswordAlert", "修改成功");
                }
            },
            error : function(obj) {
                alertInternalError("#changePasswordAlert");
            }

        });
    });


    ajaxSubmit($("#phaseControl"), function() {
        postJson({
            url : "/phase",
            data : "",
            callback : function(obj) {
                if (obj.err) {
                    alertFailure("#phaseControlAlert", obj.err);
                } else {
                    alertSuccess("#phaseControlAlert", "成功进入下一阶段");
                }
            },
            error : function(obj) {
                alertInternalError("#phaseControlAlert");
            }
        });
    });


    ajaxSubmit($("#issuceAnnounce"), function() {
        postJson({
            url : "/announce",
            data : $("#issuceAnnounce").serialize(),
            callback : function(obj) {
                if (obj.err) {
                    alertFailure("#issuceAnnounceAlert", obj.err);
                } else {
                    alertSuccess("#issuceAnnounceAlert", "公告已发布");
                }
            },
            error : function(obj) {
                alterInternalError("#issuceAnnounceAlert");
            }
        });
    });


})($);
