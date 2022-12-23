/**
 * 현재 시간 출력 부분
 * Present Time
 */
function clock(){
    let date = new Date();
    let nowYear = date.getFullYear();
    let month = date.getMonth();
    let clockDate = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // 오전 or 오후 저장 변수
    let amOrPm = "AM";

    // 12시 이상일 시
    if (hours >= 12) {
        amOrPm = "PM";
        hours -= 12;
    }

    let hours_str = hours < 10 ? "0"+hours : hours;
    let minutes_str = minutes < 10 ? "0"+minutes : minutes;
    let seconds_str = seconds < 10 ? "0"+seconds : seconds;

    if (clockDate < 10) {
        clockDate = "0" + clockDate;
    }

    $(".bn_date").html(nowYear + "-" + (month+1) + "-" + clockDate + " " + //날짜
        amOrPm + hours_str + ":"+minutes_str + ":" + seconds_str);         //시간

}

/**
 * Rack Data
 * API Call / Parsing
 */
const url = "http://121.178.2.4:9000/api?api_key=2a618e17de2f851d74216ddef0256bc1";
function apiCall() {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let rack2 = data.rack2[0]; //배터리실 온ㆍ습도
            let rack3 = data.rack3[0]; //실내 온ㆍ습도 1
            let rack4 = data.rack4[0]; //실내 온ㆍ습도 2
            let rack5 = data.rack5[0]; //실내 온ㆍ습도 3


            $("#batteryRoom-tem").html("온도 : " + rack2['sd1'] + " (℃)");
            $("#batteryRoom-hum").html("습도 : " + rack2['sd2'] + " (%)");
            drawChart(rack2['sd1'], rack2['sd2'], "batteryRoom-chart-A");


            $("#indoor1-tem").html("온도 : " + rack3['sd1'] + " (℃)");
            $("#indoor1-hum").html("습도 : " + rack3['sd2'] + " (%)");
            drawChart(rack3['sd1'], rack3['sd2'], "batteryRoom-chart-B");


            $("#indoor2-tem").html("온도 : " + rack4['sd1'] + " (℃)");
            $("#indoor2-hum").html("습도 : " + rack4['sd2'] + " (%)");
            drawChart(rack4['sd1'], rack4['sd2'], "batteryRoom-chart-C");


            $("#indoor3-tem").html("온도 : " + rack5['sd1'] + " (℃)");
            $("#indoor3-hum").html("습도 : " + rack5['sd2'] + " (%)");
            drawChart(rack5['sd1'], rack5['sd2'], "batteryRoom-chart-D");


        }).catch((error) => console.log("error : ", error));
}

function drawChart(tem, hum, tagName){
    // console.warn = console.error = () => {};
    let chartDom;

    if(tagName === "batteryRoom-chart-A"){
        chartDom = document.getElementById('batteryRoom-chart-A');
    }else if(tagName === "batteryRoom-chart-B"){
        chartDom = document.getElementById('batteryRoom-chart-B');
    }else if(tagName === "batteryRoom-chart-C"){
        chartDom = document.getElementById('batteryRoom-chart-C');
    }else{
        chartDom = document.getElementById('batteryRoom-chart-D');
    }
    let myChart = echarts.init(chartDom);
    let option;

    const gaugeData = [
        {
            value: 20,
            name: "Tem('C)",
            title: {
                offsetCenter: ['-35%', '70%']
            },
            detail: {
                offsetCenter: ['-40%', '95%']
            }
        },
        {
            value: 40,
            name: 'Hum(%)',
            title: {
                offsetCenter: ['35%', '70%']
            },
            detail: {
                offsetCenter: ['40%', '95%']
            }
        },
    ];
    option = {
        series: [
            {
                type: 'gauge',
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 18,
                    itemStyle: {
                        color: '#FAC858'
                    }
                },
                pointer: {
                    width: 8,
                    length: '70%',
                    offsetCenter: [0, '8%']
                },
                progress: {
                    show: true,
                    overlap: true,
                    roundCap: true
                },
                axisLine: {
                    roundCap: true
                },
                data: gaugeData,
                title: {
                    fontSize: 10
                },
                detail: {
                    width: 40,
                    height: 14,
                    fontSize: 12,
                    color: '#fff',
                    backgroundColor: 'inherit',
                    borderRadius: 3,
                    formatter: '{value}'
                }
            }
        ]
    };

    gaugeData[0].value = tem;
    gaugeData[1].value = hum;
    myChart.setOption({
        series: [
            {
                data: gaugeData
            }
        ]
    });

    option && myChart.setOption(option);

    //차트 크기 반응형 핸들러 -start
    resizeHandler();
    function resizeHandler () {
        option && myChart.setOption(option);
    }
    if (window.addEventListener) {
        window.addEventListener('resize', resizeHandler, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onresize', resizeHandler);
    }
    //차트 크기 반응형 핸들러 -end

}


function map(){
    var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    };

    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
}

function init() {
    clock();
    apiCall()

    setInterval(clock, 1000);              //현재 시간 1초 루프
    setInterval(apiCall, 5000);            //API 1초 루프

    map();
    // let socket = new WebSocket("ws://49.238.167.98:8005");
    // socket.onopen = ()=>{
    //     console.log("웹소켓 연결 성공");
    // };
    //
    // socket.onmessage = function (e){
    //     document.getElementById("test").innerText = e.data;
    // }
    // socket.onclose = function(){
    //     console.log("웹 소켓 연결 종료");
    // }
}

//Static Resource 모두 로딩 후 Start
$(window).on('load', function(){
    init();
});


//탭 컨트롤
$(document).ready(function(){
    $('.tabs a').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('.tabs a').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
    });
});

