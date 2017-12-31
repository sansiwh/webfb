app.controller('DetailController', function($scope,$http) {
    $scope.pageClass = 'detail';
    $scope.http = $http;
});

app.directive('ranktrend', function() {
    function link($scope) {
        if(typeof($scope.main_info_title)!="undefined"){
            var info = $scope.main_info_title;
            var legend = [info.main_team_name,info.custom_team_name];

            //根据比赛id获取排名走势
            $scope.http.get(baseUrl+"/detail/getRankByMatchId/"+info.match_gid)
                .then(function (res) {
                    var home_arr = res.data.homeRank;
                    var away_arr = res.data.awayRank;

                    var data_home = [];
                    var data_away = [];
                    for(var i = 0;i < home_arr.length;i++){
                        var temp = [home_arr[i].turn,home_arr[i].rank];
                        data_home.push(temp);
                    }

                    for(var i = 0;i < away_arr.length;i++){
                        var temp = [away_arr[i].turn,away_arr[i].rank];
                        data_away.push(temp);
                    }

                    var data = data_home;
                    var data1 = data_away;
                    var dateList = data.map(function (item) {
                        return item[0];
                    });
                    var valueList = data.map(function (item) {
                        return item[1];
                    });
                    var valueList1 = data1.map(function (item) {
                        return item[1];
                    });

                    var option = getOption(legend,dateList,valueList,valueList1,home_arr.length);
                    var myChart = echarts.init(document.getElementById('main'),'teamRank');
                    myChart.setOption(option);
                });


        }

        $scope.$on("toson", function(e, m) {
            legend = [m.main_team_name,m.custom_team_name];

            //根据比赛id获取排名走势
            $scope.http.get(baseUrl+"/detail/getRankByMatchId/"+m.match_gid)
                .then(function (res) {
                    var home_arr = res.data.homeRank;
                    var away_arr = res.data.awayRank;

                    var data_home = [];
                    var data_away = [];
                    for(var i = 0;i < home_arr.length;i++){
                        var temp = [home_arr[i].turn,home_arr[i].rank];
                        data_home.push(temp);
                    }

                    for(var i = 0;i < away_arr.length;i++){
                        var temp = [away_arr[i].turn,away_arr[i].rank];
                        data_away.push(temp);
                    }

                    var data = data_home;
                    var data1 = data_away;
                    var dateList = data.map(function (item) {
                        return item[0];
                    });
                    var valueList = data.map(function (item) {
                        return item[1];
                    });
                    var valueList1 = data1.map(function (item) {
                        return item[1];
                    });

                    var option = getOption(legend,dateList,valueList,valueList1,home_arr.length);
                    var myChart = echarts.init(document.getElementById('main'),'teamRank');
                    myChart.setOption(option);
                });
        });
    }
    return {
        restrict: 'E',
        template: '<div style="height:300px" id="main"></div>',
        replace: true,
        link: link
    };
});

function getOption(legend,dateList,valueList,valueList1,length){
    // 指定图表的配置项和数据
    var option = {
        backgroundColor: '#3A3949',
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:legend,
            textStyle:{    //图例文字的样式
                color:'#FBFBFB',
                fontSize:12,
                padding: 10
            }
        },
        calculable : true,
        xAxis : [
            {
                axisLabel:{
                    //rotate: 30,//倾斜角度
                    interval:0  //间隔个数
                },
                axisLine:{
                    lineStyle :{
                        color: '#CECECE'
                    }
                },
                type : 'category',
                boundaryGap : false,
                data : dateList,
                position:'top'//X轴显示在上
            }
        ],
        yAxis : [
            {
                splitLine: {show: false},
                inverse: true,//Y轴反转
                type : 'value',
                axisLine:{
                    lineStyle :{
                        color: '#CECECE'
                    }
                }
            }
        ],
        series : [

            {
                name:legend[0],
                type:'line',
                symbol:'none',
                //smooth: 0,
                color:['#15ffd8'],
                data:valueList,
                markLine: {
                    symbol:"circle",//ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
                    label:{
                        normal:{
                            position:"start"
                        }
                    },
                    lineStyle:{
                        normal:{
                            color:"#ffffff"
                        }
                    },
                    data:[
                        [
                            {
                                name:'冠军杯',
                                coord:[0,4]
                            },{
                            coord:[length-1, 4]
                        }
                        ],
                        [
                            {
                                name:'欧联杯',
                                coord:[0,6]
                            },{
                            coord:[length-1, 6]
                        }
                        ],
                        [
                            {
                                name:'降级区',
                                coord:[0,17]
                            },{
                            coord:[length -1, 17]
                        }
                        ]
                    ]
                }
            },
            {
                name:legend[1],
                type:'line',
                symbol:'none',
                //smooth: 0,
                color:['#f5f293'],
                data:valueList1
            }
        ]
    };
    return option;
}



/***************************************************/

