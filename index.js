const express = require('express');
const { Server } = require('socket.io');

const app = express();
const http = require('http').Server(app)
const io = new Server(http)

// app.use('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html')
// })
app.get('/server', (req, res) => {
    res.send("Socket server is live")
})
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

const sortByStatus = (arr) => {
    return arr.sort((a, b) => {
        if (!a.isActive) {
            return 1
        } else return -1
    })
}
let users = [];
io.on("connection", (socket) => {
    let auth = socket.handshake.auth
    console.log(auth, 'auth');
    if (auth.token == null || !auth.token) {
        socket.disconnect()
        return
    }
    console.log("socket connected-->>>", socket.id);
    socket.join("Group")
    socket.emit("getmsg", {
        user: socket.id,
        message: "Hey Welcome User"
    })
    users.push({
        id: socket.id,
        isActive: true
    })
    io.to("Group").emit('usersList', {
        users: sortByStatus(users),
        activeUser: socket.id
    })

    socket.on('status', (s) => {
        console.log(s, "id of the socket")
        let id;
        let uer = [...users]
        console.log(uer, 'uer');
        if (uer.length) {
            uer.map((item) => {
                if (item.id == s.userid) {
                    id = item.id
                }
            })
        }
        // console.log(id, "id of now")
        // socket.emit('usersList', {
        //     users: [...new Set(users)],
        //     activeUser: id
        // })

        io.to("Group").emit('usersList', {
            users: sortByStatus(users),
            activeUser: id
        })
    })
    socket.on("newMsg", (soc) => {
        // socket.emit("getmsg",{
        //     user : soc.userid,
        //     message :soc.message,
        //     date : new Date()
        // })

        // group can be set outside of io.on function
        io.to("Group").emit("getmsg", {
            user: soc.userid,
            message: soc.message,
            date: new Date()
        })

    })
    socket.conn.on("close", (reason) => {
        users = users.map((item) => {
            if (item.id == socket.id) {
                return {
                    id: item.id,
                    isActive: false
                }
            }
            return item
        })
        io.to("Group").emit('usersList', {
            users: sortByStatus(users),
            activeUser: socket.id
        })
        console.log("here we arev ", reason);
        // called when the underlying connection is closed
    });
})


http.listen(3000, () => {
    console.log("server is started at 3000");
})