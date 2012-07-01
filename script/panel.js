/*
 * Panel logic
 */

(function($){
    var enableClass = function(type) {
        $("."+type).removeClass("hide");
    }


    var logout = function() {
        // Error occured, so clear the cookie and redirect to login.html

        $.cookie("username", null);
        $.cookie("role", null);

        location.href = "/login.html";
    }

    // Check cookie to confirm user session

    if (!$.cookie("username") && !$.cookie("role")) {
        logout();
    } else {
        var role = $.cookie("role");
        if (role) {
            enableClass(role);
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
        $("#subject-form .legend").text("新增课题");

        // Set title
        $('#subject-form input[name="title"]').val("");

        // Set desc
        $('#subject-form textarea[name="desc"]').val("");

        $('#subject-form div[name="type1"] button').removeClass("active");
        $('#subject-form div[name="type2"] button').removeClass("active");
        $('#subject-form div[name="source"] button').removeClass("active");


        $("#subject-form").show("fast");

        ajaxSubmit($("#subject-form"), function() {
            var postdata = $("#subject-form").serialize()
                + "&type1="
                + $('#subject-form div[name="type1"] .active').attr("name")
                + "&type2="
                + $('#subject-form div[name="type2"] .active').attr("name")
                + "&source="
                + $('#subject-form div[name="source"] .active').attr("name");

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

        $("#my-subject-table").empty();
        $("#subject-table").empty();

        var addToMySubject = function(s) {

            if (s.professor.username != profile.username)
                return;
            //
            // Add a entry for subject list
            //
            var mytr = $("<tr/>").appendTo($("#my-subject-table"));
            var a = $("<a/>").click(function(){

                $("#subject-form .legend").text("编辑课题");
                // Set title
                $('#subject-form input[name="title"]').val(s.name);

                // Set desc
                $('#subject-form textarea[name="desc"]').val(s.desc);

                // Clear active class
                $('#subject-form div[name="type1"] button').removeClass("active");
                $('#subject-form div[name="type2"] button').removeClass("active");
                $('#subject-form div[name="source"] button').removeClass("active");

                $('#subject-form div[name="type1"] button[name="'
                    + s.type1 + '"]').addClass("active");
                $('#subject-form div[name="type2"] button[name="'
                    + s.type2 + '"]').addClass("active");
                $('#subject-form div[name="source"] button[name="'
                    + s.source + '"]').addClass("active");

                $("#subject-form").show("fast");

                // professor add or modify subject
                ajaxSubmit($("#subject-form"), function() {

                    var postdata = "id=" + s.id + "&"
                        + $("#subject-form").serialize()
                        + "&type1="
                        + $('#subject-form div[name="type1"] .active').attr("name")
                        + "&type2="
                        + $('#subject-form div[name="type2"] .active').attr("name")
                        + "&source="
                        + $('#subject-form div[name="source"] .active').attr("name")

                    postJson({
                        url : "/modify",
                        data : postdata,
                        callback : function(obj) {
                            if (obj.err) {
                                alertFailure("#subjectFormAlert", obj.err);
                            } else {
                                getSubjectDetail();
                                alertSuccess("#subjectFormAlert", "更新成功");
                            }
                        },
                        error : function() {
                            alertInternalError("#subjectFormAlert");
                        }
                    });
                });
            }).text(s.name).appendTo($("<td/>").appendTo(mytr));

        }

        var addToSubjectTable = function(s) {
            //
            // Add a entry for table
            //
            var tr = $("<tr/>").appendTo("#subject-table")
            .addClass("subject-item")
            .append($("<td/>").text(s.name))
            .append($("<td/>").append($("<a/>").text(s.professor.realname).attr("href", "#" + s.professor.username)
                    .click(function(){
                        // TODO Open the profile of the professor
                        return false;
                    })))
            .append($("<td/>").text(s.type1))
            .append($("<td/>").text(s.type2))
            .append($("<td/>").text(s.source))
            .click(function(){
                $(this).next().toggle("fast").next().toggle("fast");
            });

            $("#subject-table").append(
                $("<tr/>").addClass("extra hide")
                .append($("<td/>").attr("colspan", 6)
                    .append($("<h4/>").text("课题描述"))
                    .append($("<p/>").text(s.desc)))
            );

            var selcon = $("<p/>").appendTo(
                    ($("<td/>").attr("colspan", 6)
                        .append($("<h4/>").text("选课情况")))
                    .appendTo($("<tr/>").addClass("extra hide")
                    .appendTo("#subject-table")));

            var statusbtn = $("<button/>").addClass('btn').attr("type","button");

            if (s.selected_by) {

                statusbtn.text("报选课程").click(function(){
                    var button = $(this);
                    postJson({
                        url : "/select",
                        data : "subject=" + encodeURIComponent(s.id),
                        callback : function (obj) {
                            // TODO Incremental Update the Table
                            if (obj.err) {
                            } else {
                                getSubjectDetail();
                            }
                        },
                        error : function(){
                            // TODO Handle errors
                        }
                    });
                    return false;
                });

                if(!s.selected_by.length) {
                    selcon.append("该项目尚未有学生选报");
                }else{
                    selcon.append("该项目已被以下学生选报");
                    var splitter = "： "
                    $.each(s.selected_by, function(i, s) {
                        selcon.append(splitter);
                        splitter = "、 ";
                        $("<a/>").text(s.realname)
                                 .attr("href", "#" + s.username)
                            .appendTo(selcon);
                        if(profile.username == s.username){
                            statusbtn.text("已报选");
                            statusbtn.addClass("btn-inverse");
                            // TODO Change the action of statusbtn.click to
                            // unsubscribe to the project
                        }
                    });
                }

            } else if (s.applied_to) {

                statusbtn.text("已确定")
                    .addClass("disabled").attr("disabled","disabled");

                if(s.applied_to.username == profile.username) {
                    // I'm Applied
                    statusbtn.addClass("btn-success");
                }

                // TODO Handle the open of professor profile and student
                // profile
                selcon.append("该项目")
                    .append($("<a/>").text(s.professor.realname).attr("href", "#" + s.professor.username))
                    .append("导师选择了").append($("<a/>").text(s.applied_to.realname).attr("href", "#" + s.applied_to.username))
                    .append("完成此项目，本项目双选过程已完结");

            } else {

            }

            $("<td/>").append(statusbtn).addClass("subject-state").appendTo(tr);
        }

        var addToSelectStudent = function(s) {
            if (profile.username == s.professor.username)
                return;

            var tbody = $("#subject-selection-table");
            var tr = $("<tr/>").appendTo(tbody);
            var infoTr = $("<tr/>")
                .appendTo(tbody)
                .addClass("hide");
            var infoTd = $("<td/>")
                .appendTo(infoTr)
                .attr("colspan", 255);

            tr.click(function(){
                tr.next().toggle("fast");
            });

            $("<td/>").text(s.name).appendTo(tr);
            var td = $("<td/>").appendTo(tr);

            if (s.selected_by) {
                infoTd.append("选择该课程的学生：");
                $.each(s.selected_by, function(i, u){
                    var splitter = "、 ";

                    if (i != 0) {
                        infoTd.append(splitter);
                    }

                    $("<a/>").text(u.realname)
                        .attr("href", "#")// + s.username)
                        .appendTo(infoTd)
                        .click(function(){
                            var postdata = "subject=" + s.id + "&student=" + u.username;
                            postJson({
                                url : "/approve",
                                data : encodeURIComponent(postdata),
                                callback : function(obj) {
                                    if (obj.err) {
                                        // TODO
                                    } else {
                                        td.empty();
                                        var p = $("<p/>").text("已选择:").appendTo(td);
                                        $("<b/>").text(u.realname).appendTo(p);
                                        p = $("<p/>").text("其他选择了这个课题的人数：").appendTo(td);
                                        $("<b/>").text(s.selected_by.length - 1).appendTo(p);
                                    }
                                },
                                error : function(obj) {
                                }
                            });

                        });;
                });
            }

            if (s.selected_by.length != 0 && s.applied_to){
                var p = $("<p/>").text("已选择:").appendTo(td);
                $("<b/>").text(s.applied_to.realname).appendTo(p);
                p = $("<p/>").text("其他选择了这个课题的人数：").appendTo(td);
                $("<b/>").text(s.selected_by.length - 1).appendTo(p);
            } else if (s.applied_to) {
                var p = $("<p/>").text("已选择:").appendTo(td);
                $("<b/>").text(s.applied_to.realname).appendTo(p);
            } else if (s.selected_by.length != 0) {
                var p = $("<p/>").text("选择了这个课题的人数：").appendTo(td);
                $("<b/>").text(s.selected_by.length).appendTo(p);
            } else {
                var p = $("<p/>").text("无人报选");

            }
        }


        var processSubject = function(s){
            addToMySubject(s);
            addToSubjectTable(s);
            addToSelectStudent(s);
        }

        getJson({
            url : "/subject",
            error : function(){
            },
            callback : function(obj) {
                if (obj.err) {
                } else {
                    $.each(obj.subject, function(i, s){
                        processSubject(s);
                    });
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
        var newHash = $.sha1(newPassword + $.sha1(username));
        var postData = "password="
        + encodeURIComponent(oldHash)
        + "&new_password="
        + encodeURIComponent(newHash);

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
                    logout();
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

    ajaxSubmit($('#resetDatabase'), function() {
        var password = $('#resetDatabase input[type="password"]').val()
        var hash = $.sha1(password + $.sha1($.cookie('username')));
        var postadata = encodeURIComponent("password=" + hash);
        postJson({
            url : "/reset",
            data : postdata,
            callback : function(obj) {
                if (obj.err) {
                    alertFailure("#resetDatabaseAlert", obj.err);
                } else {
                    logout();
                }
            },
            error : function(obj) {
                alertInternalError("#resetDatabaseAlert");
            }
        });
    });

    $('#submit-import').click(function(){
        $('#import-student').upload("/import", function(obj) {
            alertSuccess("#importDataAlter", $(this).val());
            if (obj.err) {
            } else {
            }
        }, "json");
        $('#import-professor').upload("/import", function(obj) {
            alertSuccess("#importDataAlter", $(this).val());
            if (obj.err) {
            } else {
            }

        }, "json");
    });

    $('#reset-import').click(function(e){
        e.preventDefault();
        $('#import-professor').replaceWith('<input type="file" name="student" id="import-professor"/>');
        $('#import-student').replaceWith('<input type="file" name="student" id="import-student"/>');
    });

    $('#submit-resume').click(function(e) {
        $('#upload-resume').upload("/import", function(obj) {
            alertSuccess("#uploadResumeAlert", "成功上传");
        }, "json");
    });

})($);
