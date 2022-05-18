//프론트의 io()가 실행되면 자동으로 socket 리스트에 추가해줌. sockets.push()

import { emit } from "nodemon";

//콘솔 찍어보면 id도 나옴.
export const connectionHandler = (socket) => {
    console.log(`BE : socket connect`);

    //Enter
    socket.on("enter_room", (data, roomToggle) => {
        //방 생성 후 입장.
        const roomName = data.payload;
        //socket에 roomName이 없으면 새로 생성/ 있으면 참여.
        socket.join(roomName);
        roomToggle(roomName);

        socket.to(roomName).emit("Welcome");
        return;
    });

    //Disconnect
    socket.on("disconnecting", () => {
        socket.rooms.forEach((i) => {
            socket.to(i).emit("bye");
        });
    });

    socket.on("send_message", (data, addMessage) => {
        const text = data.payload;
        const room = data.targetRoom;
        socket.to(room).emit("text_send", text);
        addMessage(`You : ${text}`);
        return;
    });
};