app.directive('oddtrend', function() {
    function link($scope) {
        if(typeof($scope.main_info_title)!="undefined") {
            var info = $scope.main_info_title;
            var lengend = [info.main_team_name, '平局', info.custom_team_name];

            $scope.http.get(baseUrl+"/detail/getOddDetail/"+info.match_gid)
                .then(function (res) {
                    var win_res_arr = res.data.odd_win_list;
                    var tie_res_arr = res.data.odd_tie_list;
                    var lose_res_arr = res.data.odd_lose_list;

                    var win_arr = [];
                    var tie_arr = [];
                    var lose_arr = [];
                    for(var i = 0;i < win_res_arr.length;i++){
                        var temp = [win_res_arr[i].date,win_res_arr[i].odd];
                        win_arr.push(temp);
                    }
                    for(var i = 0;i < tie_res_arr.length;i++){
                        var temp = [tie_res_arr[i].date,tie_res_arr[i].odd];
                        tie_arr.push(temp);
                    }
                    for(var i = 0;i < lose_res_arr.length;i++){
                        var temp = [lose_res_arr[i].date,lose_res_arr[i].odd];
                        lose_arr.push(temp);
                    }

                    var data = win_arr;
                    var data1 = tie_arr;
                    var data2 = lose_arr;
                    var dateList = data.map(function (item) {
                        return item[0];
                    });
                    var valueList = data.map(function (item) {
                        return item[1];
                    });

                    var valueList1 = data1.map(function (item) {
                        return item[1];
                    });

                    var valueList2 = data2.map(function (item) {
                        return item[1];
                    });

                    // 指定图表的配置项和数据
                    var option = getOddOption(lengend, dateList, valueList, valueList1, valueList2);

                    var myChart = echarts.init(document.getElementById("oddTrend"), 'oddTrend');
                    myChart.setOption(option);
                });
        }

        $scope.$on("toson", function(e, m) {
            var lengend = [m.main_team_name, '平局', m.custom_team_name];

            $scope.http.get(baseUrl+"/detail/getOddDetail/"+m.match_gid)
                .then(function (res) {
                    var win_res_arr = res.data.odd_win_list;
                    var tie_res_arr = res.data.odd_tie_list;
                    var lose_res_arr = res.data.odd_lose_list;

                    var win_arr = [];
                    var tie_arr = [];
                    var lose_arr = [];
                    for(var i = 0;i < win_res_arr.length;i++){
                        var temp = [win_res_arr[i].date,win_res_arr[i].odd];
                        win_arr.push(temp);
                    }
                    for(var i = 0;i < tie_res_arr.length;i++){
                        var temp = [tie_res_arr[i].date,tie_res_arr[i].odd];
                        tie_arr.push(temp);
                    }
                    for(var i = 0;i < lose_res_arr.length;i++){
                        var temp = [lose_res_arr[i].date,lose_res_arr[i].odd];
                        lose_arr.push(temp);
                    }

                    var data = win_arr;
                    var data1 = tie_arr;
                    var data2 = lose_arr;
                    var dateList = data.map(function (item) {
                        return item[0];
                    });
                    var valueList = data.map(function (item) {
                        return item[1];
                    });

                    var valueList1 = data1.map(function (item) {
                        return item[1];
                    });

                    var valueList2 = data2.map(function (item) {
                        return item[1];
                    });

                    // 指定图表的配置项和数据
                    var option = getOddOption(lengend, dateList, valueList, valueList1, valueList2);

                    var myChart = echarts.init(document.getElementById("oddTrend"), 'oddTrend');
                    myChart.setOption(option);
                });
        });
    }
    return {
        restrict: 'E',
        template: '<div style="height:250px" id="oddTrend"></div>',
        replace: true,
        link:link
    };
});

function getOddOption(lengend,dateList,valueList,valueList1,valueList2) {
    var option = {
        backgroundColor: '#3A3949',
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:lengend,
            textStyle:{    //图例文字的样式
                color:'#FBFBFB',
                fontSize:12,
                padding: 10
            }
        },
        calculable : true,
        xAxis : [
            {
                axisLabel:{
                    rotate: 30,//倾斜角度
                    interval:1  //间隔个数
                },
                axisLine:{
                    lineStyle :{
                        color: '#CECECE'
                    }
                },
                type : 'category',
                boundaryGap : false,
                data : dateList
            }
        ],
        yAxis : [
            {
                splitLine: {show: false},
                type : 'value',
                axisLine:{
                    lineStyle :{
                        color: '#CECECE'
                    }
                }
            }
        ],
        series : [
            {
                name:lengend[0],
                type:'line',
                symbol:'none',
                //smooth: 0,
                color:['#DB6065'],
                data:valueList
            },
            {
                name:lengend[1],
                type:'line',
                symbol:'none',
                //smooth: 0,
                color:['#f5f293'],
                data:valueList1
            },
            {
                name:lengend[2],
                type:'line',
                symbol:'none',
                //smooth: 0,
                color:['#15ffd8'],
                data:valueList2
            }
        ]
    };
    return option;
}

/***************************************************/

$("#top_home").on('click',function(){
    console.log("aaa");
});

$("#top_ping").on('click',function(){
    console.log("bbb");
});

$("#top_away").on('click',function(){
    console.log("ccc");
});