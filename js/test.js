

const socket = new WebSocket("ws://www.risker.shop:8005/websocket");

// document.getElementById("test").innerText = "wss://" + window.location.host + "/bsb/websocket";
// 데이터를 수신 받았을 때
socket.onmessage = async function (e) {
    console.log("[Message] Data from Server : " + e.data);
};

// 에러가 발생했을 때
socket.onerror = function (e) {
    console.log(e);
};