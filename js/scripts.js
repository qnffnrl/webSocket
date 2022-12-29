/**
 * Present Time
 */
function clock(){                           //Fold Point
    let date = new Date();
    let nowYear = date.getFullYear();
    let month = date.getMonth();
    let clockDate = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // AM or PM 저장 변수
    let amOrPm = "AM";

    // 12시 이상일 시
    if (hours >= 12) {
        amOrPm = "PM";
        hours -= 12;
    }

    //한 자릿수 월, 시, 분, 초 일경우 앞에 0 추가 (1 -> 01)
    let clockDate_str = clockDate < 10 ? "0" + clockDate : clockDate;
    let hours_str = hours < 10 ? "0" + hours : hours;
    let minutes_str = minutes < 10 ? "0" + minutes : minutes;
    let seconds_str = seconds < 10 ? "0" + seconds : seconds;

    $(".bn_date").html(nowYear + "-" + (month+1) + "-" + clockDate_str + " " + //날짜
        hours_str + ":"+minutes_str + ":" + seconds_str + amOrPm);         //시간
}


/**
 *
 * API Call / Parsing
 */
const normalUrl = "http://121.178.2.4:9000/api?api_key=4g21e1e2dd567ws11kk274nbdd3e0s30&type=normal";
const gpsUrl = "http://121.178.2.4:9000/api?api_key=4g21e1e2dd567ws11kk274nbdd3e0s30&type=gps";
function normalApiCall() {                           //Fold Point
    fetch(normalUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            //배터리실 A
            $("#batteryRoom-A-tem").html("온도 : " + data.sector_a[0] + " (℃)");
            $("#batteryRoom-A-hum").html("습도 : " + data.sector_a[1] + " (%)");
            drawChart(data.sector_a[0], data.sector_a[1], "batteryRoom-chart-A");

            //배터리실 B
            $("#batteryRoom-B-tem").html("온도 : " + data.sector_b[0] + " (℃)");
            $("#batteryRoom-B-hum").html("습도 : " + data.sector_b[1] + " (%)");
            drawChart(data.sector_b[0], data.sector_b[1], "batteryRoom-chart-B");

            //배터리실 C
            $("#batteryRoom-C-tem").html("온도 : " + data.sector_c[0] + " (℃)");
            $("#batteryRoom-C-hum").html("습도 : " + data.sector_c[1] + " (%)");
            drawChart(data.sector_c[0], data.sector_c[1], "batteryRoom-chart-C");

            //배터리실 D
            $("#batteryRoom-D-tem").html("온도 : " + data.sector_d[0] + " (℃)");
            $("#batteryRoom-D-hum").html("습도 : " + data.sector_d[1] + " (%)");
            drawChart(data.sector_d[0], data.sector_d[1], "batteryRoom-chart-D");

            //Gas Data
            $("#text-voc").html("voc : " + data.gas['voc']);
            $("#text-nh3").html("nh3 : " + data.gas['nh3']);
            $("#text-co2").html("co2 : " + data.gas['co2']);
            $("#text-co").html("co : " + data.gas['co']);
            drawLineChart(data.gas['voc'], data.gas['nh3'], data.gas['co2'], data.gas['co']);

        }).catch((error) => console.log("error : ", error));
}

function gpsApiCall(){                           //Fold Point
    fetch(gpsUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            map(data['lat'], data['lng']);
        }).catch((error) => console.log("error : ", error));
}

/**
 * Gas Line Chart Draw
 * Param (voc, nh3, co2, co)
 */
let initArray = [[], [], [], []];

function drawLineChart(voc, nh3, co2, co){

    if(initArray.length > 4){
        initArray[0].shift();
        initArray[1].shift();
        initArray[2].shift();
        initArray[3].shift();
    }

    initArray[0].push(voc);
    initArray[1].push(nh3);
    initArray[2].push(co2);
    initArray[3].push(co);

    let dom = document.getElementById('chart-container');
    let myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    let option;

    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['voc', 'nh3', 'co2', 'co']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'qwe']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'voc',
                type: 'line',
                stack: 'Total',
                data: [initArray[0][0], initArray[0][1], initArray[0][2], initArray[0][3], initArray[0][4]]
            },
            {
            name: 'nh3',
            type: 'line',
            stack: 'Total',
            data: [initArray[1][0], initArray[1][1], initArray[1][2], initArray[1][3], initArray[1][4]]
            },
            {
            name: 'co2',
            type: 'line',
            stack: 'Total',
            data: [initArray[2][0], initArray[2][1], initArray[2][2], initArray[2][3], initArray[2][4]]
            },
            {
            name: 'co',
            type: 'line',
            stack: 'Total',
            data: [initArray[3][0], initArray[3][1], initArray[3][2], initArray[3][3], initArray[3][4]]
            },
        ]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);

}

/**
 * Tem, Hum Chart Draw
 * Param (온도, 습도, 태그명)
 */
function drawChart(tem, hum, tagName){                           //Fold Point
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


/**
 * Kakao Map Api Call
 * Param (위도, 경도)
 */
function map(lat, lng){                           //Fold Point
    let mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapOption = {
            center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

    let map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 마커가 표시될 위치입니다
    let markerPosition = new kakao.maps.LatLng(lat, lng);

    // 마커를 생성합니다
    let marker = new kakao.maps.Marker({
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
function setDisplayTheme(self){                           //Fold Point

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
            element.cardHeader[i].style.color = 'white';
            element.cardBody[i].style.backgroundColor = '#6f7180';
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

        for(let i = 0; i <= 4; i++){
            element.cardHeader[i].style.backgroundColor = '#F7F7F7';
            element.cardHeader[i].style.color = 'black';
            element.cardBody[i].style.backgroundColor = '#FFFFFF';
        }
    }
}


/**
 * Tab control
 */
$(document).ready(function(){                           //Fold Point
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


/**
 * Static Resource 모두 로딩 후 Start
 */
$(window).on('load', function(){
    //최초 load
    normalApiCall()
    gpsApiCall()

    setInterval(clock, 1000);         //현재 시간 1초 루프
    setInterval(normalApiCall, 5000); //온습도 api call 5초 루프
    setInterval(gpsApiCall, 30000);   //gps api call 10초 루프
});

