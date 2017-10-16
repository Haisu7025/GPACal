// You can require() this file in a CommonJS environment.
require('./dist/js/flat-ui.js');

function setData() {
    config = {
        type: 'radar',
        data: {
            labels: [],
            datasets: [{
                label: "Rank",
                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                borderColor: window.chartColors.red,
                pointBackgroundColor: window.chartColors.red,
                data: []
            }, {
                label: "GPA",
                backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
                borderColor: window.chartColors.blue,
                pointBackgroundColor: window.chartColors.blue,
                data: []
            }, ]
        },
        options: {
            scaleShowLabels: false,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '课程学分（绩）分布'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    };
}

function course_judge() {
    var name = document.getElementsByName("name")[0];
    var rank = document.getElementsByName("rank")[0];
    var gpa = document.getElementsByName("gpa")[0];
    var tags = document.getElementsByName("tags")[0];

    if (name.value == "" || rank.value == "" ||
        gpa.value == "" || tags.value == "") {
        alert("请输入有效课程信息！");
    }
    return;
}


function showRecord(name, rank, gpa, tags) {
    var container = document.getElementsByName("course_container")[0];
    var a = document.createElement('div');
    a.setAttribute("class", "row");
    a.innerHTML = "<div class='col-xs-3'><div class='form-group'><input name='name' Disabled='disabled' type='text' value='" +
        name +
        "' placeholder='name' class='form-control' /></div></div><div class='col-xs-3'><div class='form-group has-success'><input name='rank' type='text' Disabled='disabled' value='" +
        rank +
        "' placeholder='rank' class='form-control' /><span class='input-icon fui-check-inverted'></span></div></div><div class='col-xs-3'><div class='form-group has-error'><input name='gpa' type='text' Disabled='disabled' value='" +
        gpa +
        "' placeholder='gpa' class='form-control' /><span class='input-icon fui-check-inverted'></span></div></div><div class='col-xs-3'><div class='tagsinput-primary'><input name='tags' Disabled='disabled' class='tagsinput' placeholder='tags' data-role='tagsinput' value='" +
        tags +
        "' /></div></div>";
    container.appendChild(a);
}

function getRecord() {
    var source = [];
    var tags_source = [];

    var rank_all;
    var gpa_all;

    var title = [];
    var content = [];
    var time = [];

    if (window.XMLHttpRequest) { // IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText == "forbidden") {
                window.location.href = "/reg/login.html";
                return;
            } else {
                source.length = 0;
                var jsonData = eval(xmlhttp.responseText);
                var si = 0;
                var ti = 0;
                var tdi = 0;
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].k == "all") {
                        source[si] = [jsonData[i].i, jsonData[i].n, jsonData[i].r, jsonData[i].g, jsonData[i].t];
                        si++;
                    } else if (jsonData[i].k == "tags") {
                        tags_source[ti] = [jsonData[i].i, jsonData[i].t, jsonData[i].r, jsonData[i].g];
                        ti++;
                    } else if (jsonData[i].k == "sum") {
                        rank_all = jsonData[i].r;
                        gpa_all = jsonData[i].g;
                    } else if (jsonData[i].k == "todo") {
                        title[tdi] = jsonData[i].t;
                        content[tdi] = jsonData[i].c;
                        time[tdi] = jsonData[i].m;
                        tdi++;
                    }
                }

                //处理课程列表
                for (var i = 0; i < source.length; i++) {

                    var name = source[i]['1'];
                    var rank = source[i]['2'];
                    var gpa = source[i]['3'];
                    var tags = source[i]['4'];
                    showRecord(name, rank, gpa, tags);
                }

                //处理标签表格
                for (var i = 0; i < tags_source.length; i++) {

                    var tag_name = tags_source[i]['1'];
                    var tag_rank = tags_source[i]['2'];
                    var tag_gpa = tags_source[i]['3'];

                    var flag = 0;
                    //更新表格dataset
                    for (var j = 0; j < config.data.labels.length; j++) {
                        if (tag_name == config.data.labels[j]) {
                            //已有的标签
                            flag = 1;
                        }
                    }
                    if (flag == 1) {
                        flag = 0;
                        continue;
                    }
                    config.data.datasets[0]['data'].push(tag_rank);
                    config.data.datasets[1]['data'].push(tag_gpa)
                    config.data.labels.push(tag_name);
                    window.myRadar.update();
                }

                //处理总结部分
                document.getElementsByName("rank_all")[0].innerHTML = "总学分" + rank_all;
                document.getElementsByName("gpa_all")[0].innerHTML = " G P A " + gpa_all.toFixed(2);

                //处理任务部分
                for (var i = 0; i < tdi; i++) {
                    var cont = document.getElementsByName("todolist")[0];
                    var a = document.createElement("div");
                    a.innerHTML = "<li class='todo' onclick='click_todo()'><div class='todo-icon fui-list'></div><div class='todo-content'><h4 class='todo-name'>" +
                        title[i] +
                        "</h4>" +
                        content[i] +
                        "<div align='right'>" +
                        "</div></div></li>";
                    cont.appendChild(a);
                }
            };
        }
    }
    xmlhttp.open("GET", "loadpage.php");
    xmlhttp.send();
}

function click_todo() {
    var es = event.srcElement;
    while (true) {
        es = es.parentElement;
        if (es.tagName == "LI") {
            setTimeout("pause()", 1000);
            es.style.display = "none";
            break;
        }
    }
}


function add_todo() {

}