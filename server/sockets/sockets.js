const mongoose = require("mongoose");
const diff_match_patch = require("diff-match-patch");
const DMP = new diff_match_patch();
const Edit = mongoose.model("Edit");
let text = {test: "test message"};
module.exports = function(server) {
    const io = require("socket.io")(server);
    io.on("connection", function(socket) {
        console.log("client connected");
        socket.emit("full-text", text["test"]);
        socket.on("delta-submit", function(data) {
            let diff = DMP.diff_main(text["test"], data.content);
            let patch = DMP.patch_make(diff);
            console.log(patch);
            text["test"] = data.content;
            socket.broadcast.emit("delta-update", {patch: patch});
            // Edit.updateOne({_id: data._id}, {content: text});
        });
    });
}