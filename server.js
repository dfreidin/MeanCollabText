const express = require("express");
const app = express();
const session = require("express-session")({
    secret: "swordfish",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: (1000*60*60*6)}
});
app.use(session);
app.use(express.static(__dirname + "/textAngular/dist/textAngular"));
require("./server/config/mongoose");
require("./server/config/routes")(app);
app.all("*", function(req, res) {
    res.sendFile(__dirname + "/textAngular/dist/textAngular/index.html");
});
const server = app.listen(8000);
require("./server/sockets/sockets")(server, session);