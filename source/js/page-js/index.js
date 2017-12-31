var app = angular.module('app', ['ngRoute']);
app.controller('index', function($scope,$route, $http,$location,$rootScope) {
    var url = $location.url();
    //刷新页面后根据路径修改顶部菜单选择
    loadPage(url);

    $scope.$route = $route;
    $scope.click_status1 = 'back';

    //左侧菜单
    $http.get(baseUrl+"/matchInfo/getMatchList")
        .then(function (data) {
            $scope.sidebar_match_info = data.data.data;
            var turn = data.data.turn - 1;
            info = data.data.data[0];
            $scope.main_info_title = info;
            $scope.pingju = "平局";
            var match_gid = info.match_gid;
            $scope.match_gid = match_gid;
            //向子页面广播点击的比赛信息
            $rootScope.$broadcast("toson", info);

            //轮数
            $http.get(baseUrl+"/matchInfo/getTurnInfo")
                .then(function (data) {
                    $scope.premier_turn = data.data.data;
                });

            //联赛数据
            $http.get(baseUrl+"/leagueRankInfo/getTeamLeagueInfo/"+turn+"/"+match_gid)
                .then(function (data) {
                    var league_list = data.data.data;
                    for(var i = 0;i < league_list.length;i++){
                        if(league_list[i].team_gid == info.main_team_gid){
                            $scope.league_data_main = league_list[i];
                        } else {
                            $scope.league_data_cust = league_list[i];
                        }
                    }
                });

            //交手记录
            $http.get(baseUrl+"/matchInfo/fightRecord/"+match_gid)
                .then(function (data) {
                    $scope.fight_record = data.data.data;
                });

            //近期战绩
            $http.get(baseUrl+"/matchInfo/nearlySixMatch/"+match_gid)
                .then(function (data) {
                    $scope.nearly_record_home = spaceToVs(data.data.home_record);
                    $scope.nearly_record_away = spaceToVs(data.data.away_record);
                });

            //预测胜负
            $http.get(baseUrl+"/matchInfo/threeOddInfo/"+match_gid)
                .then(function (data) {
                    list = data.data.data;
                    for(var i = 0;i < list.length;i++){
                        if(list[i].type == 3){
                            $scope.threeOdd_home=list[i].oddStr;
                            $scope.threeOddClick=list[i].oddStr;
                        }else if(list[i].type == 1){
                            $scope.threeOdd_ping=list[i].oddStr;
                        }else{
                            $scope.threeOdd_away=list[i].oddStr;
                        }
                    }
                });

            //比分胜负
            $http.get(baseUrl+"/matchInfo/scoreOddInfo/"+match_gid)
                .then(function (data) {
                    $scope.scoreOddWin = data.data.win;
                    $scope.scoreOddPing = data.data.ping;
                    $scope.scoreOddLose = data.data.lose;
                    $scope.scoreOddclick = data.data.win;
                });
        });

    $scope.rowInfo=function(info){
        turn = $scope.premier_turn - 1;
       $scope.main_info_title = info;
       $scope.pingju = "平局";
        var match_gid = info.match_gid;

        $scope.click_status1 = 'back';
        $scope.click_status2 = '';
        $scope.click_status3 = '';

        $scope.match_gid = match_gid;
        //向子页面广播点击的比赛信息
        $rootScope.$broadcast("toson", info);


       //联赛数据
        $http.get(baseUrl+"/leagueRankInfo/getTeamLeagueInfo/"+turn+"/"+match_gid)
            .then(function (data) {
                var league_list = data.data.data;
                for(var i = 0;i < league_list.length;i++){
                    if(league_list[i].team_gid == info.main_team_gid){
                        $scope.league_data_main = league_list[i];
                    } else {
                        $scope.league_data_cust = league_list[i];
                    }
                }
            });

        //交手记录
        $http.get(baseUrl+"/matchInfo/fightRecord/"+match_gid)
            .then(function (data) {
                $scope.fight_record = data.data.data;
            });

        //近期战绩
        $http.get(baseUrl+"/matchInfo/nearlySixMatch/"+match_gid)
            .then(function (data) {
                $scope.nearly_record_home = spaceToVs(data.data.home_record);
                $scope.nearly_record_away = spaceToVs(data.data.away_record);
            });

        //预测胜负
        $http.get(baseUrl+"/matchInfo/threeOddInfo/"+match_gid)
            .then(function (data) {
                list = data.data.data;
                for(var i = 0;i < list.length;i++){
                    if(list[i].type == 3){
                        $scope.threeOdd_home=list[i].oddStr;
                        $scope.threeOddClick=list[i].oddStr;
                    }else if(list[i].type == 1){
                        $scope.threeOdd_ping=list[i].oddStr;
                        $scope.threeOddClick=list[i].oddStr;
                    }else{
                        $scope.threeOdd_away=list[i].oddStr;
                        $scope.threeOddClick=list[i].oddStr;
                    }
                }
            });

        //比分胜负
        $http.get(baseUrl+"/matchInfo/scoreOddInfo/"+match_gid)
            .then(function (data) {
                $scope.scoreOddWin = data.data.win;
                $scope.scoreOddclick= data.data.win;
                $scope.scoreOddPing = data.data.ping;
                $scope.scoreOddLose = data.data.lose;
            });
    }

    //详细页面点击切换赔率
    $scope.oddType=function(info){

        if(info == 3){
            $scope.threeOddClick = $scope.threeOdd_home;
            $scope.scoreOddclick = $scope.scoreOddWin;
            $scope.click_status1 = 'back';
            $scope.click_status2 = '';
            $scope.click_status3 = '';
        } else if(info == 1){
            $scope.threeOddClick = $scope.threeOdd_ping;
            $scope.scoreOddclick = $scope.scoreOddPing;
            $scope.click_status1 = '';
            $scope.click_status2 = 'back';
            $scope.click_status3 = '';
        } else {
            $scope.threeOddClick = $scope.threeOdd_away;
            $scope.scoreOddclick = $scope.scoreOddLose;
            $scope.click_status1 = '';
            $scope.click_status2 = '';
            $scope.click_status3 = 'back';
        }
    }
});

