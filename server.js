const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const app = express()
const PORT = process.env.PORT || 8000;
const db = require('./queries')
const { emit } = require("process");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

//parses requests for fetch
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

// CRUD Stuff

app.get("/messages", db.getMessages);
app.post("/messages", db.createMessage);


// Socket Stuff

// sends out the 10 most recent messages from recent to old
const emitMostRecentMessges = () => {
    db.getSocketMessages().then((result) => io.emit("chat message", result)).catch(console.log);
};
// connects, creates message, and emits top 10 messages
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("chat message", (msg) => {
        db.createSocketMessage(JSON.parse(msg))
            .then((_) => {
                emitMostRecentMessges();
            })
            .catch((err) => io.emit(err));
    });

    // close event when user disconnects from app
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// Displays in terminal which port the socketPort is running on
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

