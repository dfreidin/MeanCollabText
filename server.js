const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.static(__dirname + "/textAngular/dist/textAngular"));
require("./server/config/mongoose");
const Edit = mongoose.model("Edit");
app.post("/api/new", function(req, res) {
    Edit.create({content: ""}, function(err, data) {
        if(err) {
            res.json({
                message: "Error",
                error: err
            });
        }
        else {
            res.json({
                message: "Success",
                data: data
            });
        }
    });
});
app.all("*", function(req, res) {
    res.sendFile(__dirname + "/textAngular/dist/textAngular/index.html");
});
const server = app.listen(8000);
require("./server/sockets/sockets")(server);