app.config(function ($routeProvider) {
    $routeProvider.

    when('/homePage', {
        templateUrl: 'page/homePage.html',
        controller: 'HomePageController'
    }).
    when('/detail', {
        templateUrl: 'page/detail.html',
        controller: 'DetailController'
    }).
    when('/meLearData', {
        templateUrl: 'page/meLearData.html',
        controller: 'MeLearDataController'
    }).
    when('/hisPre', {
        templateUrl: 'page/hisPre.html',
        controller: 'HisPreController'
    }).
    when('/hisOdd', {
        templateUrl: 'page/hisOdd.html',
        controller: 'HisOddController'
    }).
    when('/login', {
        templateUrl: 'page/login.html',
        controller: 'LoginController'
    }).
    when('/register', {
        templateUrl: 'page/register.html',
        controller: 'RegisterController'
    }).
    when('/person_center', {
        templateUrl: 'page/person_center.html',
        controller: 'PersonController'
    }).
    when('/changePwd', {
        templateUrl: 'page/changePass.html',
        controller: 'changePassController'
    }).
    otherwise({
        redirectTo: '/homePage'
    });
});



// about page controller
app.controller('HomePageController', function($scope) {
    $scope.pageClass = 'homePage';
});

// contact page controller
app.controller('MeLearDataController', function($scope) {
    $scope.pageClass = 'meLearData';
});

app.controller('HisPreController', function($scope) {
    $scope.pageClass = 'hisPre';
});

app.controller('HisOddController', function($scope) {
    $scope.pageClass = 'hisOdd';
});

app.controller('LoginController', function($scope) {
    $scope.pageClass = 'login';
});

app.controller('RegisterController', function($scope) {
    $scope.pageClass = 'register';
});

app.controller('PersonController', function($scope) {
    $scope.pageClass = 'person_center';
});

app.controller('changePassController', function($scope) {
    $scope.pageClass = 'changePass';
});

<!-- 点击菜单 -->
$("#menu0").click(function () {
    $("#right_odd").attr("class","col-lg-3 ds");
    $("#main_top").attr("class","darkblue-panel hidden")
    $("#main_top_1").attr("class","darkblue-panel")
    $("#main_bottom").attr("class","row hidden")

});

$("#menu_main").click(function () {
    $("#right_odd").attr("class","col-lg-3 ds hidden");
    $("#main_top").attr("class","darkblue-panel")
    $("#main_top_1").attr("class","darkblue-panel hidden")
    $("#main_bottom").attr("class","row")
});

/*顶部菜单点击*/
$(".logo").click(function () {
    $("#home").parent().attr("class","top-main")
    $("#home").parent().siblings().attr("class","top-main-1")
    open_left_bar()
});

$("#home").click(function () {
    $(this).parent().attr("class","top-main")
    $(this).parent().siblings().attr("class","top-main-1")
    open_left_bar()
});

$("#detail").click(function () {
    $(this).parent().attr("class","top-main")
    $(this).parent().siblings().attr("class","top-main-1")
    open_left_bar()
});

$("#meLearData").click(function () {
    $(this).parent().attr("class","top-main")
    $(this).parent().siblings().attr("class","top-main-1")
    close_left_bar();
});

$("#hisPre").click(function () {
    $(this).parent().attr("class","top-main")
    $(this).parent().siblings().attr("class","top-main-1")
    open_left_bar()
});

$("#hisOdd").click(function () {
    $(this).parent().attr("class","top-main")
    $(this).parent().siblings().attr("class","top-main-1")
    open_left_bar()
});

$("#login").click(function () {
    close_left_bar();
});

$("#register").click(function () {
    close_left_bar();
});

$("#user_setting").click(function () {
    close_left_bar();
});

$("#changePwd").click(function () {
    close_left_bar();
});

function loadPage(url){
    if(url == "/homePage"){
        $("#home").parent().attr("class","top-main")
        $("#home").parent().siblings().attr("class","top-main-1")
        open_left_bar()
    }else if(url == "/detail"){
        $("#detail").parent().attr("class","top-main")
        $("#detail").parent().siblings().attr("class","top-main-1")
        open_left_bar()
    }else if(url == "/meLearData"){
        $("#meLearData").parent().attr("class","top-main")
        $("#meLearData").parent().siblings().attr("class","top-main-1")
        setTimeout(function(){close_left_bar()},10);
    } else if(url=="/login" || url=="/register"){
        setTimeout(function(){close_left_bar()},10);
    } else if(url=="/person_center"){
        setTimeout(function(){close_left_bar()},10);
    } else if(url=="/changePwd"){
        setTimeout(function(){close_left_bar()},10);
    }
}

function close_left_bar(){
    $('#main-content').css({
        'margin-left': '0px'
    });
    $('#sidebar').css({
        'margin-left': '-300px'
    });
    $('#sidebar > ul').hide();
    $("#container").addClass("sidebar-closed");
}

function open_left_bar(){
    $('#main-content').css({
        'margin-left': '300px'
    });
    $('#sidebar > ul').show();
    $('#sidebar').css({
        'margin-left': '0'
    });
    $("#container").removeClass("sidebar-closed");
}

function spaceToVs(list){
    for(var i= 0;i < list.length;i++){
        if(list[i].score == ""){
            list[i].score = "vs";
        }
    }
    return list;
}