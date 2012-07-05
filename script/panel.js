/*
 * Panel logic
 */

(function($){
    var enableClass = function(type) {
        $("."+type).removeClass("hide");
    }

    var enablePhase = function(phase) {
        $(".phase"+phase).removeClass("hide");
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
        $('#subject-form').hide("fast").prev().show();
        return false;
    });

    // Get the subject detail
    var getSubjectDetail = function(){

        var clearFormErrors = function() {
            $('#subject-form .help-block').remove();
            $('#subject-form .control-group').removeClass('error');
        };

        var validateForm = function(subject) {

            clearFormErrors();

            var avaform = true;

            if(subject.name == "") {
                $('#subject-form input[name="name"]').parents(".controls:first").
                append($("<span/>").addClass("help-block").text("请填写完整的项目名称"))
                .parents(".control-group:first").addClass("error");
                avaform=false;
            }

            if(subject.desc == "") {
                $('#subject-form textarea[name="desc"]').parents(".controls:first").
                append($("<span/>").addClass("help-block").text("请填写您的项目描述，以便学生了解选择"))
                .parents(".control-group:first").addClass("error");
                avaform=false;
            }

            if(!subject.type1) {
                $('#subject-form div[name="type1"]').parents(".controls:first").
                append($("<span/>").addClass("help-block").text("第一课题分类未选择"))
                .parents(".control-group:first").addClass("error");
                avaform=false;
            }

            if(!subject.type2) {
                $('#subject-form div[name="type2"]').parents(".controls:first").
                append($("<span/>").addClass("help-block").text("第二课题分类未选择"))
                .parents(".control-group:first").addClass("error");
                avaform=false;
            }

            if(!subject.source) {
                $('#subject-form div[name="source"]').parents(".controls:first").
                append($("<span/>").addClass("help-block").text("课题来源未选择"))
                .parents(".control-group:first").addClass("error");
                avaform=false;
            }

            return avaform;

        };

        // Clear the first

        $("#my-subject-table #subject-form").insertAfter("#subject-table");
        $("#my-subject-table").empty();
        $("#subject-table").empty();
        $("#subject-selection-table").empty();

        $("#add-subject").click(function () {

            if($("#subject-form").prev()[0] == this && $("#subject-form").is(":visible"))
                return;

            $("#subject-form").hide("fast", function(){

                $("#subject-form").prev().show();

                $("#subject-form").insertAfter($("#add-subject"));

                // professor add or modify subject
                $("#subject-form .legend").text("新增课题");

                // Set title
                $('#subject-form input[name="name"]').val("");

                // Set desc
                $('#subject-form textarea[name="desc"]').val("");

                $('#subject-form div[name="type1"] button').removeClass("active");
                $('#subject-form div[name="type2"] button').removeClass("active");
                $('#subject-form div[name="source"] button').removeClass("active");
                clearFormErrors();
                $("#subject-form").show("fast", function(){
                            $(this).goTo();
                        });
            });

            ajaxSubmit($("#subject-form"), function() {
                var subject = {
                    name : $('#subject-form input[name="name"]').val(),
                    desc : $('#subject-form textarea[name="desc"]').val(),
                    type1 : $('#subject-form div[name="type1"] .active').attr("name"),
                    type2 : $('#subject-form div[name="type2"] .active').attr("name"),
                    source : $('#subject-form div[name="source"] .active').attr("name"),
                };

                if(!validateForm(subject)) {
                    return;
                }

                var postdata = serializeObject(subject);

                subject.professor = {
                    username : profile.username,
                    realname : profile.realname
                };

                postJson({
                    url : "/add",
                    data : postdata,
                    callback : function(obj) {
                        if (obj.err) {
                            alertFailure("#subjectFormAlert", obj.err);
                            $("#subjectFormAlert").goTo();
                        } else {
                            subject.id = obj.id;
                            alertSuccess("#subjectFormAlert", "成功增加课题");
                            $('#subject-form').hide("fast");

                            addToMySubject(subject);
                            // TODO Update the subject-table
                        }
                    },
                    error : function() {
                        alertInternalError("#subjectFormAlert");
                        $("#subjectFormAlert").goTo();
                    }
                });
            });

        });


        var addToMySubject = function(s) {

            if (s.professor.username != profile.username)
                return;
            //
            // Add a entry for subject list
            //
            var p = $("<p/>").text(s.name).appendTo($("<td/>").appendTo(
            $("<tr/>").appendTo($("#my-subject-table"))
            .click(function(){

                if($("#subject-form").parent().parent()[0] == this && $("#subject-form").is(":visible"))
                    return;

                $("#subject-form").hide("fast", function(){

                    $("#subject-form").prev().show();

                    $("#subject-form").insertAfter(p);

                    p.hide()

                    $('#subject-form').remove('.help-block').remove('.help-inline').removeClass('error');

                    $("#subject-form .legend").text("编辑课题：" + p.text());
                    // Set title
                    $('#subject-form input[name="name"]').val(s.name);

                    // Set desc
                    $('#subject-form textarea[name="desc"]').val(s.desc);

                    // Clear active class
                    $('#subject-form div[name="type1"] button').removeClass("active");
                    $('#subject-form div[name="type2"] button').removeClass("active");
                    $('#subject-form div[name="source"] button').removeClass("active");

                    clearFormErrors();

                    $('#subject-form div[name="type1"] button[name="'
                        + s.type1 + '"]').addClass("active");
                    $('#subject-form div[name="type2"] button[name="'
                        + s.type2 + '"]').addClass("active");
                    $('#subject-form div[name="source"] button[name="'
                        + s.source + '"]').addClass("active");

                    $("#subject-form").show("fast", function(){
                        $(this).goTo();
                    });

                });

                // professor add or modify subject
                ajaxSubmit($("#subject-form"), function() {

                    var subject = {
                        id : s.id,
                        name : $('#subject-form input[name="name"]').val(),
                        desc : $('#subject-form textarea[name="desc"]').val(),
                        type1 : $('#subject-form div[name="type1"] .active').attr("name"),
                        type2 : $('#subject-form div[name="type2"] .active').attr("name"),
                        source : $('#subject-form div[name="source"] .active').attr("name"),
                    };

                    if(!validateForm(subject)) {
                        return;
                    }

                    var postdata = serializeObject(subject);
                    postJson({
                        url : "/modify",
                        data : postdata,
                        callback : function(obj) {
                            if (obj.err) {
                                alertFailure("#subjectFormAlert", obj.err);
                                $("#subjectFormAlert").goTo();
                            } else {
                                s.name = subject.name;
                                s.desc = subject.desc;
                                s.type1 = subject.type1;
                                s.type2 = subject.type2;
                                s.source = subject.source;
                                //getSubjectDetail();
                                alertSuccess("#subjectFormAlert", "更新成功");
                            }
                        },
                        error : function() {
                            alertInternalError("#subjectFormAlert");
                            $("#subjectFormAlert").goTo();
                        }
                    });
                });
            })));
        }

        var $subjectselecttable = $("#subject-select-table");

        $(window).resize(function(){
            var esp = 6;
            if(document.documentElement.clientWidth < 980) {
                esp = 3
            }
            if($subjectselecttable.attr("extra-span") != esp) {
                $subjectselecttable.attr("extra-span", esp);
                $("#subject-select-table .extra td").attr("colspan", esp);

                // IE6 Workaround to resize the table
                $("#subject-select-table").css("display", "inline-table");
                window.setTimeout(function(){$("#subject-select-table").css("display", "");},0);
            }
        }).resize();

        var addToSubjectTable = function(s) {

            //
            // Add a entry for table
            //
            var tr = $("<tr/>").appendTo("#subject-table")
            .addClass("subject-item")
            .click(function(){
                $(this).next().toggle("fast").next().toggle("fast");
            });

            $("#subject-table").append(
                $("<tr/>").addClass("extra subject-desc hide")
                .append($("<td/>").attr("colspan", $("#subject-select-table").attr("extra-span"))
                    .append($("<h4/>").text("课题描述"))
                    .append($("<p/>").text(s.desc)))
            );

            var selconTr = $("<tr/>").addClass("extra subject-cond hide").appendTo("#subject-table");

            s.updateInfo = function() {
                tr.empty(); // Clear this column
                tr.append($("<td/>").text(s.name)).addClass("subject-title")
                .append($("<td/>").append($("<a/>").text(s.professor.realname).attr("href", "#" + s.professor.username)
                        .click(function(){
                            // TODO Open the profile of the professor
                            return false;
                        })))
                        .addClass("subject-professor")
                .append($("<td/>").text($("#subject-form #subject-type1 button:nth-child("+s.type1+")").text())
                    .addClass("visible-desktop subject-type1"))
                .append($("<td/>").text($("#subject-form #subject-type2 button:nth-child("+s.type2+")").text())
                    .addClass("visible-desktop subject-type2"))
                .append($("<td/>").text($("#subject-form #subject-source button:nth-child("+s.source+")").text())
                    .addClass("visible-desktop subject-source"));

                selconTr.empty();
                var selcon = $("<p/>").appendTo(
                        ($("<td/>").attr("colspan", $("#subject-select-table").attr("extra-span"))
                            .append($("<h4/>").text("选课情况")))
                        .appendTo(selconTr));

                var statusbtn = $("<button/>").addClass('btn').attr("type","button");
                if (s.selected_by) {

                    statusbtn.text("报选课程").click(function(){
                        var button = $(this);
                        postJson({
                            url : "/select",
                            data : "subject=" + encodeURIComponent(s.id),
                            callback : function (obj) {
                                if (obj.err) {
                                    alertFailure("#selectSubjectAlert", obj.err);
                                } else {
                                    var origin = subjectDictionary[profile.selected];
                                    if (origin) {
                                        origin.selected_by = removeFromList(origin.selected_by, profile.username);
                                        origin.updateInfo();
                                    }

                                    profile.selected = s.id;

                                    s.selected_by.push({
                                        username : profile.username,
                                        realname : profile.realname
                                    });
                                    s.updateInfo();
                                }
                            },
                            error : function(){
                                alertInternalError("#selectStudentAlert");
                            }
                        });
                        return false;
                    });

                    if(!s.selected_by.length) {
                        selcon.append("该项目尚未有学生选报");
                    }else{
                        selcon.append("该项目已被以下学生选报");
                        var splitter = "： "
                        $.each(s.selected_by, function(i, t) {
                            selcon.append(splitter);
                            splitter = "、 ";
                            $("<a/>").text(t.realname)
                                     .attr("href", "#" + t.username)
                                .appendTo(selcon);
                            if(profile.username == t.username && profile.selected == s.id){
                                statusbtn.text("已报选");
                                statusbtn.addClass("btn-inverse");
                                statusbtn.click(function(){
                                    postJson({
                                        url : "/select",
                                        data : "",
                                        callback : function (obj) {
                                            if (obj.err) {
                                                alertFailure("#selectSubjectAlert", obj.err);
                                            } else {
                                                var origin = subjectDictionary[profile.selected];
                                                if (origin) {
                                                    origin.selected_by = removeFromList(origin.selected_by, profile.username);
                                                    origin.updateInfo();
                                                }
                                            }
                                        },
                                        error : function(){
                                            alertInternalError("#selectStudentAlert");
                                        }
                                    });

                                });
                                // TODO Change the action of statusbtn.click to
                                // unsubscribe to the project
                            }
                        });
                    }

                }

                if (s.applied_to) {

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
                return this;
            };

            s.updateInfo();

        }

        var addToSelectStudent = function(s) {

            if (profile.username != s.professor.username)
                return;

            var tbody = $("#subject-selection-table");
            var tr = $("<tr/>").appendTo(tbody);
            var infoTr = $("<tr/>")
                .appendTo(tbody)
                .addClass("hide");
            var infoTd = $("<td/>")
                .appendTo(infoTr)
                .attr("colspan", 2);

            tr.click(function(){
                tr.next().toggle("fast");
            });

            $("<td/>").text(s.name).appendTo(tr);
            var td = $("<td/>").appendTo(tr);


            var unselectStudent = function(s) {
                td.empty();
                var p = $("<p/>").text("选择了这个课题的人数：").appendTo(td);
                $("<b/>").text(s.selected_by.length).appendTo(p);
            }
            //
            // u: The student
            // s: The subject
            var selectStudent = function(u, s) {
                td.empty();
                var p = $("<p/>").text("已选择:").appendTo(td);
                var a = $("<a/>").click(function(){
                    // post unselcect
                    var postdata = "subject=" + encodeURIComponent(s.id);
                    postJson({
                        url : "/approve",
                        data : postdata,
                        callback : function(obj) {
                            unselectStudent();
                        },
                        error : function(){
                        }
                    });
                }).appendTo(p);
                $("<b/>").text(u.realname).appendTo(a);
                p.append("点击学生姓名可以取消选择");
                p = $("<p/>").text("其他选择了这个课题的人数：").appendTo(td);
                $("<b/>").text(s.selected_by.length - 1).appendTo(p);
            }

            if (s.selected_by) {

                if(!s.selected_by.length) {
                    infoTd.append("该项目尚未有学生选报");
                }else{
                    infoTd.append("选择该课程的学生：");
                    $.each(s.selected_by, function(i, u){
                        var splitter = "、 ";

                        if (i != 0) {
                            infoTd.append(splitter);
                        }

                        $("<a/>").text(u.realname)
                            .attr("href", "#")// + s.username
                            .appendTo(infoTd)
                            .click(function(){
                                var postdata = "subject=" + encodeURIComponent(s.id)
                                + "&student=" + encodeURIComponent(u.username);
                                postJson({
                                    url : "/approve",
                                    data : postdata,
                                    callback : function(obj) {
                                        if (obj.err) {
                                            alertFailure("#selectStudentAlert", obj.err);
                                        } else {
                                            selectStudent(u, s);
                                            alertSuccess("#selectStudentAlert", "选择成功");
                                        }
                                    },
                                    error : function(obj) {
                                        alertInternalError("#selectStudentAlert");
                                    }
                                });

                            });;
                    });
                }
                infoTd.append("点击该学生姓名可以选择学生。");
            }

            if (s.selected_by.length != 0 && s.applied_to){
                selectStudent(s.applied_to, s);
            } else if (s.applied_to) {
                var p = $("<p/>").text("已选择:").appendTo(td);
                $("<b/>").text(s.applied_to.realname).appendTo(p);
            } else if (s.selected_by.length != 0) {
                unselectStudent(s);
            } else {
                var p = $("<p/>").text("无人报选").appendTo(td);

            }
        }

        var addToOverview = function(s) {
            var ovTable = $("#overview-table");
            var studentName;
            var studentUsername;

            if (s.applied_to) {
                studentName = s.applied_to.realname;
                studentUsername = s.applied_to.username;
            } else {
                studentName = "";
                studentUsername = "";
            }

            ovTable.append($("<tr/>")
                .append($("<td/>").text(s.name))
                .append($("<td/>").append(
                    $("<a/>").text(s.professor.realname).attr("href", "#"+s.professor.username)))
                .append($("<td/>").append(
                    $("<a/>").text(studentName).attr("href", "#"+studentUsername))));
        }


        var processSubject = function(s){
            addToMySubject(s);
            addToSubjectTable(s);
            addToSelectStudent(s);
            addToOverview(s);
            addToUnselectedTable(s);
        }

        var activeUnselectStudent = null;
        var lastUnselectTr = null;
        var processStudent = function(s) {
            if (phase.phase == 5) {
                if (s.applied_to)
                    return;

                var tr = $("<tr/>").appendTo($('#match-table')).click(function(){
                    $('#match-subject-list').insertAfter(p);
                    if (activeUnselectStudent == null) {
                        activeUnselectStudent = s;
                        $('#match-subject-list').show("fast");
                    } else if (activeUnselectStudent == s) {
                        activeUnselectStudent = null;
                        $('#match-subject-list').hide('fast');
                    } else {
                        activeUnselectStudent = s;
                    }
                });
                lastUnselectTr = tr;
                s.unselectTr = tr;
                var td = $("<td/>").appendTo(tr);
                var p = $("<p/>").text(s.realname).appendTo(td);
                var td = $("<td/>").text(s.realname);
            }
        }

        var addToUnselectedTable = function(s) {
            if (s.applied_to) {
                return;
            }
            unselectedSubjectList.push(s);
        }

        var beginProcess = function() {

            // Prepare subjectDictionary
            $.each(subjectList, function(i, s) {
                subjectDictionary[s.id] = s;
            });

            // Prepare studentDictionary
            $.each(studentList, function(i, s) {
                studentDictionary[s.id] = s;
            });

            $.each(subjectList, function(i, s){
                processSubject(s);
            });

            $.each(unselectedSubjectList, function(i, s){
                var li = $("<li/>").appendTo($('#match-subject-list'));
                var a = $("<a/>").appendTo(li).text(s.name).click(function(){

                    var stu = activeUnselectStudent;

                    var postdata = serializeObject({
                        student : stu.username,
                        subject : s.id
                    });

                    postJson({
                        url : "/match",
                        data : postdata,
                        callback : function(obj) {
                            if (obj.err) {
                            } else {
                                //TODO: update status
                                li.hide();
                                stu.unselectTr.insertAfter(lastUnselectTr);
                                lastUnselectTr = stu.unselectTr;
                                activeUnselectStudent = null;
                                lastUnselectTr.hide();
                            }
                        },
                        error : function(obj) {
                        }
                    });

                });

            });

            $.each(studentList, function(i, s){
                processStudent(s);
            });

        }

        var subjectList = null, studentList = null;
        var subjectDictionary = {};
        var studentDictionary = {};
        var unselectedSubjectList = [];

        getJson({
            url : "/subject",
            error : function(){
            },
            callback : function(obj) {
                if (obj.err) {
                } else {
                    subjectList = obj.subject;
                    if (subjectList && studentList) {
                        beginProcess();
                    }
                }
            }
        });

        getJson({
            url : "/student",
            error : function() {
            },
            callback : function(obj) {
                if (obj.err) {

                } else {
                    studentList = obj.student;
                    if (subjectList && studentList) {
                        beginProcess();
                    }
                }
            }
        });

        if (phase.phase == 5) {
            $('#match-student p').text('下表为尚未成功选择毕业设计的学生，点击表格的列可以为该学生展开选择课题列表');
            $('#match-student table').show();
        } else {
            $('#match-student p').text('当前阶段不能调剂');
        }
    };


    var profile = null, phase = null;
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

            if (profile && phase)
                getSubjectDetail();

        }
    });

    getJson({
        url : "/phase",
        callback : function(obj) {
            $(".phase-prev").text(obj.phase-1);
            $(".phase-current").text(obj.phase);
            $(".phase-next").text(obj.phase+1);
            enablePhase(obj.phase);
            phase = obj;

            if (profile && phase)
                getSubjectDetail();

        }
    });

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
        var password = $('#phaseControl input[type="password"]').val()
        var hash = $.sha1(password + $.sha1($.cookie('username')));
        var postdata = "password=" + encodeURIComponent(hash);

        postJson({
            url : "/phase",
            data : postdata,
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

    window.updateAnnounce = function(){
        getJson({
            url : "/announce",
            callback : function(obj) {
                if (obj.announce) {
                    if (obj.announce == "")
                        obj.announce = "系统暂无公告";
                    $("#announceText").text(obj.announce).parent().show();
                    if(!$("#announceTextarea").is(":visible"))
                        $("#announceTextarea").text(obj.announce);
                }
                window.setTimeout("updateAnnounce();", 60000);
            },
            error : function(obj) {
                window.setTimeout("updateAnnounce();", 60000);
            }
        });
    };

    updateAnnounce();

    ajaxSubmit($("#issuceAnnounce"), function() {
        postJson({
            url : "/announce",
            data : $("#issuceAnnounce").serialize(),
            callback : function(obj) {
                if (obj.err) {
                    alertFailure("#issuceAnnounceAlert", obj.err);
                } else {
                    alertSuccess("#issuceAnnounceAlert", "公告已发布");
                    updateAnnounce();
                }
            },
            error : function(obj) {
                alertInternalError("#issuceAnnounceAlert");
            }
        });
    });

    ajaxSubmit($('#resetDatabase'), function() {
        var password = $('#resetDatabase input[type="password"]').val()
        var hash = $.sha1(password + $.sha1($.cookie('username')));
        var postdata = "password=" + encodeURIComponent(hash);
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

    $(function(){
        $('#import-student').change(function(){
            alertSuccess("#importDataAlert", "上传中");
            $(this).upload("/import", function(obj) {
                if (obj.err) {
                    alertFailure("#importDataAlert", obj.err);
                } else {
                    alertSuccess("#importDataAlert", "成功上传");
                }
            }, "json")
        });

        $('#import-professor').change(function(){
            alertSuccess("#importDataAlert", "上传中");
            $(this).upload("/import", function(obj) {
                if (obj.err) {
                    alertFailure("#importDataAlert", obj.err);
                } else {
                    alertSuccess("#importDataAlert", "成功上传");
                }
            }, "json");
        });

        $('#submit-resume').click(function(e){
        });
    });


    $('#submit-import').click(function(){
        $('#upload-resume').upload("/import", function(obj) {
            if (obj.err) {
                alertFailure("#uploadResumeAlert", obj.err);
            } else {
                alertSuccess("#uploadResumeAlert", "成功上传");
            }
        }, "json");
    });

    $('#reset-import').click(function(e){
        e.preventDefault();
        $('#import-professor').replaceWith('<input type="file" name="student" id="import-professor"/>');
        $('#import-student').replaceWith('<input type="file" name="student" id="import-student"/>');
    });
})($);
