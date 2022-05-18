//이거 바닐라js파일임. import 불가..
//import { submitEnterHandler } from "./controller";

//io() : 백엔드 socket.io와 연결해주는 func
const socket = io();
/* Room */
const welcome = document.querySelector("#welcome");
const roomForm = document.querySelector(".create-room-form");
const roomInput = document.querySelector(".create-room-input");

/* Chat */
const room = document.querySelector("#room");
room.hidden = true;

//let roomName;

const roomToggle = (roomTitleValue) => {
    room.hidden = false;
    welcome.hidden = true;
    const roomTitle = document.querySelector(".room-title");
    roomTitle.innerHTML = `${roomTitleValue}`;
};

const submitEnterHandler = (e) => {
    e.preventDefault();
    const inputValue = roomInput.value;
    //socket.emit("만들 이벤트 이름", {보낼 argument}, callbackFunc)
    socket.emit("enter_room", { payload: inputValue }, roomToggle);
    //roomName = inputValue;
    return (roomInput.value = "");
};

roomForm.addEventListener("submit", submitEnterHandler);
