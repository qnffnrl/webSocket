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
            //배터리실 A
            $("#batteryRoom-tem").html("온도 : " + data.rack2[0]['sd1'] + " (℃)");
            $("#batteryRoom-hum").html("습도 : " + data.rack2[0]['sd2'] + " (%)");
            drawChart(data.rack2[0]['sd1'], data.rack2[0]['sd2'], "batteryRoom-chart-A");

            //배터리실 B
            $("#indoor1-tem").html("온도 : " + data.rack3[0]['sd1'] + " (℃)");
            $("#indoor1-hum").html("습도 : " + data.rack3[0]['sd2'] + " (%)");
            drawChart(data.rack3[0]['sd1'], data.rack3[0]['sd2'], "batteryRoom-chart-B");

            //배터리실 C
            $("#indoor2-tem").html("온도 : " + data.rack4[0]['sd1'] + " (℃)");
            $("#indoor2-hum").html("습도 : " + data.rack4[0]['sd2'] + " (%)");
            drawChart(data.rack4[0]['sd1'], data.rack4[0]['sd2'], "batteryRoom-chart-C");

            //배터리실 D
            $("#indoor3-tem").html("온도 : " + data.rack5[0]['sd1'] + " (℃)");
            $("#indoor3-hum").html("습도 : " + data.rack5[0]['sd2'] + " (%)");
            drawChart(data.rack5[0]['sd1'], data.rack5[0]['sd2'], "batteryRoom-chart-D");

        }).catch((error) => console.log("error : ", error));
}

function drawChart(tem, hum, tagName){
    console.warn = console.error = () => {};
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
                    roundCap: true,
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
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapOption = {
            center: new kakao.maps.LatLng(35.2014475, 126.8636426), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커가 표시될 위치입니다
    var markerPosition = new kakao.maps.LatLng(35.2014475, 126.8636426);

// 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        position: markerPosition
    });

// 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

// 마커가 드래그 가능하도록 설정합니다
    marker.setDraggable(true);
}

/**
 *  Change Theme
 *  Dark <-> Light
 */
function setDisplayTheme(self){

    //Target to Change
    let element = {
        body : document.querySelector('body'),
        btn : document.getElementsByClassName('btn')[0],
        title : document.getElementById('title'),
        hr : document.getElementById('main-hr'),
        cardHeader : document.getElementsByClassName('card-header'),
        size4Card : document.getElementById('size-4-card'),
        cardBody : document.getElementsByClassName('card-body'),
    };

    //Change to DarkMode
    if(self.value === 'Dark'){
        element.body.style.backgroundColor = '#2c2c34';
        element.btn.style.backgroundColor = 'white';
        element.btn.style.color = 'black';
        element.title.style.color = 'white';
        element.hr.style.color = 'white';
        element.size4Card.style.backgroundColor = "#2c2c34";
        element.size4Card.style.border = "1px solid #dfdfdf";
        self.value = 'Light';
        $('.tabs a').removeClass('black');
        $('.tabs a').addClass('white');
        $('.text-in-card').removeClass('black');
        $('.text-in-card').addClass('white');
        $('.tab-content').removeClass('whiteBackground');
        $('.tab-content').addClass('darkBackground');


        for(let i = 0; i <= 4; i++){
            element.cardHeader[i].style.backgroundColor = '#51515e';
            element.cardBody[i].style.backgroundColor = '#6f7180';
            element.cardHeader[i].style.color = 'white';
        }
        //Change to LightMode
    } else {
        element.body.style.backgroundColor = 'white';
        element.btn.style.backgroundColor = '#212529';
        element.size4Card.style.border = "1px solid #dfdfdf";
        element.btn.style.color = 'white';
        element.title.style.color = 'black';
        element.hr.style.color = 'black';
        element.size4Card.style.backgroundColor = "white";
        self.value = 'Dark';
        $('.tabs a').removeClass('white');
        $('.tabs a').addClass('black');
        $('.text-in-card').removeClass('white');
        $('.text-in-card').addClass('black');
        $('.tab-content').removeClass('darkBackground');
        $('.tab-content').addClass('whiteBackground');

        for(let i = 0; i <= 3; i++){
            element.cardHeader[i].style.backgroundColor = '#F7F7F7';
            element.cardHeader[i].style.color = 'black';
            element.cardBody[i].style.backgroundColor = '#FFFFFF';
        }
        for(let k = 0; k <= 7; k++){
            element.textInCard[k].style.color = 'black';
        }
    }
}

function init() {
    clock();
    apiCall()

    setInterval(clock, 1000);              //현재 시간 1초 루프
    setInterval(apiCall, 5000);            //API 1초 루프

    map();
    // let socket = new WebSocket("ws://121.178.2.4:5050");
    // socket.onopen = ()=>{
    //     console.log("웹소켓 연결 성공");
    // };
    //
    // socket.onmessage = function (e){
    //     // document.getElementById("test").innerText = e.data;
    //     console.log(e.data);
    // }
    // socket.onclose = function(){
    //     console.log("웹 소켓 연결 종료");
    // }
}



//탭 컨트롤
$(document).ready(function(){
    $('.tabs a').click(function(){
        let tab_id = $(this).attr('data-tab');


        $('.tabs a').removeClass('current');
        $('.tabs a').removeClass('tabs-clicked');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $(this).addClass('tabs-clicked');
        $("#"+tab_id).addClass('current');
    });
});


//Static Resource 모두 로딩 후 Start
$(window).on('load', function(){
    init();
});

