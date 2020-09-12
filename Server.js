const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(require('cors')())

const all_messages = []

// socket.adapter.rooms show list room
io.on("connection", function (socket) {
    socket.rooms = [];

    //When client select a room
    socket.on("select-room", function (data) {
        socket.IN = data;
        console.log(socket.IN)
        let rooms_in = [];
        all_messages.forEach(function (r) {
            if (r.id === socket.IN) rooms_in.push(r);
        })
        socket.emit("show-message", {mes: rooms_in, room: socket.IN});
    });

    socket.on("create-room", function (data) {
        socket.join(data);
        socket.IN = data;
        socket.rooms.push(data);
        console.log(socket.IN);
        let rooms_in = [];
        for (r in socket.adapter.rooms) {
            rooms_in.push(r);
        }
        io.sockets.emit("server-send-rooms", rooms_in);
        socket.emit("server-send-room-socket", data);
    });

    socket.on("user-chat", function (data) {
        let message = {
            "id": socket.IN,
            "message": data
        };
        all_messages.push(message);
        console.log(all_messages)
        let rooms_in = [];
        all_messages.forEach(function (r) {
            if (r.id === socket.IN) rooms_in.push(r);
        })
        io.sockets.in(socket.IN).emit("server-chat", {mes: rooms_in, room: socket.IN});
    });

});

app.get("/", function (req, res) {
    res.render("index");
});

server.listen(4000, () => console.log("Server is running on port 4000"));
