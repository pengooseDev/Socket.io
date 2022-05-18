//프론트의 io()가 실행되면 자동으로 socket 리스트에 추가해줌. sockets.push()
//콘솔 찍어보면 id도 나옴.
export const connectionHandler = (socket) => {
    console.log(`BE : socket connect`);
    socket.on("enter_room", (data, roomToggle) => {
        //방 생성 후 입장.
        const roomName = data.payload;
        socket.join(roomName);
        return roomToggle(roomName);
    });
};
