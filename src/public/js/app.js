//이거 바닐라js파일임. import 불가..
//import { submitEnterHandler } from "./controller";

//io() : 백엔드 socket.io와 연결해주는 func
const socket = io();

/* Create & Join Room */
const welcome = document.querySelector("#welcome");
const roomForm = document.querySelector(".create-room-form");
const roomInput = document.querySelector(".create-room-input");
const room = document.querySelector("#room");
room.hidden = true;

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
    return (roomInput.value = "");
};

roomForm.addEventListener("submit", submitEnterHandler);

/* Enter & Disconnect Message */
const addMessage = (text) => {
    const roomChatUl = document.querySelector(".room-chat-ul");
    const li = document.createElement("li");
    li.innerHTML = text;
    roomChatUl.appendChild(li);
};

socket.on("Welcome", (data) => {
    if (!data) {
        return addMessage(`Someone Joined!`);
    }
    return addMessage(`${data} Joined!`);
});

socket.on("bye", (data) => {
    if (!data) {
        return addMessage(`Somone Left the Room!`);
    }
    return addMessage(`${data} Left the Room!`);
});

socket.on("text_send", (data) => {
    if (!data.nickNameData) {
        return addMessage(`Stranger : ${data.textData}`);
    }
    return addMessage(`${data.nickNameData} : ${data.textData}`);
});

/* Message */
const roomChatForm = document.querySelector(".room-chat-form");
const roomChatInput = document.querySelector(".room-chat-input");

const messageSubmitHandler = (e) => {
    e.preventDefault();
    const roomTitle = document.querySelector(".room-title");
    const inputValue = roomChatInput.value;
    const currentRoom = roomTitle.innerHTML;
    socket.emit(
        "send_message",
        { payload: inputValue, targetRoom: currentRoom },
        addMessage
    );
    roomChatInput.value = "";
    return;
};

roomChatForm.addEventListener("submit", messageSubmitHandler);

/* NickName */
const nickNameForm = document.querySelector(".nickname-form");
const nickNameSubmitHandler = (e) => {
    e.preventDefault();
    const nickNameInput = document.querySelector(".nickname-input");
    const inputValue = nickNameInput.value;
    socket.emit("save_nickname", { payload: inputValue });
    return;
};
nickNameForm.addEventListener("submit", nickNameSubmitHandler);

/* Room */

socket.on("room_re_rendering", (data) => {
    const roomUl = document.querySelector(".room-ul");
    const roomData = data.payload;
    //roomaData[0] : name / [1] : size

    console.log("!!!", roomData);

    while (roomUl.hasChildNodes()) {
        roomUl.removeChild(roomUl.firstChild);
    }

    roomData[0].forEach((v, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${v} (${
            roomData[1][i] > 1
                ? `${roomData[1][i]} Penguins`
                : `${roomData[1][i]} Penguin`
        } Here)`;
        roomUl.appendChild(li);
    });
});
