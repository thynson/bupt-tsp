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


    // Close the subject detail form
    $('#subject-form button.close-form').click(function(){
        $('#subject-form').hide("fast");
        return false;
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
    var getSubjectDetail = function(){

        // Clear the first

        $("#subject-list").empty();
        $("#subject-table").empty();

        var processSubject = function(s){

            //
            // Add a entry for subject list
            //
            var li = $("<li/>").appendTo($("#subject-list"));
            $("<a/>").click(function(){
                // Set title
                $('#subject-form input[name="title"]').text(s.name);

                // Set desc
                $('#subject-form textarea[name="desc"]').text(s.desc);

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

            //
            // Add a entry for table
            //
            var tr = $("<tr/>").appendTo("#subject-table");
            var infoTd = $("<td/>")
                .addClass("hide")
                .attr("colspan", "255")
                .appendTo($("<tr/>").appendTo("#subject-table"));

            $("<td/>").text(s.name).appendTo(tr);
            $("<td/>").text(s.desc).appendTo(tr);
            $("<td/>").text(s.professor.realname).appendTo(tr);
            $("<td/>").text(s.type1).appendTo(tr);
            $("<td/>").text(s.type2).appendTo(tr);
            $("<td/>").text(s.source).appendTo(tr);
            var td = $("<td/>").appendTo(tr);

            if (s.selected_by) {

                var toggle = $("<button/>").addClass("btn").click(function(){
                    infoTd.toggleClass("show");
                }).text("查看选课学生").appendTo(td);

                $("<p/>").text("报选学生：").appendTo(infoTd);
                var ul = $("<ul/>").appendTo(infoTd);

                s.selected_by.forEach(function(s) {
                    $("<li/>").text(s.realname).appendTo(ul);
                });

                var selectButton = $("<button/>").addClass("btn").click(function(s) {
                    postJson({
                        url : "/select",
                        data : "subject=" + encodeURIComponent(s.id),
                        callback : function (obj) {
                            if (obj.err) {
                            } else {
                                getSubjectDetail();
                            }
                        },
                        error : function(){
                        }
                    });
                }).appendTo(td);

                if (profile.selectedSubject && profile.selectedSubject == s.id) {
                    selectButton.text("已报选").attr("disabled", "disabled").addClass("disabled");
                } else {
                    selectButton.text("报选");
                }

            } else if (s.applied_to) {
                $("<p/>").text("已选学生：").appendTo(td);
                $("<div/>").text(s.applied_to.realname);
            } else {

            }
        }

        getJson({
            url : "/subject",
            error : function(){
            },
            callback : function(obj) {
                if (obj.err) {
                } else {
                    obj.subject.forEach(processSubject);
                }
            }
        });
    };


    var profile;
    getJson({
        url : "/profile",
        error : logout,
        callback : function(obj){

            if (obj.err) {
                alert(obj.err);
                logout();
            }
            profile = obj;

            for (var attr in obj) {
                $(".profile-" + attr).text(obj[attr]);
            }

            getSubjectDetail();

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
        var repeatPassword = $("#repeatPassword").val();

        if (newPassword != repeatPassword) {
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
