import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

/* Handler */
const listenHandler = () => {
    console.log(`Listen on ${PORT}!`);
};

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.get("/", (_, res) => res.render("home"));
//app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

/* ConnectionHandler */
const connectionHandler = (socket) => {
    console.log(`BE : socket connect`);

    /* roomCount */
    const countRoomSize = (roomName) => {
        return wsServer.sockets.adapter.rooms.get(roomName)?.size;
    };

    const getRoomData = () => {
        const {
            sockets: {
                adapter: { sids, rooms },
            },
        } = wsServer;

        //room - sids
        const returnRoomNameData = [];
        const returnRoomSizeData = [];
        rooms.forEach((_, i) => {
            if (sids.get(i) === undefined) {
                const roomSizeData = countRoomSize(i);
                returnRoomSizeData.push(roomSizeData);
                returnRoomNameData.push(i);
            }
        });
        const returnData = [returnRoomNameData, returnRoomSizeData];
        return returnData;
    };

    //Socket 접속 전원에게 방 re-rendering
    /* RoomData */
    const newRoomData = getRoomData();
    wsServer.sockets.emit("room_re_rendering", { payload: newRoomData });

    //Enter
    socket.on("enter_room", (data, roomToggle) => {
        //방 생성 후 입장.
        const roomName = data.payload;

        //socket에 roomName이 없으면 새로 생성/ 있으면 참여.
        socket.join(roomName);
        roomToggle(roomName);
        socket.to(roomName).emit("Welcome", socket.nickname);

        //Socket 접속 전원에게 방 re-rendering
        const newRoomData = getRoomData();
        wsServer.sockets.emit("room_re_rendering", {
            payload: newRoomData,
        });
        return;
    });

    //Disconnect
    socket.on("disconnecting", () => {
        socket.rooms.forEach((i) => {
            socket.to(i).emit("bye", socket.nickname);
        });
        //Socket 접속 전원에게 방 re-rendering
        const newRoomData = getRoomData();
        wsServer.sockets.emit("room_re_rendering", { payload: newRoomData });
        return;
    });

    socket.on("send_message", (data, addMessage) => {
        const text = data.payload;
        const room = data.targetRoom;

        //남한테 추가
        socket.to(room).emit("text_send", {
            textData: text,
            nickNameData: socket.nickname,
        });
        //나한테 추가
        if (!socket.nickname) {
            return addMessage(`You : ${text}`);
        }
        return addMessage(`${socket.nickname} : ${text}`);
    });

    socket.on("save_nickname", (data) => {
        const nickname = data.payload;
        //Socket은 기본적으로 Object이기 때문에 session data와 같이 자유자재로 원하는 데이터 저장 가능.
        socket["nickname"] = nickname;
        return;
    });
};

// app을 listen하는게 아닌 httpServer를 listen해야함.
httpServer.listen(PORT, listenHandler);
