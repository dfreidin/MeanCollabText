const mongoose = require("mongoose");
const diff_match_patch = require("diff-match-patch");
const DMP = new diff_match_patch();
const Edit = mongoose.model("Edit");
let text = {};
function loop() {
    for(let id of Object.keys(text)) {
        console.log("checking key: ", id);
        Edit.findById(id, function(err, edit) {
            if(edit && edit.content != text[id]) {
                console.log("saving key: ", id);
                edit.content = text[id];
                edit.save();
            }
            else if(edit && (new Date().getTime() - edit.updatedAt.getTime())/60000 > 5) {
                console.log("difference in minutes: ", (new Date().getTime() - edit.updatedAt.getTime())/60000)
                console.log("dropping from local: ", id);
                delete text[id];
            }
        });
    }
}
function loadFromDB(id, callback) {
    Edit.findById(id, function(err, data) {
        if(data) {
            text[data["_id"]] = data["content"];
            callback();
        }
    });
}
function processDelta(socket, data) {
    let diff = DMP.diff_main(text[data.id], data.content);
    let patch = DMP.patch_make(diff);
    text[data.id] = data.content;
    socket.to(data.id).emit("delta-update", {patch: patch});
}
module.exports = function(server) {
    const io = require("socket.io")(server);
    io.on("connection", function(socket) {
        socket.on("connect-file", function(id) {
            socket.join(id);
            if(!text[id]) {
                loadFromDB(id, function() {
                    socket.emit("full-text", text[id]);
                });
            }
            else {
                socket.emit("full-text", text[id]);
            }
        });
        socket.on("delta-submit", function(data) {
            if(!text[data.id]) {
                loadFromDB(data.id, function() {
                    processDelta(socket, data);
                })
            }
            else {
                processDelta(socket, data);
            }
        });
    });
    setInterval(loop, 60000);
}